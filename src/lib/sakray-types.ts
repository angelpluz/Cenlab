import type { ApiCooldownStatus } from "@/lib/ogch-types";

export type SakrayRole = "windhawk" | "bishop";

export type SakrayCharacter = {
  id: string;
  name: string;
  job: string;
  baseLevel: number;
  role: SakrayRole;
  clearCount: number;
  lastCompletedAt: string | null;
  nextAvailableAt: string | null;
  cooldownStatus: ApiCooldownStatus;
  remainingCooldownSeconds: number;
};

export type SakrayMappings = Record<string, string>;

export type SakrayState = {
  characters: SakrayCharacter[];
  mappings: SakrayMappings;
};

export type SakrayStateApiResponse = {
  success: boolean;
  data: SakrayState;
  message?: string;
};

export type SakrayApiErrorResponse = {
  success?: boolean;
  message?: string;
  remainingCooldownSeconds?: number;
};

export type SakrayManualAdjustPayload = {
  characterId: string;
  clearCount: number;
  lastCompletedAt: string | null;
  nextAvailableAt: string | null;
};
