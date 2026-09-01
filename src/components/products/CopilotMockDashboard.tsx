"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, UploadCloud } from "lucide-react";
import { MOCK_EXTRACTED_FIELDS } from "@/lib/productsContent";

export function CopilotMockDashboard() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPulse(false);
      return;
    }
    const timer = window.setInterval(() => setPulse((p) => !p), 2000);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-paper-50/78 p-5 shadow-premium backdrop-blur-md sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-ink-900/10 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-current-600" />
          <span className="font-mono-tag text-xs uppercase text-current-600">
            Copilot Analysis
          </span>
        </div>
        <span
          className={`rounded-full border border-current-500/30 bg-current-400/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-current-700 ${
            pulse && !reducedMotion ? "animate-pulse" : ""
          }`}
        >
          Analyzing
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-current-500/35 bg-current-400/5 p-4">
          <div className="flex items-center gap-2 text-current-700">
            <UploadCloud className="h-4 w-4" />
            <span className="text-xs font-medium">Bill uploaded</span>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-ink-900/10 bg-paper-50/90 px-3 py-2">
            <FileText className="h-4 w-4 shrink-0 text-ink-500" />
            <span className="truncate text-xs text-ink-800">
              electricity_bill.pdf
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-900/10 bg-paper-100/60 p-4">
          <p className="font-mono-tag text-[10px] uppercase text-ink-500">
            Scenarios evaluated
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Grid", "OA", "Group Captive", "Captive", "Hybrid"].map((s) => (
              <span
                key={s}
                className="rounded-full border border-ink-900/10 bg-paper-50 px-2 py-0.5 text-[10px] text-ink-700"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {MOCK_EXTRACTED_FIELDS.map((field) => (
          <div
            key={field.label}
            className="flex items-center justify-between rounded-xl border border-ink-900/10 bg-paper-50/90 px-3 py-2.5 transition-colors hover:border-current-500/30"
          >
            <span className="font-mono-tag text-[10px] uppercase text-ink-500">
              {field.label}
            </span>
            <span className="text-xs text-ink-800">{field.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-forest-500/25 bg-forest-500/10 px-4 py-3 text-center">
        <p className="text-xs font-medium text-forest-700">
          Indicative scenario comparison ready
        </p>
      </div>
    </div>
  );
}
