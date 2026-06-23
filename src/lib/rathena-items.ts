import payload from "./generated/rathena-items.json";
import type {
  RathenaCalculatorItem,
  RathenaItemBonuses,
  RathenaItemPayload,
} from "./rathena-item-types";

export const RATHENA_ITEM_PAYLOAD = payload as RathenaItemPayload;

export const RATHENA_ITEMS: RathenaCalculatorItem[] = RATHENA_ITEM_PAYLOAD.items;

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
