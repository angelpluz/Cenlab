import type { OgchCooldownStatus } from "@/lib/ogch";
import { formatRemainingTime } from "@/lib/ogch";

type OgchCooldownBadgeProps = {
  status: OgchCooldownStatus;
  remainingSeconds: number;
};

const STATUS_LABELS: Record<OgchCooldownStatus, string> = {
  available: "Available",
  onCooldown: "On Cooldown",
  readySoon: "Ready Soon",
};

const STATUS_CLASSES: Record<OgchCooldownStatus, string> = {
  available: "border-emerald-500/40 bg-emerald-950/40 text-emerald-200",
  onCooldown: "border-orange-500/40 bg-orange-950/40 text-orange-200",
  readySoon: "border-cyan-500/40 bg-cyan-950/40 text-cyan-200",
};

export default function OgchCooldownBadge({ status, remainingSeconds }: OgchCooldownBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
      {status !== "available" ? (
        <span className="font-mono text-[10px] normal-case tracking-normal text-current/80">
          {formatRemainingTime(remainingSeconds)}
        </span>
      ) : null}
    </span>
  );
}
