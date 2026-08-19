import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Build My Energy Plan",
  description:
    "Tell AINERGY about your business's electricity consumption and requirements to start designing your energy plan.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-graphite-950 pb-24 pt-36 lg:pb-32 lg:pt-44">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Contact"
          title="Let's design your energy future."
          description="Share a few details about your business and current energy setup — AINERGY will follow up to design a plan around it."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-graphite-900/40 p-6">
              <Mail className="mt-0.5 h-5 w-5 text-teal-300" />
              <div>
                <p className="text-sm font-medium text-offwhite-100">Email</p>
                <p className="mt-1 text-sm text-offwhite-300/60">
                  hello@ainergy.in
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-graphite-900/40 p-6">
              <MessageCircle className="mt-0.5 h-5 w-5 text-teal-300" />
              <div>
                <p className="text-sm font-medium text-offwhite-100">
                  WhatsApp
                </p>
                <p className="mt-1 text-sm text-offwhite-300/60">
                  Available once configured — reach us by email in the
                  meantime.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-graphite-900/40 p-6">
              <MapPin className="mt-0.5 h-5 w-5 text-teal-300" />
              <div>
                <p className="text-sm font-medium text-offwhite-100">
                  AINERGY Renewable LLP
                </p>
                <p className="mt-1 text-sm text-offwhite-300/60">
                  Registered office address to be published.
                </p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
