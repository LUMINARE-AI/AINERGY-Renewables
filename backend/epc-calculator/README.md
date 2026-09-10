# SunCost — Ainergy Solar EPC Estimator API

A FastAPI service that generates planning-grade cost estimates for utility-scale
(MW-class) solar EPC projects, modelled on the shape of
[ShakeDeal's Solar EPC Cost Estimator](https://www.shakedeal.com/solar-epc-cost-estimator):
give it plant capacity + a handful of design/site choices, get back a
low / base / high BOM cost breakdown, Rs-per-Wp and Rs-crore-per-MW figures, and a
GST-inclusive total.

> Naming: "SunCost" is a placeholder — see **Name suggestions** below. It's only
> referenced in `app/core/config.py` (`Settings.app_name`), so renaming it is a
> one-line change.

## Why this shape

The reference calculator's markup doesn't expose its actual BOM rates or formulas
(they're computed client-side from data not present in the static page), so this API
is a clean-room reimplementation: same inputs, same category of outputs, same "BOM
line items × low/base/high band" mental model — but with its own rate card. The
rates in [`app/core/rate_card.py`](app/core/rate_card.py) are **illustrative
defaults** assembled from publicly stated industry ranges, not Ainergy's real
procurement pricing. They're deliberately centralized in one file so Ainergy's
actual sourced rates can be dropped in without touching any calculation logic.

## What it calculates

**Inputs** (`POST /api/v1/estimate`):

| Field | Type | Notes |
|---|---|---|
| `capacity_ac_mw` | float | Plant AC (grid export) capacity, required |
| `dc_ac_ratio` | float, optional | Override; else defaults by module type (DCR 1.30, non-DCR 1.28) |
| `module_type` | `dcr` \| `non_dcr` | DCR = ALMM-listed Indian cells |
| `mounting_type` | `fixed` \| `tracker` | |
| `inverter_type` | `string` \| `central` | |
| `project_scope` | 5 tiers, `modules_only` → `full_epc_turnkey` | Cumulative — see `/api/v1/config/scopes` |
| `state` | one of 9 named states + `other` | Drives a logistics multiplier + land rate |
| `evacuation_line_km` | float | Only priced at `full_epc_turnkey` scope |
| `include_land` | bool | Only priced at `full_epc_turnkey` scope |

**Outputs** (`EstimateResponse`): itemized BOM line items (modules, mounting
structure, inverters, DC cabling & earthing, LT/HT panels, transformers, bus duct,
SCADA & monitoring, civil works, installation & commissioning, project management,
evacuation infrastructure), each with its Rs/Wp(DC) rate and amount; EPC subtotal and
grand total as low/base/high bands; land cost (point estimate, GST-exempt); blended
GST (13.8% = 70% goods @ 12% + 30% service @ 18%, per India's Solar Power Generating
System composite-supply treatment); Rs/Wp(DC), Rs cr/MW(DC) and Rs cr/MW(AC); and a
list of human-readable assumptions plus a standard planning-grade disclaimer.

## Endpoints

- `POST /api/v1/estimate` — run an estimate
- `GET /api/v1/config/rate-card` — current rate card (for transparency/audit)
- `GET /api/v1/config/states` — supported states + their multipliers/land rates
- `GET /api/v1/config/scopes` — supported project scopes + what each includes
- `GET /health` — liveness check
- `GET /docs` — interactive Swagger UI

## Running locally

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Then open http://127.0.0.1:8000/docs.

## Tests

```powershell
pytest
```

## Project layout

```
app/
  core/
    config.py       # app settings (name, version, CORS)
    rate_card.py     # ALL tunable Rs/Wp rates, GST config, bands, multipliers — edit this to recalibrate
  models/
    enums.py         # ModuleType, MountingType, InverterType, ProjectScope, SiteState
    schemas.py        # request/response Pydantic models
  services/
    estimator.py      # pure calculation engine (no I/O — unit tested directly)
  api/routes/
    estimate.py        # POST /api/v1/estimate
    meta.py             # GET config endpoints
  main.py                # FastAPI app, routers, CORS
tests/
  test_estimator.py       # calculation engine unit tests
  test_api.py               # HTTP-level tests via TestClient
```

## Recalibrating the rate card

Everything a business user would want to tune lives in
[`app/core/rate_card.py`](app/core/rate_card.py): per-component Rs/Wp rates,
DC:AC ratio defaults, GST split, land acreage/pricing assumptions, state logistics
multipliers, and the low/high band factors. Swap in Ainergy's real sourced BOM
numbers there — no other file needs to change.

## Disclaimer

This is a planning-grade budgeting tool, not a quoting engine. It excludes
financing costs, contingency, O&M, price escalation, and GST input tax credit. Like
the reference calculator, it should point users toward a benchmarked RFQ for a firm,
line-item number.

## Name suggestions

"SunCost" is used as a placeholder in this codebase. Other options for the
Ainergy-branded product name, if you'd like to pick a different one:

- **SunCost** — direct, on-brand, easy to say ("get a SunCost estimate")
- **EPC Compass** — leans into "guidance for a complex decision"
- **SolarSage** — advisory/expert connotation
- **WattWise Estimator** — friendly, approachable
- **RayQuote** — implies it's a step toward a real quote
- **Ainergy CostRay** — ties the "Ainergy" and "solar ray" branding together

Whichever you pick, only `Settings.app_name` in `app/core/config.py` needs updating.
