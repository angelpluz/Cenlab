"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { CENLAB_BOSSES, type CenLabBoss } from "@/lib/cenlab-bosses";
import { CHARACTER_IMAGES } from "@/lib/character-images";
import {
  PERSONAL_DATA_EVENT,
  PERSONAL_DATA_STORAGE_KEY,
  findPersonalDataProfile,
  readPersonalDataProfiles,
} from "@/lib/personal-data";
import type { PersonalCharacterProfile } from "@/lib/personal-data-types";

type StageId = "stage1" | "stage2" | "stage3";

type TimerStage = {
  id: StageId;
  title: string;
  duration: number;
  remaining: number;
  status: "waiting" | "running" | "finished" | "stopped";
};

type Character = {
  id: string;
  name: string;
  job: string;
  level: number;
  imageSrc?: StaticImageData;
};

type CharacterRun = {
  characterId: string;
  stages: TimerStage[];
  startedAt: number;
};

type CharacterRunMap = Record<string, CharacterRun>;

type PortraitPalette = {
  hair: string;
  armor: string;
  accent: string;
  glow: string;
  skin: string;
};

const CHARACTER_SEEDS: Character[] = [
  { id: "francesgaz", name: "FranCesGaz", job: "Arch Bishop", level: 225, imageSrc: CHARACTER_IMAGES.francesgaz },
  { id: "junoirextreme", name: "JunoirExtreme", job: "Windhawk", level: 225, imageSrc: CHARACTER_IMAGES.junoirextreme },
  { id: "archangelpluz", name: "ArchAngelpluz", job: "Cardinal", level: 225, imageSrc: CHARACTER_IMAGES.archangelpluz },
  { id: "queen0feria", name: "Queen0Feria", job: "Arch Mage", level: 225, imageSrc: CHARACTER_IMAGES.queen0feria },
  { id: "izanoalp", name: "IzanoALP", job: "Shadow Cross", level: 225, imageSrc: CHARACTER_IMAGES.izanoalp },
  { id: "reginaalp", name: "ReginaALP", job: "Imperial Guard", level: 225, imageSrc: CHARACTER_IMAGES.reginaalp },
  {
    id: "candyselleralp",
    name: "CandYSellerALP",
    job: "Biolo",
    level: 225,
    imageSrc: CHARACTER_IMAGES.candyselleralp,
  },
  {
    id: "khrasedraalp",
    name: "KhrasedraALP",
    job: "Dragon Knight",
    level: 225,
    imageSrc: CHARACTER_IMAGES.khrasedraalp,
  },
  { id: "soulalp", name: "SoulALP", job: "Soul Ascetic", level: 225, imageSrc: CHARACTER_IMAGES.soulalp },
  { id: "power0franz", name: "PoWer0FranZ", job: "Meister", level: 225, imageSrc: CHARACTER_IMAGES.power0franz },
  { id: "jessigaalp", name: "JessiGazALP", job: "Inquisitor", level: 225, imageSrc: CHARACTER_IMAGES.jessigaalp },
  { id: "soufflextreme", name: "SouffleExtreme", job: "Troubadour", level: 225, imageSrc: CHARACTER_IMAGES.soufflextreme },
];

const INITIAL_STAGES: TimerStage[] = [
  { id: "stage1", title: "Initial Spawn", duration: 150, remaining: 150, status: "waiting" },
  { id: "stage2", title: "Second Spawn", duration: 80, remaining: 80, status: "waiting" },
  { id: "stage3", title: "Third Spawn", duration: 160, remaining: 160, status: "waiting" },
];

const PORTRAITS: Record<string, PortraitPalette> = {
  francesgaz: {
    hair: "#f3d7a2",
    armor: "#8b5cf6",
    accent: "#f8fafc",
    glow: "rgba(196, 181, 253, 0.45)",
    skin: "#f1c7a8",
  },
  junoirextreme: {
    hair: "#b7a0dc",
    armor: "#2563eb",
    accent: "#f59e0b",
    glow: "rgba(96, 165, 250, 0.42)",
    skin: "#e8b99d",
  },
  archangelpluz: {
    hair: "#ef7373",
    armor: "#7c2d12",
    accent: "#fed7aa",
    glow: "rgba(251, 113, 133, 0.42)",
    skin: "#edbfa3",
  },
  queen0feria: {
    hair: "#c9b7ae",
    armor: "#0f766e",
    accent: "#67e8f9",
    glow: "rgba(45, 212, 191, 0.4)",
    skin: "#f0c4a5",
  },
  izanoalp: {
    hair: "#475569",
    armor: "#312e81",
    accent: "#a78bfa",
    glow: "rgba(129, 140, 248, 0.46)",
    skin: "#ddb49a",
  },
  reginaalp: {
    hair: "#c4b5fd",
    armor: "#1e40af",
    accent: "#93c5fd",
    glow: "rgba(59, 130, 246, 0.42)",
    skin: "#e9b99f",
  },
  candyselleralp: {
    hair: "#9ca3af",
    armor: "#991b1b",
    accent: "#f97316",
    glow: "rgba(248, 113, 113, 0.42)",
    skin: "#dbb099",
  },
  khrasedraalp: {
    hair: "#f6c989",
    armor: "#166534",
    accent: "#facc15",
    glow: "rgba(74, 222, 128, 0.38)",
    skin: "#f0c3a3",
  },
  soulalp: {
    hair: "#fb7185",
    armor: "#065f46",
    accent: "#6ee7b7",
    glow: "rgba(52, 211, 153, 0.4)",
    skin: "#eab69c",
  },
  power0franz: {
    hair: "#a16207",
    armor: "#334155",
    accent: "#eab308",
    glow: "rgba(234, 179, 8, 0.42)",
    skin: "#d9aa8f",
  },
  jessigaalp: {
    hair: "#f7c873",
    armor: "#7f1d1d",
    accent: "#fca5a5",
    glow: "rgba(244, 114, 182, 0.36)",
    skin: "#f0c09f",
  },
  soufflextreme: {
    hair: "#64748b",
    armor: "#0e7490",
    accent: "#22d3ee",
    glow: "rgba(34, 211, 238, 0.42)",
    skin: "#ddb399",
  },
};

const DEFAULT_PORTRAIT: PortraitPalette = {
  hair: "#94a3b8",
  armor: "#334155",
  accent: "#38bdf8",
  glow: "rgba(56, 189, 248, 0.35)",
  skin: "#e7b89a",
};

function cloneStages(): TimerStage[] {
  return INITIAL_STAGES.map((stage) => ({ ...stage }));
}

function createRun(characterId: string): CharacterRun {
  return {
    characterId,
    stages: cloneStages(),
    startedAt: Date.now(),
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function toEightBitBinary(value: number): string {
  return value.toString(2).padStart(8, "0");
}

function formatSpacedBinary(binary: string): string {
  return `${binary.slice(0, 4)} ${binary.slice(4)}`;
}

function applyPersonalProfilesToCenLabCharacters(
  characters: Character[],
  profiles: PersonalCharacterProfile[]
): Character[] {
  return characters.map((character) => {
    const profile = findPersonalDataProfile(profiles, character.id, character.name);

    if (!profile) return { ...character };

    return {
      ...character,
      name: profile.name,
      level: profile.level,
    };
  });
}

function readCenLabCharacters() {
  return applyPersonalProfilesToCenLabCharacters(CHARACTER_SEEDS, readPersonalDataProfiles());
}

function getRunStatus(run?: CharacterRun, isUsed = false): string {
  if (isUsed && !run) return "Used";
  if (!run) return "Available";

  const [stage1, stage2, stage3] = run.stages;

  if (stage3.status === "finished") return "Run complete";
  if (stage3.status === "running") return "Boss 3 timer";
  if (stage2.status === "finished") return "Boss 2 spawned";
  if (stage2.status === "running") return "Boss 2 timer";
  if (stage1.status === "finished") return "Boss 1 spawned";
  if (stage1.status === "running") return "Boss 1 timer";

  return "In run";
}

function getRunStatusColor(run?: CharacterRun, isUsed = false): string {
  if (isUsed && !run) return "text-slate-500 bg-slate-800/70";
  if (!run) return "text-emerald-300 bg-emerald-950/40";
  if (run.stages[2].status === "finished") return "text-emerald-300 bg-emerald-950/50";
  return "text-cyan-300 bg-cyan-950/50";
}

function getCurrentStage(run: CharacterRun): TimerStage {
  return (
    run.stages.find((stage) => stage.status === "running") ??
    [...run.stages].reverse().find((stage) => stage.status === "finished") ??
    run.stages[0]
  );
}

function isRunComplete(run: CharacterRun): boolean {
  return run.stages[2].status === "finished";
}

function canAdvanceFromStage(run: CharacterRun | undefined, stageId: StageId): boolean {
  if (!run) return false;

  const stageIndex = run.stages.findIndex((stage) => stage.id === stageId);
  if (stageIndex === -1) return false;

  const stage = run.stages[stageIndex];
  const nextStage = run.stages[stageIndex + 1];
  const stageReady = stage.status === "running" || stage.status === "finished";

  return stageReady && (!nextStage || nextStage.status === "waiting");
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

function CharacterPortrait({
  character,
  muted,
  compact = false,
}: {
  character: Character;
  muted: boolean;
  compact?: boolean;
}) {
  const palette = PORTRAITS[character.id] ?? DEFAULT_PORTRAIT;
  const sizeClass = compact ? "h-12 w-10" : "h-20 w-16";

  if (character.imageSrc) {
    return (
      <div
        aria-label={`${character.name} portrait`}
        className={`${sizeClass} shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 shadow-inner shadow-black/30 ${
          muted ? "opacity-45 grayscale" : ""
        }`}
        role="img"
      >
        <Image
          alt=""
          className="h-full w-full object-contain"
          draggable={false}
          sizes={compact ? "40px" : "64px"}
          src={character.imageSrc}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      aria-label={`${character.name} portrait`}
      className={`${sizeClass} relative shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 shadow-inner shadow-black/30 ${
        muted ? "opacity-45 grayscale" : ""
      }`}
      role="img"
    >
      <div className="absolute inset-x-2 bottom-2 h-3 rounded-full blur-sm" style={{ background: palette.glow }} />
      <div
        className="absolute left-1/2 top-4 h-9 w-10 -translate-x-1/2 rounded-t-full"
        style={{ backgroundColor: palette.hair }}
      />
      <div
        className="absolute left-1/2 top-7 h-7 w-7 -translate-x-1/2 rounded-full border border-black/10"
        style={{ backgroundColor: palette.skin }}
      />
      <div
        className="absolute left-[24%] top-[38%] h-10 w-[18%] rotate-6 rounded-full"
        style={{ backgroundColor: palette.hair }}
      />
      <div
        className="absolute right-[24%] top-[38%] h-10 w-[18%] -rotate-6 rounded-full"
        style={{ backgroundColor: palette.hair }}
      />
      <div
        className="absolute left-1/2 top-[50%] h-10 w-11 -translate-x-1/2 rounded-t-xl border border-black/20"
        style={{ backgroundColor: palette.armor }}
      />
      <div
        className="absolute left-1/2 top-[58%] h-7 w-5 -translate-x-1/2 rounded"
        style={{ backgroundColor: palette.accent }}
      />
      <div
        className="absolute left-[23%] top-[57%] h-8 w-2 rounded-full"
        style={{ backgroundColor: palette.armor }}
      />
      <div
        className="absolute right-[23%] top-[57%] h-8 w-2 rounded-full"
        style={{ backgroundColor: palette.armor }}
      />
      <div className="absolute left-[35%] top-[82%] h-5 w-2 rounded-full bg-slate-700" />
      <div className="absolute right-[35%] top-[82%] h-5 w-2 rounded-full bg-slate-700" />
      <div
        className="absolute right-2 top-3 h-8 w-1 rotate-45 rounded-full"
        style={{ backgroundColor: palette.accent }}
      />
      <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-slate-950/80 to-transparent" />
    </div>
  );
}

function BossReferencePanel({
  bosses,
  onSelectBoss,
  selectedBossId,
}: {
  bosses: CenLabBoss[];
  onSelectBoss: (bossId: string) => void;
  selectedBossId: string;
}) {
  const selectedBoss = bosses.find((boss) => boss.id === selectedBossId) ?? bosses[0];

  if (!selectedBoss) return null;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur-sm lg:p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-cyan-300">Current Boss</h2>
          <p className="mt-1 truncate text-xs text-slate-500">Select the current Central Laboratory boss.</p>
        </div>
        <span className="shrink-0 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-200">
          {bosses.length} bosses
        </span>
      </div>

      <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
        Boss
        <select
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold normal-case tracking-normal text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          onChange={(event) => onSelectBoss(event.target.value)}
          value={selectedBoss.id}
        >
          {bosses.map((boss) => (
            <option key={boss.id} value={boss.id}>
              {boss.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-950/15 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-300">Selected</p>
        <p className="mt-1 text-xl font-black leading-tight text-slate-100 [overflow-wrap:anywhere]">
          {selectedBoss.name}
        </p>
      </div>

      <div className="mt-3 flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 p-3 shadow-inner shadow-black/30 sm:min-h-[340px] lg:min-h-[380px]">
        <Image
          alt={selectedBoss.name}
          className="h-auto max-h-[520px] w-full object-contain"
          draggable={false}
          priority
          sizes="(max-width: 1024px) 100vw, 520px"
          src={selectedBoss.imageSrc}
          unoptimized
        />
      </div>
    </section>
  );
}

export default function CenLabBossTimer() {
  const [characters, setCharacters] = useState<Character[]>(() => readCenLabCharacters());
  const [selectedBossId, setSelectedBossId] = useState(() => CENLAB_BOSSES[0]?.id ?? "");
  const [runs, setRuns] = useState<CharacterRunMap>({});
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [decimalInput, setDecimalInput] = useState("0");
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const clearCharacterTimer = useCallback((characterId: string) => {
    const interval = intervalsRef.current[characterId];

    if (interval) {
      clearInterval(interval);
      delete intervalsRef.current[characterId];
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach((interval) => clearInterval(interval));
      intervalsRef.current = {};
    };
  }, []);

  useEffect(() => {
    function refreshCharacters() {
      setCharacters(readCenLabCharacters());
    }

    function handleStorageEvent(event: StorageEvent) {
      if (event.key === PERSONAL_DATA_STORAGE_KEY) refreshCharacters();
    }

    refreshCharacters();
    window.addEventListener(PERSONAL_DATA_EVENT, refreshCharacters);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(PERSONAL_DATA_EVENT, refreshCharacters);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const startStage = useCallback(
    (characterId: string, stageId: StageId) => {
      clearCharacterTimer(characterId);

      setRuns((prev) => {
        const currentRun = prev[characterId] ?? createRun(characterId);

        return {
          ...prev,
          [characterId]: {
            ...currentRun,
            stages: currentRun.stages.map((stage) =>
              stage.id === stageId ? { ...stage, status: "running" } : stage
            ),
          },
        };
      });

      intervalsRef.current[characterId] = setInterval(() => {
        setRuns((prev) => {
          const run = prev[characterId];

          if (!run) {
            clearCharacterTimer(characterId);
            return prev;
          }

          const stage = run.stages.find((item) => item.id === stageId);

          if (!stage || stage.status !== "running") return prev;

          if (stage.remaining <= 1) {
            clearCharacterTimer(characterId);

            return {
              ...prev,
              [characterId]: {
                ...run,
                stages: run.stages.map((item) =>
                  item.id === stageId ? { ...item, remaining: 0, status: "finished" } : item
                ),
              },
            };
          }

          return {
            ...prev,
            [characterId]: {
              ...run,
              stages: run.stages.map((item) =>
                item.id === stageId ? { ...item, remaining: item.remaining - 1 } : item
              ),
            },
          };
        });
      }, 1000);
    },
    [clearCharacterTimer]
  );

  const handleStartCharacter = useCallback(
    (characterId: string) => {
      if (runs[characterId] || usedIds.includes(characterId)) return;
      startStage(characterId, "stage1");
    },
    [runs, startStage, usedIds]
  );

  const handleBoss1Defeated = useCallback(
    (characterId: string) => {
      const run = runs[characterId];
      if (!canAdvanceFromStage(run, "stage1")) return;

      clearCharacterTimer(characterId);

      setRuns((prev) => {
        const currentRun = prev[characterId];
        if (!currentRun) return prev;

        return {
          ...prev,
          [characterId]: {
            ...currentRun,
            stages: currentRun.stages.map((stage) =>
              stage.id === "stage1" && stage.status === "running"
                ? { ...stage, status: "stopped" }
                : stage
            ),
          },
        };
      });

      startStage(characterId, "stage2");
    },
    [clearCharacterTimer, runs, startStage]
  );

  const handleBoss2Defeated = useCallback(
    (characterId: string) => {
      const run = runs[characterId];
      if (!canAdvanceFromStage(run, "stage2")) return;

      clearCharacterTimer(characterId);

      setRuns((prev) => {
        const currentRun = prev[characterId];
        if (!currentRun) return prev;

        return {
          ...prev,
          [characterId]: {
            ...currentRun,
            stages: currentRun.stages.map((stage) =>
              stage.id === "stage2" && stage.status === "running"
                ? { ...stage, status: "stopped" }
                : stage
            ),
          },
        };
      });

      startStage(characterId, "stage3");
    },
    [clearCharacterTimer, runs, startStage]
  );

  const handleResetCharacterRun = useCallback(
    (characterId: string) => {
      if (!runs[characterId]) return;

      clearCharacterTimer(characterId);

      setRuns((prev) => {
        const next = { ...prev };
        delete next[characterId];
        return next;
      });

      setUsedIds((prev) => Array.from(new Set([...prev, characterId])));
    },
    [clearCharacterTimer, runs]
  );

  const handleResetAllRuns = useCallback(() => {
    const activeIds = Object.keys(runs);
    if (activeIds.length === 0) return;

    activeIds.forEach((characterId) => clearCharacterTimer(characterId));
    setRuns({});
    setUsedIds((prev) => Array.from(new Set([...prev, ...activeIds])));
  }, [clearCharacterTimer, runs]);

  const handleResetSessionUsage = useCallback(() => {
    setUsedIds([]);
  }, []);

  const activeRunItems = useMemo(
    () =>
      characters.map((character) => ({
        character,
        run: runs[character.id],
      })).filter((item): item is { character: Character; run: CharacterRun } => Boolean(item.run)),
    [characters, runs]
  );

  const completeRunCount = activeRunItems.filter(({ run }) => isRunComplete(run)).length;
  const availableCount = characters.filter(
    (character) => !usedIds.includes(character.id) && !runs[character.id]
  ).length;
  const parsedDecimal = decimalInput.trim() === "" ? null : Number(decimalInput);
  const isDecimalValid =
    parsedDecimal !== null &&
    Number.isInteger(parsedDecimal) &&
    parsedDecimal >= 0 &&
    parsedDecimal <= 255;
  const binaryRaw = isDecimalValid ? toEightBitBinary(parsedDecimal) : "00000000";
  const binarySpaced = formatSpacedBinary(binaryRaw);
  const upperBits = binaryRaw.slice(0, 4);
  const lowerBits = binaryRaw.slice(4);
  const bitValues = binaryRaw.split("");

  const nextActionText = (() => {
    if (completeRunCount > 0) return "Finish completed runs to mark those characters used.";
    if (activeRunItems.length > 0) return "Handle each character from its own timer panel.";
    if (availableCount > 0) return "Start any available character.";
    return "Reset session usage to reuse characters.";
  })();

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto box-border w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-6 lg:py-3">
        <header className="mb-5 flex flex-col items-center gap-3 text-center lg:mb-4 lg:flex-row lg:justify-between lg:text-left">
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:items-start">
            <nav className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 lg:w-auto">
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-950/45 px-4 py-2 text-sm font-bold text-cyan-100"
                href="/cen-lab"
              >
                Cen Lab Timer
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-violet-500/40 hover:text-violet-200"
                href="/ogch"
              >
                OGCH Tracker
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-200"
                href="/water-dungeon"
              >
                Water Dungeon
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-200"
                href="/personal-data"
              >
                Personal Data
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-amber-500/40 hover:text-amber-200"
                href="/exp"
              >
                EXP
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
                href="/stat-calculator"
              >
                Stat
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
                href="/ogch/bishop"
              >
                Bishop Rounds
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-emerald-500/35 bg-emerald-950/25 px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-950/45"
                href="/cen-lab/calculator"
              >
                Public Timer
              </Link>
            </nav>
            <LogoutButton />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400 sm:text-4xl lg:text-3xl">
              Central Laboratory
            </h1>
            <p className="mt-1 text-sm text-slate-400 sm:text-base">
              Boss Timer & Character Tracker
            </p>
          </div>
          <div className="hidden lg:block lg:w-[278px]" />
        </header>

        <section className="mb-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-lg backdrop-blur-sm">
          <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[180px_minmax(220px,1fr)_120px_120px_minmax(260px,1.2fr)] lg:items-end">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-emerald-300">Binary Converter</h2>
                <span className="rounded-full bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                  8-bit
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Decimal to binary</p>
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                htmlFor="decimal-input"
              >
                Decimal
              </label>
              <input
                id="decimal-input"
                inputMode="numeric"
                max={255}
                min={0}
                onChange={(event) => setDecimalInput(event.target.value.replace(/[^\d]/g, ""))}
                placeholder="0"
                type="text"
                value={decimalInput}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-lg font-bold text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">Binary 8-bit</p>
              <p className="mt-1 font-mono text-xl font-black tracking-wide text-emerald-100">
                {isDecimalValid ? binarySpaced : "---- ----"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Upper</p>
                <p className="mt-1 font-mono text-base font-black text-cyan-200">
                  {isDecimalValid ? upperBits : "----"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Lower</p>
                <p className="mt-1 font-mono text-base font-black text-violet-200">
                  {isDecimalValid ? lowerBits : "----"}
                </p>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-8 gap-1">
                {bitValues.map((bit, index) => (
                  <div
                    key={`bit-${index + 1}`}
                    className={`rounded-md border px-1 py-1.5 text-center ${
                      bit === "1" && isDecimalValid
                        ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100"
                        : "border-slate-800 bg-slate-950/60 text-slate-500"
                    }`}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wide">B{index + 1}</p>
                    <p className="font-mono text-sm font-black">{isDecimalValid ? bit : "-"}</p>
                  </div>
                ))}
              </div>
              {!isDecimalValid ? (
                <p className="mt-2 text-xs font-medium text-rose-300">Use an integer from 0 to 255.</p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,780px)_minmax(520px,1fr)]">
          <div className="order-2 min-w-0 space-y-5 lg:order-1">
            <section>
              <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-lg font-bold text-violet-300">Character Roster</h2>
                  <p className="mt-1 text-xs text-slate-500">Start and finish characters one by one.</p>
                </div>
                <button
                  onClick={handleResetSessionUsage}
                  className="w-full rounded-lg border border-rose-900/50 bg-rose-950/40 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-950/70 sm:w-auto"
                >
                  Reset Session Usage
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {characters.map((character) => {
                  const run = runs[character.id];
                  const isUsed = usedIds.includes(character.id);
                  const isComplete = run ? isRunComplete(run) : false;
                  const currentStage = run ? getCurrentStage(run) : null;
                  const canBoss1 = canAdvanceFromStage(run, "stage1");
                  const canBoss2 = canAdvanceFromStage(run, "stage2");

                  const cardBorder = run
                    ? isComplete
                      ? "border-emerald-500/50"
                      : "border-cyan-500/50"
                    : isUsed
                    ? "border-slate-800"
                    : "border-slate-700/80 hover:border-violet-500/50";
                  const cardBg = run
                    ? isComplete
                      ? "bg-emerald-950/20"
                      : "bg-cyan-950/20"
                    : "bg-slate-900/60";

                  return (
                    <article
                      key={character.id}
                      className={`box-border rounded-xl border p-2 shadow-lg shadow-black/10 transition ${cardBorder} ${cardBg}`}
                    >
                      <div className="flex gap-2">
                        <CharacterPortrait character={character} muted={isUsed && !run} />
                        <div className="min-w-0 flex-1">
                          <div className="space-y-1">
                              <h3 className="text-sm font-semibold leading-tight text-slate-100 [overflow-wrap:anywhere]">
                                {character.name}
                              </h3>
                              <p className="text-xs leading-tight text-slate-400">
                                Lv.{character.level} {character.job}
                              </p>
                            <span
                              className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getRunStatusColor(
                                run,
                                isUsed
                              )}`}
                            >
                              {getRunStatus(run, isUsed)}
                            </span>
                          </div>

                          <div className="mt-1.5 min-h-[40px] rounded-lg border border-slate-800/70 bg-slate-950/50 p-1.5">
                            {currentStage ? (
                              <div className="flex items-end justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    {currentStage.title}
                                  </p>
                                  <p className="mt-1 truncate text-[11px] text-slate-500">
                                    {getRunStatus(run)}
                                  </p>
                                </div>
                                <p className="font-mono text-lg font-black text-cyan-200">
                                  {formatTime(currentStage.remaining)}
                                </p>
                              </div>
                            ) : (
                              <div className="flex h-full items-center justify-between gap-2">
                                <span className="text-xs text-slate-500">
                                  {isUsed ? "Used this session" : "Ready"}
                                </span>
                                <span className="font-mono text-sm text-slate-600">--:--</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={`mt-1.5 grid gap-2 ${run ? "grid-cols-3" : "grid-cols-2"}`}>
                        {!run ? (
                          <button
                            onClick={() => handleStartCharacter(character.id)}
                            disabled={isUsed}
                            className="col-span-2 rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 px-3 py-1 text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition hover:from-cyan-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            Start Character
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleBoss1Defeated(character.id)}
                              disabled={!canBoss1}
                              className="rounded-lg border border-violet-500/40 bg-violet-950/40 px-2 py-1 text-[11px] font-semibold text-violet-200 transition hover:bg-violet-900/40 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              Boss 1
                            </button>
                            <button
                              onClick={() => handleBoss2Defeated(character.id)}
                              disabled={!canBoss2}
                              className="rounded-lg border border-pink-500/40 bg-pink-950/40 px-2 py-1 text-[11px] font-semibold text-pink-200 transition hover:bg-pink-900/40 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              Boss 2
                            </button>
                            <button
                              onClick={() => handleResetCharacterRun(character.id)}
                              className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-2 py-1 text-[11px] font-semibold text-rose-200 transition hover:bg-rose-950/50"
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

          <div className="order-1 min-w-0 space-y-4 lg:sticky lg:top-4 lg:order-2 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            <BossReferencePanel
              bosses={CENLAB_BOSSES}
              onSelectBoss={setSelectedBossId}
              selectedBossId={selectedBossId}
            />

            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur-sm lg:p-3">
              <h2 className="mb-3 text-lg font-bold text-cyan-300">Run Summary</h2>

              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3 lg:p-2.5">
                  <p className="text-xs text-slate-500">Active</p>
                  <p className="mt-1 font-mono text-2xl font-black text-cyan-200 lg:text-xl">
                    {activeRunItems.length}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3 lg:p-2.5">
                  <p className="text-xs text-slate-500">Available</p>
                  <p className="mt-1 font-mono text-2xl font-black text-emerald-200 lg:text-xl">
                    {availableCount}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3 lg:p-2.5">
                  <p className="text-xs text-slate-500">Complete</p>
                  <p className="mt-1 font-mono text-2xl font-black text-violet-200 lg:text-xl">
                    {completeRunCount}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3 lg:p-2.5">
                  <p className="text-xs text-slate-500">Used</p>
                  <p className="mt-1 font-mono text-2xl font-black text-rose-200 lg:text-xl">
                    {usedIds.length}/{characters.length}
                  </p>
                </div>
              </div>
            </section>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-center text-sm font-medium text-violet-200">
              {nextActionText}
            </div>

            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur-sm lg:p-3">
              <h2 className="mb-3 text-lg font-bold text-pink-300">Session Controls</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  onClick={handleResetAllRuns}
                  disabled={activeRunItems.length === 0}
                  className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-950/50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Reset Active
                </button>
                <button
                  onClick={handleResetSessionUsage}
                  disabled={usedIds.length === 0}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Reset Used
                </button>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-cyan-300">Character Timers</h2>

              {activeRunItems.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center text-sm text-slate-500">
                  No active runs
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {activeRunItems.map(({ character, run }) => {
                  const currentStage = getCurrentStage(run);

                  return (
                    <article
                      key={character.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-lg shadow-black/10"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <CharacterPortrait character={character} compact muted={false} />
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-100">
                              {character.name}
                            </h3>
                            <p className="truncate text-xs text-slate-500">{getRunStatus(run)}</p>
                          </div>
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
                              key={`${character.id}-${stage.id}`}
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

                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleBoss1Defeated(character.id)}
                          disabled={!canAdvanceFromStage(run, "stage1")}
                          className="rounded-lg border border-violet-500/40 bg-violet-950/40 px-2 py-1.5 text-[11px] font-semibold text-violet-200 transition hover:bg-violet-900/40 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          Boss 1
                        </button>
                        <button
                          onClick={() => handleBoss2Defeated(character.id)}
                          disabled={!canAdvanceFromStage(run, "stage2")}
                          className="rounded-lg border border-pink-500/40 bg-pink-950/40 px-2 py-1.5 text-[11px] font-semibold text-pink-200 transition hover:bg-pink-900/40 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          Boss 2
                        </button>
                        <button
                          onClick={() => handleResetCharacterRun(character.id)}
                          className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-2 py-1.5 text-[11px] font-semibold text-rose-200 transition hover:bg-rose-950/50"
                        >
                          {isRunComplete(run) ? "Finish" : "Reset"}
                        </button>
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
