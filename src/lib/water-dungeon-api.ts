import type {
  WaterDungeonApiErrorResponse,
  WaterDungeonCharacter,
  WaterDungeonCharactersApiResponse,
  WaterDungeonManualAdjustPayload,
  WaterDungeonMutationApiResponse,
} from "@/lib/water-dungeon-types";

export const WATER_DUNGEON_API_BASE_URL = "/api/water-dungeon";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json().catch(() => ({}))) as T;
}

async function fetchWaterDungeonApi<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${WATER_DUNGEON_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(`Could not reach Water Dungeon API at ${WATER_DUNGEON_API_BASE_URL}.`);
  }

  const data = await readJson<T & WaterDungeonApiErrorResponse>(response);

  if (!response.ok || data.success === false) {
    const cooldownText =
      typeof data.remainingCooldownSeconds === "number"
        ? ` (${data.remainingCooldownSeconds}s remaining)`
        : "";
    throw new Error(`${data.message ?? "Water Dungeon API request failed."}${cooldownText}`);
  }

  return data;
}

export async function getWaterDungeonCharacters(): Promise<WaterDungeonCharacter[]> {
  const response = await fetchWaterDungeonApi<WaterDungeonCharactersApiResponse>("/characters", {
    cache: "no-store",
  });

  return response.data;
}

export async function completeWaterDungeonRun(characterId: string): Promise<WaterDungeonMutationApiResponse> {
  return fetchWaterDungeonApi<WaterDungeonMutationApiResponse>("/complete", {
    method: "POST",
    body: JSON.stringify({ characterId }),
  });
}

export async function manualAdjustWaterDungeonProgress(
  payload: WaterDungeonManualAdjustPayload
): Promise<WaterDungeonMutationApiResponse> {
  return fetchWaterDungeonApi<WaterDungeonMutationApiResponse>("/manual-adjust", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetWaterDungeonCooldown(characterId: string): Promise<WaterDungeonMutationApiResponse> {
  return fetchWaterDungeonApi<WaterDungeonMutationApiResponse>("/reset-cooldown", {
    method: "POST",
    body: JSON.stringify({ characterId }),
  });
}
