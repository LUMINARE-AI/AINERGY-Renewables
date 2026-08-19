import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
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
        <span className="font-mono-tag mb-4 inline-block text-xs uppercase text-teal-400">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance font-display text-3xl font-medium leading-[1.15] text-offwhite-100 sm:text-4xl lg:text-[2.75rem]",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-balance text-lg leading-relaxed text-offwhite-300/70">
          {description}
        </p>
      )}
    </div>
  );
}
