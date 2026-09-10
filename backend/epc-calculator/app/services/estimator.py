"""Pure calculation engine for the EPC cost estimate. No I/O — easy to unit test."""

from __future__ import annotations

from app.core.rate_card import DEFAULT_RATE_CARD, RateCard
from app.models.enums import InverterType, ModuleType, MountingType, ProjectScope, SiteState
from app.models.schemas import CostRange, EstimateRequest, EstimateResponse, LineItem

CRORE = 10_000_000

# Cumulative BOM line items included at each project scope tier.
SCOPE_LINE_ITEMS: dict[ProjectScope, list[str]] = {
    ProjectScope.MODULES_ONLY: ["modules"],
    ProjectScope.MODULES_MOUNTING: ["modules", "mounting_structure"],
    ProjectScope.MODULES_MOUNTING_INVERTER: ["modules", "mounting_structure", "inverters"],
    ProjectScope.BOS_EXCL_EVACUATION: [
        "modules",
        "mounting_structure",
        "inverters",
        "dc_cabling_earthing",
        "lt_ht_panels",
        "transformers",
        "bus_duct",
        "scada_monitoring",
        "civil_works",
        "installation_commissioning",
        "project_management",
    ],
    ProjectScope.FULL_EPC_TURNKEY: [
        "modules",
        "mounting_structure",
        "inverters",
        "dc_cabling_earthing",
        "lt_ht_panels",
        "transformers",
        "bus_duct",
        "scada_monitoring",
        "civil_works",
        "installation_commissioning",
        "project_management",
        "evacuation_infrastructure",
    ],
}

LINE_ITEM_LABELS: dict[str, str] = {
    "modules": "PV modules",
    "mounting_structure": "Mounting structure",
    "inverters": "Inverters",
    "dc_cabling_earthing": "DC cabling & earthing",
    "lt_ht_panels": "LT & HT panels",
    "transformers": "Transformers",
    "bus_duct": "Bus duct",
    "scada_monitoring": "SCADA & monitoring",
    "civil_works": "Civil works",
    "installation_commissioning": "Installation & commissioning",
    "project_management": "Project management & overheads",
    "evacuation_infrastructure": "Evacuation (DP yard, bay extension, transmission line)",
}


def _resolve_dc_ac_ratio(req: EstimateRequest, rc: RateCard) -> float:
    if req.dc_ac_ratio is not None:
        return req.dc_ac_ratio
    return rc.dc_ac_ratio_defaults.dcr if req.module_type == ModuleType.DCR else rc.dc_ac_ratio_defaults.non_dcr


def _rs_per_wp(key: str, req: EstimateRequest, rc: RateCard) -> float:
    if key == "modules":
        return rc.modules.dcr_rs_per_wp if req.module_type == ModuleType.DCR else rc.modules.non_dcr_rs_per_wp
    if key == "mounting_structure":
        return (
            rc.mounting.tracker_rs_per_wp if req.mounting_type == MountingType.TRACKER else rc.mounting.fixed_rs_per_wp
        )
    if key == "inverters":
        return (
            rc.inverters.central_rs_per_wp if req.inverter_type == InverterType.CENTRAL else rc.inverters.string_rs_per_wp
        )
    bos_field = f"{key}_rs_per_wp"
    if hasattr(rc.bos, bos_field):
        return getattr(rc.bos, bos_field)
    raise KeyError(f"No rate configured for line item '{key}'")


def _land_cost(req: EstimateRequest, rc: RateCard, capacity_dc_mw: float) -> float | None:
    if req.project_scope != ProjectScope.FULL_EPC_TURNKEY or not req.include_land:
        return None
    acres_per_mw = (
        rc.land.acres_per_mw_dc_tracker if req.mounting_type == MountingType.TRACKER else rc.land.acres_per_mw_dc_fixed
    )
    acres = capacity_dc_mw * acres_per_mw
    rs_per_acre = rc.land.state_rs_per_acre.get(req.state, rc.land.default_rs_per_acre)
    return acres * rs_per_acre


def build_estimate(req: EstimateRequest, rate_card: RateCard = DEFAULT_RATE_CARD) -> EstimateResponse:
    rc = rate_card

    dc_ac_ratio = _resolve_dc_ac_ratio(req, rc)
    capacity_dc_mw = req.capacity_ac_mw * dc_ac_ratio
    capacity_dc_wp = capacity_dc_mw * 1_000_000

    logistics_multiplier = rc.state_logistics.multipliers.get(req.state, 1.0)

    line_items: list[LineItem] = []
    epc_subtotal_base = 0.0
    for key in SCOPE_LINE_ITEMS[req.project_scope]:
        if key == "evacuation_infrastructure":
            amount = req.evacuation_line_km * rc.evacuation.transmission_line_rs_per_km
        else:
            amount = _rs_per_wp(key, req, rc) * capacity_dc_wp
        amount *= logistics_multiplier
        line_items.append(
            LineItem(
                key=key,
                label=LINE_ITEM_LABELS[key],
                rs_per_wp_dc=amount / capacity_dc_wp,
                amount_inr=round(amount, 2),
            )
        )
        epc_subtotal_base += amount

    low_factor = rc.bands.low_factor
    high_factor = rc.bands.high_factor
    epc_subtotal = CostRange(
        low=epc_subtotal_base * low_factor,
        base=epc_subtotal_base,
        high=epc_subtotal_base * high_factor,
    )

    land_cost = _land_cost(req, rc, capacity_dc_mw)
    land_component = land_cost or 0.0

    total_ex_gst = CostRange(
        low=epc_subtotal.low + land_component,
        base=epc_subtotal.base + land_component,
        high=epc_subtotal.high + land_component,
    )

    blended_gst_rate = rc.gst.blended_rate
    gst_amount = CostRange(
        low=epc_subtotal.low * blended_gst_rate,
        base=epc_subtotal.base * blended_gst_rate,
        high=epc_subtotal.high * blended_gst_rate,
    )
    total_incl_gst = CostRange(
        low=total_ex_gst.low + gst_amount.low,
        base=total_ex_gst.base + gst_amount.base,
        high=total_ex_gst.high + gst_amount.high,
    )

    rs_per_wp_dc = CostRange(
        low=total_ex_gst.low / capacity_dc_wp,
        base=total_ex_gst.base / capacity_dc_wp,
        high=total_ex_gst.high / capacity_dc_wp,
    )
    cr_per_mw_dc = CostRange(
        low=total_ex_gst.low / capacity_dc_mw / CRORE,
        base=total_ex_gst.base / capacity_dc_mw / CRORE,
        high=total_ex_gst.high / capacity_dc_mw / CRORE,
    )
    cr_per_mw_ac = CostRange(
        low=total_ex_gst.low / req.capacity_ac_mw / CRORE,
        base=total_ex_gst.base / req.capacity_ac_mw / CRORE,
        high=total_ex_gst.high / req.capacity_ac_mw / CRORE,
    )

    assumptions = [
        f"DC:AC ratio used: {dc_ac_ratio:.2f} "
        f"({'explicit override' if req.dc_ac_ratio is not None else 'default for ' + req.module_type.value})",
        f"DC capacity: {capacity_dc_mw:.2f} MW (= {req.capacity_ac_mw:.2f} MW AC x {dc_ac_ratio:.2f})",
        f"State logistics multiplier for {req.state.value}: {logistics_multiplier:.2f}x on equipment/BOS/evacuation",
        f"Blended GST rate: {blended_gst_rate * 100:.1f}% "
        f"({rc.gst.goods_share * 100:.0f}% goods @ {rc.gst.goods_rate * 100:.0f}% "
        f"+ {rc.gst.services_share * 100:.0f}% service @ {rc.gst.services_rate * 100:.0f}%), applied to the EPC "
        "subtotal only",
        f"Low/high band: base x {low_factor:.3f} / base x {high_factor:.3f}",
    ]
    if land_cost is not None:
        assumptions.append(
            "Land cost is a single point estimate (not banded low/high) and is GST-exempt "
            "(stamp duty applies separately, not modelled here)."
        )
    return EstimateResponse(
        inputs=req,
        resolved_dc_ac_ratio=dc_ac_ratio,
        capacity_ac_mw=req.capacity_ac_mw,
        capacity_dc_mw=capacity_dc_mw,
        line_items=line_items,
        epc_subtotal_ex_gst_inr=epc_subtotal,
        land_cost_inr=land_cost,
        total_ex_gst_inr=total_ex_gst,
        blended_gst_rate_pct=round(blended_gst_rate * 100, 2),
        gst_amount_inr=gst_amount,
        total_incl_gst_inr=total_incl_gst,
        rs_per_wp_dc=rs_per_wp_dc,
        cr_per_mw_dc=cr_per_mw_dc,
        cr_per_mw_ac=cr_per_mw_ac,
        assumptions=assumptions,
    )
