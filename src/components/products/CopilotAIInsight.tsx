"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import {
  AI_INSIGHT_HIGHLIGHTS,
  AI_INSIGHT_TEXT,
} from "@/lib/productsContent";

function highlightInsight(text: string) {
  let result = text;
  AI_INSIGHT_HIGHLIGHTS.forEach((word) => {
    result = result.replace(
      word,
      `<strong class="font-medium text-current-300">${word}</strong>`
    );
  });
  return result;
}

export function CopilotAIInsight() {
  const [displayed, setDisplayed] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(AI_INSIGHT_TEXT);
      return;
    }
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setDisplayed(AI_INSIGHT_TEXT.slice(0, i));
      if (i >= AI_INSIGHT_TEXT.length) window.clearInterval(timer);
    }, 28);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const isComplete = displayed.length >= AI_INSIGHT_TEXT.length;

  return (
    <div className="border-t border-white/10 py-16 lg:py-20">
      <Container>
        <Reveal>
          <h3 className="font-display text-2xl font-medium text-offwhite-100 sm:text-3xl">
            AI explanation
          </h3>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 max-w-2xl rounded-2xl border border-current-500/25 bg-graphite-900/50 p-6 shadow-premium backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-current-400" />
              <span className="font-mono-tag text-xs uppercase text-current-300">
                Copilot insight
              </span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-offwhite-200/90">
              &ldquo;
              {isComplete ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightInsight(AI_INSIGHT_TEXT),
                  }}
                />
              ) : (
                <>
                  {displayed}
                  <span className="ml-0.5 inline animate-pulse text-current-400">
                    |
                  </span>
                </>
              )}
              &rdquo;
            </p>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
