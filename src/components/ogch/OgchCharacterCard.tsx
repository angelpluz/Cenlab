"use client";

import Image from "next/image";
import type { OgchCharacterProgress } from "@/lib/ogch-types";
import { formatBangkokDateTime, formatExp, getLiveCooldownStatus, getRemainingCooldownSeconds } from "@/lib/ogch";
import { getCharacterImage } from "@/lib/character-images";
import OgchCooldownBadge from "@/components/ogch/OgchCooldownBadge";
import OgchProgressBar from "@/components/ogch/OgchProgressBar";

type OgchCharacterCardProps = {
  character: OgchCharacterProgress;
  nowMs: number;
  isMutating: boolean;
  onComplete: (character: OgchCharacterProgress) => void;
  onManualEdit: (character: OgchCharacterProgress) => void;
  onResetCooldown: (character: OgchCharacterProgress) => void;
};

export default function OgchCharacterCard({
  character,
  nowMs,
  isMutating,
  onComplete,
  onManualEdit,
  onResetCooldown,
}: OgchCharacterCardProps) {
  const now = new Date(nowMs);
  const cooldownStatus = getLiveCooldownStatus(character.nextAvailableAt, character.cooldownStatus, now);
  const remainingSeconds =
    character.nextAvailableAt === null
      ? character.remainingCooldownSeconds
      : getRemainingCooldownSeconds(character.nextAvailableAt, now);
  const canComplete = cooldownStatus === "available" && !isMutating;
  const characterImage = getCharacterImage(character.id, character.name);

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/65 p-3 shadow-lg shadow-black/10 transition hover:border-cyan-500/40">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {characterImage ? (
            <div
              aria-label={`${character.name} portrait`}
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
              aria-label={`${character.name} portrait unavailable`}
              className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/50 font-mono text-xl font-black text-slate-600"
              role="img"
            >
              {character.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-100">{character.name}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              Lv.{character.baseLevel} {character.job}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <OgchCooldownBadge status={cooldownStatus} remainingSeconds={remainingSeconds} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-400">OGCH Level</p>
          <p className="mt-1 font-mono text-2xl font-black text-cyan-100">{character.ogchLevel}</p>
        </div>
        <div className="rounded-lg border border-violet-500/20 bg-violet-950/20 p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-violet-400">Clear Count</p>
          <p className="mt-1 font-mono text-2xl font-black text-violet-100">{character.clearCount}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-slate-800/80 bg-slate-950/45 p-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-pink-300">Current EXP Reward</p>
        <p className="mt-1 font-mono text-lg font-black text-pink-100">{formatExp(character.expReward)}</p>
      </div>

      <div className="mt-3">
        <OgchProgressBar ogchLevel={character.ogchLevel} progress={character.progressToNextLevel} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-2">
          <p className="text-slate-500">Last Completed</p>
          <p className="mt-1 min-h-[18px] font-mono text-slate-200">
            {formatBangkokDateTime(character.lastCompletedAt)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-2">
          <p className="text-slate-500">Next Available</p>
          <p className="mt-1 min-h-[18px] font-mono text-slate-200">
            {formatBangkokDateTime(character.nextAvailableAt)}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          onClick={() => onComplete(character)}
          disabled={!canComplete}
          className="rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 px-3 py-2 text-sm font-black text-white shadow-lg shadow-cyan-950/20 transition hover:from-cyan-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-35 sm:col-span-3"
        >
          {isMutating ? "Saving..." : "Complete OGCH Run"}
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
          disabled={isMutating || !character.nextAvailableAt}
          className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-950/45 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset Cooldown
        </button>
      </div>
    </article>
  );
}
