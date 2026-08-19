import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AINERGY Renewable LLP collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="bg-graphite-950 pb-24 pt-36 lg:pt-44">
      <Container className="max-w-3xl">
        <SectionHeader eyebrow="Legal" title="Privacy Policy" />
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-offwhite-300/70">
          <p>
            AINERGY Renewable LLP (&quot;AINERGY&quot;, &quot;we&quot;,
            &quot;us&quot;) respects your privacy. This policy describes, in
            general terms, how information submitted through this website —
            such as contact and enquiry form details — may be collected and
            used to respond to your enquiry and to provide information about
            AINERGY&apos;s solutions.
          </p>
          <p>
            We do not sell personal information to third parties. Information
            you submit is used solely to evaluate and respond to your
            enquiry, and for related business communication, unless you
            request otherwise.
          </p>
          <p>
            This is a placeholder policy pending a full legal review. A
            detailed, jurisdiction-specific privacy policy will be published
            here in due course.
          </p>
        </div>
      </Container>
    </section>
  );
}
