import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  icon?: boolean;
  className?: string;
  /** "dark" for buttons placed on a .surface-dark background (Copilot, app shell). */
  tone?: "light" | "dark";
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  icon = false,
  className,
  tone = "light",
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current-400";

  const variantsLight: Record<string, string> = {
    primary:
      "bg-ink-900 text-paper-50 hover:bg-current-600 shadow-[0_0_0_1px_rgba(21,28,29,0.06)] hover:shadow-glow focus-visible:ring-offset-2 focus-visible:ring-offset-paper-50",
    secondary:
      "bg-transparent text-ink-900 border border-ink-900/15 hover:border-current-500/70 hover:bg-current-400/10",
    ghost: "bg-transparent text-ink-900 hover:text-current-600",
  };

  const variantsDark: Record<string, string> = {
    primary:
      "bg-current-400 text-graphite-950 hover:bg-current-300 shadow-[0_0_0_1px_rgba(58,187,194,0.40)] hover:shadow-glow-dark focus-visible:ring-offset-2 focus-visible:ring-offset-graphite-950",
    secondary:
      "bg-transparent text-offwhite-100 border border-white/15 hover:border-current-400/60 hover:bg-white/5",
    ghost: "bg-transparent text-offwhite-100 hover:text-current-300",
  };

  const variants = tone === "dark" ? variantsDark : variantsLight;

  const sizes: Record<string, string> = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
      {icon && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      )}
    </Link>
  );
}
