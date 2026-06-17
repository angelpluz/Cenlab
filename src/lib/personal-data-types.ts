export type PersonalDataGroupId = "main" | "alp" | "dancer" | "friends";

export type PersonalCharacterProfile = {
  id: string;
  name: string;
  level: number;
  groupId: PersonalDataGroupId;
  groupLabel: string;
  note: string | null;
  aliases: string[];
};
