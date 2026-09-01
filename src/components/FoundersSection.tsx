"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

type Founder = {
  name: string;
  role: string;
  image: string;
  bios: string[];
};

const FOUNDERS: Founder[] = [
  {
    name: "Arin Danish",
    role: "Co-Founder | Technology & Energy Strategy",
    image: "/founders/arin-danish.svg",
    bios: [
      "Arin brings extensive experience across the energy sector, including Solar, Wind, Thermal and Oil & Gas, with expertise in project development, contracts management and project management. He has been involved in delivering projects across renewable energy and EHV infrastructure.",
      "At AINERGY, Arin focuses on technology, AI and digital energy solutions, driving the development of the intelligence layer behind AINERGY's Energy OS for C&I. His focus is on using technology to simplify energy decisions, optimize renewable-energy procurement and create smarter energy solutions.",
    ],
  },
  {
    name: "Asif Mustafa",
    role: "Co-Founder | Execution & Project Delivery",
    image: "/founders/asif-mustafa.svg",
    bios: [
      "Asif brings extensive experience across Solar, Wind and Thermal energy, with strong expertise in project management and execution. He has been involved in delivering multiple renewable-energy and EHV projects, with a strong focus on translating plans into successful project outcomes.",
      "At AINERGY, Asif focuses on execution, project delivery and renewable-energy infrastructure, ensuring that the company's energy solutions are built and delivered with strong operational discipline and quality.",
    ],
  },
];

function excerpt(text: string, max = 120) {
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max).replace(/\s+\S*$/, "");
  return `${trimmed}…`;
}

function FounderModal({
  founder,
  onClose,
}: {
  founder: Founder;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        aria-label="Close profile"
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="founder-modal-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[min(88dvh,720px)] w-full max-w-lg overflow-y-auto rounded-3xl border border-ink-900/10 bg-paper-50 shadow-premium-lg thin-scroll"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 bg-paper-50/90 text-ink-600 transition-colors hover:border-current-500/30 hover:text-current-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-900">
          <Image
            src={founder.image}
            alt={founder.name}
            fill
            unoptimized
            sizes="512px"
            className="object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-paper-50 to-transparent" />
        </div>

        <div className="px-6 pb-8 pt-2 sm:px-8">
          <h3
            id="founder-modal-title"
            className="font-display text-2xl font-semibold text-ink-900"
          >
            {founder.name}
          </h3>
          <p className="mt-1.5 text-sm font-medium text-current-600">
            {founder.role}
          </p>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-700/90 sm:text-[15px]">
            {founder.bios.map((bio) => (
              <p key={bio.slice(0, 48)}>{bio}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FoundersSection() {
  const [activeFounder, setActiveFounder] = useState<Founder | null>(null);
  const closeModal = useCallback(() => setActiveFounder(null), []);

  return (
    <>
      <div className="mt-10 grid gap-10 sm:mt-14 sm:gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-10">
        {FOUNDERS.map((founder, index) => (
          <Reveal key={founder.name} delay={index * 0.08}>
            <article className="group flex h-full flex-col items-center rounded-2xl border border-ink-900/10 bg-paper-50/80 p-6 text-center shadow-sm transition-all duration-300 hover:border-current-500/25 hover:shadow-premium lg:items-start lg:p-8 lg:text-left">
              <div className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden bg-ink-900 sm:w-40 lg:w-44">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 160px, 176px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/55 to-transparent" />
              </div>
              <div className="mt-5 min-w-0 flex-1 lg:mt-6">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
                  {founder.name}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-current-600">
                  {founder.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {excerpt(founder.bios[0])}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFounder(founder)}
                  className="mt-5 inline-flex items-center justify-center rounded-full border border-ink-900/15 bg-paper-100/60 px-5 py-2.5 text-sm font-medium text-ink-900 transition-all hover:border-current-500/40 hover:bg-current-400/10 hover:text-current-700"
                >
                  View profile
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {activeFounder && (
          <FounderModal founder={activeFounder} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
}
