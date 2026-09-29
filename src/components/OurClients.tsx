import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";

const CLIENTS = [
  { src: "/Ourclients1.jpeg", name: "Serentica Renewables" },
  { src: "/Ourclients2.png", name: "Tata Power" },
  { src: "/Ourclients3.jpeg", name: "Ayaana Power" },
] as const;

export function OurClients() {
  return (
    <section className="bg-paper-50 pt-8 pb-14 lg:pt-12 lg:pb-20">
      <Container>
        <SectionHeader
          align="center"
          eyebrow="Our clients"
          title="Trusted by energy businesses."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-6">
          {CLIENTS.map((client, i) => (
            <li key={client.name}>
              <Reveal delay={i * 0.06}>
                <div className="flex h-32 items-center justify-center rounded-3xl border border-ink-900/10 bg-white px-6 shadow-sm sm:h-36">
                  <Image
                    src={client.src}
                    alt={client.name}
                    width={720}
                    height={280}
                    className="h-16 w-auto max-w-full object-contain sm:h-20"
                  />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
