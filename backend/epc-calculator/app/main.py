from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import estimate, meta
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=(
        "Planning-grade cost estimator for utility-scale solar EPC projects, built for "
        "Ainergy Renewables. Given plant capacity, module/mounting/inverter choice, site "
        "state and project scope, returns a low/base/high BOM cost breakdown, per-Wp and "
        "per-MW figures, and GST-inclusive totals from a configurable rate card."
    ),
    version=settings.version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(estimate.router, prefix="/api/v1", tags=["Estimate"])
app.include_router(meta.router, prefix="/api/v1/config", tags=["Config"])


@app.get("/health", tags=["System"], summary="Liveness check")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def root() -> dict[str, str]:
    return {"name": settings.app_name, "docs": "/docs"}
