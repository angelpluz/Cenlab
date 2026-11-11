"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  calculateRuneMetric,
  filterRuneSets,
  RUNE_EPISODES,
  RUNE_TABLET,
  type RuneSet,
} from "@/lib/rune-tablet";

const SECTIONS = [
  { id: "overview", label: "เริ่มต้นใช้งาน", number: "01" },
  { id: "sets", label: "Rune Set", number: "02" },
  { id: "calculator", label: "คำนวณโบนัส", number: "03" },
  { id: "materials", label: "วัตถุดิบ & ร้านแลก", number: "04" },
  { id: "npcs", label: "NPC & อัปเดต", number: "05" },
  { id: "glossary", label: "ศัพท์ & แหล่งข้อมูล", number: "06" },
] as const;

type Section = (typeof SECTIONS)[number]["id"];
const number = (value: number) => value.toLocaleString("en-US");
const control = "min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/25";
const button = "rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-sm font-bold text-violet-200 transition hover:border-violet-300 hover:bg-violet-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan-300 underline decoration-cyan-800 underline-offset-4 hover:text-cyan-100">{children}<span className="sr-only"> (เปิดแท็บใหม่)</span></a>;
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <div className="mb-6 max-w-3xl">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">{eyebrow}</p>
    <h2 className="text-2xl font-black text-slate-100 sm:text-3xl">{title}</h2>
    <p className="mt-3 text-sm leading-7 text-slate-400">{children}</p>
  </div>;
}

function SetCard({ set, onCalculate }: { set: RuneSet; onCalculate: () => void }) {
  return <article className="flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-violet-500/40">
    <div className="flex items-center gap-4">
      <Image src={set.imageSrc} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-xl object-contain" />
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-widest text-violet-300">{set.episode} <span className="mx-1 text-slate-600">/</span> {set.pieceCount} ชิ้น</p>
        <h3 className="mt-1 break-words text-xl font-black text-slate-100">{set.name}</h3>
        <p className="mt-1 text-sm text-slate-400">{set.playstyle}</p>
      </div>
    </div>
    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs font-medium text-slate-400">ค่าเปิดเซ็ต</p>
      <dl className="mt-2 grid grid-cols-2 gap-3">
        <div><dt className="text-xs text-slate-500">Imperfect Rune</dt><dd className="mt-1 text-xl font-black tabular-nums text-cyan-200">{number(set.imperfectRunes)}</dd></div>
        <div><dt className="text-xs text-slate-500">Perfect Rune</dt><dd className="mt-1 text-xl font-black tabular-nums text-pink-200">{number(set.perfectRunes)}</dd></div>
      </dl>
      <p className="mt-3 border-t border-slate-800 pt-3 text-xs leading-6 text-amber-200">{set.otherMaterials}</p>
    </div>
    <p className="mt-4 text-xs font-bold text-slate-400">เมื่อ +15 และครบเงื่อนไข</p>
    <p className="mt-2 text-sm leading-7 text-emerald-200">{set.exampleAt15}</p>
    <details className="mt-4 border-t border-slate-800 pt-4">
      <summary className="cursor-pointer text-sm font-bold text-violet-200 marker:text-violet-400">ชิ้นส่วนและโบนัสแต่ละขั้น</summary>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Rune Pieces">
        {set.pieces.map((piece) => <li key={piece} className="rounded-md border border-slate-700 bg-slate-800/50 px-2 py-1 text-xs leading-5 text-slate-300">{piece}</li>)}
      </ul>
      <div className="mt-4 space-y-3">
        {set.bonuses.map((bonus) => <div key={bonus.pieces} className="border-l-2 border-violet-500/40 pl-3">
          <p className="text-xs font-bold text-violet-300">{bonus.pieces} ชิ้น</p>
          <p className="mt-1 text-sm leading-7 text-slate-300">{bonus.description}</p>
        </div>)}
      </div>
      <p className="mt-4 text-xs"><ExternalLink href={set.originalImageUrl}>ภาพเซ็ตต้นฉบับ</ExternalLink></p>
    </details>
    <div className="mt-auto pt-5"><button type="button" className={`${button} w-full`} onClick={onCalculate}>ลองคำนวณโบนัส <span aria-hidden="true">↗</span><span className="sr-only"> {set.name}</span></button></div>
  </article>;
}

export default function RuneTabletGuide() {
  const [section, setSection] = useState<Section>("overview");
  const [query, setQuery] = useState("");
  const [episode, setEpisode] = useState("all");
  const [selectedSetId, setSelectedSetId] = useState(RUNE_TABLET.sets[0].id);
  const [refinement, setRefinement] = useState(15);
  const contentRef = useRef<HTMLDivElement>(null);
  const filteredSets = useMemo(() => filterRuneSets(query, episode), [query, episode]);
  const selectedSet = RUNE_TABLET.sets.find((set) => set.id === selectedSetId) ?? RUNE_TABLET.sets[0];

  function openCalculator(set: RuneSet) {
    setSelectedSetId(set.id);
    setSection("calculator");
    contentRef.current?.scrollIntoView({ block: "start" });
    contentRef.current?.focus({ preventScroll: true });
  }

  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/cen-lab" className="flex items-center gap-3 self-start rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/40 bg-violet-950/60 text-xl font-black text-violet-200">R</span>
          <span><span className="block text-sm font-black tracking-[0.15em] text-slate-100">CENLAB</span><span className="block text-xs text-slate-500">Ragnarok Online tools</span></span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label="เมนูหลัก" className="flex flex-wrap gap-2">
            {[{ href: "/cen-lab", label: "Cen Lab Timer" }, { href: "/ogch", label: "OGCH" }, { href: "/codex", label: "Codex" }, { href: "/two-dungeons", label: "สองดัน" }, { href: "/rune-tablet", label: "Rune Tablet" }].map((item) => <Link key={item.href} href={item.href} aria-current={item.href === "/rune-tablet" ? "page" : undefined} className={`rounded-lg border px-3 py-2 text-xs font-bold transition sm:text-sm ${item.href === "/rune-tablet" ? "border-violet-400/50 bg-violet-500/15 text-violet-100" : "border-slate-800 text-slate-400 hover:border-violet-500/40 hover:text-slate-100"}`}>{item.label}</Link>)}
          </nav>
          <LogoutButton />
        </div>
      </header>

      <section className="relative my-6 overflow-hidden rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-950/70 via-slate-900 to-slate-950 px-6 py-8 sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">Rune Tablet System</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">Rune Tablet<span className="mt-2 block text-3xl text-violet-300 sm:text-4xl">เสริมพลังให้ตัวละคร</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">ย่อยการ์ด สะสม Rune Piece และเลือกเซ็ตที่เข้ากับตัวละคร<br className="hidden sm:block" /> รวมวิธีเล่น วัตถุดิบ และตัวคำนวณโบนัสไว้ในหน้าเดียว</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setSection("sets")} className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200">สำรวจ {RUNE_TABLET.sets.length} Rune Set <span aria-hidden="true">→</span></button>
              <a href={RUNE_TABLET.source.downloadUrl} download="RO_Rune_Tablet_Thai_Guide.xlsx" className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-300">ดาวน์โหลดคู่มือ Excel <span aria-hidden="true">↓</span></a>
            </div>
            <p className="mt-5 text-xs leading-6 text-slate-500">คู่มือภาษาไทย / อ้างอิง kRO / ข้อมูลในไฟล์ 11 พ.ย. 2026</p>
          </div>
          <div className="relative hidden h-64 items-center justify-center lg:flex" aria-hidden="true">
            <div className="absolute h-60 w-60 rounded-full border border-violet-400/15" />
            <div className="absolute h-48 w-48 rotate-45 rounded-3xl border border-violet-400/20 bg-violet-400/5" />
            <div className="absolute h-36 w-36 rotate-45 rounded-2xl border border-violet-300/40 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 shadow-[0_0_60px_rgba(139,92,246,0.2)]" />
            <svg viewBox="0 0 100 120" className="relative h-32 w-28 text-violet-200" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"><path d="M35 100V20L73 43 35 64M35 64l38 36M24 15h52M24 107h52" /><path d="m10 60 8-8 8 8-8 8ZM76 70l8-8 8 8-8 8Z" strokeWidth="2" /></svg>
          </div>
        </div>
      </section>

      <aside className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-950/20 px-4 py-3 text-sm leading-7 text-amber-100/90">
        <span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-300/60 text-xs font-black">!</span>
        <p><strong className="font-bold text-amber-200">ข้อมูลเซิร์ฟเวอร์ kRO</strong> สูตรและช่วงเปิดใช้งานของ GGT/ไทยอาจต่างกัน ตรวจแพตช์ไทยก่อนใช้วัตถุดิบ โดยเฉพาะ Printing ที่ย้อนคืนไม่ได้</p>
      </aside>

      <nav aria-label="หมวดคู่มือ Rune Tablet" className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {SECTIONS.map((item) => <button key={item.id} type="button" aria-pressed={section === item.id} onClick={() => setSection(item.id)} className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 sm:px-4 ${section === item.id ? "border-violet-400/50 bg-violet-500/15 text-violet-100" : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"}`}><span className={`text-xs tabular-nums ${section === item.id ? "text-violet-400" : "text-slate-600"}`}>{item.number}</span>{item.label}</button>)}
      </nav>

      <div ref={contentRef} tabIndex={-1} className="scroll-mt-6 outline-none">
        {section === "overview" && <section aria-label="เริ่มต้นใช้งาน">
          <SectionHeading eyebrow="The essentials" title="จากการ์ดที่เก็บไว้ สู่โบนัสประจำตัว">Rune Tablet เป็นระบบเสริมพลังที่แยกจากอุปกรณ์ ความคืบหน้าของแต่ละตัวละครแยกกัน และเปลี่ยนเซ็ตที่ปลดล็อกไว้ให้เหมาะกับการเล่นได้</SectionHeading>
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[{ value: "1 เซ็ต", label: "เปิดใช้งานได้พร้อมกัน" }, { value: "2 ชิ้นขึ้นไป", label: "เริ่มได้รับโบนัสเซ็ต" }, { value: "+15", label: "ระดับอัปเกรดสูงสุด" }, { value: "30 ใบ", label: "ย่อยการ์ดแบบชุดหลัง EP18" }].map((fact) => <div key={fact.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><p className="text-2xl font-black text-violet-200">{fact.value}</p><p className="mt-2 text-xs leading-6 text-slate-400">{fact.label}</p></div>)}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 sm:p-6">
              <h3 className="mb-6 text-lg font-black">เริ่มเล่นใน 7 ขั้นตอน</h3>
              <ol className="space-y-6">
                {RUNE_TABLET.steps.map((step, index) => <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-950/50 text-sm font-black text-violet-300">{String(index + 1).padStart(2, "0")}</span>
                  <div className="min-w-0"><h4 className="font-bold text-slate-100">{step.title}</h4><p className="mt-1 text-sm leading-7 text-slate-400">{step.action} — {step.result}</p><p className="mt-1 text-xs leading-6 text-cyan-200/90">{step.example}</p><p className="mt-1 text-xs leading-6 text-amber-200/80">{step.warning}</p></div>
                </li>)}
              </ol>
            </div>
            <aside className="self-start rounded-2xl border border-violet-500/20 bg-violet-950/15 p-5 sm:p-6">
              <h3 className="text-lg font-black text-violet-100">ก่อนใช้วัตถุดิบ</h3>
              <ul className="mt-5 space-y-5">{RUNE_TABLET.reminders.map((reminder) => <li key={reminder.title} className="border-l-2 border-violet-500/40 pl-4"><h4 className="text-sm font-bold leading-7 text-slate-200">{reminder.title}</h4><p className="mt-1 text-xs leading-6 text-slate-400">{reminder.detail}</p></li>)}</ul>
              <button type="button" onClick={() => setSection("sets")} className={`${button} mt-6 w-full`}>เลือก Rune Set ที่เหมาะกับคุณ →</button>
            </aside>
          </div>
        </section>}

        {section === "sets" && <section aria-label="Rune Set">
          <SectionHeading eyebrow="Set library" title="เลือกเซ็ตให้ตรงสายที่เล่น">ตัวอย่าง 12 เซ็ตจาก EP17–CH1 ตามคู่มือ ค่าเปิดเซ็ตที่แสดงยังไม่รวม Rune Piece, Printing และวัตถุดิบอัปเกรด</SectionHeading>
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-2 text-xs font-bold text-slate-400">ค้นหาเซ็ต ชิ้นส่วน สายเล่น หรือวัตถุดิบ<input type="search" placeholder="เช่น Boss, เวท, Company, Bishop…" value={query} onChange={(event) => setQuery(event.target.value)} className={`${control} w-full`} /></label>
            <label className="flex flex-col gap-2 text-xs font-bold text-slate-400">Episode<select value={episode} onChange={(event) => setEpisode(event.target.value)} className={`${control} sm:min-w-36`}><option value="all">ทุก Episode</option>{RUNE_EPISODES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <p aria-live="polite" className="pb-3 text-sm tabular-nums text-slate-500">{filteredSets.length} / {RUNE_TABLET.sets.length} เซ็ต</p>
          </div>
          {filteredSets.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredSets.map((set) => <SetCard key={set.id} set={set} onCalculate={() => openCalculator(set)} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center"><h3 className="font-bold text-slate-200">ไม่พบ Rune Set ที่ตรงกับการค้นหา</h3><p className="mt-2 text-sm text-slate-400">ลองเปลี่ยนคำค้นหรือเลือก Episode อื่น</p><button type="button" onClick={() => { setQuery(""); setEpisode("all"); }} className={`${button} mt-5`}>ล้างตัวกรอง</button></div>}
          <p className="mt-5 text-xs leading-6 text-slate-500">ภาพประกอบนำมาจากคู่มือ Excel เป็นภาพวาดประกอบ ไม่ใช่ไอคอนเกมต้นฉบับ รายการนี้เป็นตัวอย่างและยังไม่ครอบคลุมทุกเซ็ต</p>
        </section>}

        {section === "calculator" && <section aria-label="คำนวณโบนัส">
          <SectionHeading eyebrow="Enhancement preview" title="ลองปรับระดับ ดูโบนัสที่เพิ่ม">คำนวณค่าตัวอย่างตามชีต “06 คำนวณ +15” โดยสมมติว่าปลดล็อกชิ้นส่วนครบตามเงื่อนไขของแต่ละค่าแล้ว</SectionHeading>
          <div className="grid items-start gap-5 lg:grid-cols-[340px_1fr]">
            <div className="min-w-0 rounded-2xl border border-violet-500/25 bg-slate-900/60 p-6">
              <label className="flex flex-col gap-2 text-sm font-bold text-slate-300">Rune Set<select value={selectedSetId} onChange={(event) => setSelectedSetId(event.target.value)} className={`${control} mt-1 w-full`}>{RUNE_TABLET.sets.map((set) => <option key={set.id} value={set.id}>{set.name} · {set.episode}</option>)}</select></label>
              <div className="my-7 flex items-center justify-between"><label htmlFor="rune-refinement" className="text-sm font-bold text-slate-300">ระดับอัปเกรด</label><output htmlFor="rune-refinement" className="text-4xl font-black tabular-nums text-violet-300">+{refinement}</output></div>
              <input id="rune-refinement" type="range" min="0" max="15" step="1" value={refinement} onChange={(event) => setRefinement(Number(event.target.value))} className="w-full cursor-pointer accent-violet-400" />
              <div className="mt-2 flex justify-between text-xs tabular-nums text-slate-500"><span>+0</span><span>+3</span><span>+6</span><span>+9</span><span>+12</span><span>+15</span></div>
              <div className="mt-5 flex gap-2">{[0, 3, 9, 15].map((level) => <button type="button" key={level} aria-pressed={refinement === level} onClick={() => setRefinement(level)} className={`flex-1 rounded-lg border py-2 text-sm font-bold ${refinement === level ? "border-violet-400/60 bg-violet-500/20 text-violet-100" : "border-slate-700 text-slate-400 hover:border-violet-400/50"}`}>+{level}</button>)}</div>
              <p className="mt-6 rounded-xl bg-slate-950/70 p-3 text-xs leading-6 text-slate-400">ทุก +3 = เพิ่ม {Math.floor(refinement / 3)} ครั้ง<br />ทุก +1 = เพิ่ม {refinement} ครั้ง</p>
              <p className="mt-4 text-xs leading-6 text-amber-200/90">อัปเกรดพลาดไม่แตกและไม่ลดขั้น แต่เสียวัตถุดิบ คู่มือนี้ไม่มีตารางอัตราสำเร็จหรือต้นทุนอัปเกรดแต่ละขั้น</p>
            </div>
            <div>
              <div className="mb-5 flex items-center gap-4"><Image src={selectedSet.imageSrc} alt="" width={64} height={64} className="rounded-xl" /><div><p className="text-xs font-bold tracking-widest text-violet-300">{selectedSet.episode} / {selectedSet.pieceCount} ชิ้นเต็มเซ็ต</p><h3 className="mt-1 text-2xl font-black">{selectedSet.name} <span className="text-violet-300">+{refinement}</span></h3></div></div>
              <div aria-live="polite" aria-atomic="true" className="grid gap-3 sm:grid-cols-2">
                {selectedSet.metrics.map((metric) => <article key={metric.label} className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-5"><h4 className="text-sm leading-6 text-slate-300">{metric.label}</h4><p className="mt-3 text-4xl font-black tabular-nums text-emerald-200">{calculateRuneMetric(metric, refinement)}<span className="ml-1 text-lg">{metric.unit}</span></p><p className="mt-3 text-xs leading-6 text-slate-400">{metric.base} + ({Math.floor(refinement / metric.step)} × {metric.perStep}) · ทุก +{metric.step}</p><p className="mt-1 text-xs leading-6 text-amber-200/80">{metric.requirement}</p></article>)}
              </div>
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5"><h4 className="font-bold text-slate-200">เงื่อนไขโบนัสทั้งหมดของเซ็ต</h4><div className="mt-4 space-y-4">{selectedSet.bonuses.map((bonus) => <div key={bonus.pieces} className="flex gap-3"><span className="h-fit shrink-0 rounded-lg border border-violet-500/30 bg-violet-950/40 px-2 py-1 text-xs font-bold text-violet-300">{bonus.pieces} ชิ้น</span><p className="text-sm leading-7 text-slate-300">{bonus.description}</p></div>)}</div></div>
              <p className="mt-4 text-xs leading-6 text-slate-500">ตัวเลขด้านบนแสดงเฉพาะค่าตัวอย่างที่มีในคู่มือ รวมโบนัสประเภทเดียวกันภายในเซ็ตตามเงื่อนไขที่ระบุ เป็นการบวกโบนัสเพื่อเปรียบเทียบ ไม่ใช่ดาเมจสุดท้าย และไม่รวมผลของ DEF ความต้านทาน หรือค่าอัปเกรด</p>
            </div>
          </div>
        </section>}

        {section === "materials" && <section aria-label="วัตถุดิบและร้านแลก">
          <SectionHeading eyebrow="Materials & exchange" title="รู้จักรูน ก่อนนำไปใช้">วัตถุดิบหลัก 8 ชนิดจากคู่มือ พร้อมที่มาและการใช้งาน แยกค่าแลกของออกจากค่าเปิด Rune Set</SectionHeading>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{RUNE_TABLET.materials.map((item) => <article key={item.itemId} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><div className="flex items-center gap-3"><Image src={item.imageSrc} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-xl object-contain" /><div className="min-w-0"><p className="text-xs text-violet-300">{item.category} / #{item.itemId}</p><h3 className="mt-1 break-words font-black">{item.name}</h3><p className="mt-1 text-xs text-slate-500">{item.thaiName}</p></div></div><dl className="mt-5 space-y-3 text-sm leading-7"><div><dt className="text-xs font-bold text-cyan-300">หาได้จาก</dt><dd className="text-slate-400">{item.obtainedFrom}</dd></div><div><dt className="text-xs font-bold text-pink-300">ใช้ทำอะไร</dt><dd className="text-slate-400">{item.usage}</dd></div></dl><p className="mt-4 text-xs"><ExternalLink href={item.sourceUrl}>ข้อมูลไอเทม</ExternalLink><span className="px-2 text-slate-700">/</span><ExternalLink href={item.originalImageUrl}>ภาพต้นฉบับ</ExternalLink></p></article>)}</div>
          <p className="mt-5 rounded-xl border border-slate-800 p-4 text-xs leading-7 text-slate-400">{RUNE_TABLET.otherMaterials}</p>
          <div className="mb-5 mt-10"><h3 className="text-2xl font-black">Rune Shop</h3><p className="mt-2 text-sm leading-7 text-slate-400">รายการแลกตามโพสต์ 17 พ.ค. 2024 ในคู่มือ เก็บรูนสำหรับเปิดเซ็ตและอัปเกรดให้พอก่อนแลกของ</p></div>
          <div className="grid gap-4 md:grid-cols-2">{RUNE_TABLET.shop.map((offer) => <article key={offer.name} className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5"><h4 className="font-black text-amber-100">{offer.name}</h4><div className="mt-3 flex flex-wrap gap-2">{offer.imperfectRunes > 0 && <span className="rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-3 py-2 text-xs font-bold text-cyan-200">Imperfect Rune ×{number(offer.imperfectRunes)}</span>}{offer.otherQuantity !== null && <span className="rounded-lg border border-violet-500/20 bg-violet-950/30 px-3 py-2 text-xs font-bold text-violet-200">{offer.otherItem} ×{number(offer.otherQuantity)}</span>}</div><p className="mt-3 text-sm leading-7 text-slate-300">{offer.description}</p><p className="mt-1 text-xs leading-6 text-slate-500">{offer.note}</p></article>)}</div>
          <p className="mt-5 text-xs leading-6 text-slate-500">ภาพในหน้านี้เป็นภาพประกอบจาก Excel สามารถเปิดภาพไอเทมจริงผ่านลิงก์ “ภาพต้นฉบับ”</p>
        </section>}

        {section === "npcs" && <section aria-label="NPC และอัปเดต">
          <SectionHeading eyebrow="Where to begin" title="หา Rune Stone ได้ที่ไหน?">พิกัด NPC ตามข้อมูล kRO ในคู่มือ ให้บริการ Rune Tablet, Printing และ Lore</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{RUNE_TABLET.npcs.map((npc) => <article key={npc.map} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><h3 className="font-black">{npc.city}</h3><p className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-950/20 px-3 py-2 font-mono text-sm text-cyan-200">{npc.map} {npc.coordinates}</p><p className="mt-3 text-xs leading-6 text-slate-500">{npc.services}</p></article>)}</div>
          <h3 className="mb-6 mt-10 text-2xl font-black">ประวัติอัปเดต kRO</h3>
          <ol className="ml-2 space-y-6 border-l border-violet-500/30 pl-6">{RUNE_TABLET.updates.map((update) => <li key={update.date} className="relative"><span aria-hidden="true" className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border border-violet-300 bg-violet-500" /><p className="text-xs font-bold text-violet-300">{update.date}</p><h4 className="mt-2 font-bold">{update.title}</h4><p className="mt-1 text-sm leading-7 text-slate-300">{update.change}</p><p className="text-xs leading-6 text-slate-500">{update.meaning}</p></li>)}</ol>
        </section>}

        {section === "glossary" && <section aria-label="ศัพท์และแหล่งข้อมูล">
          <SectionHeading eyebrow="Reference notes" title="อ่านคำอธิบายเซ็ตได้เข้าใจขึ้น">รวมศัพท์ที่ใช้ในคู่มือและลิงก์อ้างอิงเดิมจาก Divine Pride</SectionHeading>
          <dl className="grid gap-3 md:grid-cols-2">{RUNE_TABLET.glossary.map((entry) => <div key={entry.term} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"><dt className="font-black text-violet-200">{entry.term}</dt><dd className="mt-2 text-sm leading-7 text-slate-300">{entry.meaning}<span className="mt-1 block text-xs leading-6 text-slate-500">{entry.note}</span></dd></div>)}</dl>
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/30 p-5 sm:p-6"><h3 className="text-lg font-black">แหล่งข้อมูลในคู่มือ</h3><ul className="mt-4 space-y-4">{RUNE_TABLET.sources.map((source) => <li key={source.url} className="text-sm"><ExternalLink href={source.url}>{source.title}</ExternalLink><p className="mt-1 text-xs leading-6 text-slate-500">{source.note}</p></li>)}</ul><p className="mt-6 border-t border-slate-800 pt-4 text-xs leading-7 text-slate-400">ถอดข้อมูลจาก RO_Rune_Tablet_Thai_Guide.xlsx ทั้ง 9 ชีต เป็นคู่มือสรุปตัวอย่าง ข้อมูลวันที่ 11 พ.ย. 2026 ตามไฟล์ ไม่ใช่ฐานข้อมูลที่ซิงก์กับเกมแบบสด</p></div>
        </section>}
      </div>
      <footer className="mt-10 flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs leading-6 text-slate-500 sm:flex-row sm:justify-between"><p>Rune Tablet / คู่มือภาษาไทยจากข้อมูล kRO</p><p><ExternalLink href={RUNE_TABLET.source.url}>Rune Tablet System บน Divine Pride</ExternalLink></p></footer>
    </div>
  </main>;
}
