import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";

const NODES = [
  { key: "solar", label: "Solar", x: 50, y: 8 },
  { key: "wind", label: "Wind", x: 10, y: 42 },
  { key: "bess", label: "BESS", x: 90, y: 42 },
  { key: "ci", label: "C&I", x: 50, y: 76 },
  { key: "ev", label: "EV", x: 22, y: 90 },
  { key: "grid", label: "Grid", x: 78, y: 90 },
];

export function EnergyNetwork() {
  return (
    <section className="relative overflow-hidden bg-paper-100 py-24 lg:py-32">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Energy Network"
          title="From individual assets to an intelligent energy network."
          description="As more generation, storage and demand points come online, AINERGY OS coordinates them as one interoperable, decentralized network rather than isolated installations."
          align="center"
          className="mx-auto"
        />

        <Reveal delay={0.1} className="mt-16">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              {NODES.map((n) => (
                <line
                  key={n.key}
                  x1="50"
                  y1="50"
                  x2={n.x}
                  y2={n.y}
                  stroke="rgba(33,29,21,0.10)"
                  strokeWidth="0.4"
                />
              ))}
              {NODES.map((n, i) => (
                <line
                  key={`flow-${n.key}`}
                  x1="50"
                  y1="50"
                  x2={n.x}
                  y2={n.y}
                  stroke="#D98A1E"
                  strokeWidth="0.6"
                  strokeDasharray="2 6"
                  strokeLinecap="round"
                  className="ainergy-net-flow"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-current-500/40 bg-ink-900 text-center shadow-glow">
              <span className="font-display text-xs font-semibold text-paper-50 sm:text-sm">
                AINERGY
              </span>
              <span className="font-mono-tag text-[9px] text-current-300">OS</span>
            </div>

            {NODES.map((n) => (
              <div
                key={n.key}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <div className="ainergy-node-pulse flex h-16 w-16 items-center justify-center rounded-full border border-ink-900/12 bg-paper-50 text-xs font-medium text-ink-800 shadow-premium">
                  {n.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <style>{`
          .ainergy-net-flow {
            animation: ainergy-net-dash 2.8s linear infinite;
          }
          @keyframes ainergy-net-dash {
            to { stroke-dashoffset: -16; }
          }
          .ainergy-node-pulse {
            animation: ainergy-node-glow 3.2s ease-in-out infinite;
          }
          @keyframes ainergy-node-glow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(217,138,30,0.16); }
            50% { box-shadow: 0 0 0 8px rgba(217,138,30,0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .ainergy-net-flow, .ainergy-node-pulse { animation: none !important; }
          }
        `}</style>
      </Container>
    </section>
  );
}
