import type { CodexItem } from "@/lib/codex-types";

const CATEGORY_COLORS: Record<CodexItem["category"], string> = {
  weapon: "border-rose-500/25 bg-rose-950/20 text-rose-100",
  armor: "border-sky-500/25 bg-sky-950/20 text-sky-100",
  card: "border-amber-500/25 bg-amber-950/20 text-amber-100",
  consumable: "border-emerald-500/25 bg-emerald-950/20 text-emerald-100",
  ammo: "border-orange-500/25 bg-orange-950/20 text-orange-100",
  usable: "border-cyan-500/25 bg-cyan-950/20 text-cyan-100",
  etc: "border-slate-500/25 bg-slate-950/20 text-slate-100",
  shadow: "border-violet-500/25 bg-violet-950/20 text-violet-100",
};

const SLOT_LABELS: Record<string, string> = {
  "head-top": "Head Top",
  "head-mid": "Head Mid",
  "head-low": "Head Low",
  armor: "Armor",
  shield: "Shield",
  garment: "Garment",
  shoes: "Shoes",
  accessory: "Accessory",
  weapon: "Weapon",
  ammo: "Ammo",
  card: "Card",
  none: "-",
};

type CodexItemCardProps = {
  item: CodexItem;
};

export default function CodexItemCard({ item }: CodexItemCardProps) {
  const tone = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.etc;

  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-lg shadow-black/10 ${tone}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {item.category}
            {item.slot && item.category !== "card" && (
              <span className="ml-2 text-slate-500">
                {SLOT_LABELS[item.slot] || item.slot}
              </span>
            )}
          </p>
          <h3 className="mt-1 text-lg font-black leading-tight">{item.name}</h3>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/40 text-lg">
          {item.category === "card" ? "🃏" : "🎒"}
        </div>
      </div>

      <p className="text-sm text-slate-300">{item.description}</p>

      {item.effects && item.effects.length > 0 && (
        <ul className="space-y-1">
          {item.effects.map((effect, idx) => (
            <li
              key={idx}
              className="text-sm font-semibold text-emerald-200"
            >
              • {effect}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-2 text-xs text-slate-400">
        {item.equipLevel !== undefined && (
          <span className="rounded-md border border-white/10 bg-slate-950/40 px-2 py-1">
            Lv. {item.equipLevel}
          </span>
        )}
        {item.weight !== undefined && (
          <span className="rounded-md border border-white/10 bg-slate-950/40 px-2 py-1">
            {item.weight} wt
          </span>
        )}
        {item.slots !== undefined && (
          <span className="rounded-md border border-white/10 bg-slate-950/40 px-2 py-1">
            {item.slots} slot{item.slots > 1 ? "s" : ""}
          </span>
        )}
        {item.refineable && (
          <span className="rounded-md border border-white/10 bg-slate-950/40 px-2 py-1 text-cyan-200">
            Refineable
          </span>
        )}
      </div>

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
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
