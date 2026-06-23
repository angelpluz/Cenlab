export type CodexEntryType = "item" | "monster";

export type ItemCategory =
  | "weapon"
  | "armor"
  | "card"
  | "consumable"
  | "ammo"
  | "usable"
  | "etc"
  | "shadow";

export type ItemSlot =
  | "head-top"
  | "head-mid"
  | "head-low"
  | "armor"
  | "shield"
  | "garment"
  | "shoes"
  | "accessory"
  | "weapon"
  | "ammo"
  | "card"
  | "shadow-weapon"
  | "shadow-armor"
  | "shadow-shield"
  | "shadow-garment"
  | "shadow-shoes"
  | "shadow-accessory"
  | "none";

export type MonsterRace =
  | "angel"
  | "brute"
  | "demihuman"
  | "demon"
  | "dragon"
  | "fish"
  | "formless"
  | "insect"
  | "plant"
  | "undead";

export type MonsterElement =
  | "neutral"
  | "water"
  | "earth"
  | "fire"
  | "wind"
  | "poison"
  | "holy"
  | "shadow"
  | "ghost"
  | "undead";

export type MonsterSize = "small" | "medium" | "large";

export type ExternalIds = {
  divinePride?: number;
  rAthena?: string;
};

export type CodexTag =
  | "central-lab"
  | "ogch"
  | "water-dungeon"
  | "boss"
  | "mvp"
  | "drop"
  | "quest"
  | "equipment"
  | "buff"
  | "popular";

export type CodexItem = {
  id: string;
  type: "item";
  name: string;
  category: ItemCategory;
  slot?: ItemSlot;
  itemType?: string;
  description: string;
  effects?: string[];
  weight?: number;
  equipLevel?: number;
  refineable?: boolean;
  slots?: number;
  sources?: string[];
  tags: CodexTag[];
  externalIds?: ExternalIds;
};

export type MonsterDrop = {
  itemId: string;
  itemName: string;
  rate?: string;
};

export type CodexMonster = {
  id: string;
  type: "monster";
  name: string;
  level: number;
  race: MonsterRace;
  element: MonsterElement;
  elementLevel?: number;
  size: MonsterSize;
  hp?: number;
  baseExp?: number;
  jobExp?: number;
  drops?: MonsterDrop[];
  locations?: string[];
  isMvp?: boolean;
  isMiniBoss?: boolean;
  tags: CodexTag[];
  externalIds?: ExternalIds;
};

export type CodexEntry = CodexItem | CodexMonster;

export type CodexFilter = {
  query: string;
  tab: CodexEntryType;
  itemCategory?: ItemCategory | "all";
  monsterRace?: MonsterRace | "all";
  monsterElement?: MonsterElement | "all";
  monsterSize?: MonsterSize | "all";
  tags: CodexTag[];
};
