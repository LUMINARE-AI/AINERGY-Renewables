import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { STATES, VOLTAGE_LEVELS } from "@/lib/regulatory/tariffData";
import { createFacility } from "@/lib/actions/facilities";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-graphite-950/60 px-4 py-3 text-sm text-offwhite-100 placeholder:text-offwhite-300/35 transition-colors focus:border-current-400/60 focus:outline-none focus:ring-1 focus:ring-current-400/20";
const labelClass = "mb-2 block text-sm text-offwhite-300/70";

export default function NewFacilityPage() {
  return (
    <section className="py-16 lg:py-20">
      <Container className="max-w-2xl">
        <SectionHeader eyebrow="New Facility" title="Add a facility" tone="dark" />

        <form action={createFacility} className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-graphite-900/50 p-7">
          <div>
            <label htmlFor="name" className={labelClass}>
              Facility name
            </label>
            <input id="name" name="name" required className={fieldClass} placeholder="e.g. Bhiwadi Plant" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="state" className={labelClass}>
                State
              </label>
              <select id="state" name="state" required defaultValue="" className={fieldClass}>
                <option value="" disabled>
                  Select state
                </option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="discom" className={labelClass}>
                DISCOM (optional)
              </label>
              <input id="discom" name="discom" className={fieldClass} placeholder="e.g. JVVNL" />
            </div>
            <div>
              <label htmlFor="consumerType" className={labelClass}>
                Consumer category
              </label>
              <select id="consumerType" name="consumerType" required defaultValue="industrial" className={fieldClass}>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div>
              <label htmlFor="voltageLevel" className={labelClass}>
                Voltage level
              </label>
              <select id="voltageLevel" name="voltageLevel" required defaultValue="" className={fieldClass}>
                <option value="" disabled>
                  Select voltage
                </option>
                {VOLTAGE_LEVELS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sanctionedLoadKva" className={labelClass}>
                Sanctioned load (kVA)
              </label>
              <input
                id="sanctionedLoadKva"
                name="sanctionedLoadKva"
                type="number"
                min={1}
                step="any"
                required
                className={fieldClass}
                placeholder="e.g. 5000"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-current-400 px-7 py-3.5 text-sm font-medium text-graphite-950 shadow-[0_0_0_1px_rgba(58,187,194,0.40)] transition-all hover:bg-current-300 hover:shadow-glow-dark"
          >
            Create facility
          </button>
        </form>
      </Container>
    </section>
  );
}
