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
    <section className="relative overflow-hidden bg-paper-50 pb-24 pt-32 sm:pb-28 sm:pt-36 lg:pt-44">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-current-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-current-400/10 blur-3xl"
      />

      <Container className="relative">
        <SectionHeader
          eyebrow="Contact"
          title="Build My Energy Plan"
          description="Tell us about your business's electricity consumption and requirements. We'll start designing from there."
        />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-2xl border border-ink-900/10 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <Mail className="mt-0.5 h-5 w-5 text-current-600" />
              <div>
                <p className="text-sm font-medium text-ink-900">Email</p>
                <p className="mt-1 text-sm text-ink-600">reach@ainergyrenewables.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-ink-900/10 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <MessageCircle className="mt-0.5 h-5 w-5 text-current-600" />
              <div>
                <p className="text-sm font-medium text-ink-900">WhatsApp</p>
                <p className="mt-1 text-sm text-ink-600">
                  <a
                    href="https://wa.me/919887270041"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-current-600"
                  >
                    +91 98872 70041
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-ink-900/10 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <MapPin className="mt-0.5 h-5 w-5 text-current-600" />
              <div>
                <p className="text-sm font-medium text-ink-900">
                  AINERGY Renewable LLP
                </p>
                <p className="mt-1 text-sm text-ink-600">
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
