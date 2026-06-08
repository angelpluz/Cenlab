import OgchStaticRosterTracker, { type StaticRosterCharacterSeed } from "@/components/ogch/OgchStaticRosterTracker";

const DANCER_NEXT_AVAILABLE_AT = "2026-06-10T00:00:00+07:00";

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

export default function OgchDancerTracker() {
  return (
    <OgchStaticRosterTracker
      activeNav="dancer"
      characters={DANCER_CHARACTERS}
      introLabel="Bard&Dancer Dungeon Run Tracker"
      jobLabel="Bard&Dancer"
      nextAvailableAt={DANCER_NEXT_AVAILABLE_AT}
      sourceLabel="Local bard&dancer roster"
    />
  );
}
