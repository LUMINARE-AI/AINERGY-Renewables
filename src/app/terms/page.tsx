import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the AINERGY Renewable LLP website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="bg-graphite-950 pb-24 pt-36 lg:pt-44">
      <Container className="max-w-3xl">
        <SectionHeader eyebrow="Legal" title="Terms of Use" />
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-offwhite-300/70">
          <p>
            This website is operated by AINERGY Renewable LLP. By accessing
            or using this website, you agree to use it only for lawful
            purposes and in a manner that does not infringe the rights of, or
            restrict or inhibit the use of, this website by any third party.
          </p>
          <p>
            Content on this website — including text, diagrams, illustrations
            and the illustrative energy optimizer — is provided for general
            informational purposes only and does not constitute a commercial
            offer, financial advice or a binding proposal.
          </p>
          <p>
            This is a placeholder Terms of Use pending a full legal review. A
            detailed, jurisdiction-specific version will be published here in
            due course.
          </p>
        </div>
      </Container>
    </section>
  );
}
