import fs from "node:fs/promises";
import path from "node:path";

const SOURCE_URL = "https://ro-calculator.sanka.in.th/assets/demo/data/item.json";
const OUTPUT_PATH = path.join(process.cwd(), "src", "lib", "generated", "sanka-items.json");

const ITEM_TYPE_CATEGORY_MAP = {
  1: "weapon",
  2: "armor",
  3: "usable",
  4: "ammo",
  6: "card",
  9: "costume",
  10: "shadow",
  11: "card",
  3333: "usable",
};

const ARMOR_SUBTYPE_SLOT_MAP = {
  510: "accessory",
  511: "accessory",
  512: "head-top",
  513: "armor",
  514: "shield",
  515: "garment",
  516: "shoes",
};

const COSTUME_SUBTYPE_SLOT_MAP = {
  519: "costume-head-top",
  520: "costume-head-mid",
  521: "costume-head-low",
  522: "costume-garment",
  9519: "costume-head-top",
};

const SHADOW_SUBTYPE_SLOT_MAP = {
  280: "shadow-weapon",
  526: "shadow-armor",
  527: "shadow-shield",
  528: "shadow-shoes",
  529: "shadow-earring",
  530: "shadow-pendant",
};

const SCRIPT_BONUS_KEY_MAP = {
  agi: "agi",
  aspdPercent: "aspdPercent",
  atk: "equipAtk",
  atkPercent: "atkPercent",
  con: "con",
  cri: "critBonus",
  criDmg: "criticalDamagePercent",
  crt: "crt",
  def: "defBonus",
  dex: "dex",
  flee: "fleeBonus",
  hit: "hitBonus",
  int: "int",
  luk: "luk",
  matk: "equipMatk",
  matkPercent: "matkPercent",
  mdef: "mdefBonus",
  melee: "meleeDamagePercent",
  pAtk: "pAtkBonus",
  pow: "pow",
  range: "rangedDamagePercent",
  sMatk: "sMatkBonus",
  spl: "spl",
  sta: "sta",
  str: "str",
  variableCastPercent: "variableCastPercent",
  vct: "variableCastPercent",
  vit: "vit",
  wis: "wis",
};

function stripColorCodes(value) {
  return String(value || "").replace(/\^[0-9A-Fa-f]{6}/g, "").replace(/\^000000/g, "");
}

function normalizeText(value) {
  return stripColorCodes(value).replace(/\r/g, "").trim();
}

function itemCategory(entry) {
  return ITEM_TYPE_CATEGORY_MAP[entry.itemTypeId] || "etc";
}

function textIncludesAny(value, patterns) {
  const text = value.toLowerCase();
  return patterns.some((pattern) => text.includes(pattern));
}

function cardSlotFromDescription(description) {
  if (!description) return null;
  const text = normalizeText(description);
  const lowered = text.toLowerCase();

  if (textIncludesAny(lowered, ["ใช้กับ : weapon", "use with : weapon", "compound on : weapon"])) return "weapon";
  if (textIncludesAny(lowered, ["ใช้กับ : armor", "compound on : armor"])) return "armor";
  if (textIncludesAny(lowered, ["ใช้กับ : shield", "compound on : shield"])) return "shield";
  if (textIncludesAny(lowered, ["ใช้กับ : garment", "compound on : garment"])) return "garment";
  if (textIncludesAny(lowered, ["ใช้กับ : shoes", "compound on : shoes", "ใช้กับ : footgear"])) return "shoes";
  if (textIncludesAny(lowered, ["ใช้กับ : accessory", "compound on : accessory"])) return "accessory";
  if (textIncludesAny(lowered, ["ใช้กับ : headgear", "compound on : headgear"])) {
    return ["head-top", "head-mid", "head-low"];
  }

  return null;
}

function armorSlot(entry, description) {
  const subtypeSlot = ARMOR_SUBTYPE_SLOT_MAP[entry.itemSubTypeId];
  if (subtypeSlot) return [subtypeSlot];

  const text = normalizeText(description).toLowerCase();
  if (text.includes("ประเภท : headgear") || text.includes("class: headgear")) {
    if (text.includes("ตำแหน่ง : upper")) return ["head-top"];
    if (text.includes("ตำแหน่ง : middle")) return ["head-mid"];
    if (text.includes("ตำแหน่ง : lower")) return ["head-low"];
    return ["head-top"];
  }
  if (text.includes("ประเภท : armor") || text.includes("class: armor")) return ["armor"];
  if (text.includes("ประเภท : shield") || text.includes("class: shield")) return ["shield"];
  if (text.includes("ประเภท : garment") || text.includes("class: garment")) return ["garment"];
  if (text.includes("ประเภท : shoes") || text.includes("class: shoes")) return ["shoes"];
  if (text.includes("accessory")) return ["accessory"];

  return ["none"];
}

function costumeSlot(entry, description) {
  const subtypeSlot = COSTUME_SUBTYPE_SLOT_MAP[entry.itemSubTypeId];
  if (subtypeSlot) return [subtypeSlot];

  const location = String(entry.location || "").toLowerCase();
  const text = normalizeText(description).toLowerCase();
  if (location.includes("middle") || text.includes("ตำแหน่ง : middle") || text.includes("location: middle")) {
    return ["costume-head-mid"];
  }
  if (location.includes("lower") || text.includes("ตำแหน่ง : lower")) return ["costume-head-low"];
  if (location.includes("garment") || text.includes("ตำแหน่ง : garment")) return ["costume-garment"];
  return ["costume-head-top"];
}

function shadowSlot(entry, description) {
  const subtypeSlot = SHADOW_SUBTYPE_SLOT_MAP[entry.itemSubTypeId];
  if (subtypeSlot) return [subtypeSlot];

  const location = String(entry.location || "").toLowerCase();
  const text = normalizeText(description).toLowerCase();
  if (location.includes("weapon") || text.includes("ตำแหน่ง : weapon")) return ["shadow-weapon"];
  if (location.includes("armor") || text.includes("ตำแหน่ง : armor")) return ["shadow-armor"];
  if (location.includes("shield") || text.includes("ตำแหน่ง : shield")) return ["shadow-shield"];
  if (location.includes("shoes") || text.includes("ตำแหน่ง : shoes")) return ["shadow-shoes"];
  if (location.includes("earring") || text.includes("ตำแหน่ง : earring")) return ["shadow-earring"];
  if (location.includes("pendant") || text.includes("ตำแหน่ง : pendant")) return ["shadow-pendant"];

  return ["none"];
}

function itemSlots(entry, category, description) {
  if (category === "weapon") return ["weapon"];
  if (category === "ammo") return ["ammo"];
  if (category === "costume") return costumeSlot(entry, description);
  if (category === "shadow") return shadowSlot(entry, description);
  if (category === "armor") return armorSlot(entry, description);
  if (category === "card" && entry.itemTypeId === 11) return ["card"];
  if (category === "card") {
    const cardSlot = cardSlotFromDescription(description);
    if (Array.isArray(cardSlot)) return cardSlot;
    if (cardSlot) return [cardSlot];
    return ["card"];
  }

  return ["none"];
}

function firstNumericValue(values) {
  if (!Array.isArray(values)) return null;

  for (const value of values) {
    const text = String(value).trim();
    if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text);
  }

  return null;
}

function mergeBonus(target, key, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  target[key] = (target[key] || 0) + value;
}

function parseScriptBonuses(script) {
  const bonuses = {};
  if (!script || typeof script !== "object" || Array.isArray(script)) return bonuses;

  for (const [scriptKey, values] of Object.entries(script)) {
    const value = firstNumericValue(values);
    if (value === null) continue;

    if (scriptKey === "allStatus") {
      for (const key of ["str", "agi", "vit", "int", "dex", "luk"]) mergeBonus(bonuses, key, value);
      continue;
    }

    if (scriptKey === "allTrait") {
      for (const key of ["pow", "sta", "wis", "spl", "con", "crt"]) mergeBonus(bonuses, key, value);
      continue;
    }

    const bonusKey = SCRIPT_BONUS_KEY_MAP[scriptKey];
    if (bonusKey) mergeBonus(bonuses, bonusKey, value);
  }

  return bonuses;
}

function scriptPreview(script) {
  if (!script || typeof script !== "object" || Array.isArray(script)) return undefined;

  const lines = Object.entries(script)
    .slice(0, 24)
    .map(([key, values]) => `${key}: ${Array.isArray(values) ? values.join(", ") : String(values)}`);

  return lines.length > 0 ? lines : undefined;
}

function normalizeItem(entry) {
  const category = itemCategory(entry);
  const description = normalizeText(entry.description);
  const slots = itemSlots(entry, category, description);
  const bonuses = parseScriptBonuses(entry.script);
  const preview = scriptPreview(entry.script);

  return {
    id: Number(entry.id),
    aegisName: entry.aegisName ? String(entry.aegisName) : `Sanka_${entry.id}`,
    name: String(entry.name || entry.unidName || entry.aegisName || entry.id),
    category,
    itemType: category === "card" && entry.itemTypeId === 11 ? "Enchant" : String(entry.itemTypeId),
    subType: category === "card" && entry.itemTypeId === 11 ? "Enchant" : undefined,
    itemSubTypeId: typeof entry.itemSubTypeId === "number" ? entry.itemSubTypeId : undefined,
    slots,
    cardSlots: typeof entry.slots === "number" ? entry.slots : undefined,
    equipLevel: typeof entry.requiredLevel === "number" ? entry.requiredLevel : undefined,
    weight: typeof entry.weight === "number" ? entry.weight : undefined,
    attack: typeof entry.attack === "number" ? entry.attack : undefined,
    defense: typeof entry.defense === "number" ? entry.defense : undefined,
    weaponLevel: category === "weapon" && typeof entry.itemLevel === "number" ? entry.itemLevel : undefined,
    armorLevel:
      (category === "armor" || category === "shadow") && typeof entry.itemLevel === "number" ? entry.itemLevel : undefined,
    refineable: category === "weapon" || category === "armor" || category === "shadow" ? true : undefined,
    gradable: entry.canGrade === true ? true : undefined,
    usableClass: Array.isArray(entry.usableClass) ? entry.usableClass.map(String) : undefined,
    unusableClass: Array.isArray(entry.unusableClass) ? entry.unusableClass.map(String) : undefined,
    description: description || undefined,
    propertyAtk: entry.propertyAtk ? String(entry.propertyAtk) : undefined,
    bonuses: Object.keys(bonuses).length > 0 ? bonuses : undefined,
    scriptPreview: preview,
  };
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

async function main() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) throw new Error(`Failed to download ${SOURCE_URL}: ${response.status}`);

  const text = (await response.text()).replace(/^\uFEFF/, "");
  const source = JSON.parse(text);
  const entries = Object.values(source).filter((entry) => entry && Number.isInteger(Number(entry.id)));
  const items = entries.map((entry) => compactObject(normalizeItem(entry))).sort((a, b) => a.id - b.id);

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "ro-calculator.sanka.in.th",
    sourceUrls: [SOURCE_URL],
    counts: {
      sanka: {
        read: entries.length,
        kept: items.length,
      },
    },
    items,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload)}\n`, "utf8");
  console.log(`Generated ${items.length} Sanka items at ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
