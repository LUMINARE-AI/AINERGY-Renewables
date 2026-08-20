import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "font-mono-tag inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase",
        tone === "dark"
          ? "border-white/15 bg-white/5 text-offwhite-300/80"
          : "border-ink-900/12 bg-current-400/10 text-ink-700",
        className
      )}
    >
      {children}
    </span>
  );
}
