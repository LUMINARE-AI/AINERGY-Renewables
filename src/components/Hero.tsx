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
    <section className="surface-dark relative flex min-h-dvh items-center overflow-hidden bg-ink-950 pt-24 pb-10 sm:pt-28 lg:pt-24 lg:pb-0">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 70% 55%, rgba(8, 121, 127, 0.42) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 20% 30%, rgba(201, 137, 58, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse 90% 55% at 50% 100%, #050A0B 0%, transparent 55%)
          `,
        }}
      />
      <div className="noise-overlay opacity-[0.04]" />

      <Container className="relative z-10 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          {/* Left — copy */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-balance font-display text-[2.35rem] font-medium leading-[1.15] tracking-tight text-offwhite-100 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1] xl:text-[3.85rem]"
            >
              The{" "}
              <em className={`${accent.className} text-[1.08em] not-italic text-gold-400`}>
                Energy OS
              </em>{" "}
              for{" "}
              <em className={`${accent.className} text-[1.08em] not-italic`}>
                Commercial &amp; Industrial
              </em>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start lg:gap-x-8"
            >
              {CALLOUTS.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-forest-800/70 text-current-300 backdrop-blur-sm">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="whitespace-nowrap text-xs font-medium text-offwhite-100/90 sm:text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — illustration */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-2xl lg:max-w-none"
          >
            <svg
              className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 text-white/[0.1]"
              viewBox="0 0 720 720"
              fill="none"
              aria-hidden
            >
              <circle cx="360" cy="360" r="170" stroke="currentColor" strokeWidth="1" />
              <circle cx="360" cy="360" r="250" stroke="currentColor" strokeWidth="1" />
              <circle cx="360" cy="360" r="330" stroke="currentColor" strokeWidth="1" />
            </svg>

            <div className="relative z-10 mx-auto aspect-[3/2] w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] xl:min-h-[480px]">
              <Image
                src="/mainhero.png"
                alt="AINERGY Energy OS — solar, wind, storage and facilities on one intelligent network"
                fill
                priority
                quality={92}
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-contain object-center select-none"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
