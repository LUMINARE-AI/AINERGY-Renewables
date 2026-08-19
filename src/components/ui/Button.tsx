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
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  icon = false,
  className,
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-graphite-950";

  const variants: Record<string, string> = {
    primary:
      "bg-emerald-500 text-graphite-950 hover:bg-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.4)] hover:shadow-glow",
    secondary:
      "bg-transparent text-offwhite-100 border border-white/20 hover:border-teal-400/60 hover:bg-white/5",
    ghost: "bg-transparent text-offwhite-100 hover:text-teal-300",
  };

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
