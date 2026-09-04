"use client";

import { useEffect, useState, type ReactNode } from "react";
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

const MESSAGES = [
  "Hi, How may I help you?",
  "Want to see how much you could save on energy?",
  "Upload your electricity bill. I'll analyze it.",
  "OA • Captive • Group\nCaptive • BESS",
] as const;

const START_DELAY_MS = 2500;
const CYCLE_DELAY_MS = 2500;
const TYPE_INTERVAL_MS = 55;

function isHiddenRoute(pathname: string) {
  return HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function renderBubbleText(text: string, cursor: ReactNode) {
  const newlineIndex = text.indexOf("\n");

  if (newlineIndex === -1) {
    return (
      <span className="whitespace-nowrap">
        {text}
        {cursor}
      </span>
    );
  }

  const firstLine = text.slice(0, newlineIndex);
  const secondLine = text.slice(newlineIndex + 1);

  return (
    <span className="inline-flex flex-col items-start">
      <span className="whitespace-nowrap">{firstLine}</span>
      <span className="whitespace-nowrap">
        {secondLine}
        {cursor}
      </span>
    </span>
  );
}

export function CopilotFab() {
  const pathname = usePathname();
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const currentMessage = MESSAGES[messageIndex];
  const isComplete = displayed.length >= currentMessage.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setTyping(true), START_DELAY_MS);
    return () => window.clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!typing) return;

    if (reducedMotion) {
      setDisplayed(currentMessage);
      const cycleTimer = window.setTimeout(() => {
        setMessageIndex((index) => (index + 1) % MESSAGES.length);
      }, CYCLE_DELAY_MS);
      return () => window.clearTimeout(cycleTimer);
    }

    if (!isComplete) {
      const typeTimer = window.setTimeout(() => {
        setDisplayed(currentMessage.slice(0, displayed.length + 1));
      }, TYPE_INTERVAL_MS);
      return () => window.clearTimeout(typeTimer);
    }

    const cycleTimer = window.setTimeout(() => {
      setMessageIndex((index) => (index + 1) % MESSAGES.length);
      setDisplayed("");
    }, CYCLE_DELAY_MS);

    return () => window.clearTimeout(cycleTimer);
  }, [typing, displayed, messageIndex, currentMessage, isComplete, reducedMotion]);

  if (isHiddenRoute(pathname)) return null;

  return (
    <Link
      href="/energy-optimizer"
      aria-label="Open AINERGY Copilot"
      className="group fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
    >
      <div className="relative h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20">
        <AnimatePresence mode="wait">
          {typing && (
            <motion.div
              key={messageIndex}
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.72, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "bottom right" }}
              className="absolute bottom-full right-0 z-10 mb-1 w-max max-w-[min(calc(100vw-4rem),22rem)] rounded-xl rounded-br-sm border border-ink-900/10 bg-white/95 px-2.5 py-1.5 shadow-premium backdrop-blur-md transition-colors group-hover:border-current-400/40 group-hover:shadow-glow sm:max-w-[24rem]"
            >
              <p className="cursor-pointer text-left text-xs leading-[1.35] text-ink-700 sm:text-[13px]">
                {renderBubbleText(
                  displayed,
                  !reducedMotion ? (
                    <span
                      aria-hidden
                      className="ml-px inline animate-pulse text-current-500"
                    >
                      |
                    </span>
                  ) : null
                )}
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
