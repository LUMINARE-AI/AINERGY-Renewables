from fastapi import APIRouter

from app.models.schemas import EstimateRequest, EstimateResponse
from app.services.estimator import build_estimate

router = APIRouter()


@router.post(
    "/estimate",
    response_model=EstimateResponse,
    summary="Generate a planning-grade solar EPC cost estimate",
)
def estimate(payload: EstimateRequest) -> EstimateResponse:
    """
    Compute a low/base/high BOM cost estimate for a utility-scale solar plant from
    the configured rate card. Recompute on every input change to power a "live" UI,
    same as the reference calculator this API models.
    """
    return build_estimate(payload)
