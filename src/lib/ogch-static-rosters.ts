import {
  addOgchCooldown,
  getNextOgchLevelRequirement,
  getOgchExpByLevel,
  getOgchLevel,
  getProgressToNextLevel,
} from "@/lib/ogch";
import type { OgchCharacterProgress } from "@/lib/ogch-types";
import { findPersonalDataProfile, readPersonalDataProfiles } from "@/lib/personal-data";

export type OgchStaticRosterJob = "bishop" | "dancer";

export type StaticRosterCharacterSeed = {
  id: string;
  name: string;
  clearCount: number;
  jobLabel?: string;
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
  leaderName?: string;
  leaderJobLabel?: string;
};

export type OgchPartyMemberDisplay = OgchPartyMember & {
  key: string;
  name: string;
  jobLabel: string;
  href?: string;
};

export type OgchPartyLinkDisplay = {
  key: string;
  name: string;
  jobLabel: string;
  href?: string;
};

export type OgchPartyLeader = {
  characterId: string;
  name: string;
  jobLabel: string;
};

type StoredStaticRosterCharacter = Pick<
  OgchCharacterProgress,
  "id" | "clearCount" | "lastCompletedAt" | "nextAvailableAt" | "cooldownStatus"
>;

export const OGCH_STATIC_ROSTER_EVENT = "cenlab:ogch-static-roster";
export const OGCH_PARTY_STORAGE_KEY = "cenlab.ogch.party.v1";
export const OGCH_PARTY_EVENT = "cenlab:ogch-party";
export const OGCH_LOCAL_WINDHAWK_STORAGE_KEY = "cenlab.ogch.local-windhawk.v1";

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
  { id: "rainna", name: "RAINNA", clearCount: 0, jobLabel: "Cardinal" },
  { id: "vanesfranca", name: "VANESFRANCA", clearCount: 0, jobLabel: "Cardinal" },
];

const LOCAL_WINDHAWK_CHARACTERS: StaticRosterCharacterSeed[] = [
  { id: "kittyalp", name: "KittyALP", clearCount: 0, jobLabel: "Windhawk" },
  { id: "soulalp", name: "SoulALP", clearCount: 0, jobLabel: "Windhawk" },
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
    introLabel: "Bishop & Cardinal Dungeon Run Tracker",
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
  const personalProfile = findPersonalDataProfile(readPersonalDataProfiles(), seed.id, seed.name);
  const clearCount = overrides?.clearCount ?? seed.clearCount;
  const ogchLevel = getOgchLevel(clearCount);
  const progress = getProgressToNextLevel(clearCount);

  return {
    id: seed.id,
    name: personalProfile?.name ?? seed.name,
    job: jobLabel,
    baseLevel: personalProfile?.level ?? 225,
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
    nextAvailableAt:
      overrides && "nextAvailableAt" in overrides
        ? overrides.nextAvailableAt ?? null
        : defaultNextAvailableAt,
    cooldownStatus: overrides?.cooldownStatus ?? "onCooldown",
    remainingCooldownSeconds: 0,
  };
}

function getSeedRoster(job: OgchStaticRosterJob): OgchCharacterProgress[] {
  const config = OGCH_STATIC_ROSTERS[job];
  return config.characters.map((character) =>
    buildOgchStaticCharacter(character, character.jobLabel ?? config.jobLabel, config.nextAvailableAt)
  );
}

export function isOgchLocalWindhawk(characterId: string): boolean {
  return LOCAL_WINDHAWK_CHARACTERS.some((character) => character.id === characterId);
}

export function readOgchLocalWindhawks(): OgchCharacterProgress[] {
  const buildCharacter = (
    seed: StaticRosterCharacterSeed,
    storedCharacter?: StoredStaticRosterCharacter
  ) =>
    buildOgchStaticCharacter(seed, seed.jobLabel ?? "Windhawk", "", {
      clearCount: storedCharacter?.clearCount ?? seed.clearCount,
      cooldownStatus: storedCharacter?.cooldownStatus ?? "available",
      lastCompletedAt: storedCharacter?.lastCompletedAt ?? null,
      nextAvailableAt: storedCharacter?.nextAvailableAt ?? null,
    });

  if (typeof window === "undefined") {
    return LOCAL_WINDHAWK_CHARACTERS.map((seed) => buildCharacter(seed));
  }

  const stored = window.localStorage.getItem(OGCH_LOCAL_WINDHAWK_STORAGE_KEY);
  if (!stored) return LOCAL_WINDHAWK_CHARACTERS.map((seed) => buildCharacter(seed));

  try {
    const parsed = JSON.parse(stored) as StoredStaticRosterCharacter[];
    if (!Array.isArray(parsed)) return LOCAL_WINDHAWK_CHARACTERS.map((seed) => buildCharacter(seed));

    const storedById = new Map(parsed.map((character) => [character.id, character]));
    return LOCAL_WINDHAWK_CHARACTERS.map((seed) => buildCharacter(seed, storedById.get(seed.id)));
  } catch {
    return LOCAL_WINDHAWK_CHARACTERS.map((seed) => buildCharacter(seed));
  }
}

export function writeOgchLocalWindhawks(characters: OgchCharacterProgress[]) {
  if (typeof window === "undefined") return;

  const storedCharacters: StoredStaticRosterCharacter[] = characters
    .filter((character) => isOgchLocalWindhawk(character.id))
    .map((character) => ({
      id: character.id,
      clearCount: character.clearCount,
      lastCompletedAt: character.lastCompletedAt,
      nextAvailableAt: character.nextAvailableAt,
      cooldownStatus: character.cooldownStatus,
    }));

  window.localStorage.setItem(OGCH_LOCAL_WINDHAWK_STORAGE_KEY, JSON.stringify(storedCharacters));
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
      return buildOgchStaticCharacter(
        seed,
        seed.jobLabel ?? config.jobLabel,
        config.nextAvailableAt,
        storedCharacter
      );
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
        jobLabel: character.job,
        key: `${job}:${character.id}`,
        name: character.name,
      });

      return buildOgchStaticCharacter(
        {
          id: character.id,
          name: character.name,
          clearCount: character.clearCount,
        },
        character.job,
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

function normalizePartySelections(value: unknown): Record<string, OgchPartyMember[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([leaderId, members]) => {
      if (!Array.isArray(members)) return [];

      const validMembers = members.flatMap((member): OgchPartyMember[] => {
        if (!member || typeof member !== "object") return [];
        const candidate = member as Partial<OgchPartyMember>;
        if (
          (candidate.job !== "bishop" && candidate.job !== "dancer") ||
          typeof candidate.characterId !== "string" ||
          candidate.characterId.length === 0
        ) {
          return [];
        }

        return [
          {
            characterId: candidate.characterId,
            job: candidate.job,
            ...(typeof candidate.leaderName === "string"
              ? { leaderName: candidate.leaderName }
              : {}),
            ...(typeof candidate.leaderJobLabel === "string"
              ? { leaderJobLabel: candidate.leaderJobLabel }
              : {}),
          },
        ];
      });

      return validMembers.length > 0 ? [[leaderId, validMembers]] : [];
    })
  );
}

function normalizePartyLeaders(value: unknown): Record<string, OgchPartyLeader> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([leaderId, leader]) => {
      if (!leader || typeof leader !== "object") return [];
      const candidate = leader as Partial<OgchPartyLeader>;
      if (typeof candidate.name !== "string" || candidate.name.length === 0) return [];

      return [
        [
          leaderId,
          {
            characterId:
              typeof candidate.characterId === "string" ? candidate.characterId : leaderId,
            jobLabel:
              typeof candidate.jobLabel === "string" ? candidate.jobLabel : "Windhawk",
            name: candidate.name,
          },
        ],
      ];
    })
  );
}

function attachPartyLeaderDetails(
  selections: Record<string, OgchPartyMember[]>,
  leaders: Record<string, OgchPartyLeader>
): Record<string, OgchPartyMember[]> {
  return Object.fromEntries(
    Object.entries(selections).map(([leaderId, members]) => {
      const leader = leaders[leaderId];
      if (!leader) return [leaderId, members];

      return [
        leaderId,
        members.map((member) => ({
          ...member,
          leaderJobLabel: leader.jobLabel,
          leaderName: leader.name,
        })),
      ];
    })
  );
}

export function readOgchPartySelections(): Record<string, OgchPartyMember[]> {
  if (typeof window === "undefined") return {};

  const stored = window.localStorage.getItem(OGCH_PARTY_STORAGE_KEY);
  if (!stored) return {};

  try {
    const parsed = JSON.parse(stored) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const parsedRecord = parsed as Record<string, unknown>;

    // Read the short-lived v2 envelope as a migration path, then keep storing the
    // original v1 record shape so older clients remain compatible.
    if (
      parsedRecord.version === 2 &&
      parsedRecord.selections &&
      typeof parsedRecord.selections === "object" &&
      !Array.isArray(parsedRecord.selections)
    ) {
      return attachPartyLeaderDetails(
        normalizePartySelections(parsedRecord.selections),
        normalizePartyLeaders(parsedRecord.leaders)
      );
    }

    return normalizePartySelections(parsed);
  } catch {
    return {};
  }
}

export function readOgchPartyLeaders(): Record<string, OgchPartyLeader> {
  const selections = readOgchPartySelections();
  const profiles = readPersonalDataProfiles();

  return Object.fromEntries(
    Object.entries(selections).map(([leaderId, members]) => {
      const storedLeaderName = members.find((member) => member.leaderName)?.leaderName;
      const storedJobLabel = members.find((member) => member.leaderJobLabel)?.leaderJobLabel;
      const personalProfile = findPersonalDataProfile(
        profiles,
        leaderId,
        storedLeaderName ?? leaderId
      );

      return [
        leaderId,
        {
          characterId: leaderId,
          name: personalProfile?.name ?? storedLeaderName ?? leaderId,
          jobLabel: storedJobLabel ?? "Windhawk",
        },
      ];
    })
  );
}

export function writeOgchPartySelections(
  selections: Record<string, OgchPartyMember[]>,
  leaders: OgchPartyLeader[] = []
) {
  if (typeof window === "undefined") return;

  const suppliedLeaders = new Map(leaders.map((leader) => [leader.characterId, leader]));
  const enrichedSelections = attachPartyLeaderDetails(
    normalizePartySelections(selections),
    Object.fromEntries(suppliedLeaders)
  );
  const serializedState = JSON.stringify(enrichedSelections);

  if (window.localStorage.getItem(OGCH_PARTY_STORAGE_KEY) === serializedState) return;

  window.localStorage.setItem(OGCH_PARTY_STORAGE_KEY, serializedState);
  window.dispatchEvent(new CustomEvent(OGCH_PARTY_EVENT));
}

export function resolveOgchPartyMembers(members: OgchPartyMember[]): OgchPartyMemberDisplay[] {
  return members.flatMap((member) => {
    const config = OGCH_STATIC_ROSTERS[member.job];
    const character = readOgchStaticRoster(member.job).find((item) => item.id === member.characterId);
    if (!character) return [];

    return {
      characterId: character.id,
      job: member.job,
      jobLabel: character.job,
      href: `/ogch/${member.job}#ogch-character-${character.id}`,
      key: `${member.job}:${character.id}`,
      name: character.name,
    };
  });
}
