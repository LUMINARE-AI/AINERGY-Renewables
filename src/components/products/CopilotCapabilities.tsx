"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { revealItem } from "@/components/shared/Reveal";
import { COPILOT_CAPABILITIES } from "@/lib/productsContent";

export function CopilotCapabilities() {
  return (
    <div className="border-t border-ink-900/8 py-16 lg:py-20">
      <Container>
        <Reveal>
          <h3 className="font-display text-2xl font-medium text-ink-900 sm:text-3xl">
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
              className="group flex items-start gap-4 rounded-2xl border border-ink-900/10 bg-paper-100/50 px-5 py-4 transition-all duration-300 hover:border-current-500/30 hover:shadow-premium"
            >
              <span className="font-mono-tag shrink-0 text-xs text-current-600/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-ink-700/90 group-hover:text-ink-900">
                {capability}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
