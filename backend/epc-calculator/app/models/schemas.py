from __future__ import annotations

from pydantic import BaseModel, Field, model_validator

from app.models.enums import InverterType, ModuleType, MountingType, ProjectScope, SiteState


class EstimateRequest(BaseModel):
    capacity_ac_mw: float = Field(
        ..., gt=0, le=500, description="Plant AC (grid export) capacity, in MW", examples=[15]
    )
    dc_ac_ratio: float | None = Field(
        None,
        gt=1.0,
        lt=2.0,
        description="Override DC:AC oversizing ratio. Defaults by module_type if omitted.",
    )
    module_type: ModuleType = ModuleType.DCR
    mounting_type: MountingType = MountingType.FIXED
    inverter_type: InverterType = InverterType.STRING
    project_scope: ProjectScope = ProjectScope.FULL_EPC_TURNKEY
    state: SiteState = SiteState.OTHER
    evacuation_line_km: float = Field(
        0, ge=0, le=200, description="Distance to the evacuation/interconnection point, in km"
    )
    include_land: bool = Field(
        False, description="Price in land acquisition. Only applied when project_scope=full_epc_turnkey."
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "capacity_ac_mw": 15,
                    "module_type": "dcr",
                    "mounting_type": "fixed",
                    "inverter_type": "string",
                    "project_scope": "full_epc_turnkey",
                    "state": "tamil_nadu",
                    "evacuation_line_km": 5,
                    "include_land": False,
                }
            ]
        }
    }

    @model_validator(mode="after")
    def _clamp_scope_only_fields(self) -> "EstimateRequest":
        if self.project_scope != ProjectScope.FULL_EPC_TURNKEY:
            # Evacuation and land are only priced at the full-turnkey scope; keep the
            # request valid instead of erroring, and let the response note it.
            self.evacuation_line_km = 0
            self.include_land = False
        return self


class LineItem(BaseModel):
    key: str
    label: str
    rs_per_wp_dc: float
    amount_inr: float


class CostRange(BaseModel):
    low: float
    base: float
    high: float


class EstimateResponse(BaseModel):
    inputs: EstimateRequest
    resolved_dc_ac_ratio: float
    capacity_ac_mw: float
    capacity_dc_mw: float

    line_items: list[LineItem] = Field(description="Base-rate BOM line items included at this project_scope")

    epc_subtotal_ex_gst_inr: CostRange = Field(
        description="Equipment + BOS + evacuation (as applicable), before GST and before land"
    )
    land_cost_inr: float | None = Field(None, description="One-off land cost, not banded, GST-exempt")
    total_ex_gst_inr: CostRange
    blended_gst_rate_pct: float
    gst_amount_inr: CostRange = Field(description="GST charged on the EPC subtotal only (land is GST-exempt)")
    total_incl_gst_inr: CostRange

    rs_per_wp_dc: CostRange = Field(description="Total ex-GST cost per Wp of DC (module nameplate) capacity")
    cr_per_mw_dc: CostRange = Field(description="Total ex-GST cost, Rs crore per MW(DC)")
    cr_per_mw_ac: CostRange = Field(description="Total ex-GST cost, Rs crore per MW(AC)")

    assumptions: list[str]
    disclaimer: str = (
        "Planning-grade estimate for budgeting only — not a quote. Generated from a configurable "
        "default rate card, not Ainergy's live procurement pricing. Excludes financing costs, "
        "contingency, O&M, price escalation, and any GST input tax credit. Get a benchmarked RFQ "
        "from Ainergy for a firm, line-item number."
    )


class StateInfo(BaseModel):
    value: SiteState
    label: str
    logistics_multiplier: float
    land_rs_per_acre: float


class ScopeInfo(BaseModel):
    value: ProjectScope
    label: str
    includes: list[str]
