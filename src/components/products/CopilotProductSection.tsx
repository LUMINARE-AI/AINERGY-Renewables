import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";
import { CopilotMockDashboard } from "@/components/products/CopilotMockDashboard";
import { CopilotCapabilities } from "@/components/products/CopilotCapabilities";
import { CopilotComparison } from "@/components/products/CopilotComparison";
import { CopilotAIInsight } from "@/components/products/CopilotAIInsight";
import { CopilotDisclaimer } from "@/components/products/CopilotDisclaimer";

export function CopilotProductSection() {
  return (
    <section
      id="copilot"
      className="surface-dark relative scroll-mt-28 overflow-hidden bg-ink-950"
    >
      <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <span className="font-mono-tag text-xs uppercase text-current-300">
                AI Energy Copilot
              </span>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-offwhite-100 sm:text-4xl">
                Your Electricity Bill Is the Starting Point.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-offwhite-300/75">
                Upload your C&amp;I electricity bill and let AINERGY Copilot turn
                it into an initial energy strategy.
              </p>
              <div className="mt-8">
                <Button href="/energy-optimizer" tone="dark" size="lg" icon>
                  Upload My Bill
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <CopilotMockDashboard />
          </Reveal>
        </div>
      </Container>

      <CopilotCapabilities />
      <CopilotComparison />
      <CopilotAIInsight />
      <CopilotDisclaimer />

      <Container className="relative pb-16 lg:pb-20">
        <Reveal>
          <Button href="/energy-optimizer" tone="dark" size="lg" icon>
            Upload My Bill
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
