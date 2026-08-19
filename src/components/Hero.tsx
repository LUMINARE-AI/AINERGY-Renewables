"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { WindTurbineScene } from "@/components/WindTurbineScene";
import { Badge } from "@/components/ui/Badge";

const FLOW = ["Solar", "Wind", "Storage", "Grid", "AI"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-graphite-950 pb-20 pt-32 lg:pb-28 lg:pt-40">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <div className="noise-overlay" />

      <Container className="relative grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge>AINERGY Renewable LLP</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance mt-6 font-display text-4xl font-medium leading-[1.08] text-offwhite-100 sm:text-5xl lg:text-6xl"
          >
            The Energy OS for{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Business
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance mt-6 max-w-xl text-lg leading-relaxed text-offwhite-300/75"
          >
            Intelligent clean energy for a more resilient, efficient and
            sustainable business. AINERGY designs, develops and operates
            renewable-energy solutions while using AI to optimize how
            businesses generate, procure, store and consume energy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-medium text-graphite-950 transition-all hover:bg-emerald-400 hover:shadow-glow"
            >
              Build My Energy Plan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/energy-os"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-offwhite-100 transition-colors hover:border-teal-400/50 hover:bg-white/5"
            >
              Explore AINERGY OS
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-white/10 pt-8"
          >
            {FLOW.map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                <span className="font-mono-tag text-xs text-offwhite-300/60">
                  {item}
                </span>
                {i < FLOW.length - 1 && (
                  <span className="text-teal-400/50">/</span>
                )}
              </span>
            ))}
            <ArrowRight className="mx-1 h-3.5 w-3.5 text-teal-400/70" />
            <span className="font-mono-tag rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-300">
              AINERGY OS
            </span>
            <ArrowRight className="mx-1 h-3.5 w-3.5 text-teal-400/70" />
            <span className="font-mono-tag text-xs text-offwhite-300/60">
              C&amp;I Business
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 shadow-premium">
            <WindTurbineScene />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
