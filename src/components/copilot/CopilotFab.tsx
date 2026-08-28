"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const HIDDEN_ROUTES = [
  "/energy-optimizer",
  "/dashboard",
  "/facilities",
  "/analysis",
  "/recommendation",
  "/scenarios",
  "/settings",
];

const MESSAGE = "Hi, How may I help you?";
const START_DELAY_MS = 2500;
const TYPE_INTERVAL_MS = 55;

function isHiddenRoute(pathname: string) {
  return HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function CopilotFab() {
  const pathname = usePathname();
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setTyping(true), START_DELAY_MS);
    return () => window.clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!typing || displayed.length >= MESSAGE.length) return;

    const typeTimer = window.setTimeout(() => {
      setDisplayed(MESSAGE.slice(0, displayed.length + 1));
    }, TYPE_INTERVAL_MS);

    return () => window.clearTimeout(typeTimer);
  }, [typing, displayed]);

  if (isHiddenRoute(pathname)) return null;

  return (
    <Link
      href="/energy-optimizer"
      aria-label="Open AINERGY Copilot"
      className="group fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
    >
      <div className="relative h-[3.75rem] w-[3.75rem] sm:h-16 sm:w-16">
        <AnimatePresence>
          {typing && (
            <motion.div
              key="copilot-bubble"
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.72, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "bottom right" }}
              className="absolute bottom-full right-0 z-10 mb-1 w-max max-w-[min(calc(100vw-5rem),14rem)] rounded-xl rounded-br-sm border border-ink-900/10 bg-white/95 px-2.5 py-1.5 shadow-premium backdrop-blur-md transition-colors group-hover:border-current-400/40 group-hover:shadow-glow sm:max-w-[15rem]"
            >
              <p className="flex w-max cursor-pointer items-center whitespace-nowrap bg-transparent text-xs text-ink-700 sm:text-[13px]">
                <span>{displayed}</span>
                <span
                  aria-hidden
                  className="ml-px inline-block animate-pulse text-current-500"
                >
                  |
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <Image
          src="/copilot.png"
          alt="AINERGY Copilot"
          width={256}
          height={256}
          quality={100}
          unoptimized
          className="h-full w-full object-contain drop-shadow-[0_4px_14px_rgba(8,121,127,0.28)] transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
