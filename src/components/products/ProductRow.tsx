import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/productsContent";
import { cn } from "@/lib/utils";

export function ProductRow({
  product,
  href,
  tone = "light",
}: {
  product: Product;
  href?: string;
  tone?: "light" | "dark";
}) {
  const to = href ?? (product.ctaExternal ? product.ctaHref : `/products/${product.slug}`);
  const light = tone === "light";
  const external = Boolean(product.ctaExternal) || to.startsWith("http");

  return (
    <Link
      href={to}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative grid overflow-hidden rounded-2xl px-5 py-8 pr-6 before:absolute before:inset-x-0 before:top-1/2 before:z-0 before:h-0 before:-translate-y-1/2 before:bg-current-500 before:transition-all before:duration-300 before:ease-out before:content-[''] hover:before:h-full sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-center sm:gap-8 sm:px-8 sm:py-12 sm:pr-24 lg:pl-10 lg:pr-28",
        light
          ? "border border-ink-900/10 bg-white/80 shadow-sm backdrop-blur-md hover:shadow-premium"
          : "bg-white/5"
      )}
      aria-label={product.name}
    >
      <p
        className={cn(
          "relative z-10 min-w-0 font-display text-2xl font-semibold transition-colors duration-300 group-hover:text-paper-50 sm:text-3xl lg:text-4xl",
          light ? "text-ink-900" : "text-offwhite-100/55"
        )}
      >
        {product.name}
      </p>

      <p
        className={cn(
          "relative z-10 mt-3 min-w-0 max-w-xl text-sm font-medium leading-relaxed transition-colors duration-300 group-hover:text-paper-50 sm:mt-0 sm:pr-2 sm:text-base lg:text-lg",
          light ? "text-ink-600" : "text-offwhite-100/45"
        )}
      >
        {product.short}
      </p>

      <span
        className={cn(
          "absolute right-8 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 transition-all duration-300 group-hover:rotate-45 group-hover:text-paper-50 sm:block",
          light ? "text-ink-400" : "text-offwhite-100/40"
        )}
      >
        <ArrowUpRight className="h-full w-full" strokeWidth={2} />
      </span>

      <span
        className={cn(
          "relative z-10 mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] sm:hidden",
          light
            ? "border border-ink-900/12 bg-paper-100 text-ink-800 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-paper-50"
            : "border border-white/15 bg-white/10 text-paper-50"
        )}
      >
        Learn more
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
