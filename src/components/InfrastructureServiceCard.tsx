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
    <div className="group h-full rounded-2xl border border-ink-900/10 bg-paper-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-current-500/30 hover:shadow-premium">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-current-400/10 text-current-600 transition-colors group-hover:bg-current-400/15">
        {Icon && <Icon className="h-5 w-5" strokeWidth={1.75} />}
      </div>
      <h3 className="mt-6 font-display text-lg font-medium text-ink-900">
        {service.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        {service.description}
      </p>
    </div>
  );
}
