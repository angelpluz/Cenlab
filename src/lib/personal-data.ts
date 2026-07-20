import type { PersonalCharacterProfile, PersonalDataGroupId } from "@/lib/personal-data-types";

type PersonalCharacterSeed = {
  id: string;
  name: string;
  level: number;
  groupId: PersonalDataGroupId;
  note?: string;
  aliases?: string[];
};

type StoredPersonalCharacterProfile = Pick<
  PersonalCharacterProfile,
  "id" | "name" | "level" | "groupId" | "note"
>;

export const PERSONAL_DATA_STORAGE_KEY = "cenlab.personal-data.characters.v1";
export const PERSONAL_DATA_EVENT = "cenlab:personal-data";

export const PERSONAL_DATA_GROUPS: Record<PersonalDataGroupId, string> = {
  main: "Main Roster",
  alp: "ALP / Gaz / Extreme",
  dancer: "Dancer Set",
  friends: "Friends",
};

export const PERSONAL_DATA_GROUP_OPTIONS: { key: PersonalDataGroupId; label: string }[] = [
  { key: "main", label: PERSONAL_DATA_GROUPS.main },
  { key: "alp", label: PERSONAL_DATA_GROUPS.alp },
  { key: "dancer", label: PERSONAL_DATA_GROUPS.dancer },
  { key: "friends", label: PERSONAL_DATA_GROUPS.friends },
];

const PERSONAL_CHARACTER_SEEDS: PersonalCharacterSeed[] = [
  { id: "chronos", name: "CHRONOS", groupId: "main", level: 250 },
  { id: "molloreena", name: "MOLLOREENA", groupId: "main", level: 246 },
  { id: "kimrei", name: "WEIRICIA", groupId: "main", level: 251, aliases: ["KIMREI"] },
  { id: "hazele", name: "HAZELE", groupId: "main", level: 246 },
  { id: "andromeche", name: "ANDROMECHE", groupId: "main", level: 250 },
  { id: "felishar", name: "FELISHAR", groupId: "main", level: 250 },
  { id: "karella", name: "KARELLA", groupId: "main", level: 248 },
  { id: "queenight", name: "QUEENIGHT", groupId: "main", level: 250 },
  { id: "xenodice", name: "XENODICE", groupId: "main", level: 250 },
  { id: "rainna", name: "RAINNA", groupId: "main", level: 250 },
  { id: "vanesfranca", name: "VANESFRANCA", groupId: "main", level: 250 },
  { id: "pinaaya", name: "PINAAYA", groupId: "main", level: 250 },

  { id: "francesgaz", name: "FranCesGaz", groupId: "alp", level: 248 },
  { id: "queenofferia", name: "QueenofFeria", groupId: "alp", level: 250, aliases: ["queen0feria"] },
  { id: "khrasedraalp", name: "KhrasedraALP", groupId: "alp", level: 250, note: "Never run" },
  { id: "archangelpluz", name: "ArchAngelpluZ", groupId: "alp", level: 250 },
  { id: "jessigazalp", name: "JessiGazALP", groupId: "alp", level: 250, aliases: ["jessigaalp"] },
  { id: "izanoalp", name: "IzanoALP", groupId: "alp", level: 246 },
  { id: "souffleextreme", name: "SouffleExtreme", groupId: "alp", level: 246, aliases: ["soufflextreme"] },
  { id: "poweroffranz", name: "PoWerofFranZ", groupId: "alp", level: 250, aliases: ["power0franz"] },
  { id: "reginaalp", name: "ReginaALP", groupId: "alp", level: 250 },
  { id: "junoirextreme", name: "JunoirExtreme", groupId: "alp", level: 246 },
  { id: "kittyalp", name: "KittyALP", groupId: "alp", level: 250 },
  { id: "soulalp", name: "SoulALP", groupId: "alp", level: 250 },

  { id: "catharina", name: "CATHARINA", groupId: "dancer", level: 252 },
  { id: "achilla", name: "ACHILLA", groupId: "dancer", level: 238 },
  { id: "viorna", name: "VIORNA", groupId: "dancer", level: 250 },
  { id: "reefa-id-4", name: "REEFA", groupId: "dancer", level: 220, note: "id 4", aliases: ["reefa"] },
  { id: "penezia-id-7", name: "PENEZIA", groupId: "dancer", level: 200, note: "id 7" },
  { id: "evelli-id-5", name: "EVELLI", groupId: "dancer", level: 200, note: "id 5" },

  { id: "hide", name: "พี่ไฮด์", groupId: "friends", level: 237, aliases: ["ไฮด์"] },
  { id: "r-rag", name: "R_Rag", groupId: "friends", level: 236, aliases: ["rrag", "r rag"] },
  { id: "nongbaby", name: "Baby", groupId: "friends", level: 237, aliases: ["nongbaby"] },
  { id: "pdrak-id-08", name: "Pแดร๊ค", groupId: "friends", level: 214, note: "id 08", aliases: ["drak", "แดร๊ค"] },
  { id: "u-ranus", name: "U-ranus", groupId: "friends", level: 200 },
  { id: "devera-id-07", name: "Devera", groupId: "friends", level: 200, note: "id 07", aliases: ["devera"] },
  { id: "hessia-id-07", name: "HESSIA", groupId: "friends", level: 200, note: "id 07", aliases: ["hessia"] },
  { id: "aidos-id-03", name: "Aidos", groupId: "friends", level: 200, note: "id 03", aliases: ["aidos"] },
  { id: "xineira-id-03", name: "XINEIRA", groupId: "friends", level: 200, note: "id 03", aliases: ["xineira"] },
  { id: "phi-ji-klap-ruam-jo-id-06", name: "พี่จี๊กลับรวมจอ", groupId: "friends", level: 200, note: "id 06" },
  { id: "shootingsling-id-06", name: "ShootingSling", groupId: "friends", level: 200, note: "id 06", aliases: ["shootingsling"] },
  { id: "ceres-id-06", name: "Ceres", groupId: "friends", level: 200, note: "id 06", aliases: ["ceres"] },
  { id: "asda123qasd-id-06", name: "asda123qasd", groupId: "friends", level: 200, note: "id 06", aliases: ["asda123qasd"] },
  { id: "phe0nazalp-id-06", name: "Phe0naZALP", groupId: "friends", level: 200, note: "id 06", aliases: ["phe0nazalp"] },
  { id: "frebuz-id-06", name: "Frebuz", groupId: "friends", level: 200, note: "id 06", aliases: ["frebuz"] },
  { id: "hathor-id-10", name: "Hathor", groupId: "friends", level: 200, note: "id 10", aliases: ["hathor"] },
  { id: "asterea-id-10", name: "ASTEREA", groupId: "friends", level: 200, note: "id 10", aliases: ["asterea"] },
  { id: "ishtar-id-11", name: "Ishtar", groupId: "friends", level: 200, note: "id 11", aliases: ["ishtar"] },
  { id: "sellerdestpalp-id-11", name: "SellerDestpALp", groupId: "friends", level: 200, note: "id 11", aliases: ["sellerdestpalp"] },
  { id: "libertas-id-12", name: "Libertas", groupId: "friends", level: 200, note: "id 12", aliases: ["libertas"] },
  { id: "rngeralpzz-id-12", name: "RNgerALPZZ", groupId: "friends", level: 200, note: "id 12", aliases: ["rngeralpzz"] },
  { id: "thalia-id-13", name: "Thalia", groupId: "friends", level: 200, note: "id 13", aliases: ["thalia"] },
  { id: "forentear-id-13", name: "FORENTEAR", groupId: "friends", level: 200, note: "id 13", aliases: ["forentear"] },
];

function normalizeProfileKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, "");
}

function buildProfile(seed: PersonalCharacterSeed, override?: Partial<StoredPersonalCharacterProfile>): PersonalCharacterProfile {
  const groupId = override?.groupId ?? seed.groupId;
  const level = override?.level === undefined ? seed.level : Math.max(seed.level, override.level);
  const storedName =
    seed.id === "kimrei" && override?.name?.trim().toUpperCase() === "KIMREI"
      ? seed.name
      : override?.name;

  return {
    id: seed.id,
    name: storedName ?? seed.name,
    level: Math.max(1, Math.floor(level)),
    groupId,
    groupLabel: PERSONAL_DATA_GROUPS[groupId],
    note: override?.note ?? seed.note ?? null,
    aliases: seed.aliases ?? [],
  };
}

function getSeedProfiles(): PersonalCharacterProfile[] {
  return PERSONAL_CHARACTER_SEEDS.map((seed) => buildProfile(seed));
}

export function getPersonalDataSeedProfiles(): PersonalCharacterProfile[] {
  return getSeedProfiles();
}

function notifyPersonalDataChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PERSONAL_DATA_EVENT));
}

export function readPersonalDataProfiles(): PersonalCharacterProfile[] {
  if (typeof window === "undefined") return getSeedProfiles();

  const stored = window.localStorage.getItem(PERSONAL_DATA_STORAGE_KEY);
  if (!stored) return getSeedProfiles();

  try {
    const parsed = JSON.parse(stored) as StoredPersonalCharacterProfile[];
    if (!Array.isArray(parsed)) return getSeedProfiles();

    const storedById = new Map(parsed.map((profile) => [profile.id, profile]));
    return PERSONAL_CHARACTER_SEEDS.map((seed) => buildProfile(seed, storedById.get(seed.id)));
  } catch {
    return getSeedProfiles();
  }
}

export function writePersonalDataProfiles(profiles: PersonalCharacterProfile[]) {
  if (typeof window === "undefined") return;

  const storedProfiles: StoredPersonalCharacterProfile[] = profiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    level: profile.level,
    groupId: profile.groupId,
    note: profile.note,
  }));

  window.localStorage.setItem(PERSONAL_DATA_STORAGE_KEY, JSON.stringify(storedProfiles));
  notifyPersonalDataChange();
}

export function resetPersonalDataProfiles() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PERSONAL_DATA_STORAGE_KEY);
  notifyPersonalDataChange();
}

export function findPersonalDataProfile(
  profiles: PersonalCharacterProfile[],
  id: string,
  name?: string
): PersonalCharacterProfile | undefined {
  const keys = [id, name ?? ""].filter(Boolean).map(normalizeProfileKey);

  return profiles.find((profile) => {
    const profileKeys = [profile.id, profile.name, ...profile.aliases].map(normalizeProfileKey);
    return keys.some((key) => profileKeys.includes(key));
  });
}
