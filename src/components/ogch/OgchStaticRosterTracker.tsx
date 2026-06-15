"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import OgchCharacterCard from "@/components/ogch/OgchCharacterCard";
import OgchNav from "@/components/ogch/OgchNav";
import {
  addOgchCooldown,
  formatBangkokDateTime,
  formatExp,
  getLiveCooldownStatus,
  getRemainingCooldownSeconds,
} from "@/lib/ogch";
import {
  OGCH_STATIC_ROSTER_EVENT,
  buildOgchStaticCharacter,
  getOgchStaticRosterStorageKey,
  readOgchStaticRoster,
  writeOgchStaticRoster,
  type OgchStaticRosterJob,
  type StaticRosterCharacterSeed,
} from "@/lib/ogch-static-rosters";
import type { OgchCharacterProgress } from "@/lib/ogch-types";

type FilterKey = "all" | "available" | "cooldown" | "readySoon" | "lv10" | "needProgress";
type SortKey = "nextAvailable" | "ogchLevel" | "clearCount" | "name";

type LiveCharacter = {
  character: OgchCharacterProgress;
  cooldownStatus: ReturnType<typeof getLiveCooldownStatus>;
  remainingSeconds: number;
};

type OgchStaticRosterTrackerProps = {
  activeNav: OgchStaticRosterJob;
  introLabel: string;
  jobLabel: string;
  nextAvailableAt: string;
  sourceLabel: string;
  characters: StaticRosterCharacterSeed[];
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "cooldown", label: "On Cooldown" },
  { key: "readySoon", label: "Ready Soon" },
  { key: "lv10", label: "Lv 10" },
  { key: "needProgress", label: "Need Progress" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "nextAvailable", label: "Next available time" },
  { key: "ogchLevel", label: "OGCH level" },
  { key: "clearCount", label: "Clear count" },
  { key: "name", label: "Name" },
];

function toDateTimeLocalInput(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function fromDateTimeLocalInput(value: string): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

export default function OgchStaticRosterTracker({
  activeNav,
  introLabel,
  jobLabel,
  nextAvailableAt,
  sourceLabel,
}: OgchStaticRosterTrackerProps) {
  const [characters, setCharacters] = useState<OgchCharacterProgress[]>(() =>
    readOgchStaticRoster(activeNav)
  );
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("nextAvailable");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingComplete, setPendingComplete] = useState<OgchCharacterProgress | null>(null);
  const [manualTarget, setManualTarget] = useState<OgchCharacterProgress | null>(null);
  const [manualClearCount, setManualClearCount] = useState("0");
  const [manualLastCompletedAt, setManualLastCompletedAt] = useState("");
  const [manualNextAvailableAt, setManualNextAvailableAt] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function refreshStoredRoster() {
      setCharacters(readOgchStaticRoster(activeNav));
    }

    function handleRosterEvent(event: Event) {
      const detail = (event as CustomEvent<{ job?: OgchStaticRosterJob }>).detail;
      if (!detail?.job || detail.job === activeNav) refreshStoredRoster();
    }

    function handleStorageEvent(event: StorageEvent) {
      if (event.key === getOgchStaticRosterStorageKey(activeNav)) refreshStoredRoster();
    }

    refreshStoredRoster();
    window.addEventListener(OGCH_STATIC_ROSTER_EVENT, handleRosterEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(OGCH_STATIC_ROSTER_EVENT, handleRosterEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [activeNav]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const liveCharacters = useMemo<LiveCharacter[]>(() => {
    const now = new Date(nowMs);

    return characters.map((character) => ({
      character,
      cooldownStatus: getLiveCooldownStatus(character.nextAvailableAt, character.cooldownStatus, now),
      remainingSeconds:
        character.nextAvailableAt === null
          ? character.remainingCooldownSeconds
          : getRemainingCooldownSeconds(character.nextAvailableAt, now),
    }));
  }, [characters, nowMs]);

  const summary = useMemo(() => {
    const available = liveCharacters.filter((item) => item.cooldownStatus === "available");
    const cooldown = liveCharacters.filter((item) => item.cooldownStatus === "onCooldown");
    const readySoon = liveCharacters.filter((item) => item.cooldownStatus === "readySoon");
    const readyInNext24Hours = liveCharacters.filter(
      (item) => item.remainingSeconds > 0 && item.remainingSeconds <= 24 * 60 * 60
    );
    const highestLevel = [...characters].sort(
      (a, b) => b.ogchLevel - a.ogchLevel || b.clearCount - a.clearCount || a.name.localeCompare(b.name)
    )[0];
    const totalAvailableExp = available.reduce((total, item) => total + Number(item.character.expReward), 0);

    return {
      total: characters.length,
      available: available.length,
      cooldown: cooldown.length + readySoon.length,
      readyInNext24Hours: readyInNext24Hours.length,
      highestLevel,
      totalAvailableExp,
    };
  }, [characters, liveCharacters]);

  const visibleCharacters = useMemo(() => {
    const filtered = liveCharacters.filter((item) => {
      if (filter === "available") return item.cooldownStatus === "available";
      if (filter === "cooldown") return item.cooldownStatus === "onCooldown";
      if (filter === "readySoon") return item.cooldownStatus === "readySoon";
      if (filter === "lv10") return item.character.ogchLevel === 10;
      if (filter === "needProgress") return item.character.nextLevelRequirement !== null;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "ogchLevel") {
        return b.character.ogchLevel - a.character.ogchLevel || b.character.clearCount - a.character.clearCount;
      }

      if (sort === "clearCount") {
        return b.character.clearCount - a.character.clearCount || a.character.name.localeCompare(b.character.name);
      }

      if (sort === "name") {
        return a.character.name.localeCompare(b.character.name);
      }

      const aTime = a.character.nextAvailableAt ? new Date(a.character.nextAvailableAt).getTime() : 0;
      const bTime = b.character.nextAvailableAt ? new Date(b.character.nextAvailableAt).getTime() : 0;
      return aTime - bTime || a.character.name.localeCompare(b.character.name);
    });
  }, [filter, liveCharacters, sort]);

  function openManualEdit(character: OgchCharacterProgress) {
    setManualTarget(character);
    setManualClearCount(String(character.clearCount));
    setManualLastCompletedAt(toDateTimeLocalInput(character.lastCompletedAt));
    setManualNextAvailableAt(toDateTimeLocalInput(character.nextAvailableAt));
  }

  const pendingNextAvailableAt = pendingComplete ? addOgchCooldown(new Date(nowMs)) : null;

  function updateCharacter(
    characterId: string,
    updater: (current: OgchCharacterProgress) => OgchCharacterProgress
  ) {
    setCharacters((currentCharacters) => {
      const nextCharacters = currentCharacters.map((character) =>
        character.id === characterId ? updater(character) : character
      );
      writeOgchStaticRoster(activeNav, nextCharacters);
      return nextCharacters;
    });
  }

  function confirmComplete() {
    if (!pendingComplete) return;

    setMutatingId(pendingComplete.id);
    const completedAt = new Date(nowMs);

    updateCharacter(pendingComplete.id, (character) =>
      buildOgchStaticCharacter(
        {
          id: character.id,
          name: character.name,
          clearCount: character.clearCount,
        },
        jobLabel,
        nextAvailableAt,
        {
          clearCount: character.clearCount + 1,
          lastCompletedAt: completedAt.toISOString(),
          nextAvailableAt: addOgchCooldown(completedAt).toISOString(),
          cooldownStatus: "onCooldown",
        }
      )
    );

    setNotice(`OGCH completed for ${pendingComplete.name}. Next run available in 3 days.`);
    setPendingComplete(null);
    setMutatingId(null);
  }

  function submitManualEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manualTarget) return;

    setMutatingId(manualTarget.id);
    const nextManualAvailableAt = fromDateTimeLocalInput(manualNextAvailableAt);

    updateCharacter(manualTarget.id, (character) =>
      buildOgchStaticCharacter(
        {
          id: character.id,
          name: character.name,
          clearCount: character.clearCount,
        },
        jobLabel,
        nextAvailableAt,
        {
          clearCount: Number(manualClearCount),
          lastCompletedAt: fromDateTimeLocalInput(manualLastCompletedAt),
          nextAvailableAt: nextManualAvailableAt,
          cooldownStatus: nextManualAvailableAt ? "onCooldown" : "available",
        }
      )
    );

    setNotice(`OGCH progress updated for ${manualTarget.name}.`);
    setManualTarget(null);
    setMutatingId(null);
  }

  function resetCooldown(character: OgchCharacterProgress) {
    if (!window.confirm(`Reset OGCH cooldown for ${character.name}?`)) return;

    setMutatingId(character.id);
    updateCharacter(character.id, (currentCharacter) =>
      buildOgchStaticCharacter(
        {
          id: currentCharacter.id,
          name: currentCharacter.name,
          clearCount: currentCharacter.clearCount,
        },
        jobLabel,
        nextAvailableAt,
        {
          clearCount: currentCharacter.clearCount,
          lastCompletedAt: currentCharacter.lastCompletedAt,
          nextAvailableAt: null,
          cooldownStatus: "available",
        }
      )
    );
    setNotice(`OGCH cooldown reset for ${character.name}.`);
    setMutatingId(null);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-cyan-300 sm:text-4xl">OGCH</h1>
            <p className="mt-1 text-sm text-slate-400">{introLabel}</p>
            <p className="mt-1 text-xs text-slate-600">Data: {sourceLabel}</p>
          </div>
          <OgchNav active={activeNav} />
        </header>

        {notice ? (
          <div className="mb-4 rounded-xl border border-emerald-500/35 bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-200">
            {notice}
          </div>
        ) : null}

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <SummaryCard label="Total Characters" value={summary.total.toString()} tone="cyan" />
          <SummaryCard label="Available Now" value={summary.available.toString()} tone="emerald" />
          <SummaryCard label="On Cooldown" value={summary.cooldown.toString()} tone="orange" />
          <SummaryCard label="Ready Next 24h" value={summary.readyInNext24Hours.toString()} tone="pink" />
          <SummaryCard
            label="Highest OGCH"
            value={summary.highestLevel ? `Lv ${summary.highestLevel.ogchLevel}` : "-"}
            detail={summary.highestLevel?.name ?? ""}
            tone="violet"
          />
          <SummaryCard label="Available EXP" value={formatExp(summary.totalAvailableExp)} tone="cyan" />
        </section>

        <section className="mb-5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-lg shadow-black/10">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    filter === item.key
                      ? "border-cyan-500/50 bg-cyan-950/50 text-cyan-100"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sort
              <select
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-200 outline-none transition focus:border-cyan-500 xl:w-56"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
              >
                {SORTS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 px-4 py-3 text-sm font-semibold text-cyan-100">
          {jobLabel} roster uses the same OGCH logic as Windhawk. Current next run target is{" "}
          <span className="font-mono">{formatBangkokDateTime(nextAvailableAt)}</span>.
        </section>

        <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {visibleCharacters.map(({ character }) => (
            <OgchCharacterCard
              key={character.id}
              character={character}
              isMutating={mutatingId === character.id}
              nowMs={nowMs}
              onComplete={setPendingComplete}
              onManualEdit={openManualEdit}
              onResetCooldown={resetCooldown}
            />
          ))}
        </section>

        {visibleCharacters.length === 0 ? (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm font-semibold text-slate-500">
            No characters match this filter.
          </div>
        ) : null}
      </div>

      {pendingComplete && pendingNextAvailableAt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-cyan-500/30 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30">
            <h2 className="text-xl font-black text-cyan-200">Complete OGCH Run</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Mark OGCH as completed for {pendingComplete.name}? Next available time will be{" "}
              <span className="font-mono font-bold text-cyan-100">
                {formatBangkokDateTime(pendingNextAvailableAt)}
              </span>
              .
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPendingComplete(null)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmComplete}
                disabled={mutatingId === pendingComplete.id}
                className="rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-2 text-sm font-black text-white transition hover:from-cyan-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {manualTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={submitManualEdit}
            className="w-full max-w-lg rounded-xl border border-violet-500/30 bg-slate-900 p-5 shadow-2xl shadow-violet-950/30"
          >
            <h2 className="text-xl font-black text-violet-200">Manual Edit</h2>
            <p className="mt-1 text-sm font-semibold text-slate-300">{manualTarget.name}</p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Clear Count
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none transition focus:border-violet-500"
                  min={0}
                  onChange={(event) => setManualClearCount(event.target.value)}
                  type="number"
                  value={manualClearCount}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Last Completed
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none transition focus:border-violet-500"
                  onChange={(event) => setManualLastCompletedAt(event.target.value)}
                  type="datetime-local"
                  value={manualLastCompletedAt}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Next Available
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none transition focus:border-violet-500"
                  onChange={(event) => setManualNextAvailableAt(event.target.value)}
                  type="datetime-local"
                  value={manualNextAvailableAt}
                />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => setManualTarget(null)}
                type="button"
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={mutatingId === manualTarget.id}
                type="submit"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2 text-sm font-black text-white transition hover:from-violet-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail?: string;
  tone: "cyan" | "emerald" | "orange" | "pink" | "violet";
}) {
  const toneClass = {
    cyan: "border-cyan-500/20 bg-cyan-950/20 text-cyan-100",
    emerald: "border-emerald-500/20 bg-emerald-950/20 text-emerald-100",
    orange: "border-orange-500/20 bg-orange-950/20 text-orange-100",
    pink: "border-pink-500/20 bg-pink-950/20 text-pink-100",
    violet: "border-violet-500/20 bg-violet-950/20 text-violet-100",
  }[tone];

  return (
    <div className={`min-w-0 rounded-xl border p-3 shadow-lg shadow-black/10 ${toneClass}`}>
      <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 truncate font-mono text-2xl font-black">{value}</p>
      {detail ? <p className="mt-1 truncate text-xs font-semibold text-slate-400">{detail}</p> : null}
    </div>
  );
}
