"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

const PRODUCTS = [
  { id: "copilot", label: "AI Energy Copilot", shortLabel: "Copilot", icon: Sparkles },
  { id: "wattpe", label: "WattPe", shortLabel: "WattPe", icon: Sun },
] as const;

export function ProductsNav() {
  const [active, setActive] = useState<string>("copilot");

  useEffect(() => {
    const sections = PRODUCTS.map((p) => document.getElementById(p.id));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0, 0.2, 0.45] }
    );
    sections.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky top-20 z-30 border-b border-ink-900/8 bg-paper-50/92 backdrop-blur-md">
      <Container className="py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="hidden sm:block">
            <span className="font-mono-tag text-xs uppercase tracking-wide text-ink-500">
              Jump to
            </span>
            <p className="mt-1 text-sm text-ink-700">Two digital products</p>
          </div>

          <div
            className="relative grid w-full grid-cols-2 gap-1 rounded-2xl border border-ink-900/10 bg-paper-100/70 p-1 shadow-sm sm:w-auto sm:min-w-[22rem]"
            role="tablist"
            aria-label="Product sections"
          >
            {PRODUCTS.map((product) => {
              const isActive = active === product.id;
              const Icon = product.icon;

              return (
                <button
                  key={product.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => scrollTo(product.id)}
                  className={cn(
                    "relative flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 sm:px-5 sm:py-3",
                    isActive ? "text-ink-900" : "text-ink-500 hover:text-ink-800"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="products-nav-active"
                      className="absolute inset-0 rounded-xl border border-current-500/25 bg-white shadow-premium"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 h-3.5 w-3.5 shrink-0",
                      isActive ? "text-current-600" : "text-ink-400"
                    )}
                    strokeWidth={1.75}
                  />
                  <span className="relative z-10 truncate sm:hidden">
                    {product.shortLabel}
                  </span>
                  <span className="relative z-10 hidden truncate sm:inline">
                    {product.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
