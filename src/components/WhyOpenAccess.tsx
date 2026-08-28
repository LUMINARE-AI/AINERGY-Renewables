import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";

const COST_STATS = [
  {
    value: "₹8–12",
    unit: "/kWh",
    label: "Typical grid tariff",
    note: "Rising ~5–8% a year in most states",
  },
  {
    value: "₹5–7",
    unit: "/kWh",
    label: "Open Access landed cost",
    note: "Wheeling, CSS, ASC & banking itemized up front",
  },
  {
    value: "25–45%",
    unit: "",
    label: "Typical cost reduction",
    note: "Illustrative — the Copilot models your actual numbers",
  },
] as const;

export function WhyOpenAccess() {
  return (
    <section className="bg-paper-50 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Why Open Access"
          title="Grid power is the most expensive option on the table."
          description="DISCOM tariffs keep climbing while an Open Access PPA locks a renewable rate for the life of the plant. The gap only widens the longer a business waits to switch."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {COST_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-ink-900/10 bg-paper-100/60 p-6 text-center shadow-premium">
                <p className="font-display text-3xl font-medium text-ink-900">
                  {stat.value}
                  <span className="text-lg font-normal text-ink-500">{stat.unit}</span>
                </p>
                <p className="mt-2 text-sm font-medium text-current-600">{stat.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">{stat.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-14 flex justify-center">
            <Button href="/solutions/open-access" size="lg" icon variant="secondary">
              Explore Open Access
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-3xl border border-current-500/25 bg-gradient-to-br from-current-400/10 to-transparent p-8 text-center sm:flex-row sm:text-left lg:p-10">
            <div>
              <p className="font-display text-xl font-medium text-ink-900">
                See what this looks like for your facility.
              </p>
              <p className="mt-1.5 text-sm text-ink-600">
                Upload a bill and the Copilot models your real landed cost —
                grid vs Open Access vs Captive vs Group Captive.
              </p>
            </div>
            <Button href="/energy-optimizer" size="lg" icon className="shrink-0">
              Upload a bill, get a plan
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
