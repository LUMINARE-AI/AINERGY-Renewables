"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const INDUSTRIES = [
  "Manufacturing",
  "Automotive",
  "Textile",
  "Pharmaceuticals",
  "Chemicals",
  "Warehousing",
  "Data Centers",
  "Retail",
  "Hospitality",
  "Food & Beverage",
  "Engineering",
  "Commercial Real Estate",
  "Other",
];

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-graphite-950/60 px-4 py-3 text-sm text-offwhite-100 placeholder:text-offwhite-300/35 transition-colors focus:border-teal-400/60 focus:outline-none";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-emerald-400/25 bg-emerald-400/[0.05] p-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        <h3 className="mt-5 font-display text-xl font-medium text-offwhite-100">
          Thank you — we&apos;ve received your details.
        </h3>
        <p className="mt-2 max-w-sm text-sm text-offwhite-300/60">
          A member of the AINERGY team will get in touch shortly to discuss
          your energy requirements.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-graphite-900/40 p-7 lg:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-offwhite-300/70">
            Name
          </label>
          <input id="name" name="name" required className={fieldClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="company" className="mb-2 block text-sm text-offwhite-300/70">
            Company
          </label>
          <input id="company" name="company" required className={fieldClass} placeholder="Your company" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-offwhite-300/70">
            Email
          </label>
          <input id="email" name="email" type="email" required className={fieldClass} placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm text-offwhite-300/70">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" required className={fieldClass} placeholder="+91" />
        </div>
        <div>
          <label htmlFor="city" className="mb-2 block text-sm text-offwhite-300/70">
            City
          </label>
          <input id="city" name="city" required className={fieldClass} placeholder="City" />
        </div>
        <div>
          <label htmlFor="industry" className="mb-2 block text-sm text-offwhite-300/70">
            Industry
          </label>
          <select id="industry" name="industry" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select industry
            </option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="consumption" className="mb-2 block text-sm text-offwhite-300/70">
            Monthly electricity consumption
          </label>
          <input id="consumption" name="consumption" className={fieldClass} placeholder="e.g. 150,000 kWh" />
        </div>
        <div>
          <label htmlFor="tariff" className="mb-2 block text-sm text-offwhite-300/70">
            Current electricity tariff
          </label>
          <input id="tariff" name="tariff" className={fieldClass} placeholder="e.g. ₹8.5 / kWh" />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="requirement" className="mb-2 block text-sm text-offwhite-300/70">
          Requirement
        </label>
        <select id="requirement" name="requirement" className={fieldClass} defaultValue="">
          <option value="" disabled>
            What are you exploring?
          </option>
          <option>On-site Solar</option>
          <option>Open Access</option>
          <option>Wind + Solar Hybrid</option>
          <option>Battery Storage</option>
          <option>Energy Intelligence</option>
          <option>EV Energy</option>
          <option>Energy-as-a-Service</option>
          <option>Not sure yet</option>
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-2 block text-sm text-offwhite-300/70">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={fieldClass}
          placeholder="Tell us a bit about your energy requirements"
        />
      </div>

      <button
        type="submit"
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-medium text-graphite-950 transition-all hover:bg-emerald-400 hover:shadow-glow sm:w-auto"
      >
        Build My Energy Plan
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
