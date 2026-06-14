import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

type OgchNavProps = {
  active: "overview" | "windhawk" | "bishop" | "dancer";
};

const NAV_ITEMS = [
  { key: "overview", label: "OGCH Jobs", href: "/ogch" },
  { key: "windhawk", label: "Windhawk", href: "/ogch/windhawk" },
  { key: "bishop", label: "Bishop", href: "/ogch/bishop" },
  { key: "dancer", label: "Bard&Dancer", href: "/ogch/dancer" },
] as const;

export default function OgchNav({ active }: OgchNavProps) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
      <nav className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-7">
        <Link
          className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
          href="/cen-lab"
        >
          Cen Lab Timer
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-200"
          href="/water-dungeon"
        >
          Water
        </Link>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;

          return (
            <Link
              key={item.key}
              className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold transition ${
                isActive
                  ? "border-cyan-500/50 bg-cyan-950/45 text-cyan-100"
                  : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200"
              }`}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          className="inline-flex items-center justify-center rounded-lg border border-emerald-500/35 bg-emerald-950/25 px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-950/45"
          href="/cen-lab/calculator"
        >
          Public Timer
        </Link>
      </nav>
      <LogoutButton />
    </div>
  );
}
