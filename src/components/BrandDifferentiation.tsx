import { ArrowRight } from "lucide-react";
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
    <section className="border-y border-ink-900/8 bg-paper-100 py-14">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_auto_1.4fr]">
          <div className="text-center lg:text-left">
            <p className="font-mono-tag text-xs uppercase text-ink-500">
              Traditional Solar EPC
            </p>
            <p className="mt-2 font-display text-lg text-ink-600">
              Sells a solar asset
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 rotate-90 text-current-500/60 lg:rotate-0" />
          </div>

          <div>
            <p className="text-center font-mono-tag text-xs uppercase text-current-600 lg:text-left">
              AINERGY operates
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {LAYERS.map((layer) => (
                <span
                  key={layer}
                  className="rounded-full border border-ink-900/12 bg-paper-50 px-3.5 py-1.5 text-xs font-medium text-ink-800 transition-colors hover:border-current-500/40"
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
