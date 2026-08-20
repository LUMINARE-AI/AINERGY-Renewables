"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { WindTurbineScene } from "@/components/WindTurbineScene";
import { Badge } from "@/components/ui/Badge";

const FLOW = ["Solar", "Wind", "Storage", "Grid", "Open Access"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper-50 pb-20 pt-32 lg:pb-28 lg:pt-40">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <div className="paper-grain" />

      <Container className="relative grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge>
              <Sparkles className="mr-1.5 h-3 w-3" />
              AINERGY Renewable LLP
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance mt-6 font-display text-4xl font-medium leading-[1.06] text-ink-900 sm:text-5xl lg:text-[3.6rem]"
          >
            The Energy OS for{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">Commercial &amp; Industrial</span>
              <span
                className="absolute inset-x-0 bottom-1 h-3 -rotate-1 bg-current-400/40 sm:h-4"
                aria-hidden="true"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance mt-6 max-w-xl text-lg leading-relaxed text-ink-700/90"
          >
            AINERGY builds the open access and on-site solar plants that cut
            C&amp;I energy costs — and runs an AI layer on top that tells you
            exactly which mix of rooftop, wind, storage and Open Access gets
            you there fastest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/energy-optimizer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow"
            >
              Upload a bill, get a plan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/energy-os"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/15 px-7 py-3.5 text-sm font-medium text-ink-900 transition-colors hover:border-current-500/50 hover:bg-current-400/10"
            >
              Explore AINERGY OS
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-ink-900/10 pt-8"
          >
            {FLOW.map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                <span className="font-mono-tag text-xs text-ink-600">
                  {item}
                </span>
                {i < FLOW.length - 1 && (
                  <span className="text-current-500/60">/</span>
                )}
              </span>
            ))}
            <ArrowRight className="mx-1 h-3.5 w-3.5 text-current-600/70" />
            <span className="font-mono-tag rounded-full border border-forest-600/25 bg-forest-500/8 px-3 py-1 text-xs text-forest-700">
              Lower ₹/kWh
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-current-400/15 via-transparent to-forest-500/10 blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] border border-ink-900/10 shadow-premium-lg">
            <WindTurbineScene />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-ink-900/10 bg-paper-50/95 p-4 shadow-premium backdrop-blur sm:block">
            <p className="font-mono-tag text-[10px] uppercase text-current-600">
              Energy Copilot
            </p>
            <p className="mt-1.5 text-sm font-medium text-ink-900">
              Est. 38% cost reduction
            </p>
            <p className="mt-0.5 text-xs text-ink-600">
              Rooftop + Open Access · Karnataka
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
