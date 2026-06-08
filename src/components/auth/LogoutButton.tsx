"use client";

import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className={
        className ??
        "inline-flex items-center justify-center rounded-lg border border-rose-500/35 bg-rose-950/30 px-4 py-2 text-sm font-bold text-rose-100 transition hover:bg-rose-950/55"
      }
      onClick={handleLogout}
      type="button"
    >
      Logout
    </button>
  );
}
