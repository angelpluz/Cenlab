import type {
  SakrayApiErrorResponse,
  SakrayManualAdjustPayload,
  SakrayState,
  SakrayStateApiResponse,
} from "@/lib/sakray-types";

export const SAKRAY_API_BASE_URL = "/api/sakray";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json().catch(() => ({}))) as T;
}

async function fetchSakrayApi(path: string, init?: RequestInit, baseUrl = SAKRAY_API_BASE_URL): Promise<SakrayState> {
  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("เชื่อมต่อฐานข้อมูลดันเจียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
  }

  const payload = await readJson<SakrayStateApiResponse & SakrayApiErrorResponse>(response);

  if (!response.ok || payload.success === false || !payload.data) {
    const cooldownText =
      typeof payload.remainingCooldownSeconds === "number"
        ? ` (${payload.remainingCooldownSeconds}s remaining)`
        : "";
    throw new Error(`${payload.message ?? "Dungeon API request failed."}${cooldownText}`);
  }

  return payload.data;
}

export function createDailyDungeonApi(baseUrl: string) {
  const post = (path: string, payload: unknown) => fetchSakrayApi(path, {
    method: "POST",
    body: JSON.stringify(payload),
  }, baseUrl);

  return {
    getState: () => fetchSakrayApi("/state", undefined, baseUrl),
    completeRun: (characterId: string) => post("/complete", { characterId }),
    saveMapping: (windhawkId: string, bishopId: string | null) => post("/mapping", { windhawkId, bishopId }),
    manualAdjust: (payload: SakrayManualAdjustPayload) => post("/manual-adjust", payload),
    resetCooldown: (characterId: string) => post("/reset-cooldown", { characterId }),
  };
}

export function getSakrayState(): Promise<SakrayState> {
  return fetchSakrayApi("/state");
}

export function completeSakrayRun(characterId: string): Promise<SakrayState> {
  return fetchSakrayApi("/complete", {
    method: "POST",
    body: JSON.stringify({ characterId }),
  });
}

export function saveSakrayMapping(windhawkId: string, bishopId: string | null): Promise<SakrayState> {
  return fetchSakrayApi("/mapping", {
    method: "POST",
    body: JSON.stringify({ windhawkId, bishopId }),
  });
}

export function manualAdjustSakrayProgress(payload: SakrayManualAdjustPayload): Promise<SakrayState> {
  return fetchSakrayApi("/manual-adjust", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetSakrayCooldown(characterId: string): Promise<SakrayState> {
  return fetchSakrayApi("/reset-cooldown", {
    method: "POST",
    body: JSON.stringify({ characterId }),
  });
}
