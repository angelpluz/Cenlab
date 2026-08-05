import type { Metadata } from "next";
import DailyDungeonGuide from "@/components/daily-dungeon/DailyDungeonGuide";

export const metadata: Metadata = {
  title: "ดันรายวัน | Cenlab",
  description: "Antiquity dungeon, cooldown, Diamond, and reward guide.",
};

export default function DailyDungeonPage() {
  return <DailyDungeonGuide />;
}
