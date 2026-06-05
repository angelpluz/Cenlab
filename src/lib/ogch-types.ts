import type { OgchCooldownStatus } from "@/lib/ogch";

export type ApiCooldownStatus = OgchCooldownStatus | "on_cooldown" | "ready_soon";

export type ApiProgressToNextLevel = {
  current: number;
  required: number | null;
  percentage: number;
};

export type OgchCharacterProgress = {
  id: string;
  name: string;
  job: string;
  baseLevel: number;
  clearCount: number;
  ogchLevel: number;
  expReward: string;
  nextLevelRequirement: number | null;
  progressToNextLevel: ApiProgressToNextLevel;
  lastCompletedAt: string | null;
  nextAvailableAt: string | null;
  cooldownStatus: ApiCooldownStatus;
  remainingCooldownSeconds: number;
};

export type OgchCharactersApiResponse = {
  success: boolean;
  data: OgchCharacterProgress[];
  message?: string;
};

export type OgchMutationApiResponse = {
  success: boolean;
  data?: OgchCharacterProgress;
  character?: OgchCharacterProgress;
  message?: string;
  remainingCooldownSeconds?: number;
};

export type OgchApiErrorResponse = {
  success?: boolean;
  message?: string;
  remainingCooldownSeconds?: number;
};

export type ManualAdjustPayload = {
  characterId: string;
  clearCount: number;
  lastCompletedAt: string | null;
  nextAvailableAt: string | null;
};
