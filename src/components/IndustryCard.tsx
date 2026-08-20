import * as Icons from "lucide-react";
import type { Industry } from "@/lib/data";

export function IndustryCard({ industry }: { industry: Industry }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    industry.icon
  ];
  return (
    <div className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-900/10 bg-paper-50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-current-500/30 hover:shadow-premium">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900/5 text-ink-700 transition-colors group-hover:bg-current-400/15 group-hover:text-current-600">
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <span className="text-sm font-medium text-ink-800">
        {industry.name}
      </span>
    </div>
  );
}
