"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [router, session]);

  const callbackURL = useMemo(() => {
    if (typeof window === "undefined") return "/dashboard";
    return `${window.location.origin}/dashboard`;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const credentials = {
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      if (mode === "signup") {
        const { error: signUpError } = await authClient.signUp.email({
          ...credentials,
          name: name.trim() || credentials.email.split("@")[0],
          image: `https://avatar.vercel.sh/${encodeURIComponent(credentials.email)}`,
          callbackURL,
        });

        if (signUpError) {
          throw signUpError;
        }
      }

      const { error: signInError } = await authClient.signIn.email({
        ...credentials,
        rememberMe: true,
        callbackURL,
      });

      if (signInError) {
        throw signInError;
      }

      router.replace("/dashboard");
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: string }).message)
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignUp = mode === "signup";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {isSignUp ? "Create your account" : "Sign in to continue"}
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 transition hover:text-slate-200"
          >
            ← Back
          </Link>
        </div>

        <div className="mb-6 flex gap-2 rounded-full bg-slate-800 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-full px-4 py-2 transition ${isSignUp ? "text-slate-300" : "bg-white text-slate-950"
              }`}
            disabled={!isSignUp}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full px-4 py-2 transition ${isSignUp ? "bg-white text-slate-950" : "text-slate-300"
              }`}
            disabled={isSignUp}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                placeholder="John Doe"
                autoComplete="name"
                required={false}
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              placeholder="••••••••"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-rose-400">{error}</p>
          )}

          <button
            type="submit"
            aria-live="polite"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Processing…" : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
