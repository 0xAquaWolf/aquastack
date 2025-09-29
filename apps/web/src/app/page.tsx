"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-24 text-white">
      <section className="max-w-xl text-center">
        <h1 className="text-4xl font-semibold sm:text-5xl">Welcome to SelfVision Quest</h1>
        <p className="mt-4 text-base text-slate-300 sm:text-lg">
          Track your personal growth journey, stay motivated, and manage your tasks seamlessly.
        </p>
        <div className="mt-8 flex justify-center">
          {isPending ? (
            <span className="rounded-full bg-slate-800 px-8 py-3 text-sm font-medium text-slate-300">
              Checking your session…
            </span>
          ) : session ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Login
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
