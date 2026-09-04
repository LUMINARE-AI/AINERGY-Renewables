import * as Icons from "lucide-react";
import type { InfrastructureService } from "@/lib/data";

export function InfrastructureServiceCard({
  service,
}: {
  service: InfrastructureService;
}) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    service.icon
  ];

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-ink-900/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-current-500/30 hover:shadow-premium">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-current-400/10 text-current-600 transition-colors group-hover:bg-current-400/15">
        {Icon && <Icon className="h-5 w-5" strokeWidth={1.75} />}
      </div>
      <h3 className="mt-6 font-display text-lg font-medium text-ink-900">
        {service.name}
      </h3>
      <p className="mt-2 text-sm font-medium leading-snug text-current-600">
        {service.short}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
        {service.description}
      </p>
      <p className="mt-5 border-t border-ink-900/8 pt-4 text-xs font-medium leading-relaxed tracking-wide text-ink-500">
        {service.capabilities}
      </p>
    </div>
  );
}
