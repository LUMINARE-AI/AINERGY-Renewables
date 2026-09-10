"""
Configurable BOM rate card for the EPC estimator.

All rates below are illustrative defaults for a utility-scale (MW-class) ground-mount
solar plant in India, assembled from publicly stated industry ranges — NOT Ainergy's
actual procurement data. Before this is used for real planning numbers, swap these
values for Ainergy's own sourced BOM rates (they're centralised here specifically so
that can be done without touching the calculation logic in app/services/estimator.py).
"""

from __future__ import annotations

from pydantic import BaseModel, Field

from app.models.enums import SiteState


class ModuleRates(BaseModel):
    dcr_rs_per_wp: float = Field(19.5, description="Rs/Wp(DC), DCR (ALMM) modules")
    non_dcr_rs_per_wp: float = Field(15.25, description="Rs/Wp(DC), non-DCR modules")


class MountingRates(BaseModel):
    fixed_rs_per_wp: float = Field(2.0, description="Rs/Wp(DC), fixed-tilt structure")
    tracker_rs_per_wp: float = Field(3.6, description="Rs/Wp(DC), single-axis tracker structure")


class InverterRates(BaseModel):
    string_rs_per_wp: float = Field(2.3, description="Rs/Wp(DC), string inverters")
    central_rs_per_wp: float = Field(1.9, description="Rs/Wp(DC), central inverters")


class BosRates(BaseModel):
    """Balance-of-system items, each expressed in Rs per Wp(DC)."""

    dc_cabling_earthing_rs_per_wp: float = 0.55
    lt_ht_panels_rs_per_wp: float = 0.65
    transformers_rs_per_wp: float = 0.9
    bus_duct_rs_per_wp: float = 0.25
    scada_monitoring_rs_per_wp: float = 0.2
    civil_works_rs_per_wp: float = 1.6
    installation_commissioning_rs_per_wp: float = 1.3
    project_management_rs_per_wp: float = 0.5


class EvacuationRates(BaseModel):
    transmission_line_rs_per_km: float = Field(
        1_800_000, description="Rs per km — DP yard/bay extension + transmission line, blended"
    )


class LandRates(BaseModel):
    acres_per_mw_dc_fixed: float = 4.0
    acres_per_mw_dc_tracker: float = 5.0
    default_rs_per_acre: float = 1_000_000
    state_rs_per_acre: dict[SiteState, float] = Field(
        default_factory=lambda: {
            SiteState.TAMIL_NADU: 1_200_000,
            SiteState.KARNATAKA: 1_100_000,
            SiteState.ANDHRA_PRADESH: 900_000,
            SiteState.TELANGANA: 950_000,
            SiteState.GUJARAT: 850_000,
            SiteState.MAHARASHTRA: 1_300_000,
            SiteState.MADHYA_PRADESH: 700_000,
            SiteState.RAJASTHAN: 650_000,
            SiteState.UTTAR_PRADESH: 1_000_000,
        }
    )


class DcAcRatioDefaults(BaseModel):
    dcr: float = 1.30
    non_dcr: float = 1.28


class GstConfig(BaseModel):
    """
    Indian GST treats a "Solar Power Generating System" EPC contract as a composite
    supply: 70% deemed goods (12% GST) + 30% deemed service (18% GST), per the
    clarification under Notification No. 24/2018-CT(Rate). Blended rate = 13.8%.
    """

    goods_share: float = 0.70
    services_share: float = 0.30
    goods_rate: float = 0.12
    services_rate: float = 0.18

    @property
    def blended_rate(self) -> float:
        return self.goods_share * self.goods_rate + self.services_share * self.services_rate


class BandFactors(BaseModel):
    """Planning-grade low/high band around the base estimate."""

    low_factor: float = 0.84
    high_factor: float = 1.275


class StateLogisticsMultipliers(BaseModel):
    """Small freight/logistics variance applied to the equipment+BOS subtotal by site state."""

    multipliers: dict[SiteState, float] = Field(
        default_factory=lambda: {
            SiteState.TAMIL_NADU: 1.00,
            SiteState.KARNATAKA: 1.00,
            SiteState.ANDHRA_PRADESH: 0.99,
            SiteState.TELANGANA: 0.99,
            SiteState.GUJARAT: 0.97,
            SiteState.MAHARASHTRA: 0.98,
            SiteState.MADHYA_PRADESH: 1.02,
            SiteState.RAJASTHAN: 1.01,
            SiteState.UTTAR_PRADESH: 1.03,
            SiteState.OTHER: 1.05,
        }
    )


class RateCard(BaseModel):
    modules: ModuleRates = Field(default_factory=ModuleRates)
    mounting: MountingRates = Field(default_factory=MountingRates)
    inverters: InverterRates = Field(default_factory=InverterRates)
    bos: BosRates = Field(default_factory=BosRates)
    evacuation: EvacuationRates = Field(default_factory=EvacuationRates)
    land: LandRates = Field(default_factory=LandRates)
    dc_ac_ratio_defaults: DcAcRatioDefaults = Field(default_factory=DcAcRatioDefaults)
    gst: GstConfig = Field(default_factory=GstConfig)
    bands: BandFactors = Field(default_factory=BandFactors)
    state_logistics: StateLogisticsMultipliers = Field(default_factory=StateLogisticsMultipliers)


DEFAULT_RATE_CARD = RateCard()
