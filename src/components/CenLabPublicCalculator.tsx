"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type StageId = "stage1" | "stage2" | "stage3";

type TimerStage = {
  id: StageId;
  title: string;
  duration: number;
  remaining: number;
  status: "waiting" | "running" | "finished" | "stopped";
};

type SlotRun = {
  slotId: string;
  stages: TimerStage[];
  startedAt: number;
};

type SlotRunMap = Record<string, SlotRun>;

const INITIAL_STAGES: TimerStage[] = [
  { id: "stage1", title: "Initial Spawn", duration: 150, remaining: 150, status: "waiting" },
  { id: "stage2", title: "Second Spawn", duration: 80, remaining: 80, status: "waiting" },
  { id: "stage3", title: "Third Spawn", duration: 160, remaining: 160, status: "waiting" },
];

function cloneStages(): TimerStage[] {
  return INITIAL_STAGES.map((stage) => ({ ...stage }));
}

function createRun(slotId: string): SlotRun {
  return {
    slotId,
    stages: cloneStages(),
    startedAt: Date.now(),
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getCurrentStage(run: SlotRun): TimerStage {
  return (
    run.stages.find((stage) => stage.status === "running") ??
    [...run.stages].reverse().find((stage) => stage.status === "finished") ??
    run.stages[0]
  );
}

function canAdvanceFromStage(run: SlotRun | undefined, stageId: StageId): boolean {
  if (!run) return false;

  const stageIndex = run.stages.findIndex((stage) => stage.id === stageId);
  if (stageIndex === -1) return false;

  const stage = run.stages[stageIndex];
  const nextStage = run.stages[stageIndex + 1];
  const stageReady = stage.status === "running" || stage.status === "finished";

  return stageReady && (!nextStage || nextStage.status === "waiting");
}

function isRunComplete(run: SlotRun): boolean {
  return run.stages[2].status === "finished";
}

function getStageTone(stage: TimerStage): {
  borderClass: string;
  bgClass: string;
  titleColor: string;
  timeColor: string;
  statusBadge: string;
} {
  const isActive = stage.status === "running";
  const isFinished = stage.status === "finished";
  const isWarning = isActive && stage.remaining <= 10 && stage.remaining > 0;

  if (isWarning) {
    return {
      borderClass: "border-orange-500/80 animate-blink",
      bgClass: "bg-orange-950/30",
      titleColor: "text-orange-300",
      timeColor: "text-orange-200",
      statusBadge: "Get Ready",
    };
  }

  if (isActive) {
    return {
      borderClass: "border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
      bgClass: "bg-cyan-950/20",
      titleColor: "text-cyan-300",
      timeColor: "text-cyan-200",
      statusBadge: "Running",
    };
  }

  if (isFinished) {
    return {
      borderClass: "border-emerald-500/60",
      bgClass: "bg-emerald-950/20",
      titleColor: "text-emerald-300",
      timeColor: "text-emerald-200",
      statusBadge: "Spawned",
    };
  }

  if (stage.status === "stopped") {
    return {
      borderClass: "border-slate-700",
      bgClass: "bg-slate-900/40",
      titleColor: "text-slate-500",
      timeColor: "text-slate-600",
      statusBadge: "Defeated",
    };
  }

  return {
    borderClass: "border-slate-800",
    bgClass: "bg-slate-900/50",
    titleColor: "text-slate-500",
    timeColor: "text-slate-600",
    statusBadge: "Waiting",
  };
}

export default function CenLabPublicCalculator() {
  const [characterCount, setCharacterCount] = useState(3);
  const [runs, setRuns] = useState<SlotRunMap>({});
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const slots = useMemo(
    () =>
      Array.from({ length: characterCount }, (_, index) => ({
        id: `slot-${index + 1}`,
        label: `Character ${index + 1}`,
      })),
    [characterCount]
  );

  const clearSlotTimer = useCallback((slotId: string) => {
    const interval = intervalsRef.current[slotId];
    if (!interval) return;
    clearInterval(interval);
    delete intervalsRef.current[slotId];
  }, []);

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach((interval) => clearInterval(interval));
      intervalsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const allowed = new Set(slots.map((slot) => slot.id));

    Object.keys(intervalsRef.current).forEach((slotId) => {
      if (!allowed.has(slotId)) {
        clearSlotTimer(slotId);
      }
    });

    setRuns((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([slotId]) => allowed.has(slotId)))
    );
  }, [clearSlotTimer, slots]);

  const startStage = useCallback(
    (slotId: string, stageId: StageId) => {
      clearSlotTimer(slotId);

      setRuns((prev) => {
        const currentRun = prev[slotId] ?? createRun(slotId);

        return {
          ...prev,
          [slotId]: {
            ...currentRun,
            stages: currentRun.stages.map((stage) =>
              stage.id === stageId ? { ...stage, status: "running" } : stage
            ),
          },
        };
      });

      intervalsRef.current[slotId] = setInterval(() => {
        setRuns((prev) => {
          const run = prev[slotId];

          if (!run) {
            clearSlotTimer(slotId);
            return prev;
          }

          const stage = run.stages.find((item) => item.id === stageId);

          if (!stage || stage.status !== "running") {
            return prev;
          }

          if (stage.remaining <= 1) {
            clearSlotTimer(slotId);

            return {
              ...prev,
              [slotId]: {
                ...run,
                stages: run.stages.map((item) =>
                  item.id === stageId ? { ...item, remaining: 0, status: "finished" } : item
                ),
              },
            };
          }

          return {
            ...prev,
            [slotId]: {
              ...run,
              stages: run.stages.map((item) =>
                item.id === stageId ? { ...item, remaining: item.remaining - 1 } : item
              ),
            },
          };
        });
      }, 1000);
    },
    [clearSlotTimer]
  );

  const handleBoss1Defeated = useCallback(
    (slotId: string) => {
      const run = runs[slotId];
      if (!canAdvanceFromStage(run, "stage1")) return;

      clearSlotTimer(slotId);

      setRuns((prev) => {
        const currentRun = prev[slotId];
        if (!currentRun) return prev;

        return {
          ...prev,
          [slotId]: {
            ...currentRun,
            stages: currentRun.stages.map((stage) =>
              stage.id === "stage1" && stage.status === "running"
                ? { ...stage, status: "stopped" }
                : stage
            ),
          },
        };
      });

      startStage(slotId, "stage2");
    },
    [clearSlotTimer, runs, startStage]
  );

  const handleBoss2Defeated = useCallback(
    (slotId: string) => {
      const run = runs[slotId];
      if (!canAdvanceFromStage(run, "stage2")) return;

      clearSlotTimer(slotId);

      setRuns((prev) => {
        const currentRun = prev[slotId];
        if (!currentRun) return prev;

        return {
          ...prev,
          [slotId]: {
            ...currentRun,
            stages: currentRun.stages.map((stage) =>
              stage.id === "stage2" && stage.status === "running"
                ? { ...stage, status: "stopped" }
                : stage
            ),
          },
        };
      });

      startStage(slotId, "stage3");
    },
    [clearSlotTimer, runs, startStage]
  );

  const handleResetRun = useCallback(
    (slotId: string) => {
      clearSlotTimer(slotId);
      setRuns((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    },
    [clearSlotTimer]
  );

  const handleResetAll = useCallback(() => {
    Object.keys(runs).forEach((slotId) => clearSlotTimer(slotId));
    setRuns({});
  }, [clearSlotTimer, runs]);

  const activeRuns = useMemo(
    () =>
      slots
        .map((slot) => ({ slot, run: runs[slot.id] }))
        .filter((item): item is { slot: (typeof slots)[number]; run: SlotRun } => Boolean(item.run)),
    [runs, slots]
  );

  const availableCount = slots.filter((slot) => !runs[slot.id]).length;
  const completedCount = activeRuns.filter(({ run }) => isRunComplete(run)).length;
  const nextActionText = activeRuns.length
    ? "Each timer runs separately. Use Boss 1 and Boss 2 on the same card when that character moves forward."
    : "Pick how many characters you want, then start each one independently.";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-6">
        <header className="mb-5 flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">Public Page</p>
            <h1 className="mt-2 text-3xl font-black text-cyan-300 sm:text-4xl">Cen Lab Boss Calculator</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Choose how many characters you want to run, then each card keeps its own boss timer.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
            <Link
              className="inline-flex items-center justify-center rounded-lg border border-cyan-500/35 bg-cyan-950/25 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-950/45"
              href="/login"
            >
              Sign In
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-violet-500/35 hover:text-violet-200"
              href="/cen-lab"
            >
              Private Cen Lab
            </Link>
          </div>
        </header>

        <section className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-black/10">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div>
              <h2 className="text-lg font-bold text-violet-300">Run Setup</h2>
              <p className="mt-1 text-sm text-slate-500">
                The timer logic matches the main Cen Lab page: 150s, 80s, 160s.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500"
                  htmlFor="character-count"
                >
                  Characters
                </label>
                <select
                  id="character-count"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  onChange={(event) => setCharacterCount(Number(event.target.value))}
                  value={characterCount}
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
                    <option key={count} value={count}>
                      {count} character{count > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="rounded-xl border border-rose-500/35 bg-rose-950/30 px-4 py-3 text-sm font-bold text-rose-100 transition hover:bg-rose-950/50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={activeRuns.length === 0}
                onClick={handleResetAll}
                type="button"
              >
                Reset All
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,780px)_minmax(420px,1fr)]">
          <div className="space-y-5">
            <section>
              <div className="mb-3">
                <h2 className="text-lg font-bold text-violet-300">Character Slots</h2>
                <p className="mt-1 text-xs text-slate-500">Every slot runs on its own timer chain.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {slots.map((slot, index) => {
                  const run = runs[slot.id];
                  const isComplete = run ? isRunComplete(run) : false;
                  const currentStage = run ? getCurrentStage(run) : null;
                  const canBoss1 = canAdvanceFromStage(run, "stage1");
                  const canBoss2 = canAdvanceFromStage(run, "stage2");
                  const accent = [
                    "from-cyan-500 to-violet-500",
                    "from-violet-500 to-fuchsia-500",
                    "from-emerald-500 to-cyan-500",
                    "from-orange-500 to-rose-500",
                  ][index % 4];

                  return (
                    <article
                      key={slot.id}
                      className={`rounded-xl border p-3 shadow-lg shadow-black/10 transition ${
                        run
                          ? isComplete
                            ? "border-emerald-500/45 bg-emerald-950/15"
                            : "border-cyan-500/45 bg-cyan-950/15"
                          : "border-slate-700/80 bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                            Slot {index + 1}
                          </p>
                          <h3 className="mt-1 text-base font-bold text-slate-100">{slot.label}</h3>
                        </div>
                        <div
                          className={`rounded-xl bg-gradient-to-br ${accent} px-3 py-2 text-sm font-black text-white shadow-lg`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-slate-800/70 bg-slate-950/50 p-2">
                        {currentStage ? (
                          <div className="flex items-end justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                {currentStage.title}
                              </p>
                              <p className="mt-1 truncate text-[11px] text-slate-500">
                                {isComplete ? "Run complete" : "Timer active"}
                              </p>
                            </div>
                            <p className="font-mono text-lg font-black text-cyan-200">
                              {formatTime(currentStage.remaining)}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-500">Ready</span>
                            <span className="font-mono text-sm text-slate-600">--:--</span>
                          </div>
                        )}
                      </div>

                      <div className={`mt-3 grid gap-2 ${run ? "grid-cols-3" : "grid-cols-1"}`}>
                        {!run ? (
                          <button
                            className={`rounded-lg bg-gradient-to-r ${accent} px-3 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-110`}
                            onClick={() => startStage(slot.id, "stage1")}
                            type="button"
                          >
                            Start Timer
                          </button>
                        ) : (
                          <>
                            <button
                              className="rounded-lg border border-violet-500/40 bg-violet-950/40 px-2 py-2 text-[11px] font-semibold text-violet-200 transition hover:bg-violet-900/40 disabled:cursor-not-allowed disabled:opacity-30"
                              disabled={!canBoss1}
                              onClick={() => handleBoss1Defeated(slot.id)}
                              type="button"
                            >
                              Boss 1
                            </button>
                            <button
                              className="rounded-lg border border-pink-500/40 bg-pink-950/40 px-2 py-2 text-[11px] font-semibold text-pink-200 transition hover:bg-pink-900/40 disabled:cursor-not-allowed disabled:opacity-30"
                              disabled={!canBoss2}
                              onClick={() => handleBoss2Defeated(slot.id)}
                              type="button"
                            >
                              Boss 2
                            </button>
                            <button
                              className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-2 py-2 text-[11px] font-semibold text-rose-200 transition hover:bg-rose-950/50"
                              onClick={() => handleResetRun(slot.id)}
                              type="button"
                            >
                              {isComplete ? "Finish" : "Reset"}
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pr-1">
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
              <h2 className="mb-3 text-lg font-bold text-cyan-300">Run Summary</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
                  <p className="text-xs text-slate-500">Active</p>
                  <p className="mt-1 font-mono text-2xl font-black text-cyan-200">{activeRuns.length}</p>
                </div>
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
                  <p className="text-xs text-slate-500">Available</p>
                  <p className="mt-1 font-mono text-2xl font-black text-emerald-200">{availableCount}</p>
                </div>
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
                  <p className="text-xs text-slate-500">Complete</p>
                  <p className="mt-1 font-mono text-2xl font-black text-violet-200">{completedCount}</p>
                </div>
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
                  <p className="text-xs text-slate-500">Selected</p>
                  <p className="mt-1 font-mono text-2xl font-black text-amber-200">{characterCount}</p>
                </div>
              </div>
            </section>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-center text-sm font-medium text-violet-200">
              {nextActionText}
            </div>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-cyan-300">Active Timers</h2>

              {activeRuns.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center text-sm text-slate-500">
                  No active timers
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {activeRuns.map(({ slot, run }, index) => {
                    const currentStage = getCurrentStage(run);
                    const accent = [
                      "text-cyan-200",
                      "text-violet-200",
                      "text-emerald-200",
                      "text-rose-200",
                    ][index % 4];

                    return (
                      <article
                        key={slot.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-lg shadow-black/10"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className={`truncate text-sm font-semibold ${accent}`}>{slot.label}</h3>
                            <p className="truncate text-xs text-slate-500">{currentStage.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-xl font-black text-cyan-200">
                              {formatTime(currentStage.remaining)}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                              {currentStage.title.replace(" Spawn", "")}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          {run.stages.map((stage) => {
                            const tone = getStageTone(stage);
                            const isWarning =
                              stage.status === "running" && stage.remaining <= 10 && stage.remaining > 0;

                            return (
                              <div
                                key={`${slot.id}-${stage.id}`}
                                className={`rounded-lg border px-2 py-1.5 transition ${tone.borderClass} ${tone.bgClass}`}
                              >
                                <div
                                  className={`truncate text-[10px] font-bold uppercase tracking-wide ${tone.titleColor}`}
                                >
                                  {stage.title.replace(" Spawn", "")}
                                </div>
                                <div
                                  className={`mt-1 font-mono text-base font-black tracking-tight ${tone.timeColor} ${
                                    isWarning ? "animate-pulse-fast" : ""
                                  }`}
                                >
                                  {formatTime(stage.remaining)}
                                </div>
                                <div className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-wide text-slate-500">
                                  {tone.statusBadge}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
