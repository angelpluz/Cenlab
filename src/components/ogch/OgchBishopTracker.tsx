import OgchStaticRosterTracker, { type StaticRosterCharacterSeed } from "@/components/ogch/OgchStaticRosterTracker";

const BISHOP_NEXT_AVAILABLE_AT = "2026-06-10T00:00:00+07:00";

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

export default function OgchBishopTracker() {
  return (
    <OgchStaticRosterTracker
      activeNav="bishop"
      characters={BISHOP_CHARACTERS}
      introLabel="Bishop Dungeon Run Tracker"
      jobLabel="Bishop"
      nextAvailableAt={BISHOP_NEXT_AVAILABLE_AT}
      sourceLabel="Local bishop roster"
    />
  );
}
