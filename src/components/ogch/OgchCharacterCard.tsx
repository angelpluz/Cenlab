"use client";

import Image from "next/image";
import Link from "next/link";
import type { OgchCharacterProgress } from "@/lib/ogch-types";
import type { OgchPartyLinkDisplay } from "@/lib/ogch-static-rosters";
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
  onManageParty?: (character: OgchCharacterProgress) => void;
  onResetCooldown: (character: OgchCharacterProgress) => void;
  partyLabel?: string;
  partyMembers?: OgchPartyLinkDisplay[];
};

export default function OgchCharacterCard({
  character,
  nowMs,
  isMutating,
  onComplete,
  onManualEdit,
  onManageParty,
  onResetCooldown,
  partyLabel = "Party Members",
  partyMembers = [],
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
    <article
      className="scroll-mt-4 rounded-xl border border-slate-800 bg-slate-900/65 p-3 shadow-lg shadow-black/10 transition hover:border-cyan-500/40 target:border-sky-400/70 target:ring-2 target:ring-sky-400/20"
      id={`ogch-character-${character.id}`}
    >
      <div className="mb-3 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        {characterImage ? (
          <div
            aria-label={`${character.name} portrait`}
            className="row-span-2 h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 shadow-inner shadow-black/30 sm:row-span-1"
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
            className="row-span-2 flex h-20 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/50 font-mono text-xl font-black text-slate-600 sm:row-span-1"
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
        <div className="col-start-2 shrink-0 justify-self-start sm:col-start-auto sm:justify-self-end">
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

      {onManageParty || partyMembers.length > 0 ? (
        <div className="mt-3 rounded-lg border border-sky-500/20 bg-sky-950/15 p-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-sky-300">{partyLabel}</p>
            {onManageParty ? (
              <button
                onClick={() => onManageParty(character)}
                disabled={isMutating}
                className="rounded-md border border-sky-500/35 bg-sky-950/35 px-2 py-1 text-[11px] font-bold text-sky-100 transition hover:bg-sky-900/35 disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
              >
                {partyMembers.length > 0 ? "Edit Party" : "Add Party"}
              </button>
            ) : null}
          </div>
          {partyMembers.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {partyMembers.map((member) => {
                const className =
                  "rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-sky-100";
                const label = `${member.jobLabel}: ${member.name}`;

                return member.href ? (
                  <Link className={className} href={member.href} key={member.key}>
                    {label}
                  </Link>
                ) : (
                  <span className={className} key={member.key}>
                    {label}
                  </span>
                );
              })}
            </div>
          ) : onManageParty ? (
            <p className="mt-2 text-xs text-slate-500">No bishop or bard selected.</p>
          ) : null}
        </div>
      ) : null}

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
