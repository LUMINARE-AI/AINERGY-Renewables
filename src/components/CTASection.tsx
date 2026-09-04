import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function CTASection({
  title,
  primaryLabel = "Build My Energy Plan",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-y border-current-600/40 bg-current-500">
      <svg
        className="pointer-events-none absolute -right-6 top-1/2 h-[130%] w-auto -translate-y-1/2 text-white/10 sm:right-0 lg:right-10"
        viewBox="0 0 320 320"
        fill="none"
        aria-hidden
      >
        <circle cx="160" cy="160" r="118" stroke="currentColor" strokeWidth="22" />
        <circle cx="160" cy="160" r="72" stroke="currentColor" strokeWidth="22" />
        <circle cx="160" cy="160" r="28" fill="currentColor" opacity="0.55" />
        <path
          d="M160 42v48M160 230v48M42 160h48M230 160h48"
          stroke="currentColor"
          strokeWidth="18"
          strokeLinecap="round"
        />
      </svg>

      <Container className="relative py-12 sm:py-14 lg:py-16">
        <div className="max-w-xl lg:max-w-2xl">
          <h2 className="text-balance font-display text-xl font-medium leading-[1.2] tracking-tight text-paper-50 sm:text-2xl lg:text-[1.85rem]">
            {title}
          </h2>
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
            <Link
              href={primaryHref}
              target={primaryHref.startsWith("http") ? "_blank" : undefined}
              rel={
                primaryHref.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-paper-50 px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-white"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                target={secondaryHref.startsWith("http") ? "_blank" : undefined}
                rel={
                  secondaryHref.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-paper-50 transition-colors hover:bg-white/20"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
