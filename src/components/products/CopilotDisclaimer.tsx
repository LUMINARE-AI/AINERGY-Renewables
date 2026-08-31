import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { COPILOT_DISCLAIMER } from "@/lib/productsContent";

export function CopilotDisclaimer() {
  return (
    <div className="border-t border-white/10 py-12 lg:py-16">
      <Container>
        <Reveal>
          <div className="max-w-3xl rounded-2xl border border-current-500/20 bg-current-400/5 px-6 py-5">
            <p className="font-mono-tag text-xs uppercase text-current-300">
              Important
            </p>
            <p className="mt-3 text-sm leading-relaxed text-offwhite-300/80">
              {COPILOT_DISCLAIMER}
            </p>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
