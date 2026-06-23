"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  PERSONAL_DATA_EVENT,
  PERSONAL_DATA_STORAGE_KEY,
  readPersonalDataProfiles,
} from "@/lib/personal-data";
import type { PersonalCharacterProfile } from "@/lib/personal-data-types";
import type {
  RathenaCalculatorItem,
  RathenaItemBonuses,
  RathenaItemBonusKey,
  RathenaItemCategory,
} from "@/lib/rathena-item-types";

const STORAGE_KEY = "cenlab.stat-calculator.v1";

const PRIMARY_STAT_FIELDS = [
  { key: "str", label: "STR" },
  { key: "agi", label: "AGI" },
  { key: "vit", label: "VIT" },
  { key: "int", label: "INT" },
  { key: "dex", label: "DEX" },
  { key: "luk", label: "LUK" },
] as const;

const TRAIT_STAT_FIELDS = [
  { key: "pow", label: "POW" },
  { key: "sta", label: "STA" },
  { key: "wis", label: "WIS" },
  { key: "spl", label: "SPL" },
  { key: "con", label: "CON" },
  { key: "crt", label: "CRT" },
] as const;

const MODIFIER_FIELDS = [
  { key: "weaponAtk", label: "Weapon ATK", max: 2000 },
  { key: "equipAtk", label: "Equip ATK", max: 2000 },
  { key: "atkPercent", label: "ATK %", max: 500 },
  { key: "equipMatk", label: "Equip MATK", max: 2000 },
  { key: "matkPercent", label: "MATK %", max: 500 },
  { key: "hitBonus", label: "HIT +", max: 2000 },
  { key: "fleeBonus", label: "FLEE +", max: 2000 },
  { key: "critBonus", label: "CRIT +", max: 500 },
  { key: "defBonus", label: "DEF +", max: 5000 },
  { key: "mdefBonus", label: "MDEF +", max: 5000 },
  { key: "pAtkBonus", label: "P.ATK +", max: 500 },
  { key: "sMatkBonus", label: "S.MATK +", max: 500 },
] as const;

const ITEM_CATEGORIES: { value: RathenaItemCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "weapon", label: "Weapon" },
  { value: "armor", label: "Armor" },
  { value: "card", label: "Card" },
  { value: "shadow", label: "Shadow" },
  { value: "ammo", label: "Ammo" },
  { value: "consumable", label: "Consumable" },
  { value: "usable", label: "Usable" },
  { value: "etc", label: "Etc" },
];

const ITEM_BONUS_LABELS: Record<RathenaItemBonusKey, string> = {
  str: "STR",
  agi: "AGI",
  vit: "VIT",
  int: "INT",
  dex: "DEX",
  luk: "LUK",
  pow: "POW",
  sta: "STA",
  wis: "WIS",
  spl: "SPL",
  con: "CON",
  crt: "CRT",
  weaponAtk: "Weapon ATK",
  equipAtk: "Equip ATK",
  atkPercent: "ATK %",
  equipMatk: "Equip MATK",
  matkPercent: "MATK %",
  hitBonus: "HIT",
  fleeBonus: "FLEE",
  critBonus: "CRIT",
  defBonus: "DEF",
  mdefBonus: "MDEF",
  pAtkBonus: "P.ATK",
  sMatkBonus: "S.MATK",
  rangedDamagePercent: "Ranged %",
  meleeDamagePercent: "Melee %",
  criticalDamagePercent: "Crit Dmg %",
  variableCastPercent: "VCT %",
  aspdPercent: "ASPD %",
};

const PERCENT_BONUS_KEYS = new Set<RathenaItemBonusKey>([
  "atkPercent",
  "matkPercent",
  "rangedDamagePercent",
  "meleeDamagePercent",
  "criticalDamagePercent",
  "variableCastPercent",
  "aspdPercent",
]);

type PrimaryStatKey = (typeof PRIMARY_STAT_FIELDS)[number]["key"];
type TraitStatKey = (typeof TRAIT_STAT_FIELDS)[number]["key"];
type ModifierKey = (typeof MODIFIER_FIELDS)[number]["key"];

type StatBuild = {
  profileId: string;
  baseLevel: number;
  jobLevel: number;
  itemIds: number[];
  primaryStats: Record<PrimaryStatKey, number>;
  traitStats: Record<TraitStatKey, number>;
  modifiers: Record<ModifierKey, number>;
};

type DerivedStats = {
  statusAtk: number;
  totalAtk: number;
  statusMatk: number;
  totalMatk: number;
  hit: number;
  flee: number;
  crit: number;
  softDef: number;
  softMdef: number;
  weightLimit: number;
  perfectDodge: number;
  variableCastReduction: number;
  pAtk: number;
  sMatk: number;
  res: number;
  mres: number;
  hPlus: number;
  cRate: number;
};

type ItemSearchResponse = {
  generatedAt: string;
  items: RathenaCalculatorItem[];
  source: string;
  total: number;
};

const DEFAULT_PRIMARY_STATS: Record<PrimaryStatKey, number> = {
  str: 120,
  agi: 100,
  vit: 100,
  int: 100,
  dex: 120,
  luk: 100,
};

const DEFAULT_TRAIT_STATS: Record<TraitStatKey, number> = {
  pow: 0,
  sta: 0,
  wis: 0,
  spl: 0,
  con: 0,
  crt: 0,
};

const DEFAULT_MODIFIERS: Record<ModifierKey, number> = {
  weaponAtk: 0,
  equipAtk: 0,
  atkPercent: 0,
  equipMatk: 0,
  matkPercent: 0,
  hitBonus: 0,
  fleeBonus: 0,
  critBonus: 0,
  defBonus: 0,
  mdefBonus: 0,
  pAtkBonus: 0,
  sMatkBonus: 0,
};

const DEFAULT_BUILD: StatBuild = {
  profileId: "",
  baseLevel: 250,
  jobLevel: 50,
  itemIds: [],
  primaryStats: DEFAULT_PRIMARY_STATS,
  traitStats: DEFAULT_TRAIT_STATS,
  modifiers: DEFAULT_MODIFIERS,
};

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function floorClamp(value: number, min: number, max: number): number {
  return Math.floor(clampNumber(value, min, max));
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function mergeNumberRecord<T extends string>(
  defaults: Record<T, number>,
  value: unknown,
  min: number,
  max: number
): Record<T, number> {
  const source = (typeof value === "object" && value !== null ? value : {}) as Partial<Record<T, unknown>>;

  return Object.keys(defaults).reduce<Record<T, number>>((next, rawKey) => {
    const key = rawKey as T;
    const rawValue = source[key];
    next[key] = floorClamp(typeof rawValue === "number" ? rawValue : defaults[key], min, max);
    return next;
  }, {} as Record<T, number>);
}

function normalizeBuild(value: unknown): StatBuild {
  const source = typeof value === "object" && value !== null ? (value as Partial<StatBuild>) : {};
  const rawItemIds = Array.isArray(source.itemIds) ? source.itemIds : [];

  return {
    profileId: typeof source.profileId === "string" ? source.profileId : DEFAULT_BUILD.profileId,
    baseLevel: floorClamp(typeof source.baseLevel === "number" ? source.baseLevel : DEFAULT_BUILD.baseLevel, 1, 260),
    jobLevel: floorClamp(typeof source.jobLevel === "number" ? source.jobLevel : DEFAULT_BUILD.jobLevel, 1, 70),
    itemIds: Array.from(
      new Set(
        rawItemIds
          .map((id) => (typeof id === "number" ? Math.floor(id) : Number(id)))
          .filter((id) => Number.isInteger(id) && id > 0)
      )
    ).slice(0, 80),
    primaryStats: mergeNumberRecord(DEFAULT_PRIMARY_STATS, source.primaryStats, 1, 130),
    traitStats: mergeNumberRecord(DEFAULT_TRAIT_STATS, source.traitStats, 0, 110),
    modifiers: mergeNumberRecord(DEFAULT_MODIFIERS, source.modifiers, 0, 5000),
  };
}

function readStoredBuild(): StatBuild {
  if (typeof window === "undefined") return DEFAULT_BUILD;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_BUILD;

  try {
    return normalizeBuild(JSON.parse(stored));
  } catch {
    return DEFAULT_BUILD;
  }
}

function addBonus(current: number, bonuses: RathenaItemBonuses, key: RathenaItemBonusKey): number {
  return current + (bonuses[key] || 0);
}

function combineItemBonuses(items: RathenaCalculatorItem[]): RathenaItemBonuses {
  const combined: RathenaItemBonuses = {};

  for (const item of items) {
    if (!item.bonuses) continue;

    for (const [rawKey, value] of Object.entries(item.bonuses)) {
      if (typeof value !== "number") continue;
      const key = rawKey as RathenaItemBonusKey;
      combined[key] = (combined[key] || 0) + value;
    }
  }

  return combined;
}

function applyItemBonuses(build: StatBuild, bonuses: RathenaItemBonuses): StatBuild {
  return {
    ...build,
    primaryStats: {
      str: floorClamp(addBonus(build.primaryStats.str, bonuses, "str"), 1, 500),
      agi: floorClamp(addBonus(build.primaryStats.agi, bonuses, "agi"), 1, 500),
      vit: floorClamp(addBonus(build.primaryStats.vit, bonuses, "vit"), 1, 500),
      int: floorClamp(addBonus(build.primaryStats.int, bonuses, "int"), 1, 500),
      dex: floorClamp(addBonus(build.primaryStats.dex, bonuses, "dex"), 1, 500),
      luk: floorClamp(addBonus(build.primaryStats.luk, bonuses, "luk"), 1, 500),
    },
    traitStats: {
      pow: floorClamp(addBonus(build.traitStats.pow, bonuses, "pow"), 0, 500),
      sta: floorClamp(addBonus(build.traitStats.sta, bonuses, "sta"), 0, 500),
      wis: floorClamp(addBonus(build.traitStats.wis, bonuses, "wis"), 0, 500),
      spl: floorClamp(addBonus(build.traitStats.spl, bonuses, "spl"), 0, 500),
      con: floorClamp(addBonus(build.traitStats.con, bonuses, "con"), 0, 500),
      crt: floorClamp(addBonus(build.traitStats.crt, bonuses, "crt"), 0, 500),
    },
    modifiers: {
      weaponAtk: floorClamp(addBonus(build.modifiers.weaponAtk, bonuses, "weaponAtk"), 0, 20000),
      equipAtk: floorClamp(addBonus(build.modifiers.equipAtk, bonuses, "equipAtk"), 0, 20000),
      atkPercent: floorClamp(addBonus(build.modifiers.atkPercent, bonuses, "atkPercent"), 0, 5000),
      equipMatk: floorClamp(addBonus(build.modifiers.equipMatk, bonuses, "equipMatk"), 0, 20000),
      matkPercent: floorClamp(addBonus(build.modifiers.matkPercent, bonuses, "matkPercent"), 0, 5000),
      hitBonus: floorClamp(addBonus(build.modifiers.hitBonus, bonuses, "hitBonus"), 0, 20000),
      fleeBonus: floorClamp(addBonus(build.modifiers.fleeBonus, bonuses, "fleeBonus"), 0, 20000),
      critBonus: floorClamp(addBonus(build.modifiers.critBonus, bonuses, "critBonus"), 0, 5000),
      defBonus: floorClamp(addBonus(build.modifiers.defBonus, bonuses, "defBonus"), 0, 20000),
      mdefBonus: floorClamp(addBonus(build.modifiers.mdefBonus, bonuses, "mdefBonus"), 0, 20000),
      pAtkBonus: floorClamp(addBonus(build.modifiers.pAtkBonus, bonuses, "pAtkBonus"), 0, 5000),
      sMatkBonus: floorClamp(addBonus(build.modifiers.sMatkBonus, bonuses, "sMatkBonus"), 0, 5000),
    },
  };
}

function calculateDerivedStats(build: StatBuild): DerivedStats {
  const { baseLevel, primaryStats, traitStats, modifiers } = build;
  const { str, agi, vit, int, dex, luk } = primaryStats;
  const { pow, sta, wis, spl, con, crt } = traitStats;

  const statusAtk = Math.floor(baseLevel / 4) + str + Math.floor(dex / 5) + Math.floor(luk / 3);
  const statusMatk = Math.floor(baseLevel / 4) + int + Math.floor(int / 2) + Math.floor(dex / 5) + Math.floor(luk / 3);
  const totalAtk = Math.floor(
    (statusAtk + modifiers.weaponAtk + modifiers.equipAtk) * (1 + modifiers.atkPercent / 100)
  );
  const totalMatk = Math.floor((statusMatk + modifiers.equipMatk) * (1 + modifiers.matkPercent / 100));

  return {
    statusAtk,
    totalAtk,
    statusMatk,
    totalMatk,
    hit: 175 + baseLevel + dex + Math.floor(luk / 3) + con + modifiers.hitBonus,
    flee: 100 + baseLevel + agi + Math.floor(luk / 5) + modifiers.fleeBonus,
    crit: 1 + Math.floor(luk * 0.3) + Math.floor(crt * 0.3) + modifiers.critBonus,
    softDef: Math.floor(baseLevel / 2) + Math.floor(vit / 2) + Math.floor(agi / 5) + modifiers.defBonus,
    softMdef:
      Math.floor(baseLevel / 4) +
      Math.floor(int / 2) +
      Math.floor(vit / 5) +
      Math.floor(dex / 5) +
      modifiers.mdefBonus,
    weightLimit: 2000 + str * 30,
    perfectDodge: 1 + Math.floor(luk / 10),
    variableCastReduction: Math.min(100, ((dex * 2 + int) / 530) * 100),
    pAtk: Math.floor(pow / 3) + Math.floor(con / 5) + modifiers.pAtkBonus,
    sMatk: Math.floor(spl / 3) + Math.floor(wis / 5) + modifiers.sMatkBonus,
    res: Math.floor(sta / 3),
    mres: Math.floor(wis / 3),
    hPlus: Math.floor(crt / 3),
    cRate: Math.floor(con / 3) + Math.floor(crt / 5),
  };
}

export default function StatCalculator() {
  const [profiles, setProfiles] = useState<PersonalCharacterProfile[]>(() => readPersonalDataProfiles());
  const [build, setBuild] = useState<StatBuild>(() => readStoredBuild());
  const [itemQuery, setItemQuery] = useState("");
  const [itemCategory, setItemCategory] = useState<RathenaItemCategory | "all">("all");
  const [itemResults, setItemResults] = useState<RathenaCalculatorItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<RathenaCalculatorItem[]>([]);
  const [itemTotal, setItemTotal] = useState(0);
  const [isSearchingItems, setIsSearchingItems] = useState(false);

  const selectedProfile = profiles.find((profile) => profile.id === build.profileId);
  const itemBonuses = useMemo(() => combineItemBonuses(selectedItems), [selectedItems]);
  const effectiveBuild = useMemo(() => applyItemBonuses(build, itemBonuses), [build, itemBonuses]);
  const derivedStats = useMemo(() => calculateDerivedStats(effectiveBuild), [effectiveBuild]);
  const castRemaining = Math.max(0, 100 - derivedStats.variableCastReduction);
  const primaryTotal = PRIMARY_STAT_FIELDS.reduce((sum, field) => sum + effectiveBuild.primaryStats[field.key], 0);
  const traitTotal = TRAIT_STAT_FIELDS.reduce((sum, field) => sum + effectiveBuild.traitStats[field.key], 0);
  const selectedItemIds = build.itemIds.join(",");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(build));
  }, [build]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSelectedItems() {
      if (!selectedItemIds) {
        setSelectedItems([]);
        return;
      }

      const response = await fetch(`/api/items/search?ids=${encodeURIComponent(selectedItemIds)}`, {
        signal: controller.signal,
      });
      if (!response.ok) return;

      const payload = (await response.json()) as ItemSearchResponse;
      setSelectedItems(payload.items);
    }

    fetchSelectedItems().catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error(error);
    });

    return () => controller.abort();
  }, [selectedItemIds]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearchingItems(true);
      const params = new URLSearchParams({
        category: itemCategory,
        limit: "36",
        q: itemQuery,
      });

      try {
        const response = await fetch(`/api/items/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const payload = (await response.json()) as ItemSearchResponse;
        setItemResults(payload.items);
        setItemTotal(payload.total);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
      } finally {
        if (!controller.signal.aborted) setIsSearchingItems(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [itemCategory, itemQuery]);

  useEffect(() => {
    function refreshProfiles() {
      setProfiles(readPersonalDataProfiles());
    }

    function handleStorageEvent(event: StorageEvent) {
      if (event.key === PERSONAL_DATA_STORAGE_KEY) refreshProfiles();
    }

    window.addEventListener(PERSONAL_DATA_EVENT, refreshProfiles);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(PERSONAL_DATA_EVENT, refreshProfiles);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  function applyProfile(profileId: string) {
    const nextProfile = profiles.find((profile) => profile.id === profileId);
    setBuild((current) => ({
      ...current,
      profileId,
      baseLevel: nextProfile ? floorClamp(nextProfile.level, 1, 260) : current.baseLevel,
    }));
  }

  function updateBuild(patch: Partial<StatBuild>) {
    setBuild((current) => normalizeBuild({ ...current, ...patch }));
  }

  function updatePrimaryStat(key: PrimaryStatKey, value: number) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        primaryStats: {
          ...current.primaryStats,
          [key]: value,
        },
      })
    );
  }

  function updateTraitStat(key: TraitStatKey, value: number) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        traitStats: {
          ...current.traitStats,
          [key]: value,
        },
      })
    );
  }

  function updateModifier(key: ModifierKey, value: number) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        modifiers: {
          ...current.modifiers,
          [key]: value,
        },
      })
    );
  }

  function addItem(itemId: number) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        itemIds: current.itemIds.includes(itemId) ? current.itemIds : [...current.itemIds, itemId],
      })
    );
  }

  function removeItem(itemId: number) {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        itemIds: current.itemIds.filter((id) => id !== itemId),
      })
    );
  }

  function clearItems() {
    setBuild((current) =>
      normalizeBuild({
        ...current,
        itemIds: [],
      })
    );
  }

  function resetBuild() {
    setBuild(DEFAULT_BUILD);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-cyan-300 sm:text-4xl">Stat Calculator</h1>
            <p className="mt-1 text-sm text-slate-400">RO status and derived combat values</p>
          </div>

          <div className="flex w-full flex-col gap-2 xl:w-auto xl:items-end">
            <nav className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:w-auto xl:grid-cols-8">
              <NavLink href="/cen-lab" label="Cen Lab" tone="cyan" />
              <NavLink href="/ogch" label="OGCH" tone="violet" />
              <NavLink href="/water-dungeon" label="Water" tone="sky" />
              <NavLink href="/personal-data" label="Personal" tone="emerald" />
              <NavLink href="/exp" label="EXP" tone="amber" />
              <NavLink href="/stat-calculator" label="Stat" tone="cyan" active />
              <NavLink href="/ogch/bishop" label="Bishop" tone="pink" />
              <NavLink href="/cen-lab/calculator" label="Public" tone="emerald" />
            </nav>
            <LogoutButton />
          </div>
        </header>

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <SummaryCard label="ATK" value={formatNumber(derivedStats.totalAtk)} detail={`status ${derivedStats.statusAtk}`} tone="cyan" />
          <SummaryCard
            label="MATK"
            value={formatNumber(derivedStats.totalMatk)}
            detail={`status ${derivedStats.statusMatk}`}
            tone="violet"
          />
          <SummaryCard label="HIT" value={formatNumber(derivedStats.hit)} detail={`DEX ${effectiveBuild.primaryStats.dex}`} tone="emerald" />
          <SummaryCard label="FLEE" value={formatNumber(derivedStats.flee)} detail={`AGI ${effectiveBuild.primaryStats.agi}`} tone="sky" />
          <SummaryCard label="CRIT" value={formatNumber(derivedStats.crit)} detail={`LUK ${effectiveBuild.primaryStats.luk}`} tone="amber" />
          <SummaryCard
            label="VCT"
            value={`${formatNumber(derivedStats.variableCastReduction)}%`}
            detail={`${formatNumber(castRemaining)}% left`}
            tone="rose"
          />
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-cyan-200">Character</h2>
                <button
                  className="rounded-lg border border-rose-500/40 bg-rose-950/25 px-3 py-2 text-xs font-black text-rose-100 transition hover:bg-rose-950/45"
                  type="button"
                  onClick={resetBuild}
                >
                  Reset
                </button>
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Personal Data</span>
                <select
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition focus:border-cyan-400"
                  value={build.profileId}
                  onChange={(event) => applyProfile(event.target.value)}
                >
                  <option value="">Manual Build</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} - Lv.{profile.level}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <NumberField
                  label="Base Level"
                  max={260}
                  min={1}
                  value={build.baseLevel}
                  onChange={(baseLevel) => updateBuild({ baseLevel })}
                />
                <NumberField
                  label="Job Level"
                  max={70}
                  min={1}
                  value={build.jobLevel}
                  onChange={(jobLevel) => updateBuild({ jobLevel })}
                />
              </div>

              {selectedProfile ? (
                <div className="mt-4 rounded-lg border border-cyan-500/25 bg-cyan-950/20 px-3 py-2 text-sm font-semibold text-cyan-100">
                  {selectedProfile.groupLabel}
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-violet-200">Status</h2>
                <span className="font-mono text-sm font-black text-slate-400">{primaryTotal}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {PRIMARY_STAT_FIELDS.map((field) => (
                  <NumberField
                    key={field.key}
                    label={field.label}
                    max={130}
                    min={1}
                    value={build.primaryStats[field.key]}
                    onChange={(value) => updatePrimaryStat(field.key, value)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-emerald-200">Trait</h2>
                <span className="font-mono text-sm font-black text-slate-400">{traitTotal}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {TRAIT_STAT_FIELDS.map((field) => (
                  <NumberField
                    key={field.key}
                    label={field.label}
                    max={110}
                    min={0}
                    value={build.traitStats[field.key]}
                    onChange={(value) => updateTraitStat(field.key, value)}
                  />
                ))}
              </div>
            </section>
          </aside>

          <section className="space-y-5">
            <ItemLoadoutPanel
              bonuses={itemBonuses}
              category={itemCategory}
              isLoading={isSearchingItems}
              query={itemQuery}
              results={itemResults}
              resultTotal={itemTotal}
              selectedIds={build.itemIds}
              selectedItems={selectedItems}
              onAdd={addItem}
              onCategoryChange={setItemCategory}
              onClear={clearItems}
              onQueryChange={setItemQuery}
              onRemove={removeItem}
            />

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <h2 className="text-lg font-black text-sky-200">Modifiers</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {MODIFIER_FIELDS.map((field) => (
                  <NumberField
                    key={field.key}
                    label={field.label}
                    max={field.max}
                    min={0}
                    value={build.modifiers[field.key]}
                    onChange={(value) => updateModifier(field.key, value)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <OutputPanel
                items={[
                  ["Status ATK", derivedStats.statusAtk],
                  ["Total ATK", derivedStats.totalAtk],
                  ["Status MATK", derivedStats.statusMatk],
                  ["Total MATK", derivedStats.totalMatk],
                  ["HIT", derivedStats.hit],
                  ["FLEE", derivedStats.flee],
                  ["CRIT", derivedStats.crit],
                  ["Perfect Dodge", derivedStats.perfectDodge],
                ]}
                title="Combat"
                tone="cyan"
              />
              <OutputPanel
                items={[
                  ["Soft DEF", derivedStats.softDef],
                  ["Soft MDEF", derivedStats.softMdef],
                  ["Weight Limit", derivedStats.weightLimit],
                  ["VCT Reduction", `${formatNumber(derivedStats.variableCastReduction)}%`],
                  ["VCT Left", `${formatNumber(castRemaining)}%`],
                  ["Base Level", build.baseLevel],
                  ["Job Level", build.jobLevel],
                  ["Status Total", primaryTotal],
                ]}
                title="Defense / Utility"
                tone="violet"
              />
              <OutputPanel
                items={[
                  ["P.ATK", derivedStats.pAtk],
                  ["S.MATK", derivedStats.sMatk],
                  ["RES", derivedStats.res],
                  ["MRES", derivedStats.mres],
                  ["H.Plus", derivedStats.hPlus],
                  ["C.Rate", derivedStats.cRate],
                  ["Trait Total", traitTotal],
                ]}
                title="Trait Output"
                tone="emerald"
              />
              <FormulaPanel />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ItemLoadoutPanel({
  bonuses,
  category,
  isLoading,
  onAdd,
  onCategoryChange,
  onClear,
  onQueryChange,
  onRemove,
  query,
  resultTotal,
  results,
  selectedIds,
  selectedItems,
}: {
  bonuses: RathenaItemBonuses;
  category: RathenaItemCategory | "all";
  isLoading: boolean;
  onAdd: (itemId: number) => void;
  onCategoryChange: (category: RathenaItemCategory | "all") => void;
  onClear: () => void;
  onQueryChange: (query: string) => void;
  onRemove: (itemId: number) => void;
  query: string;
  resultTotal: number;
  results: RathenaCalculatorItem[];
  selectedIds: number[];
  selectedItems: RathenaCalculatorItem[];
}) {
  const selectedIdSet = new Set(selectedIds);
  const bonusEntries = (Object.entries(bonuses) as [RathenaItemBonusKey, number][])
    .filter(([, value]) => value !== 0)
    .sort(([a], [b]) => ITEM_BONUS_LABELS[a].localeCompare(ITEM_BONUS_LABELS[b]));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-black text-cyan-200">Item Loadout</h2>
          <p className="mt-1 text-sm text-slate-400">rAthena item search with parsed top-level bonuses</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-cyan-500/25 bg-cyan-950/25 px-3 py-2 text-xs font-black text-cyan-100">
            {selectedItems.length} selected
          </span>
          <button
            className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-xs font-black text-rose-100 transition hover:bg-rose-950/45 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selectedItems.length === 0}
            type="button"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Search Items</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            placeholder="Angel Wing Bow, Mob Scarf, Varmundt..."
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Category</span>
          <select
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none transition focus:border-cyan-400"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value as RathenaItemCategory | "all")}
          >
            {ITEM_CATEGORIES.map((itemCategory) => (
              <option key={itemCategory.value} value={itemCategory.value}>
                {itemCategory.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-h-[220px] rounded-lg border border-slate-800 bg-slate-950/55">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {isLoading ? "Searching" : `${formatNumber(resultTotal)} results`}
            </p>
            <p className="text-xs font-semibold text-slate-500">showing {results.length}</p>
          </div>

          <div className="max-h-[430px] divide-y divide-slate-800 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-5 text-sm font-semibold text-slate-500">No item found.</div>
            ) : (
              results.map((item) => {
                const isSelected = selectedIdSet.has(item.id);

                return (
                  <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_88px] gap-3 p-3">
                    <ItemSummary item={item} />
                    <button
                      className="h-10 self-start rounded-lg border border-cyan-500/35 bg-cyan-950/25 px-3 text-xs font-black text-cyan-100 transition hover:bg-cyan-950/45 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500"
                      disabled={isSelected}
                      type="button"
                      onClick={() => onAdd(item.id)}
                    >
                      {isSelected ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950/55">
            <div className="border-b border-slate-800 px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Selected Items</p>
            </div>
            <div className="max-h-[250px] divide-y divide-slate-800 overflow-y-auto">
              {selectedItems.length === 0 ? (
                <div className="p-4 text-sm font-semibold text-slate-500">No items selected.</div>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_32px] gap-2 p-3">
                    <ItemSummary compact item={item} />
                    <button
                      className="h-8 rounded-lg border border-rose-500/35 bg-rose-950/25 text-sm font-black text-rose-100 transition hover:bg-rose-950/45"
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => onRemove(item.id)}
                    >
                      x
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300/80">Parsed Bonuses</p>
            {bonusEntries.length === 0 ? (
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Select items with direct top-level bonuses to apply them.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {bonusEntries.map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-lg border border-emerald-500/25 bg-emerald-950/30 px-2.5 py-1 text-xs font-black text-emerald-100"
                  >
                    {ITEM_BONUS_LABELS[key]} {formatBonusValue(key, value)}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs font-semibold text-amber-200/80">
              Conditional refine, grade, skill, race, size, and set bonuses are shown as preview only for now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemSummary({ compact = false, item }: { compact?: boolean; item: RathenaCalculatorItem }) {
  const bonusEntries = item.bonuses
    ? (Object.entries(item.bonuses) as [RathenaItemBonusKey, number][]).filter(([, value]) => value !== 0)
    : [];

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-black text-slate-100">{item.name}</p>
      <p className="mt-1 truncate text-xs font-semibold text-slate-500">{formatItemMeta(item)}</p>
      {!compact && item.scriptPreview && item.scriptPreview.length > 0 ? (
        <p className="mt-2 line-clamp-2 font-mono text-[11px] font-semibold text-slate-400">
          {item.scriptPreview.slice(0, 3).join(" ")}
        </p>
      ) : null}
      {bonusEntries.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {bonusEntries.slice(0, compact ? 3 : 6).map(([key, value]) => (
            <span
              key={key}
              className="rounded-md border border-cyan-500/20 bg-cyan-950/25 px-2 py-0.5 text-[11px] font-bold text-cyan-100"
            >
              {ITEM_BONUS_LABELS[key]} {formatBonusValue(key, value)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatItemMeta(item: RathenaCalculatorItem): string {
  return [
    `#${item.id}`,
    item.category,
    item.subType,
    item.slots.filter((slot) => slot !== "none").join("/"),
    item.equipLevel ? `Lv.${item.equipLevel}` : undefined,
    item.cardSlots !== undefined ? `${item.cardSlots} slots` : undefined,
  ]
    .filter(Boolean)
    .join(" - ");
}

function formatBonusValue(key: RathenaItemBonusKey, value: number): string {
  const prefix = value > 0 ? "+" : "";
  const suffix = PERCENT_BONUS_KEYS.has(key) ? "%" : "";
  return `${prefix}${formatNumber(value)}${suffix}`;
}

function NavLink({
  active = false,
  href,
  label,
  tone,
}: {
  active?: boolean;
  href: string;
  label: string;
  tone: "amber" | "cyan" | "emerald" | "pink" | "sky" | "violet";
}) {
  const activeClass = {
    amber: "border-amber-500/50 bg-amber-950/45 text-amber-100",
    cyan: "border-cyan-500/50 bg-cyan-950/45 text-cyan-100",
    emerald: "border-emerald-500/50 bg-emerald-950/45 text-emerald-100",
    pink: "border-pink-500/50 bg-pink-950/45 text-pink-100",
    sky: "border-sky-500/50 bg-sky-950/45 text-sky-100",
    violet: "border-violet-500/50 bg-violet-950/45 text-violet-100",
  }[tone];

  const inactiveClass = {
    amber: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-amber-500/40 hover:text-amber-200",
    cyan: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200",
    emerald: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-200",
    pink: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-pink-500/40 hover:text-pink-200",
    sky: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-sky-500/40 hover:text-sky-200",
    violet: "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-violet-500/40 hover:text-violet-200",
  }[tone];

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold transition ${
        active ? activeClass : inactiveClass
      }`}
      href={href}
    >
      {label}
    </Link>
  );
}

function NumberField({
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <input
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm font-black text-slate-100 outline-none transition focus:border-cyan-400"
        max={max}
        min={min}
        step={step}
        type="number"
        value={value}
        onChange={(event) => onChange(floorClamp(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function SummaryCard({
  detail,
  label,
  tone,
  value,
}: {
  detail?: string;
  label: string;
  tone: "amber" | "cyan" | "emerald" | "rose" | "sky" | "violet";
  value: string;
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

function OutputPanel({
  items,
  title,
  tone,
}: {
  items: [string, number | string][];
  title: string;
  tone: "cyan" | "emerald" | "violet";
}) {
  const titleClass = {
    cyan: "text-cyan-200",
    emerald: "text-emerald-200",
    violet: "text-violet-200",
  }[tone];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
      <div className="border-b border-slate-800 bg-slate-950/70 px-4 py-3">
        <h2 className={`font-black ${titleClass}`}>{title}</h2>
      </div>
      <div className="divide-y divide-slate-800/80">
        {items.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3">
            <span className="text-sm font-semibold text-slate-400">{label}</span>
            <span className="font-mono text-sm font-black text-slate-100">
              {typeof value === "number" ? formatNumber(value) : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormulaPanel() {
  const rows = [
    ["Status ATK", "Lv/4 + STR + DEX/5 + LUK/3"],
    ["Status MATK", "Lv/4 + INT + INT/2 + DEX/5 + LUK/3"],
    ["HIT", "175 + Lv + DEX + LUK/3 + CON"],
    ["FLEE", "100 + Lv + AGI + LUK/5"],
    ["CRIT", "1 + LUK x 0.3 + CRT x 0.3"],
    ["VCT", "(DEX x 2 + INT) / 530"],
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
      <div className="border-b border-slate-800 bg-slate-950/70 px-4 py-3">
        <h2 className="font-black text-sky-200">Formula Reference</h2>
      </div>
      <div className="divide-y divide-slate-800/80">
        {rows.map(([label, formula]) => (
          <div key={label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 px-4 py-3">
            <span className="text-sm font-semibold text-slate-400">{label}</span>
            <span className="font-mono text-xs font-bold text-slate-200">{formula}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
