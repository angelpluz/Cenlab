import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

const NAV_ITEMS = [
  { label: "Cen Lab Timer", href: "/cen-lab", tone: "hover:border-cyan-500/40 hover:text-cyan-200" },
  { label: "Water", href: "/water-dungeon", tone: "hover:border-sky-500/40 hover:text-sky-200" },
  { label: "ดันรายวัน", href: "/daily-dungeon", tone: "hover:border-amber-500/40 hover:text-amber-200" },
  { label: "Personal", href: "/personal-data", tone: "hover:border-emerald-500/40 hover:text-emerald-200" },
  { label: "EXP", href: "/exp", tone: "hover:border-amber-500/40 hover:text-amber-200" },
  { label: "Stat", href: "/stat-calculator", tone: "hover:border-cyan-500/40 hover:text-cyan-200" },
  { label: "Codex", href: "/codex", tone: "hover:border-violet-500/40 hover:text-violet-200" },
  { label: "Event Issgard", href: "/event-issgard", tone: "hover:border-amber-500/40 hover:text-amber-200" },
  { label: "OGCH Jobs", href: "/ogch", tone: "hover:border-cyan-500/40 hover:text-cyan-200" },
  { label: "Public Timer", href: "/cen-lab/calculator", tone: "hover:border-emerald-500/40 hover:text-emerald-200" },
] as const;

export default function SakrayNav() {
  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:items-end">
      <nav className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-5 xl:w-auto xl:grid-cols-10">
        {NAV_ITEMS.slice(0, 3).map((item) => (
          <Link
            className={`inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition ${item.tone}`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
        <Link
          className="inline-flex items-center justify-center rounded-lg border border-pink-500/55 bg-pink-950/40 px-4 py-2 text-sm font-black text-pink-100"
          href="/sakray"
        >
          ดัน Sakray
        </Link>
        {NAV_ITEMS.slice(3).map((item) => (
          <Link
            className={`inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition ${item.tone}`}
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
