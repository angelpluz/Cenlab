/**
 * Extract structured JSON data from src/lib/statecal.html
 * The HTML is a saved dump of ro-calculator.sanka.in.th showing:
 *   - character input build
 *   - calculated stats
 *   - equipment summary
 *   - costume/shadow/consumable bonuses
 *
 * Run with: node scripts/extract-statuscal.js
 */

const fs = require("fs");
const path = require("path");

const HTML_PATH = path.resolve(__dirname, "../src/lib/statecal.html");
const OUTPUT_PATH = path.resolve(__dirname, "../data/statuscal-extracted.json");

function stripHtmlTags(html) {
  return html
    .replace(/<span[^>]*>/g, "")
    .replace(/<\/span>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/^\s*\d+\s*/gm, "")
    .trim();
}

function extractPreBlocks(html) {
  const blocks = [];
  const regex = /<pre[^>]*>([\s\S]*?)<\/pre>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const cleaned = stripHtmlTags(match[1]);
    blocks.push(cleaned);
  }
  return blocks;
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractEquipmentNames(html) {
  const names = new Set();
  const regex = /"([^"]+)"/g;
  let match;

  const equipmentSection = html.match(/"equipments":\s*\[([\s\S]*?)\]/);
  if (equipmentSection) {
    const content = equipmentSection[1];
    while ((match = regex.exec(content)) !== null) {
      const name = match[1].trim();
      if (name.length > 1 && name !== ",") {
        names.add(name);
      }
    }
  }

  return Array.from(names);
}

function extractItemIds(parsedBuild) {
  const ids = new Set();
  const itemKeys = [
    "weapon",
    "weaponCard1",
    "weaponCard2",
    "weaponEnchant2",
    "ammo",
    "headUpper",
    "headUpperCard",
    "headUpperEnchant2",
    "headUpperEnchant3",
    "headMiddle",
    "headLower",
    "armor",
    "armorEnchant1",
    "armorEnchant2",
    "armorEnchant3",
    "garment",
    "garmentCard",
    "boot",
    "bootCard",
    "bootEnchant2",
    "bootEnchant3",
    "accLeft",
    "accLeftCard",
    "accLeftEnchant2",
    "accLeftEnchant3",
    "accRight",
    "accRightCard",
    "costumeUpper",
    "costumeEnchantUpper",
    "costumeEnchantMiddle",
    "costumeEnchantLower",
    "costumeEnchantGarment",
    "costumeEnchantGarment2",
    "costumeEnchantGarment4",
    "shadowWeapon",
    "shadowArmor",
    "shadowShield",
    "shadowBoot",
    "shadowEarring",
    "shadowPendant",
    "consumables",
    "consumables2",
    "aspdPotion",
    "aspdPotions",
  ];

  for (const key of itemKeys) {
    const value = parsedBuild?.[key];
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const id of value) {
        if (typeof id === "number" && id > 0) ids.add(id);
      }
    } else if (typeof value === "number" && value > 0) {
      ids.add(value);
    }
  }

  return Array.from(ids).sort((a, b) => a - b);
}

function main() {
  if (!fs.existsSync(HTML_PATH)) {
    console.error(`HTML file not found: ${HTML_PATH}`);
    process.exit(1);
  }

  const html = fs.readFileSync(HTML_PATH, "utf-8");
  const preBlocks = extractPreBlocks(html);

  const parsedBlocks = preBlocks
    .map((text, index) => ({ index, text, data: tryParseJson(text) }))
    .filter((b) => b.data !== null);

  const buildBlock = parsedBlocks.find((b) => b.data?.class !== undefined);
  const resultBlock = parsedBlocks.find((b) => b.data?.hp !== undefined && b.data?.monster !== undefined);
  const equipmentSummaryBlock = parsedBlocks.find((b) => b.data?.weapon?.atkPercent !== undefined);
  const costumeShadowBlock = parsedBlocks.find((b) => b.data?.costumeUpper !== undefined);

  const equipmentNames = resultBlock?.data?.equipments ?? [];
  const itemIds = buildBlock ? extractItemIds(buildBlock.data) : [];

  const monsterIdMatch = html.match(/images\/mobs\/png\/(\d+)\.png/);
  const monsterImageId = monsterIdMatch ? Number(monsterIdMatch[1]) : null;

  const output = {
    meta: {
      source: "ro-calculator.sanka.in.th saved HTML dump",
      extractedAt: new Date().toISOString(),
      htmlPath: HTML_PATH,
    },
    characterBuild: buildBlock?.data ?? null,
    calculatedResult: resultBlock?.data ?? null,
    equipmentSummary: equipmentSummaryBlock?.data ?? null,
    costumeShadowConsumables: costumeShadowBlock?.data ?? null,
    extracted: {
      equipmentNames,
      itemIds,
      monsterImageId,
      monsterName: resultBlock?.data?.monster?.name ?? null,
      monsterLevel: resultBlock?.data?.monster?.level ?? null,
      selectedSkill: buildBlock?.data?.selectedAtkSkill ?? null,
    },
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Extracted data saved to: ${OUTPUT_PATH}`);
  console.log(`  - Parsed JSON blocks: ${parsedBlocks.length}/${preBlocks.length}`);
  console.log(`  - Equipment names: ${equipmentNames.length}`);
  console.log(`  - Item IDs: ${itemIds.length}`);
  console.log(`  - Monster image ID: ${monsterImageId}`);
}

main();
