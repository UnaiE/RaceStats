from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RaceStats F1 Data API"
    VERSION: str = "1.0.0"
    OPENF1_BASE_URL: str = "https://api.openf1.org/v1"
    ERGAST_BASE_URL: str = "https://ergast.com/api/f1"
    DATABASE_URL: str = "sqlite:///./racestats.db"  # o PostgreSQL luego
    CACHE_TTL: int = 3600

settings = Settings()
