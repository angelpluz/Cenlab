"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  DAILY_DUNGEON_DIAMONDS,
  DAILY_DUNGEON_SOURCE,
  DAILY_DUNGEONS,
  type DailyDungeonDiamond,
} from "@/lib/daily-dungeon-data";

type CooldownFilter = "all" | "1" | "3";
type DiamondFilter = "all" | DailyDungeonDiamond;

const LEVEL_OPTIONS = [110, 130, 140, 160, 170, 180, 200, 215, 220];

const DIAMOND_STYLES: Record<
  DailyDungeonDiamond,
  { badge: string; card: string; dot: string; text: string }
> = {
  pure: {
    badge: "border-cyan-400/35 bg-cyan-950/55 text-cyan-100",
    card: "border-cyan-500/25 bg-cyan-950/25",
    dot: "bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]",
    text: "text-cyan-200",
  },
  black: {
    badge: "border-violet-400/35 bg-violet-950/55 text-violet-100",
    card: "border-violet-500/25 bg-violet-950/25",
    dot: "bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.75)]",
    text: "text-violet-200",
  },
  golden: {
    badge: "border-amber-400/35 bg-amber-950/55 text-amber-100",
    card: "border-amber-500/25 bg-amber-950/25",
    dot: "bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.75)]",
    text: "text-amber-200",
  },
};

const NAV_ITEMS = [
  { href: "/cen-lab", label: "Cen Lab Timer", tone: "cyan" },
  { href: "/ogch", label: "OGCH Tracker", tone: "violet" },
  { href: "/water-dungeon", label: "Water Dungeon", tone: "sky" },
  { href: "/daily-dungeon", label: "ดันรายวัน", tone: "amber", active: true },
  { href: "/personal-data", label: "Personal Data", tone: "emerald" },
  { href: "/exp", label: "EXP", tone: "amber" },
  { href: "/stat-calculator", label: "Stat", tone: "cyan" },
  { href: "/ogch/bishop", label: "Bishop Rounds", tone: "cyan" },
  { href: "/cen-lab/calculator", label: "Public Timer", tone: "emerald" },
] as const;

const NAV_HOVER: Record<(typeof NAV_ITEMS)[number]["tone"], string> = {
  amber: "hover:border-amber-500/40 hover:text-amber-200",
  cyan: "hover:border-cyan-500/40 hover:text-cyan-200",
  emerald: "hover:border-emerald-500/40 hover:text-emerald-200",
  sky: "hover:border-sky-500/40 hover:text-sky-200",
  violet: "hover:border-violet-500/40 hover:text-violet-200",
};

function formatZeny(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function DailyDungeonGuide() {
  const [query, setQuery] = useState("");
  const [cooldown, setCooldown] = useState<CooldownFilter>("1");
  const [diamond, setDiamond] = useState<DiamondFilter>("all");
  const [characterLevel, setCharacterLevel] = useState("all");

  const filteredDungeons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const selectedLevel = characterLevel === "all" ? null : Number(characterLevel);

    return DAILY_DUNGEONS.filter((dungeon) => {
      if (cooldown !== "all" && dungeon.cooldownDays !== Number(cooldown)) return false;
      if (diamond !== "all" && dungeon.diamond !== diamond) return false;
      if (selectedLevel !== null && dungeon.minimumLevel > selectedLevel) return false;
      if (!normalizedQuery) return true;

      const searchableText = [
        dungeon.name,
        DAILY_DUNGEON_DIAMONDS[dungeon.diamond].label,
        ...dungeon.antiquities.flatMap((antiquity) => [
          antiquity.name,
          ...antiquity.rewards.map((reward) => reward.item),
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [characterLevel, cooldown, diamond, query]);

  const dailyCount = DAILY_DUNGEONS.filter((dungeon) => dungeon.cooldownDays === 1).length;
  const threeDayCount = DAILY_DUNGEONS.length - dailyCount;
  const antiquityCount = DAILY_DUNGEONS.reduce(
    (total, dungeon) => total + dungeon.antiquities.length,
    0
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto box-border w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col items-center gap-3 text-center xl:flex-row xl:justify-between xl:text-left">
          <div className="flex w-full flex-col gap-2 xl:w-auto xl:items-start">
            <nav className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:w-auto xl:grid-cols-9">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold transition ${
                    "active" in item && item.active
                      ? "border-amber-400/55 bg-amber-950/45 text-amber-100"
                      : `border-slate-700 bg-slate-950/60 text-slate-300 ${NAV_HOVER[item.tone]}`
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <LogoutButton />
          </div>

          <div className="xl:min-w-[330px] xl:text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-400">
              Antiquity Dungeon Guide
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-amber-200 sm:text-4xl">
              ดันรายวัน
            </h1>
            <p className="mt-1 text-sm text-slate-400">ค้นหาดัน กล่อง Antiquity และของที่สุ่มได้</p>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-950/45 via-slate-900/90 to-violet-950/35 p-5 shadow-2xl sm:p-7">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-950/45 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-amber-200">
                Map Drop System
              </span>
              <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                รวมดันเจี้ยนที่มีโอกาสดรอป Antiquity
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                เมื่อเปิด Antiquity จะสุ่มรับไอเทมที่เกี่ยวข้องกับดันเจี้ยนนั้น รวมถึง Diamond
                ตามระดับของดัน ใช้ช่องค้นหาและตัวกรองเพื่อหาเส้นทางที่เหมาะกับเลเวลของตัวละคร
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "ดันรายวัน", value: dailyCount, tone: "text-cyan-200" },
                { label: "คูลดาวน์ 3 วัน", value: threeDayCount, tone: "text-violet-200" },
                { label: "กล่อง Antiquity", value: antiquityCount, tone: "text-amber-200" },
                { label: "ช่วงเลเวล", value: "110–220", tone: "text-emerald-200" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 backdrop-blur"
                >
                  <p className={`text-2xl font-black ${stat.tone}`}>{stat.value}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-3">
          {(Object.keys(DAILY_DUNGEON_DIAMONDS) as DailyDungeonDiamond[]).map((key) => {
            const info = DAILY_DUNGEON_DIAMONDS[key];
            const style = DIAMOND_STYLES[key];

            return (
              <div
                key={key}
                className={`flex items-center gap-4 rounded-2xl border p-4 ${style.card}`}
              >
                <span className={`h-11 w-11 shrink-0 rotate-45 rounded-xl ${style.dot}`} />
                <div>
                  <p className={`font-black ${style.text}`}>{info.label}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    ขาย NPC {formatZeny(info.sellPrice)} Zeny
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.5fr)_repeat(3,minmax(170px,0.7fr))]">
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                ค้นหา
              </span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ชื่อดัน, Antiquity หรือไอเทม..."
                type="search"
                value={query}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                คูลดาวน์
              </span>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-amber-400/60"
                onChange={(event) => setCooldown(event.target.value as CooldownFilter)}
                value={cooldown}
              >
                <option value="1">รายวัน (1 วัน)</option>
                <option value="3">ทุก 3 วัน</option>
                <option value="all">ทั้งหมด</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                เลเวลตัวละคร
              </span>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-amber-400/60"
                onChange={(event) => setCharacterLevel(event.target.value)}
                value={characterLevel}
              >
                <option value="all">แสดงทุกเลเวล</option>
                {LEVEL_OPTIONS.map((level) => (
                  <option key={level} value={level}>
                    Lv.{level} — ดันที่เข้าได้
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Diamond
              </span>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-amber-400/60"
                onChange={(event) => setDiamond(event.target.value as DiamondFilter)}
                value={diamond}
              >
                <option value="all">ทุกประเภท</option>
                <option value="pure">Pure Diamond</option>
                <option value="black">Black Diamond</option>
                <option value="golden">Golden Diamond</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4">
            <p className="text-sm text-slate-400">
              พบ <span className="font-black text-amber-200">{filteredDungeons.length}</span> ดันเจี้ยน
            </p>
            {(query || cooldown !== "1" || diamond !== "all" || characterLevel !== "all") && (
              <button
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-amber-400/40 hover:text-amber-200"
                onClick={() => {
                  setQuery("");
                  setCooldown("1");
                  setDiamond("all");
                  setCharacterLevel("all");
                }}
                type="button"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </section>

        <section className="mt-5">
          {filteredDungeons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/45 p-12 text-center">
              <p className="text-lg font-black text-slate-300">ไม่พบดันเจี้ยนที่ตรงกับตัวกรอง</p>
              <p className="mt-1 text-sm text-slate-500">ลองเปลี่ยนคำค้นหา เลเวล หรือประเภท Diamond</p>
            </div>
          ) : (
            <div className="grid items-start gap-4 xl:grid-cols-2">
              {filteredDungeons.map((dungeon) => {
                const diamondInfo = DAILY_DUNGEON_DIAMONDS[dungeon.diamond];
                const diamondStyle = DIAMOND_STYLES[dungeon.diamond];
                const rewardCount = dungeon.antiquities.reduce(
                  (total, antiquity) => total + antiquity.rewards.length,
                  0
                );

                return (
                  <article
                    key={dungeon.id}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl transition hover:border-slate-700"
                  >
                    <div className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-emerald-400/25 bg-emerald-950/45 px-2.5 py-1 text-xs font-black text-emerald-200">
                              Lv.{dungeon.minimumLevel}+
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-black ${
                                dungeon.cooldownDays === 1
                                  ? "border-cyan-400/25 bg-cyan-950/45 text-cyan-200"
                                  : "border-violet-400/25 bg-violet-950/45 text-violet-200"
                              }`}
                            >
                              {dungeon.cooldownDays === 1 ? "คูลดาวน์ 1 วัน" : "คูลดาวน์ 3 วัน"}
                            </span>
                          </div>
                          <h3 className="mt-3 text-xl font-black text-white">{dungeon.name}</h3>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black ${diamondStyle.badge}`}
                        >
                          <span className={`h-2.5 w-2.5 rotate-45 rounded-sm ${diamondStyle.dot}`} />
                          {diamondInfo.label}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        {dungeon.antiquities.map((antiquity) => (
                          <div
                            key={antiquity.name}
                            className="rounded-xl border border-slate-800 bg-slate-950/55 px-3.5 py-3"
                          >
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                              Antiquity Drop
                            </p>
                            <p className="mt-1 text-sm font-bold leading-6 text-slate-200">
                              {antiquity.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <details className="group border-t border-slate-800 bg-slate-950/35">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-black text-amber-200 transition hover:bg-amber-950/15 [&::-webkit-details-marker]:hidden">
                        <span>ดูของที่สุ่มได้ ({rewardCount} รายการ)</span>
                        <span className="text-lg transition group-open:rotate-45">+</span>
                      </summary>

                      <div className="space-y-5 border-t border-slate-800 px-4 py-5 sm:px-5">
                        {dungeon.antiquities.map((antiquity) => (
                          <div key={antiquity.name}>
                            <h4 className="mb-2 text-sm font-black leading-6 text-cyan-200">
                              {antiquity.name}
                            </h4>
                            <div className="overflow-x-auto rounded-xl border border-slate-800">
                              <table className="w-full min-w-[460px] border-collapse text-left text-sm">
                                <thead className="bg-slate-900 text-xs uppercase tracking-[0.12em] text-slate-400">
                                  <tr>
                                    <th className="px-3 py-2.5 font-black">ไอเทม</th>
                                    <th className="w-24 px-3 py-2.5 text-center font-black">จำนวน</th>
                                    <th className="w-24 px-3 py-2.5 text-center font-black">Refine</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 bg-slate-950/55">
                                  {antiquity.rewards.map((reward) => (
                                    <tr key={`${antiquity.name}-${reward.item}`}>
                                      <td className="px-3 py-2.5 font-medium text-slate-200">
                                        {reward.item}
                                      </td>
                                      <td className="px-3 py-2.5 text-center font-bold text-emerald-200">
                                        {reward.quantity}
                                      </td>
                                      <td className="px-3 py-2.5 text-center font-bold text-violet-200">
                                        {reward.refine ?? "—"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/45 p-4 text-sm leading-6 text-slate-400">
          <p>
            ข้อมูลอ้างอิงจาก{" "}
            <a
              className="font-bold text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200"
              href={DAILY_DUNGEON_SOURCE.url}
              rel="noreferrer"
              target="_blank"
            >
              {DAILY_DUNGEON_SOURCE.label}
            </a>{" "}
            อัปเดต {DAILY_DUNGEON_SOURCE.updatedAt}
          </p>
          <p className="mt-1 text-rose-300/90">
            เงื่อนไขและรายการไอเทมดรอปอาจมีการปรับเปลี่ยนในอนาคต ราคาขาย Diamond
            ยังไม่รวม Overcharge
          </p>
        </footer>
      </div>
    </main>
  );
}
