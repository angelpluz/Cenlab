"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import SakrayCharacterCard, {
  type SakrayPartyLink,
} from "@/components/sakray/SakrayCharacterCard";
import SakrayNav from "@/components/sakray/SakrayNav";
import { addBangkokGameDayCooldown } from "@/lib/game-day";
import {
  formatBangkokDateTime,
  getLiveCooldownStatus,
} from "@/lib/ogch";
import {
  completeSakrayRun,
  getSakrayState,
  manualAdjustSakrayProgress,
  resetSakrayCooldown,
  SAKRAY_API_BASE_URL,
  saveSakrayMapping,
} from "@/lib/sakray-api";
import type {
  SakrayCharacter,
  SakrayRole,
  SakrayState,
} from "@/lib/sakray-types";

type FilterKey = "all" | "available" | "cooldown";
type SortKey = "nextAvailable" | "name" | "clearCount";
type Notice = { tone: "success" | "error"; text: string } | null;

const EMPTY_STATE: SakrayState = { characters: [], mappings: {} };

const ROLE_LABELS: Record<SakrayRole, string> = {
  windhawk: "Windhawk Set",
  bishop: "Bishop / Cardinal",
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "cooldown", label: "On Cooldown" },
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

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "emerald" | "orange" | "pink" | "violet";
}) {
  const toneClasses = {
    cyan: "border-cyan-500/25 bg-cyan-950/20 text-cyan-100",
    emerald: "border-emerald-500/25 bg-emerald-950/20 text-emerald-100",
    orange: "border-orange-500/25 bg-orange-950/20 text-orange-100",
    pink: "border-pink-500/25 bg-pink-950/20 text-pink-100",
    violet: "border-violet-500/25 bg-violet-950/20 text-violet-100",
  }[tone];

  return (
    <div className={`rounded-xl border p-3 ${toneClasses}`}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 font-mono text-2xl font-black">{value}</p>
    </div>
  );
}

export default function SakrayTracker() {
  const [state, setState] = useState<SakrayState>(EMPTY_STATE);
  const [role, setRole] = useState<SakrayRole>("windhawk");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("nextAvailable");
  const [search, setSearch] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [pendingComplete, setPendingComplete] = useState<SakrayCharacter | null>(null);
  const [mappingTarget, setMappingTarget] = useState<SakrayCharacter | null>(null);
  const [mappingSelection, setMappingSelection] = useState("");
  const [mappingSearch, setMappingSearch] = useState("");
  const [manualTarget, setManualTarget] = useState<SakrayCharacter | null>(null);
  const [manualClearCount, setManualClearCount] = useState("0");
  const [manualLastCompletedAt, setManualLastCompletedAt] = useState("");
  const [manualNextAvailableAt, setManualNextAvailableAt] = useState("");

  const refresh = useCallback(async (silent = false) => {
    if (silent) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const nextState = await getSakrayState();
      setState(nextState);
      if (!silent) setNotice(null);
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "โหลดข้อมูล Sakray ไม่สำเร็จ",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const clock = window.setInterval(() => setNowMs(Date.now()), 1_000);
    const sync = window.setInterval(() => void refresh(true), 60_000);
    const onFocus = () => void refresh(true);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh(true);
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(clock);
      window.clearInterval(sync);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh]);

  const characterById = useMemo(
    () => new Map(state.characters.map((character) => [character.id, character])),
    [state.characters]
  );

  useEffect(() => {
    const anchorId = window.location.hash.replace(/^#sakray-character-/, "");
    const anchoredCharacter = characterById.get(anchorId);
    if (anchoredCharacter) setRole(anchoredCharacter.role);
  }, [characterById]);

  const roleCharacters = useMemo(
    () => state.characters.filter((character) => character.role === role),
    [role, state.characters]
  );

  const inverseMappings = useMemo(() => {
    const inverse = new Map<string, string[]>();

    Object.entries(state.mappings).forEach(([windhawkId, bishopId]) => {
      const leaders = inverse.get(bishopId) ?? [];
      leaders.push(windhawkId);
      inverse.set(bishopId, leaders);
    });

    return inverse;
  }, [state.mappings]);

  const getPartyLinks = useCallback(
    (character: SakrayCharacter): SakrayPartyLink[] => {
      if (character.role === "windhawk") {
        const bishopId = state.mappings[character.id];
        const bishop = bishopId ? characterById.get(bishopId) : undefined;
        return bishop ? [{ id: bishop.id, name: bishop.name, role: bishop.role }] : [];
      }

      return (inverseMappings.get(character.id) ?? [])
        .map((windhawkId) => characterById.get(windhawkId))
        .filter((member): member is SakrayCharacter => Boolean(member))
        .map((member) => ({ id: member.id, name: member.name, role: member.role }));
    },
    [characterById, inverseMappings, state.mappings]
  );

  const isPartyReady = useCallback(
    (character: SakrayCharacter) => {
      if (character.role !== "windhawk") return true;
      const bishopId = state.mappings[character.id];
      const bishop = bishopId ? characterById.get(bishopId) : undefined;
      return !bishop || getLiveCooldownStatus(bishop.nextAvailableAt, bishop.cooldownStatus, new Date(nowMs)) === "available";
    },
    [characterById, nowMs, state.mappings]
  );

  const summary = useMemo(() => {
    let available = 0;
    let cooldown = 0;
    let mapped = 0;
    let runs = 0;
    const now = new Date(nowMs);

    roleCharacters.forEach((character) => {
      const status = getLiveCooldownStatus(character.nextAvailableAt, character.cooldownStatus, now);
      if (status === "available") available += 1;
      else cooldown += 1;

      runs += character.clearCount;
      if (character.role === "windhawk") {
        if (state.mappings[character.id]) mapped += 1;
      } else if ((inverseMappings.get(character.id) ?? []).length > 0) {
        mapped += 1;
      }
    });

    return { total: roleCharacters.length, available, cooldown, mapped, runs };
  }, [inverseMappings, nowMs, roleCharacters, state.mappings]);

  const visibleCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = new Date(nowMs);

    return roleCharacters
      .filter((character) => {
        if (query && !`${character.name} ${character.job}`.toLowerCase().includes(query)) return false;
        const status = getLiveCooldownStatus(character.nextAvailableAt, character.cooldownStatus, now);
        if (filter === "available") return status === "available";
        if (filter === "cooldown") return status !== "available";
        return true;
      })
      .sort((left, right) => {
        if (sort === "name") return left.name.localeCompare(right.name);
        if (sort === "clearCount") return right.clearCount - left.clearCount || left.name.localeCompare(right.name);

        const leftTime = left.nextAvailableAt ? new Date(left.nextAvailableAt).getTime() : 0;
        const rightTime = right.nextAvailableAt ? new Date(right.nextAvailableAt).getTime() : 0;
        return leftTime - rightTime || left.name.localeCompare(right.name);
      });
  }, [filter, nowMs, roleCharacters, search, sort]);

  const runMutation = useCallback(
    async (characterId: string, mutation: () => Promise<SakrayState>, successText: string) => {
      setMutatingId(characterId);
      setNotice(null);

      try {
        const nextState = await mutation();
        setState(nextState);
        setNotice({ tone: "success", text: successText });
        return true;
      } catch (error) {
        setNotice({
          tone: "error",
          text: error instanceof Error ? error.message : "บันทึกข้อมูล Sakray ไม่สำเร็จ",
        });
        return false;
      } finally {
        setMutatingId(null);
      }
    },
    []
  );

  const navigateToPartyMember = useCallback((member: SakrayPartyLink) => {
    setRole(member.role);
    const hash = `#sakray-character-${member.id}`;
    window.history.replaceState(null, "", hash);
    window.setTimeout(() => {
      document.getElementById(`sakray-character-${member.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }, []);

  const openMapping = useCallback(
    (character: SakrayCharacter) => {
      setMappingTarget(character);
      setMappingSelection(state.mappings[character.id] ?? "");
      setMappingSearch("");
    },
    [state.mappings]
  );

  const submitMapping = useCallback(async () => {
    if (!mappingTarget) return;
    const saved = await runMutation(
      mappingTarget.id,
      () => saveSakrayMapping(mappingTarget.id, mappingSelection || null),
      mappingSelection ? "บันทึก Party mapping แล้ว" : "ลบ Party mapping แล้ว"
    );
    if (saved) setMappingTarget(null);
  }, [mappingSelection, mappingTarget, runMutation]);

  const confirmComplete = useCallback(async () => {
    if (!pendingComplete) return;
    const mappedBishopId = pendingComplete.role === "windhawk" ? state.mappings[pendingComplete.id] : undefined;
    const mappedBishop = mappedBishopId ? characterById.get(mappedBishopId) : undefined;
    const successText = mappedBishop
      ? `บันทึกรอบของ ${pendingComplete.name} และ ${mappedBishop.name} แล้ว`
      : `บันทึกรอบของ ${pendingComplete.name} แล้ว`;
    const saved = await runMutation(
      pendingComplete.id,
      () => completeSakrayRun(pendingComplete.id),
      successText
    );
    if (saved) setPendingComplete(null);
  }, [characterById, pendingComplete, runMutation, state.mappings]);

  const openManualEdit = useCallback((character: SakrayCharacter) => {
    setManualTarget(character);
    setManualClearCount(String(character.clearCount));
    setManualLastCompletedAt(toDateTimeLocalInput(character.lastCompletedAt));
    setManualNextAvailableAt(toDateTimeLocalInput(character.nextAvailableAt));
  }, []);

  const submitManualEdit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!manualTarget) return;

      const clearCount = Number(manualClearCount);
      if (!Number.isInteger(clearCount) || clearCount < 0) {
        setNotice({ tone: "error", text: "Clear Count ต้องเป็นเลขจำนวนเต็มตั้งแต่ 0 ขึ้นไป" });
        return;
      }

      const saved = await runMutation(
        manualTarget.id,
        () => manualAdjustSakrayProgress({
          characterId: manualTarget.id,
          clearCount,
          lastCompletedAt: fromDateTimeLocalInput(manualLastCompletedAt),
          nextAvailableAt: fromDateTimeLocalInput(manualNextAvailableAt),
        }),
        `แก้ไขข้อมูลของ ${manualTarget.name} แล้ว`
      );
      if (saved) setManualTarget(null);
    },
    [
      manualClearCount,
      manualLastCompletedAt,
      manualNextAvailableAt,
      manualTarget,
      runMutation,
    ]
  );

  const handleResetCooldown = useCallback(
    async (character: SakrayCharacter) => {
      if (!window.confirm(`Reset cooldown ของ ${character.name} ใช่ไหม?`)) return;
      await runMutation(
        character.id,
        () => resetSakrayCooldown(character.id),
        `Reset cooldown ของ ${character.name} แล้ว`
      );
    },
    [runMutation]
  );

  const mappedBishop = pendingComplete?.role === "windhawk"
    ? characterById.get(state.mappings[pendingComplete.id] ?? "")
    : undefined;
  const predictedNextReset = addBangkokGameDayCooldown(new Date(nowMs), 1);
  const bishopCandidates = state.characters
    .filter((character) => character.role === "bishop")
    .filter((character) => {
      const query = mappingSearch.trim().toLowerCase();
      return !query || `${character.name} ${character.job}`.toLowerCase().includes(query);
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-[1900px] px-3 py-5 sm:px-5 lg:px-6">
        <header className="mb-5 flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-pink-300 via-violet-300 to-cyan-300 bg-clip-text text-4xl font-black text-transparent">
              ดัน Sakray
            </h1>
            <p className="mt-1 text-sm text-slate-400">Windhawk + Bishop / Cardinal Daily Run Tracker</p>
            <p className="mt-1 text-xs text-slate-600">Data: {SAKRAY_API_BASE_URL} · Reset 04:00 Bangkok</p>
          </div>
          <SakrayNav />
        </header>

        {notice ? (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
              notice.tone === "success"
                ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-100"
                : "border-rose-500/30 bg-rose-950/30 text-rose-100"
            }`}
            role="status"
          >
            {notice.text}
          </div>
        ) : null}

        <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard label="Total Characters" value={summary.total.toString()} tone="cyan" />
          <SummaryCard label="Available Now" value={summary.available.toString()} tone="emerald" />
          <SummaryCard label="On Cooldown" value={summary.cooldown.toString()} tone="orange" />
          <SummaryCard label="Mapped" value={summary.mapped.toString()} tone="violet" />
          <SummaryCard label="Total Sakray Runs" value={summary.runs.toString()} tone="pink" />
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-2 gap-2">
              {(["windhawk", "bishop"] as const).map((roleKey) => (
                <button
                  className={`rounded-lg border px-4 py-2 text-sm font-black transition ${
                    role === roleKey
                      ? "border-pink-500/50 bg-pink-950/45 text-pink-100"
                      : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-pink-500/35"
                  }`}
                  key={roleKey}
                  onClick={() => setRole(roleKey)}
                  type="button"
                >
                  {ROLE_LABELS[roleKey]} ({state.characters.filter((item) => item.role === roleKey).length})
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                  <button
                    className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                      filter === item.key
                        ? "border-cyan-500/50 bg-cyan-950/45 text-cyan-100"
                        : "border-slate-700 bg-slate-950/60 text-slate-400 hover:text-slate-200"
                    }`}
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <input
                aria-label="Search characters"
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-pink-500 sm:w-52"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or job..."
                value={search}
              />
              <select
                aria-label="Sort characters"
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-200 outline-none focus:border-pink-500"
                onChange={(event) => setSort(event.target.value as SortKey)}
                value={sort}
              >
                <option value="nextAvailable">Next available time</option>
                <option value="name">Name</option>
                <option value="clearCount">Clear count</option>
              </select>
              <button
                className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-500/40 disabled:opacity-50"
                disabled={isRefreshing}
                onClick={() => void refresh(true)}
                type="button"
              >
                {isRefreshing ? "Syncing..." : "Sync Now"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-pink-500/25 bg-gradient-to-r from-pink-950/25 via-violet-950/20 to-cyan-950/20 px-4 py-3 text-sm leading-6 text-slate-200">
          คูลดาวน์ Sakray 1 วันเกม ตัดรอบเวลา 04:00 น. กรุงเทพฯ ข้อมูลรอบและ Party mapping ซิงก์จากฐานข้อมูลกลางทุกเครื่อง
          เมื่อจบด้วย Windhawk ระบบจะบันทึก Bishop / Cardinal ที่ map ไว้พร้อมกันในครั้งเดียว
        </section>

        {isLoading ? (
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/55 p-10 text-center text-sm text-slate-400">
            Loading Sakray data...
          </div>
        ) : visibleCharacters.length ? (
          <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {visibleCharacters.map((character) => (
              <SakrayCharacterCard
                character={character}
                isMutating={mutatingId === character.id}
                isPartyReady={isPartyReady(character)}
                key={character.id}
                nowMs={nowMs}
                onComplete={setPendingComplete}
                onManageMapping={character.role === "windhawk" ? openMapping : undefined}
                onManualEdit={openManualEdit}
                onNavigateParty={navigateToPartyMember}
                onResetCooldown={(item) => void handleResetCooldown(item)}
                partyLinks={getPartyLinks(character)}
              />
            ))}
          </section>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-900/35 p-10 text-center text-sm text-slate-500">
            ไม่พบตัวละครตามตัวกรองนี้
          </div>
        )}
      </div>

      {pendingComplete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-pink-500/30 bg-slate-900 p-5 shadow-2xl shadow-pink-950/30">
            <h2 className="text-xl font-black text-pink-200">Complete Sakray Run</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              บันทึกรอบของ <span className="font-bold text-white">{pendingComplete.name}</span>
              {mappedBishop ? (
                <> และ <span className="font-bold text-cyan-200">{mappedBishop.name}</span> ที่ map ไว้</>
              ) : null}
              ?
            </p>
            {pendingComplete.role === "windhawk" && !mappedBishop ? (
              <p className="mt-2 rounded-lg border border-amber-500/25 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
                ตัวนี้ยังไม่ได้ map Bishop / Cardinal ระบบจะบันทึกเฉพาะ Windhawk
              </p>
            ) : null}
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-400">
              รอบถัดไป: <span className="font-mono font-bold text-slate-100">{formatBangkokDateTime(predictedNextReset)}</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
                onClick={() => setPendingComplete(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-pink-600 to-violet-600 px-4 py-2 text-sm font-black text-white transition hover:brightness-110 disabled:opacity-50"
                disabled={mutatingId === pendingComplete.id}
                onClick={() => void confirmComplete()}
                type="button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {mappingTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-sky-500/30 bg-slate-900 shadow-2xl shadow-sky-950/30">
            <div className="border-b border-slate-800 p-5">
              <h2 className="text-xl font-black text-sky-200">Party Mapping</h2>
              <p className="mt-1 text-sm text-slate-400">
                {mappingTarget.name} · เลือก Bishop / Cardinal ได้ 1 ตัว
              </p>
              <input
                aria-label="Search bishop"
                className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
                onChange={(event) => setMappingSearch(event.target.value)}
                placeholder="Search Bishop / Cardinal..."
                value={mappingSearch}
              />
            </div>
            <div className="overflow-y-auto p-4">
              <button
                className={`mb-2 w-full rounded-lg border p-3 text-left text-sm font-bold transition ${
                  mappingSelection === ""
                    ? "border-rose-500/50 bg-rose-950/30 text-rose-100"
                    : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-rose-500/30"
                }`}
                onClick={() => setMappingSelection("")}
                type="button"
              >
                ไม่เลือก Bishop / Cardinal
              </button>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {bishopCandidates.map((bishop) => {
                  const selected = mappingSelection === bishop.id;
                  const status = getLiveCooldownStatus(bishop.nextAvailableAt, bishop.cooldownStatus, new Date(nowMs));
                  const leaderCount = (inverseMappings.get(bishop.id) ?? []).length;

                  return (
                    <button
                      className={`rounded-lg border p-3 text-left transition ${
                        selected
                          ? "border-sky-400/60 bg-sky-950/40 ring-1 ring-sky-400/20"
                          : "border-slate-800 bg-slate-950/50 hover:border-sky-500/30"
                      }`}
                      key={bishop.id}
                      onClick={() => setMappingSelection(bishop.id)}
                      type="button"
                    >
                      <span className="block font-bold text-slate-100">{bishop.name}</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        Lv.{bishop.baseLevel} {bishop.job} · {status === "available" ? "Available" : "On cooldown"}
                      </span>
                      {leaderCount ? (
                        <span className="mt-1 block text-[11px] text-sky-300">Mapped with {leaderCount} Windhawk</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-800 p-5">
              <button
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-200"
                onClick={() => setMappingTarget(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
                disabled={mutatingId === mappingTarget.id}
                onClick={() => void submitMapping()}
                type="button"
              >
                Save Mapping
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {manualTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <form
            className="w-full max-w-lg rounded-xl border border-violet-500/30 bg-slate-900 p-5 shadow-2xl shadow-violet-950/30"
            onSubmit={(event) => void submitManualEdit(event)}
          >
            <h2 className="text-xl font-black text-violet-200">Manual Edit</h2>
            <p className="mt-1 text-sm font-semibold text-slate-300">{manualTarget.name}</p>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Clear Count
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none focus:border-violet-500"
                  min={0}
                  onChange={(event) => setManualClearCount(event.target.value)}
                  type="number"
                  value={manualClearCount}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Last Completed
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none focus:border-violet-500"
                  onChange={(event) => setManualLastCompletedAt(event.target.value)}
                  type="datetime-local"
                  value={manualLastCompletedAt}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Next Available
                <input
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-100 outline-none focus:border-violet-500"
                  onChange={(event) => setManualNextAvailableAt(event.target.value)}
                  type="datetime-local"
                  value={manualNextAvailableAt}
                />
              </label>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-200"
                onClick={() => setManualTarget(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
                disabled={mutatingId === manualTarget.id}
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
