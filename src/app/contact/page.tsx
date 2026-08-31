import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Build My Energy Plan",
  description:
    "Tell AINERGY about your business's electricity consumption and requirements to start designing your energy plan.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="relative min-h-[42dvh] overflow-hidden bg-paper-50 sm:min-h-[48dvh] lg:min-h-[52dvh]">
        <Image
          src="/contactBG.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      </section>

      <section className="surface-dark relative overflow-hidden bg-ink-950 pb-24 lg:pb-32">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative pt-12 lg:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div className="space-y-5">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-graphite-900/40 p-6">
                <Mail className="mt-0.5 h-5 w-5 text-current-300" />
                <div>
                  <p className="text-sm font-medium text-offwhite-100">Email</p>
                  <p className="mt-1 text-sm text-offwhite-300/60">
                    contact@aienergy.in
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-graphite-900/40 p-6">
                <MessageCircle className="mt-0.5 h-5 w-5 text-current-300" />
                <div>
                  <p className="text-sm font-medium text-offwhite-100">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-sm text-offwhite-300/60">
                    <a
                      href="https://wa.me/919887270041"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-current-300"
                    >
                      +91 98872 70041
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-graphite-900/40 p-6">
                <MapPin className="mt-0.5 h-5 w-5 text-current-300" />
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
    </>
  );
}
