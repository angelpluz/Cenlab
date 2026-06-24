import payload from "./generated/rathena-items.json";
import sankaPayload from "./generated/sanka-items.json";
import { CUSTOM_CALCULATOR_ITEMS, CUSTOM_ITEM_OVERRIDES } from "./custom-calculator-items";
import type {
  RathenaCalculatorItem,
  RathenaItemBonuses,
  RathenaItemPayload,
} from "./rathena-item-types";

export const RATHENA_SOURCE_PAYLOAD = payload as RathenaItemPayload;
export const SANKA_ITEM_PAYLOAD = sankaPayload as RathenaItemPayload;

const RATHENA_SOURCE_BY_ID = new Map(RATHENA_SOURCE_PAYLOAD.items.map((item) => [item.id, item]));
const SANKA_ITEM_IDS = new Set(SANKA_ITEM_PAYLOAD.items.map((item) => item.id));

function isGenericSlot(item: RathenaCalculatorItem): boolean {
  return item.slots.length === 0 || item.slots.every((slot) => slot === "card" || slot === "none");
}

function mergeSankaItem(item: RathenaCalculatorItem): RathenaCalculatorItem {
  const fallback = RATHENA_SOURCE_BY_ID.get(item.id);
  if (!fallback || !isGenericSlot(item) || isGenericSlot(fallback)) return item;

  return {
    ...item,
    aliases: Array.from(new Set([...(item.aliases || []), fallback.name])),
    slots: fallback.slots,
  };
}

const RATHENA_FALLBACK_ITEMS: RathenaCalculatorItem[] = RATHENA_SOURCE_PAYLOAD.items
  .filter((item) => !SANKA_ITEM_IDS.has(item.id))
  .map((item) => ({
    ...item,
    ...(CUSTOM_ITEM_OVERRIDES[item.id] || {}),
  }));

const FALLBACK_ITEM_IDS = new Set(RATHENA_FALLBACK_ITEMS.map((item) => item.id));

export const RATHENA_ITEM_PAYLOAD: RathenaItemPayload = {
  generatedAt: SANKA_ITEM_PAYLOAD.generatedAt,
  source: "ro-calculator.sanka.in.th + rathena fallback",
  sourceUrls: [...SANKA_ITEM_PAYLOAD.sourceUrls, ...RATHENA_SOURCE_PAYLOAD.sourceUrls],
  counts: {
    sanka: {
      read: SANKA_ITEM_PAYLOAD.counts.sanka?.read || SANKA_ITEM_PAYLOAD.items.length,
      kept: SANKA_ITEM_PAYLOAD.items.length,
    },
    rathenaFallback: {
      read: RATHENA_SOURCE_PAYLOAD.items.length,
      kept: RATHENA_FALLBACK_ITEMS.length,
    },
  },
  items: [],
};

export const RATHENA_ITEMS: RathenaCalculatorItem[] = [
  ...SANKA_ITEM_PAYLOAD.items.map(mergeSankaItem),
  ...RATHENA_FALLBACK_ITEMS,
  ...CUSTOM_CALCULATOR_ITEMS.filter((item) => !SANKA_ITEM_IDS.has(item.id) && !FALLBACK_ITEM_IDS.has(item.id)),
];

RATHENA_ITEM_PAYLOAD.items = RATHENA_ITEMS;

const ITEM_BY_ID = new Map(RATHENA_ITEMS.map((item) => [item.id, item]));

export function getRathenaItemById(id: number): RathenaCalculatorItem | undefined {
  return ITEM_BY_ID.get(id);
}

export function combineItemBonuses(items: RathenaCalculatorItem[]): RathenaItemBonuses {
  const combined: RathenaItemBonuses = {};

  for (const item of items) {
    if (!item.bonuses) continue;

    for (const [key, value] of Object.entries(item.bonuses)) {
      if (typeof value !== "number") continue;
      const bonusKey = key as keyof RathenaItemBonuses;
      combined[bonusKey] = (combined[bonusKey] || 0) + value;
    }
  }

  return combined;
}
