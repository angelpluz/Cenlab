import guide from "@/lib/generated/rune-tablet.json";

export const RUNE_TABLET = guide;
export type RuneSet = (typeof guide.sets)[number];
export type RuneMetric = RuneSet["metrics"][number];

export const RUNE_EPISODES = Array.from(new Set(guide.sets.map((set) => set.episode)));

export function filterRuneSets(query: string, episode: string): RuneSet[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);

  return guide.sets.filter((set) => {
    if (episode !== "all" && set.episode !== episode) return false;
    const searchable = [set.name, set.episode, set.playstyle, set.otherMaterials,
      set.summary, ...set.pieces].join(" ").toLocaleLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}

export function calculateRuneMetric(metric: RuneMetric, refinement: number): number {
  const level = Number.isFinite(refinement) ? Math.min(15, Math.max(0, Math.floor(refinement))) : 0;
  return metric.base + Math.floor(level / metric.step) * metric.perStep;
}
