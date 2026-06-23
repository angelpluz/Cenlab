import type {
  CodexEntry,
  CodexFilter,
  CodexItem,
  CodexMonster,
  CodexTag,
} from "./codex-types";

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function entryMatchesQuery(entry: CodexEntry, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;

  if (entry.type === "item") {
    const item = entry as CodexItem;
    const text = [item.name, item.description, ...(item.tags || [])]
      .join(" ")
      .toLowerCase();
    const itemText = [
      item.category,
      item.slot,
      item.itemType,
      ...(item.effects || []),
      ...(item.sources || []),
    ]
      .join(" ")
      .toLowerCase();
    return text.includes(q) || itemText.includes(q);
  }

  const monster = entry as CodexMonster;
  const text = [monster.name, ...(monster.tags || [])]
    .join(" ")
    .toLowerCase();
  const monsterText = [
    monster.race,
    monster.element,
    monster.size,
    ...(monster.locations || []),
    ...(monster.drops?.map((d) => d.itemName) || []),
  ]
    .join(" ")
    .toLowerCase();
  return text.includes(q) || monsterText.includes(q);
}

export function filterEntries(
  entries: CodexEntry[],
  filter: CodexFilter,
): CodexEntry[] {
  return entries.filter((entry) => {
    if (entry.type !== filter.tab) return false;
    if (!entryMatchesQuery(entry, filter.query)) return false;

    if (filter.tags.length > 0) {
      const hasTag = filter.tags.some((tag) => entry.tags.includes(tag));
      if (!hasTag) return false;
    }

    if (entry.type === "item") {
      const item = entry as CodexItem;
      if (
        filter.itemCategory &&
        filter.itemCategory !== "all" &&
        item.category !== filter.itemCategory
      ) {
        return false;
      }
    }

    if (entry.type === "monster") {
      const monster = entry as CodexMonster;
      if (
        filter.monsterRace &&
        filter.monsterRace !== "all" &&
        monster.race !== filter.monsterRace
      ) {
        return false;
      }
      if (
        filter.monsterElement &&
        filter.monsterElement !== "all" &&
        monster.element !== filter.monsterElement
      ) {
        return false;
      }
      if (
        filter.monsterSize &&
        filter.monsterSize !== "all" &&
        monster.size !== filter.monsterSize
      ) {
        return false;
      }
    }

    return true;
  });
}

export function sortEntries(entries: CodexEntry[]): CodexEntry[] {
  return [...entries].sort((a, b) => a.name.localeCompare(b.name));
}

export function getUniqueTags(entries: CodexEntry[]): CodexTag[] {
  const set = new Set<CodexTag>();
  for (const entry of entries) {
    for (const tag of entry.tags) {
      set.add(tag);
    }
  }
  return Array.from(set).sort();
}

export function formatNumber(value?: number): string {
  if (value === undefined || value === null) return "-";
  return value.toLocaleString("en-US");
}
