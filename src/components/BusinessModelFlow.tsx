"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Sun,
  Wind,
  Battery,
  Building2,
  IndianRupee,
  FileText,
  Car,
  Zap,
  Sparkles,
  MousePointerClick,
  User,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    id: "generation",
    step: "1. GENERATION",
    caption: "We build & operate",
    tooltip:
      "We develop and operate solar, wind and battery storage assets that generate clean power for the network.",
  },
  {
    id: "ci",
    step: "2. TO C&I BUSINESSES",
    caption: "For their use",
    tooltip:
      "Commercial and industrial businesses consume renewable energy to power their operations.",
  },
  {
    id: "revenue",
    step: "3. REVENUE FROM C&I",
    caption: "Against energy",
    tooltip:
      "Businesses pay for the energy they use, creating revenue tied to actual consumption.",
  },
  {
    id: "credits",
    step: "4. SHARED WITH USERS",
    caption: "As AINERGY Credits",
    tooltip:
      "A portion of that revenue is shared with you as AINERGY Credits — your stake in clean energy.",
  },
  {
    id: "use",
    step: "5. USE CREDITS",
    caption: "Pay Electricity Bill / EV",
    tooltip:
      "Redeem your AINERGY Credits toward electricity bill payments or EV charging.",
  },
] as const;

const SOURCES = [
  { id: "solar", label: "SOLAR", Icon: Sun },
  { id: "wind", label: "WIND", Icon: Wind },
  { id: "bess", label: "BESS", Icon: Battery },
] as const;

const OUTPUTS = [
  {
    id: "bill",
    label: "ELECTRICITY BILL PAYMENT",
    Icon: FileText,
    tooltip: "Apply credits directly toward your electricity bill payments.",
  },
  {
    id: "ev",
    label: "EV CHARGING PAYMENT",
    Icon: Car,
    tooltip: "Use credits to pay for EV charging at partner stations.",
  },
] as const;

type StageId = (typeof STAGES)[number]["id"];

type PulseConfig = {
  delay: number;
  duration: number;
};

/** Organic stagger: 3–5 pulses per path with varied speed and offset. */
const SOURCE_PULSES: PulseConfig[] = [
  { delay: 0, duration: 2.7 },
  { delay: 0.85, duration: 3.15 },
  { delay: 1.65, duration: 2.55 },
  { delay: 2.45, duration: 3.4 },
  { delay: 3.35, duration: 2.95 },
];

const MAIN_PULSES: PulseConfig[] = [
  { delay: 0.15, duration: 2.35 },
  { delay: 0.95, duration: 2.85 },
  { delay: 1.7, duration: 2.5 },
  { delay: 2.55, duration: 3.05 },
  { delay: 3.35, duration: 2.65 },
  { delay: 4.1, duration: 2.9 },
];

const BRANCH_PULSES: PulseConfig[] = [
  { delay: 0.3, duration: 2.2 },
  { delay: 1.05, duration: 2.75 },
  { delay: 1.85, duration: 2.45 },
  { delay: 2.7, duration: 2.95 },
  { delay: 3.55, duration: 2.6 },
];

type PathKey =
  | "solar"
  | "wind"
  | "bess"
  | "genToCi"
  | "ciToRev"
  | "revToCred"
  | "credToSplit"
  | "credToBill"
  | "credToEv";

const HOVER_PATHS: Record<string, PathKey[]> = {
  solar: ["solar"],
  wind: ["wind"],
  bess: ["bess"],
  "generation-hub": ["solar", "wind", "bess", "genToCi"],
  generation: ["solar", "wind", "bess", "genToCi"],
  ci: ["genToCi", "ciToRev"],
  revenue: ["genToCi", "ciToRev", "revToCred"],
  credits: ["revToCred", "credToSplit", "credToBill", "credToEv"],
  use: ["credToSplit", "credToBill", "credToEv"],
  bill: ["credToBill"],
  ev: ["credToEv"],
};

const FULL_PULSE_CONFIGS = [
  { pathKey: "solar", pulses: SOURCE_PULSES.slice(0, 3), offset: 0.1 },
  { pathKey: "wind", pulses: SOURCE_PULSES.slice(0, 3), offset: 0.45 },
  { pathKey: "bess", pulses: SOURCE_PULSES.slice(0, 3), offset: 0.85 },
  { pathKey: "genToCi", pulses: MAIN_PULSES.slice(0, 3), offset: 0.35 },
  { pathKey: "ciToRev", pulses: MAIN_PULSES.slice(0, 3), offset: 1.1 },
  { pathKey: "revToCred", pulses: MAIN_PULSES.slice(1, 4), offset: 1.65 },
  { pathKey: "credToSplit", pulses: MAIN_PULSES.slice(0, 2), offset: 2.2 },
  { pathKey: "credToBill", pulses: BRANCH_PULSES.slice(0, 3), offset: 2.65 },
  { pathKey: "credToEv", pulses: BRANCH_PULSES.slice(0, 3), offset: 3.15 },
] as const;

const SEGMENT_DELAYS = {
  solar: [0, 1.4],
  wind: [0.35, 1.75],
  bess: [0.7, 2.1],
  genToCi: [0.25, 1.55],
  ciToRev: [0.55, 1.85],
  revToCred: [0.85, 2.15],
  credToSplit: [1.15, 2.45],
  credToBill: [1.45, 2.75],
  credToEv: [1.75, 3.05],
} as const;

function isPathHighlighted(pathKey: PathKey, hovered: string | null) {
  if (!hovered) return false;
  return HOVER_PATHS[hovered]?.includes(pathKey) ?? false;
}

function StaticFlowLine({
  d,
  variant = "solid",
  reducedMotion,
  pathKey,
  hovered,
}: {
  d: string;
  variant?: "solid" | "dotted";
  reducedMotion: boolean;
  pathKey?: PathKey;
  hovered?: string | null;
}) {
  const stroke = variant === "solid" ? "#08797F" : "#3ABBC2";
  const width = variant === "solid" ? 2.5 : 2;
  const highlighted = pathKey ? isPathHighlighted(pathKey, hovered ?? null) : false;
  const baseOpacity = highlighted ? 0.55 : variant === "solid" ? 0.32 : 0.28;

  return (
    <g className="transition-opacity duration-300">
      <path
        d={d}
        fill="none"
        stroke="rgba(8,121,127,0.08)"
        strokeWidth={width + 2}
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        opacity={baseOpacity}
        className={cn(
          "transition-opacity duration-300",
          highlighted && "bm-path-highlight",
          reducedMotion && "bm-static-glow"
        )}
        strokeDasharray={variant === "dotted" ? "1 8" : undefined}
      />
      {highlighted && (
        <path
          d={d}
          fill="none"
          stroke="#3ABBC2"
          strokeWidth={width + 0.5}
          strokeLinecap="round"
          opacity={0.35}
          strokeDasharray={variant === "dotted" ? "1 8" : undefined}
          className="bm-path-highlight"
        />
      )}
    </g>
  );
}

function getPathGeometry(d: string) {
  const ns = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", d);
  return { path, length: path.getTotalLength() };
}

type FlatPulse = {
  pathKey: string;
  pathD: string;
  delay: number;
  duration: number;
};

function buildFlatPulses(
  paths: Record<string, string>,
  configs: readonly { pathKey: string; pulses: readonly PulseConfig[]; offset?: number }[]
): FlatPulse[] {
  return configs.flatMap(({ pathKey, pulses, offset = 0 }) =>
    pulses.map((pulse) => ({
      pathKey,
      pathD: paths[pathKey],
      delay: pulse.delay + offset,
      duration: pulse.duration,
    }))
  );
}

function getGeometries(paths: Record<string, string>) {
  const map = new Map<string, { path: SVGPathElement; length: number }>();
  Object.entries(paths).forEach(([key, d]) => {
    map.set(key, getPathGeometry(d));
  });
  return map;
}

function SvgFlowSegments({
  segments,
  enabled,
  hovered,
}: {
  segments: {
    pathKey?: PathKey;
    d: string;
    variant?: "solid" | "dotted";
    delays: readonly number[];
  }[];
  enabled: boolean;
  hovered?: string | null;
}) {
  if (!enabled) return null;

  return (
    <g className="bm-segments" pointerEvents="none">
      {segments.flatMap(({ pathKey, d, variant = "solid", delays }, segIdx) =>
        delays.map((delay, i) => {
          const highlighted = pathKey ? isPathHighlighted(pathKey, hovered ?? null) : false;
          return (
            <path
              key={`${segIdx}-${i}-${delay}`}
              d={d}
              fill="none"
              stroke={variant === "solid" ? "#3ABBC2" : "#08797F"}
              strokeWidth={variant === "solid" ? 2 : 1.75}
              strokeLinecap="round"
              strokeDasharray="4 22"
              opacity={highlighted ? 0.88 : 0.62}
              className="transition-opacity duration-300"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-26"
                dur={`${2.4 + i * 0.35}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </path>
          );
        })
      )}
    </g>
  );
}

function MovingPulseDots({
  flatPulses,
  paths,
  running,
}: {
  flatPulses: FlatPulse[];
  paths: Record<string, string>;
  running: boolean;
}) {
  const [time, setTime] = useState(0);
  const [ready, setReady] = useState(false);
  const geomsRef = useRef<Map<string, { path: SVGPathElement; length: number }> | null>(
    null
  );

  useEffect(() => {
    geomsRef.current = getGeometries(paths);
    setReady(true);
  }, [paths]);

  useEffect(() => {
    if (!running || !ready) return;

    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      setTime((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, ready]);

  if (!running || !ready) return null;

  const geoms = geomsRef.current;
  if (!geoms) return null;

  return (
    <g className="bm-pulses" pointerEvents="none">
      {flatPulses.map((pulse, i) => {
        const geom = geoms.get(pulse.pathKey);
        if (!geom || geom.length <= 0) return null;

        const cycle = time - pulse.delay;
        if (cycle < 0) return null;

        const progress = (cycle % pulse.duration) / pulse.duration;
        const point = geom.path.getPointAtLength(progress * geom.length);
        const fade =
          progress < 0.06
            ? progress / 0.06
            : progress > 0.85
              ? Math.max(0, (1 - progress) / 0.15)
              : 1;

        const trailOffsets = [-0.018, -0.035, -0.052];

        return (
          <g key={`${pulse.pathKey}-${pulse.delay}-${i}`} opacity={Math.min(1, fade * 0.95)}>
            {trailOffsets.map((offset, ti) => {
              const trailProgress = Math.max(0, progress + offset);
              const trailPoint = geom.path.getPointAtLength(trailProgress * geom.length);
              return (
                <circle
                  key={ti}
                  cx={trailPoint.x}
                  cy={trailPoint.y}
                  r={1.4 - ti * 0.25}
                  fill="#3ABBC2"
                  opacity={0.18 + (2 - ti) * 0.1}
                />
              );
            })}
            <g transform={`translate(${point.x}, ${point.y})`}>
              <circle cx="0" cy="0" r="5" fill="#3ABBC2" opacity="0.22" />
              <circle cx="0" cy="0" r="2.6" fill="#B8E8EA" opacity="0.98" />
              <circle cx="0" cy="0" r="1.2" fill="#ffffff" opacity="0.95" />
            </g>
          </g>
        );
      })}
    </g>
  );
}

function NodeArrivalFlash({
  size,
  pulses,
  offset = 0,
  strong = false,
}: {
  size: number;
  pulses: PulseConfig[];
  offset?: number;
  strong?: boolean;
}) {
  return (
    <>
      {pulses.slice(0, 2).map((pulse, i) => {
        const dur = pulse.duration;
        const begin = pulse.delay + offset;
        return (
          <g key={`flash-${i}-${begin}`}>
            <circle
              r={size / 2 + 3}
              fill="none"
              stroke={strong ? "#D4A05A" : "#3ABBC2"}
              strokeWidth="1"
              opacity="0"
              pointerEvents="none"
            >
              <animate
                attributeName="opacity"
                values="0;0;0.48;0"
                keyTimes="0;0.88;0.96;1"
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values={`${size / 2 + 2};${size / 2 + (strong ? 12 : 9)};${size / 2 + 2}`}
                keyTimes="0;0.96;1"
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
    </>
  );
}

type NodeVariant = "source" | "hub" | "ci" | "revenue" | "credits" | "output";

const NODE_STYLES: Record<
  NodeVariant,
  { fill: string; stroke: string; strokeWidth: number; gradient?: string; glow?: boolean }
> = {
  source: {
    fill: "url(#bm-grad-source)",
    stroke: "rgba(14,92,86,0.3)",
    strokeWidth: 1.5,
    gradient: "bm-grad-source",
  },
  hub: {
    fill: "url(#bm-grad-hub)",
    stroke: "rgba(58,187,194,0.55)",
    strokeWidth: 2,
    gradient: "bm-grad-hub",
    glow: true,
  },
  ci: {
    fill: "url(#bm-grad-ci)",
    stroke: "rgba(58,187,194,0.55)",
    strokeWidth: 2,
    gradient: "bm-grad-ci",
    glow: true,
  },
  revenue: {
    fill: "url(#bm-grad-revenue)",
    stroke: "rgba(14,92,86,0.4)",
    strokeWidth: 1.75,
    gradient: "bm-grad-revenue",
  },
  credits: {
    fill: "url(#bm-grad-credits)",
    stroke: "rgba(212,160,90,0.75)",
    strokeWidth: 2.5,
    gradient: "bm-grad-credits",
    glow: true,
  },
  output: {
    fill: "url(#bm-grad-source)",
    stroke: "rgba(8,121,127,0.4)",
    strokeWidth: 1.75,
    gradient: "bm-grad-source",
  },
};

function StageNode({
  id,
  x,
  y,
  size,
  active,
  hovered,
  onHover,
  reducedMotion,
  animate,
  variant,
  arrivalPulses,
  revealIndex,
  children,
}: {
  id: StageId | "generation-hub" | "bill" | "ev" | "solar" | "wind" | "bess";
  x: number;
  y: number;
  size: number;
  active?: boolean;
  hovered: string | null;
  onHover: (id: string | null) => void;
  reducedMotion: boolean;
  animate: boolean;
  variant: NodeVariant;
  arrivalPulses?: PulseConfig[];
  revealIndex?: number;
  children: ReactNode;
}) {
  const isHovered = hovered === id;
  const isActive = active || isHovered;
  const style = NODE_STYLES[variant];
  const showArrival = animate && !reducedMotion && arrivalPulses?.length;
  const flashPulses = arrivalPulses?.slice(0, 1);
  const isCredits = variant === "credits";
  const revealDelay =
    revealIndex !== undefined && animate && !reducedMotion
      ? `${0.18 + revealIndex * 0.09}s`
      : undefined;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      className={cn(
        "cursor-pointer outline-none",
        revealDelay && "bm-node-enter"
      )}
      style={revealDelay ? { animationDelay: revealDelay } : undefined}
      role="button"
      tabIndex={0}
      aria-label={id}
    >
      {showArrival && flashPulses && variant !== "output" && (
        <NodeArrivalFlash
          size={size}
          pulses={flashPulses}
          strong={isCredits}
        />
      )}

      {isCredits && showArrival && (
        <circle
          r={size / 2 + 6}
          fill="none"
          stroke="url(#bm-grad-credits-ring)"
          strokeWidth="1"
          opacity="0.45"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="24s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      <g
        className="transition-[filter,opacity] duration-300 ease-out"
        filter={style.glow && isActive ? "url(#bm-node-glow)" : "url(#bm-node-shadow)"}
        opacity={isActive ? 1 : 0.98}
      >
        {showArrival &&
          flashPulses!.map((pulse, i) => (
            <animateTransform
              key={`scale-${i}`}
              attributeName="transform"
              type="scale"
              values="1;1;1.025;1"
              keyTimes="0;0.88;0.96;1"
              dur={`${pulse.duration}s`}
              begin={`${pulse.delay}s`}
              repeatCount="indefinite"
              additive="sum"
            />
          ))}
        <circle
          r={size / 2 + 1.5}
          fill="none"
          stroke={isActive ? "#3ABBC2" : style.stroke}
          strokeWidth={isCredits ? 1.25 : 1}
          opacity={isActive ? 0.7 : 0.45}
          className="transition-all duration-300"
        />
        <circle
          r={size / 2}
          fill={style.fill}
          stroke={isActive ? (isCredits ? "#D4A05A" : "#3ABBC2") : style.stroke}
          strokeWidth={isActive ? (isCredits ? 2.75 : 2.25) : style.strokeWidth}
          className={cn("transition-all duration-300", isActive && "bm-node-active")}
        />
      </g>

      <foreignObject
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        className="pointer-events-none overflow-visible"
      >
        <div
          {...({ xmlns: "http://www.w3.org/1999/xhtml" } as React.HTMLAttributes<HTMLDivElement>)}
          className={cn(
            "flex h-full w-full items-center justify-center transition-[transform,filter] duration-300",
            isHovered && "scale-105",
            isActive && "brightness-110"
          )}
        >
          {children}
        </div>
      </foreignObject>

      {showArrival && flashPulses && variant === "output" && (
        <NodeArrivalFlash size={size} pulses={flashPulses} />
      )}

      {showArrival &&
        variant === "output" &&
        flashPulses!.map((pulse, i) => (
          <circle
            key={`ripple-${i}`}
            r={size / 2 + 2}
            fill="none"
            stroke="#3ABBC2"
            strokeWidth="1"
            opacity="0"
            pointerEvents="none"
          >
            <animate
              attributeName="opacity"
              values="0;0;0.55;0"
              keyTimes="0;0.9;0.95;1"
              dur={`${pulse.duration}s`}
              begin={`${pulse.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`${size / 2 + 2};${size / 2 + 14};${size / 2 + 2}`}
              keyTimes="0;0.95;1"
              dur={`${pulse.duration}s`}
              begin={`${pulse.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
    </g>
  );
}

function FlowDefs() {
  return (
    <defs>
      <marker
        id="arrow-teal"
        markerWidth="6"
        markerHeight="6"
        refX="5"
        refY="3"
        orient="auto"
      >
        <path d="M0,0 L6,3 L0,6 Z" fill="#08797F" />
      </marker>

      <pattern id="bm-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.6" fill="rgba(8,121,127,0.08)" />
      </pattern>

      <radialGradient id="bm-network-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3ABBC2" stopOpacity="0.12" />
        <stop offset="55%" stopColor="#3ABBC2" stopOpacity="0.04" />
        <stop offset="100%" stopColor="#3ABBC2" stopOpacity="0" />
      </radialGradient>

      <radialGradient id="bm-grad-source" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F0F4F2" />
      </radialGradient>
      <radialGradient id="bm-grad-hub" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#0F6B64" />
        <stop offset="100%" stopColor="#0A4A45" />
      </radialGradient>
      <radialGradient id="bm-grad-ci" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#0A9699" />
        <stop offset="100%" stopColor="#08797F" />
      </radialGradient>
      <radialGradient id="bm-grad-revenue" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#EEF2F0" />
      </radialGradient>
      <radialGradient id="bm-grad-credits" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FFFDF8" />
        <stop offset="45%" stopColor="#F7F8F6" />
        <stop offset="100%" stopColor="#E8F4F2" />
      </radialGradient>
      <linearGradient id="bm-grad-credits-ring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4A05A" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#3ABBC2" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#D4A05A" stopOpacity="0.6" />
      </linearGradient>

      <filter id="bm-node-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0E5C56" floodOpacity="0.12" />
      </filter>
      <filter id="bm-node-glow" x="-80%" y="-80%" width="260%" height="260%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#3ABBC2" floodOpacity="0.35" />
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0E5C56" floodOpacity="0.1" />
      </filter>
    </defs>
  );
}

function FlowBackground({ cx, cy, width, height }: { cx: number; cy: number; width: number; height: number }) {
  return (
    <g pointerEvents="none">
      <rect x="0" y="0" width={width} height={height} fill="url(#bm-dot-grid)" opacity="0.55" />
      <ellipse cx={cx} cy={cy} rx={width * 0.42} ry={height * 0.38} fill="url(#bm-network-glow)" className="bm-ambient-glow" />
    </g>
  );
}

function AmbientDrift({ width, height, running }: { width: number; height: number; running: boolean }) {
  if (!running) return null;

  const particles = [
    { x: width * 0.2, y: height * 0.35, dur: 14, dx: 8, dy: -6 },
    { x: width * 0.55, y: height * 0.55, dur: 18, dx: -6, dy: 4 },
    { x: width * 0.75, y: height * 0.4, dur: 16, dx: 5, dy: 5 },
    { x: width * 0.35, y: height * 0.65, dur: 20, dx: -4, dy: -3 },
  ];

  return (
    <g className="bm-ambient" pointerEvents="none">
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1" fill="#3ABBC2" opacity="0.2">
          <animate
            attributeName="cx"
            values={`${p.x};${p.x + p.dx};${p.x}`}
            dur={`${p.dur}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${p.y};${p.y + p.dy};${p.y}`}
            dur={`${p.dur}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.08;0.22;0.08"
            dur={`${p.dur * 0.7}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

function StageStepHeader({
  step,
  x,
  y,
  index,
  hovered,
  onHover,
  animate,
}: {
  step: (typeof STAGES)[number];
  x: number;
  y: number;
  index: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
  animate: boolean;
}) {
  const isHovered = hovered === step.id;
  const stepNumber = String(index + 1).padStart(2, "0");
  const title = step.step.replace(/^\d+\.\s*/, "");

  return (
    <g
      transform={`translate(${x}, ${y})`}
      textAnchor="middle"
      onMouseEnter={() => onHover(step.id)}
      onMouseLeave={() => onHover(null)}
      className={cn("cursor-pointer", animate && "bm-step-enter")}
      style={animate ? { animationDelay: `${0.12 + index * 0.08}s` } : undefined}
    >
      <text
        fill={isHovered ? "#08797F" : "#3ABBC2"}
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.12em"
        className="font-mono-tag"
      >
        {stepNumber}
      </text>
      <text
        y="17"
        fill={isHovered ? "#0E5C56" : "#0A4A45"}
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.06em"
        className="font-display uppercase"
      >
        {title}
      </text>
      <text
        y="34"
        fill={isHovered ? "#3D4A44" : "#5A6B63"}
        fontSize="9"
        opacity={isHovered ? 1 : 0.85}
      >
        {step.caption}
      </text>
    </g>
  );
}

const DESKTOP_FLOW_OFFSET_X = 56;
const DESKTOP_FLOW_OFFSET_Y = 18;
const DESKTOP_STEP_HEADER_Y = 8;

const DESKTOP_PATHS = {
  solar: "M 72 58 Q 100 58 118 118",
  wind: "M 72 148 L 118 148",
  bess: "M 72 238 Q 100 238 118 178",
  genToCi: "M 168 148 L 248 148",
  ciToRev: "M 312 148 L 392 148",
  revToCred: "M 456 148 L 536 148",
  credToSplit: "M 600 148 L 680 148",
  credToBill: "M 680 148 Q 730 148 760 98",
  credToEv: "M 680 148 Q 730 148 760 198",
} as const;

const MOBILE_PATHS = {
  solar: "M 60 50 Q 90 50 110 120",
  wind: "M 60 130 L 110 130",
  bess: "M 60 210 Q 90 210 110 140",
  genToCi: "M 158 130 L 220 130",
  ciToRev: "M 268 130 L 330 130",
  revToCred: "M 378 130 L 440 130",
  credToSplit: "M 488 130 L 550 130",
  credToBill: "M 572 130 Q 610 130 640 80",
  credToEv: "M 572 130 Q 610 130 640 180",
} as const;

/** Multi-pulse energy flow across the full network. */
const DESKTOP_PULSE_CONFIGS = FULL_PULSE_CONFIGS;
const MOBILE_PULSE_CONFIGS = FULL_PULSE_CONFIGS;

const DESKTOP_FLAT_PULSES = buildFlatPulses(DESKTOP_PATHS, DESKTOP_PULSE_CONFIGS);
const MOBILE_FLAT_PULSES = buildFlatPulses(MOBILE_PATHS, MOBILE_PULSE_CONFIGS);

const DESKTOP_SEGMENTS = [
  { pathKey: "solar" as const, d: DESKTOP_PATHS.solar, delays: SEGMENT_DELAYS.solar },
  { pathKey: "wind" as const, d: DESKTOP_PATHS.wind, delays: SEGMENT_DELAYS.wind },
  { pathKey: "bess" as const, d: DESKTOP_PATHS.bess, delays: SEGMENT_DELAYS.bess },
  { pathKey: "genToCi" as const, d: DESKTOP_PATHS.genToCi, variant: "solid" as const, delays: SEGMENT_DELAYS.genToCi },
  { pathKey: "ciToRev" as const, d: DESKTOP_PATHS.ciToRev, variant: "dotted" as const, delays: SEGMENT_DELAYS.ciToRev },
  { pathKey: "revToCred" as const, d: DESKTOP_PATHS.revToCred, variant: "dotted" as const, delays: SEGMENT_DELAYS.revToCred },
  { pathKey: "credToSplit" as const, d: DESKTOP_PATHS.credToSplit, variant: "solid" as const, delays: SEGMENT_DELAYS.credToSplit },
  { pathKey: "credToBill" as const, d: DESKTOP_PATHS.credToBill, variant: "solid" as const, delays: SEGMENT_DELAYS.credToBill },
  { pathKey: "credToEv" as const, d: DESKTOP_PATHS.credToEv, variant: "solid" as const, delays: SEGMENT_DELAYS.credToEv },
];

const MOBILE_SEGMENTS = [
  { pathKey: "solar" as const, d: MOBILE_PATHS.solar, delays: SEGMENT_DELAYS.solar },
  { pathKey: "wind" as const, d: MOBILE_PATHS.wind, delays: SEGMENT_DELAYS.wind },
  { pathKey: "bess" as const, d: MOBILE_PATHS.bess, delays: SEGMENT_DELAYS.bess },
  { pathKey: "genToCi" as const, d: MOBILE_PATHS.genToCi, variant: "solid" as const, delays: SEGMENT_DELAYS.genToCi },
  { pathKey: "ciToRev" as const, d: MOBILE_PATHS.ciToRev, variant: "dotted" as const, delays: SEGMENT_DELAYS.ciToRev },
  { pathKey: "revToCred" as const, d: MOBILE_PATHS.revToCred, variant: "dotted" as const, delays: SEGMENT_DELAYS.revToCred },
  { pathKey: "credToSplit" as const, d: MOBILE_PATHS.credToSplit, variant: "solid" as const, delays: SEGMENT_DELAYS.credToSplit },
  { pathKey: "credToBill" as const, d: MOBILE_PATHS.credToBill, variant: "solid" as const, delays: SEGMENT_DELAYS.credToBill },
  { pathKey: "credToEv" as const, d: MOBILE_PATHS.credToEv, variant: "solid" as const, delays: SEGMENT_DELAYS.credToEv },
];

function DesktopFlow({
  hovered,
  setHovered,
  reducedMotion,
  animate,
  isInView,
  networkActive,
  hasRevealed,
}: {
  hovered: string | null;
  setHovered: (id: string | null) => void;
  reducedMotion: boolean;
  animate: boolean;
  isInView: boolean;
  networkActive: boolean;
  hasRevealed: boolean;
}) {
  const activeStage = hovered;
  const runAnimation = animate && networkActive;
  const reveal = animate && hasRevealed;

  const paths = DESKTOP_PATHS;

  return (
    <div className="relative hidden w-full lg:flex lg:flex-col lg:items-center">
      <svg
        viewBox="0 0 980 300"
        className="h-auto w-full max-w-[1100px] bm-flow-svg"
        aria-hidden="true"
      >
        <FlowDefs />
        <FlowBackground cx={490} cy={155} width={980} height={300} />

        <g transform={`translate(${DESKTOP_FLOW_OFFSET_X}, 0)`}>
        {/* Stage labels */}
        {[
          { step: STAGES[0], x: 148, y: DESKTOP_STEP_HEADER_Y },
          { step: STAGES[1], x: 280, y: DESKTOP_STEP_HEADER_Y },
          { step: STAGES[2], x: 424, y: DESKTOP_STEP_HEADER_Y },
          { step: STAGES[3], x: 568, y: DESKTOP_STEP_HEADER_Y },
          { step: STAGES[4], x: 680, y: DESKTOP_STEP_HEADER_Y },
        ].map(({ step, x, y }, index) => (
          <StageStepHeader
            key={step.id}
            step={step}
            x={x}
            y={y}
            index={index}
            hovered={hovered}
            onHover={setHovered}
            animate={reveal}
          />
        ))}

        <g transform={`translate(0, ${DESKTOP_FLOW_OFFSET_Y})`}>
        {/* Static connection lines */}
        <StaticFlowLine d={paths.solar} pathKey="solar" hovered={hovered} reducedMotion={reducedMotion} />
        <StaticFlowLine d={paths.wind} pathKey="wind" hovered={hovered} reducedMotion={reducedMotion} />
        <StaticFlowLine d={paths.bess} pathKey="bess" hovered={hovered} reducedMotion={reducedMotion} />
        <StaticFlowLine d={paths.genToCi} pathKey="genToCi" variant="solid" hovered={hovered} reducedMotion={reducedMotion} />
        <StaticFlowLine d={paths.ciToRev} pathKey="ciToRev" variant="dotted" hovered={hovered} reducedMotion={reducedMotion} />
        <StaticFlowLine d={paths.revToCred} pathKey="revToCred" variant="dotted" hovered={hovered} reducedMotion={reducedMotion} />
        <StaticFlowLine d={paths.credToSplit} pathKey="credToSplit" variant="solid" hovered={hovered} reducedMotion={reducedMotion} />
        <StaticFlowLine d={paths.credToBill} pathKey="credToBill" variant="solid" hovered={hovered} reducedMotion={reducedMotion} />
        <StaticFlowLine d={paths.credToEv} pathKey="credToEv" variant="solid" hovered={hovered} reducedMotion={reducedMotion} />

        {/* User split — credits branch to bill / EV */}
        <StageNode
          id="use"
          x={680}
          y={148}
          size={40}
          variant="output"
          active={
            activeStage === "use" ||
            activeStage === "credits" ||
            activeStage === "bill" ||
            activeStage === "ev"
          }
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
          animate={reveal}
          arrivalPulses={MAIN_PULSES.slice(0, 2).map((p) => ({
            ...p,
            delay: p.delay + 1.15,
          }))}
        >
          <User className="h-5 w-5 text-current-600" strokeWidth={2} />
        </StageNode>

        {/* Dotted arrows overlay */}
        <path
          d={paths.ciToRev}
          fill="none"
          stroke="#08797F"
          strokeWidth="1.5"
          strokeDasharray="1 8"
          markerEnd="url(#arrow-teal)"
          opacity={isPathHighlighted("ciToRev", hovered) ? 0.65 : 0.4}
          className="transition-opacity duration-300"
        />
        <path
          d={paths.revToCred}
          fill="none"
          stroke="#08797F"
          strokeWidth="1.5"
          strokeDasharray="1 8"
          markerEnd="url(#arrow-teal)"
          opacity={isPathHighlighted("revToCred", hovered) ? 0.65 : 0.4}
          className="transition-opacity duration-300"
        />

        <AmbientDrift width={980} height={300} running={runAnimation && isInView} />

        {/* Source nodes */}
        {SOURCES.map((src, i) => {
          const y = [58, 148, 238][i];
          return (
            <StageNode
              key={src.id}
              id={src.id}
              x={52}
              y={y}
              size={40}
              variant="source"
              hovered={hovered}
              onHover={setHovered}
              reducedMotion={reducedMotion}
            animate={reveal}
          >
            <div className="flex flex-col items-center gap-0.5">
              <src.Icon className="h-[18px] w-[18px] text-forest-600" strokeWidth={2} />
            </div>
          </StageNode>
          );
        })}

        {/* Source labels */}
        {SOURCES.map((src, i) => (
          <text
            key={src.label}
            x={72}
            y={[48, 138, 228][i]}
            fill="#08797F"
            fontSize="9"
            fontWeight="600"
            letterSpacing="0.08em"
            className="font-mono-tag uppercase"
            textAnchor="start"
          >
            {src.label}
          </text>
        ))}

        {/* Generation hub */}
        <StageNode
          id="generation-hub"
          x={148}
          y={148}
          size={58}
          variant="hub"
          active={activeStage === "generation" || activeStage === "generation-hub"}
          revealIndex={0}
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
          animate={reveal}
          arrivalPulses={[
            ...SOURCE_PULSES.slice(0, 3),
            ...SOURCE_PULSES.slice(2, 4).map((p) => ({
              ...p,
              delay: p.delay + 0.4,
            })),
          ]}
        >
          <div className="relative flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-paper-50 bg-forest-500" />
            <div className="absolute h-2.5 w-2.5 rounded-full bg-current-300" />
          </div>
        </StageNode>

        {/* Spark above generation */}
        <line x1="148" y1="112" x2="148" y2="122" stroke="#3ABBC2" strokeWidth="1" opacity={0.5} />
        <foreignObject x="136" y="92" width="24" height="24">
          <div {...({ xmlns: "http://www.w3.org/1999/xhtml" } as React.HTMLAttributes<HTMLDivElement>)} className="flex h-full w-full items-center justify-center">
            <Sparkles className="h-4 w-4 text-current-500" strokeWidth={1.75} />
          </div>
        </foreignObject>

        {/* C&I */}
        <StageNode
          id="ci"
          x={280}
          y={148}
          size={54}
          variant="ci"
          active={
            activeStage === "ci" ||
            activeStage === "generation" ||
            activeStage === "generation-hub"
          }
          revealIndex={1}
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={MAIN_PULSES.slice(0, 4).map((p) => ({
            ...p,
            delay: p.delay + 0.25,
          }))}
        >
          <Building2 className="h-6 w-6 text-paper-50" strokeWidth={2} />
        </StageNode>

        {/* Revenue */}
        <StageNode
          id="revenue"
          x={424}
          y={148}
          size={50}
          variant="revenue"
          active={activeStage === "revenue"}
          revealIndex={2}
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={MAIN_PULSES.slice(1, 5).map((p) => ({
            ...p,
            delay: p.delay + 0.6,
          }))}
        >
          <IndianRupee className="h-6 w-6 text-forest-600" strokeWidth={2} />
        </StageNode>

        {/* Credits */}
        <StageNode
          id="credits"
          x={568}
          y={148}
          size={54}
          variant="credits"
          active={activeStage === "credits" || activeStage === "use"}
          revealIndex={3}
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
          animate={reveal}
          arrivalPulses={MAIN_PULSES.slice(2, 6).map((p) => ({
            ...p,
            delay: p.delay + 0.9,
          }))}
        >
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
            unoptimized
          />
        </StageNode>

        {/* Outputs */}
        <StageNode
          id="bill"
          x={792}
          y={88}
          size={50}
          variant="output"
          active={activeStage === "bill" || activeStage === "use" || activeStage === "credits"}
          revealIndex={4}
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
          animate={reveal}
          arrivalPulses={BRANCH_PULSES.slice(0, 3).map((p) => ({
            ...p,
            delay: p.delay + 1.4,
          }))}
        >
          <FileText className="h-5 w-5 text-current-600" strokeWidth={2} />
        </StageNode>
        <StageNode
          id="ev"
          x={792}
          y={208}
          size={50}
          variant="output"
          active={activeStage === "ev" || activeStage === "use" || activeStage === "credits"}
          revealIndex={5}
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
          animate={reveal}
          arrivalPulses={BRANCH_PULSES.slice(0, 3).map((p) => ({
            ...p,
            delay: p.delay + 1.75,
          }))}
        >
          <div className="flex items-center gap-0.5">
            <Car className="h-4 w-4 text-current-600" strokeWidth={2} />
            <Zap className="h-3.5 w-3.5 text-current-500" strokeWidth={2} />
          </div>
        </StageNode>

        {/* Output labels */}
        <text x={792} y={40} textAnchor="middle" fill="#08797F" fontSize="8.5" fontWeight="600" letterSpacing="0.06em" className="font-mono-tag uppercase">
          ELECTRICITY
        </text>
        <text x={792} y={51} textAnchor="middle" fill="#08797F" fontSize="8.5" fontWeight="600" letterSpacing="0.06em" className="font-mono-tag uppercase">
          BILL PAYMENT
        </text>
        <text x={792} y={252} textAnchor="middle" fill="#08797F" fontSize="8.5" fontWeight="600" letterSpacing="0.06em" className="font-mono-tag uppercase">
          EV CHARGING
        </text>
        <text x={792} y={263} textAnchor="middle" fill="#08797F" fontSize="8.5" fontWeight="600" letterSpacing="0.06em" className="font-mono-tag uppercase">
          PAYMENT
        </text>

        <SvgFlowSegments segments={DESKTOP_SEGMENTS} enabled={runAnimation && isInView} hovered={hovered} />
        <MovingPulseDots
          flatPulses={DESKTOP_FLAT_PULSES}
          paths={DESKTOP_PATHS}
          running={runAnimation && isInView}
        />
        </g>
        </g>
      </svg>

      <FlowDetailPanel hovered={hovered} className="mt-6 max-w-lg" />
    </div>
  );
}

function MobileFlow({
  hovered,
  setHovered,
  reducedMotion,
  animate,
  isInView,
  networkActive,
  hasRevealed,
}: {
  hovered: string | null;
  setHovered: (id: string | null) => void;
  reducedMotion: boolean;
  animate: boolean;
  isInView: boolean;
  networkActive: boolean;
  hasRevealed: boolean;
}) {
  const runAnimation = animate && networkActive;
  const reveal = animate && hasRevealed;

  const paths = MOBILE_PATHS;

  return (
    <div className="lg:hidden">
      <div className="thin-scroll overflow-x-auto">
        <div className="mx-auto flex w-full max-w-[720px] justify-center px-4">
          <svg
            viewBox="0 0 720 280"
            className="h-auto w-full max-w-[780px] bm-flow-svg"
            aria-hidden="true"
          >
          <FlowDefs />
          <FlowBackground cx={360} cy={145} width={720} height={280} />
          <StaticFlowLine d={paths.solar} pathKey="solar" hovered={hovered} reducedMotion={reducedMotion} />
          <StaticFlowLine d={paths.wind} pathKey="wind" hovered={hovered} reducedMotion={reducedMotion} />
          <StaticFlowLine d={paths.bess} pathKey="bess" hovered={hovered} reducedMotion={reducedMotion} />
          <StaticFlowLine d={paths.genToCi} pathKey="genToCi" variant="solid" hovered={hovered} reducedMotion={reducedMotion} />
          <StaticFlowLine d={paths.ciToRev} pathKey="ciToRev" variant="dotted" hovered={hovered} reducedMotion={reducedMotion} />
          <StaticFlowLine d={paths.revToCred} pathKey="revToCred" variant="dotted" hovered={hovered} reducedMotion={reducedMotion} />
          <StaticFlowLine d={paths.credToSplit} pathKey="credToSplit" variant="solid" hovered={hovered} reducedMotion={reducedMotion} />
          <StaticFlowLine d={paths.credToBill} pathKey="credToBill" variant="solid" hovered={hovered} reducedMotion={reducedMotion} />
          <StaticFlowLine d={paths.credToEv} pathKey="credToEv" variant="solid" hovered={hovered} reducedMotion={reducedMotion} />
          <AmbientDrift width={720} height={280} running={runAnimation && isInView} />

          {SOURCES.map((src, i) => (
            <StageNode
              key={src.id}
              id={src.id}
              x={42}
              y={[50, 130, 210][i]}
              size={36}
              variant="source"
              hovered={hovered}
              onHover={setHovered}
              reducedMotion={reducedMotion}
              animate={reveal}
            >
              <src.Icon className="h-4 w-4 text-forest-600" strokeWidth={2} />
            </StageNode>
          ))}

          <StageNode
            id="generation-hub"
            x={138}
            y={130}
            size={50}
            variant="hub"
            hovered={hovered}
            onHover={setHovered}
            reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={SOURCE_PULSES.slice(0, 3)}
          >
            <div className="relative flex items-center justify-center">
              <div className="h-5 w-5 rounded-full border-2 border-paper-50 bg-forest-500" />
              <div className="absolute h-2 w-2 rounded-full bg-current-300" />
            </div>
          </StageNode>

          <StageNode
            id="ci"
            x={244}
            y={130}
            size={46}
            variant="ci"
            hovered={hovered}
            onHover={setHovered}
            reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={MAIN_PULSES.slice(0, 3).map((p) => ({
              ...p,
              delay: p.delay + 0.25,
            }))}
          >
            <Building2 className="h-5 w-5 text-paper-50" strokeWidth={2} />
          </StageNode>

          <StageNode
            id="revenue"
            x={354}
            y={130}
            size={42}
            variant="revenue"
            hovered={hovered}
            onHover={setHovered}
            reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={MAIN_PULSES.slice(0, 3).map((p) => ({
              ...p,
              delay: p.delay + 0.6,
            }))}
          >
            <IndianRupee className="h-5 w-5 text-forest-600" strokeWidth={2} />
          </StageNode>

          <StageNode
            id="credits"
            x={464}
            y={130}
            size={46}
            variant="credits"
            hovered={hovered}
            onHover={setHovered}
            reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={MAIN_PULSES.slice(0, 3).map((p) => ({
              ...p,
              delay: p.delay + 0.9,
            }))}
          >
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-6 w-auto object-contain"
              unoptimized
            />
          </StageNode>

          <StageNode
            id="use"
            x={572}
            y={130}
            size={36}
            variant="output"
            active={
              hovered === "use" ||
              hovered === "credits" ||
              hovered === "bill" ||
              hovered === "ev"
            }
            hovered={hovered}
            onHover={setHovered}
            reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={MAIN_PULSES.slice(0, 2).map((p) => ({
              ...p,
              delay: p.delay + 1.15,
            }))}
          >
            <User className="h-4 w-4 text-current-600" strokeWidth={2} />
          </StageNode>

          <StageNode
            id="bill"
            x={668}
            y={72}
            size={40}
            variant="output"
            hovered={hovered}
            onHover={setHovered}
            reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={BRANCH_PULSES.slice(0, 3).map((p) => ({
              ...p,
              delay: p.delay + 1.4,
            }))}
          >
            <FileText className="h-3.5 w-3.5 text-current-600" strokeWidth={1.75} />
          </StageNode>

          <StageNode
            id="ev"
            x={668}
            y={188}
            size={40}
            variant="output"
            hovered={hovered}
            onHover={setHovered}
            reducedMotion={reducedMotion}
            animate={reveal}
            arrivalPulses={BRANCH_PULSES.slice(0, 3).map((p) => ({
              ...p,
              delay: p.delay + 1.75,
            }))}
          >
            <div className="flex items-center gap-0.5">
              <Car className="h-3 w-3 text-current-600" strokeWidth={1.75} />
              <Zap className="h-2.5 w-2.5 text-current-500" strokeWidth={1.75} />
            </div>
          </StageNode>

          <SvgFlowSegments segments={MOBILE_SEGMENTS} enabled={runAnimation && isInView} hovered={hovered} />
          <MovingPulseDots
            flatPulses={MOBILE_FLAT_PULSES}
            paths={MOBILE_PATHS}
            running={runAnimation && isInView}
          />
          </svg>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-ink-500">
        Scroll horizontally to explore the full flow
      </p>

      <FlowDetailPanel hovered={hovered} className="mx-auto mt-4 max-w-sm" />
    </div>
  );
}

function FlowDetailPanel({
  hovered,
  className,
}: {
  hovered: string | null;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full justify-center px-2", className)}>
      <div
        className={cn(
          "relative flex w-full min-h-[88px] items-center overflow-hidden rounded-2xl border px-5 py-4 transition-all duration-300 ease-out",
          hovered
            ? "border-current-300/35 bg-gradient-to-br from-paper-50 via-paper-50 to-current-50/30 shadow-lg shadow-forest-900/5"
            : "border-ink-900/10 border-dashed bg-paper-100/50"
        )}
      >
        {!hovered ? (
          <div className="flex w-full items-center justify-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current-300/25 bg-current-50/40 text-current-600">
              <MousePointerClick className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <p className="text-sm leading-snug text-ink-600">
              <span className="font-medium text-forest-700">Hover any stage</span>
              <span className="text-ink-500"> to explore how clean energy flows through our model</span>
            </p>
          </div>
        ) : (
          <div key={hovered} className="bm-detail-in w-full" aria-live="polite">
            <Tooltip id={hovered} inline embedded />
          </div>
        )}
      </div>
    </div>
  );
}

function Tooltip({
  id,
  className,
  inline,
  embedded,
}: {
  id: string;
  className?: string;
  inline?: boolean;
  embedded?: boolean;
}) {
  const stage = STAGES.find((s) => s.id === id);
  const output = OUTPUTS.find((o) => o.id === id);
  const source = SOURCES.find((s) => s.id === id);

  let title = "";
  let body = "";
  let eyebrow = "";

  if (stage) {
    const stepNumber = stage.step.match(/^(\d+)\./)?.[1]?.padStart(2, "0") ?? "";
    const stepTitle = stage.step.replace(/^\d+\.\s*/, "");
    eyebrow = stepNumber ? `Step ${stepNumber}` : "";
    title = stepTitle;
    body = stage.tooltip;
  } else if (output) {
    eyebrow = "Use credits";
    title = output.label;
    body = output.tooltip;
  } else if (source) {
    eyebrow = "Energy source";
    title = source.label;
    body = `Clean ${source.label.toLowerCase()} generation feeds into the central hub.`;
  } else if (id === "generation-hub") {
    eyebrow = "Step 01";
    title = "Generation Hub";
    body =
      "Solar, wind and BESS assets converge here — the starting point of clean energy in our model.";
  }

  if (!title) return null;

  return (
    <div
      className={cn(
        embedded ? "relative" : "rounded-xl border bg-paper-50 px-4 py-3 shadow-premium",
        !embedded && "border-ink-900/10 transition-all duration-300",
        !inline && !embedded && "pointer-events-none",
        className
      )}
    >
      <div className="flex gap-3">
        <span className="mt-1 h-10 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-current-400 to-forest-600" />
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="font-mono-tag text-[10px] font-semibold uppercase tracking-[0.14em] text-current-600">
              {eyebrow}
            </p>
          ) : null}
          <p className="mt-1 font-display text-sm font-semibold uppercase tracking-wide text-forest-800">
            {title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{body}</p>
        </div>
      </div>
    </div>
  );
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (visible: boolean) => setIsInView(visible);

    const observer = new IntersectionObserver(
      ([entry]) => update(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "80px 0px" }
    );

    observer.observe(el);

    const rect = el.getBoundingClientRect();
    update(rect.top < window.innerHeight && rect.bottom > 0);

    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

export function BusinessModelFlow() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [networkActive, setNetworkActive] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  useEffect(() => {
    if (isInView) setHasRevealed(true);
  }, [isInView]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isInView) {
      setNetworkActive(false);
      return;
    }
    if (reducedMotion) {
      setNetworkActive(true);
      return;
    }
    const timer = window.setTimeout(() => setNetworkActive(true), 950);
    return () => window.clearTimeout(timer);
  }, [isInView, reducedMotion]);

  const animate = !reducedMotion;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper-50 pt-12 pb-12 lg:pt-16 lg:pb-16"
    >
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_55%,rgba(58,187,194,0.07),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(8,121,127,0.04),transparent_65%)]" />
      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-forest-600/35" />
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current-400/30 motion-reduce:animate-none" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-forest-600" />
              </span>
              <span className="h-px w-10 bg-forest-600/35" />
            </div>
            <p className="font-mono-tag text-xs uppercase tracking-[0.16em] text-current-600">
              WattPe
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl">
              One of our best products
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-700/80 sm:text-base">
              WattPe lets you own a portion of a solar plant. Businesses use
              that clean energy, and a share of the revenue comes back to you
              as AINERGY Credits.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 lg:mt-14">
          <DesktopFlow
            hovered={hovered}
            setHovered={setHovered}
            reducedMotion={reducedMotion}
            animate={animate}
            isInView={isInView}
            networkActive={networkActive}
            hasRevealed={hasRevealed}
          />
          <MobileFlow
            hovered={hovered}
            setHovered={setHovered}
            reducedMotion={reducedMotion}
            animate={animate}
            isInView={isInView}
            networkActive={networkActive}
            hasRevealed={hasRevealed}
          />
        </Reveal>
      </Container>

      <style>{`
        .bm-static-glow {
          filter: drop-shadow(0 0 3px rgba(58, 187, 194, 0.28));
        }
        .bm-path-highlight {
          filter: drop-shadow(0 0 4px rgba(58, 187, 194, 0.35));
        }
        .bm-node-active {
          filter: brightness(1.08);
        }
        .bm-node-enter {
          opacity: 0;
          animation: bm-node-in 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .bm-step-enter {
          opacity: 0;
          animation: bm-step-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes bm-node-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bm-step-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .bm-flow-svg foreignObject {
          overflow: visible;
        }
        .bm-detail-in {
          animation: bm-detail-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes bm-detail-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bm-detail-in {
            animation: none;
          }
        }
        .bm-ambient-glow {
          animation: bm-glow-drift 18s ease-in-out infinite alternate;
        }
        @keyframes bm-glow-drift {
          0% { opacity: 0.75; }
          100% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bm-pulses,
          .bm-segments,
          .bm-ambient {
            display: none;
          }
          .bm-ambient-glow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
