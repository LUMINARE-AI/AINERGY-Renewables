import { cn } from "@/lib/utils";

/**
 * Signature hero visual: a realistic, elegant wind turbine set against a
 * distant solar field and C&I facility, rendered as tuned SVG rather than
 * a 3D scene. This keeps the hero fast and consistent on every device
 * (no WebGL cost, no hydration weight) while still reading as a premium,
 * cinematic illustration. Blade rotation is pure CSS and is disabled
 * automatically under prefers-reduced-motion (see globals.css).
 */
export function WindTurbineScene({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-[4/5] w-full sm:aspect-[16/12] lg:aspect-[4/5]", className)}>
      <svg
        viewBox="0 0 800 1000"
        className="h-full w-full"
        role="img"
        aria-label="Illustration of a wind turbine, solar field and business facility connected by an intelligent energy network"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04140e" />
            <stop offset="45%" stopColor="#062018" />
            <stop offset="100%" stopColor="#0a2e22" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af6a" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#c19a4b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c19a4b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f4230" />
            <stop offset="100%" stopColor="#062018" />
          </linearGradient>
          <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8e5dc" />
            <stop offset="50%" stopColor="#c7c4bb" />
            <stop offset="100%" stopColor="#9a988f" />
          </linearGradient>
          <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#155a40" />
            <stop offset="100%" stopColor="#0a2e22" />
          </linearGradient>
        </defs>

        <rect width="800" height="1000" fill="url(#sky)" />
        <circle cx="560" cy="260" r="230" fill="url(#sun)" />
        <circle cx="560" cy="260" r="46" fill="#d4af6a" fillOpacity="0.85" />

        {/* distant grid / transmission lines */}
        <g stroke="#2dd4c8" strokeOpacity="0.25" strokeWidth="1.5">
          <path d="M0 520 L800 460" />
          <path d="M0 560 L800 500" />
        </g>
        <g className="ainergy-flow" stroke="#2dd4c8" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round">
          <path d="M40 545 L760 480" fill="none" />
        </g>

        {/* ground */}
        <path d="M0 620 L800 560 L800 1000 L0 1000 Z" fill="url(#ground)" />

        {/* distant solar field */}
        <g opacity="0.9">
          {Array.from({ length: 6 }).map((_, i) => {
            const x = 470 + i * 52;
            const y = 600 - i * 6;
            return (
              <g key={i} transform={`translate(${x} ${y}) skewX(-18)`}>
                <rect width="40" height="24" rx="1.5" fill="url(#panel)" stroke="#2c9468" strokeWidth="0.75" />
              </g>
            );
          })}
        </g>

        {/* transmission towers */}
        <g stroke="#4db787" strokeOpacity="0.5" strokeWidth="2" fill="none">
          <path d="M120 640 L100 560 L80 640 M85 585 L115 585 M90 605 L110 605" />
          <path d="M240 660 L220 580 L200 660 M205 605 L235 605 M210 625 L230 625" />
        </g>
        <g className="ainergy-flow" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 8">
          <path d="M100 560 L220 580" fill="none" />
        </g>

        {/* C&I facility silhouette */}
        <g fill="#0a2e22" stroke="#1c7350" strokeWidth="1.5">
          <rect x="520" y="700" width="220" height="140" />
          <rect x="560" y="660" width="70" height="40" />
          <rect x="660" y="640" width="16" height="60" />
        </g>
        <g fill="#d4af6a" fillOpacity="0.55">
          <rect x="545" y="740" width="18" height="18" />
          <rect x="580" y="740" width="18" height="18" />
          <rect x="615" y="740" width="18" height="18" />
          <rect x="650" y="740" width="18" height="18" />
          <rect x="685" y="740" width="18" height="18" />
        </g>

        {/* energy particles flowing to the facility */}
        <g className="ainergy-flow" stroke="#2dd4c8" strokeWidth="2" strokeDasharray="3 9" strokeLinecap="round">
          <path d="M300 520 C 420 560, 480 640, 560 700" fill="none" />
        </g>

        {/* WIND TURBINE */}
        <g>
          {/* tower */}
          <path d="M296 900 L286 480 L314 480 L304 900 Z" fill="url(#tower)" />
          {/* nacelle */}
          <rect x="272" y="462" width="56" height="26" rx="6" fill="#e8e5dc" />
          {/* rotor hub + blades, rotating */}
          <g className="ainergy-rotor" style={{ transformOrigin: "300px 475px" }}>
            <circle cx="300" cy="475" r="7" fill="#c7c4bb" />
            <g fill="#f2f0ea">
              <path d="M300 475 L292 475 C 280 400 284 340 300 300 C 316 340 320 400 308 475 Z" />
              <path
                d="M300 475 L292 475 C 280 400 284 340 300 300 C 316 340 320 400 308 475 Z"
                transform="rotate(120 300 475)"
              />
              <path
                d="M300 475 L292 475 C 280 400 284 340 300 300 C 316 340 320 400 308 475 Z"
                transform="rotate(240 300 475)"
              />
            </g>
          </g>
        </g>

        {/* distributed nodes */}
        {[
          [150, 760],
          [380, 830],
          [430, 560],
          [630, 560],
        ].map(([cx, cy], i) => (
          <g key={i} className="ainergy-pulse" style={{ animationDelay: `${i * 0.6}s` }}>
            <circle cx={cx} cy={cy} r="5" fill="#2dd4c8" />
            <circle cx={cx} cy={cy} r="12" fill="none" stroke="#2dd4c8" strokeOpacity="0.4" />
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
