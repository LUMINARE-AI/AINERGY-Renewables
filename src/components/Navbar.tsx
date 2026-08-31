"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Routes whose hero is a dark photo backdrop — need light nav at top. */
const DARK_HERO_ROUTES: string[] = [];

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const onDarkHero = DARK_HERO_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const lightNav = onDarkHero && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-ink-900/8 bg-white"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Logo />

        <div className="hidden items-center gap-5 lg:flex">
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isNavActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative rounded-lg px-3.5 py-2 text-[13px] font-medium tracking-[0.01em] transition-colors duration-200",
                    lightNav
                      ? active
                        ? "text-offwhite-100"
                        : "text-offwhite-100/70 hover:text-offwhite-100"
                      : active
                        ? "text-current-500"
                        : "text-ink-900 hover:text-current-500"
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute bottom-0 left-3.5 h-[2px] rounded-full transition-all duration-300 ease-out",
                      active
                        ? "w-[calc(100%-1.75rem)] opacity-100"
                        : "w-0 opacity-0 group-hover:w-[calc(100%-1.75rem)] group-hover:opacity-100",
                      lightNav ? "bg-current-400" : "bg-current-500"
                    )}
                  />
                </Link>
              );
            })}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-current-500 px-5 py-2.5 text-sm font-medium text-paper-50 shadow-[0_0_0_1px_rgba(58,187,194,0.25)] transition-colors hover:bg-current-600 hover:shadow-glow"
          >
            Contact us
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden",
            lightNav
              ? "border-white/25 text-offwhite-100"
              : "border-ink-900/15 text-ink-900"
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-ink-900/8 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-[15px] font-medium tracking-[0.01em] transition-colors",
                      isNavActive(pathname, link.href)
                        ? "bg-current-400/10 text-current-500"
                        : "text-ink-900 hover:bg-current-400/10 hover:text-current-500"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/contact"
                className="mt-2 block rounded-full bg-current-500 px-4 py-3 text-center text-[15px] font-medium text-paper-50 transition-colors hover:bg-current-600"
              >
                Contact us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
