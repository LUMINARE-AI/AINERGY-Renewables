from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SunCost — Ainergy Solar EPC Estimator API"
    version: str = "0.1.0"
    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(env_prefix="EPC_", env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
