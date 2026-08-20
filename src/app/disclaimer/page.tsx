import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers regarding project data, the energy optimizer demo and commercial structures shown on this website.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <section className="bg-paper-50 pb-24 pt-36 lg:pt-44">
      <Container className="max-w-3xl">
        <SectionHeader eyebrow="Legal" title="Disclaimer" />
        <div className="mt-10 space-y-6 text-base leading-loose text-ink-700">
          <p>
            <span className="font-medium text-ink-900">
              Project and metric data.
            </span>{" "}
            Where figures on this website are explicitly marked as
            placeholders, they are illustrative only and do not represent
            confirmed, audited or commercially binding data. Confirmed
            figures will be published as AINERGY&apos;s projects reach
            relevant milestones.
          </p>
          <p>
            <span className="font-medium text-ink-900">
              Energy Optimizer demo.
            </span>{" "}
            The interactive energy optimizer on this website produces
            simplified, illustrative estimates for exploration purposes only.
            It is not a commercial quotation and does not reflect the outcome
            of a site assessment, load-curve analysis or regulatory review.
          </p>
          <p>
            <span className="font-medium text-ink-900">
              Commercial structures.
            </span>{" "}
            Business models described on this website (Own, PPA, Open Access,
            Energy-as-a-Service, Hybrid) are general descriptions only and are
            subject to applicable regulations, eligibility criteria and
            project-specific conditions. Nothing on this website constitutes
            legal, financial or regulatory advice.
          </p>
          <p>
            <span className="font-medium text-ink-900">
              AI capabilities.
            </span>{" "}
            References to AI-driven forecasting, optimization and
            recommendations describe decision-support capabilities. They do
            not imply autonomous control of physical energy infrastructure
            unless explicitly stated for a specific, contracted system.
          </p>
        </div>
      </Container>
    </section>
  );
}
