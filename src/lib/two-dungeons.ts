import { createDailyDungeonApi } from "@/lib/sakray-api";
import type { SakrayCharacter } from "@/lib/sakray-types";

// Progress and party mappings use their own API and database tables.
export const TWO_DUNGEONS_API = createDailyDungeonApi("/api/two-dungeons");

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
