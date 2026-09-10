import pytest

from app.models.enums import ModuleType, ProjectScope, SiteState
from app.models.schemas import EstimateRequest
from app.services.estimator import build_estimate


def test_full_turnkey_default_ranges_are_ordered():
    req = EstimateRequest(capacity_ac_mw=15, state=SiteState.TAMIL_NADU)
    resp = build_estimate(req)

    assert resp.total_ex_gst_inr.low < resp.total_ex_gst_inr.base < resp.total_ex_gst_inr.high
    assert resp.capacity_dc_mw == pytest.approx(15 * resp.resolved_dc_ac_ratio)
    assert len(resp.line_items) == 12  # full BOS + evacuation


def test_modules_only_scope_has_single_line_item():
    req = EstimateRequest(capacity_ac_mw=10, project_scope=ProjectScope.MODULES_ONLY)
    resp = build_estimate(req)

    assert [item.key for item in resp.line_items] == ["modules"]
    assert resp.land_cost_inr is None


def test_land_only_priced_at_full_turnkey_with_flag():
    req = EstimateRequest(
        capacity_ac_mw=10, project_scope=ProjectScope.BOS_EXCL_EVACUATION, include_land=True
    )
    resp = build_estimate(req)
    # request validator clamps include_land back to False outside full_epc_turnkey
    assert resp.inputs.include_land is False
    assert resp.land_cost_inr is None

    req2 = EstimateRequest(capacity_ac_mw=10, project_scope=ProjectScope.FULL_EPC_TURNKEY, include_land=True)
    resp2 = build_estimate(req2)
    assert resp2.land_cost_inr is not None
    assert resp2.land_cost_inr > 0
    # land is added post-band, so total should exceed epc_subtotal by exactly the land cost at every band
    assert resp2.total_ex_gst_inr.base == pytest.approx(resp2.epc_subtotal_ex_gst_inr.base + resp2.land_cost_inr)


def test_blended_gst_rate_is_13_8_percent():
    req = EstimateRequest(capacity_ac_mw=5)
    resp = build_estimate(req)
    assert resp.blended_gst_rate_pct == pytest.approx(13.8)
    assert resp.total_incl_gst_inr.base == pytest.approx(
        resp.total_ex_gst_inr.base + resp.gst_amount_inr.base
    )


def test_dc_ac_ratio_override_is_respected():
    req = EstimateRequest(capacity_ac_mw=20, dc_ac_ratio=1.4)
    resp = build_estimate(req)
    assert resp.resolved_dc_ac_ratio == 1.4
    assert resp.capacity_dc_mw == pytest.approx(28.0)


def test_non_dcr_modules_are_cheaper_per_wp_than_dcr():
    dcr = build_estimate(EstimateRequest(capacity_ac_mw=15, module_type=ModuleType.DCR))
    non_dcr = build_estimate(EstimateRequest(capacity_ac_mw=15, module_type=ModuleType.NON_DCR))
    assert non_dcr.rs_per_wp_dc.base < dcr.rs_per_wp_dc.base


def test_capacity_must_be_positive():
    with pytest.raises(ValueError):
        EstimateRequest(capacity_ac_mw=0)
