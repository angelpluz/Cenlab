"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  WATER_DUNGEON_CHARACTERS,
  WATER_DUNGEON_GROUPS,
  WATER_DUNGEON_STORAGE_KEY,
  addWaterDungeonCooldown,
  formatWaterDungeonBangkokDate,
  formatWaterDungeonBangkokDateTime,
  formatWaterDungeonRemainingTime,
  getLiveWaterDungeonStatus,
  getWaterDungeonRemainingSeconds,
} from "@/lib/water-dungeon";
import {
  WATER_DUNGEON_API_BASE_URL,
  completeWaterDungeonRun,
  getWaterDungeonCharacters,
  manualAdjustWaterDungeonProgress,
  resetWaterDungeonCooldown,
} from "@/lib/water-dungeon-api";
import type {
  WaterDungeonCharacter,
  WaterDungeonGroupId,
  WaterDungeonManualAdjustPayload,
  WaterDungeonMutationApiResponse,
  WaterDungeonStatus,
} from "@/lib/water-dungeon-types";

type FilterKey = "all" | "available" | "cooldown" | "readySoon" | "overdue" | "noDate" | "blocked";
type SortKey = "nextAvailable" | "group" | "name" | "status";
type DataSource = "loading" | "database" | "local";

type LiveCharacter = {
  character: WaterDungeonCharacter;
  status: WaterDungeonStatus;
  remainingSeconds: number;
  isOverdue: boolean;
  hasNoDate: boolean;
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "available", label: "Ready" },
  { key: "cooldown", label: "Cooldown" },
  { key: "readySoon", label: "Ready Soon" },
  { key: "overdue", label: "Overdue" },
  { key: "noDate", label: "No Date" },
  { key: "blocked", label: "No Slot" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "nextAvailable", label: "Next round date" },
  { key: "group", label: "Roster group" },
  { key: "name", label: "Character name" },
  { key: "status", label: "Status" },
];

const GROUP_FILTERS: { key: "all" | WaterDungeonGroupId; label: string }[] = [
  { key: "all", label: "All Groups" },
  { key: "main", label: WATER_DUNGEON_GROUPS.main },
  { key: "alp", label: WATER_DUNGEON_GROUPS.alp },
  { key: "dancer", label: WATER_DUNGEON_GROUPS.dancer },
  { key: "friends", label: WATER_DUNGEON_GROUPS.friends },
];

const STATUS_LABELS: Record<WaterDungeonStatus, string> = {
  available: "Ready",
  onCooldown: "Cooldown",
  readySoon: "Ready Soon",
  blocked: "No Slot",
};

const STATUS_CLASSES: Record<WaterDungeonStatus, string> = {
  available: "border-emerald-500/40 bg-emerald-950/35 text-emerald-200",
  onCooldown: "border-orange-500/40 bg-orange-950/35 text-orange-200",
  readySoon: "border-sky-500/40 bg-sky-950/35 text-sky-200",
  blocked: "border-rose-500/40 bg-rose-950/35 text-rose-200",
};

function getSeedCharacters() {
  return WATER_DUNGEON_CHARACTERS.map((character) => ({ ...character }));
}

function mergeStoredCharacters(storedCharacters: WaterDungeonCharacter[]) {
  const storedById = new Map(storedCharacters.map((character) => [character.id, character]));

  return WATER_DUNGEON_CHARACTERS.map((seedCharacter) => {
    const storedCharacter = storedById.get(seedCharacter.id);

    if (!storedCharacter) {
      return { ...seedCharacter };
    }

    return {
      ...seedCharacter,
      clearCount: storedCharacter.clearCount,
      lastCompletedAt: storedCharacter.lastCompletedAt,
      nextAvailableAt: storedCharacter.nextAvailableAt,
      note: storedCharacter.note,
      status: storedCharacter.status,
    };
  });
}

function readLocalCharacters() {
  if (typeof window === "undefined") {
    return getSeedCharacters();
  }

  const stored = window.localStorage.getItem(WATER_DUNGEON_STORAGE_KEY);
  if (!stored) {
    return getSeedCharacters();
  }

  try {
    const parsed = JSON.parse(stored) as WaterDungeonCharacter[];
    if (!Array.isArray(parsed)) return getSeedCharacters();
    return mergeStoredCharacters(parsed);
  } catch {
    return getSeedCharacters();
  }
}

function persistLocalCharacters(characters: WaterDungeonCharacter[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WATER_DUNGEON_STORAGE_KEY, JSON.stringify(characters));
}

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

function getSortTimestamp(character: WaterDungeonCharacter) {
  if (character.status === "blocked") return Number.MAX_SAFE_INTEGER;
  if (!character.nextAvailableAt) return 0;
  return new Date(character.nextAvailableAt).getTime();
}

export default function WaterDungeonTracker() {
  const [characters, setCharacters] = useState<WaterDungeonCharacter[]>(() => getSeedCharacters());
  const [dataSource, setDataSource] = useState<DataSource>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [groupFilter, setGroupFilter] = useState<"all" | WaterDungeonGroupId>("all");
  const [sort, setSort] = useState<SortKey>("nextAvailable");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [pendingComplete, setPendingComplete] = useState<WaterDungeonCharacter | null>(null);
  const [manualTarget, setManualTarget] = useState<WaterDungeonCharacter | null>(null);
  const [manualClearCount, setManualClearCount] = useState("0");
  const [manualLastCompletedAt, setManualLastCompletedAt] = useState("");
  const [manualNextAvailableAt, setManualNextAvailableAt] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [manualBlocked, setManualBlocked] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const loadCharacters = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    setError(null);

    try {
      const databaseCharacters = await getWaterDungeonCharacters();
      setCharacters(databaseCharacters);
      setDataSource("database");
    } catch {
      setCharacters(readLocalCharacters());
      setDataSource("local");
    } finally {
      if (!quiet) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCharacters();
  }, [loadCharacters]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const liveCharacters = useMemo<LiveCharacter[]>(() => {
    const now = new Date(nowMs);

    return characters.map((character) => {
      const status = getLiveWaterDungeonStatus(character, now);
      const remainingSeconds = getWaterDungeonRemainingSeconds(character.nextAvailableAt, now);
      const hasNoDate = character.nextAvailableAt === null;
      const isOverdue =
        status === "available" &&
        Boolean(character.nextAvailableAt) &&
        new Date(character.nextAvailableAt ?? "").getTime() < now.getTime();

      return {
        character,
        status,
        remainingSeconds,
        isOverdue,
        hasNoDate,
      };
    });
  }, [characters, nowMs]);

  const summary = useMemo(() => {
    const available = liveCharacters.filter((item) => item.status === "available");
    const cooldown = liveCharacters.filter((item) => item.status === "onCooldown");
    const readySoon = liveCharacters.filter((item) => item.status === "readySoon");
    const overdue = liveCharacters.filter((item) => item.isOverdue);
    const noDate = liveCharacters.filter((item) => item.hasNoDate && item.status !== "blocked");
    const blocked = liveCharacters.filter((item) => item.status === "blocked");

    return {
      total: liveCharacters.length,
      available: available.length,
      cooldown: cooldown.length,
      readySoon: readySoon.length,
      overdue: overdue.length,
      noDate: noDate.length,
      blocked: blocked.length,
    };
  }, [liveCharacters]);

  const visibleCharacters = useMemo(() => {
    const filtered = liveCharacters.filter((item) => {
      if (groupFilter !== "all" && item.character.groupId !== groupFilter) return false;

      if (filter === "available") return item.status === "available";
      if (filter === "cooldown") return item.status === "onCooldown";
      if (filter === "readySoon") return item.status === "readySoon";
      if (filter === "overdue") return item.isOverdue;
      if (filter === "noDate") return item.hasNoDate && item.status !== "blocked";
      if (filter === "blocked") return item.status === "blocked";
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "group") {
        return (
          a.character.groupLabel.localeCompare(b.character.groupLabel) ||
          getSortTimestamp(a.character) - getSortTimestamp(b.character) ||
          a.character.name.localeCompare(b.character.name)
        );
      }

      if (sort === "name") {
        return a.character.name.localeCompare(b.character.name);
      }

      if (sort === "status") {
        return (
          STATUS_LABELS[a.status].localeCompare(STATUS_LABELS[b.status]) ||
          getSortTimestamp(a.character) - getSortTimestamp(b.character) ||
          a.character.name.localeCompare(b.character.name)
        );
      }

      return (
        getSortTimestamp(a.character) - getSortTimestamp(b.character) ||
        a.character.groupLabel.localeCompare(b.character.groupLabel) ||
        a.character.name.localeCompare(b.character.name)
      );
    });
  }, [filter, groupFilter, liveCharacters, sort]);

  const runMutation = useCallback(
    async (
      characterId: string,
      databaseAction: () => Promise<WaterDungeonMutationApiResponse>,
      localUpdater: (character: WaterDungeonCharacter) => WaterDungeonCharacter,
      successFallback: string
    ) => {
      setMutatingId(characterId);
      setError(null);

      if (dataSource === "database") {
        try {
          const data = await databaseAction();
          setNotice(data.message ?? successFallback);
          await loadCharacters(true);
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : "Water Dungeon mutation failed.");
        } finally {
          setMutatingId(null);
        }
        return;
      }

      setCharacters((currentCharacters) => {
        const nextCharacters = currentCharacters.map((character) =>
          character.id === characterId ? localUpdater(character) : character
        );
        persistLocalCharacters(nextCharacters);
        return nextCharacters;
      });
      setNotice(successFallback);
      setMutatingId(null);
    },
    [dataSource, loadCharacters]
  );

  const openManualEdit = useCallback((character: WaterDungeonCharacter) => {
    setManualTarget(character);
    setManualClearCount(String(character.clearCount));
    setManualLastCompletedAt(toDateTimeLocalInput(character.lastCompletedAt));
    setManualNextAvailableAt(toDateTimeLocalInput(character.nextAvailableAt));
    setManualNote(character.note ?? "");
    setManualBlocked(character.status === "blocked");
  }, []);

  const pendingNextAvailableAt = pendingComplete ? addWaterDungeonCooldown(new Date(nowMs)) : null;

  const confirmComplete = useCallback(async () => {
    if (!pendingComplete) return;

    const completedAt = new Date(nowMs);
    const nextAvailableAt = addWaterDungeonCooldown(completedAt).toISOString();

    await runMutation(
      pendingComplete.id,
      () => completeWaterDungeonRun(pendingComplete.id),
      (character) => ({
        ...character,
        clearCount: character.clearCount + 1,
        lastCompletedAt: completedAt.toISOString(),
        nextAvailableAt,
        status: "onCooldown",
      }),
      `Water Dungeon stamped for ${pendingComplete.name}.`
    );
    setPendingComplete(null);
  }, [nowMs, pendingComplete, runMutation]);

  const submitManualEdit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!manualTarget) return;

      const nextAvailableAt = fromDateTimeLocalInput(manualNextAvailableAt);
      const lastCompletedAt = fromDateTimeLocalInput(manualLastCompletedAt);
      const status: WaterDungeonStatus = manualBlocked ? "blocked" : nextAvailableAt ? "onCooldown" : "available";
      const payload: WaterDungeonManualAdjustPayload = {
        characterId: manualTarget.id,
        clearCount: Number(manualClearCount),
        lastCompletedAt,
        nextAvailableAt,
        note: manualNote.trim() || null,
        status,
      };

      await runMutation(
        manualTarget.id,
        () => manualAdjustWaterDungeonProgress(payload),
        (character) => ({
          ...character,
          clearCount: Math.max(0, Math.floor(Number(manualClearCount) || 0)),
          lastCompletedAt,
          nextAvailableAt,
          note: payload.note,
          status,
        }),
        `Water Dungeon updated for ${manualTarget.name}.`
      );
      setManualTarget(null);
    },
    [
      manualBlocked,
      manualClearCount,
      manualLastCompletedAt,
      manualNextAvailableAt,
      manualNote,
      manualTarget,
      runMutation,
    ]
  );

  const resetCooldown = useCallback(
    async (character: WaterDungeonCharacter) => {
      if (!window.confirm(`Set ${character.name} ready now?`)) return;

      await runMutation(
        character.id,
        () => resetWaterDungeonCooldown(character.id),
        (currentCharacter) => ({
          ...currentCharacter,
          nextAvailableAt: null,
          status: "available",
        }),
        `Water Dungeon cooldown reset for ${character.name}.`
      );
    },
    [runMutation]
  );

  const resetLocalData = useCallback(() => {
    if (dataSource !== "local") return;
    if (!window.confirm("Reset local Water Dungeon data to the seeded roster?")) return;

    const seedCharacters = getSeedCharacters();
    persistLocalCharacters(seedCharacters);
    setCharacters(seedCharacters);
    setNotice("Local Water Dungeon data reset.");
  }, [dataSource]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-sky-300 sm:text-4xl">Water Dungeon</h1>
            <p className="mt-1 text-sm text-slate-400">Next Round Tracker</p>
            <p className="mt-1 text-xs text-slate-600">
              Data: {dataSource === "database" ? WATER_DUNGEON_API_BASE_URL : "local seed / browser storage"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 lg:w-auto lg:items-end">
            <nav className="grid w-full grid-cols-1 gap-2 sm:grid-cols-5 lg:w-auto">
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
                href="/cen-lab"
              >
                Cen Lab
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-violet-500/40 hover:text-violet-200"
                href="/ogch"
              >
                OGCH
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-sky-500/50 bg-sky-950/45 px-4 py-2 text-sm font-bold text-sky-100"
                href="/water-dungeon"
              >
                Water
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-pink-500/40 hover:text-pink-200"
                href="/ogch/bishop"
              >
                Bishop
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-emerald-500/35 bg-emerald-950/25 px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-950/45"
                href="/cen-lab/calculator"
              >
                Public
              </Link>
            </nav>
            <LogoutButton />
          </div>
        </header>

        {notice ? (
          <div className="mb-4 rounded-lg border border-emerald-500/35 bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-200">
            {notice}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-500/35 bg-rose-950/40 px-4 py-3 text-sm font-semibold text-rose-200">
            {error}
          </div>
        ) : null}

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <SummaryCard label="Total" value={summary.total.toString()} tone="sky" />
          <SummaryCard label="Ready" value={summary.available.toString()} tone="emerald" />
          <SummaryCard label="Cooldown" value={summary.cooldown.toString()} tone="orange" />
          <SummaryCard label="Ready Soon" value={summary.readySoon.toString()} tone="cyan" />
          <SummaryCard label="Overdue" value={summary.overdue.toString()} tone="pink" />
          <SummaryCard label="No Slot" value={summary.blocked.toString()} detail={`${summary.noDate} no date`} tone="rose" />
        </section>

        <section className="mb-5 rounded-lg border border-slate-800 bg-slate-900/60 p-3 shadow-lg shadow-black/10">
          <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    filter === item.key
                      ? "border-sky-500/50 bg-sky-950/50 text-sky-100"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Group
                <select
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-200 outline-none transition focus:border-sky-500 sm:w-48"
                  value={groupFilter}
                  onChange={(event) => setGroupFilter(event.target.value as "all" | WaterDungeonGroupId)}
                >
                  {GROUP_FILTERS.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sort
                <select
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-200 outline-none transition focus:border-sky-500 sm:w-48"
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
          </div>
        </section>

        {dataSource === "local" ? (
          <section className="mb-5 flex flex-col gap-3 rounded-lg border border-amber-500/25 bg-amber-950/20 p-3 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold">Local storage mode</span>
            <button
              onClick={resetLocalData}
              className="rounded-lg border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-xs font-bold text-amber-100 transition hover:bg-amber-900/30"
            >
              Reset Local Data
            </button>
          </section>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center text-sm font-semibold text-slate-400">
            Loading Water Dungeon data...
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {visibleCharacters.map((item) => (
              <WaterDungeonCard
                key={item.character.id}
                item={item}
                isMutating={mutatingId === item.character.id}
                onComplete={setPendingComplete}
                onManualEdit={openManualEdit}
                onResetCooldown={resetCooldown}
              />
            ))}
          </section>
        )}

        {!isLoading && visibleCharacters.length === 0 ? (
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center text-sm font-semibold text-slate-500">
            No Water Dungeon characters match this filter.
          </div>
        ) : null}
      </div>

      {pendingComplete && pendingNextAvailableAt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-sky-500/30 bg-slate-900 p-5 shadow-2xl shadow-sky-950/30">
            <h2 className="text-xl font-black text-sky-200">Stamp Water Dungeon</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Mark {pendingComplete.name} as completed now. Next round will be{" "}
              <span className="font-mono font-bold text-sky-100">
                {formatWaterDungeonBangkokDateTime(pendingNextAvailableAt)}
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
                onClick={() => void confirmComplete()}
                disabled={mutatingId === pendingComplete.id}
                className="rounded-lg bg-gradient-to-r from-sky-600 to-violet-600 px-4 py-2 text-sm font-black text-white transition hover:from-sky-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
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
            onSubmit={(event) => void submitManualEdit(event)}
            className="w-full max-w-lg rounded-lg border border-violet-500/30 bg-slate-900 p-5 shadow-2xl shadow-violet-950/30"
          >
            <h2 className="text-xl font-black text-violet-200">Manual Edit</h2>
            <p className="mt-1 text-sm font-semibold text-slate-300">{manualTarget.name}</p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Run Count
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none transition focus:border-violet-500"
                  min={0}
                  onChange={(event) => setManualClearCount(event.target.value)}
                  type="number"
                  value={manualClearCount}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Last Stamp
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none transition focus:border-violet-500"
                  onChange={(event) => setManualLastCompletedAt(event.target.value)}
                  type="datetime-local"
                  value={manualLastCompletedAt}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Next Round
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none transition focus:border-violet-500"
                  onChange={(event) => setManualNextAvailableAt(event.target.value)}
                  type="datetime-local"
                  value={manualNextAvailableAt}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Note
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-violet-500"
                  onChange={(event) => setManualNote(event.target.value)}
                  placeholder="optional"
                  type="text"
                  value={manualNote}
                />
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/45 px-3 py-2 text-sm font-semibold text-slate-300">
                <input
                  checked={manualBlocked}
                  className="h-4 w-4 accent-violet-500"
                  onChange={(event) => setManualBlocked(event.target.checked)}
                  type="checkbox"
                />
                No slot / blocked
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

function WaterDungeonCard({
  item,
  isMutating,
  onComplete,
  onManualEdit,
  onResetCooldown,
}: {
  item: LiveCharacter;
  isMutating: boolean;
  onComplete: (character: WaterDungeonCharacter) => void;
  onManualEdit: (character: WaterDungeonCharacter) => void;
  onResetCooldown: (character: WaterDungeonCharacter) => void;
}) {
  const { character, hasNoDate, isOverdue, remainingSeconds, status } = item;
  const canComplete = status === "available" && !isMutating;
  const statusText = isOverdue ? "Overdue" : hasNoDate && status === "available" ? "No Date" : STATUS_LABELS[status];

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/65 p-3 shadow-lg shadow-black/10 transition hover:border-sky-500/40">
      <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-slate-100">{character.name}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-400">{character.groupLabel}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
            isOverdue ? "border-pink-500/40 bg-pink-950/35 text-pink-200" : STATUS_CLASSES[status]
          }`}
        >
          {statusText}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-sky-500/20 bg-sky-950/20 p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-sky-300">Next Round</p>
          <p className="mt-1 min-h-[28px] font-mono text-base font-black text-sky-100">
            {formatWaterDungeonBangkokDate(character.nextAvailableAt)}
          </p>
        </div>
        <div className="rounded-lg border border-violet-500/20 bg-violet-950/20 p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-violet-300">Time Left</p>
          <p className="mt-1 min-h-[28px] font-mono text-base font-black text-violet-100">
            {status === "blocked" || hasNoDate ? "-" : formatWaterDungeonRemainingTime(remainingSeconds)}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-2">
          <p className="text-slate-500">Last Stamp</p>
          <p className="mt-1 min-h-[18px] font-mono text-slate-200">
            {formatWaterDungeonBangkokDateTime(character.lastCompletedAt)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-2">
          <p className="text-slate-500">Run Count</p>
          <p className="mt-1 min-h-[18px] font-mono text-slate-200">{character.clearCount}</p>
        </div>
      </div>

      {character.note ? (
        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-950/15 p-2 text-xs font-semibold text-amber-100">
          {character.note}
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          onClick={() => onComplete(character)}
          disabled={!canComplete}
          className="rounded-lg bg-gradient-to-r from-sky-600 to-violet-600 px-3 py-2 text-sm font-black text-white shadow-lg shadow-sky-950/20 transition hover:from-sky-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-35 sm:col-span-3"
        >
          {isMutating ? "Saving..." : "Stamp Complete"}
        </button>
        <button
          onClick={() => onManualEdit(character)}
          disabled={isMutating}
          className="rounded-lg border border-violet-500/35 bg-violet-950/30 px-3 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-900/30 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2"
        >
          Manual Edit
        </button>
        <button
          onClick={() => onResetCooldown(character)}
          disabled={isMutating || !character.nextAvailableAt || status === "blocked"}
          className="rounded-lg border border-emerald-500/35 bg-emerald-950/25 px-3 py-2 text-xs font-bold text-emerald-200 transition hover:bg-emerald-950/45 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ready Now
        </button>
      </div>
    </article>
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
  tone: "sky" | "emerald" | "orange" | "cyan" | "pink" | "rose";
}) {
  const toneClass = {
    sky: "border-sky-500/20 bg-sky-950/20 text-sky-100",
    emerald: "border-emerald-500/20 bg-emerald-950/20 text-emerald-100",
    orange: "border-orange-500/20 bg-orange-950/20 text-orange-100",
    cyan: "border-cyan-500/20 bg-cyan-950/20 text-cyan-100",
    pink: "border-pink-500/20 bg-pink-950/20 text-pink-100",
    rose: "border-rose-500/20 bg-rose-950/20 text-rose-100",
  }[tone];

  return (
    <div className={`min-w-0 rounded-lg border p-3 shadow-lg shadow-black/10 ${toneClass}`}>
      <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 truncate font-mono text-2xl font-black">{value}</p>
      {detail ? <p className="mt-1 truncate text-xs font-semibold text-slate-400">{detail}</p> : null}
    </div>
  );
}
