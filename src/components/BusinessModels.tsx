import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { BUSINESS_MODELS } from "@/lib/data";

export function BusinessModels() {
  return (
    <section className="bg-graphite-950 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Business Models"
          title="Commercial structures suited to your business."
          description="AINERGY works within several commercial structures, chosen based on eligibility, project economics and how a business prefers to manage capital."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {BUSINESS_MODELS.map((model, i) => (
            <Reveal key={model.name} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-graphite-900/40 p-6">
                <span className="font-mono-tag text-xs text-teal-400">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-medium text-offwhite-100">
                  {model.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-offwhite-300/60">
                  {model.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-offwhite-300/45">
          Commercial structures are subject to applicable regulations,
          eligibility and project-specific conditions.
        </p>
      </Container>
    </section>
  );
}
