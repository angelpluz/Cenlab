import { createDailyDungeonApi } from "@/lib/sakray-api";
import type { SakrayCharacter } from "@/lib/sakray-types";

// Progress and party mappings use their own API and database tables.
export const TWO_DUNGEONS_API = createDailyDungeonApi("/api/two-dungeons");

const WINDHAWK_ORDER = [
  "francesgaz", "junoirextreme", "archangelpluz", "queen0feria", "izanoalp", "reginaalp",
  "khrasedraalp", "soulalp", "power0franz", "kittyalp", "jessigaalp", "soufflextreme",
];
const ROSTER_ALIASES: Record<string, string> = {
  queenofferia: "queen0feria",
  poweroffranz: "power0franz",
  jessigazalp: "jessigaalp",
  souffleextreme: "soufflextreme",
};
const EXCLUDED_CHARACTERS = new Set(["candyselleralp", "canddyselleralp", "candyworkeralp"]);

function rosterKey(value: string): string {
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ROSTER_ALIASES[key] ?? key;
}

export function isTwoDungeonCharacterVisible(character: Pick<SakrayCharacter, "id" | "name">): boolean {
  return !EXCLUDED_CHARACTERS.has(rosterKey(character.id)) && !EXCLUDED_CHARACTERS.has(rosterKey(character.name));
}

export function compareTwoDungeonCharacters(
  left: Pick<SakrayCharacter, "id" | "name" | "role">,
  right: Pick<SakrayCharacter, "id" | "name" | "role">
): number {
  const rank = (character: typeof left) => {
    if (character.role !== "windhawk") return WINDHAWK_ORDER.length;
    const idRank = WINDHAWK_ORDER.indexOf(rosterKey(character.id));
    const nameRank = WINDHAWK_ORDER.indexOf(rosterKey(character.name));
    return idRank >= 0 ? idRank : nameRank >= 0 ? nameRank : WINDHAWK_ORDER.length;
  };
  return rank(left) - rank(right) || left.name.localeCompare(right.name);
}

export function getTwoDungeonMappingChange(
  character: Pick<SakrayCharacter, "id" | "role">,
  selectedPartnerId: string,
  mappings: Record<string, string>
): { windhawkId: string; bishopId: string | null } | null {
  if (character.role === "windhawk") {
    return { windhawkId: character.id, bishopId: selectedPartnerId || null };
  }

  if (selectedPartnerId) {
    return { windhawkId: selectedPartnerId, bishopId: character.id };
  }

  const currentWindhawkId = Object.keys(mappings).find((id) => mappings[id] === character.id);
  return currentWindhawkId ? { windhawkId: currentWindhawkId, bishopId: null } : null;
}
