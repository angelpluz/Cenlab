/**
 * Fetch item/monster details from Divine Pride API.
 *
 * The ro-calculator.sanka.in.th site uses Divine Pride for item/monster sprites:
 *   https://static.divine-pride.net/images/items/[id].png
 *   https://static.divine-pride.net/images/mobs/png/[id].png
 *
 * Divine Pride database API:
 *   https://www.divine-pride.net/api/database/Item/[id]?apiKey=YOUR_KEY
 *   https://www.divine-pride.net/api/database/Monster/[id]?apiKey=YOUR_KEY
 *
 * Get a free API key at: https://www.divine-pride.net/portal
 *
 * Usage:
 *   DIVINE_PRIDE_API_KEY=your_key node scripts/fetch-divine-pride.js
 *
 * This script reads item IDs from data/statuscal-extracted.json
 * and writes fetched details to data/divine-pride-items.json.
 */

const fs = require("fs");
const path = require("path");

const EXTRACTED_PATH = path.resolve(__dirname, "../data/statuscal-extracted.json");
const OUTPUT_PATH = path.resolve(__dirname, "../data/divine-pride-items.json");

const API_KEY = process.env.DIVINE_PRIDE_API_KEY;
const BASE_URL = "https://www.divine-pride.net/api/database";
const DELAY_MS = 500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function fetchItem(id) {
  const url = `${BASE_URL}/Item/${id}?apiKey=${API_KEY}`;
  return fetchJson(url);
}

async function fetchMonster(id) {
  const url = `${BASE_URL}/Monster/${id}?apiKey=${API_KEY}`;
  return fetchJson(url);
}

async function main() {
  if (!API_KEY) {
    console.error("Error: DIVINE_PRIDE_API_KEY environment variable is required.");
    console.error("Get a free key at https://www.divine-pride.net/portal");
    process.exit(1);
  }

  if (!fs.existsSync(EXTRACTED_PATH)) {
    console.error(`Extracted data not found: ${EXTRACTED_PATH}`);
    console.error("Run: node scripts/extract-statuscal.js");
    process.exit(1);
  }

  const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, "utf-8"));
  const itemIds = extracted.extracted?.itemIds ?? [];
  const monsterImageId = extracted.extracted?.monsterImageId ?? null;

  console.log(`Fetching ${itemIds.length} items and 1 monster from Divine Pride...`);

  const items = [];
  const errors = [];

  for (const id of itemIds) {
    try {
      const data = await fetchItem(id);
      items.push({ id, source: "divine-pride", data });
      console.log(`  ✓ Item ${id}: ${data.name || "(no name)"}`);
    } catch (err) {
      errors.push({ id, type: "item", error: err.message });
      console.error(`  ✗ Item ${id}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  let monster = null;
  if (monsterImageId) {
    try {
      monster = await fetchMonster(monsterImageId);
      console.log(`  ✓ Monster ${monsterImageId}: ${monster.name || "(no name)"}`);
    } catch (err) {
      errors.push({ id: monsterImageId, type: "monster", error: err.message });
      console.error(`  ✗ Monster ${monsterImageId}: ${err.message}`);
    }
  }

  const output = {
    meta: {
      source: "Divine Pride API",
      fetchedAt: new Date().toISOString(),
      apiKeyUsed: API_KEY.slice(0, 4) + "...",
      itemCount: items.length,
      errorCount: errors.length,
    },
    items,
    monster,
    errors,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nSaved to: ${OUTPUT_PATH}`);
  console.log(`Items: ${items.length}, Errors: ${errors.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
