export type OgchCooldownStatus = "available" | "onCooldown" | "readySoon";

export type OgchLevelInfo = {
  level: number;
  requirement: number;
  exp: string;
};

export type OgchProgressInfo = {
  level: number;
  currentRequirement: number;
  nextRequirement: number | null;
  clearsIntoLevel: number;
  clearsNeededForLevel: number | null;
  percent: number;
  label: string;
};

export const OGCH_COOLDOWN_SECONDS = 3 * 24 * 60 * 60;
export const READY_SOON_SECONDS = 12 * 60 * 60;

export const OGCH_LEVEL_TABLE: OgchLevelInfo[] = [
  { level: 1, requirement: 0, exp: "600000000" },
  { level: 2, requirement: 5, exp: "750000000" },
  { level: 3, requirement: 11, exp: "900000000" },
  { level: 4, requirement: 18, exp: "1050000000" },
  { level: 5, requirement: 26, exp: "1200000000" },
  { level: 6, requirement: 35, exp: "1350000000" },
  { level: 7, requirement: 45, exp: "1500000000" },
  { level: 8, requirement: 60, exp: "1650000000" },
  { level: 9, requirement: 80, exp: "1800000000" },
  { level: 10, requirement: 100, exp: "2000000000" },
];

export function getOgchLevel(clearCount: number): number {
  const normalizedCount = Math.max(0, Math.floor(clearCount));
  return [...OGCH_LEVEL_TABLE]
    .reverse()
    .find((entry) => normalizedCount >= entry.requirement)?.level ?? 1;
}

export function getOgchExpByLevel(level: number): string {
  return OGCH_LEVEL_TABLE.find((entry) => entry.level === level)?.exp ?? OGCH_LEVEL_TABLE[0].exp;
}

export function getNextOgchLevelRequirement(clearCount: number): number | null {
  const level = getOgchLevel(clearCount);
  return OGCH_LEVEL_TABLE.find((entry) => entry.level === level + 1)?.requirement ?? null;
}

export function getProgressToNextLevel(clearCount: number): OgchProgressInfo {
  const normalizedCount = Math.max(0, Math.floor(clearCount));
  const level = getOgchLevel(normalizedCount);
  const currentRequirement =
    OGCH_LEVEL_TABLE.find((entry) => entry.level === level)?.requirement ?? OGCH_LEVEL_TABLE[0].requirement;
  const nextRequirement = getNextOgchLevelRequirement(normalizedCount);

  if (nextRequirement === null) {
    return {
      level,
      currentRequirement,
      nextRequirement,
      clearsIntoLevel: normalizedCount - currentRequirement,
      clearsNeededForLevel: null,
      percent: 100,
      label: "MAX LEVEL",
    };
  }

  const clearsNeededForLevel = nextRequirement - currentRequirement;
  const clearsIntoLevel = normalizedCount - currentRequirement;
  const percent = Math.min(100, Math.max(0, (clearsIntoLevel / clearsNeededForLevel) * 100));

  return {
    level,
    currentRequirement,
    nextRequirement,
    clearsIntoLevel,
    clearsNeededForLevel,
    percent,
    label: `${clearsIntoLevel}/${clearsNeededForLevel} clears to Lv ${level + 1}`,
  };
}

export function getRemainingCooldownSeconds(nextAvailableAt: Date | string | null | undefined, now = new Date()): number {
  if (!nextAvailableAt) return 0;

  const availableAt = typeof nextAvailableAt === "string" ? new Date(nextAvailableAt) : nextAvailableAt;
  const remainingMs = availableAt.getTime() - now.getTime();
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

export function getCooldownStatus(nextAvailableAt: Date | string | null | undefined, now = new Date()): OgchCooldownStatus {
  const remainingSeconds = getRemainingCooldownSeconds(nextAvailableAt, now);

  if (remainingSeconds <= 0) return "available";
  if (remainingSeconds <= READY_SOON_SECONDS) return "readySoon";
  return "onCooldown";
}

export function normalizeCooldownStatus(status: string | null | undefined): OgchCooldownStatus {
  if (status === "onCooldown" || status === "on_cooldown") return "onCooldown";
  if (status === "readySoon" || status === "ready_soon") return "readySoon";
  return "available";
}

export function getLiveCooldownStatus(
  nextAvailableAt: Date | string | null | undefined,
  backendStatus: string | null | undefined,
  now = new Date()
): OgchCooldownStatus {
  if (nextAvailableAt) return getCooldownStatus(nextAvailableAt, now);
  return normalizeCooldownStatus(backendStatus);
}

export function formatRemainingTime(seconds: number): string {
  const remaining = Math.max(0, Math.floor(seconds));
  if (remaining <= 0) return "Ready";

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes.toString().padStart(2, "0")}m`;
  if (hours > 0) return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  return `${Math.max(1, minutes)}m`;
}

export function addOgchCooldown(date: Date): Date {
  return new Date(date.getTime() + OGCH_COOLDOWN_SECONDS * 1000);
}

export function formatExp(exp: string | number): string {
  return new Intl.NumberFormat("en-US").format(Number(exp));
}

export function formatBangkokDateTime(value: Date | string | null | undefined): string {
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
