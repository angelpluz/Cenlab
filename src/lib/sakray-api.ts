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

async function fetchSakrayApi(path: string, init?: RequestInit): Promise<SakrayState> {
  let response: Response;

  try {
    response = await fetch(`${SAKRAY_API_BASE_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("เชื่อมต่อฐานข้อมูล Sakray ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
  }

  const payload = await readJson<SakrayStateApiResponse & SakrayApiErrorResponse>(response);

  if (!response.ok || payload.success === false || !payload.data) {
    const cooldownText =
      typeof payload.remainingCooldownSeconds === "number"
        ? ` (${payload.remainingCooldownSeconds}s remaining)`
        : "";
    throw new Error(`${payload.message ?? "Sakray API request failed."}${cooldownText}`);
  }

  return payload.data;
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
