import {
  addOgchCooldown,
  getNextOgchLevelRequirement,
  getOgchExpByLevel,
  getOgchLevel,
  getProgressToNextLevel,
} from "@/lib/ogch";
import type { OgchCharacterProgress } from "@/lib/ogch-types";

export type OgchStaticRosterJob = "bishop" | "dancer";

export type StaticRosterCharacterSeed = {
  id: string;
  name: string;
  clearCount: number;
};

export type OgchStaticRosterConfig = {
  activeNav: OgchStaticRosterJob;
  introLabel: string;
  jobLabel: string;
  nextAvailableAt: string;
  sourceLabel: string;
  characters: StaticRosterCharacterSeed[];
};

export type OgchPartyMember = {
  job: OgchStaticRosterJob;
  characterId: string;
};

export type OgchPartyMemberDisplay = OgchPartyMember & {
  key: string;
  name: string;
  jobLabel: string;
};

type StoredStaticRosterCharacter = Pick<
  OgchCharacterProgress,
  "id" | "clearCount" | "lastCompletedAt" | "nextAvailableAt" | "cooldownStatus"
>;

export const OGCH_STATIC_ROSTER_EVENT = "cenlab:ogch-static-roster";
export const OGCH_PARTY_STORAGE_KEY = "cenlab.ogch.party.v1";

const BISHOP_NEXT_AVAILABLE_AT = "2026-06-10T00:00:00+07:00";
const DANCER_NEXT_AVAILABLE_AT = "2026-06-10T00:00:00+07:00";

const BISHOP_CHARACTERS: StaticRosterCharacterSeed[] = [
  { id: "chronos", name: "CHRONOS", clearCount: 49 },
  { id: "molloreena", name: "MOLLOREENA", clearCount: 45 },
  { id: "kimrei", name: "KIMREI", clearCount: 38 },
  { id: "hazele", name: "HAZELE", clearCount: 15 },
  { id: "andromeche", name: "ANDROMECHE", clearCount: 26 },
  { id: "felishar", name: "FELISHAR", clearCount: 19 },
  { id: "karella", name: "KARELLA", clearCount: 18 },
  { id: "queenight", name: "QUEENIGHT", clearCount: 15 },
  { id: "xenodice", name: "XENODICE", clearCount: 19 },
  { id: "pinaaya", name: "PINAAYA", clearCount: 1 },
];

const DANCER_CHARACTERS: StaticRosterCharacterSeed[] = [
  { id: "reefa", name: "REEFA", clearCount: 14 },
  { id: "viorna", name: "VIORNA", clearCount: 1 },
  { id: "catharina", name: "CATHARINA", clearCount: 17 },
  { id: "achilla", name: "ACHILLA", clearCount: 16 },
  { id: "drak", name: "แดร๊ค", clearCount: 16 },
  { id: "hide", name: "ไฮด์", clearCount: 16 },
  { id: "rrag", name: "R rag", clearCount: 2 },
  { id: "bee", name: "บี๋", clearCount: 18 },
];

export const OGCH_STATIC_ROSTERS: Record<OgchStaticRosterJob, OgchStaticRosterConfig> = {
  bishop: {
    activeNav: "bishop",
    characters: BISHOP_CHARACTERS,
    introLabel: "Bishop Dungeon Run Tracker",
    jobLabel: "Bishop",
    nextAvailableAt: BISHOP_NEXT_AVAILABLE_AT,
    sourceLabel: "Local bishop roster",
  },
  dancer: {
    activeNav: "dancer",
    characters: DANCER_CHARACTERS,
    introLabel: "Bard&Dancer Dungeon Run Tracker",
    jobLabel: "Bard&Dancer",
    nextAvailableAt: DANCER_NEXT_AVAILABLE_AT,
    sourceLabel: "Local bard&dancer roster",
  },
};

export function getOgchStaticRosterStorageKey(job: OgchStaticRosterJob): string {
  return `cenlab.ogch.static-roster.${job}.v1`;
}

function notifyStaticRosterChange(job: OgchStaticRosterJob) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OGCH_STATIC_ROSTER_EVENT, { detail: { job } }));
}

export function buildOgchStaticCharacter(
  seed: StaticRosterCharacterSeed,
  jobLabel: string,
  defaultNextAvailableAt: string,
  overrides?: Partial<Pick<OgchCharacterProgress, "clearCount" | "lastCompletedAt" | "nextAvailableAt" | "cooldownStatus">>
): OgchCharacterProgress {
  const clearCount = overrides?.clearCount ?? seed.clearCount;
  const ogchLevel = getOgchLevel(clearCount);
  const progress = getProgressToNextLevel(clearCount);

  return {
    id: seed.id,
    name: seed.name,
    job: jobLabel,
    baseLevel: 225,
    clearCount,
    ogchLevel,
    expReward: getOgchExpByLevel(ogchLevel),
    nextLevelRequirement: getNextOgchLevelRequirement(clearCount),
    progressToNextLevel: {
      current: progress.clearsIntoLevel,
      required: progress.clearsNeededForLevel,
      percentage: progress.percent,
    },
    lastCompletedAt: overrides?.lastCompletedAt ?? null,
    nextAvailableAt: overrides?.nextAvailableAt ?? defaultNextAvailableAt,
    cooldownStatus: overrides?.cooldownStatus ?? "onCooldown",
    remainingCooldownSeconds: 0,
  };
}

function getSeedRoster(job: OgchStaticRosterJob): OgchCharacterProgress[] {
  const config = OGCH_STATIC_ROSTERS[job];
  return config.characters.map((character) =>
    buildOgchStaticCharacter(character, config.jobLabel, config.nextAvailableAt)
  );
}

export function readOgchStaticRoster(job: OgchStaticRosterJob): OgchCharacterProgress[] {
  if (typeof window === "undefined") {
    return getSeedRoster(job);
  }

  const config = OGCH_STATIC_ROSTERS[job];
  const stored = window.localStorage.getItem(getOgchStaticRosterStorageKey(job));
  if (!stored) return getSeedRoster(job);

  try {
    const parsed = JSON.parse(stored) as StoredStaticRosterCharacter[];
    if (!Array.isArray(parsed)) return getSeedRoster(job);

    const storedById = new Map(parsed.map((character) => [character.id, character]));
    return config.characters.map((seed) => {
      const storedCharacter = storedById.get(seed.id);
      return buildOgchStaticCharacter(seed, config.jobLabel, config.nextAvailableAt, storedCharacter);
    });
  } catch {
    return getSeedRoster(job);
  }
}

export function writeOgchStaticRoster(job: OgchStaticRosterJob, characters: OgchCharacterProgress[]) {
  if (typeof window === "undefined") return;

  const storedCharacters: StoredStaticRosterCharacter[] = characters.map((character) => ({
    id: character.id,
    clearCount: character.clearCount,
    lastCompletedAt: character.lastCompletedAt,
    nextAvailableAt: character.nextAvailableAt,
    cooldownStatus: character.cooldownStatus,
  }));

  window.localStorage.setItem(getOgchStaticRosterStorageKey(job), JSON.stringify(storedCharacters));
  notifyStaticRosterChange(job);
}

export function completeOgchStaticRosterMembers(members: OgchPartyMember[], completedAt: Date): OgchPartyMemberDisplay[] {
  const completedMembers: OgchPartyMemberDisplay[] = [];

  (["bishop", "dancer"] as const).forEach((job) => {
    const memberIds = members.filter((member) => member.job === job).map((member) => member.characterId);
    if (memberIds.length === 0) return;

    const config = OGCH_STATIC_ROSTERS[job];
    const nextAvailableAt = addOgchCooldown(completedAt).toISOString();
    const characters = readOgchStaticRoster(job);
    const nextCharacters = characters.map((character) => {
      if (!memberIds.includes(character.id)) return character;

      completedMembers.push({
        characterId: character.id,
        job,
        jobLabel: config.jobLabel,
        key: `${job}:${character.id}`,
        name: character.name,
      });

      return buildOgchStaticCharacter(
        {
          id: character.id,
          name: character.name,
          clearCount: character.clearCount,
        },
        config.jobLabel,
        config.nextAvailableAt,
        {
          clearCount: character.clearCount + 1,
          cooldownStatus: "onCooldown",
          lastCompletedAt: completedAt.toISOString(),
          nextAvailableAt,
        }
      );
    });

    writeOgchStaticRoster(job, nextCharacters);
  });

  return completedMembers;
}

export function readOgchPartySelections(): Record<string, OgchPartyMember[]> {
  if (typeof window === "undefined") return {};

  const stored = window.localStorage.getItem(OGCH_PARTY_STORAGE_KEY);
  if (!stored) return {};

  try {
    const parsed = JSON.parse(stored) as Record<string, OgchPartyMember[]>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

export function writeOgchPartySelections(selections: Record<string, OgchPartyMember[]>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OGCH_PARTY_STORAGE_KEY, JSON.stringify(selections));
}

export function resolveOgchPartyMembers(members: OgchPartyMember[]): OgchPartyMemberDisplay[] {
  return members.flatMap((member) => {
    const config = OGCH_STATIC_ROSTERS[member.job];
    const character = readOgchStaticRoster(member.job).find((item) => item.id === member.characterId);
    if (!character) return [];

    return {
      characterId: character.id,
      job: member.job,
      jobLabel: config.jobLabel,
      key: `${member.job}:${character.id}`,
      name: character.name,
    };
  });
}
