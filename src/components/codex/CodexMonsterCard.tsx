import type { CodexMonster } from "@/lib/codex-types";
import { formatNumber } from "@/lib/codex-utils";

const RACE_COLORS: Record<CodexMonster["race"], string> = {
  angel: "border-amber-500/25 bg-amber-950/20 text-amber-100",
  brute: "border-orange-500/25 bg-orange-950/20 text-orange-100",
  demihuman: "border-cyan-500/25 bg-cyan-950/20 text-cyan-100",
  demon: "border-rose-500/25 bg-rose-950/20 text-rose-100",
  dragon: "border-violet-500/25 bg-violet-950/20 text-violet-100",
  fish: "border-sky-500/25 bg-sky-950/20 text-sky-100",
  formless: "border-slate-500/25 bg-slate-950/20 text-slate-100",
  insect: "border-emerald-500/25 bg-emerald-950/20 text-emerald-100",
  plant: "border-green-500/25 bg-green-950/20 text-green-100",
  undead: "border-purple-500/25 bg-purple-950/20 text-purple-100",
};

const ELEMENT_COLORS: Record<CodexMonster["element"], string> = {
  neutral: "bg-slate-700 text-slate-100",
  water: "bg-sky-700 text-sky-100",
  earth: "bg-emerald-700 text-emerald-100",
  fire: "bg-rose-700 text-rose-100",
  wind: "bg-teal-700 text-teal-100",
  poison: "bg-purple-700 text-purple-100",
  holy: "bg-amber-700 text-amber-100",
  shadow: "bg-indigo-700 text-indigo-100",
  ghost: "bg-cyan-700 text-cyan-100",
  undead: "bg-fuchsia-700 text-fuchsia-100",
};

type CodexMonsterCardProps = {
  monster: CodexMonster;
};

export default function CodexMonsterCard({ monster }: CodexMonsterCardProps) {
  const tone = RACE_COLORS[monster.race] || RACE_COLORS.formless;
  const elementLabel = `${monster.element} ${monster.elementLevel ? `Lv.${monster.elementLevel}` : ""}`.trim();

  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-lg shadow-black/10 ${tone}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {monster.race}
            <span className="ml-2 text-slate-500">{monster.size}</span>
          </p>
          <h3 className="mt-1 text-lg font-black leading-tight">
            {monster.name}
          </h3>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/40 text-lg">
          {monster.isMvp ? "👑" : monster.isMiniBoss ? "⚔️" : "👹"}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-bold ${ELEMENT_COLORS[monster.element]}`}
        >
          {elementLabel}
        </span>
        <span className="rounded-md border border-white/10 bg-slate-950/40 px-2 py-0.5 text-xs font-bold text-slate-300">
          Lv. {monster.level}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-white/10 bg-slate-950/40 p-2">
          <p className="text-slate-500">HP</p>
          <p className="font-bold text-slate-100">{formatNumber(monster.hp)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/40 p-2">
          <p className="text-slate-500">Base EXP</p>
          <p className="font-bold text-slate-100">
            {formatNumber(monster.baseExp)}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/40 p-2">
          <p className="text-slate-500">Job EXP</p>
          <p className="font-bold text-slate-100">
            {formatNumber(monster.jobExp)}
          </p>
        </div>
      </div>

      {monster.drops && monster.drops.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Drops
          </p>
          <ul className="mt-1 space-y-0.5">
            {monster.drops.map((drop) => (
              <li
                key={drop.itemId}
                className="text-sm text-slate-200"
              >
                • {drop.itemName}
                {drop.rate && (
                  <span className="ml-1 text-xs text-slate-500">
                    ({drop.rate})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {monster.locations && monster.locations.length > 0 && (
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Location:</span>{" "}
          {monster.locations.join(", ")}
        </p>
      )}

      {monster.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {monster.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-slate-950/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
