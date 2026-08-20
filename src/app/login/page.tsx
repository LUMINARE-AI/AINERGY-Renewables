"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";

const fieldClass =
  "w-full rounded-xl border border-ink-900/15 bg-paper-100/60 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-current-500/60 focus:outline-none";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setSubmitting(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <section className="relative overflow-hidden bg-paper-50 py-36 lg:py-44">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <Container className="relative max-w-md">
        <h1 className="font-display text-3xl font-medium text-ink-900">Sign in</h1>
        <p className="mt-2 text-sm text-ink-600">
          Access your Open Access analysis dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-ink-700">
              Email
            </label>
            <input id="email" name="email" type="email" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-ink-700">
              Password
            </label>
            <input id="password" name="password" type="password" required className={fieldClass} />
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-current-600 hover:text-current-700">
            Create one
          </Link>
        </p>
      </Container>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
