import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowUpRight, Star } from "lucide-react";
import type { Solution } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SolutionCard({
  solution,
  tone = "dark",
}: {
  solution: Solution;
  tone?: "light" | "dark";
}) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    solution.icon
  ];
  const href = solution.href ?? `/solutions/${solution.slug}`;
  const cta = solution.cta ?? "Explore";
  const light = tone === "light";

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium",
        light
          ? solution.featured
            ? "border-current-500/30 bg-gradient-to-br from-current-400/10 via-paper-50 to-paper-50 hover:border-current-500/50"
            : "border-ink-900/10 bg-paper-50 hover:border-current-500/30"
          : solution.featured
            ? "border-current-400/35 bg-gradient-to-br from-current-400/15 via-graphite-900 to-graphite-900 hover:border-current-400/55"
            : "border-white/10 bg-graphite-900/60 hover:border-current-400/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              light
                ? "bg-current-400/10 text-current-600"
                : "bg-current-400/10 text-current-300"
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          {solution.featured && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                light
                  ? "border-gold-500/30 bg-gold-500/10 text-gold-600"
                  : "border-gold-400/30 bg-gold-400/10 text-gold-300"
              )}
            >
              <Star className="h-3 w-3 fill-current" />
              Hero solution
            </span>
          )}
        </div>
        <ArrowUpRight
          className={cn(
            "h-4 w-4 shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
            light
              ? "text-ink-400 group-hover:text-current-600"
              : "text-ink-400 group-hover:text-current-300"
          )}
        />
      </div>

      <h3
        className={cn(
          "mt-6 font-display text-lg font-medium",
          light ? "text-ink-900" : "text-offwhite-100"
        )}
      >
        {solution.name}
      </h3>
      <p
        className={cn(
          "mt-2 text-sm font-medium leading-snug",
          light ? "text-current-600" : "text-current-300"
        )}
      >
        {solution.short}
      </p>
      <p
        className={cn(
          "mt-3 flex-1 text-sm leading-relaxed",
          light ? "text-ink-600" : "text-offwhite-100/65"
        )}
      >
        {solution.description}
      </p>
      <span
        className={cn(
          "mt-5 inline-flex items-center gap-1 text-sm font-medium transition-colors",
          light
            ? "text-current-600 group-hover:text-current-500"
            : "text-current-300 group-hover:text-current-200"
        )}
      >
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
