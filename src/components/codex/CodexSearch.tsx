import type {
  CodexEntryType,
  CodexFilter,
  ItemCategory,
  MonsterElement,
  MonsterRace,
  MonsterSize,
} from "@/lib/codex-types";

const ITEM_CATEGORIES: { value: ItemCategory | "all"; label: string }[] = [
  { value: "all", label: "All Items" },
  { value: "weapon", label: "Weapon" },
  { value: "armor", label: "Armor" },
  { value: "card", label: "Card" },
  { value: "consumable", label: "Consumable" },
  { value: "usable", label: "Usable" },
  { value: "ammo", label: "Ammo" },
  { value: "shadow", label: "Shadow" },
  { value: "etc", label: "Etc" },
];

const MONSTER_RACES: { value: MonsterRace | "all"; label: string }[] = [
  { value: "all", label: "All Races" },
  { value: "angel", label: "Angel" },
  { value: "brute", label: "Brute" },
  { value: "demihuman", label: "Demihuman" },
  { value: "demon", label: "Demon" },
  { value: "dragon", label: "Dragon" },
  { value: "fish", label: "Fish" },
  { value: "formless", label: "Formless" },
  { value: "insect", label: "Insect" },
  { value: "plant", label: "Plant" },
  { value: "undead", label: "Undead" },
];

const MONSTER_ELEMENTS: { value: MonsterElement | "all"; label: string }[] = [
  { value: "all", label: "All Elements" },
  { value: "neutral", label: "Neutral" },
  { value: "water", label: "Water" },
  { value: "earth", label: "Earth" },
  { value: "fire", label: "Fire" },
  { value: "wind", label: "Wind" },
  { value: "poison", label: "Poison" },
  { value: "holy", label: "Holy" },
  { value: "shadow", label: "Shadow" },
  { value: "ghost", label: "Ghost" },
  { value: "undead", label: "Undead" },
];

const MONSTER_SIZES: { value: MonsterSize | "all"; label: string }[] = [
  { value: "all", label: "All Sizes" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

type CodexSearchProps = {
  filter: CodexFilter;
  onChange: (filter: CodexFilter) => void;
  resultCount: number;
};

export default function CodexSearch({
  filter,
  onChange,
  resultCount,
}: CodexSearchProps) {
  const setTab = (tab: CodexEntryType) => {
    onChange({
      ...filter,
      tab,
      itemCategory: "all",
      monsterRace: "all",
      monsterElement: "all",
      monsterSize: "all",
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("item")}
            className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
              filter.tab === "item"
                ? "border-cyan-500/50 bg-cyan-950/45 text-cyan-100"
                : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200"
            }`}
          >
            Items
          </button>
          <button
            type="button"
            onClick={() => setTab("monster")}
            className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
              filter.tab === "monster"
                ? "border-violet-500/50 bg-violet-950/45 text-violet-100"
                : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-violet-500/40 hover:text-violet-200"
            }`}
          >
            Monsters
          </button>
        </div>
        <p className="text-sm text-slate-400">
          <span className="font-bold text-slate-100">{resultCount}</span>{" "}
          {filter.tab}s found
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={filter.query}
          onChange={(e) => onChange({ ...filter, query: e.target.value })}
          placeholder={`Search ${filter.tab} by name, effect, location...`}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filter.tab === "item" &&
          ITEM_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() =>
                onChange({ ...filter, itemCategory: cat.value as ItemCategory | "all" })
              }
              className={`rounded-md border px-3 py-1.5 text-xs font-bold transition ${
                filter.itemCategory === cat.value
                  ? "border-cyan-500/50 bg-cyan-950/45 text-cyan-100"
                  : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}

        {filter.tab === "monster" && (
          <>
            {MONSTER_RACES.map((race) => (
              <button
                key={race.value}
                type="button"
                onClick={() =>
                  onChange({ ...filter, monsterRace: race.value as MonsterRace | "all" })
                }
                className={`rounded-md border px-3 py-1.5 text-xs font-bold transition ${
                  filter.monsterRace === race.value
                    ? "border-violet-500/50 bg-violet-950/45 text-violet-100"
                    : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                {race.label}
              </button>
            ))}
            {MONSTER_ELEMENTS.map((el) => (
              <button
                key={el.value}
                type="button"
                onClick={() =>
                  onChange({
                    ...filter,
                    monsterElement: el.value as MonsterElement | "all",
                  })
                }
                className={`rounded-md border px-3 py-1.5 text-xs font-bold transition ${
                  filter.monsterElement === el.value
                    ? "border-violet-500/50 bg-violet-950/45 text-violet-100"
                    : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                {el.label}
              </button>
            ))}
            {MONSTER_SIZES.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() =>
                  onChange({ ...filter, monsterSize: size.value as MonsterSize | "all" })
                }
                className={`rounded-md border px-3 py-1.5 text-xs font-bold transition ${
                  filter.monsterSize === size.value
                    ? "border-violet-500/50 bg-violet-950/45 text-violet-100"
                    : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                {size.label}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
