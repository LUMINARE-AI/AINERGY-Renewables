"use client";

import { useState, type ComponentType } from "react";
import {
  ChartColumn,
  Database,
  Factory,
  MapPin,
  MousePointerClick,
  RefreshCw,
  Settings,
  Sun,
  Wind,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

type Step = {
  id: string;
  number: string;
  title: string;
  lines: string[];
  detail: string;
  icons: Icon[];
  accent?: "gold";
};

const STEPS: Step[] = [
  {
    id: "develop",
    number: "01",
    title: "Develop",
    lines: ["Sites · Grid · Offtake"],
    detail:
      "Land, grid access and a buyer are locked before construction. AINERGY lines up the site, the interconnection and the offtake so the plant has a path to revenue from the start.",
    icons: [MapPin],
  },
  {
    id: "build",
    number: "02",
    title: "Build",
    lines: ["Solar · Wind · BESS"],
    detail:
      "Solar, wind and battery storage are engineered and built as one system — designed around how a business actually uses power, not as three separate projects.",
    icons: [Sun, Wind],
  },
  {
    id: "own",
    number: "03",
    title: "Own",
    lines: ["Renewable Assets"],
    detail:
      "AINERGY holds the plants on its own balance sheet. Generation, storage and returns stay with one owner instead of a stack of vendors and contracts.",
    icons: [Database],
  },
  {
    id: "operate",
    number: "04",
    title: "Operate",
    lines: ["AI · O&M · Performance"],
    detail:
      "AI dispatch, operations and maintenance keep the assets available, forecast output and hold delivery to the contract — performance, not just commissioning.",
    icons: [Settings],
  },
  {
    id: "power",
    number: "05",
    title: "Power",
    lines: ["C&I Energy", "Open Access · Captive · PPA"],
    detail:
      "Power reaches commercial and industrial buyers through open access, captive and group captive structures, and long-term PPAs matched to their load.",
    icons: [Factory],
  },
  {
    id: "value",
    number: "06",
    title: "Create Value",
    lines: ["Energy Revenue", "Asset Value"],
    detail:
      "Operating plants become two things at once: lower-cost energy revenue for the buyer, and a growing contracted asset for the platform.",
    icons: [ChartColumn],
    accent: "gold",
  },
  {
    id: "scale",
    number: "07",
    title: "Scale",
    lines: ["Recycle · Reinvest"],
    detail:
      "Cash flow from operating assets is recycled into the next sites. Each plant funds the one after it, so the platform grows without starting from zero.",
    icons: [RefreshCw],
  },
];

const RETURN_PATH = "M 929 8 L 929 50 C 929 86, 71 86, 71 50 L 71 8";

export function AinergyValueFlow() {
  const [hovered, setHovered] = useState<number | null>(null);
  const step = hovered == null ? null : STEPS[hovered];

  return (
    <section
      className="relative bg-paper-50 pt-12 pb-6 lg:pt-16 lg:pb-8"
      id="value-flow"
    >
      <div className="pointer-events-none absolute inset-x-0 top-16 h-72 bg-[radial-gradient(ellipse_at_center,rgba(42,154,145,0.10),transparent_68%)]" />

      <Container className="relative">
        <SectionHeader
          align="center"
          eyebrow="How AINERGY creates value"
          eyebrowClassName="!mb-2 text-balance !tracking-[0.08em] sm:!mb-4 sm:!tracking-[0.14em]"
          title="From site to scale."
          titleClassName="!text-[1.65rem] !leading-[1.15] sm:!text-[1.85rem] lg:!text-[2.25rem]"
          description="Developing, owning and operating intelligent clean-energy infrastructure for business."
          descriptionClassName="!mt-2 !text-pretty !text-sm !leading-snug sm:!mt-5 sm:!text-lg sm:!leading-relaxed"
        />

        <div className="relative mt-9 lg:mt-11">
          <p className="mb-3 text-center text-sm leading-snug text-ink-500 md:hidden">
            <span className="font-semibold text-forest-800">Tap a stage</span> to explore how
            clean energy flows through our model
          </p>
          <ol className="space-y-2 md:hidden">
            {STEPS.map((item, i) => {
              const gold = item.accent === "gold";
              const open = hovered === i;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-white",
                    gold ? "border-gold-400/40" : "border-ink-900/10"
                  )}
                >
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left"
                    aria-expanded={open}
                    onClick={() => setHovered(open ? null : i)}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                        gold ? "bg-gold-400" : "bg-forest-600"
                      )}
                    >
                      {item.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-sm font-semibold uppercase tracking-[0.08em]",
                          gold ? "text-gold-600" : "text-forest-800"
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink-500">
                        {item.lines.join(" · ")}
                      </span>
                    </span>
                  </button>
                  {open && (
                    <p className="border-t border-ink-900/8 px-4 py-3 text-sm leading-relaxed text-ink-700">
                      {item.detail}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="hidden overflow-x-auto pt-3 pb-1 [scrollbar-width:none] md:block [&::-webkit-scrollbar]:hidden">
            <div className="avf-stage relative min-w-[760px] [--node:4.25rem] md:min-w-0 md:[--node:4.85rem] xl:[--node:5.6rem]">
              <ol className="grid grid-cols-7">
                {STEPS.map((item, i) => {
                  const gold = item.accent === "gold";
                  const hot = hovered === i;
                  const lineHot = hovered === i || hovered === i + 1;
                  const delay = `${i * 0.08}s`;

                  return (
                    <li
                      key={item.id}
                      data-step={i}
                      className="relative flex flex-col items-center px-1 text-center"
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <button
                        type="button"
                        className={cn(
                          "avf-node relative z-10 cursor-pointer rounded-full outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-current-400",
                          gold && "avf-gold",
                          hot && "avf-node-hot"
                        )}
                        style={{ animationDelay: delay }}
                        aria-expanded={hot}
                        aria-label={`${item.number} ${item.title}`}
                        onFocus={() => setHovered(i)}
                        onBlur={() => setHovered(null)}
                      >
                        <span
                          className={cn(
                            "absolute -left-0.5 -top-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-sm",
                            gold ? "bg-gold-400" : "bg-forest-600"
                          )}
                        >
                          {item.number}
                        </span>
                        <span
                          className={cn(
                            "flex h-[var(--node)] w-[var(--node)] items-center justify-center rounded-full border bg-white transition-[transform,box-shadow,border-color] duration-300",
                            gold
                              ? "border-gold-400/90 shadow-[0_0_0_8px_rgba(212,160,90,0.13),0_10px_28px_rgba(212,160,90,0.18)]"
                              : "border-forest-400/70 shadow-[0_0_0_8px_rgba(42,154,145,0.07),0_8px_18px_rgba(8,121,127,0.06)]",
                            hot &&
                              (gold
                                ? "scale-105 border-gold-500 shadow-[0_0_0_10px_rgba(212,160,90,0.2),0_0_32px_rgba(212,160,90,0.45)]"
                                : "scale-105 border-current-500 shadow-[0_0_0_10px_rgba(58,187,194,0.16),0_0_28px_rgba(8,121,127,0.28)]")
                          )}
                        >
                          <span className="flex items-center gap-0.5">
                            {item.icons.map((Icon, iconIndex) => (
                              <Icon
                                key={`${item.id}-${iconIndex}`}
                                className={cn(
                                  item.icons.length > 1 ? "h-5 w-5" : "h-6 w-6 xl:h-7 xl:w-7",
                                  gold ? "text-gold-600" : "text-forest-800"
                                )}
                                strokeWidth={1.6}
                              />
                            ))}
                          </span>
                        </span>
                      </button>

                      {i < STEPS.length - 1 && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute top-[calc(var(--node)/2)] left-[calc(50%+var(--node)/2+0.2rem)] z-0 w-[calc(100%-var(--node)-0.4rem)] -translate-y-1/2"
                        >
                          <span
                            className={cn(
                              "avf-line block h-px origin-left",
                              lineHot ? "bg-current-400" : "bg-forest-500/55"
                            )}
                            style={{ animationDelay: `${0.35 + i * 0.08}s` }}
                          />
                          <span
                            className={cn(
                              "avf-join absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white",
                              lineHot ? "border-current-400" : "border-forest-500/70"
                            )}
                            style={{ animationDelay: `${0.55 + i * 0.08}s` }}
                          />
                          <span
                            className={cn(
                              "avf-join absolute right-0 top-1/2 -translate-y-1/2 border-y-[3.5px] border-l-[6px] border-y-transparent",
                              lineHot ? "border-l-current-400" : "border-l-forest-600/80"
                            )}
                            style={{ animationDelay: `${0.55 + i * 0.08}s` }}
                          />
                        </span>
                      )}

                      <p
                        className={cn(
                          "avf-copy mt-3 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] xl:text-[11px]",
                          gold ? "text-gold-600" : hot ? "text-current-700" : "text-forest-800"
                        )}
                        style={{ animationDelay: delay }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="avf-copy mt-1 max-w-[8.5rem] text-[10px] leading-snug text-ink-500 xl:max-w-[9.5rem] xl:text-[11px]"
                        style={{ animationDelay: delay }}
                      >
                        {item.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>

                    </li>
                  );
                })}
              </ol>

              {[0, 2.5, 5, 7.5].map((delay) => (
                <span
                  key={delay}
                  aria-hidden
                  className="avf-pulse pointer-events-none absolute top-[calc(var(--node)/2)] z-0 h-2 w-2 -translate-y-1/2 rounded-full bg-current-300 shadow-[0_0_10px_rgba(58,187,194,0.95)]"
                  style={{ animationDelay: `-${delay}s` }}
                />
              ))}

              <div className="relative mt-1 h-[4.6rem]">
                <svg viewBox="0 0 1000 92" preserveAspectRatio="none" className="h-full w-full" fill="none" aria-hidden>
                  <defs>
                    <marker
                      id="avf-return-arrow"
                      markerWidth="8"
                      markerHeight="8"
                      refX="6"
                      refY="4"
                      orient="auto"
                    >
                      <path d="M0,0 L8,4 L0,8 Z" fill="#0B4540" />
                    </marker>
                  </defs>
                  <path
                    d={RETURN_PATH}
                    stroke="#147A72"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    markerEnd="url(#avf-return-arrow)"
                    className="avf-arc"
                  />
                  {["0s", "-4s", "-8s"].map((begin) => (
                    <circle key={begin} r="3.2" fill="#3ABBC2">
                      <animateMotion dur="12s" begin={begin} repeatCount="indefinite" path={RETURN_PATH} />
                    </circle>
                  ))}
                </svg>
                <p className="avf-pill pointer-events-none absolute left-1/2 top-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-800 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white shadow-sm sm:px-5 sm:text-[10px]">
                  Continuous Growth
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-3 hidden max-w-xl md:block" aria-live="polite">
          {step ? (
            <div
              key={step.id}
              className="avf-tip rounded-2xl border border-ink-900/10 bg-white px-4 py-3.5 shadow-premium sm:px-5"
            >
              <p
                className={cn(
                  "font-mono-tag text-[10px] uppercase tracking-[0.16em]",
                  step.accent === "gold" ? "text-gold-600" : "text-current-600"
                )}
              >
                {step.number} · {step.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{step.detail}</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-ink-900/15 bg-paper-100/70 px-4 py-3.5 sm:px-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current-500/25 bg-white text-current-600">
                <MousePointerClick className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <p className="text-sm leading-snug text-ink-500">
                <span className="font-semibold text-forest-800">Hover any stage</span> to explore how
                clean energy flows through our model
              </p>
            </div>
          )}
        </div>
      </Container>

      <style>{`
        .avf-pulse {
          left: calc(100% / 14);
          animation: avf-travel 10s linear infinite;
        }
        .avf-gold > span:last-child {
          animation: avf-glow 2.6s ease-in-out infinite;
        }
        .avf-node-hot > span:last-child {
          animation: avf-glow 1.4s ease-in-out infinite;
        }
        .avf-tip {
          animation: avf-tip 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes avf-travel {
          0% { left: calc(100% / 14); opacity: 0; }
          6% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: calc(100% - 100% / 14); opacity: 0; }
        }
        @keyframes avf-glow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.045); }
        }
        @keyframes avf-tip {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .avf-pulse,
          .avf-tip,
          .avf-gold > span:last-child,
          .avf-node-hot > span:last-child {
            animation: none !important;
          }
          .avf-pulse { display: none; }
        }
      `}</style>
    </section>
  );
}
