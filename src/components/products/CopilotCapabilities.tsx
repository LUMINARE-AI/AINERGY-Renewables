"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { revealItem } from "@/components/shared/Reveal";
import { COPILOT_CAPABILITIES } from "@/lib/productsContent";

export function CopilotCapabilities() {
  return (
    <div className="border-t border-white/10 py-16 lg:py-20">
      <Container>
        <Reveal>
          <h3 className="font-display text-2xl font-medium text-offwhite-100 sm:text-3xl">
            What it does
          </h3>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:gap-4"
        >
          {COPILOT_CAPABILITIES.map((capability, i) => (
            <motion.div
              key={capability}
              variants={revealItem}
              className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-graphite-900/30 px-5 py-4 transition-all duration-300 hover:border-current-500/30 hover:bg-graphite-900/50"
            >
              <span className="font-mono-tag shrink-0 text-xs text-current-400/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-offwhite-200/90 group-hover:text-offwhite-100">
                {capability}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
