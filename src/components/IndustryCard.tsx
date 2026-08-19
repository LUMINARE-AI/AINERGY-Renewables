import * as Icons from "lucide-react";
import type { Industry } from "@/lib/data";

export function IndustryCard({ industry }: { industry: Industry }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    industry.icon
  ];
  return (
    <div className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-graphite-900/40 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/30 hover:bg-graphite-900">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-offwhite-200 transition-colors group-hover:bg-teal-400/10 group-hover:text-teal-300">
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <span className="text-sm font-medium text-offwhite-200/90">
        {industry.name}
      </span>
    </div>
  );
}
