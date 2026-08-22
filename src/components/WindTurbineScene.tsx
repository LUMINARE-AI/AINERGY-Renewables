import { cn } from "@/lib/utils";

/**
 * Signature hero visual: a wind turbine at golden hour, overlooking a solar
 * field and a C&I facility, connected by an intelligent energy network.
 * Rendered as tuned SVG rather than a 3D scene or raster photo — keeps the
 * hero fast and crisp on every device (no WebGL cost, no image weight)
 * while reading as a premium, cinematic illustration. Blade rotation is
 * pure CSS and is disabled automatically under prefers-reduced-motion (see
 * globals.css). Palette is drawn entirely from the brand's current/forest/
 * paper tokens (tailwind.config.ts) rather than one-off hex values.
 */
export function WindTurbineScene({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-[4/5] w-full sm:aspect-[16/12] lg:aspect-[4/5]", className)}>
      <svg
        viewBox="0 0 800 1000"
        className="h-full w-full"
        role="img"
        aria-label="Illustration of a wind turbine at golden hour, overlooking a solar field and a business facility, connected by an intelligent energy network"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04140e" />
            <stop offset="38%" stopColor="#062018" />
            <stop offset="66%" stopColor="#0a2e22" />
            <stop offset="100%" stopColor="#0f4230" />
          </linearGradient>
          <radialGradient id="horizonGlow" cx="50%" cy="100%" r="75%">
            <stop offset="0%" stopColor="#F0A93E" stopOpacity="0.30" />
            <stop offset="55%" stopColor="#D98A1E" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#D98A1E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F8C976" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F0A93E" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#F0A93E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hillsFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f4230" />
            <stop offset="100%" stopColor="#0a2e22" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#155a40" />
            <stop offset="100%" stopColor="#04140e" />
          </linearGradient>
          <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c9468" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a2e22" />
          </linearGradient>
          {/* Tower: light-struck left face, shadowed right face — reads as a
              rounded, cylindrical tube rather than a flat gradient panel. */}
          <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FCFAF5" />
            <stop offset="35%" stopColor="#F7F2E8" />
            <stop offset="70%" stopColor="#D8D2C2" />
            <stop offset="100%" stopColor="#A89C7E" />
          </linearGradient>
          <linearGradient id="nacelle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCFAF5" />
            <stop offset="100%" stopColor="#C7BC9C" />
          </linearGradient>
          <linearGradient id="blade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F7F2E8" />
            <stop offset="60%" stopColor="#FCFAF5" />
            <stop offset="100%" stopColor="#D8D2C2" />
          </linearGradient>
        </defs>

        <rect width="800" height="1000" fill="url(#sky)" />

        {/* soft cloud wisps, high atmosphere */}
        <g fill="#F7F2E8" opacity="0.05">
          <ellipse cx="150" cy="140" rx="110" ry="14" />
          <ellipse cx="640" cy="90" rx="90" ry="11" />
          <ellipse cx="420" cy="180" rx="70" ry="9" />
        </g>

        {/* sun + horizon glow, low on the skyline for a golden-hour read */}
        <ellipse cx="560" cy="560" rx="360" ry="220" fill="url(#horizonGlow)" />
        <circle cx="560" cy="330" r="230" fill="url(#sun)" />
        <circle cx="560" cy="330" r="42" fill="#F8C976" fillOpacity="0.9" />

        {/* distant transmission lines, high above the hills */}
        <g stroke="#F0A93E" strokeOpacity="0.22" strokeWidth="1.5">
          <path d="M0 500 L800 440" />
          <path d="M0 540 L800 480" />
        </g>
        <g className="ainergy-flow" stroke="#F0A93E" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round">
          <path d="M40 525 L760 460" fill="none" />
        </g>

        {/* rolling hill horizon — soft curves instead of a hard diagonal cut */}
        <path
          d="M0 600 C 140 560, 260 585, 380 555 C 520 520, 620 560, 800 520 L800 1000 L0 1000 Z"
          fill="url(#hillsFar)"
          opacity="0.55"
        />
        <path
          d="M0 660 C 160 615, 300 650, 440 610 C 580 575, 660 615, 800 585 L800 1000 L0 1000 Z"
          fill="url(#ground)"
        />

        {/* solar field, laid out in receding perspective rows */}
        <g opacity="0.95">
          {Array.from({ length: 4 }).map((_, row) => {
            const rowY = 655 + row * 46;
            const rowScale = 1 - row * 0.14;
            const panelsInRow = 6 - row;
            return (
              <g key={row} transform={`translate(430 ${rowY}) scale(${rowScale})`}>
                {Array.from({ length: panelsInRow }).map((_, i) => (
                  <g key={i} transform={`translate(${i * 54} 0) skewX(-16)`}>
                    <rect width="42" height="22" rx="1.5" fill="url(#panel)" stroke="#4db787" strokeOpacity="0.4" strokeWidth="0.75" />
                    <line x1="0" y1="11" x2="42" y2="11" stroke="#04140e" strokeOpacity="0.3" strokeWidth="0.75" />
                  </g>
                ))}
              </g>
            );
          })}
        </g>

        {/* transmission towers linking the field to the facility */}
        <g stroke="#4db787" strokeOpacity="0.55" strokeWidth="2" fill="none">
          <path d="M120 660 L100 585 L80 660 M85 605 L115 605 M90 625 L110 625" />
          <path d="M250 675 L230 600 L210 675 M215 620 L245 620 M220 640 L240 640" />
        </g>
        <g className="ainergy-flow" stroke="#F0A93E" strokeWidth="1.5" strokeDasharray="4 8">
          <path d="M100 585 L230 600" fill="none" />
        </g>

        {/* C&I facility silhouette, with its own rooftop array */}
        <g fill="#062018" stroke="#1c7350" strokeWidth="1.5">
          <rect x="520" y="712" width="220" height="148" />
          <rect x="560" y="670" width="70" height="42" />
          <rect x="660" y="648" width="16" height="64" />
        </g>
        <g transform="translate(538 700) skewX(-10)" opacity="0.9">
          {Array.from({ length: 5 }).map((_, i) => (
            <rect key={i} x={i * 21} y="0" width="16" height="9" rx="1" fill="url(#panel)" stroke="#4db787" strokeOpacity="0.4" strokeWidth="0.5" />
          ))}
        </g>
        <g fill="#F8C976" fillOpacity="0.5">
          <rect x="545" y="752" width="18" height="18" />
          <rect x="580" y="752" width="18" height="18" />
          <rect x="615" y="752" width="18" height="18" />
          <rect x="650" y="752" width="18" height="18" />
          <rect x="685" y="752" width="18" height="18" />
        </g>

        {/* energy flowing from the field toward the facility */}
        <g className="ainergy-flow" stroke="#F0A93E" strokeWidth="2" strokeDasharray="3 9" strokeLinecap="round">
          <path d="M300 540 C 420 580, 480 650, 560 710" fill="none" />
        </g>

        {/* ground shadow beneath the turbine, grounds it in the scene */}
        <ellipse cx="300" cy="905" rx="70" ry="10" fill="#04140e" opacity="0.5" />

        {/* WIND TURBINE — tapered tubular tower, elongated nacelle + spinner,
            three aerofoil-tapered blades with a subtle twist highlight. */}
        <g>
          {/* tower: two-segment taper reads as a rounded tube, not a flat cone */}
          <path d="M283 900 L291 466 L309 466 L317 900 Z" fill="url(#tower)" />
          <path d="M291 466 L295 466 L301 900 L317 900 L309 466 Z" fill="#A89C7E" opacity="0.35" />
          <line x1="300" y1="900" x2="300" y2="466" stroke="#FCFAF5" strokeOpacity="0.5" strokeWidth="1" />

          {/* nacelle: elongated pod with a small tail flange */}
          <path d="M262 462 L336 462 C 340 462 342 464 342 468 L342 482 C 342 486 340 488 336 488 L262 488 C 258 488 256 486 256 482 L256 468 C 256 464 258 462 262 462 Z" fill="url(#nacelle)" />
          <rect x="332" y="468" width="10" height="14" rx="2" fill="#C7BC9C" />

          {/* rotor hub + blades, rotating */}
          <g className="ainergy-rotor" style={{ transformOrigin: "292px 475px" }}>
            <g fill="url(#blade)">
              <path d="M292 475 C 288 470, 283 462, 281 448 C 277 415, 277 360, 288 305 C 291 291, 296 285, 300 285 C 304 285, 306 294, 306 308 C 306 360, 302 415, 297 448 C 295 462, 296 470, 292 475 Z" />
              <path
                d="M292 475 C 288 470, 283 462, 281 448 C 277 415, 277 360, 288 305 C 291 291, 296 285, 300 285 C 304 285, 306 294, 306 308 C 306 360, 302 415, 297 448 C 295 462, 296 470, 292 475 Z"
                transform="rotate(120 292 475)"
              />
              <path
                d="M292 475 C 288 470, 283 462, 281 448 C 277 415, 277 360, 288 305 C 291 291, 296 285, 300 285 C 304 285, 306 294, 306 308 C 306 360, 302 415, 297 448 C 295 462, 296 470, 292 475 Z"
                transform="rotate(240 292 475)"
              />
              {/* subtle twist-line down each blade for dimensionality */}
              <path d="M293 460 C 291 400, 293 350, 297 310" fill="none" stroke="#A89C7E" strokeOpacity="0.4" strokeWidth="1" />
              <path d="M293 460 C 291 400, 293 350, 297 310" fill="none" stroke="#A89C7E" strokeOpacity="0.4" strokeWidth="1" transform="rotate(120 292 475)" />
              <path d="M293 460 C 291 400, 293 350, 297 310" fill="none" stroke="#A89C7E" strokeOpacity="0.4" strokeWidth="1" transform="rotate(240 292 475)" />
            </g>
            <circle cx="292" cy="475" r="9" fill="#F7F2E8" stroke="#A89C7E" strokeWidth="1" />
          </g>
        </g>

        {/* distributed grid nodes, pulsing */}
        {[
          [150, 770],
          [380, 840],
          [430, 555],
          [630, 555],
        ].map(([cx, cy], i) => (
          <g key={i} className="ainergy-pulse" style={{ animationDelay: `${i * 0.6}s` }}>
            <circle cx={cx} cy={cy} r="5" fill="#F0A93E" />
            <circle cx={cx} cy={cy} r="12" fill="none" stroke="#F0A93E" strokeOpacity="0.4" />
          </g>
        ))}
      </svg>

      <style>{`
        .ainergy-rotor {
          animation: ainergy-spin 22s linear infinite;
        }
        @keyframes ainergy-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ainergy-flow path {
          animation: ainergy-dash 2.4s linear infinite;
        }
        @keyframes ainergy-dash {
          to { stroke-dashoffset: -40; }
        }
        .ainergy-pulse circle:last-child {
          animation: ainergy-ping 2.6s cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes ainergy-ping {
          0% { r: 5px; opacity: 0.9; }
          80%, 100% { r: 22px; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ainergy-rotor, .ainergy-flow path, .ainergy-pulse circle:last-child {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
