import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";
import { WattPeTeaser } from "@/components/products/WattPeTeaser";
import { WATTPE_URL } from "@/lib/data";

function WattPeIllustration() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-forest-500/20 bg-gradient-to-br from-forest-500/10 via-paper-50 to-current-400/10 p-8 shadow-premium">
      <svg
        viewBox="0 0 320 240"
        className="mx-auto h-auto w-full max-w-xs"
        aria-hidden
      >
        <defs>
          <linearGradient id="wattpe-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3abbc2" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#155a40" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect width="320" height="240" fill="url(#wattpe-sky)" rx="12" />
        <circle cx="260" cy="50" r="28" fill="#f5c842" opacity="0.85" />
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 3 }).map((__, col) => (
            <rect
              key={`${row}-${col}`}
              x={40 + col * 90}
              y={120 + row * 22}
              width="70"
              height="18"
              rx="2"
              fill="#155a40"
              opacity="0.7"
              transform="skewX(-12)"
            />
          ))
        )}
        {[0, 1, 2].map((i) => (
          <rect
            key={`bldg-${i}`}
            x={50 + i * 95}
            y={60 + (i % 2) * 10}
            width="55"
            height={70 - i * 8}
            rx="3"
            fill="#151c1d"
            opacity="0.12"
          />
        ))}
      </svg>
      <p className="mt-4 text-center text-sm italic text-ink-600">
        Community energy beyond the rooftop
      </p>
    </div>
  );
}

export function WattPeSection() {
  return (
    <section
      id="wattpe"
      className="scroll-mt-28 bg-paper-50 py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <span className="font-mono-tag text-xs uppercase text-forest-600">
                Product — WattPe
              </span>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl">
                Community Energy Beyond the Rooftop
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-700/85">
                WattPe is AINERGY&apos;s separate community-energy platform. It
                should have its own consumer-first website.
              </p>
              <blockquote className="mt-6 border-l-2 border-forest-500/40 pl-5 font-display text-xl font-medium text-ink-800">
                &ldquo;You Don&apos;t Need a Roof to Participate in Solar.&rdquo;
              </blockquote>
              <div className="mt-8">
                <Button href={WATTPE_URL} size="lg" icon external>
                  Visit WattPe
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <WattPeIllustration />
          </Reveal>
        </div>

        <WattPeTeaser />
      </Container>
    </section>
  );
}
