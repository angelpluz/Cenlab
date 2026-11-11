"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CodexFilter } from "@/lib/codex-types";
import { CODEX_ITEMS, CODEX_MONSTERS } from "@/lib/codex-data";
import { filterEntries, sortEntries } from "@/lib/codex-utils";
import CodexSearch from "./CodexSearch";
import CodexItemCard from "./CodexItemCard";
import CodexMonsterCard from "./CodexMonsterCard";

const DEFAULT_FILTER: CodexFilter = {
  query: "",
  tab: "item",
  itemCategory: "all",
  monsterRace: "all",
  monsterElement: "all",
  monsterSize: "all",
  tags: [],
};

export default function CodexClient() {
  const [filter, setFilter] = useState<CodexFilter>(DEFAULT_FILTER);

  const entries = useMemo(
    () => (filter.tab === "item" ? CODEX_ITEMS : CODEX_MONSTERS),
    [filter.tab],
  );

  const filtered = useMemo(
    () => sortEntries(filterEntries(entries, filter)),
    [entries, filter],
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 border-b border-slate-800 pb-5">
          <h1 className="text-3xl font-black tracking-normal text-cyan-300 sm:text-4xl">
            RO Codex
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Item & Monster reference for Ragnarok Online.
          </p>
          <nav aria-label="Page navigation" className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
            <Link href="/cen-lab" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-200">Cen Lab</Link>
            <Link href="/rune-tablet" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 transition hover:border-violet-500/50 hover:text-violet-200">Rune Tablet</Link>
<Link href="/two-dungeons" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 transition hover:border-violet-500/50 hover:text-violet-200">สองดัน</Link>
          </nav>
        </header>

        <CodexSearch
          filter={filter}
          onChange={setFilter}
          resultCount={filtered.length}
        />

        <section className="mt-5">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-10 text-center">
              <p className="text-lg font-bold text-slate-300">
                No {filter.tab} found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search term or filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filter.tab === "item"
                ? (filtered as typeof CODEX_ITEMS).map((item) => (
                    <CodexItemCard
                      key={item.id}
                      item={item}
                    />
                  ))
                : (filtered as typeof CODEX_MONSTERS).map((monster) => (
                    <CodexMonsterCard
                      key={monster.id}
                      monster={monster}
                    />
                  ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
