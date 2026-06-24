"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  PERSONAL_DATA_EVENT,
  PERSONAL_DATA_STORAGE_KEY,
  readPersonalDataProfiles,
} from "@/lib/personal-data";
import type { PersonalCharacterProfile } from "@/lib/personal-data-types";
import type {
  RathenaCalculatorItem,
  RathenaItemBonuses,
  RathenaItemBonusKey,
  RathenaItemCategory,
  RathenaItemGrade,
  RathenaItemSlot,
} from "@/lib/rathena-item-types";

const STORAGE_KEY = "cenlab.stat-calculator.v1";

const PRIMARY_STAT_FIELDS = [
  { key: "str", label: "STR" },
  { key: "agi", label: "AGI" },
  { key: "vit", label: "VIT" },
  { key: "int", label: "INT" },
  { key: "dex", label: "DEX" },
  { key: "luk", label: "LUK" },
] as const;

const TRAIT_STAT_FIELDS = [
  { key: "pow", label: "POW" },
  { key: "sta", label: "STA" },
  { key: "wis", label: "WIS" },
  { key: "spl", label: "SPL" },
  { key: "con", label: "CON" },
  { key: "crt", label: "CRT" },
] as const;

const MODIFIER_FIELDS = [
  { key: "weaponAtk", label: "Weapon ATK", max: 2000 },
  { key: "equipAtk", label: "Equip ATK", max: 2000 },
  { key: "atkPercent", label: "ATK %", max: 500 },
  { key: "equipMatk", label: "Equip MATK", max: 2000 },
  { key: "matkPercent", label: "MATK %", max: 500 },
  { key: "hitBonus", label: "HIT +", max: 2000 },
  { key: "fleeBonus", label: "FLEE +", max: 2000 },
  { key: "critBonus", label: "CRIT +", max: 500 },
  { key: "defBonus", label: "DEF +", max: 5000 },
  { key: "mdefBonus", label: "MDEF +", max: 5000 },
  { key: "pAtkBonus", label: "P.ATK +", max: 500 },
  { key: "sMatkBonus", label: "S.MATK +", max: 500 },
] as const;

const ITEM_CATEGORIES: { value: RathenaItemCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "weapon", label: "Weapon" },
  { value: "armor", label: "Armor" },
  { value: "card", label: "Card" },
  { value: "costume", label: "Costume" },
  { value: "shadow", label: "Shadow" },
  { value: "ammo", label: "Ammo" },
  { value: "consumable", label: "Consumable" },
  { value: "usable", label: "Usable" },
  { value: "etc", label: "Etc" },
];

const ITEM_BONUS_LABELS: Record<RathenaItemBonusKey, string> = {
  str: "STR",
  agi: "AGI",
  vit: "VIT",
  int: "INT",
  dex: "DEX",
  luk: "LUK",
  pow: "POW",
  sta: "STA",
  wis: "WIS",
  spl: "SPL",
  con: "CON",
  crt: "CRT",
  weaponAtk: "Weapon ATK",
  equipAtk: "Equip ATK",
  atkPercent: "ATK %",
  equipMatk: "Equip MATK",
  matkPercent: "MATK %",
  hitBonus: "HIT",
  fleeBonus: "FLEE",
  critBonus: "CRIT",
  defBonus: "DEF",
  mdefBonus: "MDEF",
  pAtkBonus: "P.ATK",
  sMatkBonus: "S.MATK",
  rangedDamagePercent: "Ranged %",
  meleeDamagePercent: "Melee %",
  criticalDamagePercent: "Crit Dmg %",
  variableCastPercent: "VCT %",
  aspdPercent: "ASPD %",
};

const PERCENT_BONUS_KEYS = new Set<RathenaItemBonusKey>([
  "atkPercent",
  "matkPercent",
  "rangedDamagePercent",
  "meleeDamagePercent",
  "criticalDamagePercent",
  "variableCastPercent",
  "aspdPercent",
]);

type PrimaryStatKey = (typeof PRIMARY_STAT_FIELDS)[number]["key"];
type TraitStatKey = (typeof TRAIT_STAT_FIELDS)[number]["key"];
type ModifierKey = (typeof MODIFIER_FIELDS)[number]["key"];
type GearGrade = "none" | RathenaItemGrade;
type ElementProperty = "Neutral" | "Water" | "Earth" | "Fire" | "Wind" | "Poison" | "Holy" | "Dark" | "Ghost" | "Undead";

const ELEMENT_OPTIONS: ElementProperty[] = [
  "Neutral",
  "Water",
  "Earth",
  "Fire",
  "Wind",
  "Poison",
  "Holy",
  "Dark",
  "Ghost",
  "Undead",
];

const DEFAULT_SKILL_OPTIONS = ["Crescive Bolt Lv10", "Gale Storm Lv10", "Hawk Rush Lv10", "Normal Attack"];

const CHARACTER_CLASS_OPTIONS = [
  "Windhawk",
  "DragonKnight",
  "ArchMage",
  "Cardinal",
  "Meister",
  "ShadowCross",
  "Inquisitor",
  "ImperialGuard",
  "Biolo",
  "AbyssChaser",
  "ElementalMaster",
  "Troubadour",
  "Trouvere",
  "NightWatch",
  "Shinkiro",
  "Shiranui",
  "SkyEmperor",
  "SoulAscetic",
  "SpiritHandler",
  "HyperNovice",
] as const;

type CharacterClass = (typeof CHARACTER_CLASS_OPTIONS)[number];

const CUSTOM_OPTION_KEY_MAP: Record<string, RathenaItemBonusKey> = {
  atk: "equipAtk",
  equip_atk: "equipAtk",
  weapon_atk: "weaponAtk",
  weaponatk: "weaponAtk",
  atk_rate: "atkPercent",
  atkpercent: "atkPercent",
  matk: "equipMatk",
  matk_rate: "matkPercent",
  matkpercent: "matkPercent",
  hit: "hitBonus",
  flee: "fleeBonus",
  crit: "critBonus",
  cri: "critBonus",
  def: "defBonus",
  mdef: "mdefBonus",
  p_atk: "pAtkBonus",
  patk: "pAtkBonus",
  s_matk: "sMatkBonus",
  smatk: "sMatkBonus",
  range: "rangedDamagePercent",
  ranged: "rangedDamagePercent",
  ranged_damage: "rangedDamagePercent",
  melee: "meleeDamagePercent",
  melee_damage: "meleeDamagePercent",
  crit_damage: "criticalDamagePercent",
  critdmg: "criticalDamagePercent",
  vct: "variableCastPercent",
  variable_cast: "variableCastPercent",
  aspd: "aspdPercent",
};

const GEAR_GRADE_OPTIONS: { value: GearGrade; label: string }[] = [
  { value: "none", label: "ungrade" },
  { value: "D", label: "Grade D" },
  { value: "C", label: "Grade C" },
  { value: "B", label: "Grade B" },
  { value: "A", label: "Grade A" },
];

const GRADE_RANK: Record<GearGrade, number> = {
  none: 0,
  D: 1,
  C: 2,
  B: 3,
  A: 4,
};

const GEAR_SLOT_DEFS = [
  {
    key: "weapon",
    label: "Weapon",
    category: "weapon",
    slots: ["weapon"],
    optionLabels: ["Card 1", "Card 2", "Enchant 1", "Enchant 2", "Enchant 3", "Enchant 4"],
    refineable: true,
    gradable: true,
  },
  {
    key: "headTop",
    label: "Head Top",
    category: "armor",
    slots: ["head-top"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2", "Enchant 3"],
    refineable: true,
    gradable: true,
  },
  {
    key: "headMid",
    label: "Head Mid",
    category: "armor",
    slots: ["head-mid"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2"],
    refineable: false,
    gradable: false,
  },
  {
    key: "headLow",
    label: "Head Low",
    category: "armor",
    slots: ["head-low"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2"],
    refineable: false,
    gradable: false,
  },
  {
    key: "armor",
    label: "Armor",
    category: "armor",
    slots: ["armor"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2", "Enchant 3"],
    refineable: true,
    gradable: true,
  },
  {
    key: "garment",
    label: "Garment",
    category: "armor",
    slots: ["garment"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2", "Enchant 3"],
    refineable: true,
    gradable: true,
  },
  {
    key: "shoes",
    label: "Shoes",
    category: "armor",
    slots: ["shoes"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2", "Enchant 3"],
    refineable: true,
    gradable: true,
  },
  {
    key: "accessoryRight",
    label: "Right Accessory",
    category: "armor",
    slots: ["accessory"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2"],
    refineable: false,
    gradable: false,
  },
  {
    key: "accessoryLeft",
    label: "Left Accessory",
    category: "armor",
    slots: ["accessory"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2"],
    refineable: false,
    gradable: false,
  },
  {
    key: "shield",
    label: "Shield",
    category: "armor",
    slots: ["shield"],
    optionLabels: ["Card", "Enchant 1", "Enchant 2"],
    refineable: true,
    gradable: true,
  },
  {
    key: "ammo",
    label: "Ammo",
    category: "ammo",
    slots: ["ammo"],
    optionLabels: ["Option 1", "Option 2"],
    refineable: false,
    gradable: false,
  },
  {
    key: "costumeUpper",
    label: "Costume Upper",
    category: "costume",
    slots: ["costume-head-top"],
    optionLabels: ["Enchant Upper"],
    refineable: false,
    gradable: false,
  },
  {
    key: "costumeMiddle",
    label: "Costume Middle",
    category: "costume",
    slots: ["costume-head-mid"],
    optionLabels: ["Enchant Middle"],
    refineable: false,
    gradable: false,
  },
  {
    key: "costumeLower",
    label: "Costume Lower",
    category: "costume",
    slots: ["costume-head-low"],
    optionLabels: ["Enchant Lower"],
    refineable: false,
    gradable: false,
  },
  {
    key: "costumeGarment",
    label: "Costume Garment",
    category: "costume",
    slots: ["costume-garment"],
    optionLabels: ["Enchant 1", "Enchant 2", "Enchant 3", "Enchant 4"],
    refineable: false,
    gradable: false,
  },
  {
    key: "shadowWeapon",
    label: "Shadow Weapon",
    category: "shadow",
    slots: ["shadow-weapon"],
    optionLabels: [],
    refineable: true,
    gradable: false,
  },
  {
    key: "shadowArmor",
    label: "Shadow Armor",
    category: "shadow",
    slots: ["shadow-armor"],
    optionLabels: [],
    refineable: true,
    gradable: false,
  },
  {
    key: "shadowShield",
    label: "Shadow Shield",
    category: "shadow",
    slots: ["shadow-shield"],
    optionLabels: [],
    refineable: true,
    gradable: false,
  },
  {
    key: "shadowShoes",
    label: "Shadow Shoes",
    category: "shadow",
    slots: ["shadow-shoes"],
    optionLabels: [],
    refineable: true,
    gradable: false,
  },
  {
    key: "shadowEarring",
    label: "Shadow Earring",
    category: "shadow",
    slots: ["shadow-earring"],
    optionLabels: [],
    refineable: true,
    gradable: false,
  },
  {
    key: "shadowPendant",
    label: "Shadow Pendant",
    category: "shadow",
    slots: ["shadow-pendant"],
    optionLabels: [],
    refineable: true,
    gradable: false,
  },
] as const;

type GearSlotDef = (typeof GEAR_SLOT_DEFS)[number];
type GearSlotKey = GearSlotDef["key"];

type GearSlotState = {
  itemId: number | null;
  refine: number;
  grade: GearGrade;
  optionIds: (number | null)[];
};

type GearLoadout = Record<GearSlotKey, GearSlotState>;

type ConfiguredItem = {
  grade: GearGrade;
  item: RathenaCalculatorItem;
  refine: number;
  sourceLabel: string;
};

type PickerTarget =
  | { kind: "main"; slotKey: GearSlotKey }
  | { kind: "option"; optionIndex: number; slotKey: GearSlotKey };

const SUMMARY_GEAR_FIELD_MAP: Partial<
  Record<
    GearSlotKey,
    {
      gradeField?: string;
      itemField: string;
      optionFields?: string[];
      refineField?: string;
    }
  >
> = {
  weapon: {
    itemField: "weapon",
    refineField: "weaponRefine",
    gradeField: "weaponGrade",
    optionFields: ["weaponCard1", "weaponCard2", "weaponEnchant1", "weaponEnchant2", "weaponEnchant3", "weaponEnchant4"],
  },
  headTop: {
    itemField: "headUpper",
    refineField: "headUpperRefine",
    gradeField: "headUpperGrade",
    optionFields: ["headUpperCard", "headUpperEnchant1", "headUpperEnchant2", "headUpperEnchant3"],
  },
  headMid: {
    itemField: "headMiddle",
    optionFields: ["headMiddleCard", "headMiddleEnchant1", "headMiddleEnchant2"],
  },
  headLow: {
    itemField: "headLower",
    optionFields: ["headLowerCard", "headLowerEnchant1", "headLowerEnchant2"],
  },
  armor: {
    itemField: "armor",
    refineField: "armorRefine",
    gradeField: "armorGrade",
    optionFields: ["armorCard", "armorEnchant1", "armorEnchant2", "armorEnchant3"],
  },
  garment: {
    itemField: "garment",
    refineField: "garmentRefine",
    gradeField: "garmentGrade",
    optionFields: ["garmentCard", "garmentEnchant1", "garmentEnchant2", "garmentEnchant3"],
  },
  shoes: {
    itemField: "boot",
    refineField: "bootRefine",
    gradeField: "bootGrade",
    optionFields: ["bootCard", "bootEnchant1", "bootEnchant2", "bootEnchant3"],
  },
  accessoryRight: {
    itemField: "accRight",
    optionFields: ["accRightCard", "accRightEnchant1", "accRightEnchant2"],
  },
  accessoryLeft: {
    itemField: "accLeft",
    optionFields: ["accLeftCard", "accLeftEnchant1", "accLeftEnchant2"],
  },
  shield: {
    itemField: "shield",
    refineField: "shieldRefine",
    gradeField: "shieldGrade",
    optionFields: ["shieldCard", "shieldEnchant1", "shieldEnchant2"],
  },
  ammo: {
    itemField: "ammo",
    optionFields: ["ammoOption1", "ammoOption2"],
  },
  costumeUpper: {
    itemField: "costumeUpper",
    optionFields: ["costumeEnchantUpper"],
  },
  costumeMiddle: {
    itemField: "costumeMiddle",
    optionFields: ["costumeEnchantMiddle"],
  },
  costumeLower: {
    itemField: "costumeLower",
    optionFields: ["costumeEnchantLower"],
  },
  costumeGarment: {
    itemField: "costumeGarment",
    optionFields: [
      "costumeEnchantGarment",
      "costumeEnchantGarment2",
      "costumeEnchantGarment3",
      "costumeEnchantGarment4",
    ],
  },
  shadowWeapon: {
    itemField: "shadowWeapon",
    refineField: "shadowWeaponRefine",
  },
  shadowArmor: {
    itemField: "shadowArmor",
    refineField: "shadowArmorRefine",
  },
  shadowShield: {
    itemField: "shadowShield",
    refineField: "shadowShieldRefine",
  },
  shadowShoes: {
    itemField: "shadowBoot",
    refineField: "shadowBootRefine",
  },
  shadowEarring: {
    itemField: "shadowEarring",
    refineField: "shadowEarringRefine",
  },
  shadowPendant: {
    itemField: "shadowPendant",
    refineField: "shadowPendantRefine",
  },
};

type StatBuild = {
  profileId: string;
  characterClass: CharacterClass;
  baseLevel: number;
  jobLevel: number;
  targetMonster: string;
  selectedAtkSkill: string;
  propertyAtk: ElementProperty;
  customOptionText: string;
  extraItemIds: number[];
  gear: GearLoadout;
  primaryStats: Record<PrimaryStatKey, number>;
  traitStats: Record<TraitStatKey, number>;
  modifiers: Record<ModifierKey, number>;
};

type DerivedStats = {
  statusAtk: number;
  totalAtk: number;
  statusMatk: number;
  totalMatk: number;
  hit: number;
  flee: number;
  crit: number;
  softDef: number;
  softMdef: number;
  weightLimit: number;
  perfectDodge: number;
  variableCastReduction: number;
  pAtk: number;
  sMatk: number;
  res: number;
  mres: number;
  hPlus: number;
  cRate: number;
};

type ItemSearchResponse = {
  generatedAt: string;
  items: RathenaCalculatorItem[];
  source: string;
  total: number;
};

const DEFAULT_PRIMARY_STATS: Record<PrimaryStatKey, number> = {
  str: 120,
  agi: 100,
  vit: 100,
  int: 100,
  dex: 120,
  luk: 100,
};

const DEFAULT_TRAIT_STATS: Record<TraitStatKey, number> = {
  pow: 0,
  sta: 0,
  wis: 0,
  spl: 0,
  con: 0,
  crt: 0,
};

const DEFAULT_MODIFIERS: Record<ModifierKey, number> = {
  weaponAtk: 0,
  equipAtk: 0,
  atkPercent: 0,
  equipMatk: 0,
  matkPercent: 0,
  hitBonus: 0,
  fleeBonus: 0,
  critBonus: 0,
  defBonus: 0,
  mdefBonus: 0,
  pAtkBonus: 0,
  sMatkBonus: 0,
};

function createDefaultGearLoadout(): GearLoadout {
  return GEAR_SLOT_DEFS.reduce((next, slotDef) => {
    next[slotDef.key] = {
      itemId: null,
      refine: 0,
      grade: "none",
      optionIds: slotDef.optionLabels.map(() => null),
    };
    return next;
  }, {} as GearLoadout);
}

const DEFAULT_BUILD: StatBuild = {
  profileId: "",
  characterClass: "Windhawk",
  baseLevel: 250,
  jobLevel: 50,
  targetMonster: "",
  selectedAtkSkill: DEFAULT_SKILL_OPTIONS[0],
  propertyAtk: "Neutral",
  customOptionText: "",
  extraItemIds: [],
  gear: createDefaultGearLoadout(),
  primaryStats: DEFAULT_PRIMARY_STATS,
  traitStats: DEFAULT_TRAIT_STATS,
  modifiers: DEFAULT_MODIFIERS,
};

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function floorClamp(value: number, min: number, max: number): number {
  return Math.floor(clampNumber(value, min, max));
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function mergeNumberRecord<T extends string>(
  defaults: Record<T, number>,
  value: unknown,
  min: number,
  max: number
): Record<T, number> {
  const source = (typeof value === "object" && value !== null ? value : {}) as Partial<Record<T, unknown>>;

  return Object.keys(defaults).reduce<Record<T, number>>((next, rawKey) => {
    const key = rawKey as T;
    const rawValue = source[key];
    next[key] = floorClamp(typeof rawValue === "number" ? rawValue : defaults[key], min, max);
    return next;
  }, {} as Record<T, number>);
}

function normalizeItemIds(value: unknown): number[] {
  const rawIds = Array.isArray(value) ? value : [];

  return Array.from(
    new Set(
      rawIds
        .map((id) => (typeof id === "number" ? Math.floor(id) : Number(id)))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  ).slice(0, 120);
}

function normalizeGearGrade(value: unknown): GearGrade {
  return value === "D" || value === "C" || value === "B" || value === "A" ? value : "none";
}

function normalizeGearLoadout(value: unknown): GearLoadout {
  const source = typeof value === "object" && value !== null ? (value as Partial<Record<GearSlotKey, unknown>>) : {};

  return GEAR_SLOT_DEFS.reduce((next, slotDef) => {
    const rawSlot =
      typeof source[slotDef.key] === "object" && source[slotDef.key] !== null
        ? (source[slotDef.key] as Partial<GearSlotState>)
        : {};
    const rawOptions = Array.isArray(rawSlot.optionIds) ? rawSlot.optionIds : [];

    next[slotDef.key] = {
      itemId: normalizeItemIds([rawSlot.itemId])[0] ?? null,
      refine: slotDef.refineable ? floorClamp(typeof rawSlot.refine === "number" ? rawSlot.refine : 0, 0, 20) : 0,
      grade: slotDef.gradable ? normalizeGearGrade(rawSlot.grade) : "none",
      optionIds: slotDef.optionLabels.map((_, index) => normalizeItemIds([rawOptions[index]])[0] ?? null),
    };

    return next;
  }, {} as GearLoadout);
}

function normalizeElementProperty(value: unknown): ElementProperty {
  return ELEMENT_OPTIONS.includes(value as ElementProperty) ? (value as ElementProperty) : DEFAULT_BUILD.propertyAtk;
}

function normalizeCharacterClass(value: unknown): CharacterClass {
  return CHARACTER_CLASS_OPTIONS.includes(value as CharacterClass) ? (value as CharacterClass) : DEFAULT_BUILD.characterClass;
}

function normalizeText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function normalizeBuild(value: unknown): StatBuild {
  const source = typeof value === "object" && value !== null ? (value as Partial<StatBuild>) : {};
  const legacySource = source as Partial<StatBuild> & { itemIds?: unknown };

  return {
    profileId: typeof source.profileId === "string" ? source.profileId : DEFAULT_BUILD.profileId,
    characterClass: normalizeCharacterClass(source.characterClass),
    baseLevel: floorClamp(typeof source.baseLevel === "number" ? source.baseLevel : DEFAULT_BUILD.baseLevel, 1, 260),
    jobLevel: floorClamp(typeof source.jobLevel === "number" ? source.jobLevel : DEFAULT_BUILD.jobLevel, 1, 70),
    targetMonster: normalizeText(source.targetMonster, 80),
    selectedAtkSkill: normalizeText(source.selectedAtkSkill, 80) || DEFAULT_BUILD.selectedAtkSkill,
    propertyAtk: normalizeElementProperty(source.propertyAtk),
    customOptionText: normalizeText(source.customOptionText, 2000),
    extraItemIds: normalizeItemIds(source.extraItemIds ?? legacySource.itemIds),
    gear: normalizeGearLoadout(source.gear),
    primaryStats: mergeNumberRecord(DEFAULT_PRIMARY_STATS, source.primaryStats, 1, 130),
    traitStats: mergeNumberRecord(DEFAULT_TRAIT_STATS, source.traitStats, 0, 110),
    modifiers: mergeNumberRecord(DEFAULT_MODIFIERS, source.modifiers, 0, 5000),
  };
}

function readStoredBuild(): StatBuild {
  if (typeof window === "undefined") return DEFAULT_BUILD;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_BUILD;

  try {
    return normalizeBuild(JSON.parse(stored));
  } catch {
    return DEFAULT_BUILD;
  }
}

function addBonus(current: number, bonuses: RathenaItemBonuses, key: RathenaItemBonusKey): number {
  return current + (bonuses[key] || 0);
}

function mergeBonuses(target: RathenaItemBonuses, source?: RathenaItemBonuses) {
  if (!source) return;

  for (const [rawKey, value] of Object.entries(source)) {
    if (typeof value !== "number") continue;
    const key = rawKey as RathenaItemBonusKey;
    target[key] = (target[key] || 0) + value;
  }
}

function normalizeCustomOptionKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function parseCustomOptionText(value: string): RathenaItemBonuses {
  const bonuses: RathenaItemBonuses = {};
  const entries = value
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  for (const entry of entries) {
    const match = entry.match(/^([a-zA-Z0-9_\s.-]+)\s*[:=]\s*(-?\d+(?:\.\d+)?)$/);
    if (!match) continue;

    const bonusKey = CUSTOM_OPTION_KEY_MAP[normalizeCustomOptionKey(match[1])];
    if (!bonusKey) continue;

    bonuses[bonusKey] = (bonuses[bonusKey] || 0) + Number(match[2]);
  }

  return bonuses;
}

function combineBonuses(...sources: RathenaItemBonuses[]): RathenaItemBonuses {
  const combined: RathenaItemBonuses = {};
  for (const source of sources) {
    mergeBonuses(combined, source);
  }
  return combined;
}

function isBonusRuleActive(rule: NonNullable<RathenaCalculatorItem["bonusRules"]>[number], entry: ConfiguredItem): boolean {
  if (rule.minRefine && entry.refine < rule.minRefine) return false;
  if (rule.minGrade && GRADE_RANK[entry.grade] < GRADE_RANK[rule.minGrade]) return false;
  return true;
}

function combineConfiguredItemBonuses(entries: ConfiguredItem[]): RathenaItemBonuses {
  const combined: RathenaItemBonuses = {};

  for (const entry of entries) {
    mergeBonuses(combined, entry.item.bonuses);

    for (const rule of entry.item.bonusRules || []) {
      if (isBonusRuleActive(rule, entry)) {
        mergeBonuses(combined, rule.bonuses);
      }
    }
  }

  return combined;
}

function applyItemBonuses(build: StatBuild, bonuses: RathenaItemBonuses): StatBuild {
  return {
    ...build,
    primaryStats: {
      str: floorClamp(addBonus(build.primaryStats.str, bonuses, "str"), 1, 500),
      agi: floorClamp(addBonus(build.primaryStats.agi, bonuses, "agi"), 1, 500),
      vit: floorClamp(addBonus(build.primaryStats.vit, bonuses, "vit"), 1, 500),
      int: floorClamp(addBonus(build.primaryStats.int, bonuses, "int"), 1, 500),
      dex: floorClamp(addBonus(build.primaryStats.dex, bonuses, "dex"), 1, 500),
      luk: floorClamp(addBonus(build.primaryStats.luk, bonuses, "luk"), 1, 500),
    },
    traitStats: {
      pow: floorClamp(addBonus(build.traitStats.pow, bonuses, "pow"), 0, 500),
      sta: floorClamp(addBonus(build.traitStats.sta, bonuses, "sta"), 0, 500),
      wis: floorClamp(addBonus(build.traitStats.wis, bonuses, "wis"), 0, 500),
      spl: floorClamp(addBonus(build.traitStats.spl, bonuses, "spl"), 0, 500),
      con: floorClamp(addBonus(build.traitStats.con, bonuses, "con"), 0, 500),
      crt: floorClamp(addBonus(build.traitStats.crt, bonuses, "crt"), 0, 500),
    },
    modifiers: {
      weaponAtk: floorClamp(addBonus(build.modifiers.weaponAtk, bonuses, "weaponAtk"), 0, 20000),
      equipAtk: floorClamp(addBonus(build.modifiers.equipAtk, bonuses, "equipAtk"), 0, 20000),
      atkPercent: floorClamp(addBonus(build.modifiers.atkPercent, bonuses, "atkPercent"), 0, 5000),
      equipMatk: floorClamp(addBonus(build.modifiers.equipMatk, bonuses, "equipMatk"), 0, 20000),
      matkPercent: floorClamp(addBonus(build.modifiers.matkPercent, bonuses, "matkPercent"), 0, 5000),
      hitBonus: floorClamp(addBonus(build.modifiers.hitBonus, bonuses, "hitBonus"), 0, 20000),
      fleeBonus: floorClamp(addBonus(build.modifiers.fleeBonus, bonuses, "fleeBonus"), 0, 20000),
      critBonus: floorClamp(addBonus(build.modifiers.critBonus, bonuses, "critBonus"), 0, 5000),
      defBonus: floorClamp(addBonus(build.modifiers.defBonus, bonuses, "defBonus"), 0, 20000),
      mdefBonus: floorClamp(addBonus(build.modifiers.mdefBonus, bonuses, "mdefBonus"), 0, 20000),
      pAtkBonus: floorClamp(addBonus(build.modifiers.pAtkBonus, bonuses, "pAtkBonus"), 0, 5000),
      sMatkBonus: floorClamp(addBonus(build.modifiers.sMatkBonus, bonuses, "sMatkBonus"), 0, 5000),
    },
  };
}

function getLoadoutItemIds(build: StatBuild): number[] {
  const ids: number[] = [...build.extraItemIds];

  for (const slotDef of GEAR_SLOT_DEFS) {
    const slot = build.gear[slotDef.key];
    if (slot.itemId) ids.push(slot.itemId);
    for (const optionId of slot.optionIds) {
      if (optionId) ids.push(optionId);
    }
  }

  return Array.from(new Set(ids));
}

function getConfiguredItems(build: StatBuild, itemMap: Map<number, RathenaCalculatorItem>): ConfiguredItem[] {
  const entries: ConfiguredItem[] = [];

  for (const slotDef of GEAR_SLOT_DEFS) {
    const slot = build.gear[slotDef.key];
    const mainItem = slot.itemId ? itemMap.get(slot.itemId) : undefined;

    if (mainItem) {
      entries.push({
        grade: slot.grade,
        item: mainItem,
        refine: slot.refine,
        sourceLabel: slotDef.label,
      });
    }

    slot.optionIds.forEach((optionId, index) => {
      const optionItem = optionId ? itemMap.get(optionId) : undefined;
      if (!optionItem) return;

      entries.push({
        grade: "none",
        item: optionItem,
        refine: 0,
        sourceLabel: `${slotDef.label} ${slotDef.optionLabels[index]}`,
      });
    });
  }

  for (const extraItemId of build.extraItemIds) {
    const item = itemMap.get(extraItemId);
    if (!item) continue;

    entries.push({
      grade: "none",
      item,
      refine: 0,
      sourceLabel: "Extra",
    });
  }

  return entries;
}

function getGearSlotDef(slotKey: GearSlotKey): GearSlotDef {
  return GEAR_SLOT_DEFS.find((slotDef) => slotDef.key === slotKey) || GEAR_SLOT_DEFS[0];
}

function isCardOptionLabel(label: string | undefined): boolean {
  return Boolean(label && label.toLowerCase().startsWith("card"));
}

function getPickerConfig(
  target: PickerTarget | null,
  characterClass: CharacterClass
): { category: RathenaItemCategory | "all"; characterClass?: CharacterClass; slot?: RathenaItemSlot; subType?: string } | null {
  if (!target) return null;
  const slotDef = getGearSlotDef(target.slotKey);

  if (target.kind === "option") {
    const optionLabel = slotDef.optionLabels[target.optionIndex];
    if (isCardOptionLabel(optionLabel)) {
      return {
        category: "card",
        slot: slotDef.slots[0] as RathenaItemSlot,
      };
    }

    return {
      category: "card",
      subType: "Enchant",
    };
  }

  return {
    category: slotDef.category as RathenaItemCategory,
    characterClass,
    slot: slotDef.slots[0] as RathenaItemSlot,
  };
}

function calculateDerivedStats(build: StatBuild): DerivedStats {
  const { baseLevel, primaryStats, traitStats, modifiers } = build;
  const { str, agi, vit, int, dex, luk } = primaryStats;
  const { pow, sta, wis, spl, con, crt } = traitStats;

  const statusAtk = Math.floor(baseLevel / 4) + str + Math.floor(dex / 5) + Math.floor(luk / 3);
  const statusMatk = Math.floor(baseLevel / 4) + int + Math.floor(int / 2) + Math.floor(dex / 5) + Math.floor(luk / 3);
  const totalAtk = Math.floor(
    (statusAtk + modifiers.weaponAtk + modifiers.equipAtk) * (1 + modifiers.atkPercent / 100)
  );
  const totalMatk = Math.floor((statusMatk + modifiers.equipMatk) * (1 + modifiers.matkPercent / 100));

  return {
    statusAtk,
    totalAtk,
    statusMatk,
    totalMatk,
    hit: 175 + baseLevel + dex + Math.floor(luk / 3) + con + modifiers.hitBonus,
    flee: 100 + baseLevel + agi + Math.floor(luk / 5) + modifiers.fleeBonus,
    crit: 1 + Math.floor(luk * 0.3) + Math.floor(crt * 0.3) + modifiers.critBonus,
    softDef: Math.floor(baseLevel / 2) + Math.floor(vit / 2) + Math.floor(agi / 5) + modifiers.defBonus,
    softMdef:
      Math.floor(baseLevel / 4) +
      Math.floor(int / 2) +
      Math.floor(vit / 5) +
      Math.floor(dex / 5) +
      modifiers.mdefBonus,
    weightLimit: 2000 + str * 30,
    perfectDodge: 1 + Math.floor(luk / 10),
    variableCastReduction: Math.min(100, ((dex * 2 + int) / 530) * 100),
    pAtk: Math.floor(pow / 3) + Math.floor(con / 5) + modifiers.pAtkBonus,
    sMatk: Math.floor(spl / 3) + Math.floor(wis / 5) + modifiers.sMatkBonus,
    res: Math.floor(sta / 3),
    mres: Math.floor(wis / 3),
    hPlus: Math.floor(crt / 3),
    cRate: Math.floor(con / 3) + Math.floor(crt / 5),
  };
}

function getRawCustomOptions(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildCalculatorSummary(
  build: StatBuild,
  itemMap: Map<number, RathenaCalculatorItem>,
  derivedStats: DerivedStats
) {
  const equipment: Record<string, number | string | null> = {};
  const equipmentNames: Record<string, string> = {};

  for (const slotDef of GEAR_SLOT_DEFS) {
    const fieldMap = SUMMARY_GEAR_FIELD_MAP[slotDef.key];
    const slot = build.gear[slotDef.key];
    if (!fieldMap || !slot) continue;

    equipment[fieldMap.itemField] = slot.itemId;
    if (slot.itemId) {
      equipmentNames[fieldMap.itemField] = itemMap.get(slot.itemId)?.name || `#${slot.itemId}`;
    }

    if (fieldMap.refineField) equipment[fieldMap.refineField] = slot.refine;
    if (fieldMap.gradeField) equipment[fieldMap.gradeField] = slot.grade === "none" ? null : slot.grade;

    fieldMap.optionFields?.forEach((field, index) => {
      const optionId = slot.optionIds[index] || null;
      equipment[field] = optionId;
      if (optionId) {
        equipmentNames[field] = itemMap.get(optionId)?.name || `#${optionId}`;
      }
    });
  }

  return {
    character: {
      profileId: build.profileId || null,
      class: build.characterClass,
      level: build.baseLevel,
      jobLevel: build.jobLevel,
      selectedAtkSkill: build.selectedAtkSkill,
      propertyAtk: build.propertyAtk,
      targetMonster: build.targetMonster || null,
    },
    primaryStats: build.primaryStats,
    traitStats: build.traitStats,
    manualModifiers: build.modifiers,
    rawOptionTxts: getRawCustomOptions(build.customOptionText),
    equipment,
    equipmentNames,
    derived: derivedStats,
  };
}

export default function StatCalculator() {
  const [profiles, setProfiles] = useState<PersonalCharacterProfile[]>(() => readPersonalDataProfiles());
  const [build, setBuild] = useState<StatBuild>(() => readStoredBuild());
  const [itemQuery, setItemQuery] = useState("");
  const [itemResults, setItemResults] = useState<RathenaCalculatorItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<RathenaCalculatorItem[]>([]);
  const [itemTotal, setItemTotal] = useState(0);
  const [isSearchingItems, setIsSearchingItems] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);

  const selectedProfile = profiles.find((profile) => profile.id === build.profileId);
  const selectedItemMap = useMemo(() => new Map(selectedItems.map((item) => [item.id, item])), [selectedItems]);
  const configuredItems = useMemo(() => getConfiguredItems(build, selectedItemMap), [build, selectedItemMap]);
  const itemBonuses = useMemo(() => combineConfiguredItemBonuses(configuredItems), [configuredItems]);
  const customBonuses = useMemo(() => parseCustomOptionText(build.customOptionText), [build.customOptionText]);
  const totalBonuses = useMemo(() => combineBonuses(itemBonuses, customBonuses), [customBonuses, itemBonuses]);
  const effectiveBuild = useMemo(() => applyItemBonuses(build, totalBonuses), [build, totalBonuses]);
  const derivedStats = useMemo(() => calculateDerivedStats(effectiveBuild), [effectiveBuild]);
  const calculatorSummary = useMemo(
    () => buildCalculatorSummary(build, selectedItemMap, derivedStats),
    [build, derivedStats, selectedItemMap]
  );
  const castRemaining = Math.max(0, 100 - derivedStats.variableCastReduction);
  const primaryTotal = PRIMARY_STAT_FIELDS.reduce((sum, field) => sum + effectiveBuild.primaryStats[field.key], 0);
  const traitTotal = TRAIT_STAT_FIELDS.reduce((sum, field) => sum + effectiveBuild.traitStats[field.key], 0);
  const selectedItemIds = getLoadoutItemIds(build).join(",");
  const pickerConfig = useMemo(() => getPickerConfig(pickerTarget, build.characterClass), [build.characterClass, pickerTarget]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(build));
  }, [build]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSelectedItems() {
      if (!selectedItemIds) {
        setSelectedItems([]);
        return;
      }

      const response = await fetch(`/api/items/search?ids=${encodeURIComponent(selectedItemIds)}`, {
        signal: controller.signal,
      });
      if (!response.ok) return;

      const payload = (await response.json()) as ItemSearchResponse;
      setSelectedItems(payload.items);
    }

    fetchSelectedItems().catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error(error);
    });

    return () => controller.abort();
  }, [selectedItemIds]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (!pickerConfig) {
        setItemResults([]);
        setItemTotal(0);
        setIsSearchingItems(false);
        return;
      }

      setIsSearchingItems(true);
      const params = new URLSearchParams({
        category: pickerConfig.category,
        limit: "36",
        q: itemQuery,
      });
      if (pickerConfig.slot) params.set("slot", pickerConfig.slot);
      if (pickerConfig.subType) params.set("subType", pickerConfig.subType);
      if (pickerConfig.characterClass) params.set("class", pickerConfig.characterClass);

      try {
        const response = await fetch(`/api/items/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const payload = (await response.json()) as ItemSearchResponse;
        setItemResults(payload.items);
        setItemTotal(payload.total);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
      } finally {
        if (!controller.signal.aborted) setIsSearchingItems(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [itemQuery, pickerConfig]);

  useEffect(() => {
    function refreshProfiles() {
      setProfiles(readPersonalDataProfiles());
    }

    function handleStorageEvent(event: StorageEvent) {
      if (event.key === PERSONAL_DATA_STORAGE_KEY) refreshProfiles();
    }

    window.addEventListener(PERSONAL_DATA_EVENT, refreshProfiles);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(PERSONAL_DATA_EVENT, refreshProfiles);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  function applyProfile(profileId: string) {
    const nextProfile = profiles.find((profile) => profile.id === profileId);
    setBuild((current) => ({
      ...current,
      profileId,
      baseLevel: nextProfile ? floorClamp(nextProfile.level, 1, 260) : current.baseLevel,
    }));
  }

  function updateBuild(patch: Partial<StatBuild>) {
    setBuild((current) => normalizeBuild({ ...current, ...patch }));
  }

  function updatePrimaryStat(key: PrimaryStatKey, value: number) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        primaryStats: {
          ...current.primaryStats,
          [key]: value,
        },
      })
    );
  }

  function updateTraitStat(key: TraitStatKey, value: number) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        traitStats: {
          ...current.traitStats,
          [key]: value,
        },
      })
    );
  }

  function updateModifier(key: ModifierKey, value: number) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        modifiers: {
          ...current.modifiers,
          [key]: value,
        },
      })
    );
  }

  function updateGearSlot(slotKey: GearSlotKey, patch: Partial<GearSlotState>) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        gear: {
          ...current.gear,
          [slotKey]: {
            ...current.gear[slotKey],
            ...patch,
          },
        },
      })
    );
  }

  function updateGearOption(slotKey: GearSlotKey, optionIndex: number, itemId: number | null) {
    const currentSlot = build.gear[slotKey];
    const optionIds = currentSlot.optionIds.map((optionId, index) => (index === optionIndex ? itemId : optionId));
    updateGearSlot(slotKey, { optionIds });
  }

  function clearGearSlot(slotKey: GearSlotKey) {
    const slotDef = getGearSlotDef(slotKey);
    updateGearSlot(slotKey, {
      itemId: null,
      refine: 0,
      grade: "none",
      optionIds: slotDef.optionLabels.map(() => null),
    });
  }

  function clearGear() {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        extraItemIds: [],
        gear: createDefaultGearLoadout(),
      })
    );
  }

  function openPicker(target: PickerTarget) {
    setPickerTarget(target);
    setItemQuery("");
  }

  function pickItem(itemId: number) {
    if (!pickerTarget) return;

    if (pickerTarget.kind === "main") {
      updateGearSlot(pickerTarget.slotKey, { itemId });
    } else {
      updateGearOption(pickerTarget.slotKey, pickerTarget.optionIndex, itemId);
    }

    setPickerTarget(null);
    setItemQuery("");
  }

function resetBuild() {
    setBuild(DEFAULT_BUILD);
    setPickerTarget(null);
    setItemQuery("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-cyan-300 sm:text-4xl">Stat Calculator</h1>
            <p className="mt-1 text-sm text-slate-400">RO status and derived combat values</p>
          </div>

          <div className="flex w-full flex-col gap-2 xl:w-auto xl:items-end">
            <nav className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:w-auto xl:grid-cols-8">
              <NavLink href="/cen-lab" label="Cen Lab" tone="cyan" />
              <NavLink href="/ogch" label="OGCH" tone="violet" />
              <NavLink href="/water-dungeon" label="Water" tone="sky" />
              <NavLink href="/personal-data" label="Personal" tone="emerald" />
              <NavLink href="/exp" label="EXP" tone="amber" />
              <NavLink href="/stat-calculator" label="Stat" tone="cyan" active />
              <NavLink href="/ogch/bishop" label="Bishop" tone="pink" />
              <NavLink href="/cen-lab/calculator" label="Public" tone="emerald" />
            </nav>
            <LogoutButton />
          </div>
        </header>

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <SummaryCard label="ATK" value={formatNumber(derivedStats.totalAtk)} detail={`status ${derivedStats.statusAtk}`} tone="cyan" />
          <SummaryCard
            label="MATK"
            value={formatNumber(derivedStats.totalMatk)}
            detail={`status ${derivedStats.statusMatk}`}
            tone="violet"
          />
          <SummaryCard label="HIT" value={formatNumber(derivedStats.hit)} detail={`DEX ${effectiveBuild.primaryStats.dex}`} tone="emerald" />
          <SummaryCard label="FLEE" value={formatNumber(derivedStats.flee)} detail={`AGI ${effectiveBuild.primaryStats.agi}`} tone="sky" />
          <SummaryCard label="CRIT" value={formatNumber(derivedStats.crit)} detail={`LUK ${effectiveBuild.primaryStats.luk}`} tone="amber" />
          <SummaryCard
            label="VCT"
            value={`${formatNumber(derivedStats.variableCastReduction)}%`}
            detail={`${formatNumber(castRemaining)}% left`}
            tone="rose"
          />
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-cyan-200">Character</h2>
                <button
                  className="rounded-lg border border-rose-500/40 bg-rose-950/25 px-3 py-2 text-xs font-black text-rose-100 transition hover:bg-rose-950/45"
                  type="button"
                  onClick={resetBuild}
                >
                  Reset
                </button>
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Personal Data</span>
                <select
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition focus:border-cyan-400"
                  value={build.profileId}
                  onChange={(event) => applyProfile(event.target.value)}
                >
                  <option value="">Manual Build</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} - Lv.{profile.level}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Character Class</span>
                <select
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition focus:border-cyan-400"
                  value={build.characterClass}
                  onChange={(event) => updateBuild({ characterClass: event.target.value as CharacterClass })}
                >
                  {CHARACTER_CLASS_OPTIONS.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <NumberField
                  label="Base Level"
                  max={260}
                  min={1}
                  value={build.baseLevel}
                  onChange={(baseLevel) => updateBuild({ baseLevel })}
                />
                <NumberField
                  label="Job Level"
                  max={70}
                  min={1}
                  value={build.jobLevel}
                  onChange={(jobLevel) => updateBuild({ jobLevel })}
                />
              </div>

              {selectedProfile ? (
                <div className="mt-4 rounded-lg border border-cyan-500/25 bg-cyan-950/20 px-3 py-2 text-sm font-semibold text-cyan-100">
                  {selectedProfile.groupLabel}
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-violet-200">Status</h2>
                <span className="font-mono text-sm font-black text-slate-400">{primaryTotal}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {PRIMARY_STAT_FIELDS.map((field) => (
                  <NumberField
                    key={field.key}
                    label={field.label}
                    max={130}
                    min={1}
                    value={build.primaryStats[field.key]}
                    onChange={(value) => updatePrimaryStat(field.key, value)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-emerald-200">Trait</h2>
                <span className="font-mono text-sm font-black text-slate-400">{traitTotal}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {TRAIT_STAT_FIELDS.map((field) => (
                  <NumberField
                    key={field.key}
                    label={field.label}
                    max={110}
                    min={0}
                    value={build.traitStats[field.key]}
                    onChange={(value) => updateTraitStat(field.key, value)}
                  />
                ))}
              </div>
            </section>
          </aside>

          <section className="space-y-5">
            <EquipmentBuilderPanel
              bonuses={totalBonuses}
              characterClass={build.characterClass}
              configuredItems={configuredItems}
              gear={build.gear}
              isLoading={isSearchingItems}
              itemMap={selectedItemMap}
              pickerTarget={pickerTarget}
              query={itemQuery}
              results={itemResults}
              resultTotal={itemTotal}
              onClear={clearGear}
              onClearSlot={clearGearSlot}
              onClosePicker={() => setPickerTarget(null)}
              onOpenPicker={openPicker}
              onPickItem={pickItem}
              onQueryChange={setItemQuery}
              onUpdateGrade={(slotKey, grade) => updateGearSlot(slotKey, { grade })}
              onUpdateOption={updateGearOption}
              onUpdateRefine={(slotKey, refine) => updateGearSlot(slotKey, { refine })}
            />

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <h2 className="text-lg font-black text-sky-200">Modifiers</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {MODIFIER_FIELDS.map((field) => (
                  <NumberField
                    key={field.key}
                    label={field.label}
                    max={field.max}
                    min={0}
                    value={build.modifiers[field.key]}
                    onChange={(value) => updateModifier(field.key, value)}
                  />
                ))}
              </div>
            </div>

            <CalculatorWorkbenchPanel
              build={build}
              customBonuses={customBonuses}
              derivedStats={derivedStats}
              summary={calculatorSummary}
              onUpdateBuild={updateBuild}
            />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <OutputPanel
                items={[
                  ["Status ATK", derivedStats.statusAtk],
                  ["Total ATK", derivedStats.totalAtk],
                  ["Status MATK", derivedStats.statusMatk],
                  ["Total MATK", derivedStats.totalMatk],
                  ["HIT", derivedStats.hit],
                  ["FLEE", derivedStats.flee],
                  ["CRIT", derivedStats.crit],
                  ["Perfect Dodge", derivedStats.perfectDodge],
                ]}
                title="Combat"
                tone="cyan"
              />
              <OutputPanel
                items={[
                  ["Soft DEF", derivedStats.softDef],
                  ["Soft MDEF", derivedStats.softMdef],
                  ["Weight Limit", derivedStats.weightLimit],
                  ["VCT Reduction", `${formatNumber(derivedStats.variableCastReduction)}%`],
                  ["VCT Left", `${formatNumber(castRemaining)}%`],
                  ["Base Level", build.baseLevel],
                  ["Job Level", build.jobLevel],
                  ["Status Total", primaryTotal],
                ]}
                title="Defense / Utility"
                tone="violet"
              />
              <OutputPanel
                items={[
                  ["P.ATK", derivedStats.pAtk],
                  ["S.MATK", derivedStats.sMatk],
                  ["RES", derivedStats.res],
                  ["MRES", derivedStats.mres],
                  ["H.Plus", derivedStats.hPlus],
                  ["C.Rate", derivedStats.cRate],
                  ["Trait Total", traitTotal],
                ]}
                title="Trait Output"
                tone="emerald"
              />
              <FormulaPanel />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function CalculatorWorkbenchPanel({
  build,
  customBonuses,
  derivedStats,
  onUpdateBuild,
  summary,
}: {
  build: StatBuild;
  customBonuses: RathenaItemBonuses;
  derivedStats: DerivedStats;
  onUpdateBuild: (patch: Partial<StatBuild>) => void;
  summary: ReturnType<typeof buildCalculatorSummary>;
}) {
  const customBonusEntries = (Object.entries(customBonuses) as [RathenaItemBonusKey, number][]).filter(
    ([, value]) => value !== 0
  );

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_430px]">
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
        <div className="border-b border-emerald-500/25 bg-emerald-900/75 px-4 py-3">
          <h2 className="font-black text-emerald-50">Battle Summary</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Monster</span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              placeholder="Phantom of Amdarais..."
              value={build.targetMonster}
              onChange={(event) => onUpdateBuild({ targetMonster: event.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Skill</span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition focus:border-cyan-400"
              list="stat-calculator-skill-options"
              value={build.selectedAtkSkill}
              onChange={(event) => onUpdateBuild({ selectedAtkSkill: event.target.value })}
            />
            <datalist id="stat-calculator-skill-options">
              {DEFAULT_SKILL_OPTIONS.map((skill) => (
                <option key={skill} value={skill} />
              ))}
            </datalist>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Element</span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition focus:border-cyan-400"
              value={build.propertyAtk}
              onChange={(event) => onUpdateBuild({ propertyAtk: event.target.value as ElementProperty })}
            >
              {ELEMENT_OPTIONS.map((element) => (
                <option key={element} value={element}>
                  {element}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-slate-800 p-4 md:grid-cols-3">
          <SummaryCard label="BaseSkill" value={formatNumber(derivedStats.totalAtk)} detail="current ATK model" tone="amber" />
          <SummaryCard label="Hit" value={formatNumber(derivedStats.hit)} detail="status + item" tone="cyan" />
          <SummaryCard label="ASPD" value={`${formatNumber(100 + (customBonuses.aspdPercent || 0))}%`} detail="custom ASPD %" tone="violet" />
        </div>
      </div>

      <div className="space-y-3">
        <WorkbenchDetails title="Custom Bonus" tone="violet" defaultOpen>
          <textarea
            className="min-h-[150px] w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs font-bold text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400"
            placeholder={"atk:4\np_atk:5\nranged:20\nvct:10"}
            value={build.customOptionText}
            onChange={(event) => onUpdateBuild({ customOptionText: event.target.value })}
          />
          {customBonusEntries.length === 0 ? (
            <p className="mt-3 text-sm font-semibold text-slate-500">Known tokens are applied to the live stat output.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {customBonusEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="rounded-lg border border-violet-500/25 bg-violet-950/35 px-2.5 py-1 text-xs font-black text-violet-100"
                >
                  {ITEM_BONUS_LABELS[key]} {formatBonusValue(key, value)}
                </span>
              ))}
            </div>
          )}
        </WorkbenchDetails>

        <WorkbenchDetails title="Calculation Breakdown" tone="emerald" defaultOpen>
          <div className="space-y-2">
            <BreakdownRow label="Step 1: Status ATK" value={derivedStats.statusAtk} formula="Lv/4 + STR + DEX/5 + LUK/3" />
            <BreakdownRow label="Step 2: Total ATK" value={derivedStats.totalAtk} formula="(Status + weapon + equip) x ATK%" />
            <BreakdownRow label="Step 3: Status MATK" value={derivedStats.statusMatk} formula="Lv/4 + INT + INT/2 + DEX/5 + LUK/3" />
            <BreakdownRow label="Step 4: Total MATK" value={derivedStats.totalMatk} formula="(Status + equip) x MATK%" />
            <BreakdownRow label="Step 5: VCT" value={`${formatNumber(derivedStats.variableCastReduction)}%`} formula="(DEX x 2 + INT) / 530" />
          </div>
        </WorkbenchDetails>

        <WorkbenchDetails title="Summary" tone="cyan">
          <pre className="max-h-[420px] overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] font-semibold leading-relaxed text-slate-200">
            {JSON.stringify(summary, null, 2)}
          </pre>
        </WorkbenchDetails>
      </div>
    </div>
  );
}

function WorkbenchDetails({
  children,
  defaultOpen = false,
  title,
  tone,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  title: string;
  tone: "cyan" | "emerald" | "violet";
}) {
  const toneClass = {
    cyan: "border-cyan-500/25 bg-cyan-950/20 text-cyan-100",
    emerald: "border-emerald-500/25 bg-emerald-950/20 text-emerald-100",
    violet: "border-violet-500/25 bg-violet-950/20 text-violet-100",
  }[tone];

  return (
    <details className={`rounded-xl border shadow-lg shadow-black/20 ${toneClass}`} open={defaultOpen}>
      <summary className="cursor-pointer px-4 py-3 text-sm font-black">{title}</summary>
      <div className="border-t border-slate-800/80 bg-slate-900/70 p-4">{children}</div>
    </details>
  );
}

function BreakdownRow({ formula, label, value }: { formula: string; label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black text-slate-300">{label}</p>
        <p className="font-mono text-sm font-black text-emerald-200">
          {typeof value === "number" ? formatNumber(value) : value}
        </p>
      </div>
      <p className="mt-1 font-mono text-[11px] font-semibold text-slate-500">{formula}</p>
    </div>
  );
}

function EquipmentBuilderPanel({
  bonuses,
  characterClass,
  configuredItems,
  gear,
  isLoading,
  itemMap,
  onClear,
  onClearSlot,
  onClosePicker,
  onOpenPicker,
  onPickItem,
  onQueryChange,
  onUpdateGrade,
  onUpdateOption,
  onUpdateRefine,
  pickerTarget,
  query,
  resultTotal,
  results,
}: {
  bonuses: RathenaItemBonuses;
  characterClass: CharacterClass;
  configuredItems: ConfiguredItem[];
  gear: GearLoadout;
  isLoading: boolean;
  itemMap: Map<number, RathenaCalculatorItem>;
  onClear: () => void;
  onClearSlot: (slotKey: GearSlotKey) => void;
  onClosePicker: () => void;
  onOpenPicker: (target: PickerTarget) => void;
  onPickItem: (itemId: number) => void;
  onQueryChange: (query: string) => void;
  onUpdateGrade: (slotKey: GearSlotKey, grade: GearGrade) => void;
  onUpdateOption: (slotKey: GearSlotKey, optionIndex: number, itemId: number | null) => void;
  onUpdateRefine: (slotKey: GearSlotKey, refine: number) => void;
  pickerTarget: PickerTarget | null;
  query: string;
  resultTotal: number;
  results: RathenaCalculatorItem[];
}) {
  const bonusEntries = (Object.entries(bonuses) as [RathenaItemBonusKey, number][])
    .filter(([, value]) => value !== 0)
    .sort(([a], [b]) => ITEM_BONUS_LABELS[a].localeCompare(ITEM_BONUS_LABELS[b]));
  const activeTargetLabel = pickerTarget ? getPickerTargetLabel(pickerTarget) : "";
  const pickerScopeLabel = pickerTarget ? getPickerScopeLabel(pickerTarget, characterClass) : "";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-slate-800 bg-slate-950/55 p-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-lg font-black text-cyan-200">Equipment Builder</h2>
          <p className="mt-1 text-sm text-slate-400">Slot loadout, refine, grade, cards and enchants</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-cyan-500/25 bg-cyan-950/25 px-3 py-2 text-xs font-black text-cyan-100">
            {configuredItems.length} active items
          </span>
          <button
            className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-xs font-black text-rose-100 transition hover:bg-rose-950/45 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={configuredItems.length === 0}
            type="button"
            onClick={onClear}
          >
            Clear All
          </button>
        </div>
      </div>

      {pickerTarget ? (
        <div className="border-b border-cyan-500/20 bg-cyan-950/15 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="block min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300/80">
                Pick {activeTargetLabel}
              </span>
              {pickerScopeLabel ? (
                <span className="ml-2 text-xs font-bold text-amber-200/80">{pickerScopeLabel}</span>
              ) : null}
              <input
                className="mt-2 w-full rounded-lg border border-cyan-500/30 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
                placeholder="Search item, card, enchant..."
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
              />
            </label>

            <button
              className="rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-100"
              type="button"
              onClick={onClosePicker}
            >
              Close
            </button>
          </div>

          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/70">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                {isLoading ? "Searching" : `${formatNumber(resultTotal)} results`}
              </p>
              <p className="text-xs font-semibold text-slate-500">showing {results.length}</p>
            </div>

            <div className="grid max-h-[330px] grid-cols-1 gap-0 overflow-y-auto md:grid-cols-2 xl:grid-cols-3">
              {results.length === 0 ? (
                <div className="p-4 text-sm font-semibold text-slate-500">No item found.</div>
              ) : (
                results.map((item) => (
                  <button
                    key={item.id}
                    className="border-b border-slate-800 p-3 text-left transition hover:bg-cyan-950/25 md:border-r"
                    type="button"
                    onClick={() => onPickItem(item.id)}
                  >
                    <ItemSummary compact item={item} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <div className="min-w-[1060px] divide-y divide-slate-800">
          <div className="grid grid-cols-[118px_260px_112px_76px_repeat(6,minmax(128px,1fr))_48px] bg-slate-950/40 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            <div>Slot</div>
            <div>Item</div>
            <div>Grade</div>
            <div>Refine</div>
            <div>Option 1</div>
            <div>Option 2</div>
            <div>Option 3</div>
            <div>Option 4</div>
            <div>Option 5</div>
            <div>Option 6</div>
            <div />
          </div>

          {GEAR_SLOT_DEFS.map((slotDef) => {
            const slot = gear[slotDef.key];
            const mainItem = slot.itemId ? itemMap.get(slot.itemId) : undefined;

            return (
              <div
                key={slotDef.key}
                className="grid grid-cols-[118px_260px_112px_76px_repeat(6,minmax(128px,1fr))_48px] items-stretch gap-0 px-3 py-2"
              >
                <div className="flex items-center pr-2 text-sm font-black text-slate-300">{slotDef.label}</div>

                <GearPickCell
                  item={mainItem}
                  label={`Choose ${slotDef.label}`}
                  onClear={() => onClearSlot(slotDef.key)}
                  onPick={() => onOpenPicker({ kind: "main", slotKey: slotDef.key })}
                  prefix={formatGearPrefix(slot)}
                />

                <select
                  className="mx-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-xs font-bold text-slate-100 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={!slotDef.gradable}
                  value={slot.grade}
                  onChange={(event) => onUpdateGrade(slotDef.key, event.target.value as GearGrade)}
                >
                  {GEAR_GRADE_OPTIONS.map((grade) => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>

                <input
                  className="mx-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-center font-mono text-xs font-black text-slate-100 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={!slotDef.refineable}
                  max={20}
                  min={0}
                  type="number"
                  value={slot.refine}
                  onChange={(event) => onUpdateRefine(slotDef.key, floorClamp(Number(event.target.value), 0, 20))}
                />

                {Array.from({ length: 6 }).map((_, index) => {
                  const optionLabel = slotDef.optionLabels[index];
                  const optionId = slot.optionIds[index];
                  const optionItem = optionId ? itemMap.get(optionId) : undefined;

                  return (
                    <GearPickCell
                      key={`${slotDef.key}-${index}`}
                      compact
                      disabled={!optionLabel}
                      item={optionItem}
                      label={optionLabel || "-"}
                      onClear={() => onUpdateOption(slotDef.key, index, null)}
                      onPick={() => onOpenPicker({ kind: "option", optionIndex: index, slotKey: slotDef.key })}
                    />
                  );
                })}

                <button
                  className="mx-1 rounded-md border border-rose-500/25 bg-rose-950/20 text-sm font-black text-rose-100 transition hover:bg-rose-950/40"
                  type="button"
                  aria-label={`Clear ${slotDef.label}`}
                  onClick={() => onClearSlot(slotDef.key)}
                >
                  x
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-slate-800 bg-slate-950/35 p-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300/80">Parsed Bonuses</p>
          {bonusEntries.length === 0 ? (
            <p className="mt-2 text-sm font-semibold text-slate-500">No active parsed bonuses.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {bonusEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="rounded-lg border border-emerald-500/25 bg-emerald-950/30 px-2.5 py-1 text-xs font-black text-emerald-100"
                >
                  {ITEM_BONUS_LABELS[key]} {formatBonusValue(key, value)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-3 text-xs font-semibold text-amber-100/80">
          Refine and grade activate simple numeric rAthena rules such as +7, +10, Grade D/C/B/A. Complex formulas,
          set bonuses, skill damage, race, size, and custom server options are kept as preview data for the next pass.
        </div>
      </div>
    </div>
  );
}

function GearPickCell({
  compact = false,
  disabled = false,
  item,
  label,
  onClear,
  onPick,
  prefix,
}: {
  compact?: boolean;
  disabled?: boolean;
  item?: RathenaCalculatorItem;
  label: string;
  onClear: () => void;
  onPick: () => void;
  prefix?: string;
}) {
  if (disabled) {
    return (
      <div className="mx-1 flex min-w-0 items-center rounded-md border border-slate-800 bg-slate-950/35 px-2 py-2 text-xs font-semibold text-slate-700">
        -
      </div>
    );
  }

  return (
    <div className="mx-1 grid min-w-0 grid-cols-[minmax(0,1fr)_28px] overflow-hidden rounded-md border border-slate-700 bg-slate-950">
      <button
        className="min-w-0 px-2 py-2 text-left text-xs font-bold text-slate-200 transition hover:bg-cyan-950/25"
        type="button"
        onClick={onPick}
      >
        {item ? (
          <>
            <span className="block truncate text-cyan-100">
              {prefix ? <span className="text-amber-200">{prefix} </span> : null}
              {item.name}
            </span>
            {!compact ? <span className="mt-0.5 block truncate text-[11px] text-slate-500">{formatItemMeta(item)}</span> : null}
          </>
        ) : (
          <span className="block truncate text-slate-500">{label}</span>
        )}
      </button>

      <button
        className="border-l border-slate-800 text-sm font-black text-slate-500 transition hover:bg-rose-950/35 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-25"
        disabled={!item}
        type="button"
        aria-label={`Clear ${label}`}
        onClick={onClear}
      >
        x
      </button>
    </div>
  );
}

function formatGearPrefix(slot: GearSlotState): string {
  const parts = [];
  if (slot.grade !== "none") parts.push(`Grade ${slot.grade}`);
  if (slot.refine > 0) parts.push(`+${slot.refine}`);
  return parts.join(" ");
}

function getPickerTargetLabel(target: PickerTarget): string {
  const slotDef = getGearSlotDef(target.slotKey);
  if (target.kind === "main") return slotDef.label;
  return `${slotDef.label} ${slotDef.optionLabels[target.optionIndex]}`;
}

function getPickerScopeLabel(target: PickerTarget, characterClass?: CharacterClass): string {
  const config = getPickerConfig(target, characterClass || DEFAULT_BUILD.characterClass);
  if (!config) return "";
  if (config.subType) return config.subType;
  if (config.slot) return [config.slot, config.characterClass].filter(Boolean).join(" / ");
  return "";
}

function ItemLoadoutPanel({
  bonuses,
  category,
  isLoading,
  onAdd,
  onCategoryChange,
  onClear,
  onQueryChange,
  onRemove,
  query,
  resultTotal,
  results,
  selectedIds,
  selectedItems,
}: {
  bonuses: RathenaItemBonuses;
  category: RathenaItemCategory | "all";
  isLoading: boolean;
  onAdd: (itemId: number) => void;
  onCategoryChange: (category: RathenaItemCategory | "all") => void;
  onClear: () => void;
  onQueryChange: (query: string) => void;
  onRemove: (itemId: number) => void;
  query: string;
  resultTotal: number;
  results: RathenaCalculatorItem[];
  selectedIds: number[];
  selectedItems: RathenaCalculatorItem[];
}) {
  const selectedIdSet = new Set(selectedIds);
  const bonusEntries = (Object.entries(bonuses) as [RathenaItemBonusKey, number][])
    .filter(([, value]) => value !== 0)
    .sort(([a], [b]) => ITEM_BONUS_LABELS[a].localeCompare(ITEM_BONUS_LABELS[b]));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-black text-cyan-200">Item Loadout</h2>
          <p className="mt-1 text-sm text-slate-400">rAthena item search with parsed top-level bonuses</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-cyan-500/25 bg-cyan-950/25 px-3 py-2 text-xs font-black text-cyan-100">
            {selectedItems.length} selected
          </span>
          <button
            className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-xs font-black text-rose-100 transition hover:bg-rose-950/45 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selectedItems.length === 0}
            type="button"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Search Items</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            placeholder="Angel Wing Bow, Mob Scarf, Varmundt..."
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Category</span>
          <select
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition focus:border-cyan-400"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value as RathenaItemCategory | "all")}
          >
            {ITEM_CATEGORIES.map((itemCategory) => (
              <option key={itemCategory.value} value={itemCategory.value}>
                {itemCategory.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-h-[220px] rounded-lg border border-slate-800 bg-slate-950/55">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {isLoading ? "Searching" : `${formatNumber(resultTotal)} results`}
            </p>
            <p className="text-xs font-semibold text-slate-500">showing {results.length}</p>
          </div>

          <div className="max-h-[430px] divide-y divide-slate-800 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-5 text-sm font-semibold text-slate-500">No item found.</div>
            ) : (
              results.map((item) => {
                const isSelected = selectedIdSet.has(item.id);

                return (
                  <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_88px] gap-3 p-3">
                    <ItemSummary item={item} />
                    <button
                      className="h-10 self-start rounded-lg border border-cyan-500/35 bg-cyan-950/25 px-3 text-xs font-black text-cyan-100 transition hover:bg-cyan-950/45 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500"
                      disabled={isSelected}
                      type="button"
                      onClick={() => onAdd(item.id)}
                    >
                      {isSelected ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950/55">
            <div className="border-b border-slate-800 px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Selected Items</p>
            </div>
            <div className="max-h-[250px] divide-y divide-slate-800 overflow-y-auto">
              {selectedItems.length === 0 ? (
                <div className="p-4 text-sm font-semibold text-slate-500">No items selected.</div>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_32px] gap-2 p-3">
                    <ItemSummary compact item={item} />
                    <button
                      className="h-8 rounded-lg border border-rose-500/35 bg-rose-950/25 text-sm font-black text-rose-100 transition hover:bg-rose-950/45"
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => onRemove(item.id)}
                    >
                      x
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300/80">Parsed Bonuses</p>
            {bonusEntries.length === 0 ? (
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Select items with direct top-level bonuses to apply them.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {bonusEntries.map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-lg border border-emerald-500/25 bg-emerald-950/30 px-2.5 py-1 text-xs font-black text-emerald-100"
                  >
                    {ITEM_BONUS_LABELS[key]} {formatBonusValue(key, value)}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs font-semibold text-amber-200/80">
              Conditional refine, grade, skill, race, size, and set bonuses are shown as preview only for now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemSummary({ compact = false, item }: { compact?: boolean; item: RathenaCalculatorItem }) {
  const bonusEntries = item.bonuses
    ? (Object.entries(item.bonuses) as [RathenaItemBonusKey, number][]).filter(([, value]) => value !== 0)
    : [];

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-black text-slate-100">{item.name}</p>
      <p className="mt-1 truncate text-xs font-semibold text-slate-500">{formatItemMeta(item)}</p>
      {!compact && item.scriptPreview && item.scriptPreview.length > 0 ? (
        <p className="mt-2 line-clamp-2 font-mono text-[11px] font-semibold text-slate-400">
          {item.scriptPreview.slice(0, 3).join(" ")}
        </p>
      ) : null}
      {bonusEntries.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {bonusEntries.slice(0, compact ? 3 : 6).map(([key, value]) => (
            <span
              key={key}
              className="rounded-md border border-cyan-500/20 bg-cyan-950/25 px-2 py-0.5 text-[11px] font-bold text-cyan-100"
            >
              {ITEM_BONUS_LABELS[key]} {formatBonusValue(key, value)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatItemMeta(item: RathenaCalculatorItem): string {
  return [
    `#${item.id}`,
    item.category,
    item.subType,
    item.slots.filter((slot) => slot !== "none").join("/"),
    item.usableClass && item.usableClass.length > 0 ? item.usableClass.join("/") : undefined,
    item.equipLevel ? `Lv.${item.equipLevel}` : undefined,
    item.cardSlots !== undefined ? `${item.cardSlots} slots` : undefined,
  ]
    .filter(Boolean)
    .join(" - ");
}

function formatBonusValue(key: RathenaItemBonusKey, value: number): string {
  const prefix = value > 0 ? "+" : "";
  const suffix = PERCENT_BONUS_KEYS.has(key) ? "%" : "";
  return `${prefix}${formatNumber(value)}${suffix}`;
}

function NavLink({
  active = false,
  href,
  label,
  tone,
}: {
  active?: boolean;
  href: string;
  label: string;
  tone: "amber" | "cyan" | "emerald" | "pink" | "sky" | "violet";
}) {
  const activeClass = {
    amber: "border-amber-500/50 bg-amber-950/45 text-amber-100",
    cyan: "border-cyan-500/50 bg-cyan-950/45 text-cyan-100",
    emerald: "border-emerald-500/50 bg-emerald-950/45 text-emerald-100",
    pink: "border-pink-500/50 bg-pink-950/45 text-pink-100",
    sky: "border-sky-500/50 bg-sky-950/45 text-sky-100",
    violet: "border-violet-500/50 bg-violet-950/45 text-violet-100",
  }[tone];

  const inactiveClass = {
    amber: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-amber-500/40 hover:text-amber-200",
    cyan: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200",
    emerald: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-200",
    pink: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-pink-500/40 hover:text-pink-200",
    sky: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-sky-500/40 hover:text-sky-200",
    violet: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-violet-500/40 hover:text-violet-200",
  }[tone];

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold transition ${
        active ? activeClass : inactiveClass
      }`}
      href={href}
    >
      {label}
    </Link>
  );
}

function NumberField({
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <input
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm font-black text-slate-100 outline-none transition focus:border-cyan-400"
        max={max}
        min={min}
        step={step}
        type="number"
        value={value}
        onChange={(event) => onChange(floorClamp(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function SummaryCard({
  detail,
  label,
  tone,
  value,
}: {
  detail?: string;
  label: string;
  tone: "amber" | "cyan" | "emerald" | "rose" | "sky" | "violet";
  value: string;
}) {
  const toneClass = {
    amber: "border-amber-500/25 bg-amber-950/20 text-amber-100",
    cyan: "border-cyan-500/25 bg-cyan-950/20 text-cyan-100",
    emerald: "border-emerald-500/25 bg-emerald-950/20 text-emerald-100",
    rose: "border-rose-500/25 bg-rose-950/20 text-rose-100",
    sky: "border-sky-500/25 bg-sky-950/20 text-sky-100",
    violet: "border-violet-500/25 bg-violet-950/20 text-violet-100",
  }[tone];

  return (
    <div className={`rounded-xl border p-4 shadow-lg shadow-black/10 ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 break-words font-mono text-2xl font-black">{value}</p>
      {detail ? <p className="mt-1 text-sm font-semibold text-slate-400">{detail}</p> : null}
    </div>
  );
}

function OutputPanel({
  items,
  title,
  tone,
}: {
  items: [string, number | string][];
  title: string;
  tone: "cyan" | "emerald" | "violet";
}) {
  const titleClass = {
    cyan: "text-cyan-200",
    emerald: "text-emerald-200",
    violet: "text-violet-200",
  }[tone];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
      <div className="border-b border-slate-800 bg-slate-950/70 px-4 py-3">
        <h2 className={`font-black ${titleClass}`}>{title}</h2>
      </div>
      <div className="divide-y divide-slate-800/80">
        {items.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3">
            <span className="text-sm font-semibold text-slate-400">{label}</span>
            <span className="font-mono text-sm font-black text-slate-100">
              {typeof value === "number" ? formatNumber(value) : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormulaPanel() {
  const rows = [
    ["Status ATK", "Lv/4 + STR + DEX/5 + LUK/3"],
    ["Status MATK", "Lv/4 + INT + INT/2 + DEX/5 + LUK/3"],
    ["HIT", "175 + Lv + DEX + LUK/3 + CON"],
    ["FLEE", "100 + Lv + AGI + LUK/5"],
    ["CRIT", "1 + LUK x 0.3 + CRT x 0.3"],
    ["VCT", "(DEX x 2 + INT) / 530"],
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
      <div className="border-b border-slate-800 bg-slate-950/70 px-4 py-3">
        <h2 className="font-black text-sky-200">Formula Reference</h2>
      </div>
      <div className="divide-y divide-slate-800/80">
        {rows.map(([label, formula]) => (
          <div key={label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 px-4 py-3">
            <span className="text-sm font-semibold text-slate-400">{label}</span>
            <span className="font-mono text-xs font-bold text-slate-200">{formula}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
