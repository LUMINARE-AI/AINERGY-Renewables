"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LayoutDashboard, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/shared/Logo";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();

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
          ? "border-b border-ink-900/8 bg-paper-50/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Logo />

        <div className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm text-ink-700 transition-colors hover:text-ink-900",
                pathname === link.href && "text-ink-900"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1.5 left-0 h-px w-full bg-current-500" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href={status === "authenticated" ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-1.5 text-sm text-ink-700 transition-colors hover:text-ink-900"
          >
            <LayoutDashboard className="h-4 w-4" />
            {status === "authenticated" ? "Dashboard" : "Sign in"}
          </Link>
          <Link
            href="/energy-optimizer"
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow"
          >
            Try the Copilot
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 lg:hidden"
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
            className="overflow-hidden border-t border-ink-900/8 bg-paper-50/98 backdrop-blur-xl lg:hidden"
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
                    className="block rounded-lg px-3 py-3 text-lg text-ink-900/90 hover:bg-current-400/10"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href={status === "authenticated" ? "/dashboard" : "/login"}
                className="block rounded-lg px-3 py-3 text-lg text-ink-900/90 hover:bg-current-400/10"
              >
                {status === "authenticated" ? "Dashboard" : "Sign in"}
              </Link>
              <Link
                href="/energy-optimizer"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-ink-900 px-5 py-3 text-center text-sm font-medium text-paper-50"
              >
                Try the Copilot
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
