"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@svq/convex";
export { authClient } from '@/lib/auth-client'

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const tasks = useQuery(api.tasks.get);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <span className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-slate-300">
          Loading your dashboard…
        </span>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Task Dashboard</h1>
            <p className="text-sm text-slate-300">
              Signed in as {session?.user?.email ?? "your account"}
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <h2 className="text-lg font-semibold">Task List</h2>
          <p className="mt-1 text-sm text-slate-400">
            Here are all the tasks currently stored in your workspace.
          </p>
          <div className="mt-6 space-y-3">
            {tasks?.length ? (
              tasks.map(({ _id, text }) => (
                <article
                  key={_id}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200"
                >
                  {text}
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 px-4 py-16 text-center text-sm text-slate-400">
                No tasks found yet. Create your first task from the mobile or web apps.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
