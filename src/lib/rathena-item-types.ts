export type RathenaItemCategory =
  | "weapon"
  | "armor"
  | "card"
  | "consumable"
  | "usable"
  | "ammo"
  | "costume"
  | "etc"
  | "shadow";

export type RathenaItemSlot =
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
  | "costume-head-top"
  | "costume-head-mid"
  | "costume-head-low"
  | "costume-garment"
  | "shadow-weapon"
  | "shadow-armor"
  | "shadow-shield"
  | "shadow-garment"
  | "shadow-shoes"
  | "shadow-earring"
  | "shadow-pendant"
  | "none";

export type RathenaItemBonusKey =
  | "str"
  | "agi"
  | "vit"
  | "int"
  | "dex"
  | "luk"
  | "pow"
  | "sta"
  | "wis"
  | "spl"
  | "con"
  | "crt"
  | "weaponAtk"
  | "equipAtk"
  | "atkPercent"
  | "equipMatk"
  | "matkPercent"
  | "hitBonus"
  | "fleeBonus"
  | "critBonus"
  | "defBonus"
  | "mdefBonus"
  | "pAtkBonus"
  | "sMatkBonus"
  | "rangedDamagePercent"
  | "meleeDamagePercent"
  | "criticalDamagePercent"
  | "variableCastPercent"
  | "aspdPercent";

export type RathenaItemBonuses = Partial<Record<RathenaItemBonusKey, number>>;

export type RathenaItemGrade = "D" | "C" | "B" | "A";

export type RathenaItemBonusRule = {
  minRefine?: number;
  minGrade?: RathenaItemGrade;
  bonuses: RathenaItemBonuses;
};

export type RathenaCalculatorItem = {
  id: number;
  aegisName: string;
  name: string;
  aliases?: string[];
  category: RathenaItemCategory;
  itemType?: string;
  subType?: string;
  itemSubTypeId?: number;
  slots: RathenaItemSlot[];
  cardSlots?: number;
  equipLevel?: number;
  weight?: number;
  attack?: number;
  magicAttack?: number;
  defense?: number;
  weaponLevel?: number;
  armorLevel?: number;
  refineable?: boolean;
  gradable?: boolean;
  usableClass?: string[];
  unusableClass?: string[];
  description?: string;
  propertyAtk?: string;
  bonuses?: RathenaItemBonuses;
  bonusRules?: RathenaItemBonusRule[];
  scriptPreview?: string[];
};

export type RathenaItemPayload = {
  generatedAt: string;
  source: string;
  sourceUrls: string[];
  counts: Record<string, { read: number; kept: number }>;
  items: RathenaCalculatorItem[];
};
