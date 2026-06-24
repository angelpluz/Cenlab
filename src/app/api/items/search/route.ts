import { NextResponse } from "next/server";
import { getRathenaItemById, RATHENA_ITEM_PAYLOAD, RATHENA_ITEMS } from "@/lib/rathena-items";
import type { RathenaCalculatorItem, RathenaItemCategory } from "@/lib/rathena-item-types";

const MAX_LIMIT = 80;
const FOURTH_CLASSES = new Set([
  "abysschaser",
  "archmage",
  "biolo",
  "cardinal",
  "dragonknight",
  "elementalmaster",
  "hypernovice",
  "imperialguard",
  "inquisitor",
  "meister",
  "nightwatch",
  "shadowcross",
  "shinkiro",
  "shiranui",
  "skyemperor",
  "soulascetic",
  "spirithandler",
  "troubadour",
  "trouvere",
  "windhawk",
]);

const WEAPON_SUBTYPE_ID_BY_NAME: Record<string, number> = {
  dagger: 256,
  "1hsword": 257,
  "2hsword": 258,
  "1hspear": 259,
  "2hspear": 260,
  "1haxe": 261,
  "2haxe": 262,
  mace: 263,
  staff: 265,
  "2hstaff": 266,
  bow: 267,
  knuckle: 268,
  musical: 269,
  whip: 270,
  book: 271,
  katar: 272,
  revolver: 273,
  rifle: 274,
  gatling: 275,
  shotgun: 276,
  grenade: 277,
  huuma: 278,
};

const WEAPON_SUBTYPE_IDS_BY_CLASS: Record<string, Set<number>> = {
  abysschaser: new Set([256, 257, 267]),
  archmage: new Set([265, 266]),
  biolo: new Set([256, 261, 262, 263]),
  cardinal: new Set([263, 265, 266, 271]),
  dragonknight: new Set([257, 258, 259, 260]),
  elementalmaster: new Set([265, 266]),
  hypernovice: new Set([256, 257, 263, 265]),
  imperialguard: new Set([257, 259, 260]),
  inquisitor: new Set([263, 268]),
  meister: new Set([261, 262, 263]),
  nightwatch: new Set([273, 274, 275, 276, 277]),
  shadowcross: new Set([256, 257, 272]),
  shinkiro: new Set([256, 278]),
  shiranui: new Set([256, 278]),
  skyemperor: new Set([271, 268]),
  soulascetic: new Set([265, 266]),
  spirithandler: new Set([265, 266]),
  troubadour: new Set([256, 267, 269]),
  trouvere: new Set([256, 267, 270]),
  windhawk: new Set([256, 267]),
};

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeClass(value: string): string {
  return normalizeQuery(value).replace(/[\s_-]+/g, "");
}

function itemMatchesQuery(item: RathenaCalculatorItem, query: string): boolean {
  if (!query) return true;

  const text = [
    item.id,
    item.name,
    ...(item.aliases || []),
    item.aegisName,
    item.category,
    item.itemType,
    item.subType,
    ...(item.usableClass || []),
    ...(item.unusableClass || []),
    ...(item.slots || []),
    item.description,
    ...(item.scriptPreview || []),
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(query);
}

function itemMatchesClass(item: RathenaCalculatorItem, characterClass: string): boolean {
  if (!characterClass) return true;

  const requested = normalizeClass(characterClass);
  const usableClasses = item.usableClass?.map(normalizeClass).filter(Boolean) || [];
  const unusableClasses = item.unusableClass?.map(normalizeClass).filter(Boolean) || [];

  if (unusableClasses.includes(requested)) return false;
  if (usableClasses.length === 0) return true;
  if (usableClasses.includes("all") || usableClasses.includes(requested)) return true;
  if (FOURTH_CLASSES.has(requested) && usableClasses.includes("4th")) return true;

  return false;
}

function weaponSubtypeId(item: RathenaCalculatorItem): number | undefined {
  if (typeof item.itemSubTypeId === "number") return item.itemSubTypeId;
  if (!item.subType) return undefined;

  const normalized = item.subType.toLowerCase().replace(/[^a-z0-9]/g, "");
  return WEAPON_SUBTYPE_ID_BY_NAME[normalized];
}

function itemMatchesWeaponSubtype(item: RathenaCalculatorItem, characterClass: string): boolean {
  if (!characterClass || item.category !== "weapon") return true;

  const allowedSubtypes = WEAPON_SUBTYPE_IDS_BY_CLASS[normalizeClass(characterClass)];
  if (!allowedSubtypes) return true;

  const subTypeId = weaponSubtypeId(item);
  if (!subTypeId) return true;

  return allowedSubtypes.has(subTypeId);
}

function parseIds(value: string | null): number[] {
  if (!value) return [];

  return value
    .split(",")
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ids = parseIds(url.searchParams.get("ids"));
  const query = normalizeQuery(url.searchParams.get("q") || "");
  const category = url.searchParams.get("category") as RathenaItemCategory | "all" | null;
  const characterClass = url.searchParams.get("class") || "";
  const slot = url.searchParams.get("slot");
  const subType = normalizeQuery(url.searchParams.get("subType") || "");
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(url.searchParams.get("limit") || 40) || 40)
  );

  if (ids.length > 0 && !query) {
    const selectedItems = ids
      .map((id) => getRathenaItemById(id))
      .filter((item): item is RathenaCalculatorItem => Boolean(item));

    return NextResponse.json({
      generatedAt: RATHENA_ITEM_PAYLOAD.generatedAt,
      items: selectedItems,
      source: RATHENA_ITEM_PAYLOAD.source,
      total: selectedItems.length,
    });
  }

  const filtered = RATHENA_ITEMS.filter((item) => {
    if (category && category !== "all" && item.category !== category) return false;
    if (slot && !item.slots.some((itemSlot) => itemSlot === slot)) return false;
    if (subType && normalizeQuery(item.subType || "") !== subType) return false;
    if (!itemMatchesClass(item, characterClass)) return false;
    if (!itemMatchesWeaponSubtype(item, characterClass)) return false;
    return itemMatchesQuery(item, query);
  });

  return NextResponse.json({
    generatedAt: RATHENA_ITEM_PAYLOAD.generatedAt,
    items: filtered.slice(0, limit),
    source: RATHENA_ITEM_PAYLOAD.source,
    total: filtered.length,
  });
}
