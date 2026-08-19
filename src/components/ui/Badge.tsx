import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono-tag inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase text-offwhite-300/80",
        className
      )}
    >
      {children}
    </span>
  );
}
