import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Insight } from "@/lib/data";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-graphite-900/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/30"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono-tag text-[11px] uppercase text-teal-400">
          {insight.category}
        </span>
        <ArrowUpRight className="h-4 w-4 text-offwhite-300/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-300" />
      </div>
      <h3 className="mt-4 font-display text-lg font-medium leading-snug text-offwhite-100">
        {insight.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-offwhite-300/60">
        {insight.excerpt}
      </p>
      <p className="mt-5 text-xs text-offwhite-300/40">{insight.readTime}</p>
    </Link>
  );
}
