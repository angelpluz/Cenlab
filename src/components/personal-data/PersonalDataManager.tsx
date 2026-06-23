"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { getCharacterImage } from "@/lib/character-images";
import {
  PERSONAL_DATA_GROUP_OPTIONS,
  PERSONAL_DATA_GROUPS,
  PERSONAL_DATA_STORAGE_KEY,
  readPersonalDataProfiles,
  resetPersonalDataProfiles,
  writePersonalDataProfiles,
} from "@/lib/personal-data";
import type { PersonalCharacterProfile, PersonalDataGroupId } from "@/lib/personal-data-types";

type GroupFilter = "all" | PersonalDataGroupId;
type SortKey = "group" | "name" | "levelDesc" | "levelAsc";

const GROUP_FILTERS: { key: GroupFilter; label: string }[] = [
  { key: "all", label: "All Groups" },
  ...PERSONAL_DATA_GROUP_OPTIONS,
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "group", label: "Group" },
  { key: "name", label: "Name" },
  { key: "levelDesc", label: "Level high to low" },
  { key: "levelAsc", label: "Level low to high" },
];

function clampLevel(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(999, Math.floor(value)));
}

function sortProfiles(profiles: PersonalCharacterProfile[], sort: SortKey): PersonalCharacterProfile[] {
  return [...profiles].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "levelDesc") return b.level - a.level || a.name.localeCompare(b.name);
    if (sort === "levelAsc") return a.level - b.level || a.name.localeCompare(b.name);

    return (
      a.groupLabel.localeCompare(b.groupLabel) ||
      b.level - a.level ||
      a.name.localeCompare(b.name)
    );
  });
}

export default function PersonalDataManager() {
  const [profiles, setProfiles] = useState<PersonalCharacterProfile[]>(() => readPersonalDataProfiles());
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");
  const [sort, setSort] = useState<SortKey>("group");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    function refreshProfiles() {
      setProfiles(readPersonalDataProfiles());
    }

    function handleStorageEvent(event: StorageEvent) {
      if (event.key === PERSONAL_DATA_STORAGE_KEY) refreshProfiles();
    }

    refreshProfiles();
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const visibleProfiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = profiles.filter((profile) => {
      if (groupFilter !== "all" && profile.groupId !== groupFilter) return false;

      if (!query) return true;
      return [
        profile.name,
        profile.id,
        profile.level.toString(),
        `lv ${profile.level}`,
        profile.groupLabel,
        profile.note ?? "",
        ...profile.aliases,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    return sortProfiles(filtered, sort);
  }, [groupFilter, profiles, searchQuery, sort]);

  const summary = useMemo(() => {
    const lv240Plus = profiles.filter((profile) => profile.level >= 240).length;
    const lv250 = profiles.filter((profile) => profile.level >= 250).length;
    const lowLevel = profiles.filter((profile) => profile.level < 220).length;

    return {
      total: profiles.length,
      lv240Plus,
      lv250,
      lowLevel,
      visible: visibleProfiles.length,
    };
  }, [profiles, visibleProfiles.length]);

  function updateProfile(profileId: string, patch: Partial<Pick<PersonalCharacterProfile, "name" | "level" | "groupId" | "note">>) {
    const nextProfiles = profiles.map((profile) => {
      if (profile.id !== profileId) return profile;

      const groupId = patch.groupId ?? profile.groupId;
      return {
        ...profile,
        ...patch,
        groupId,
        groupLabel: PERSONAL_DATA_GROUPS[groupId],
        level: patch.level === undefined ? profile.level : clampLevel(patch.level),
        name: patch.name === undefined ? profile.name : patch.name,
        note: patch.note === undefined ? profile.note : patch.note,
      };
    });

    setProfiles(nextProfiles);
    writePersonalDataProfiles(nextProfiles);
  }

  function resetProfiles() {
    if (!window.confirm("Reset Personal Data to the seeded character list?")) return;

    resetPersonalDataProfiles();
    setProfiles(readPersonalDataProfiles());
    setNotice("Personal Data reset to seed.");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-emerald-300 sm:text-4xl">Personal Data</h1>
            <p className="mt-1 text-sm text-slate-400">Shared character profile editor</p>
            <p className="mt-1 text-xs text-slate-600">Name, level, group and note are reused by local tracker pages.</p>
          </div>

          <div className="flex w-full flex-col gap-2 lg:w-auto lg:items-end">
            <nav className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 lg:w-auto">
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
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-200"
                href="/water-dungeon"
              >
                Water
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-emerald-500/50 bg-emerald-950/45 px-4 py-2 text-sm font-bold text-emerald-100"
                href="/personal-data"
              >
                Personal
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
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-pink-500/40 hover:text-pink-200"
                href="/ogch/bishop"
              >
                Bishop
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-cyan-500/35 bg-cyan-950/25 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-950/45"
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

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard label="Total" value={summary.total.toString()} tone="emerald" />
          <SummaryCard label="Showing" value={summary.visible.toString()} tone="sky" />
          <SummaryCard label="Lv 240+" value={summary.lv240Plus.toString()} tone="violet" />
          <SummaryCard label="Lv 250" value={summary.lv250.toString()} tone="pink" />
          <SummaryCard label="Below 220" value={summary.lowLevel.toString()} tone="orange" />
        </section>

        <section className="mb-5 rounded-lg border border-slate-800 bg-slate-900/60 p-3 shadow-lg shadow-black/10">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_auto] xl:items-end">
            <label className="min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search
              <div className="mt-1 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-emerald-500"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Name, level, group, note"
                  type="search"
                  value={searchQuery}
                />
                <button
                  className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs font-bold normal-case tracking-normal text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!searchQuery}
                  onClick={() => setSearchQuery("")}
                  type="button"
                >
                  Clear
                </button>
              </div>
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Group
                <select
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-200 outline-none transition focus:border-emerald-500 sm:w-48"
                  onChange={(event) => setGroupFilter(event.target.value as GroupFilter)}
                  value={groupFilter}
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
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-200 outline-none transition focus:border-emerald-500 sm:w-48"
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  value={sort}
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

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Editing is stored in browser local data and broadcast to open tracker pages.
            </p>
            <button
              className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-950/45"
              onClick={resetProfiles}
              type="button"
            >
              Reset Personal Data
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {visibleProfiles.map((profile) => (
            <PersonalProfileCard key={profile.id} onUpdate={updateProfile} profile={profile} />
          ))}
        </section>

        {visibleProfiles.length === 0 ? (
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center text-sm font-semibold text-slate-500">
            No personal profiles match this filter.
          </div>
        ) : null}
      </div>
    </main>
  );
}

function PersonalProfileCard({
  onUpdate,
  profile,
}: {
  onUpdate: (
    profileId: string,
    patch: Partial<Pick<PersonalCharacterProfile, "name" | "level" | "groupId" | "note">>
  ) => void;
  profile: PersonalCharacterProfile;
}) {
  const characterImage = getCharacterImage(profile.id, profile.name);

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/65 p-3 shadow-lg shadow-black/10 transition hover:border-emerald-500/35">
      <div className="mb-3 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        {characterImage ? (
          <div
            aria-label={`${profile.name} portrait`}
            className="h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 shadow-inner shadow-black/30"
            role="img"
          >
            <Image
              alt=""
              className="h-full w-full object-contain"
              draggable={false}
              sizes="64px"
              src={characterImage}
              unoptimized
            />
          </div>
        ) : (
          <div
            aria-label={`${profile.name} portrait unavailable`}
            className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/50 font-mono text-xl font-black text-slate-600"
            role="img"
          >
            {profile.name.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-base font-bold text-slate-100">{profile.name}</p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            Lv.{profile.level} {profile.groupLabel}
          </p>
          {profile.aliases.length > 0 ? (
            <p className="mt-1 truncate text-[11px] font-semibold text-slate-600">
              Alias: {profile.aliases.join(", ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_112px]">
        <label className="min-w-0 text-xs font-bold uppercase tracking-wide text-slate-500">
          Name
          <input
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-100 outline-none transition focus:border-emerald-500"
            onChange={(event) => onUpdate(profile.id, { name: event.target.value })}
            value={profile.name}
          />
        </label>

        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Level
          <input
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm font-semibold normal-case tracking-normal text-slate-100 outline-none transition focus:border-emerald-500"
            inputMode="numeric"
            max={999}
            min={1}
            onChange={(event) => onUpdate(profile.id, { level: Number(event.target.value) })}
            type="number"
            value={profile.level}
          />
        </label>
      </div>

      <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
        Group
        <select
          className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-200 outline-none transition focus:border-emerald-500"
          onChange={(event) => onUpdate(profile.id, { groupId: event.target.value as PersonalDataGroupId })}
          value={profile.groupId}
        >
          {PERSONAL_DATA_GROUP_OPTIONS.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
        Note
        <input
          className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm normal-case tracking-normal text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-emerald-500"
          onChange={(event) => onUpdate(profile.id, { note: event.target.value.trim() || null })}
          placeholder="optional"
          value={profile.note ?? ""}
        />
      </label>
    </article>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "sky" | "violet" | "pink" | "orange";
}) {
  const toneClass = {
    emerald: "border-emerald-500/20 bg-emerald-950/20 text-emerald-100",
    sky: "border-sky-500/20 bg-sky-950/20 text-sky-100",
    violet: "border-violet-500/20 bg-violet-950/20 text-violet-100",
    pink: "border-pink-500/20 bg-pink-950/20 text-pink-100",
    orange: "border-orange-500/20 bg-orange-950/20 text-orange-100",
  }[tone];

  return (
    <div className={`min-w-0 rounded-lg border p-3 shadow-lg shadow-black/10 ${toneClass}`}>
      <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 truncate font-mono text-2xl font-black">{value}</p>
    </div>
  );
}
