"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IndianRupee, BrainCircuit, Network } from "lucide-react";
import { Instrument_Serif } from "next/font/google";
import { Container } from "@/components/ui/Container";

const accent = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

const CALLOUTS = [
  { label: "Lower ₹/kWh", icon: IndianRupee },
  { label: "AI Energy OS", icon: BrainCircuit },
  { label: "Open Access", icon: Network },
];

export function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden bg-paper-50 pt-24 pb-16 sm:pt-28 lg:pb-24">
      <Image
        src="/HomeBG.png"
        alt=""
        fill
        preload
        unoptimized
        className="object-cover object-[70%_top] sm:object-[75%_top] lg:object-[80%_top]"
        aria-hidden
      />

      <Container className="relative z-10 w-full">
        <div className="w-full min-w-0 max-w-2xl text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[2rem] font-medium leading-[1.15] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1] xl:text-[3.85rem]"
          >
            The{" "}
            <em
              className={`${accent.className} text-[1.08em] not-italic text-gold-600`}
            >
              Energy OS
            </em>{" "}
            for{" "}
            <em className={`${accent.className} text-[1.08em] not-italic`}>
              Commercial
            </em>{" "}
            &amp;{" "}
            <em className={`${accent.className} text-[1.08em] not-italic`}>
              Industrial
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="text-pretty mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-ink-700/85 sm:text-lg lg:mx-0"
          >
            One intelligent system for how businesses generate, procure, store
            and consume energy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-5 lg:justify-start lg:gap-x-7"
          >
            {CALLOUTS.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-900/10 bg-white/75 text-current-600 shadow-sm backdrop-blur-sm">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-ink-800 sm:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
