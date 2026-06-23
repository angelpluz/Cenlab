"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  EXP_QUEST_CATEGORIES,
  EXP_QUESTS,
  FOURTH_CLASS_BASE_EXP,
  FOURTH_CLASS_JOB_EXP,
  type ExpQuest,
} from "@/lib/exp-calculator-data";
import {
  PERSONAL_DATA_STORAGE_KEY,
  readPersonalDataProfiles,
} from "@/lib/personal-data";
import type { PersonalCharacterProfile } from "@/lib/personal-data-types";

type CharacterClass = "fourth" | "third" | "doram";
type QuestFilter = "all" | "eligible" | "selected" | "weekly" | "fixed";
type QuestSort = "level" | "expDesc" | "category" | "name";

type BuffKey = "morroc" | "vip" | "silvervine" | "kafra";

type ProjectionRow = {
  day: number;
  weekday: string;
  level: number;
  exp: number;
  expGained: number;
  expPercent: number | null;
  questCount: number;
  timeMinutes: number;
  reachedTarget: boolean;
  missingExpTable: boolean;
};

type WaterDungeonExpRow = {
  difficulty: number;
  monsterBaseExp: number | null;
  monsterJobExp: number | null;
  fifthFloorBaseExp: number | null;
  fifthFloorJobExp: number | null;
  meteoriteDustChance: number | null;
};

type WaterDungeonExpRank = {
  id: string;
  label: string;
  levelRange: string;
  rows: WaterDungeonExpRow[];
};

type KnownWaterDungeonExp = Omit<WaterDungeonExpRow, "difficulty">;

const WEEKDAYS = [
  { value: 0, label: "Sat. Reset" },
  { value: 1, label: "Sun." },
  { value: 2, label: "Mon." },
  { value: 3, label: "Tue." },
  { value: 4, label: "Wed." },
  { value: 5, label: "Thu." },
  { value: 6, label: "Fri." },
] as const;

const CHARACTER_CLASSES: { value: CharacterClass; label: string; cap: number }[] = [
  { value: "fourth", label: "Fourth", cap: 260 },
  { value: "third", label: "Third", cap: 200 },
  { value: "doram", label: "Doram", cap: 200 },
];

const QUEST_FILTERS: { value: QuestFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "eligible", label: "Eligible" },
  { value: "selected", label: "Selected" },
  { value: "weekly", label: "Weekly" },
  { value: "fixed", label: "Fixed EXP" },
];

const QUEST_SORTS: { value: QuestSort; label: string }[] = [
  { value: "level", label: "Level" },
  { value: "category", label: "Category" },
  { value: "expDesc", label: "EXP high" },
  { value: "name", label: "Name" },
];

const BUFFS: { key: BuffKey; label: string; bonus: number }[] = [
  { key: "morroc", label: "Satan Morroc", bonus: 10 },
  { key: "vip", label: "VIP", bonus: 20 },
  { key: "silvervine", label: "Silvervine", bonus: 30 },
  { key: "kafra", label: "Kafra", bonus: 50 },
];

function createWaterDungeonRows(knownRows: Record<number, KnownWaterDungeonExp> = {}): WaterDungeonExpRow[] {
  const baseDifficultyRow = knownRows[1];

  function scaleExp(value: number | null | undefined, multiplier: number): number | null {
    return value === null || value === undefined ? null : value * multiplier;
  }

  return Array.from({ length: 5 }, (_, index) => {
    const difficulty = index + 1;
    const knownRow = knownRows[difficulty];

    return {
      difficulty,
      monsterBaseExp: knownRow?.monsterBaseExp ?? scaleExp(baseDifficultyRow?.monsterBaseExp, difficulty),
      monsterJobExp: knownRow?.monsterJobExp ?? scaleExp(baseDifficultyRow?.monsterJobExp, difficulty),
      fifthFloorBaseExp: knownRow?.fifthFloorBaseExp ?? scaleExp(baseDifficultyRow?.fifthFloorBaseExp, difficulty),
      fifthFloorJobExp: knownRow?.fifthFloorJobExp ?? scaleExp(baseDifficultyRow?.fifthFloorJobExp, difficulty),
      meteoriteDustChance: knownRow?.meteoriteDustChance ?? null,
    };
  });
}

const WATER_DUNGEON_EXP_RANKS: WaterDungeonExpRank[] = [
  {
    id: "rank-0",
    label: "Rank 0",
    levelRange: "Lv 40-59",
    rows: createWaterDungeonRows(),
  },
  {
    id: "rank-1",
    label: "Rank 1",
    levelRange: "Lv 60-79",
    rows: createWaterDungeonRows({
      1: {
        monsterBaseExp: 510,
        monsterJobExp: 510,
        fifthFloorBaseExp: 6696,
        fifthFloorJobExp: 6480,
        meteoriteDustChance: null,
      },
    }),
  },
  {
    id: "rank-2",
    label: "Rank 2",
    levelRange: "Lv 80-99",
    rows: createWaterDungeonRows(),
  },
  {
    id: "rank-3",
    label: "Rank 3",
    levelRange: "Lv 100-119",
    rows: createWaterDungeonRows({
      1: {
        monsterBaseExp: 1805,
        monsterJobExp: 1631,
        fifthFloorBaseExp: 22680,
        fifthFloorJobExp: 20520,
        meteoriteDustChance: null,
      },
    }),
  },
  {
    id: "rank-4",
    label: "Rank 4",
    levelRange: "Lv 120-139",
    rows: createWaterDungeonRows({
      1: {
        monsterBaseExp: 3150,
        monsterJobExp: 2700,
        fifthFloorBaseExp: 37800,
        fifthFloorJobExp: 32400,
        meteoriteDustChance: null,
      },
    }),
  },
  {
    id: "rank-5",
    label: "Rank 5",
    levelRange: "Lv 140-159",
    rows: createWaterDungeonRows(),
  },
  {
    id: "rank-6",
    label: "Rank 6",
    levelRange: "Lv 160-179",
    rows: createWaterDungeonRows(),
  },
  {
    id: "rank-7",
    label: "Rank 7",
    levelRange: "Lv 180-199",
    rows: createWaterDungeonRows(),
  },
  {
    id: "rank-8",
    label: "Rank 8",
    levelRange: "Lv 200-219",
    rows: createWaterDungeonRows({
      1: {
        monsterBaseExp: 274092,
        monsterJobExp: 191100,
        fifthFloorBaseExp: 2710800,
        fifthFloorJobExp: 1890000,
        meteoriteDustChance: null,
      },
    }),
  },
  {
    id: "rank-9",
    label: "Rank 9",
    levelRange: "Lv 220-239",
    rows: createWaterDungeonRows({
      1: {
        monsterBaseExp: null,
        monsterJobExp: null,
        fifthFloorBaseExp: 3207600,
        fifthFloorJobExp: 2268000,
        meteoriteDustChance: 70,
      },
    }),
  },
  {
    id: "rank-10",
    label: "Rank 10",
    levelRange: "Lv 240-249",
    rows: createWaterDungeonRows(),
  },
];

const numberFormatter = new Intl.NumberFormat("en-US");
const BASE_EXP_TO_REACH: Map<number, number> = new Map(
  FOURTH_CLASS_BASE_EXP.map((row) => [row.level, row.expToReach])
);
const CATEGORY_NAME_BY_ID: Map<string, string> = new Map(
  EXP_QUEST_CATEGORIES.map((category) => [category.id, category.name])
);
const STORAGE_KEY = "cenlab-exp-calculator-v1";
const DEFAULT_SELECTED_IDS = EXP_QUESTS.filter((quest) => quest.categoryId === "cat-16" && quest.level <= 240).map(
  (quest) => quest.id
);

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return numberFormatter.format(Math.max(0, Math.round(value)));
}

function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "n/a";
  return `${value.toFixed(value >= 10 ? 1 : 2)}%`;
}

function formatMinutes(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours <= 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function getClassCap(characterClass: CharacterClass): number {
  return CHARACTER_CLASSES.find((item) => item.value === characterClass)?.cap ?? 260;
}

function getExpRequiredForNext(level: number): number | null {
  return BASE_EXP_TO_REACH.get(level + 1) ?? null;
}

function getEdenBonus(level: number, edenBoost: boolean, edenBoost2: boolean): number {
  let bonus = 0;

  if (edenBoost) {
    bonus += level <= 99 ? 100 : 20;
  }

  if (edenBoost2) {
    if (level <= 190) bonus += 200;
    if (level >= 200) bonus += 300;
  }

  return bonus;
}

function getTotalRatePercent(options: {
  level: number;
  serverPercent: number;
  manualBonus: number;
  activeBuffs: Record<BuffKey, boolean>;
  edenBoost: boolean;
  edenBoost2: boolean;
}): number {
  const buffBonus = BUFFS.reduce((sum, buff) => sum + (options.activeBuffs[buff.key] ? buff.bonus : 0), 0);
  return (
    options.serverPercent +
    options.manualBonus +
    buffBonus +
    getEdenBonus(options.level, options.edenBoost, options.edenBoost2)
  );
}

function getAdjustedQuestExp(
  quest: ExpQuest,
  options: {
    level: number;
    serverPercent: number;
    manualBonus: number;
    activeBuffs: Record<BuffKey, boolean>;
    edenBoost: boolean;
    edenBoost2: boolean;
  }
): number {
  if (quest.isFixedExp) return quest.exp;

  const totalRatePercent = getTotalRatePercent(options);
  return Math.floor((quest.exp * totalRatePercent) / 100);
}

function applyExpGain(level: number, currentExp: number, gain: number, cap: number) {
  let nextLevel = level;
  let nextExp = currentExp;
  let remainingGain = gain;
  let missingExpTable = false;

  while (remainingGain > 0 && nextLevel < cap) {
    const required = getExpRequiredForNext(nextLevel);

    if (!required) {
      nextExp += remainingGain;
      remainingGain = 0;
      missingExpTable = true;
      break;
    }

    const expRoom = Math.max(0, required - nextExp);

    if (remainingGain < expRoom) {
      nextExp += remainingGain;
      remainingGain = 0;
      break;
    }

    remainingGain -= expRoom;
    nextLevel += 1;
    nextExp = 0;
  }

  return {
    level: nextLevel,
    exp: nextLevel >= cap ? 0 : nextExp,
    missingExpTable,
  };
}

function sortQuests(quests: readonly ExpQuest[], sort: QuestSort): ExpQuest[] {
  return [...quests].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "expDesc") return b.exp - a.exp || a.level - b.level || a.name.localeCompare(b.name);
    if (sort === "category") {
      return (
        (CATEGORY_NAME_BY_ID.get(a.categoryId) ?? "").localeCompare(CATEGORY_NAME_BY_ID.get(b.categoryId) ?? "") ||
        a.level - b.level ||
        a.name.localeCompare(b.name)
      );
    }

    return a.level - b.level || a.name.localeCompare(b.name);
  });
}

export default function ExpQuestCalculator() {
  const [profiles, setProfiles] = useState<PersonalCharacterProfile[]>([]);
  const [profileId, setProfileId] = useState("");
  const [characterClass, setCharacterClass] = useState<CharacterClass>("fourth");
  const [currentLevel, setCurrentLevel] = useState(200);
  const [currentExpPercent, setCurrentExpPercent] = useState(0);
  const [targetLevel, setTargetLevel] = useState(240);
  const [serverPercent, setServerPercent] = useState(100);
  const [manualBonus, setManualBonus] = useState(0);
  const [activeBuffs, setActiveBuffs] = useState<Record<BuffKey, boolean>>({
    morroc: false,
    vip: false,
    silvervine: false,
    kafra: false,
  });
  const [edenBoost, setEdenBoost] = useState(false);
  const [edenBoost2, setEdenBoost2] = useState(false);
  const [startWeekday, setStartWeekday] = useState(3);
  const [projectionDays, setProjectionDays] = useState(30);
  const [minutesPerQuest, setMinutesPerQuest] = useState(2);
  const [setupMinutes, setSetupMinutes] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [questFilter, setQuestFilter] = useState<QuestFilter>("eligible");
  const [questSort, setQuestSort] = useState<QuestSort>("level");
  const [selectedQuestIds, setSelectedQuestIds] = useState<string[]>(DEFAULT_SELECTED_IDS);
  const [notice, setNotice] = useState<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const classCap = getClassCap(characterClass);
  const safeCurrentLevel = Math.floor(clampNumber(currentLevel, 1, classCap));
  const safeTargetLevel = Math.floor(clampNumber(targetLevel, safeCurrentLevel, classCap));
  const expRequiredForCurrent = getExpRequiredForNext(safeCurrentLevel);
  const currentExp = expRequiredForCurrent
    ? Math.floor((clampNumber(currentExpPercent, 0, 99.999) / 100) * expRequiredForCurrent)
    : 0;

  useEffect(() => {
    function refreshProfiles() {
      setProfiles(readPersonalDataProfiles());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === PERSONAL_DATA_STORAGE_KEY) refreshProfiles();
    }

    refreshProfiles();
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setHasLoadedStorage(true);
      return;
    }

    try {
      const stored = JSON.parse(raw) as Partial<{
        profileId: string;
        characterClass: CharacterClass;
        currentLevel: number;
        currentExpPercent: number;
        targetLevel: number;
        serverPercent: number;
        manualBonus: number;
        activeBuffs: Record<BuffKey, boolean>;
        edenBoost: boolean;
        edenBoost2: boolean;
        startWeekday: number;
        projectionDays: number;
        minutesPerQuest: number;
        setupMinutes: number;
        selectedQuestIds: string[];
      }>;

      if (stored.profileId) setProfileId(stored.profileId);
      if (stored.characterClass) setCharacterClass(stored.characterClass);
      if (typeof stored.currentLevel === "number") setCurrentLevel(stored.currentLevel);
      if (typeof stored.currentExpPercent === "number") setCurrentExpPercent(stored.currentExpPercent);
      if (typeof stored.targetLevel === "number") setTargetLevel(stored.targetLevel);
      if (typeof stored.serverPercent === "number") setServerPercent(stored.serverPercent);
      if (typeof stored.manualBonus === "number") setManualBonus(stored.manualBonus);
      if (stored.activeBuffs) setActiveBuffs((current) => ({ ...current, ...stored.activeBuffs }));
      if (typeof stored.edenBoost === "boolean") setEdenBoost(stored.edenBoost);
      if (typeof stored.edenBoost2 === "boolean") setEdenBoost2(stored.edenBoost2);
      if (typeof stored.startWeekday === "number") setStartWeekday(stored.startWeekday);
      if (typeof stored.projectionDays === "number") setProjectionDays(stored.projectionDays);
      if (typeof stored.minutesPerQuest === "number") setMinutesPerQuest(stored.minutesPerQuest);
      if (typeof stored.setupMinutes === "number") setSetupMinutes(stored.setupMinutes);
      if (Array.isArray(stored.selectedQuestIds)) setSelectedQuestIds(stored.selectedQuestIds);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasLoadedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        profileId,
        characterClass,
        currentLevel,
        currentExpPercent,
        targetLevel,
        serverPercent,
        manualBonus,
        activeBuffs,
        edenBoost,
        edenBoost2,
        startWeekday,
        projectionDays,
        minutesPerQuest,
        setupMinutes,
        selectedQuestIds,
      })
    );
  }, [
    activeBuffs,
    characterClass,
    currentExpPercent,
    currentLevel,
    edenBoost,
    edenBoost2,
    hasLoadedStorage,
    manualBonus,
    minutesPerQuest,
    profileId,
    projectionDays,
    selectedQuestIds,
    serverPercent,
    setupMinutes,
    startWeekday,
    targetLevel,
  ]);

  useEffect(() => {
    setCurrentLevel((level) => Math.floor(clampNumber(level, 1, classCap)));
    setTargetLevel((level) => Math.floor(clampNumber(level, 1, classCap)));
  }, [classCap]);

  useEffect(() => {
    setTargetLevel((level) => Math.floor(clampNumber(level, Math.min(safeCurrentLevel + 1, classCap), classCap)));
  }, [classCap, safeCurrentLevel]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const selectedQuestSet = useMemo(() => new Set(selectedQuestIds), [selectedQuestIds]);

  const visibleQuests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = EXP_QUESTS.filter((quest) => {
      const categoryName = CATEGORY_NAME_BY_ID.get(quest.categoryId) ?? "";
      if (categoryFilter !== "all" && quest.categoryId !== categoryFilter) return false;
      if (questFilter === "eligible" && quest.level > safeCurrentLevel) return false;
      if (questFilter === "selected" && !selectedQuestSet.has(quest.id)) return false;
      if (questFilter === "weekly" && !quest.isWeekly) return false;
      if (questFilter === "fixed" && !quest.isFixedExp) return false;

      if (!query) return true;
      return [quest.name, quest.level.toString(), categoryName, quest.subgroup ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    return sortQuests(filtered, questSort);
  }, [categoryFilter, questFilter, questSort, safeCurrentLevel, searchQuery, selectedQuestSet]);

  const selectedQuests = useMemo(
    () => EXP_QUESTS.filter((quest) => selectedQuestSet.has(quest.id)),
    [selectedQuestSet]
  );

  const totalRatePercent = getTotalRatePercent({
    level: safeCurrentLevel,
    serverPercent,
    manualBonus,
    activeBuffs,
    edenBoost,
    edenBoost2,
  });

  const selectedSummary = useMemo(() => {
    const dailyQuests = selectedQuests.filter((quest) => !quest.isWeekly && quest.level <= safeCurrentLevel);
    const weeklyQuests = selectedQuests.filter((quest) => quest.isWeekly && quest.level <= safeCurrentLevel);
    const lockedQuests = selectedQuests.filter((quest) => quest.level > safeCurrentLevel);
    const dailyExp = dailyQuests.reduce(
      (sum, quest) =>
        sum +
        getAdjustedQuestExp(quest, {
          level: safeCurrentLevel,
          serverPercent,
          manualBonus,
          activeBuffs,
          edenBoost,
          edenBoost2,
        }),
      0
    );
    const weeklyExp = weeklyQuests.reduce(
      (sum, quest) =>
        sum +
        getAdjustedQuestExp(quest, {
          level: safeCurrentLevel,
          serverPercent,
          manualBonus,
          activeBuffs,
          edenBoost,
          edenBoost2,
        }),
      0
    );

    return {
      selectedCount: selectedQuests.length,
      dailyCount: dailyQuests.length,
      weeklyCount: weeklyQuests.length,
      lockedCount: lockedQuests.length,
      dailyExp,
      weeklyExp,
      dailyTimeMinutes: dailyQuests.length > 0 ? dailyQuests.length * minutesPerQuest + setupMinutes : 0,
      weeklyTimeMinutes: weeklyQuests.length > 0 ? weeklyQuests.length * minutesPerQuest : 0,
    };
  }, [
    activeBuffs,
    edenBoost,
    edenBoost2,
    manualBonus,
    minutesPerQuest,
    safeCurrentLevel,
    selectedQuests,
    serverPercent,
    setupMinutes,
  ]);

  const projectionRows = useMemo<ProjectionRow[]>(() => {
    let rowLevel = safeCurrentLevel;
    let rowExp = currentExp;

    return Array.from({ length: Math.floor(clampNumber(projectionDays, 1, 90)) }, (_, index) => {
      const weekdayIndex = (startWeekday + index) % WEEKDAYS.length;
      const includeWeekly = weekdayIndex === 0;
      const questsToday = selectedQuests.filter(
        (quest) => quest.level <= rowLevel && (!quest.isWeekly || includeWeekly)
      );
      const expGained = questsToday.reduce(
        (sum, quest) =>
          sum +
          getAdjustedQuestExp(quest, {
            level: rowLevel,
            serverPercent,
            manualBonus,
            activeBuffs,
            edenBoost,
            edenBoost2,
          }),
        0
      );
      const timeMinutes =
        questsToday.length > 0 ? questsToday.length * minutesPerQuest + setupMinutes : 0;
      const progress = applyExpGain(rowLevel, rowExp, expGained, classCap);

      rowLevel = progress.level;
      rowExp = progress.exp;

      const required = getExpRequiredForNext(rowLevel);

      return {
        day: index + 1,
        weekday: WEEKDAYS[weekdayIndex].label,
        level: rowLevel,
        exp: rowExp,
        expGained,
        expPercent: required ? (rowExp / required) * 100 : null,
        questCount: questsToday.length,
        timeMinutes,
        reachedTarget: rowLevel >= safeTargetLevel,
        missingExpTable: progress.missingExpTable || !required,
      };
    });
  }, [
    activeBuffs,
    classCap,
    currentExp,
    edenBoost,
    edenBoost2,
    manualBonus,
    minutesPerQuest,
    projectionDays,
    safeCurrentLevel,
    safeTargetLevel,
    selectedQuests,
    serverPercent,
    setupMinutes,
    startWeekday,
  ]);

  const targetRow = projectionRows.find((row) => row.reachedTarget);
  const totalProjectionTime = projectionRows.reduce((sum, row) => sum + row.timeMinutes, 0);
  const missingTable = safeCurrentLevel < 200 || projectionRows.some((row) => row.missingExpTable);

  function toggleQuest(questId: string) {
    setSelectedQuestIds((current) =>
      current.includes(questId) ? current.filter((id) => id !== questId) : [...current, questId]
    );
  }

  function selectQuests(quests: readonly ExpQuest[], message: string) {
    setSelectedQuestIds((current) => Array.from(new Set([...current, ...quests.map((quest) => quest.id)])));
    setNotice(message);
  }

  function clearSelectedQuests() {
    setSelectedQuestIds([]);
    setNotice("Selected quests cleared.");
  }

  function applyProfile(nextProfileId: string) {
    setProfileId(nextProfileId);
    const profile = profiles.find((item) => item.id === nextProfileId);
    if (!profile) return;

    const nextClass: CharacterClass = profile.level >= 200 ? "fourth" : "third";
    const nextCap = getClassCap(nextClass);
    const nextLevel = Math.floor(clampNumber(profile.level, 1, nextCap));

    setCharacterClass(nextClass);
    setCurrentLevel(nextLevel);
    setCurrentExpPercent(0);
    setTargetLevel(Math.min(nextCap, Math.max(nextLevel + 1, targetLevel)));
    setNotice(`Loaded ${profile.name} Lv.${profile.level}.`);
  }

  function jumpToProjection(row: ProjectionRow) {
    setCurrentLevel(row.level);
    setCurrentExpPercent(row.expPercent ?? 0);
    setNotice(`Applied day ${row.day} result.`);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-amber-300 sm:text-4xl">
              EXP Quest Calculator
            </h1>
            <p className="mt-1 text-sm text-slate-400">RO quest EXP and run-time projection</p>
          </div>
          <div className="flex w-full flex-col gap-2 xl:w-auto xl:items-end">
            <nav className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:w-auto xl:grid-cols-7">
              <NavLink href="/cen-lab" label="Cen Lab" tone="cyan" />
              <NavLink href="/ogch" label="OGCH" tone="violet" />
              <NavLink href="/water-dungeon" label="Water" tone="sky" />
              <NavLink href="/personal-data" label="Personal" tone="emerald" />
              <NavLink href="/exp" label="EXP" tone="amber" active />
              <NavLink href="/ogch/bishop" label="Bishop" tone="pink" />
              <NavLink href="/cen-lab/calculator" label="Public" tone="emerald" />
            </nav>
            <LogoutButton />
          </div>
        </header>

        {notice ? (
          <div className="mb-4 rounded-lg border border-amber-500/35 bg-amber-950/25 px-4 py-3 text-sm font-semibold text-amber-100">
            {notice}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <h2 className="text-lg font-black text-amber-200">Character</h2>

              <label className="mt-4 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Personal Data
              </label>
              <select
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-amber-400"
                value={profileId}
                onChange={(event) => applyProfile(event.target.value)}
              >
                <option value="">Manual character</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name} - Lv.{profile.level}
                  </option>
                ))}
              </select>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {CHARACTER_CLASSES.map((item) => {
                  const isActive = item.value === characterClass;

                  return (
                    <button
                      key={item.value}
                      className={`rounded-lg border px-3 py-2 text-sm font-black transition ${
                        isActive
                          ? "border-amber-400/55 bg-amber-950/35 text-amber-100"
                          : "border-slate-700 bg-slate-950/60 text-slate-400 hover:border-amber-500/35 hover:text-amber-100"
                      }`}
                      type="button"
                      onClick={() => setCharacterClass(item.value)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <NumberField
                  label="Current Level"
                  max={classCap}
                  min={1}
                  value={safeCurrentLevel}
                  onChange={setCurrentLevel}
                />
                <NumberField
                  label="Current EXP %"
                  max={99.999}
                  min={0}
                  step={0.001}
                  value={currentExpPercent}
                  onChange={setCurrentExpPercent}
                />
                <NumberField
                  label="Target Level"
                  max={classCap}
                  min={safeCurrentLevel}
                  value={safeTargetLevel}
                  onChange={setTargetLevel}
                />
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Current Raw EXP</p>
                  <p className="mt-2 break-words font-mono text-sm font-black text-slate-100">
                    {formatNumber(currentExp)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <h2 className="text-lg font-black text-cyan-200">EXP Adjustment</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <NumberField
                  label="Server %"
                  max={1000}
                  min={1}
                  value={serverPercent}
                  onChange={setServerPercent}
                />
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Battle Manual
                  </span>
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-400"
                    value={manualBonus}
                    onChange={(event) => setManualBonus(Number(event.target.value))}
                  >
                    {[0, 25, 50, 75, 100, 200].map((value) => (
                      <option key={value} value={value}>
                        {value === 0 ? "None" : `${value}%`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {BUFFS.map((buff) => (
                  <ToggleButton
                    key={buff.key}
                    active={activeBuffs[buff.key]}
                    label={`${buff.label} +${buff.bonus}%`}
                    onClick={() => setActiveBuffs((current) => ({ ...current, [buff.key]: !current[buff.key] }))}
                  />
                ))}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <ToggleButton
                  active={edenBoost}
                  label="Eden Boost 1"
                  onClick={() => setEdenBoost((current) => !current)}
                />
                <ToggleButton
                  active={edenBoost2}
                  label="Eden Boost 2"
                  onClick={() => setEdenBoost2((current) => !current)}
                />
              </div>

              <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Active Rate</p>
                <p className="mt-1 font-mono text-2xl font-black text-cyan-100">{formatNumber(totalRatePercent)}%</p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <h2 className="text-lg font-black text-violet-200">Time Plan</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <NumberField
                  label="Min / Quest"
                  max={999}
                  min={0}
                  step={0.5}
                  value={minutesPerQuest}
                  onChange={setMinutesPerQuest}
                />
                <NumberField
                  label="Setup Min"
                  max={999}
                  min={0}
                  step={0.5}
                  value={setupMinutes}
                  onChange={setSetupMinutes}
                />
                <NumberField
                  label="Projection Days"
                  max={90}
                  min={1}
                  value={projectionDays}
                  onChange={setProjectionDays}
                />
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Start Day</span>
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-violet-400"
                    value={startWeekday}
                    onChange={(event) => setStartWeekday(Number(event.target.value))}
                  >
                    {WEEKDAYS.map((weekday) => (
                      <option key={weekday.value} value={weekday.value}>
                        {weekday.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          </aside>

          <section className="min-w-0 space-y-4">
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Selected" value={`${selectedSummary.selectedCount} quests`} tone="amber" />
              <SummaryCard label="Daily EXP" value={formatNumber(selectedSummary.dailyExp)} tone="cyan" />
              <SummaryCard label="Weekly EXP" value={formatNumber(selectedSummary.weeklyExp)} tone="violet" />
              <SummaryCard
                label="Target"
                value={targetRow ? `Day ${targetRow.day}` : "Not reached"}
                detail={targetRow ? formatMinutes(projectionRows.slice(0, targetRow.day).reduce((sum, row) => sum + row.timeMinutes, 0)) : `${formatMinutes(totalProjectionTime)} projected`}
                tone={targetRow ? "emerald" : "rose"}
              />
            </section>

            {missingTable ? (
              <div className="rounded-lg border border-orange-500/35 bg-orange-950/20 px-4 py-3 text-sm font-semibold text-orange-100">
                EXP table data is available for Fourth Class Lv.200-260 only.
              </div>
            ) : null}

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_220px_160px_150px] xl:items-end">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Search</span>
                  <input
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400"
                    placeholder="Quest, map, level"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Category</span>
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-amber-400"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {EXP_QUEST_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Filter</span>
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-amber-400"
                    value={questFilter}
                    onChange={(event) => setQuestFilter(event.target.value as QuestFilter)}
                  >
                    {QUEST_FILTERS.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Sort</span>
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-amber-400"
                    value={questSort}
                    onChange={(event) => setQuestSort(event.target.value as QuestSort)}
                  >
                    {QUEST_SORTS.map((sort) => (
                      <option key={sort.value} value={sort.value}>
                        {sort.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  className="rounded-lg border border-amber-500/35 bg-amber-950/25 px-3 py-2 text-sm font-black text-amber-100 transition hover:bg-amber-950/45"
                  type="button"
                  onClick={() => selectQuests(visibleQuests, `${visibleQuests.length} visible quests selected.`)}
                >
                  Select Visible
                </button>
                <button
                  className="rounded-lg border border-cyan-500/35 bg-cyan-950/25 px-3 py-2 text-sm font-black text-cyan-100 transition hover:bg-cyan-950/45"
                  type="button"
                  onClick={() =>
                    selectQuests(
                      EXP_QUESTS.filter((quest) => quest.level <= safeCurrentLevel),
                      "Eligible quests selected."
                    )
                  }
                >
                  Select Eligible
                </button>
                <button
                  className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-sm font-black text-rose-100 transition hover:bg-rose-950/45"
                  type="button"
                  onClick={clearSelectedQuests}
                >
                  Clear Selected
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
              <div className="flex flex-col gap-1 border-b border-slate-800 p-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-amber-200">Quest List</h2>
                  <p className="text-sm text-slate-500">{visibleQuests.length} visible</p>
                </div>
                <p className="text-sm font-semibold text-slate-400">
                  {selectedSummary.dailyCount} daily / {selectedSummary.weeklyCount} weekly /{" "}
                  {selectedSummary.lockedCount} locked
                </p>
              </div>
              <div className="max-h-[560px] overflow-auto">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-950/95 text-xs uppercase tracking-[0.16em] text-slate-500">
                    <tr>
                      <th className="w-12 px-4 py-3">Use</th>
                      <th className="w-20 px-3 py-3">Lv</th>
                      <th className="px-3 py-3">Quest</th>
                      <th className="px-3 py-3">Category</th>
                      <th className="px-4 py-3 text-right">EXP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {visibleQuests.map((quest) => {
                      const selected = selectedQuestSet.has(quest.id);
                      const eligible = quest.level <= safeCurrentLevel;
                      const adjustedExp = getAdjustedQuestExp(quest, {
                        level: safeCurrentLevel,
                        serverPercent,
                        manualBonus,
                        activeBuffs,
                        edenBoost,
                        edenBoost2,
                      });

                      return (
                        <tr
                          key={quest.id}
                          className={`transition ${
                            selected ? "bg-amber-950/15" : "bg-slate-950/10 hover:bg-slate-800/30"
                          }`}
                        >
                          <td className="px-4 py-3 align-top">
                            <input
                              aria-label={`${selected ? "Remove" : "Add"} ${quest.name}`}
                              checked={selected}
                              className="h-4 w-4 accent-amber-400"
                              type="checkbox"
                              onChange={() => toggleQuest(quest.id)}
                            />
                          </td>
                          <td className="px-3 py-3 align-top font-mono font-black text-slate-200">
                            {quest.level}
                          </td>
                          <td className="px-3 py-3 align-top">
                            <div className="font-bold text-slate-100">{quest.name}</div>
                            <div className="mt-1 flex flex-wrap gap-1.5 text-xs font-bold">
                              {quest.subgroup ? (
                                <span className="rounded border border-slate-700 bg-slate-950 px-2 py-0.5 text-slate-400">
                                  {quest.subgroup}
                                </span>
                              ) : null}
                              {quest.isWeekly ? (
                                <span className="rounded border border-violet-500/35 bg-violet-950/30 px-2 py-0.5 text-violet-200">
                                  Weekly
                                </span>
                              ) : null}
                              {quest.isFixedExp ? (
                                <span className="rounded border border-emerald-500/35 bg-emerald-950/30 px-2 py-0.5 text-emerald-200">
                                  Fixed
                                </span>
                              ) : null}
                              {!eligible ? (
                                <span className="rounded border border-rose-500/35 bg-rose-950/30 px-2 py-0.5 text-rose-200">
                                  Locked
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top text-slate-400">
                            {CATEGORY_NAME_BY_ID.get(quest.categoryId)}
                          </td>
                          <td className="px-4 py-3 text-right align-top">
                            <div className="font-mono font-black text-slate-100">{formatNumber(adjustedExp)}</div>
                            <div className="mt-1 text-xs text-slate-500">base {formatNumber(quest.exp)}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
              <div className="flex flex-col gap-1 border-b border-slate-800 p-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-cyan-200">Projection</h2>
                  <p className="text-sm text-slate-500">Daily reset plus weekly quests on Sat. Reset</p>
                </div>
                <p className="text-sm font-semibold text-slate-400">{formatMinutes(totalProjectionTime)} total</p>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                  <thead className="bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Day</th>
                      <th className="px-3 py-3">Gained</th>
                      <th className="px-3 py-3">Level / EXP</th>
                      <th className="px-3 py-3">Quests</th>
                      <th className="px-3 py-3">Time</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {projectionRows.map((row) => (
                      <tr
                        key={row.day}
                        className={row.reachedTarget ? "bg-emerald-950/15" : "bg-slate-950/10"}
                      >
                        <td className="px-4 py-3 font-mono font-black text-slate-200">
                          {row.day}
                          <div className="mt-1 text-xs font-bold text-slate-500">{row.weekday}</div>
                        </td>
                        <td className="px-3 py-3 font-mono font-black text-cyan-100">
                          {formatNumber(row.expGained)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-mono font-black text-slate-100">
                            Lv.{row.level} / {formatPercent(row.expPercent)}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{formatNumber(row.exp)}</div>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-300">{row.questCount}</td>
                        <td className="px-3 py-3 font-semibold text-slate-300">{formatMinutes(row.timeMinutes)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-black text-slate-200 transition hover:border-cyan-400/45 hover:text-cyan-100"
                            type="button"
                            onClick={() => jumpToProjection(row)}
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <WaterDungeonExpCalculator />

            <ExpLevelTable currentLevel={safeCurrentLevel} targetLevel={safeTargetLevel} />
          </section>
        </div>
      </div>
    </main>
  );
}

function NavLink({
  href,
  label,
  tone,
  active = false,
}: {
  href: string;
  label: string;
  tone: "amber" | "cyan" | "emerald" | "pink" | "sky" | "violet";
  active?: boolean;
}) {
  const toneClass = {
    amber: active
      ? "border-amber-500/50 bg-amber-950/45 text-amber-100"
      : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-amber-500/40 hover:text-amber-200",
    cyan: active
      ? "border-cyan-500/50 bg-cyan-950/45 text-cyan-100"
      : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200",
    emerald: active
      ? "border-emerald-500/50 bg-emerald-950/45 text-emerald-100"
      : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-200",
    pink: active
      ? "border-pink-500/50 bg-pink-950/45 text-pink-100"
      : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-pink-500/40 hover:text-pink-200",
    sky: active
      ? "border-sky-500/50 bg-sky-950/45 text-sky-100"
      : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-sky-500/40 hover:text-sky-200",
    violet: active
      ? "border-violet-500/50 bg-violet-950/45 text-violet-100"
      : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-violet-500/40 hover:text-violet-200",
  }[tone];

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold transition ${toneClass}`}
      href={href}
    >
      {label}
    </Link>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <input
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm font-black text-slate-100 outline-none transition focus:border-amber-400"
        max={max}
        min={min}
        step={step}
        type="number"
        value={Number.isInteger(value) ? value : Number(value.toFixed(3))}
        onChange={(event) => onChange(clampNumber(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded-lg border px-3 py-2 text-left text-sm font-bold transition ${
        active
          ? "border-cyan-400/45 bg-cyan-950/35 text-cyan-100"
          : "border-slate-700 bg-slate-950/60 text-slate-400 hover:border-cyan-500/35 hover:text-cyan-100"
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
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
  tone: "amber" | "cyan" | "emerald" | "rose" | "sky" | "violet";
}) {
  const toneClass = {
    amber: "border-amber-500/25 bg-amber-950/20 text-amber-100",
    cyan: "border-cyan-500/25 bg-cyan-950/20 text-cyan-100",
    emerald: "border-emerald-500/25 bg-emerald-950/20 text-emerald-100",
    rose: "border-rose-500/25 bg-rose-950/20 text-rose-100",
    sky: "border-sky-500/25 bg-sky-950/20 text-sky-100",
    violet: "border-violet-500/25 bg-violet-950/20 text-violet-100",
  }[tone];

  return (
    <div className={`rounded-xl border p-4 shadow-lg shadow-black/10 ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 break-words font-mono text-2xl font-black">{value}</p>
      {detail ? <p className="mt-1 text-sm font-semibold text-slate-400">{detail}</p> : null}
    </div>
  );
}

function WaterDungeonExpCalculator() {
  const [rankId, setRankId] = useState("rank-8");
  const [difficulty, setDifficulty] = useState(1);
  const [monsterCount, setMonsterCount] = useState(0);
  const [fifthFloorCount, setFifthFloorCount] = useState(1);
  const [baseRatePercent, setBaseRatePercent] = useState(100);
  const [jobRatePercent, setJobRatePercent] = useState(100);
  const [customMonsterBaseExp, setCustomMonsterBaseExp] = useState(0);
  const [customMonsterJobExp, setCustomMonsterJobExp] = useState(0);
  const [customFifthBaseExp, setCustomFifthBaseExp] = useState(0);
  const [customFifthJobExp, setCustomFifthJobExp] = useState(0);

  const selectedRank = WATER_DUNGEON_EXP_RANKS.find((rank) => rank.id === rankId) ?? WATER_DUNGEON_EXP_RANKS[0];
  const selectedRow = selectedRank.rows.find((row) => row.difficulty === difficulty) ?? selectedRank.rows[0];

  const monsterBaseExp = selectedRow.monsterBaseExp ?? customMonsterBaseExp;
  const monsterJobExp = selectedRow.monsterJobExp ?? customMonsterJobExp;
  const fifthBaseExp = selectedRow.fifthFloorBaseExp ?? customFifthBaseExp;
  const fifthJobExp = selectedRow.fifthFloorJobExp ?? customFifthJobExp;
  const rawBaseExp = monsterBaseExp * monsterCount + fifthBaseExp * fifthFloorCount;
  const rawJobExp = monsterJobExp * monsterCount + fifthJobExp * fifthFloorCount;
  const adjustedBaseExp = Math.floor((rawBaseExp * baseRatePercent) / 100);
  const adjustedJobExp = Math.floor((rawJobExp * jobRatePercent) / 100);
  const hasMissingSelectedData =
    selectedRow.monsterBaseExp === null ||
    selectedRow.monsterJobExp === null ||
    selectedRow.fifthFloorBaseExp === null ||
    selectedRow.fifthFloorJobExp === null;

  return (
    <section className="rounded-xl border border-sky-500/20 bg-slate-900/70 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-1 border-b border-slate-800 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-sky-200">Water Dungeon EXP</h2>
          <p className="text-sm text-slate-500">
            Base / Job calculator for water dungeon ranks from{" "}
            <a
              className="font-bold text-sky-300 underline decoration-sky-500/40 underline-offset-4 hover:text-sky-100"
              href="https://hazyforest.com/instances:sunken_tower"
              rel="noreferrer"
              target="_blank"
            >
              Hazy Forest
            </a>
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-400">Difficulty Level = EXP multiplier</p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Rank</span>
                <select
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-sky-400"
                  value={rankId}
                  onChange={(event) => {
                    setRankId(event.target.value);
                    setDifficulty(1);
                  }}
                >
                  {WATER_DUNGEON_EXP_RANKS.map((rank) => (
                    <option key={rank.id} value={rank.id}>
                      {rank.label} ({rank.levelRange})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Difficulty</span>
                <select
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-sky-400"
                  value={difficulty}
                  onChange={(event) => setDifficulty(Number(event.target.value))}
                >
                  {selectedRank.rows.map((row) => (
                    <option key={row.difficulty} value={row.difficulty}>
                      Level {row.difficulty}
                    </option>
                  ))}
                </select>
              </label>
              <NumberField
                label="Monster Count"
                max={99999}
                min={0}
                value={monsterCount}
                onChange={setMonsterCount}
              />
              <NumberField
                label="5F Count"
                max={999}
                min={0}
                value={fifthFloorCount}
                onChange={setFifthFloorCount}
              />
              <NumberField
                label="Base Rate %"
                max={10000}
                min={0}
                value={baseRatePercent}
                onChange={setBaseRatePercent}
              />
              <NumberField
                label="Job Rate %"
                max={10000}
                min={0}
                value={jobRatePercent}
                onChange={setJobRatePercent}
              />
            </div>
          </div>

          {hasMissingSelectedData ? (
            <div className="rounded-lg border border-orange-500/30 bg-orange-950/20 p-4">
              <h3 className="font-black text-orange-100">Unknown override</h3>
              <p className="mt-1 text-sm text-orange-200/75">Fill only the cells marked ? for this rank.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <NumberField
                  label="Monster Base"
                  max={999999999999}
                  min={0}
                  value={customMonsterBaseExp}
                  onChange={setCustomMonsterBaseExp}
                />
                <NumberField
                  label="Monster Job"
                  max={999999999999}
                  min={0}
                  value={customMonsterJobExp}
                  onChange={setCustomMonsterJobExp}
                />
                <NumberField
                  label="5F Base"
                  max={999999999999}
                  min={0}
                  value={customFifthBaseExp}
                  onChange={setCustomFifthBaseExp}
                />
                <NumberField
                  label="5F Job"
                  max={999999999999}
                  min={0}
                  value={customFifthJobExp}
                  onChange={setCustomFifthJobExp}
                />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SummaryCard label="Base EXP" value={formatNumber(adjustedBaseExp)} detail={`raw ${formatNumber(rawBaseExp)}`} tone="sky" />
            <SummaryCard label="Job EXP" value={formatNumber(adjustedJobExp)} detail={`raw ${formatNumber(rawJobExp)}`} tone="cyan" />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-800">
          <div className="border-b border-slate-800 bg-slate-950/70 px-4 py-3">
            <h3 className="font-black text-sky-100">Water Dungeon Table</h3>
            <p className="mt-1 text-sm text-slate-500">
              Known EXP cells are multiplied by difficulty; unknown values stay as ?.
            </p>
          </div>
          <div className="overflow-auto">
            <table className="min-w-[860px] divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-950/95 text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-3 py-3">Diff</th>
                  <th className="px-3 py-3 text-right">Monster Base</th>
                  <th className="px-3 py-3 text-right">Monster Job</th>
                  <th className="px-3 py-3 text-right">5F Base</th>
                  <th className="px-3 py-3 text-right">5F Job</th>
                  <th className="px-4 py-3 text-right">Dust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {WATER_DUNGEON_EXP_RANKS.flatMap((rank) =>
                  rank.rows.map((row) => {
                    const isActive = rank.id === rankId && row.difficulty === difficulty;

                    return (
                      <tr key={`${rank.id}-${row.difficulty}`} className={isActive ? "bg-sky-950/25" : "bg-slate-950/10"}>
                        <td className="px-4 py-3 font-bold text-slate-200">
                          {rank.label}
                          <div className="mt-1 text-xs text-slate-500">{rank.levelRange}</div>
                        </td>
                        <td className="px-3 py-3 font-mono font-black text-slate-100">{row.difficulty}</td>
                        <WaterDungeonExpCell value={row.monsterBaseExp} />
                        <WaterDungeonExpCell value={row.monsterJobExp} />
                        <WaterDungeonExpCell value={row.fifthFloorBaseExp} />
                        <WaterDungeonExpCell value={row.fifthFloorJobExp} />
                        <td className="px-4 py-3 text-right font-mono font-black text-slate-200">
                          {row.meteoriteDustChance === null ? "?" : `${row.meteoriteDustChance}%`}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaterDungeonExpCell({ value }: { value: number | null }) {
  return (
    <td className={`px-3 py-3 text-right font-mono font-black ${value === null ? "text-orange-200" : "text-slate-100"}`}>
      {value === null ? "?" : formatNumber(value)}
    </td>
  );
}

function ExpLevelTable({
  currentLevel,
  targetLevel,
}: {
  currentLevel: number;
  targetLevel: number;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-1 border-b border-slate-800 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-violet-200">EXP Table</h2>
          <p className="text-sm text-slate-500">Class 4 base and job EXP from exptable.html</p>
        </div>
        <p className="text-sm font-semibold text-slate-400">Base Lv.200-260 / Job Lv.1-50</p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <div className="border-b border-slate-800 bg-slate-950/70 px-4 py-3">
            <h3 className="font-black text-violet-100">Base Level Up</h3>
            <p className="mt-1 text-sm text-slate-500">EXP required for each next base level</p>
          </div>
          <div className="max-h-[520px] overflow-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-950/95 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">From</th>
                  <th className="px-3 py-3">To</th>
                  <th className="px-4 py-3 text-right">Required EXP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {FOURTH_CLASS_BASE_EXP.map((row) => {
                  const fromLevel = row.level - 1;
                  const isCurrentNext = fromLevel === currentLevel;
                  const isTarget = row.level === targetLevel;

                  return (
                    <tr
                      key={row.level}
                      className={
                        isCurrentNext
                          ? "bg-amber-950/25"
                          : isTarget
                            ? "bg-emerald-950/15"
                            : "bg-slate-950/10"
                      }
                    >
                      <td className="px-4 py-3 font-mono font-black text-slate-200">Lv.{fromLevel}</td>
                      <td className="px-3 py-3">
                        <span className="font-mono font-black text-slate-100">Lv.{row.level}</span>
                        {isCurrentNext ? (
                          <span className="ml-2 rounded border border-amber-500/35 bg-amber-950/35 px-2 py-0.5 text-xs font-black text-amber-100">
                            Next
                          </span>
                        ) : null}
                        {isTarget ? (
                          <span className="ml-2 rounded border border-emerald-500/35 bg-emerald-950/35 px-2 py-0.5 text-xs font-black text-emerald-100">
                            Target
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-violet-100">
                        {formatNumber(row.expToReach)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-800">
          <div className="border-b border-slate-800 bg-slate-950/70 px-4 py-3">
            <h3 className="font-black text-cyan-100">Job Level Up</h3>
            <p className="mt-1 text-sm text-slate-500">EXP required for each next job level</p>
          </div>
          <div className="max-h-[520px] overflow-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-950/95 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Job Lv</th>
                  <th className="px-4 py-3 text-right">Required EXP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {FOURTH_CLASS_JOB_EXP.map((row) => (
                  <tr key={row.level} className="bg-slate-950/10">
                    <td className="px-4 py-3 font-mono font-black text-slate-100">
                      {row.level} to {row.level + 1}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-cyan-100">
                      {formatNumber(row.expToNext)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
