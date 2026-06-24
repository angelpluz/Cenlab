import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const SOURCE_FILES = [
  {
    kind: "equip",
    url: "https://raw.githubusercontent.com/rathena/rathena/master/db/re/item_db_equip.yml",
  },
  {
    kind: "usable",
    url: "https://raw.githubusercontent.com/rathena/rathena/master/db/re/item_db_usable.yml",
  },
  {
    kind: "etc",
    url: "https://raw.githubusercontent.com/rathena/rathena/master/db/re/item_db_etc.yml",
  },
];

const OUTPUT_PATH = path.join(process.cwd(), "src", "lib", "generated", "rathena-items.json");

const BONUS_KEY_MAP = {
  bStr: "str",
  bAgi: "agi",
  bVit: "vit",
  bInt: "int",
  bDex: "dex",
  bLuk: "luk",
  bPow: "pow",
  bSta: "sta",
  bWis: "wis",
  bSpl: "spl",
  bCon: "con",
  bCrt: "crt",
  bBaseAtk: "equipAtk",
  bAtk: "equipAtk",
  bAtkRate: "atkPercent",
  bMatk: "equipMatk",
  bMatkRate: "matkPercent",
  bHit: "hitBonus",
  bFlee: "fleeBonus",
  bCritical: "critBonus",
  bDef: "defBonus",
  bMdef: "mdefBonus",
  bPAtk: "pAtkBonus",
  bSMatk: "sMatkBonus",
  bLongAtkRate: "rangedDamagePercent",
  bShortAtkRate: "meleeDamagePercent",
  bCritAtkRate: "criticalDamagePercent",
  bVariableCastrate: "variableCastPercent",
  bAspdRate: "aspdPercent",
};

const GRADE_RANK = {
  D: 1,
  C: 2,
  B: 3,
  A: 4,
};

const LOCATION_SLOT_MAP = {
  Head_Top: "head-top",
  Head_Mid: "head-mid",
  Head_Low: "head-low",
  Armor: "armor",
  Right_Hand: "weapon",
  Left_Hand: "shield",
  Both_Hand: "weapon",
  Garment: "garment",
  Shoes: "shoes",
  Right_Accessory: "accessory",
  Left_Accessory: "accessory",
  Both_Accessory: "accessory",
  Ammo: "ammo",
  Costume_Head_Top: "costume-head-top",
  Costume_Head_Mid: "costume-head-mid",
  Costume_Head_Low: "costume-head-low",
  Costume_Garment: "costume-garment",
  Shadow_Weapon: "shadow-weapon",
  Shadow_Armor: "shadow-armor",
  Shadow_Shield: "shadow-shield",
  Shadow_Shoes: "shadow-shoes",
  Shadow_Garment: "shadow-garment",
  Shadow_Right_Accessory: "shadow-earring",
  Shadow_Left_Accessory: "shadow-pendant",
};

const WEAPON_SUBTYPE_ID_MAP = {
  Dagger: 256,
  "1hSword": 257,
  "2hSword": 258,
  "1hSpear": 259,
  "2hSpear": 260,
  "1hAxe": 261,
  "2hAxe": 262,
  Mace: 263,
  Staff: 265,
  "2hStaff": 266,
  Bow: 267,
  Knuckle: 268,
  Musical: 269,
  Whip: 270,
  Book: 271,
  Katar: 272,
  Revolver: 273,
  Rifle: 274,
  Gatling: 275,
  Shotgun: 276,
  Grenade: 277,
  Huuma: 278,
};

const NORMALIZED_WEAPON_SUBTYPE_ID_MAP = Object.fromEntries(
  Object.entries(WEAPON_SUBTYPE_ID_MAP).map(([key, value]) => [
    key.toLowerCase().replace(/[^a-z0-9]/g, ""),
    value,
  ])
);

function toNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

function itemCategory(entry) {
  const type = String(entry.Type || "Etc");
  const locations = entry.Locations || {};

  if (type === "Weapon") return "weapon";
  if (type === "Card") return "card";
  if (type === "Ammo") return "ammo";
  if (Object.keys(locations).some((location) => location.startsWith("Costume_"))) return "costume";
  if (Object.keys(locations).some((location) => location.startsWith("Shadow_"))) return "shadow";
  if (type === "Armor") return "armor";
  if (type === "Healing") return "consumable";
  if (type === "Usable" || type === "Delayconsume" || type === "Cash") return "usable";
  return "etc";
}

function itemSlots(entry, category) {
  const rawLocations = entry.Locations && typeof entry.Locations === "object" ? Object.keys(entry.Locations) : [];
  const slots = rawLocations
    .filter((location) => entry.Locations[location])
    .map((location) => LOCATION_SLOT_MAP[location])
    .filter(Boolean);

  if (category === "card" && slots.length === 0) return ["card"];
  if (slots.length === 0) return ["none"];

  return [...new Set(slots)];
}

function weaponSubtypeId(subType) {
  if (!subType) return undefined;

  const normalized = String(subType).toLowerCase().replace(/[^a-z0-9]/g, "");
  return NORMALIZED_WEAPON_SUBTYPE_ID_MAP[normalized];
}

function topLevelScriptLines(script) {
  if (typeof script !== "string") return [];

  const lines = [];
  let depth = 0;

  for (const rawLine of script.split(/\r?\n/)) {
    const line = rawLine.trim();
    const depthBefore = depth;
    if (line && depthBefore === 0) {
      lines.push(line);
    }
    depth += (line.match(/\{/g) || []).length;
    depth -= (line.match(/\}/g) || []).length;
    depth = Math.max(0, depth);
  }

  return lines;
}

function parseTopLevelBonuses(script) {
  const bonuses = {};

  for (const line of topLevelScriptLines(script)) {
    const match = line.match(/^bonus\s+(b[A-Za-z0-9_]+),\s*(-?\d+)\s*;/);
    if (!match) continue;

    const bonusKey = BONUS_KEY_MAP[match[1]];
    if (!bonusKey) continue;

    bonuses[bonusKey] = (bonuses[bonusKey] || 0) + Number(match[2]);
  }

  return bonuses;
}

function mergeRuleCondition(conditions) {
  return conditions.reduce(
    (merged, condition) => ({
      minGrade:
        condition.minGrade &&
        (!merged.minGrade || GRADE_RANK[condition.minGrade] > GRADE_RANK[merged.minGrade])
          ? condition.minGrade
          : merged.minGrade,
      minRefine:
        condition.minRefine && condition.minRefine > (merged.minRefine || 0)
          ? condition.minRefine
          : merged.minRefine,
    }),
    {}
  );
}

function parseIfCondition(line) {
  const refineMatch = line.match(/\.@r\s*>=\s*(\d+)/);
  if (refineMatch) {
    return { minRefine: Number(refineMatch[1]) };
  }

  const gradeMatch = line.match(/\.@g\s*>=\s*ENCHANTGRADE_([DCBA])/);
  if (gradeMatch) {
    return { minGrade: gradeMatch[1] };
  }

  return null;
}

function parseNumericBonus(line) {
  const match = line.match(/^bonus\s+(b[A-Za-z0-9_]+),\s*(-?\d+)\s*;/);
  if (!match) return null;

  const bonusKey = BONUS_KEY_MAP[match[1]];
  if (!bonusKey) return null;

  return { key: bonusKey, value: Number(match[2]) };
}

function countMatches(value, pattern) {
  return (value.match(pattern) || []).length;
}

function parseConditionalBonusRules(script) {
  if (typeof script !== "string") return undefined;

  const rules = [];
  const conditionStack = [];
  let depth = 0;

  for (const rawLine of script.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const leadingCloseCount = (line.match(/^}+/)?.[0].length || 0);
    if (leadingCloseCount > 0) {
      depth = Math.max(0, depth - leadingCloseCount);
      while (conditionStack.length > 0 && depth <= conditionStack[conditionStack.length - 1].openDepth) {
        conditionStack.pop();
      }
    }

    const parsedBonus = parseNumericBonus(line);
    if (parsedBonus && conditionStack.length > 0) {
      const condition = mergeRuleCondition(conditionStack.map((entry) => entry.condition));
      if (condition.minRefine || condition.minGrade) {
        rules.push({
          ...condition,
          bonuses: {
            [parsedBonus.key]: parsedBonus.value,
          },
        });
      }
    }

    const condition = parseIfCondition(line);
    const openCount = countMatches(line, /\{/g);
    const closeCount = countMatches(line, /\}/g) - leadingCloseCount;
    if (condition && openCount > 0) {
      conditionStack.push({ condition, openDepth: depth });
    }

    depth = Math.max(0, depth + openCount - Math.max(0, closeCount));
    while (conditionStack.length > 0 && depth <= conditionStack[conditionStack.length - 1].openDepth) {
      conditionStack.pop();
    }
  }

  return rules.length > 0 ? rules : undefined;
}

function scriptPreview(script) {
  if (typeof script !== "string") return undefined;

  const lines = script
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("bonus"));

  return lines.length > 0 ? [...new Set(lines)].slice(0, 8) : undefined;
}

function shouldInclude(entry, category, bonuses, sourceKind) {
  if (sourceKind === "equip") return category !== "etc";
  if (sourceKind === "usable") return true;
  if (category === "card") return true;
  if (category === "ammo") return true;
  return Object.keys(bonuses).length > 0;
}

function mapEntry(entry, sourceKind) {
  const category = itemCategory(entry);
  const bonuses = parseTopLevelBonuses(entry.Script);
  const bonusRules = parseConditionalBonusRules(entry.Script);

  if (!shouldInclude(entry, category, bonuses, sourceKind)) return null;

  const attack = toNumber(entry.Attack);
  const magicAttack = toNumber(entry.MagicAttack);
  const defense = toNumber(entry.Defense);
  const baseBonuses = { ...bonuses };

  if (attack && category === "weapon") {
    baseBonuses.weaponAtk = (baseBonuses.weaponAtk || 0) + attack;
  } else if (attack) {
    baseBonuses.equipAtk = (baseBonuses.equipAtk || 0) + attack;
  }

  if (magicAttack) {
    baseBonuses.equipMatk = (baseBonuses.equipMatk || 0) + magicAttack;
  }

  if (defense) {
    baseBonuses.defBonus = (baseBonuses.defBonus || 0) + defense;
  }

  return compactObject({
    id: toNumber(entry.Id),
    aegisName: String(entry.AegisName || ""),
    name: String(entry.Name || entry.AegisName || entry.Id),
    category,
    itemType: entry.Type ? String(entry.Type) : undefined,
    subType: entry.SubType ? String(entry.SubType) : undefined,
    itemSubTypeId: category === "weapon" ? weaponSubtypeId(entry.SubType) : undefined,
    slots: itemSlots(entry, category),
    cardSlots: toNumber(entry.Slots),
    equipLevel: toNumber(entry.EquipLevelMin),
    weight: toNumber(entry.Weight),
    attack,
    magicAttack,
    defense,
    weaponLevel: toNumber(entry.WeaponLevel),
    armorLevel: toNumber(entry.ArmorLevel),
    refineable: entry.Refineable === true || undefined,
    gradable: entry.Gradable === true || undefined,
    bonuses: Object.keys(baseBonuses).length > 0 ? baseBonuses : undefined,
    bonusRules,
    scriptPreview: scriptPreview(entry.Script),
  });
}

async function fetchYaml(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function main() {
  const items = [];
  const counts = {};

  for (const source of SOURCE_FILES) {
    const text = await fetchYaml(source.url);
    const parsed = parse(text, { uniqueKeys: false });
    const body = Array.isArray(parsed?.Body) ? parsed.Body : [];
    let kept = 0;

    for (const entry of body) {
      const item = mapEntry(entry, source.kind);
      if (!item) continue;
      items.push(item);
      kept += 1;
    }

    counts[source.kind] = { read: body.length, kept };
  }

  items.sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "rAthena Renewal item database",
    sourceUrls: SOURCE_FILES.map((source) => source.url),
    counts,
    items,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload)}\n`);
  console.log(`Generated ${items.length} items at ${OUTPUT_PATH}`);
  console.log(JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
