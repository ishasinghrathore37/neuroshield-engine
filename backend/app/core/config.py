from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "NeuroShield"
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///./neuroshield.db"
    SECRET_KEY: str = "neuroshield-super-secret-key-2024"
    REDIS_URL: Optional[str] = None

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
