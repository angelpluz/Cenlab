import type { Metadata } from "next";
import SakrayTracker from "@/components/sakray/SakrayTracker";

export const metadata: Metadata = {
  title: "สองดัน — Lasgand + Sakray | CenLab",
  description: "ติดตามรอบ Lasgand + Sakray สำหรับ Cardinal และ Windhawk คูลดาวน์รีเซ็ตตี 4 ตามเวลาไทย",
};

export default function TwoDungeonsPage() {
  return <SakrayTracker variant="two-dungeons" />;
}
