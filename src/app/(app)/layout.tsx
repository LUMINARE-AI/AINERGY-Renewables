import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { requireSession } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/SignOutButton";

const IN_APP_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Facilities", href: "/facilities" },
  { label: "Settings", href: "/settings" },
];

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <div className="surface-dark min-h-screen bg-graphite-950 pt-20">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-graphite-950/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-offwhite-100">
                AINERGY
              </span>
              <span className="font-mono-tag rounded-full border border-current-400/30 bg-current-400/10 px-2 py-0.5 text-[10px] text-current-300">
                Analysis
              </span>
            </Link>
            <nav className="hidden items-center gap-6 sm:flex">
              {IN_APP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-offwhite-300/70 transition-colors hover:text-offwhite-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-offwhite-300/60">
            <span className="hidden sm:inline">{session.user.email}</span>
            <span className="hidden h-4 w-px bg-white/10 sm:inline-block" aria-hidden="true" />
            <SignOutButton />
          </div>
        </Container>
      </div>
      {children}
    </div>
  );
}
