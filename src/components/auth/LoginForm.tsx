"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PUBLIC_CENLAB_CALCULATOR_PATH } from "@/lib/auth-constants";

type LoginFormProps = {
  nextPath: string;
};

export default function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Login failed.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Could not reach login route.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">Cen Lab</p>
            <h1 className="mt-3 text-3xl font-black text-slate-50">Sign In</h1>
            <p className="mt-2 text-sm text-slate-400">
              Protected pages require the configured username and password.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                autoComplete="username"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                onChange={(event) => setUsername(event.target.value)}
                required
                type="text"
                value={username}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/35 bg-rose-950/35 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:from-cyan-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-4 text-sm">
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/35 bg-cyan-950/25 px-4 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-950/45"
              href={PUBLIC_CENLAB_CALCULATOR_PATH}
            >
              Open Public Cen Lab Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
