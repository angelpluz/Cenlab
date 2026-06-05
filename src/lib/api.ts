import type {
  ManualAdjustPayload,
  OgchApiErrorResponse,
  OgchCharacterProgress,
  OgchCharactersApiResponse,
  OgchMutationApiResponse,
} from "@/lib/ogch-types";

export const API_BASE_URL = "/api/ogch";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json().catch(() => ({}))) as T;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(`Could not reach OGCH API at ${API_BASE_URL}.`);
  }

  const data = await readJson<T & OgchApiErrorResponse>(response);

  if (!response.ok || data.success === false) {
    const cooldownText =
      typeof data.remainingCooldownSeconds === "number"
        ? ` (${data.remainingCooldownSeconds}s remaining)`
        : "";
    throw new Error(`${data.message ?? "OGCH API request failed."}${cooldownText}`);
  }

  return data;
}

export async function getOgchCharacters(): Promise<OgchCharacterProgress[]> {
  const response = await fetchApi<OgchCharactersApiResponse>("/characters", {
    cache: "no-store",
  });

  return response.data;
}

export async function completeOgchRun(characterId: string): Promise<OgchMutationApiResponse> {
  return fetchApi<OgchMutationApiResponse>("/complete", {
    method: "POST",
    body: JSON.stringify({ characterId }),
  });
}

export async function manualAdjustOgchProgress(payload: ManualAdjustPayload): Promise<OgchMutationApiResponse> {
  return fetchApi<OgchMutationApiResponse>("/manual-adjust", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetOgchCooldown(characterId: string): Promise<OgchMutationApiResponse> {
  return fetchApi<OgchMutationApiResponse>("/reset-cooldown", {
    method: "POST",
    body: JSON.stringify({ characterId }),
  });
}
