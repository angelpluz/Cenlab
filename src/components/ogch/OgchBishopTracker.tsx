import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import bishop1Image from "@/char/bishop/b1.jpg";
import bishop2Image from "@/char/bishop/b2.jpg";
import bishop3Image from "@/char/bishop/b3.jpg";
import bishop4Image from "@/char/bishop/b4.jpg";
import bishop5Image from "@/char/bishop/b5.jpg";
import bishop6Image from "@/char/bishop/b6.jpg";
import bishop7Image from "@/char/bishop/b7.jpg";
import bishop8Image from "@/char/bishop/b8.jpg";
import bishop9Image from "@/char/bishop/b9.jpg";
import bishop10Image from "@/char/bishop/b10.jpg";

type BishopCharacter = {
  name: string;
  clearCount: number;
  imageSrc: StaticImageData;
};

const NEXT_RUN_DATE_LABEL = "10/06/2026";

const BISHOP_CHARACTERS: BishopCharacter[] = [
  { name: "CHRONOS", clearCount: 49, imageSrc: bishop1Image },
  { name: "MOLLOREENA", clearCount: 45, imageSrc: bishop2Image },
  { name: "KIMREI", clearCount: 38, imageSrc: bishop3Image },
  { name: "HAZELE", clearCount: 15, imageSrc: bishop4Image },
  { name: "ANDROMECHE", clearCount: 26, imageSrc: bishop5Image },
  { name: "FELISHAR", clearCount: 19, imageSrc: bishop6Image },
  { name: "KARELLA", clearCount: 18, imageSrc: bishop7Image },
  { name: "QUEENIGHT", clearCount: 15, imageSrc: bishop8Image },
  { name: "XENODICE", clearCount: 19, imageSrc: bishop9Image },
  { name: "PINAAYA", clearCount: 1, imageSrc: bishop10Image },
];

const totalRuns = BISHOP_CHARACTERS.reduce((sum, character) => sum + character.clearCount, 0);
const highestClearCharacter = [...BISHOP_CHARACTERS].sort((a, b) => b.clearCount - a.clearCount)[0];
const lowestClearCharacter = [...BISHOP_CHARACTERS].sort((a, b) => a.clearCount - b.clearCount)[0];

export default function OgchBishopTracker() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400/80">OGCH Side Page</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-cyan-300 sm:text-4xl">Bishop Rotation</h1>
            <p className="mt-1 text-sm text-slate-400">Separate roster for the added job lineup</p>
          </div>
          <nav className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
            <Link
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
              href="/cen-lab"
            >
              Cen Lab Timer
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-violet-500/40 hover:text-violet-200"
              href="/ogch"
            >
              OGCH Tracker
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-950/45 px-4 py-2 text-sm font-bold text-cyan-100"
              href="/ogch/bishop"
            >
              Bishop Rounds
            </Link>
          </nav>
        </header>

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Characters" value={BISHOP_CHARACTERS.length.toString()} tone="cyan" />
          <SummaryCard label="Total Rounds" value={totalRuns.toString()} tone="violet" />
          <SummaryCard
            label="Highest Count"
            value={highestClearCharacter.clearCount.toString()}
            detail={highestClearCharacter.name}
            tone="emerald"
          />
          <SummaryCard
            label="Next Run Date"
            value={NEXT_RUN_DATE_LABEL}
            detail="10 June 2026"
            tone="orange"
          />
        </section>

        <section className="mb-5 rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.86))] p-4 shadow-lg shadow-black/15">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-cyan-100">Run Snapshot</h2>
              <p className="mt-1 text-sm text-slate-300">
                Counts are locked from the latest update. The next scheduled OGCH entry for this bishop page is{" "}
                <span className="font-mono font-bold text-cyan-100">{NEXT_RUN_DATE_LABEL}</span>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <MiniStat label="Average" value={(totalRuns / BISHOP_CHARACTERS.length).toFixed(1)} />
              <MiniStat label="Top" value={`${highestClearCharacter.name} ${highestClearCharacter.clearCount}`} />
              <MiniStat label="Lowest" value={`${lowestClearCharacter.name} ${lowestClearCharacter.clearCount}`} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {BISHOP_CHARACTERS.map((character, index) => (
            <article
              key={character.name}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/65 shadow-lg shadow-black/10 transition hover:border-cyan-500/35"
            >
              <div className="flex gap-4 p-4">
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 shadow-inner shadow-black/30">
                  <Image
                    alt={`${character.name} portrait`}
                    className="h-full w-full object-cover"
                    draggable={false}
                    sizes="80px"
                    src={character.imageSrc}
                    unoptimized
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                        Bishop {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 break-words text-lg font-black text-slate-100">{character.name}</h2>
                    </div>
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-950/35 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-cyan-100">
                      Ready List
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-violet-500/20 bg-violet-950/25 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-violet-300">Rounds</p>
                      <p className="mt-1 font-mono text-2xl font-black text-violet-100">{character.clearCount}</p>
                    </div>
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-300">Next Entry</p>
                      <p className="mt-1 font-mono text-sm font-black text-cyan-100">{NEXT_RUN_DATE_LABEL}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/45 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Status</p>
                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      Scheduled for the next OGCH run on 10 June 2026
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail?: string;
  tone: "cyan" | "emerald" | "orange" | "violet";
}) {
  const toneClass = {
    cyan: "border-cyan-500/20 bg-cyan-950/20 text-cyan-100",
    emerald: "border-emerald-500/20 bg-emerald-950/20 text-emerald-100",
    orange: "border-orange-500/20 bg-orange-950/20 text-orange-100",
    violet: "border-violet-500/20 bg-violet-950/20 text-violet-100",
  }[tone];

  return (
    <div className={`min-w-0 rounded-xl border p-3 shadow-lg shadow-black/10 ${toneClass}`}>
      <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 truncate font-mono text-2xl font-black">{value}</p>
      {detail ? <p className="mt-1 truncate text-xs font-semibold text-slate-400">{detail}</p> : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-950/45 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-sm font-black text-slate-100">{value}</p>
    </div>
  );
}
