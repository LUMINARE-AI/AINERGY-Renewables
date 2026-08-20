# AINERGY — Energy OS site + Open Access analysis platform

Next.js 15 (App Router) marketing site for AINERGY, plus a signed-in Open Access /
renewable-procurement analysis product built on top of it (internal codename
"PowerProcure AI"). This README covers both: the static site was already here; the
analysis product (auth, database, scenario/recommendation/investment engines) is new.

See `claude-code-prompt-powerprocure-ai.md` in the repo root for the full original
product spec this build implements.

## What's real vs. illustrative

Every number this app produces — tariffs, wheeling charges, delivered cost, savings,
IRR, DSCR — comes from deterministic TypeScript, never an LLM. Nothing here is a
verified commercial quotation. The base tariffs for Karnataka/Maharashtra/Rajasthan in
`src/lib/regulatory/tariffData.ts` are modeled figures, not fabricated, but are not
individually source-cited yet. Anything flagged `isPlaceholder: true` (see the Gujarat
fixture) is a rough order-of-magnitude stand-in and must be confirmed against the
applicable state tariff order before any commercial use. IRR/payback/DSCR are
projections based on the assumptions shown next to them — never a guaranteed or
promised return.

## Architecture

- **Public marketing site** (`/`, `/solutions`, `/energy-os`, `/projects`,
  `/for-business`, `/insights`, `/about`, `/contact`) — unchanged, static.
- **`/energy-optimizer`** — the public, zero-friction "Energy Procure Copilot" teaser
  (`EnergyPlanner.tsx`), still anonymous and client-only (no database write). It's a
  conversational, chatbot-style flow: one assistant bubble per question, with live
  interactive controls inline; answered turns collapse into a compact "you said"
  summary that can be reopened to edit at any point, rather than a fixed multi-page
  wizard. It opens with a bill-upload step (`components/copilot/BillUploadStep.tsx` +
  `app/api/extract-bill/route.ts`): a PDF/image bill is sent to Claude
  (`ANTHROPIC_API_KEY`) via a forced tool-use call against the schema in
  `lib/billExtraction/schema.ts`, which returns each field with a confidence score and
  a source quote. The UI shows those as editable, confidence-flagged chips before
  handing the confirmed profile into the existing wizard/calculation engine — nothing
  about `computePlan()` changed. Without `ANTHROPIC_API_KEY` set, the route returns a
  clear "not configured" message and the UI falls back to manual entry (the "Skip,
  enter manually" path), so the page still works out of the box. This is the same
  extraction shape as `ElectricityBill`/`ElectricityBillLineItem` below — wiring it to
  actually persist behind auth is additive, not a reshape.

  Battery/BESS is an explicit opt-in toggle (`considerBattery`), not forced into every
  plan. Monthly consumption goes down to 5,000 kWh (was 20,000). Results include an
  itemized landed-cost comparison — current grid vs third-party Open Access vs
  Captive vs Group Captive, each broken into PPA/LCOE + wheeling + losses + CSS + ASC +
  banking (`lib/calculations/landedCost.ts`), not a flat discount off the retail
  tariff — plus an inline Captive/Group Captive IRR estimator that asks for a debt:
  equity ratio and DC:AC (inverter loading) ratio and solves project/equity IRR with
  the same bisection engine as the Investment Path (`investmentModel.ts`'s
  `buildCaptiveInvestmentInputs` + `computeInvestmentModel`).
- **Authenticated analysis product** (`/dashboard`, `/facilities`, `/facilities/[id]`,
  `/analysis`, `/scenarios`, `/recommendation`, `/settings`) — email/password auth,
  Postgres-backed. `/analysis`, `/scenarios` and `/recommendation` are thin routes that
  forward to the relevant facility's page, since every calculation is facility-scoped
  and lives on one hub page (`/facilities/[id]`): consumption profile entry, the
  6-scenario comparison table, the recommendation panel, and the Investment Path IRR
  calculator all in one place.
- **Backend**: Next.js API routes + Server Actions (no separate FastAPI service in this
  slice — there's no OCR/PDF pipeline yet to justify one; revisit if/when bill upload
  needs Python-only libraries).
- **Database**: PostgreSQL + Prisma (`prisma/schema.prisma`). New infrastructure — none
  existed before this build.
- **Auth**: Auth.js v5, email/password (Credentials provider), JWT sessions, no
  adapter. Organization-scoped: every query filters by `session.user.organizationId`.

### Calculation engine (`src/lib/calculations/`, `src/lib/regulatory/`)

- `calculations/optimizer.ts` — the original `computePlan()` sizing/costing engine
  (moved from `src/lib/optimizer.ts`, logic unchanged).
- `regulatory/tariffData.ts` — the original tariff/wheeling/Open-Access-threshold table
  (moved from `src/lib/tariffData.ts`, unchanged), now also the seed source for the
  `TariffProfile` / `OpenAccessCharge` Postgres tables.
- `regulatory/gujaratFixture.ts` — one explicitly placeholder-flagged state fixture, per
  the spec's testing requirements.
- `calculations/scenarios.ts` — promotes `computePlan()`'s rooftop/ground/wind/OA mix
  into seven independently comparable scenarios (Grid only, Third-party solar OA,
  Captive solar, Group captive solar, Solar+wind hybrid, Solar+BESS, Rooftop+OA), each
  with its own delivered ₹/kWh, annual cost, savings, savings %, an itemized
  `landedCostBreakdown` (see below), and an illustrative risk score.
- `calculations/landedCost.ts` — itemized landed-cost engine: Grid vs Third-Party Open
  Access vs Captive vs Group Captive, each broken into named Rs/kWh line items
  (generation cost, wheeling charge, wheeling losses, CSS, ASC, banking) rather than a
  flat discount off the retail tariff. Captive/Group Captive are CSS+ASC exempt per
  Rule 3 of the Electricity Rules 2005 (26%/51% captive test); Third-Party OA is not —
  that's the one cost difference this module encodes between the two off-site routes.
- `calculations/investmentModel.ts` — the Investment Path own-asset/captive
  project-finance model: capex, debt:equity, debt rate/tenor, O&M escalation,
  depreciation, tax and discount rate are all caller-supplied (never hard-coded). IRR is
  solved by bisection on the NPV root (not a library) so it's auditable; outputs project
  IRR, equity IRR, simple payback, DSCR, and a full annual cash-flow table.
- `recommendations/engine.ts` — a deterministic rule engine (no LLM) that ranks eligible
  scenarios and recommends one only once its savings clear a threshold; always renders
  in "estimated/projected/illustrative" language.

### Database schema

`User` / `Organization` (auth + org isolation) · `Facility` / `ConsumptionProfile`
(now also `considerBattery`) · `TariffProfile` / `OpenAccessCharge` (regulatory layer,
each row carries `source`, `sourceUrl`, `effectiveDate`, `lastVerified`,
`isPlaceholder`, `notes`, plus `additionalSurchargeRsPerKwh`/`bankingChargePct`) ·
`RegulatoryRefreshLog` (audit trail for the refresh pipeline below) ·
`OpenAccessScenario` (`strategy` now includes `"captive"` alongside
`"group_captive"`) / `ScenarioResult` / `InvestmentModel` · `Recommendation` · `Lead`
(both marketing-site forms now persist here instead of only faking success locally) ·
`ElectricityBill` / `ElectricityBillLineItem` / `Report` are modeled with nullable
relations for the bill-upload/OCR/report-generation phase below, but no upload/OCR/
report code exists yet.

### Regulatory data refresh pipeline

`app/api/regulatory/refresh/route.ts` keeps the DB-backed `TariffProfile` /
`OpenAccessCharge` tables in sync with `src/lib/regulatory/tariffData.ts` — the
sourced, dated, human-researched figures that are this app's actual source of truth
(never an LLM autonomously rewriting regulatory numbers; that would break the
auditability this app is built on). "Automatic" describes the DB sync, not the
research step: when a developer updates a tariff figure in `tariffData.ts` after
checking a new tariff order, this route is what pushes that change into the DB the
authenticated app reads, and logs exactly what changed to `RegulatoryRefreshLog`.
`vercel.json` schedules it nightly via Vercel Cron (GET, which Vercel always uses for
cron jobs); set `CRON_SECRET` and Vercel automatically attaches it as a Bearer token
so the route can tell a scheduled run from a public read. A signed-in user can also
POST to it manually. See the route's file header for the full auth model.

## Setup

```bash
npm install
cp .env.example .env        # then fill in a generated AUTH_SECRET
npm run db:up                # starts Postgres via docker-compose
npm run db:migrate           # applies the schema
npm run db:seed              # seeds tariff data + a demo login
npm run dev
```

Demo login (from the seed script): `demo@ainergy.local` / `password123`.

### Environment variables

- `DATABASE_URL` — Postgres connection string (docker-compose default works as-is).
- `AUTH_SECRET` — generate with `openssl rand -base64 32`.
- `ANTHROPIC_API_KEY` — powers bill reading on `/energy-optimizer` (`/api/extract-bill`,
  via `@anthropic-ai/sdk`). Get a key from the Anthropic Console and set it to enable
  bill upload; without it the route responds with a clear "not configured" message and
  the page still works via manual entry.

## Testing

```bash
npm test          # vitest — calculation engine, scenarios, investment model, recommendations
npm run lint
npx tsc --noEmit
```

Test fixtures cover Rajasthan and Maharashtra (verified table) plus Gujarat
(placeholder-flagged, per the spec's testing requirement) — IRR/DSCR tests specifically
check that equity IRR and DSCR move in the correct direction as leverage, debt rate and
tenor change.

## What's deferred (flagged, not silently dropped)

Bill upload and Claude-based extraction now exist on the public `/energy-optimizer`
Copilot (see above) — what's still deferred is wiring that same extraction into the
authenticated flow (`/bills*`, actually writing `ElectricityBill`/
`ElectricityBillLineItem` rows instead of just returning JSON to the client); the AI
chat assistant scoped to a user's own analysis; sensitivity-analysis UI; PDF-style
report rendering (`/reports`); and the data-quality score beyond the simple "has a
profile" signal on the dashboard today. The schema is shaped so none of these need a
rework to add later.

## Limitations

- Regulatory figures cover three states (Karnataka, Maharashtra, Rajasthan) plus one
  explicitly placeholder-flagged Gujarat fixture. Every other state falls back to
  generic assumptions.
- Wind and ground-mount sizing have no land-area constraint beyond a minimum-viable-
  capacity threshold — a known simplification inherited from the original demo engine,
  not something this build changed.
- Group captive capex is approximated off the served kW at a flat ₹/kW rate (captive
  plants are typically remote, so there's no on-site land to size against) — a rougher
  approximation than the on-site strategies, which size directly from rooftop/ground
  area.
- This is a demonstration/analysis tool. It does not collect money, execute PPAs, or
  provide legal/regulatory advice.
