"use client";

import Image from "next/image";
import OgchCooldownBadge from "@/components/ogch/OgchCooldownBadge";
import { getCharacterImage } from "@/lib/character-images";
import {
  formatBangkokDateTime,
  getLiveCooldownStatus,
  getRemainingCooldownSeconds,
} from "@/lib/ogch";
import type { SakrayCharacter, SakrayRole } from "@/lib/sakray-types";

export type SakrayPartyLink = {
  id: string;
  name: string;
  role: SakrayRole;
};

type SakrayCharacterCardProps = {
  character: SakrayCharacter;
  isMutating: boolean;
  isPartyReady: boolean;
  nowMs: number;
  onComplete: (character: SakrayCharacter) => void;
  onManageMapping?: (character: SakrayCharacter) => void;
  onManualEdit: (character: SakrayCharacter) => void;
  onNavigateParty: (member: SakrayPartyLink) => void;
  onResetCooldown: (character: SakrayCharacter) => void;
  partyLinks: SakrayPartyLink[];
};

export default function SakrayCharacterCard({
  character,
  isMutating,
  isPartyReady,
  nowMs,
  onComplete,
  onManageMapping,
  onManualEdit,
  onNavigateParty,
  onResetCooldown,
  partyLinks,
}: SakrayCharacterCardProps) {
  const now = new Date(nowMs);
  const cooldownStatus = getLiveCooldownStatus(character.nextAvailableAt, character.cooldownStatus, now);
  const remainingSeconds = character.nextAvailableAt
    ? getRemainingCooldownSeconds(character.nextAvailableAt, now)
    : character.remainingCooldownSeconds;
  const characterImage = getCharacterImage(character.id, character.name);
  const canComplete = cooldownStatus === "available" && isPartyReady && !isMutating;
  const partyLabel = character.role === "windhawk" ? "Mapped Bishop / Cardinal" : "Mapped Windhawk";

  return (
    <article
      className="scroll-mt-5 rounded-xl border border-slate-800 bg-slate-900/70 p-3 shadow-lg shadow-black/10 transition hover:border-pink-500/35 target:border-pink-400/70 target:ring-2 target:ring-pink-400/20"
      id={`sakray-character-${character.id}`}
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
        <div className="rounded-lg border border-pink-500/20 bg-pink-950/20 p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-pink-300">Sakray Runs</p>
          <p className="mt-1 font-mono text-2xl font-black text-pink-100">{character.clearCount}</p>
        </div>
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-300">Reset Rule</p>
          <p className="mt-1 font-mono text-lg font-black text-cyan-100">04:00 BKK</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-sky-500/20 bg-sky-950/15 p-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-sky-300">{partyLabel}</p>
          {onManageMapping ? (
            <button
              className="rounded-md border border-sky-500/35 bg-sky-950/35 px-2 py-1 text-[11px] font-bold text-sky-100 transition hover:bg-sky-900/35 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isMutating}
              onClick={() => onManageMapping(character)}
              type="button"
            >
              {partyLinks.length ? "Edit Mapping" : "Add Mapping"}
            </button>
          ) : null}
        </div>
        {partyLinks.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {partyLinks.map((member) => (
              <button
                className="rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-sky-100"
                key={`${member.role}:${member.id}`}
                onClick={() => onNavigateParty(member)}
                type="button"
              >
                {member.role === "bishop" ? "Bishop" : "Windhawk"}: {member.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500">
            {character.role === "windhawk" ? "ยังไม่ได้เลือก Bishop / Cardinal" : "ยังไม่มี Windhawk ที่ map ไว้"}
          </p>
        )}
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
          className="rounded-lg bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600 px-3 py-2 text-sm font-black text-white shadow-lg shadow-pink-950/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35 sm:col-span-3"
          disabled={!canComplete}
          onClick={() => onComplete(character)}
          type="button"
        >
          {isMutating
            ? "Saving..."
            : !isPartyReady
              ? "Mapped Bishop on Cooldown"
              : "Complete Sakray Run"}
        </button>
        <button
          className="rounded-lg border border-violet-500/35 bg-violet-950/30 px-3 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-900/30 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2"
          disabled={isMutating}
          onClick={() => onManualEdit(character)}
          type="button"
        >
          Manual Edit
        </button>
        <button
          className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-950/45 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isMutating || !character.nextAvailableAt}
          onClick={() => onResetCooldown(character)}
          type="button"
        >
          Reset Cooldown
        </button>
      </div>
    </article>
  );
}
