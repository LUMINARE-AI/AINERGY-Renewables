import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "font-mono-tag mb-4 inline-block text-xs uppercase",
            tone === "dark" ? "text-current-300" : "text-current-600"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance font-display text-3xl font-medium leading-[1.15] sm:text-4xl lg:text-[2.75rem]",
          tone === "dark" ? "text-offwhite-100" : "text-ink-900",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-balance text-lg leading-relaxed",
            tone === "dark" ? "text-offwhite-300/70" : "text-ink-700/85"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
