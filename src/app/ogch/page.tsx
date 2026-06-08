import Link from "next/link";
import OgchNav from "@/components/ogch/OgchNav";

const JOB_PAGES = [
  {
    name: "Windhawk",
    href: "/ogch/windhawk",
    tone: "border-cyan-500/25 bg-cyan-950/20 text-cyan-100",
    summary: "Live OGCH tracker tied to the existing API roster.",
    detail: "12 tracked characters with cooldown, level, and reset controls.",
  },
  {
    name: "Bishop",
    href: "/ogch/bishop",
    tone: "border-emerald-500/25 bg-emerald-950/20 text-emerald-100",
    summary: "Separate round page for the added bishop lineup.",
    detail: "10 bishop characters, next scheduled run on 10/06/2026.",
  },
] as const;

export default function OgchPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-cyan-300 sm:text-4xl">OGCH Jobs</h1>
            <p className="mt-1 text-sm text-slate-400">Choose the roster page by job.</p>
          </div>
          <OgchNav active="overview" />
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {JOB_PAGES.map((job) => (
            <Link
              key={job.name}
              className={`rounded-2xl border p-5 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-cyan-400/45 ${job.tone}`}
              href={job.href}
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">OGCH Page</p>
              <h2 className="mt-3 text-2xl font-black">{job.name}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-200">{job.summary}</p>
              <p className="mt-3 text-sm text-slate-400">{job.detail}</p>
              <div className="mt-5 inline-flex items-center rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm font-bold text-slate-100">
                Open {job.name}
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
