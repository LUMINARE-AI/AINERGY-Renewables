import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Insight } from "@/lib/data";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-ink-900/10 bg-paper-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-current-500/30 hover:shadow-premium"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono-tag text-[11px] uppercase text-current-600">
          {insight.category}
        </span>
        <ArrowUpRight className="h-4 w-4 text-ink-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-current-600" />
      </div>
      <h3 className="mt-4 font-display text-lg font-medium leading-snug text-ink-900">
        {insight.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
        {insight.excerpt}
      </p>
      <p className="mt-5 text-xs text-ink-500">{insight.readTime}</p>
    </Link>
  );
}
