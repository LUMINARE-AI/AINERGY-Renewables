"use client";

import { useMemo, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
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
    </div>
  );
}

function ResultTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-900/10 bg-paper-50 p-5">
      <p className="font-mono-tag text-[11px] uppercase text-ink-500">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-medium text-ink-900">
        {value}
      </p>
    </div>
  );
}

export function OptimizerDemo() {
  const [consumption, setConsumption] = useState(150000); // kWh/month
  const [tariff, setTariff] = useState(8.5); // Rs/kWh
  const [operatingHours, setOperatingHours] = useState(16); // hrs/day
  const [renewableTarget, setRenewableTarget] = useState(60); // %
  const [rooftop, setRooftop] = useState(40000); // sq ft available

  const results = useMemo(() => {
    const dailyKwh = consumption / 30;
    const rooftopCapKw = Math.round(rooftop / 60); // ~60 sqft per kW
    const targetRenewableKwh = (dailyKwh * renewableTarget) / 100;

    const solarKw = Math.min(
      rooftopCapKw,
      Math.round((targetRenewableKwh * 0.65) / 4.5)
    );
    const windShare = operatingHours > 16 ? 0.28 : 0.16;
    const windKw = Math.round((targetRenewableKwh * windShare) / 3.2);
    const batteryKwh = Math.round((dailyKwh / operatingHours) * 3);

    const achievedRenewablePct = Math.min(
      95,
      Math.round(renewableTarget * 0.92)
    );
    const costReductionPct = Math.min(
      42,
      Math.round(8 + achievedRenewablePct * 0.32)
    );
    const co2AvoidedTpa = Math.round((solarKw * 1.5 + windKw * 2.1) * 0.82);

    return {
      solarKw,
      windKw,
      batteryKwh,
      achievedRenewablePct,
      costReductionPct,
      co2AvoidedTpa,
      monthlySavings: Math.round(
        (consumption * tariff * costReductionPct) / 100
      ),
    };
  }, [consumption, tariff, operatingHours, renewableTarget, rooftop]);

  return (
    <section id="optimizer" className="bg-paper-100/50 py-24 lg:py-32 scroll-mt-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Energy Procure Copilot"
            title="What could your energy system look like?"
            description="Drag the sliders for a quick feel — or open the full Copilot and upload a real bill for numbers tuned to your facility."
          />
          <Button
            href="/energy-optimizer"
            variant="secondary"
            icon
            className="shrink-0"
          >
            Open the full Copilot
          </Button>
        </div>

        <Reveal delay={0.1} className="mt-14">
          <div className="grid gap-6 rounded-3xl border border-ink-900/10 bg-paper-50 p-6 shadow-premium lg:grid-cols-[1fr_1.1fr] lg:p-10">
            <div className="space-y-7">
              <Slider
                label="Monthly electricity consumption"
                value={consumption}
                min={5000}
                max={1000000}
                step={5000}
                unit="kWh"
                onChange={setConsumption}
              />
              <Slider
                label="Average tariff"
                value={tariff}
                min={4}
                max={14}
                step={0.1}
                unit="₹/kWh"
                onChange={setTariff}
              />
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
                label="Rooftop availability"
                value={rooftop}
                min={0}
                max={200000}
                step={1000}
                unit="sq ft"
                onChange={setRooftop}
              />
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <ResultTile
                  label="Recommended solar"
                  value={`${results.solarKw.toLocaleString("en-IN")} kW`}
                />
                <ResultTile
                  label="Recommended wind"
                  value={`${results.windKw.toLocaleString("en-IN")} kW`}
                />
                <ResultTile
                  label="Battery requirement"
                  value={`${results.batteryKwh.toLocaleString("en-IN")} kWh`}
                />
                <ResultTile
                  label="Renewable share"
                  value={`${results.achievedRenewablePct}%`}
                />
                <ResultTile
                  label="Est. cost reduction"
                  value={`${results.costReductionPct}%`}
                />
                <ResultTile
                  label="Est. CO₂ avoided"
                  value={`${results.co2AvoidedTpa} tCO₂/yr`}
                />
              </div>

              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-current-500/25 bg-current-400/8 p-4 text-xs leading-relaxed text-ink-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-current-600" />
                <p>
                  <span className="font-medium text-current-700">
                    Illustrative estimate — not a commercial quotation.
                  </span>{" "}
                  Figures are generated by a simplified demonstration model
                  for exploration purposes only. The full Copilot reads your
                  actual bill instead of these sliders.
                </p>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                <Sparkles className="h-3.5 w-3.5 text-current-600" />
                Upload a bill in the full Copilot for AI-read numbers.
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
