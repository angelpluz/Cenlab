import type {
  WaterDungeonCharacter,
  WaterDungeonGroupId,
  WaterDungeonPartyMember,
  WaterDungeonStatus,
} from "@/lib/water-dungeon-types";
import { findPersonalDataProfile, getPersonalDataSeedProfiles } from "@/lib/personal-data";

type WaterDungeonSeed = {
  id: string;
  name: string;
  groupId: WaterDungeonGroupId;
  nextAvailableAt: string | null;
  note?: string;
  status?: WaterDungeonStatus;
};

export const WATER_DUNGEON_COOLDOWN_SECONDS = 3 * 24 * 60 * 60;
export const WATER_DUNGEON_READY_SOON_SECONDS = 12 * 60 * 60;
export const WATER_DUNGEON_STORAGE_KEY = "cenlab.water-dungeon.roster.v1";
export const WATER_DUNGEON_PARTY_STORAGE_KEY = "cenlab.water-dungeon.party.v1";
export const WATER_DUNGEON_PARTY_EVENT = "cenlab:water-dungeon-party";

export const WATER_DUNGEON_GROUPS: Record<WaterDungeonGroupId, string> = {
  main: "Main Roster",
  alp: "ALP / Gaz / Extreme",
  dancer: "Dancer Set",
  friends: "Friends",
};

function toBangkokDateTime(day: number, month: number, year = 2026): string {
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T00:00:00+07:00`;
}

const WATER_DUNGEON_SEEDS: WaterDungeonSeed[] = [
  { id: "chronos", name: "CHRONOS", groupId: "main", nextAvailableAt: toBangkokDateTime(15, 6) },
  { id: "molloreena", name: "MOLLOREENA", groupId: "main", nextAvailableAt: toBangkokDateTime(17, 6) },
  {
    id: "kimrei",
    name: "KIMREI",
    groupId: "main",
    nextAvailableAt: toBangkokDateTime(10, 6),
    note: "Tonight run",
  },
  { id: "hazele", name: "HAZELE", groupId: "main", nextAvailableAt: toBangkokDateTime(10, 6) },
  { id: "andromeche", name: "ANDROMECHE", groupId: "main", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "felishar", name: "FELISHAR", groupId: "main", nextAvailableAt: toBangkokDateTime(15, 6) },
  { id: "karella", name: "KARELLA", groupId: "main", nextAvailableAt: toBangkokDateTime(10, 6) },
  { id: "queenight", name: "QUEENIGHT", groupId: "main", nextAvailableAt: toBangkokDateTime(15, 6) },
  { id: "xenodice", name: "XENODICE", groupId: "main", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "vanesfranca", name: "VANESFRANCA", groupId: "main", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "pinaaya", name: "PINAAYA", groupId: "main", nextAvailableAt: toBangkokDateTime(17, 6) },

  { id: "francesgaz", name: "FranCesGaz", groupId: "alp", nextAvailableAt: toBangkokDateTime(15, 6) },
  { id: "queenofferia", name: "QueenofFeria", groupId: "alp", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "khrasedraalp", name: "KhrasedraALP", groupId: "alp", nextAvailableAt: null, note: "Never run" },
  { id: "archangelpluz", name: "ArchAngelpluZ", groupId: "alp", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "jessigazalp", name: "JessiGazALP", groupId: "alp", nextAvailableAt: toBangkokDateTime(6, 6) },
  { id: "izanoalp", name: "IzanoALP", groupId: "alp", nextAvailableAt: toBangkokDateTime(14, 6) },
  { id: "souffleextreme", name: "SouffleExtreme", groupId: "alp", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "poweroffranz", name: "PoWerofFranZ", groupId: "alp", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "reginaalp", name: "ReginaALP", groupId: "alp", nextAvailableAt: toBangkokDateTime(15, 6) },
  { id: "junoirextreme", name: "JunoirExtreme", groupId: "alp", nextAvailableAt: toBangkokDateTime(15, 6) },
  { id: "soulalp", name: "SoulALP", groupId: "alp", nextAvailableAt: toBangkokDateTime(17, 6) },

  { id: "catharina", name: "CATHARINA", groupId: "dancer", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "achilla", name: "ACHILLA", groupId: "dancer", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "viorna", name: "VIORNA", groupId: "dancer", nextAvailableAt: toBangkokDateTime(17, 6) },
  {
    id: "reefa-id-4",
    name: "REEFA",
    groupId: "dancer",
    nextAvailableAt: null,
    note: "id 4, no slot yet",
    status: "blocked",
  },
  { id: "penezia-id-7", name: "PENEZIA", groupId: "dancer", nextAvailableAt: toBangkokDateTime(17, 6), note: "id 7" },
  { id: "evelli-id-5", name: "EVELLI", groupId: "dancer", nextAvailableAt: null, note: "id 5, wait for kids group" },

  { id: "hide", name: "พี่ไฮด์", groupId: "friends", nextAvailableAt: toBangkokDateTime(15, 6) },
  { id: "r-rag", name: "R_Rag", groupId: "friends", nextAvailableAt: toBangkokDateTime(15, 6) },
  { id: "nongbaby", name: "NongBaby", groupId: "friends", nextAvailableAt: toBangkokDateTime(15, 6) },
  {
    id: "pdrak-id-08",
    name: "Pแดร๊ค",
    groupId: "friends",
    nextAvailableAt: null,
    note: "id 08, no slot yet",
    status: "blocked",
  },
  { id: "u-ranus", name: "U-ranus", groupId: "friends", nextAvailableAt: toBangkokDateTime(17, 6) },
  { id: "devera-id-07", name: "Devera", groupId: "friends", nextAvailableAt: null, note: "id 07" },
];

const PERSONAL_SEED_PROFILES = getPersonalDataSeedProfiles();

export const WATER_DUNGEON_CHARACTERS: WaterDungeonCharacter[] = WATER_DUNGEON_SEEDS.map((seed) => {
  const personalProfile = findPersonalDataProfile(PERSONAL_SEED_PROFILES, seed.id, seed.name);
  const groupId = personalProfile?.groupId ?? seed.groupId;

  return {
    id: seed.id,
    name: personalProfile?.name ?? seed.name,
    level: personalProfile?.level ?? 1,
    groupId,
    groupLabel: personalProfile?.groupLabel ?? WATER_DUNGEON_GROUPS[groupId],
    clearCount: 0,
    lastCompletedAt: null,
    nextAvailableAt: seed.nextAvailableAt,
    note: seed.note ?? personalProfile?.note ?? null,
    status: seed.status ?? "available",
  };
});

export function addWaterDungeonCooldown(date: Date): Date {
  return new Date(date.getTime() + WATER_DUNGEON_COOLDOWN_SECONDS * 1000);
}

export function getWaterDungeonRemainingSeconds(
  nextAvailableAt: Date | string | null | undefined,
  now = new Date()
): number {
  if (!nextAvailableAt) return 0;

  const availableAt = typeof nextAvailableAt === "string" ? new Date(nextAvailableAt) : nextAvailableAt;
  const remainingMs = availableAt.getTime() - now.getTime();
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

export function getLiveWaterDungeonStatus(
  character: Pick<WaterDungeonCharacter, "nextAvailableAt" | "status">,
  now = new Date()
): WaterDungeonStatus {
  if (character.status === "blocked") return "blocked";

  const remainingSeconds = getWaterDungeonRemainingSeconds(character.nextAvailableAt, now);
  if (remainingSeconds <= 0) return "available";
  if (remainingSeconds <= WATER_DUNGEON_READY_SOON_SECONDS) return "readySoon";
  return "onCooldown";
}

export function formatWaterDungeonRemainingTime(seconds: number): string {
  const remaining = Math.max(0, Math.floor(seconds));
  if (remaining <= 0) return "Ready";

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes.toString().padStart(2, "0")}m`;
  if (hours > 0) return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  return `${Math.max(1, minutes)}m`;
}

export function formatWaterDungeonBangkokDateTime(value: Date | string | null | undefined): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatWaterDungeonBangkokDate(value: Date | string | null | undefined): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(typeof value === "string" ? new Date(value) : value);
}

function notifyWaterDungeonPartyChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(WATER_DUNGEON_PARTY_EVENT));
}

export function readWaterDungeonPartySelections(): Record<string, WaterDungeonPartyMember[]> {
  if (typeof window === "undefined") return {};

  const stored = window.localStorage.getItem(WATER_DUNGEON_PARTY_STORAGE_KEY);
  if (!stored) return {};

  try {
    const parsed = JSON.parse(stored) as Record<string, WaterDungeonPartyMember[]>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

export function writeWaterDungeonPartySelections(selections: Record<string, WaterDungeonPartyMember[]>) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(WATER_DUNGEON_PARTY_STORAGE_KEY, JSON.stringify(selections));
  notifyWaterDungeonPartyChange();
}
