export type WaterDungeonStatus = "available" | "onCooldown" | "readySoon" | "blocked";

export type WaterDungeonGroupId = "main" | "alp" | "dancer" | "friends";

export type WaterDungeonCharacter = {
  id: string;
  name: string;
  level: number;
  groupId: WaterDungeonGroupId;
  groupLabel: string;
  clearCount: number;
  lastCompletedAt: string | null;
  nextAvailableAt: string | null;
  note: string | null;
  status: WaterDungeonStatus;
};

export type WaterDungeonPartyMember = {
  characterId: string;
};

export type WaterDungeonPartyMemberDisplay = WaterDungeonPartyMember & {
  key: string;
  name: string;
  level: number;
  groupLabel: string;
};

export type WaterDungeonCharactersApiResponse = {
  success: boolean;
  data: WaterDungeonCharacter[];
  message?: string;
};

export type WaterDungeonMutationApiResponse = {
  success: boolean;
  data?: WaterDungeonCharacter;
  character?: WaterDungeonCharacter;
  message?: string;
  remainingCooldownSeconds?: number;
};

export type WaterDungeonApiErrorResponse = {
  success?: boolean;
  message?: string;
  remainingCooldownSeconds?: number;
};

export type WaterDungeonManualAdjustPayload = {
  characterId: string;
  clearCount: number;
  lastCompletedAt: string | null;
  nextAvailableAt: string | null;
  note: string | null;
  status: WaterDungeonStatus;
};
