"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  Mountain,
  Wind,
  Network,
  CheckCircle2,
  Sun,
  Combine,
  ChevronDown,
  ChevronRight,
  Mail,
  PhoneCall,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import {
  computePlan,
  kwhFromBill,
  billFromKwh,
  BATTERY_BRIDGING_HOURS,
  type PlannerInputs,
} from "@/lib/optimizer";
import {
  STATES,
  VOLTAGE_LEVELS,
  lookupTariff,
  lookupGenerationYield,
  WHEELING_BY_VOLTAGE,
  OPEN_ACCESS_THRESHOLD_KVA,
  type ConsumerType,
  type VoltageLevel,
  type StateName,
} from "@/lib/tariffData";

// ---------------------------------------------------------------------------
// Small shared UI primitives
// ---------------------------------------------------------------------------

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm text-offwhite-300/70">{label}</label>
        <span className="font-mono-tag text-sm text-teal-300">
          {value.toLocaleString("en-IN")} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-400"
      />
      {hint && <p className="mt-1.5 text-xs text-offwhite-300/40">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ElementType;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${
        checked
          ? "border-emerald-400/40 bg-emerald-400/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          checked ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-offwhite-300/50"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-offwhite-100">{label}</span>
          <span
            className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
              checked ? "bg-emerald-500 justify-end" : "bg-white/15 justify-start"
            }`}
          >
            <span className="h-4 w-4 rounded-full bg-graphite-950" />
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-offwhite-300/50">
          {description}
        </p>
      </div>
    </button>
  );
}

// Segmented toggle for a small set of mutually-exclusive string options.
function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-emerald-500 text-graphite-950"
              : "text-offwhite-300/60 hover:bg-white/5 hover:text-offwhite-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm text-offwhite-300/70">{children}</label>
  );
}

const selectClass =
  "w-full rounded-xl border border-white/15 bg-graphite-950/60 px-3.5 py-2.5 text-sm text-offwhite-100 transition-colors focus:border-teal-400/60 focus:outline-none";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-graphite-950/60 px-3.5 py-2.5 text-sm text-offwhite-100 placeholder:text-offwhite-300/35 transition-colors focus:border-teal-400/60 focus:outline-none";

const SEGMENT_META = {
  rooftop: { label: "Rooftop Solar", color: "#34d399" },
  ground: { label: "Ground-Mounted Solar", color: "#1c7350" },
  wind: { label: "On-site Wind", color: "#2dd4c8" },
  openAccess: { label: "Open Access", color: "#c19a4b" },
  grid: { label: "Grid", color: "#3d4a44" },
} as const;

function ResultCard({
  label,
  value,
  sub,
  muted = false,
  warning,
}: {
  label: string;
  value: string;
  sub?: string;
  muted?: boolean;
  warning?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        muted
          ? "border-white/5 bg-graphite-950/30 opacity-60"
          : "border-white/10 bg-graphite-950/60"
      }`}
    >
      <p className="font-mono-tag text-[11px] uppercase text-offwhite-300/45">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-medium text-offwhite-100">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-offwhite-300/50">{sub}</p>}
      {warning && (
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-gold-400">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          {warning}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

const STEPS = ["Energy Profile", "RE Strategy", "Results"];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-6 flex items-center gap-2 sm:gap-3">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono-tag text-xs transition-colors ${
                i === step
                  ? "bg-emerald-500 text-graphite-950"
                  : i < step
                  ? "bg-emerald-400/20 text-emerald-300"
                  : "bg-white/5 text-offwhite-300/40"
              }`}
            >
              {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={`hidden text-xs font-medium sm:block ${
                i === step ? "text-offwhite-100" : "text-offwhite-300/45"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-px flex-1 ${i < step ? "bg-emerald-400/30" : "bg-white/10"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Strategy types
// ---------------------------------------------------------------------------

type Strategy = "onsite" | "offsite" | "both";
type OpenAccessSubOption = "solar" | "windSolarHybrid" | "wind";

const OPEN_ACCESS_SUBOPTIONS: { value: OpenAccessSubOption; label: string }[] = [
  { value: "solar", label: "Open Access Solar" },
  { value: "windSolarHybrid", label: "Open Access Wind-Solar Hybrid" },
  { value: "wind", label: "Open Access Wind" },
];

export function EnergyPlanner() {
  const [step, setStep] = useState(0);

  // --- Step 1: Energy Profile -------------------------------------------
  const [state, setState] = useState<StateName>("Karnataka");
  const [consumerType, setConsumerType] = useState<ConsumerType>("commercial");
  const [voltageLevel, setVoltageLevel] = useState<VoltageLevel>("11kV");
  const [sanctionedLoadKva, setSanctionedLoadKva] = useState(1200);

  const [tariffMode, setTariffMode] = useState<"auto" | "manual">("auto");
  const [manualTariff, setManualTariff] = useState(8.5);
  const autoTariff = lookupTariff(state, consumerType, voltageLevel);
  const tariff = tariffMode === "auto" ? autoTariff.tariff : manualTariff;

  const [usageMode, setUsageMode] = useState<"units" | "charges">("units");
  const [monthlyUnits, setMonthlyUnits] = useState(150000);
  const [monthlyBill, setMonthlyBill] = useState(billFromKwh(150000, tariff));
  const consumption =
    usageMode === "units" ? monthlyUnits : kwhFromBill(monthlyBill, tariff);

  const [operatingHours, setOperatingHours] = useState(16);
  const [renewableTarget, setRenewableTarget] = useState(60);
  const [rooftopArea, setRooftopArea] = useState(30000);

  // --- Step 2: RE Strategy ------------------------------------------------
  const [strategy, setStrategy] = useState<Strategy>("both");
  const [groundArea, setGroundArea] = useState(5);
  const [openAccessSubs, setOpenAccessSubs] = useState<Record<OpenAccessSubOption, boolean>>({
    solar: true,
    windSolarHybrid: false,
    wind: false,
  });

  const wantsOnsite = strategy === "onsite" || strategy === "both";
  const wantsOffsite = strategy === "offsite" || strategy === "both";
  const [considerGroundToggle, setConsiderGroundToggle] = useState(false);
  const [considerWindToggle, setConsiderWindToggle] = useState(false);

  // --- Step 3: lead capture -------------------------------------------
  const [showLeadForm, setShowLeadForm] = useState<"email" | "advisor" | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [howCalcOpen, setHowCalcOpen] = useState(false);

  const inputs: PlannerInputs = {
    state,
    consumerType,
    voltageLevel,
    sanctionedLoadKva,
    consumption,
    tariff,
    operatingHours,
    renewableTarget,
    rooftopArea: wantsOnsite ? rooftopArea : 0,
    considerGround: wantsOnsite && considerGroundToggle,
    groundArea,
    considerWind: wantsOnsite && considerWindToggle,
    includeOpenAccess: wantsOffsite,
  };

  const result = useMemo(() => computePlan(inputs), [
    state,
    consumerType,
    voltageLevel,
    sanctionedLoadKva,
    consumption,
    tariff,
    operatingHours,
    renewableTarget,
    rooftopArea,
    wantsOnsite,
    considerGroundToggle,
    groundArea,
    considerWindToggle,
    wantsOffsite,
  ]);

  const segments = [
    { key: "rooftop", pct: result.rooftopSharePct },
    { key: "ground", pct: result.groundSharePct },
    { key: "wind", pct: result.windSharePct },
    { key: "openAccess", pct: result.openAccessSharePct },
    { key: "grid", pct: result.gridSharePct },
  ] as const;

  const genYield = lookupGenerationYield(state);
  const wheeling = WHEELING_BY_VOLTAGE[voltageLevel];

  function goNext() {
    setStep((s) => Math.min(2, s + 1));
    window.scrollTo({ top: window.scrollY, behavior: "smooth" });
  }
  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="mx-auto max-w-5xl">
      <StepIndicator step={step} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 rounded-3xl border border-white/10 bg-graphite-950/50 p-6 lg:p-8"
          >
            <div>
              <h3 className="font-mono-tag text-xs uppercase text-offwhite-300/50">
                Energy profile
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel>State</FieldLabel>
                  <select
                    className={selectClass}
                    value={state}
                    onChange={(e) => setState(e.target.value as StateName)}
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Consumer type</FieldLabel>
                  <SegmentedToggle
                    options={[
                      { value: "commercial", label: "Commercial" },
                      { value: "industrial", label: "Industrial" },
                    ]}
                    value={consumerType}
                    onChange={setConsumerType}
                  />
                </div>
                <div>
                  <FieldLabel>Voltage level</FieldLabel>
                  <SegmentedToggle
                    options={VOLTAGE_LEVELS.map((v) => ({ value: v, label: v }))}
                    value={voltageLevel}
                    onChange={setVoltageLevel}
                  />
                  <p className="mt-1.5 text-xs text-offwhite-300/40">
                    Wheeling loss ~{wheeling.lossPct}%, wheeling charge ~₹
                    {wheeling.chargeRsPerKwh}/kWh at this voltage.
                  </p>
                </div>
                <div>
                  <FieldLabel>Sanctioned load</FieldLabel>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className={inputClass}
                      value={sanctionedLoadKva}
                      min={0}
                      onChange={(e) => setSanctionedLoadKva(Number(e.target.value))}
                    />
                    <span className="font-mono-tag text-xs text-offwhite-300/50">kVA</span>
                  </div>
                  <p className="mt-1.5 text-xs text-offwhite-300/40">
                    The figure regulators use for open-access eligibility —
                    check your latest DISCOM bill.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <FieldLabel>Tariff</FieldLabel>
                <div className="mb-2">
                  <SegmentedToggle
                    options={[
                      { value: "auto", label: "Auto" },
                      { value: "manual", label: "Manual" },
                    ]}
                    value={tariffMode}
                    onChange={setTariffMode}
                  />
                </div>
              </div>
              {tariffMode === "auto" ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <p className="font-mono-tag text-lg text-teal-300">
                    ₹{autoTariff.tariff.toFixed(2)} / kWh
                  </p>
                  <p className="mt-1 text-xs text-offwhite-300/45">
                    Typical {consumerType} tariff for {state} at {voltageLevel}
                    {state === "Other"
                      ? " (generic estimate — state not yet in the lookup table)"
                      : ""}
                    . Cross-subsidy surcharge ~₹{autoTariff.crossSubsidySurcharge}/kWh.
                  </p>
                </div>
              ) : (
                <input
                  type="number"
                  step={0.1}
                  className={inputClass}
                  value={manualTariff}
                  onChange={(e) => setManualTariff(Number(e.target.value))}
                  placeholder="₹/kWh"
                />
              )}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <FieldLabel>Monthly use</FieldLabel>
                <div className="mb-2">
                  <SegmentedToggle
                    options={[
                      { value: "units", label: "Units (kWh)" },
                      { value: "charges", label: "Bill amount (₹)" },
                    ]}
                    value={usageMode}
                    onChange={setUsageMode}
                  />
                </div>
              </div>
              {usageMode === "units" ? (
                <>
                  <Slider
                    label="Monthly electricity consumption"
                    value={monthlyUnits}
                    min={20000}
                    max={1000000}
                    step={5000}
                    unit="kWh"
                    onChange={setMonthlyUnits}
                  />
                  <p className="mt-2 text-xs text-offwhite-300/40">
                    ≈ ₹{billFromKwh(monthlyUnits, tariff).toLocaleString("en-IN")}
                    /month at the current tariff.
                  </p>
                </>
              ) : (
                <>
                  <Slider
                    label="Monthly electricity bill"
                    value={monthlyBill}
                    min={100000}
                    max={8000000}
                    step={10000}
                    unit="₹"
                    onChange={setMonthlyBill}
                  />
                  <p className="mt-2 text-xs text-offwhite-300/40">
                    ≈ {kwhFromBill(monthlyBill, tariff).toLocaleString("en-IN")} kWh/month
                    at the current tariff.
                  </p>
                </>
              )}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="space-y-6">
                <Slider
                  label="Operating hours"
                  value={operatingHours}
                  min={8}
                  max={24}
                  step={1}
                  unit="hrs/day"
                  onChange={setOperatingHours}
                />
                <Slider
                  label="Renewable-energy target"
                  value={renewableTarget}
                  min={20}
                  max={100}
                  step={5}
                  unit="%"
                  onChange={setRenewableTarget}
                />
                <Slider
                  label="Rooftop area available"
                  value={rooftopArea}
                  min={0}
                  max={200000}
                  step={1000}
                  unit="sq ft"
                  onChange={setRooftopArea}
                  hint="~60 sq ft is typically needed per kW of rooftop solar."
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-graphite-950 transition-all hover:bg-emerald-400 hover:shadow-glow"
              >
                Continue to RE Strategy
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 rounded-3xl border border-white/10 bg-graphite-950/50 p-6 lg:p-8"
          >
            <div>
              <h3 className="font-mono-tag text-xs uppercase text-offwhite-300/50">
                Choose your RE strategy
              </h3>
              <p className="mt-1.5 text-xs text-offwhite-300/45">
                Carried over: {sanctionedLoadKva.toLocaleString("en-IN")} kVA sanctioned
                load · {voltageLevel} · {consumerType} · ₹{tariff.toFixed(2)}/kWh ·{" "}
                {consumption.toLocaleString("en-IN")} kWh/month.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <StrategyCard
                  icon={Sun}
                  title="Onsite / Rooftop"
                  description="Generate power at the facility — rooftop, ground-mount or on-site wind."
                  selected={strategy === "onsite"}
                  onClick={() => setStrategy("onsite")}
                />
                <StrategyCard
                  icon={Network}
                  title="Offsite / Open Access"
                  description="Procure renewable power from external sources through the grid."
                  selected={strategy === "offsite"}
                  onClick={() => setStrategy("offsite")}
                />
                <StrategyCard
                  icon={Combine}
                  title="Onsite + Offsite"
                  description="Combine on-site generation with Open Access to close the gap."
                  selected={strategy === "both"}
                  onClick={() => setStrategy("both")}
                />
              </div>
            </div>

            {wantsOnsite && (
              <div className="space-y-5 border-t border-white/10 pt-6">
                <h4 className="text-sm font-medium text-offwhite-100">
                  Onsite / Rooftop inputs
                </h4>
                <Toggle
                  label="Consider ground-mounted solar"
                  description="Needs roughly 1 MW+ of potential capacity to be practical on-site — smaller plots are better served by Open Access."
                  checked={considerGroundToggle}
                  onChange={setConsiderGroundToggle}
                  icon={Mountain}
                />
                {considerGroundToggle && (
                  <Slider
                    label="Land available for ground-mount"
                    value={groundArea}
                    min={0}
                    max={50}
                    step={0.5}
                    unit="acres"
                    onChange={setGroundArea}
                    hint="~3.5 acres are typically needed per MW of ground-mounted solar."
                  />
                )}
                <Toggle
                  label="Consider on-site wind"
                  description="Captive wind is generally only practical above roughly 2 MW of capacity — below that, Open Access wind is the more realistic route."
                  checked={considerWindToggle}
                  onChange={setConsiderWindToggle}
                  icon={Wind}
                />
                <p className="text-xs text-offwhite-300/40">
                  Available roof space carried from Step 1: {rooftopArea.toLocaleString("en-IN")} sq ft.
                </p>
              </div>
            )}

            {wantsOffsite && (
              <div className="space-y-3 border-t border-white/10 pt-6">
                <h4 className="text-sm font-medium text-offwhite-100">
                  Offsite / Open Access sub-options
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {OPEN_ACCESS_SUBOPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={openAccessSubs[opt.value]}
                      onClick={() =>
                        setOpenAccessSubs((prev) => ({
                          ...prev,
                          [opt.value]: !prev[opt.value],
                        }))
                      }
                      className={`rounded-xl border p-3.5 text-left text-xs font-medium transition-colors ${
                        openAccessSubs[opt.value]
                          ? "border-gold-400/40 bg-gold-400/[0.06] text-gold-400"
                          : "border-white/10 bg-white/[0.02] text-offwhite-300/60 hover:border-white/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {!result.openAccessEligible && (
                  <p className="flex items-start gap-1.5 text-xs leading-relaxed text-gold-400">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                    Sanctioned load ({sanctionedLoadKva.toLocaleString("en-IN")} kVA) is
                    below {state}&apos;s indicative Open Access eligibility threshold of{" "}
                    {OPEN_ACCESS_THRESHOLD_KVA[state].toLocaleString("en-IN")} kVA.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-offwhite-200 transition-colors hover:border-white/30"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-graphite-950 transition-all hover:bg-emerald-400 hover:shadow-glow"
              >
                See my results
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {result.recommendOpenAccessPrimary && (
              <div className="flex items-start gap-3 rounded-2xl border border-teal-400/25 bg-teal-400/[0.06] p-5">
                <Network className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                <p className="text-sm leading-relaxed text-offwhite-200/80">
                  <span className="font-medium text-teal-300">
                    Open Access looks like the better fit here.
                  </span>{" "}
                  Your consumption and available rooftop area suggest on-site
                  generation alone won&apos;t move the needle — sourcing
                  off-site renewable power is usually more efficient than
                  building small on-site assets at this scale.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-teal-400/20 bg-teal-400/[0.04] p-4">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-offwhite-200/70">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" />
                <span>
                  <span className="font-medium text-teal-300">
                    Powered by the AINERGY Energy OS.
                  </span>{" "}
                  This estimate factors in weather-adjusted generation and
                  seasonal tariff patterns for {state}.{" "}
                  <span className="text-offwhite-300/45">
                    (Placeholder — this page is not yet wired to the live
                    forecasting model; connect the Energy OS output here to
                    replace the static assumptions below.)
                  </span>
                </span>
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-graphite-950/50 p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-tag text-xs uppercase text-offwhite-300/50">
                  Recommended energy mix
                </h3>
                <span className="font-display text-lg font-medium text-offwhite-100">
                  {result.achievedRenewablePct}% renewable
                </span>
              </div>

              <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-white/5">
                {segments.map(({ key, pct }) =>
                  pct > 0.5 ? (
                    <motion.div
                      key={key}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ backgroundColor: SEGMENT_META[key].color }}
                      className="h-full"
                    />
                  ) : null
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {segments.map(({ key, pct }) => (
                  <div key={key} className="flex items-center gap-2 text-xs text-offwhite-300/60">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: SEGMENT_META[key].color }}
                    />
                    {SEGMENT_META[key].label} · {Math.round(pct)}%
                  </div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3.5">
                <ResultCard
                  label="Rooftop Solar"
                  value={`${result.rooftopSolarKw.toLocaleString("en-IN")} kW`}
                  sub={`of ${result.rooftopPotentialKw.toLocaleString("en-IN")} kW rooftop potential`}
                  muted={!wantsOnsite}
                />
                <ResultCard
                  label="Ground-Mounted Solar"
                  value={`${result.groundSolarKw.toLocaleString("en-IN")} kW`}
                  sub={
                    considerGroundToggle && !result.groundSolarViable
                      ? `${result.groundPotentialKw.toLocaleString("en-IN")} kW potential — below 1 MW viability`
                      : undefined
                  }
                  muted={!wantsOnsite || !considerGroundToggle}
                />
                <ResultCard
                  label="On-site Wind"
                  value={`${result.windKw.toLocaleString("en-IN")} kW`}
                  sub={
                    considerWindToggle && !result.windViable
                      ? `${result.windRequiredKw.toLocaleString("en-IN")} kW required — below 2 MW viability`
                      : undefined
                  }
                  muted={!wantsOnsite || !considerWindToggle}
                />
                <ResultCard
                  label="Battery Requirement"
                  value={`${result.batteryKwh.toLocaleString("en-IN")} kWh`}
                  sub={`Sized to bridge ~${BATTERY_BRIDGING_HOURS} hrs/day outside solar/wind generation, across your ${operatingHours}-hr operating day.`}
                />
                <ResultCard
                  label="Open Access"
                  value={`${result.openAccessKw.toLocaleString("en-IN")} kW`}
                  sub="Off-site solar or wind, sourced through the grid"
                  muted={!wantsOffsite || result.openAccessKw === 0}
                  warning={
                    wantsOffsite && !result.openAccessEligible
                      ? `Below ${state}'s ~${result.openAccessThresholdKva.toLocaleString(
                          "en-IN"
                        )} kVA Open Access eligibility threshold — this facility likely wouldn't qualify yet.`
                      : undefined
                  }
                />
              </div>

              {(!result.groundSolarViable && considerGroundToggle) && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-offwhite-300/60">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" />
                  Your ground-mount potential is under the ~1 MW viability
                  threshold for a standalone on-site project — this need has
                  been redirected to Open Access instead.
                </div>
              )}
              {(!result.windViable && considerWindToggle) && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-offwhite-300/60">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" />
                  Your load doesn&apos;t require the ~2 MW that makes captive
                  wind practical — this need has been redirected to Open
                  Access instead.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              <ResultCard
                label="Est. cost reduction"
                value={`${result.costReductionPct}%`}
              />
              <ResultCard
                label="Est. monthly savings"
                value={`₹${result.monthlySavings.toLocaleString("en-IN")}`}
              />
              <ResultCard
                label="Est. CO₂ avoided"
                value={`${result.co2AvoidedTpa} t/yr`}
              />
              <ResultCard
                label="Est. project cost"
                value={`₹${(result.projectCostEstimateRs / 10000000).toFixed(2)} Cr`}
                sub="Zero-capex financing available — no upfront investment required."
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setHowCalcOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-offwhite-100">
                  How we calculated this
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-offwhite-300/50 transition-transform ${
                    howCalcOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {howCalcOpen && (
                <div className="space-y-3 border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-offwhite-300/60">
                  <p>
                    <span className="text-offwhite-200">Generation yield —</span>{" "}
                    {genYield.rooftop} kWh/kWp/day (rooftop) and{" "}
                    {genYield.ground} kWh/kWp/day (ground-mount), indicative
                    for {state === "Other" ? "a generic Indian site" : state}.
                  </p>
                  <p>
                    <span className="text-offwhite-200">Tariff & surcharges —</span>{" "}
                    ₹{tariff.toFixed(2)}/kWh {consumerType} tariff at{" "}
                    {voltageLevel}; cross-subsidy surcharge ~₹
                    {autoTariff.crossSubsidySurcharge}/kWh; wheeling loss ~
                    {wheeling.lossPct}% and wheeling charge ~₹
                    {wheeling.chargeRsPerKwh}/kWh at this voltage level.
                  </p>
                  <p>
                    <span className="text-offwhite-200">Sizing rules of thumb —</span>{" "}
                    ~60 sq ft/kW rooftop, ~3.5 acres/MW ground-mount, 1 MW /
                    2 MW on-site viability thresholds for ground-mount and
                    wind respectively, battery sized for a ~
                    {BATTERY_BRIDGING_HOURS}-hour bridging window.
                  </p>
                  <p>
                    <span className="text-offwhite-200">Project cost —</span>{" "}
                    blended indicative capex of ₹42,000/kW (rooftop),
                    ₹38,000/kW (ground-mount) and ₹68,000/kW (wind).
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-gold-400/25 bg-gold-400/5 p-4 text-xs leading-relaxed text-offwhite-300/70">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <p>
                <span className="font-medium text-gold-400">
                  Illustrative estimate — not a commercial quotation.
                </span>{" "}
                Figures use simplified, rule-of-thumb sizing and indicative
                state tariff assumptions for exploration purposes only. An
                actual AINERGY proposal requires site assessment, load-curve
                analysis and regulatory review.
              </p>
            </div>

            <LeadCapture
              showLeadForm={showLeadForm}
              setShowLeadForm={setShowLeadForm}
              leadSubmitted={leadSubmitted}
              setLeadSubmitted={setLeadSubmitted}
            />

            <div className="flex justify-start">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-offwhite-200 transition-colors hover:border-white/30"
              >
                Back to RE Strategy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Strategy card (Step 2)
// ---------------------------------------------------------------------------

function StrategyCard({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-colors ${
        selected
          ? "border-emerald-400/40 bg-emerald-400/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          selected ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-offwhite-300/50"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-offwhite-100">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-offwhite-300/50">{description}</p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Lead capture (Step 3, gated only behind the save/email/advisor action)
// ---------------------------------------------------------------------------

function LeadCapture({
  showLeadForm,
  setShowLeadForm,
  leadSubmitted,
  setLeadSubmitted,
}: {
  showLeadForm: "email" | "advisor" | null;
  setShowLeadForm: (v: "email" | "advisor" | null) => void;
  leadSubmitted: boolean;
  setLeadSubmitted: (v: boolean) => void;
}) {
  if (leadSubmitted) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-emerald-400/25 bg-emerald-400/[0.05] p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        <p className="mt-3 text-sm font-medium text-offwhite-100">
          Thanks — we&apos;ve received your details.
        </p>
        <p className="mt-1 text-xs text-offwhite-300/55">
          A member of the AINERGY team will follow up with your plan shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-graphite-950/50 p-6 lg:p-8">
      {!showLeadForm ? (
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-offwhite-100">
              Want to keep this plan?
            </p>
            <p className="mt-1 text-xs text-offwhite-300/50">
              Save the numbers above, or talk to an advisor about turning
              this into a real proposal.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => setShowLeadForm("email")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-offwhite-200 transition-colors hover:border-white/30"
            >
              <Mail className="h-4 w-4" />
              Email me this plan
            </button>
            <button
              type="button"
              onClick={() => setShowLeadForm("advisor")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-graphite-950 transition-all hover:bg-emerald-400 hover:shadow-glow"
            >
              <PhoneCall className="h-4 w-4" />
              Talk to an advisor
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLeadSubmitted(true);
          }}
        >
          <p className="mb-4 text-sm font-medium text-offwhite-100">
            {showLeadForm === "email"
              ? "Where should we email this plan?"
              : "Tell us how to reach you"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Name" className={inputClass} name="name" />
            <input required placeholder="Company" className={inputClass} name="company" />
            <input
              required
              type="email"
              placeholder="Email"
              className={inputClass}
              name="email"
            />
            <input required type="tel" placeholder="Phone" className={inputClass} name="phone" />
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowLeadForm(null)}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-offwhite-200 transition-colors hover:border-white/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-graphite-950 transition-all hover:bg-emerald-400 hover:shadow-glow"
            >
              {showLeadForm === "email" ? "Send me the plan" : "Request a call"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
