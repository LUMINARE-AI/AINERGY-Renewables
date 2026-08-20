import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { BUSINESS_MODELS } from "@/lib/data";

export function BusinessModels() {
  return (
    <section className="bg-paper-50 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Business Models"
          title="Commercial structures suited to your business."
          description="AINERGY works within several commercial structures, chosen based on eligibility, project economics and how a business prefers to manage capital."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {BUSINESS_MODELS.map((model, i) => (
            <Reveal key={model.name} delay={i * 0.06}>
              <div className="group flex h-full flex-col rounded-2xl border border-ink-900/10 bg-paper-100/60 p-6 transition-colors hover:border-current-500/30 hover:bg-paper-50">
                <span className="font-mono-tag text-xs text-current-600">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-medium text-ink-900">
                  {model.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {model.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-ink-500">
          Commercial structures are subject to applicable regulations,
          eligibility and project-specific conditions.
        </p>
      </Container>
    </section>
  );
}
