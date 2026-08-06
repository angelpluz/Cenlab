const BANGKOK_UTC_OFFSET_HOURS = 7;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

export const BANGKOK_GAME_RESET_HOUR = 4;

export function addBangkokGameDayCooldown(
  date: Date,
  gameDays: number,
  resetHour = BANGKOK_GAME_RESET_HOUR
): Date {
  const timestamp = date.getTime();

  if (!Number.isFinite(timestamp)) {
    throw new RangeError("Cannot calculate a game-day reset from an invalid date.");
  }

  if (!Number.isInteger(gameDays) || gameDays < 1) {
    throw new RangeError("Game-day cooldown must be a positive whole number.");
  }

  if (!Number.isInteger(resetHour) || resetHour < 0 || resetHour > 23) {
    throw new RangeError("Reset hour must be between 0 and 23.");
  }

  // Bangkok has no DST. Shift the configured reset to virtual UTC midnight,
  // advance whole game days, then shift the result back.
  const resetShift = (BANGKOK_UTC_OFFSET_HOURS - resetHour) * MILLISECONDS_PER_HOUR;
  const shiftedTimestamp = timestamp + resetShift;
  const gameDayStart = Math.floor(shiftedTimestamp / MILLISECONDS_PER_DAY) * MILLISECONDS_PER_DAY;
  const nextReset = gameDayStart + gameDays * MILLISECONDS_PER_DAY;

  return new Date(nextReset - resetShift);
}
