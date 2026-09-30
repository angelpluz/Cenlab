"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ISSGARD_ANGEL_MONSTERS } from "@/lib/issgard-angel";
import { ISSGARD_DEMON_MONSTERS } from "@/lib/issgard-demon";

type Group = "angel" | "demon";

const GROUPS: { id: Group; label: string; color: string }[] = [
  { id: "angel", label: "Angel", color: "amber" },
  { id: "demon", label: "Demon", color: "rose" },
];

const formatNumber = (value: number | null) =>
  value === null ? "—" : new Intl.NumberFormat("en-US").format(value);

export default function EventIssgard() {
  const [group, setGroup] = useState<Group>("angel");
  const [query, setQuery] = useState("");
  const [element, setElement] = useState("all");

  const elements = useMemo(
    () => Array.from(new Set((group === "angel" ? ISSGARD_ANGEL_MONSTERS : ISSGARD_DEMON_MONSTERS)
      .map((monster) => monster.element?.split(" ")[0])
      .filter((value): value is string => Boolean(value)))).sort(),
    [group],
  );
  const filteredAngels = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return ISSGARD_ANGEL_MONSTERS.filter((monster) => {
      if (element !== "all" && !monster.element?.startsWith(`${element} `)) return false;
      if (!normalized) return true;
      return [monster.name, monster.map, monster.mapCode, monster.element, monster.size, monster.race]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase().includes(normalized));
    });
  }, [element, query]);
  const filteredDemons = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return ISSGARD_DEMON_MONSTERS.filter((monster) => {
      if (element !== "all" && !monster.element?.startsWith(`${element} `)) return false;
      if (!normalized) return true;
      return [monster.name, monster.map, monster.mapCode, monster.range, monster.element, monster.race]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase().includes(normalized));
    });
  }, [element, query]);

  const selectedGroup = GROUPS.find((item) => item.id === group)!;
  const monsters = group === "angel" ? ISSGARD_ANGEL_MONSTERS : ISSGARD_DEMON_MONSTERS;
  const filteredCount = group === "angel" ? filteredAngels.length : filteredDemons.length;
  const levels = monsters.map((monster) => monster.level);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Monster directory</p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Event Issgard</h1>
            <p className="mt-2 text-sm text-slate-400">รายชื่อมอนสเตอร์ Angel และ Demon จากตารางที่ให้มา</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-semibold" aria-label="Page navigation">
            <Link href="/cen-lab" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-200">Cen Lab</Link>
            <Link href="/codex" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-200">Codex</Link>
          </nav>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {GROUPS.map((item) => {
            const active = group === item.id;
            const tone = item.color === "amber"
              ? active ? "border-amber-400/70 bg-amber-950/40 text-amber-100" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-500/50"
              : active ? "border-rose-400/70 bg-rose-950/40 text-rose-100" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-rose-500/50";
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => { setGroup(item.id); setElement("all"); }}
                className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left transition ${tone}`}
              >
                <span className="text-lg font-black">{item.label}</span>
                <span className="rounded-full bg-slate-950/50 px-3 py-1 text-sm font-bold">{item.id === "angel" ? ISSGARD_ANGEL_MONSTERS.length : ISSGARD_DEMON_MONSTERS.length} ตัว</span>
              </button>
            );
          })}
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60" aria-label={`${selectedGroup.label} monsters`}>
          <div className="flex flex-col gap-4 border-b border-slate-800 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className={`text-2xl font-black ${group === "angel" ? "text-amber-200" : "text-rose-200"}`}>{selectedGroup.label} Monsters</h2>
              <p className="mt-1 text-sm text-slate-400">Lv. {Math.min(...levels)}–{Math.max(...levels)} · แสดง {filteredCount} / {monsters.length} ตัว</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="issgard-search">ค้นหามอนสเตอร์</label>
              <input
                id="issgard-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ค้นหาชื่อ, แผนที่, ธาตุ..."
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 sm:min-w-64"
              />
              <label className="sr-only" htmlFor="issgard-element">กรองธาตุ</label>
              <select
                id="issgard-element"
                value={element}
                onChange={(event) => setElement(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              >
                <option value="all">ทุกธาตุ</option>
                {elements.map((name) => <option value={name} key={name}>{name}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {group === "demon" ? (
              <table className="w-full min-w-[950px] border-collapse text-left text-sm">
                <thead className="bg-slate-950/75 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">ช่วง</th>
                    <th scope="col" className="px-3 py-3">Map</th>
                    <th scope="col" className="px-3 py-3">Monster</th>
                    <th scope="col" className="px-3 py-3 text-right">Lv.</th>
                    <th scope="col" className="px-3 py-3 text-right">HP</th>
                    <th scope="col" className="px-3 py-3">Size</th>
                    <th scope="col" className="px-3 py-3">Element</th>
                    <th scope="col" className="px-4 py-3">Race</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredDemons.map((monster) => (
                    <tr key={`${monster.mapCode}-${monster.name}`} className="align-top transition hover:bg-slate-800/45">
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-rose-200">{monster.range}</td>
                      <td className="min-w-48 px-3 py-3 text-slate-200">{monster.map}<span className="block font-mono text-xs text-slate-500">{monster.mapCode}</span></td>
                      <td className="min-w-48 px-3 py-3 font-semibold text-white">{monster.name}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums text-cyan-200">{monster.level}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatNumber(monster.hp)}</td>
                      <td className="px-3 py-3">{monster.size ?? "—"}</td>
                      <td className="whitespace-nowrap px-3 py-3">{monster.element ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3">{monster.race ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[950px] border-collapse text-left text-sm">
                <thead className="bg-slate-950/75 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">Monster</th>
                    <th scope="col" className="px-3 py-3 text-right">Lv.</th>
                    <th scope="col" className="px-3 py-3">Map</th>
                    <th scope="col" className="px-3 py-3">Map ID</th>
                    <th scope="col" className="px-3 py-3 text-right">HP</th>
                    <th scope="col" className="px-3 py-3">Size</th>
                    <th scope="col" className="px-3 py-3">Element</th>
                    <th scope="col" className="px-4 py-3">Race</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredAngels.map((monster) => (
                    <tr key={monster.name} className="align-top transition hover:bg-slate-800/45">
                      <td className="min-w-44 px-4 py-3 font-semibold text-white">{monster.name}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums text-cyan-200">{monster.level}</td>
                      <td className="min-w-56 px-3 py-3 text-slate-300">{monster.map}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-slate-400">{monster.mapCode}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatNumber(monster.hp)}</td>
                      <td className="px-3 py-3">{monster.size ?? "—"}</td>
                      <td className="whitespace-nowrap px-3 py-3">{monster.element ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3">{monster.race}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {filteredCount === 0 && <p className="p-8 text-center text-slate-400">ไม่พบมอนสเตอร์ที่ตรงกับการค้นหา</p>}
          </div>
          <p className="border-t border-slate-800 px-4 py-3 text-xs text-slate-500">ข้อมูล {selectedGroup.label} จากตารางที่ให้มา · ขีด “—” หมายถึงไม่มีข้อมูล</p>
        </section>
      </div>
    </main>
  );
}
