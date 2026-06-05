import type { ApiProgressToNextLevel } from "@/lib/ogch-types";

type OgchProgressBarProps = {
  ogchLevel: number;
  progress: ApiProgressToNextLevel;
};

export default function OgchProgressBar({ ogchLevel, progress }: OgchProgressBarProps) {
  const percent = Math.min(100, Math.max(0, progress.percentage));
  const label =
    ogchLevel >= 10 || progress.required === null
      ? "MAX LEVEL"
      : `${progress.current}/${progress.required} clears to next`;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400">Progress</span>
        <span className="font-mono text-xs font-bold text-violet-200">{label}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-950 ring-1 ring-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
