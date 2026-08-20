import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { Solution } from "@/lib/data";

export function SolutionCard({ solution }: { solution: Solution }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    solution.icon
  ];

  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="group relative flex h-full flex-col rounded-2xl border border-ink-900/10 bg-paper-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-current-500/30 hover:shadow-premium"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-current-400/10 text-current-600">
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-current-600" />
      </div>
      <h3 className="mt-6 font-display text-lg font-medium text-ink-900">
        {solution.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        {solution.short}
      </p>
    </Link>
  );
}
