import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

const NAV_ITEMS = [
  { label: "Cen Lab Timer", href: "/cen-lab", tone: "hover:border-cyan-500/40 hover:text-cyan-200" },
  { label: "Water", href: "/water-dungeon", tone: "hover:border-sky-500/40 hover:text-sky-200" },
  { label: "ดันรายวัน", href: "/daily-dungeon", tone: "hover:border-amber-500/40 hover:text-amber-200" },
  { label: "ดัน Sakray", href: "/sakray", tone: "hover:border-pink-500/40 hover:text-pink-200" },
  { label: "สองดัน", href: "/two-dungeons", tone: "hover:border-pink-500/40 hover:text-pink-200" },
  { label: "Personal", href: "/personal-data", tone: "hover:border-emerald-500/40 hover:text-emerald-200" },
  { label: "EXP", href: "/exp", tone: "hover:border-amber-500/40 hover:text-amber-200" },
  { label: "Stat", href: "/stat-calculator", tone: "hover:border-cyan-500/40 hover:text-cyan-200" },
  { label: "Codex", href: "/codex", tone: "hover:border-violet-500/40 hover:text-violet-200" },
  { label: "Rune Tablet", href: "/rune-tablet", tone: "hover:border-violet-500/40 hover:text-violet-200" },
  { label: "Event Issgard", href: "/event-issgard", tone: "hover:border-amber-500/40 hover:text-amber-200" },
  { label: "OGCH Jobs", href: "/ogch", tone: "hover:border-cyan-500/40 hover:text-cyan-200" },
  { label: "Public Timer", href: "/cen-lab/calculator", tone: "hover:border-emerald-500/40 hover:text-emerald-200" },
] as const;

export default function SakrayNav({ active = "sakray" }: { active?: "sakray" | "two-dungeons" }) {
  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:max-w-[1100px] lg:items-end">
      <nav aria-label="เมนูหลัก" className="flex w-full flex-wrap gap-2 lg:justify-end">
        {NAV_ITEMS.map((item) => (
          <Link
            aria-current={item.href === `/${active}` ? "page" : undefined}
            className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold transition ${item.href === `/${active}` ? "border-pink-500/55 bg-pink-950/40 text-pink-100" : `border-slate-700 bg-slate-950/60 text-slate-300 ${item.tone}`}`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <LogoutButton />
    </div>
  );
}
