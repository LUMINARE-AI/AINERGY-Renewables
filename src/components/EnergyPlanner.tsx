"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  AlertTriangle,
  Bot,
  Pencil,
  BatteryCharging,
  Landmark,
  Gauge,
} from "lucide-react";
import {
  computePlan,
  kwhFromBill,
  billFromKwh,
  BATTERY_BRIDGING_HOURS,
  type PlannerInputs,
} from "@/lib/calculations/optimizer";
import {
  STATES,
  VOLTAGE_LEVELS,
  lookupTariff,
  lookupGenerationYield,
  lookupOpenAccessCharges,
  OPEN_ACCESS_THRESHOLD_KVA,
  type ConsumerType,
  type VoltageLevel,
  type StateName,
} from "@/lib/regulatory/tariffData";
import {
  compareLandedCosts,
  type LandedCostBreakdown,
  type LandedCostRoute,
} from "@/lib/calculations/landedCost";
import {
  buildCaptiveInvestmentInputs,
  computeInvestmentModel,
} from "@/lib/calculations/investmentModel";
import {
  BillUploadStep,
  type ConfirmedBillProfile,
} from "@/components/copilot/BillUploadStep";

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
        <label className="text-sm text-ink-600">{label}</label>
        <span className="font-mono-tag text-sm text-current-600">
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
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-900/10 accent-current-500"
      />
      {hint && <p className="mt-1.5 text-xs text-ink-500/80">{hint}</p>}
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
          ? "border-forest-500/40 bg-forest-500/[0.08]"
          : "border-ink-900/10 bg-ink-900/[0.025] hover:border-ink-900/20"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          checked ? "bg-forest-500/12 text-forest-700" : "bg-ink-900/5 text-ink-500"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink-900">{label}</span>
          <span
            className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
              checked ? "bg-ink-900 justify-end" : "bg-ink-900/15 justify-start"
            }`}
          >
            <span className="h-4 w-4 rounded-full bg-white" />
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-500">
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
    <div className="flex flex-wrap gap-1.5 rounded-xl border border-ink-900/10 bg-ink-900/[0.025] p-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-ink-900 text-paper-50"
              : "text-ink-600/90 hover:bg-ink-900/5 hover:text-ink-900"
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
    <label className="mb-2 block text-sm text-ink-600">{children}</label>
  );
}

const selectClass =
  "w-full rounded-xl border border-ink-900/15 bg-paper-100/70 px-3.5 py-2.5 text-sm text-ink-900 transition-colors focus:border-current-500/60 focus:outline-none";

const inputClass =
  "w-full rounded-xl border border-ink-900/15 bg-paper-100/70 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-current-500/60 focus:outline-none";

const SEGMENT_META = {
  rooftop: { label: "Rooftop Solar", color: "#C9893A" },
  ground: { label: "Ground-Mounted Solar", color: "#08797F" },
  wind: { label: "On-site Wind", color: "#3ABBC2" },
  openAccess: { label: "Open Access", color: "#06666B" },
  grid: { label: "Grid", color: "#94A1A3" },
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
          ? "border-ink-900/8 bg-paper-100/40 opacity-70"
          : "border-ink-900/10 bg-paper-100/70"
      }`}
    >
      <p className="font-mono-tag text-[11px] uppercase text-ink-500/90">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-medium text-ink-900">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-ink-500">{sub}</p>}
      {warning && (
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-current-700">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          {warning}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat shell — the Copilot presents every question as a conversation turn:
// an assistant bubble with the question + live interactive controls, which
// collapses into a compact "you said" summary once answered so the thread
// reads like a real chat. Any prior answer can be reopened for editing —
// state never resets, only which turn is expanded moves.
// ---------------------------------------------------------------------------

function AssistantBubble({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3.5"
    >
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-current-gradient text-paper-50 shadow-glow">
        <Bot className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1 space-y-5 rounded-3xl rounded-tl-md border border-ink-900/10 bg-paper-50 p-6 shadow-premium lg:p-7">
        <p className="font-display text-base font-medium text-ink-900">
          {title}
        </p>
        {children}
      </div>
    </motion.div>
  );
}

function UserSummaryBubble({
  summary,
  onEdit,
}: {
  summary: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end gap-3.5"
    >
      <button
        type="button"
        onClick={onEdit}
        className="group flex max-w-[85%] items-center gap-2.5 rounded-3xl rounded-tr-md bg-ink-900 px-5 py-3 text-left text-sm text-paper-50 transition-colors hover:bg-current-600"
      >
        <span className="min-w-0">{summary}</span>
        <Pencil className="h-3.5 w-3.5 shrink-0 text-paper-50/60 transition-colors group-hover:text-paper-50" />
      </button>
    </motion.div>
  );
}

function ContinueButton({ onClick, label = "Continue" }: { onClick: () => void; label?: string }) {
  return (
    <div className="flex justify-end pt-1">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow"
      >
        {label}
        <ChevronRight className="h-4 w-4" />
      </button>
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

type TurnId =
  | "bill"
  | "facility"
  | "tariff"
  | "usage"
  | "details"
  | "battery"
  | "strategy"
  | "onsite"
  | "offsite"
  | "results";

export function EnergyPlanner() {
  // --- Facility -----------------------------------------------------------
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

  // Battery/BESS is opt-in — previously every plan forced a battery line
  // item regardless of whether the user wanted one.
  const [considerBattery, setConsiderBattery] = useState(false);

  // --- RE strategy ----------------------------------------------------------
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

  // --- Lead capture ---------------------------------------------------------
  const [showLeadForm, setShowLeadForm] = useState<"email" | "advisor" | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [howCalcOpen, setHowCalcOpen] = useState(false);

  // --- Bill upload ------------------------------------------------------
  const [billApplied, setBillApplied] = useState<ConfirmedBillProfile | null>(null);

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
    considerBattery,
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
    considerBattery,
  ]);

  const segments = [
    { key: "rooftop", pct: result.rooftopSharePct },
    { key: "ground", pct: result.groundSharePct },
    { key: "wind", pct: result.windSharePct },
    { key: "openAccess", pct: result.openAccessSharePct },
    { key: "grid", pct: result.gridSharePct },
  ] as const;

  const genYield = lookupGenerationYield(state);
  const openAccessCharges = lookupOpenAccessCharges(state, voltageLevel);

  const landedCosts = useMemo(
    () =>
      compareLandedCosts({
        state,
        consumerType,
        voltageLevel,
        gridTariffRsPerKwh: tariff,
      }),
    [state, consumerType, voltageLevel, tariff]
  );

  // --- Chat turn sequencing -------------------------------------------------
  const turnIds = useMemo(() => {
    const ids: TurnId[] = ["bill", "facility", "tariff", "usage", "details", "battery", "strategy"];
    if (wantsOnsite) ids.push("onsite");
    if (wantsOffsite) ids.push("offsite");
    ids.push("results");
    return ids;
  }, [wantsOnsite, wantsOffsite]);

  const [activeTurnId, setActiveTurnId] = useState<TurnId>("bill");
  const activeIndex = Math.max(0, turnIds.indexOf(activeTurnId));
  const visibleTurns = turnIds.slice(0, activeIndex + 1);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeTurnId]);

  function goNext(fromId: TurnId) {
    const idx = turnIds.indexOf(fromId);
    const next = turnIds[idx + 1] ?? fromId;
    setActiveTurnId(next);
  }
  function reopen(id: TurnId) {
    setActiveTurnId(id);
  }

  function applyBillProfile(profile: ConfirmedBillProfile) {
    setState(profile.state as StateName);
    setConsumerType(profile.consumerType as ConsumerType);
    setVoltageLevel(profile.voltageLevel as VoltageLevel);
    setSanctionedLoadKva(profile.sanctionedLoadKva);
    setUsageMode("units");
    setMonthlyUnits(profile.monthlyConsumptionKwh);
    setTariffMode("manual");
    setManualTariff(profile.averageTariffRsPerKwh);
    setBillApplied(profile);
    goNext("bill");
  }
  function skipBill() {
    goNext("bill");
  }

  const strategyLabel = { onsite: "Onsite / Rooftop", offsite: "Offsite / Open Access", both: "Onsite + Offsite" }[strategy];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <AnimatePresence initial={false}>
        {visibleTurns.map((id) => {
          const isActive = id === activeTurnId;

          // ---------------------------------------------------------------
          // Turn: bill upload
          // ---------------------------------------------------------------
          if (id === "bill") {
            if (!isActive) {
              return (
                <UserSummaryBubble
                  key={id}
                  onEdit={() => reopen("bill")}
                  summary={
                    billApplied
                      ? `Bill uploaded — ${billApplied.state}, ${billApplied.monthlyConsumptionKwh.toLocaleString("en-IN")} kWh/month applied.`
                      : "Skipped — entering details manually."
                  }
                />
              );
            }
            return (
              <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <BillUploadStep onConfirm={applyBillProfile} onSkip={skipBill} />
              </motion.div>
            );
          }

          // ---------------------------------------------------------------
          // Turn: facility
          // ---------------------------------------------------------------
          if (id === "facility") {
            if (!isActive) {
              return (
                <UserSummaryBubble
                  key={id}
                  onEdit={() => reopen("facility")}
                  summary={`${state} · ${consumerType} · ${voltageLevel} · ${sanctionedLoadKva.toLocaleString("en-IN")} kVA`}
                />
              );
            }
            return (
              <AssistantBubble key={id} title="Tell me about your facility — state, consumer category, voltage and sanctioned load.">
                <div className="grid gap-5 sm:grid-cols-2">
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
                    <p className="mt-1.5 text-xs text-ink-500/80">
                      Wheeling loss ~{openAccessCharges.wheelingLossPct}%, wheeling
                      charge ~₹{openAccessCharges.wheelingChargeRsPerKwh}/kWh at this
                      voltage.
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
                      <span className="font-mono-tag text-xs text-ink-500">kVA</span>
                    </div>
                    <p className="mt-1.5 text-xs text-ink-500/80">
                      The figure regulators use for open-access eligibility —
                      check your latest DISCOM bill.
                    </p>
                  </div>
                </div>
                <ContinueButton onClick={() => goNext("facility")} />
              </AssistantBubble>
            );
          }

          // ---------------------------------------------------------------
          // Turn: tariff
          // ---------------------------------------------------------------
          if (id === "tariff") {
            if (!isActive) {
              return (
                <UserSummaryBubble
                  key={id}
                  onEdit={() => reopen("tariff")}
                  summary={`₹${tariff.toFixed(2)}/kWh${tariffMode === "auto" ? " (auto)" : ""}`}
                />
              );
            }
            return (
              <AssistantBubble key={id} title="What's your energy tariff?">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <FieldLabel>Tariff</FieldLabel>
                    <SegmentedToggle
                      options={[
                        { value: "auto", label: "Auto" },
                        { value: "manual", label: "Manual" },
                      ]}
                      value={tariffMode}
                      onChange={setTariffMode}
                    />
                  </div>
                  {tariffMode === "auto" ? (
                    <div className="rounded-xl border border-ink-900/10 bg-ink-900/[0.025] px-4 py-3">
                      <p className="font-mono-tag text-lg text-current-600">
                        ₹{autoTariff.tariff.toFixed(2)} / kWh
                      </p>
                      <p className="mt-1 text-xs text-ink-500/90">
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
                <ContinueButton onClick={() => goNext("tariff")} />
              </AssistantBubble>
            );
          }

          // ---------------------------------------------------------------
          // Turn: usage
          // ---------------------------------------------------------------
          if (id === "usage") {
            if (!isActive) {
              return (
                <UserSummaryBubble
                  key={id}
                  onEdit={() => reopen("usage")}
                  summary={`${consumption.toLocaleString("en-IN")} kWh/month`}
                />
              );
            }
            return (
              <AssistantBubble key={id} title="And roughly how much power do you use each month?">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <FieldLabel>Monthly use</FieldLabel>
                    <SegmentedToggle
                      options={[
                        { value: "units", label: "Units (kWh)" },
                        { value: "charges", label: "Bill amount (₹)" },
                      ]}
                      value={usageMode}
                      onChange={setUsageMode}
                    />
                  </div>
                  {usageMode === "units" ? (
                    <>
                      <Slider
                        label="Monthly electricity consumption"
                        value={monthlyUnits}
                        min={5000}
                        max={1000000}
                        step={5000}
                        unit="kWh"
                        onChange={setMonthlyUnits}
                      />
                      <p className="mt-2 text-xs text-ink-500/80">
                        ≈ ₹{billFromKwh(monthlyUnits, tariff).toLocaleString("en-IN")}
                        /month at the current tariff.
                      </p>
                    </>
                  ) : (
                    <>
                      <Slider
                        label="Monthly electricity bill"
                        value={monthlyBill}
                        min={25000}
                        max={8000000}
                        step={5000}
                        unit="₹"
                        onChange={setMonthlyBill}
                      />
                      <p className="mt-2 text-xs text-ink-500/80">
                        ≈ {kwhFromBill(monthlyBill, tariff).toLocaleString("en-IN")} kWh/month
                        at the current tariff.
                      </p>
                    </>
                  )}
                </div>
                <ContinueButton onClick={() => goNext("usage")} />
              </AssistantBubble>
            );
          }

          // ---------------------------------------------------------------
          // Turn: details
          // ---------------------------------------------------------------
          if (id === "details") {
            if (!isActive) {
              return (
                <UserSummaryBubble
                  key={id}
                  onEdit={() => reopen("details")}
                  summary={`${operatingHours} hrs/day · ${renewableTarget}% RE target · ${rooftopArea.toLocaleString("en-IN")} sq ft rooftop`}
                />
              );
            }
            return (
              <AssistantBubble key={id} title="A few more details on your site and goals.">
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
                <ContinueButton onClick={() => goNext("details")} />
              </AssistantBubble>
            );
          }

          // ---------------------------------------------------------------
          // Turn: battery (NEW — opt-in, not forced)
          // ---------------------------------------------------------------
          if (id === "battery") {
            if (!isActive) {
              return (
                <UserSummaryBubble
                  key={id}
                  onEdit={() => reopen("battery")}
                  summary={considerBattery ? "Yes — include a battery (BESS)" : "No battery for now"}
                />
              );
            }
            return (
              <AssistantBubble key={id} title="Would you like to size a battery (BESS) alongside your renewable plan?">
                <p className="text-xs leading-relaxed text-ink-500/90">
                  Optional — a battery bridges the hours your solar/wind isn&apos;t
                  generating but your facility is still running. It adds capex
                  and a per-kWh surcharge, so it&apos;s off by default; turn it on
                  if backup or peak-shaving matters to you.
                </p>
                <Toggle
                  label="Include a battery in this plan"
                  description={`Sized to bridge a ~${BATTERY_BRIDGING_HOURS}-hour window of non-solar/non-wind hours within your operating day.`}
                  checked={considerBattery}
                  onChange={setConsiderBattery}
                  icon={BatteryCharging}
                />
                <ContinueButton onClick={() => goNext("battery")} />
              </AssistantBubble>
            );
          }

          // ---------------------------------------------------------------
          // Turn: strategy
          // ---------------------------------------------------------------
          if (id === "strategy") {
            if (!isActive) {
              return (
                <UserSummaryBubble key={id} onEdit={() => reopen("strategy")} summary={strategyLabel} />
              );
            }
            return (
              <AssistantBubble key={id} title="How do you want to source renewable power?">
                <div className="grid gap-4 sm:grid-cols-3">
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
                <ContinueButton onClick={() => goNext("strategy")} />
              </AssistantBubble>
            );
          }

          // ---------------------------------------------------------------
          // Turn: onsite details
          // ---------------------------------------------------------------
          if (id === "onsite") {
            if (!isActive) {
              return (
                <UserSummaryBubble
                  key={id}
                  onEdit={() => reopen("onsite")}
                  summary={`Ground-mount ${considerGroundToggle ? "on" : "off"} · Wind ${considerWindToggle ? "on" : "off"}`}
                />
              );
            }
            return (
              <AssistantBubble key={id} title="For on-site generation — do you have land for ground-mount solar or on-site wind?">
                <div className="space-y-5">
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
                  <p className="text-xs text-ink-500/80">
                    Available roof space carried over: {rooftopArea.toLocaleString("en-IN")} sq ft.
                  </p>
                </div>
                <ContinueButton onClick={() => goNext("onsite")} />
              </AssistantBubble>
            );
          }

          // ---------------------------------------------------------------
          // Turn: offsite details
          // ---------------------------------------------------------------
          if (id === "offsite") {
            if (!isActive) {
              const chosen = OPEN_ACCESS_SUBOPTIONS.filter((o) => openAccessSubs[o.value])
                .map((o) => o.label)
                .join(", ");
              return (
                <UserSummaryBubble key={id} onEdit={() => reopen("offsite")} summary={chosen || "Open Access"} />
              );
            }
            return (
              <AssistantBubble key={id} title="For Open Access — which route interests you?">
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
                          ? "border-current-500/40 bg-current-400/[0.08] text-current-700"
                          : "border-ink-900/10 bg-ink-900/[0.025] text-ink-600/90 hover:border-ink-900/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {!result.openAccessEligible && (
                  <p className="flex items-start gap-1.5 text-xs leading-relaxed text-current-700">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                    Sanctioned load ({sanctionedLoadKva.toLocaleString("en-IN")} kVA) is
                    below {state}&apos;s indicative Open Access eligibility threshold of{" "}
                    {OPEN_ACCESS_THRESHOLD_KVA[state].toLocaleString("en-IN")} kVA.
                  </p>
                )}
                <ContinueButton onClick={() => goNext("offsite")} label="See my results" />
              </AssistantBubble>
            );
          }

          // ---------------------------------------------------------------
          // Turn: results
          // ---------------------------------------------------------------
          return (
            <AssistantBubble key={id} title="Here's your plan.">
              <div className="space-y-5">
                {result.recommendOpenAccessPrimary && (
                  <div className="flex items-start gap-3 rounded-2xl border border-current-500/30 bg-current-400/[0.08] p-5">
                    <Network className="mt-0.5 h-4 w-4 shrink-0 text-current-600" />
                    <p className="text-sm leading-relaxed text-ink-800/85">
                      <span className="font-medium text-current-600">
                        Open Access looks like the better fit here.
                      </span>{" "}
                      Your consumption and available rooftop area suggest on-site
                      generation alone won&apos;t move the needle — sourcing
                      off-site renewable power is usually more efficient than
                      building small on-site assets at this scale.
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono-tag text-xs uppercase text-ink-500">
                      Recommended energy mix
                    </h3>
                    <span className="font-display text-lg font-medium text-ink-900">
                      {result.achievedRenewablePct}% renewable
                    </span>
                  </div>

                  <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-ink-900/5">
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

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    {segments.map(({ key, pct }) => (
                      <div key={key} className="flex items-center gap-2 text-xs text-ink-600/90">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: SEGMENT_META[key].color }}
                        />
                        {SEGMENT_META[key].label} · {Math.round(pct)}%
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3.5">
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
                      value={considerBattery ? `${result.batteryKwh.toLocaleString("en-IN")} kWh` : "Not included"}
                      sub={
                        considerBattery
                          ? `Sized to bridge ~${BATTERY_BRIDGING_HOURS} hrs/day outside solar/wind generation.`
                          : "Turn on battery above to size a BESS for this plan."
                      }
                      muted={!considerBattery}
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
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-ink-900/10 bg-ink-900/[0.035] p-4 text-xs leading-relaxed text-ink-600/90">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-current-600" />
                      Your ground-mount potential is under the ~1 MW viability
                      threshold for a standalone on-site project — this need has
                      been redirected to Open Access instead.
                    </div>
                  )}
                  {(!result.windViable && considerWindToggle) && (
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-ink-900/10 bg-ink-900/[0.035] p-4 text-xs leading-relaxed text-ink-600/90">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-current-600" />
                      Your load doesn&apos;t require the ~2 MW that makes captive
                      wind practical — this need has been redirected to Open
                      Access instead.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                  <ResultCard label="Est. cost reduction" value={`${result.costReductionPct}%`} />
                  <ResultCard
                    label="Est. monthly savings"
                    value={`₹${result.monthlySavings.toLocaleString("en-IN")}`}
                  />
                  <ResultCard label="Est. CO₂ avoided" value={`${result.co2AvoidedTpa} t/yr`} />
                  <ResultCard
                    label="Est. project cost"
                    value={`₹${(result.projectCostEstimateRs / 10000000).toFixed(2)} Cr`}
                    sub="Zero-capex financing available — no upfront investment required."
                  />
                </div>

                <LandedCostCompare landedCosts={landedCosts} state={state} voltageLevel={voltageLevel} />

                <CaptiveIrrPanel
                  state={state}
                  defaultAcCapacityKw={Math.max(result.openAccessKw, 100)}
                  gridTariffRsPerKwh={tariff}
                  landedCosts={landedCosts}
                />

                <div className="rounded-2xl border border-ink-900/10 bg-ink-900/[0.025]">
                  <button
                    type="button"
                    onClick={() => setHowCalcOpen((v) => !v)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-ink-900">
                      How we calculated this
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-ink-500 transition-transform ${
                        howCalcOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {howCalcOpen && (
                    <div className="space-y-3 border-t border-ink-900/10 px-5 py-4 text-xs leading-relaxed text-ink-600/90">
                      <p>
                        <span className="text-ink-800">Generation yield —</span>{" "}
                        {genYield.rooftop} kWh/kWp/day (rooftop) and{" "}
                        {genYield.ground} kWh/kWp/day (ground-mount), indicative
                        for {state === "Other" ? "a generic Indian site" : state}.
                      </p>
                      <p>
                        <span className="text-ink-800">Landed cost stack —</span>{" "}
                        third-party PPA / captive LCOE + wheeling charge + wheeling
                        losses + cross-subsidy surcharge (CSS) + additional
                        surcharge (ASC) + banking charge, each itemized and
                        sourced per state and voltage level — see the comparison
                        above, not a flat discount off the retail tariff.
                      </p>
                      <p>
                        <span className="text-ink-800">Sizing rules of thumb —</span>{" "}
                        ~60 sq ft/kW rooftop, ~3.5 acres/MW ground-mount, 1 MW /
                        2 MW on-site viability thresholds for ground-mount and
                        wind respectively
                        {considerBattery
                          ? `, battery sized for a ~${BATTERY_BRIDGING_HOURS}-hour bridging window.`
                          : " — battery not included in this plan."}
                      </p>
                      <p>
                        <span className="text-ink-800">Project cost —</span>{" "}
                        blended indicative capex of ₹42,000/kW (rooftop),
                        ₹38,000/kW (ground-mount) and ₹68,000/kW (wind).
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-current-500/30 bg-current-400/8 p-4 text-xs leading-relaxed text-ink-600">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-current-700" />
                  <p>
                    <span className="font-medium text-current-700">
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
                  consumptionKwh={monthlyUnits}
                  tariffRsPerKwh={tariff}
                />
              </div>
            </AssistantBubble>
          );
        })}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Landed-cost comparison — current landing cost vs Open Access vs Captive vs
// Group Captive, each itemized (see src/lib/calculations/landedCost.ts).
// ---------------------------------------------------------------------------

const LANDED_ROUTE_META: Record<LandedCostRoute, { label: string; hint: string }> = {
  grid: { label: "Current (Grid)", hint: "What you pay today" },
  third_party: { label: "Open Access (Third-Party)", hint: "PPA + wheeling + CSS + ASC + banking" },
  captive: { label: "Captive", hint: "Own plant — CSS/ASC exempt" },
  group_captive: { label: "Group Captive", hint: "Pooled ownership — CSS/ASC exempt" },
};

function LandedCostCompare({
  landedCosts,
  state,
  voltageLevel,
}: {
  landedCosts: Record<LandedCostRoute, LandedCostBreakdown>;
  state: StateName;
  voltageLevel: VoltageLevel;
}) {
  const [openRoute, setOpenRoute] = useState<LandedCostRoute | null>(null);
  const routes: LandedCostRoute[] = ["grid", "third_party", "captive", "group_captive"];
  const cheapest = Math.min(...routes.map((r) => landedCosts[r].landedCostRsPerKwh));

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-paper-100/40 p-5">
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-current-600" />
        <h4 className="text-sm font-medium text-ink-900">
          Landed cost — grid vs Open Access vs Captive vs Group Captive
        </h4>
      </div>
      <p className="mt-1 text-xs text-ink-500/90">
        Itemized Rs/kWh at {voltageLevel} in {state}. Not a flat discount —
        wheeling, losses, CSS, ASC and banking are each broken out below.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {routes.map((route) => {
          const breakdown = landedCosts[route];
          const isCheapest = breakdown.landedCostRsPerKwh === cheapest;
          const isOpen = openRoute === route;
          return (
            <div
              key={route}
              className={`rounded-xl border p-4 ${
                isCheapest ? "border-forest-500/40 bg-forest-500/[0.06]" : "border-ink-900/10 bg-paper-50"
              }`}
            >
              <p className="font-mono-tag text-[10px] uppercase text-ink-500">
                {LANDED_ROUTE_META[route].label}
              </p>
              <p className="mt-1.5 font-display text-xl font-medium text-ink-900">
                ₹{breakdown.landedCostRsPerKwh.toFixed(2)}
                <span className="text-xs font-normal text-ink-500">/kWh</span>
              </p>
              <p className="mt-1 text-[11px] text-ink-500/80">{LANDED_ROUTE_META[route].hint}</p>
              {isCheapest && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-forest-500/12 px-2 py-0.5 text-[10px] font-medium text-forest-700">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Lowest landed cost
                </span>
              )}
              {breakdown.lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => setOpenRoute(isOpen ? null : route)}
                  className="mt-2 flex items-center gap-1 text-[11px] font-medium text-current-600 hover:text-current-700"
                >
                  {isOpen ? "Hide" : "Show"} breakdown
                  <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
              )}
              {isOpen && (
                <div className="mt-2 space-y-1 border-t border-ink-900/10 pt-2">
                  {breakdown.lineItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-[11px] text-ink-600/90">
                      <span className="truncate pr-2">{item.label}</span>
                      <span className="font-mono-tag shrink-0">₹{item.valueRsPerKwh.toFixed(2)}</span>
                    </div>
                  ))}
                  {breakdown.isPlaceholder && (
                    <p className="mt-1.5 flex items-start gap-1 text-[10px] leading-relaxed text-current-700">
                      <AlertTriangle className="mt-0.5 h-2.5 w-2.5 shrink-0" />
                      Includes a placeholder figure — verify before commercial use.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Captive / Group Captive IRR — asks the two extra inputs a captive route
// needs (debt:equity ratio, DC:AC ratio) and solves IRR via the same
// bisection engine as the Investment Path (see investmentModel.ts).
// ---------------------------------------------------------------------------

function CaptiveIrrPanel({
  state,
  defaultAcCapacityKw,
  gridTariffRsPerKwh,
  landedCosts,
}: {
  state: StateName;
  defaultAcCapacityKw: number;
  gridTariffRsPerKwh: number;
  landedCosts: Record<LandedCostRoute, LandedCostBreakdown>;
}) {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState<"captive" | "group_captive">("captive");
  const [debtEquityPct, setDebtEquityPct] = useState(70);
  const [dcAcRatio, setDcAcRatio] = useState(1.2);

  const genYield = lookupGenerationYield(state);

  const result = useMemo(() => {
    const sizing = {
      acCapacityKw: defaultAcCapacityKw,
      dcAcRatio,
      capexRsPerKwDc: 38000, // indicative blended solar capex, Rs/kW DC — same order as optimizer.ts's ground-mount rate
      generationYieldKwhPerKwpPerDay: genYield.ground,
      landedCostRsPerKwh: gridTariffRsPerKwh, // avoided cost = what you'd otherwise pay the grid
      omRsPerKwYear: 500, // indicative O&M, Rs/kW DC/year
    };
    const financing = {
      debtEquityRatio: debtEquityPct / 100,
      debtRatePct: 9.5,
      debtTenorYears: 15,
      revenueEscalationPct: 3,
      omEscalationPct: 5,
      depreciationPct: 4, // straight-line over a 25-year asset life
      taxRatePct: 25,
      discountRatePct: 10,
      projectLifeYears: 25,
    };
    const investmentInputs = buildCaptiveInvestmentInputs(sizing, financing);
    return { investmentInputs, model: computeInvestmentModel(investmentInputs) };
  }, [defaultAcCapacityKw, dcAcRatio, debtEquityPct, genYield.ground, gridTariffRsPerKwh]);

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-paper-100/40 p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <Landmark className="h-4 w-4 text-current-600" />
          <h4 className="text-sm font-medium text-ink-900">
            Estimate Captive / Group Captive IRR
          </h4>
        </div>
        <ChevronDown className={`h-4 w-4 text-ink-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <p className="mt-1 text-xs text-ink-500/90">
        Landed cost at ₹{landedCosts[route].landedCostRsPerKwh.toFixed(2)}/kWh for this
        route — give us your financing structure and we&apos;ll solve project and
        equity IRR.
      </p>

      {open && (
        <div className="mt-4 space-y-5 border-t border-ink-900/10 pt-4">
          <div>
            <FieldLabel>Route</FieldLabel>
            <SegmentedToggle
              options={[
                { value: "captive", label: "Captive" },
                { value: "group_captive", label: "Group Captive" },
              ]}
              value={route}
              onChange={setRoute}
            />
          </div>
          <Slider
            label="Debt : Equity ratio"
            value={debtEquityPct}
            min={0}
            max={90}
            step={5}
            unit="% debt"
            onChange={setDebtEquityPct}
            hint={`${debtEquityPct}% debt / ${100 - debtEquityPct}% equity — typical project-finance structures run 60–75% debt.`}
          />
          <Slider
            label="DC : AC ratio (inverter loading ratio)"
            value={dcAcRatio}
            min={1.0}
            max={1.5}
            step={0.05}
            unit="×"
            onChange={setDcAcRatio}
            hint="Higher ratios pack more DC panel capacity per inverter — more energy, but some clipping loss above ~1.2×."
          />

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            <ResultCard
              label="Project IRR"
              value={result.model.projectIrrPct !== null ? `${result.model.projectIrrPct}%` : "—"}
            />
            <ResultCard
              label="Equity IRR"
              value={result.model.equityIrrPct !== null ? `${result.model.equityIrrPct}%` : "—"}
            />
            <ResultCard
              label="Simple payback"
              value={result.model.simplePaybackYrs !== null ? `${result.model.simplePaybackYrs} yrs` : "—"}
            />
            <ResultCard label="DSCR (Yr 1)" value={result.model.dscrYear1 !== null ? `${result.model.dscrYear1}×` : "—"} />
          </div>
          <p className="text-[11px] leading-relaxed text-ink-500/80">
            Indicative capex ₹38,000/kW DC, 9.5% debt rate, 15-yr tenor, 25-yr
            project life, 25% tax — same auditable bisection IRR solver as the
            Investment Path in your dashboard. Not a financing offer.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Strategy card
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
          ? "border-forest-500/40 bg-forest-500/[0.08]"
          : "border-ink-900/10 bg-ink-900/[0.025] hover:border-ink-900/20"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          selected ? "bg-forest-500/12 text-forest-700" : "bg-ink-900/5 text-ink-500"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-ink-900">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-500">{description}</p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Lead capture
// ---------------------------------------------------------------------------

function LeadCapture({
  showLeadForm,
  setShowLeadForm,
  leadSubmitted,
  setLeadSubmitted,
  consumptionKwh,
  tariffRsPerKwh,
}: {
  showLeadForm: "email" | "advisor" | null;
  setShowLeadForm: (v: "email" | "advisor" | null) => void;
  leadSubmitted: boolean;
  setLeadSubmitted: (v: boolean) => void;
  consumptionKwh: number;
  tariffRsPerKwh: number;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "energy_optimizer",
          name: form.get("name"),
          company: form.get("company"),
          email: form.get("email"),
          phone: form.get("phone"),
          consumption: `${consumptionKwh.toLocaleString("en-IN")} kWh/month`,
          tariff: `₹${tariffRsPerKwh}/kWh`,
          requirement: showLeadForm === "email" ? "Email me this plan" : "Talk to an advisor",
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      setLeadSubmitted(true);
    } catch {
      setError("Something went wrong sending your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (leadSubmitted) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-forest-500/30 bg-forest-500/[0.06] p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-forest-600" />
        <p className="mt-3 text-sm font-medium text-ink-900">
          Thanks — we&apos;ve received your details.
        </p>
        <p className="mt-1 text-xs text-ink-600/80">
          A member of the AINERGY team will follow up with your plan shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-paper-50 p-6 lg:p-8">
      {!showLeadForm ? (
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-ink-900">
              Want to keep this plan?
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Save the numbers above, or talk to an advisor about turning
              this into a real proposal.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => setShowLeadForm("email")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900/30"
            >
              <Mail className="h-4 w-4" />
              Email me this plan
            </button>
            <button
              type="button"
              onClick={() => setShowLeadForm("advisor")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow"
            >
              <PhoneCall className="h-4 w-4" />
              Talk to an advisor
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleLeadSubmit}>
          <p className="mb-4 text-sm font-medium text-ink-900">
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
          {error && (
            <p className="mt-3 flex items-center gap-2 text-xs text-red-600">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}
          <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowLeadForm(null)}
              className="rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow disabled:opacity-60"
            >
              {submitting
                ? "Sending…"
                : showLeadForm === "email"
                  ? "Send me the plan"
                  : "Request a call"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
