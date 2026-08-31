import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { WATTPE_TEASER_TAGS } from "@/lib/productsContent";

export function WattPeTeaser() {
  return (
    <Reveal delay={0.1}>
      <div className="mt-10">
        <p className="font-mono-tag text-xs uppercase text-current-600">
          What WattPe enables
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {WATTPE_TEASER_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ink-900/10 bg-paper-100 px-4 py-2 text-sm text-ink-700 transition-colors hover:border-forest-500/30 hover:bg-forest-500/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
