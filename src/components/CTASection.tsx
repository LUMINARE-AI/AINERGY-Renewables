import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function CTASection({
  eyebrow = "Get Started",
  title,
  description,
  primaryLabel = "Build My Energy Plan",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-graphite-950 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent" />
      <div className="noise-overlay" />
      <Container className="relative text-center">
        <span className="font-mono-tag text-xs uppercase text-teal-400">
          {eyebrow}
        </span>
        <h2 className="text-balance mx-auto mt-5 max-w-3xl font-display text-3xl font-medium leading-[1.15] text-offwhite-100 sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-balance mx-auto mt-6 max-w-xl text-lg leading-relaxed text-offwhite-300/70">
          {description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={primaryHref}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-medium text-graphite-950 transition-all hover:bg-emerald-400 hover:shadow-glow"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-offwhite-100 transition-colors hover:border-teal-400/50 hover:bg-white/5"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
