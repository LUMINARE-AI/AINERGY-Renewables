import { Container } from "@/components/ui/Container";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { TRUST_METRICS } from "@/lib/data";

export function MetricStrip() {
  return (
    <section className="border-y border-white/10 bg-graphite-900/60 py-14">
      <Container>
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_METRICS.map((metric) => (
            <div key={metric.label} className="text-center sm:text-left">
              <div className="font-display text-3xl font-medium text-offwhite-100 lg:text-4xl">
                <AnimatedNumber value={metric.value} />
              </div>
              <p className="mt-2 text-sm text-offwhite-300/60">
                {metric.label}
                {metric.isPlaceholder && (
                  <span className="ml-1.5 text-[10px] uppercase tracking-wide text-gold-400/70">
                    (placeholder)
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
