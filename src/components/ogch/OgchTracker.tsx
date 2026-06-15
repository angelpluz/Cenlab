"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import OgchCharacterCard from "@/components/ogch/OgchCharacterCard";
import OgchNav from "@/components/ogch/OgchNav";
import {
  API_BASE_URL,
  completeOgchRun,
  getOgchCharacters,
  manualAdjustOgchProgress,
  resetOgchCooldown,
} from "@/lib/api";
import {
  addOgchCooldown,
  formatBangkokDateTime,
  formatExp,
  formatRemainingTime,
  getLiveCooldownStatus,
  getRemainingCooldownSeconds,
} from "@/lib/ogch";
import type { OgchCharacterProgress, OgchMutationApiResponse } from "@/lib/ogch-types";
import {
  OGCH_STATIC_ROSTER_EVENT,
  completeOgchStaticRosterMembers,
  getOgchStaticRosterStorageKey,
  readOgchPartySelections,
  readOgchStaticRoster,
  writeOgchPartySelections,
  type OgchPartyMember,
  type OgchPartyMemberDisplay,
  type OgchStaticRosterJob,
} from "@/lib/ogch-static-rosters";

type FilterKey = "all" | "available" | "cooldown" | "readySoon" | "lv10" | "needProgress";
type SortKey = "nextAvailable" | "ogchLevel" | "clearCount" | "name";

type LiveCharacter = {
  character: OgchCharacterProgress;
  cooldownStatus: ReturnType<typeof getLiveCooldownStatus>;
  remainingSeconds: number;
};

type PartyRosterItem = {
  character: OgchCharacterProgress;
  cooldownStatus: ReturnType<typeof getLiveCooldownStatus>;
  job: OgchStaticRosterJob;
  jobLabel: string;
  remainingSeconds: number;
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

export default function OgchTracker() {
  const [characters, setCharacters] = useState<OgchCharacterProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("nextAvailable");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [pendingComplete, setPendingComplete] = useState<OgchCharacterProgress | null>(null);
  const [manualTarget, setManualTarget] = useState<OgchCharacterProgress | null>(null);
  const [manualClearCount, setManualClearCount] = useState("0");
  const [manualLastCompletedAt, setManualLastCompletedAt] = useState("");
  const [manualNextAvailableAt, setManualNextAvailableAt] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [partySelections, setPartySelections] = useState<Record<string, OgchPartyMember[]>>({});
  const [partyTarget, setPartyTarget] = useState<OgchCharacterProgress | null>(null);
  const [partySearch, setPartySearch] = useState("");
  const [staticPartyRoster, setStaticPartyRoster] = useState<Record<OgchStaticRosterJob, OgchCharacterProgress[]>>({
    bishop: [],
    dancer: [],
  });

  const refreshCharacters = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    setError(null);

    try {
      const data = await getOgchCharacters();
      setCharacters(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load OGCH data.");
    } finally {
      if (!quiet) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCharacters();
  }, [refreshCharacters]);

  const refreshStaticPartyRoster = useCallback(() => {
    setStaticPartyRoster({
      bishop: readOgchStaticRoster("bishop"),
      dancer: readOgchStaticRoster("dancer"),
    });
  }, []);

  useEffect(() => {
    setPartySelections(readOgchPartySelections());
    refreshStaticPartyRoster();

    function handleRosterEvent() {
      refreshStaticPartyRoster();
    }

    function handleStorageEvent(event: StorageEvent) {
      if (
        event.key === getOgchStaticRosterStorageKey("bishop") ||
        event.key === getOgchStaticRosterStorageKey("dancer")
      ) {
        refreshStaticPartyRoster();
      }
    }

    window.addEventListener(OGCH_STATIC_ROSTER_EVENT, handleRosterEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(OGCH_STATIC_ROSTER_EVENT, handleRosterEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [refreshStaticPartyRoster]);

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
    const totalAvailableExp = available.reduce(
      (total, item) => total + Number(item.character.expReward),
      0
    );

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

  const resolvedPartySelections = useMemo<Record<string, OgchPartyMemberDisplay[]>>(() => {
    const charactersByJob = {
      bishop: new Map(staticPartyRoster.bishop.map((character) => [character.id, character])),
      dancer: new Map(staticPartyRoster.dancer.map((character) => [character.id, character])),
    };

    return Object.fromEntries(
      Object.entries(partySelections).map(([leaderId, members]) => [
        leaderId,
        members.flatMap((member) => {
          const character = charactersByJob[member.job].get(member.characterId);
          if (!character) return [];

          return {
            characterId: character.id,
            job: member.job,
            jobLabel: character.job,
            key: `${member.job}:${character.id}`,
            name: character.name,
          };
        }),
      ])
    );
  }, [partySelections, staticPartyRoster]);

  const partyRosterItems = useMemo<PartyRosterItem[]>(() => {
    const now = new Date(nowMs);
    const query = partySearch.trim().toLowerCase();

    return (["bishop", "dancer"] as const)
      .flatMap((job) =>
        staticPartyRoster[job].map((character) => ({
          character,
          cooldownStatus: getLiveCooldownStatus(character.nextAvailableAt, character.cooldownStatus, now),
          job,
          jobLabel: character.job,
          remainingSeconds:
            character.nextAvailableAt === null
              ? character.remainingCooldownSeconds
              : getRemainingCooldownSeconds(character.nextAvailableAt, now),
        }))
      )
      .filter((item) => {
        if (!query) return true;
        return `${item.character.name} ${item.jobLabel}`.toLowerCase().includes(query);
      })
      .sort(
        (a, b) =>
          a.jobLabel.localeCompare(b.jobLabel) ||
          a.character.name.localeCompare(b.character.name)
      );
  }, [nowMs, partySearch, staticPartyRoster]);

  const updatePartySelection = useCallback(
    (leaderId: string, updater: (currentMembers: OgchPartyMember[]) => OgchPartyMember[]) => {
      setPartySelections((currentSelections) => {
        const nextMembers = updater(currentSelections[leaderId] ?? []);
        const nextSelections = {
          ...currentSelections,
          [leaderId]: nextMembers,
        };

        if (nextMembers.length === 0) {
          delete nextSelections[leaderId];
        }

        writeOgchPartySelections(nextSelections);
        return nextSelections;
      });
    },
    []
  );

  const runMutation = useCallback(
    async (
      characterId: string,
      action: () => Promise<OgchMutationApiResponse>,
      successFallback: string
    ): Promise<boolean> => {
      setMutatingId(characterId);

      try {
        const data = await action();
        setNotice(data.message ?? successFallback);
        await refreshCharacters(true);
        return true;
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "OGCH mutation failed.");
        return false;
      } finally {
        setMutatingId(null);
      }
    },
    [refreshCharacters]
  );

  const openManualEdit = useCallback((character: OgchCharacterProgress) => {
    setManualTarget(character);
    setManualClearCount(String(character.clearCount));
    setManualLastCompletedAt(toDateTimeLocalInput(character.lastCompletedAt));
    setManualNextAvailableAt(toDateTimeLocalInput(character.nextAvailableAt));
  }, []);

  const openPartyBuilder = useCallback(
    (character: OgchCharacterProgress) => {
      refreshStaticPartyRoster();
      setPartyTarget(character);
      setPartySearch("");
    },
    [refreshStaticPartyRoster]
  );

  const togglePartyMember = useCallback(
    (leaderId: string, member: OgchPartyMember) => {
      updatePartySelection(leaderId, (currentMembers) => {
        const isSelected = currentMembers.some(
          (currentMember) => currentMember.job === member.job && currentMember.characterId === member.characterId
        );

        if (isSelected) {
          return currentMembers.filter(
            (currentMember) =>
              currentMember.job !== member.job || currentMember.characterId !== member.characterId
          );
        }

        return [
          ...currentMembers.filter((currentMember) => currentMember.job !== member.job),
          member,
        ];
      });
    },
    [updatePartySelection]
  );

  const confirmComplete = useCallback(async () => {
    if (!pendingComplete) return;

    const completedAt = new Date(nowMs);
    const partyMembers = partySelections[pendingComplete.id] ?? [];
    const completed = await runMutation(
      pendingComplete.id,
      () => completeOgchRun(pendingComplete.id),
      "OGCH completed. Next run available in 3 days."
    );

    if (completed && partyMembers.length > 0) {
      const completedMembers = completeOgchStaticRosterMembers(partyMembers, completedAt);
      refreshStaticPartyRoster();
      setNotice(
        completedMembers.length > 0
          ? `OGCH completed. Party stamped: ${completedMembers.map((member) => member.name).join(", ")}.`
          : "OGCH completed. Next run available in 3 days."
      );
    }

    setPendingComplete(null);
  }, [nowMs, partySelections, pendingComplete, refreshStaticPartyRoster, runMutation]);

  const submitManualEdit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!manualTarget) return;

      await runMutation(
        manualTarget.id,
        () => manualAdjustOgchProgress({
          characterId: manualTarget.id,
          clearCount: Number(manualClearCount),
          lastCompletedAt: fromDateTimeLocalInput(manualLastCompletedAt),
          nextAvailableAt: fromDateTimeLocalInput(manualNextAvailableAt),
        }),
        "OGCH progress updated."
      );
      setManualTarget(null);
    },
    [manualClearCount, manualLastCompletedAt, manualNextAvailableAt, manualTarget, runMutation]
  );

  const resetCooldown = useCallback(
    async (character: OgchCharacterProgress) => {
      if (!window.confirm(`Reset OGCH cooldown for ${character.name}?`)) return;

      await runMutation(
        character.id,
        () => resetOgchCooldown(character.id),
        "OGCH cooldown reset."
      );
    },
    [runMutation]
  );

  const pendingNextAvailableAt = pendingComplete ? addOgchCooldown(new Date(nowMs)) : null;
  const pendingPartyMembers = pendingComplete ? resolvedPartySelections[pendingComplete.id] ?? [] : [];
  const partyTargetMembers = partyTarget ? partySelections[partyTarget.id] ?? [] : [];
  const partyTargetDisplays = partyTarget ? resolvedPartySelections[partyTarget.id] ?? [] : [];
  const selectedPartyKeys = new Set(
    partyTargetMembers.map((member) => `${member.job}:${member.characterId}`)
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-cyan-300 sm:text-4xl">OGCH</h1>
            <p className="mt-1 text-sm text-slate-400">Windhawk Dungeon Run Tracker</p>
            <p className="mt-1 text-xs text-slate-600">API: {API_BASE_URL}</p>
          </div>
          <OgchNav active="windhawk" />
        </header>

        {notice ? (
          <div className="mb-4 rounded-xl border border-emerald-500/35 bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-200">
            {notice}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-500/35 bg-rose-950/40 px-4 py-3 text-sm font-semibold text-rose-200">
            {error}
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

        {isLoading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm font-semibold text-slate-400">
            Loading OGCH data...
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {visibleCharacters.map(({ character }) => (
              <OgchCharacterCard
                key={character.id}
                character={character}
                isMutating={mutatingId === character.id}
                nowMs={nowMs}
                onComplete={setPendingComplete}
                onManageParty={openPartyBuilder}
                onManualEdit={openManualEdit}
                onResetCooldown={resetCooldown}
                partyMembers={resolvedPartySelections[character.id] ?? []}
              />
            ))}
          </section>
        )}

        {!isLoading && visibleCharacters.length === 0 ? (
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
            {pendingPartyMembers.length > 0 ? (
              <div className="mt-3 rounded-lg border border-sky-500/20 bg-sky-950/20 p-3 text-sm text-sky-100">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-300">Also Stamp Party</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pendingPartyMembers.map((member) => (
                    <span
                      key={member.key}
                      className="rounded-full border border-sky-500/25 bg-slate-950/50 px-2 py-1 text-xs font-semibold"
                    >
                      {member.jobLabel}: {member.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
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
                className="rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-2 text-sm font-black text-white transition hover:from-cyan-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {partyTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl border border-sky-500/30 bg-slate-900 shadow-2xl shadow-sky-950/30">
            <div className="border-b border-slate-800 p-5">
              <h2 className="text-xl font-black text-sky-200">Party Setup</h2>
              <p className="mt-1 text-sm font-semibold text-slate-300">
                Leader: {partyTarget.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {partyTargetDisplays.length > 0 ? (
                  partyTargetDisplays.map((member) => (
                    <span
                      key={member.key}
                      className="rounded-full border border-sky-500/25 bg-sky-950/30 px-2 py-1 text-xs font-semibold text-sky-100"
                    >
                      {member.jobLabel}: {member.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-semibold text-slate-500">No members selected.</span>
                )}
              </div>
            </div>

            <div className="p-5">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                Search Bishop / Bard&Dancer
                <input
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-sky-500"
                  onChange={(event) => setPartySearch(event.target.value)}
                  placeholder="Character name"
                  type="search"
                  value={partySearch}
                />
              </label>

              <div className="mt-4 max-h-[48vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {partyRosterItems.map((item) => {
                    const memberKey = `${item.job}:${item.character.id}`;
                    const isSelected = selectedPartyKeys.has(memberKey);
                    const selectedSameJob = partyTargetMembers.some((member) => member.job === item.job);
                    const canAdd = item.cooldownStatus === "available";

                    return (
                      <div
                        key={memberKey}
                        className={`rounded-lg border p-3 ${
                          isSelected
                            ? "border-sky-500/45 bg-sky-950/25"
                            : "border-slate-800 bg-slate-950/45"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-100">{item.character.name}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{item.jobLabel}</p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-black uppercase ${
                              item.cooldownStatus === "available"
                                ? "border-emerald-500/35 bg-emerald-950/35 text-emerald-200"
                                : "border-orange-500/35 bg-orange-950/35 text-orange-200"
                            }`}
                          >
                            {item.cooldownStatus === "available"
                              ? "Ready"
                              : formatRemainingTime(item.remainingSeconds)}
                          </span>
                        </div>
                        <button
                          className="mt-3 w-full rounded-lg border border-sky-500/35 bg-sky-950/25 px-3 py-2 text-xs font-bold text-sky-100 transition hover:bg-sky-900/30 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/30 disabled:text-slate-600"
                          disabled={!isSelected && !canAdd}
                          onClick={() =>
                            togglePartyMember(partyTarget.id, {
                              characterId: item.character.id,
                              job: item.job,
                            })
                          }
                          type="button"
                        >
                          {isSelected ? "Remove" : selectedSameJob ? "Replace" : canAdd ? "Add" : "On Cooldown"}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {partyRosterItems.length === 0 ? (
                  <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-6 text-center text-sm font-semibold text-slate-500">
                    No party members match this search.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-800 p-5">
              <button
                onClick={() => {
                  updatePartySelection(partyTarget.id, () => []);
                  setPartyTarget(null);
                }}
                className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-4 py-2 text-sm font-bold text-rose-200 transition hover:bg-rose-950/45"
                type="button"
              >
                Clear Party
              </button>
              <button
                onClick={() => setPartyTarget(null)}
                className="rounded-lg bg-gradient-to-r from-sky-600 to-violet-600 px-4 py-2 text-sm font-black text-white transition hover:from-sky-500 hover:to-violet-500"
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {manualTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => void submitManualEdit(event)}
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
