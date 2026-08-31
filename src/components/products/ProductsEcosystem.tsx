import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";

export function ProductsEcosystem() {
  return (
    <section className="border-t border-ink-900/8 bg-paper-100 py-16 lg:py-20">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-md text-center">
            <p className="font-display text-lg font-medium text-ink-900">
              AINERGY
            </p>
            <div className="mx-auto my-3 h-8 w-px bg-gradient-to-b from-current-500/50 to-forest-500/50" />
            <p className="font-mono-tag text-xs uppercase text-current-600">
              Digital Products
            </p>
            <div className="relative mx-auto mt-6 flex justify-center gap-8 sm:gap-16">
              <div className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-current-500/40 to-transparent sm:w-32" />
              <div className="flex flex-col items-center gap-2 pt-4">
                <div className="h-6 w-px bg-current-500/30" />
                <span className="text-sm font-medium text-ink-800">
                  AI Energy Copilot
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 pt-4">
                <div className="h-6 w-px bg-forest-500/30" />
                <span className="text-sm font-medium text-ink-800">WattPe</span>
              </div>
            </div>
            <p className="mt-8 text-sm leading-relaxed text-ink-600">
              Both products sit within AINERGY&apos;s broader Energy OS ecosystem
              — one analytical layer for C&amp;I, one community platform for
              participation.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
