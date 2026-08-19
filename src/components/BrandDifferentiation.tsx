import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";

const LAYERS = [
  "Renewable Infrastructure",
  "Energy Procurement",
  "Storage",
  "AI",
  "Energy Intelligence",
  "Energy OS",
];

export function BrandDifferentiation() {
  return (
    <section className="border-y border-white/10 bg-graphite-900/30 py-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_auto_1.4fr]">
          <div className="text-center lg:text-left">
            <p className="font-mono-tag text-xs uppercase text-offwhite-300/45">
              Traditional Solar EPC
            </p>
            <p className="mt-2 font-display text-lg text-offwhite-300/60">
              Sells a solar asset
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-5 w-5 rotate-90 text-teal-400/50 lg:rotate-0" />
          </div>

          <div>
            <p className="text-center font-mono-tag text-xs uppercase text-emerald-300 lg:text-left">
              AINERGY operates
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {LAYERS.map((layer) => (
                <span
                  key={layer}
                  className="rounded-full border border-emerald-400/25 bg-emerald-400/[0.06] px-3.5 py-1.5 text-xs font-medium text-emerald-200"
                >
                  {layer}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
