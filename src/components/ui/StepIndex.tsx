import { cn } from "@/lib/utils";

export function StepIndex({
  n,
  size = "md",
}: {
  n: number | string;
  size?: "sm" | "md";
}) {
  const value = typeof n === "number" ? n : Number(n);
  const label = Number.isFinite(value) ? String(value).padStart(2, "0") : String(n);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-current-500/25 bg-current-400/10 font-mono-tag font-semibold text-current-700",
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-[11px]"
      )}
    >
      {label}
    </span>
  );
}
