import { NextResponse } from "next/server";
import { getRathenaItemById, RATHENA_ITEM_PAYLOAD, RATHENA_ITEMS } from "@/lib/rathena-items";
import type { RathenaCalculatorItem, RathenaItemCategory } from "@/lib/rathena-item-types";

const MAX_LIMIT = 80;

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function itemMatchesQuery(item: RathenaCalculatorItem, query: string): boolean {
  if (!query) return true;

  const text = [
    item.id,
    item.name,
    item.aegisName,
    item.category,
    item.itemType,
    item.subType,
    ...(item.slots || []),
    ...(item.scriptPreview || []),
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(query);
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
  const slot = url.searchParams.get("slot");
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
    return itemMatchesQuery(item, query);
  });

  return NextResponse.json({
    generatedAt: RATHENA_ITEM_PAYLOAD.generatedAt,
    items: filtered.slice(0, limit),
    source: RATHENA_ITEM_PAYLOAD.source,
    total: filtered.length,
  });
}
