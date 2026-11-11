import type { Metadata } from "next";
import RuneTabletGuide from "@/components/rune-tablet/RuneTabletGuide";

export const metadata: Metadata = {
  title: "Rune Tablet | CenLab",
  description: "คู่มือ Rune Tablet ภาษาไทย ตัวอย่าง Rune Set วัตถุดิบ และตัวคำนวณโบนัส +0 ถึง +15 จากข้อมูล kRO",
};

export default function RuneTabletPage() {
  return <RuneTabletGuide />;
}
