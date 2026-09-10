from fastapi import APIRouter

from app.core.rate_card import DEFAULT_RATE_CARD, RateCard
from app.models.enums import SiteState
from app.models.schemas import ScopeInfo, StateInfo
from app.services.estimator import LINE_ITEM_LABELS, SCOPE_LINE_ITEMS

router = APIRouter()

_STATE_LABELS: dict[SiteState, str] = {
    SiteState.TAMIL_NADU: "Tamil Nadu",
    SiteState.KARNATAKA: "Karnataka",
    SiteState.ANDHRA_PRADESH: "Andhra Pradesh",
    SiteState.TELANGANA: "Telangana",
    SiteState.GUJARAT: "Gujarat",
    SiteState.MAHARASHTRA: "Maharashtra",
    SiteState.MADHYA_PRADESH: "Madhya Pradesh",
    SiteState.RAJASTHAN: "Rajasthan",
    SiteState.UTTAR_PRADESH: "Uttar Pradesh",
    SiteState.OTHER: "Other",
}

_SCOPE_LABELS: dict[str, str] = {
    "modules_only": "Modules only",
    "modules_mounting": "Modules + mounting structure",
    "modules_mounting_inverter": "Modules + mounting + inverters",
    "bos_excl_evacuation": "Full BOS (excl. evacuation)",
    "full_epc_turnkey": "Full EPC turnkey (incl. evacuation; land optional)",
}


@router.get("/rate-card", response_model=RateCard, summary="Current default BOM rate card")
def get_rate_card() -> RateCard:
    """Returns the rate card the estimator is currently using, for transparency and audit."""
    return DEFAULT_RATE_CARD


@router.get("/states", response_model=list[StateInfo], summary="Supported site states")
def get_states() -> list[StateInfo]:
    return [
        StateInfo(
            value=state,
            label=_STATE_LABELS[state],
            logistics_multiplier=DEFAULT_RATE_CARD.state_logistics.multipliers.get(state, 1.0),
            land_rs_per_acre=DEFAULT_RATE_CARD.land.state_rs_per_acre.get(
                state, DEFAULT_RATE_CARD.land.default_rs_per_acre
            ),
        )
        for state in SiteState
    ]


@router.get("/scopes", response_model=list[ScopeInfo], summary="Supported project scopes")
def get_scopes() -> list[ScopeInfo]:
    return [
        ScopeInfo(
            value=scope,
            label=_SCOPE_LABELS[scope.value],
            includes=[LINE_ITEM_LABELS[key] for key in items],
        )
        for scope, items in SCOPE_LINE_ITEMS.items()
    ]
