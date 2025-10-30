from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RaceStats F1 Data API"
    VERSION: str = "1.0.0"
    OPENF1_BASE_URL: str = "https://api.openf1.org/v1"
    ERGAST_BASE_URL: str = "https://ergast.com/api/f1"
    DATABASE_URL: str = "sqlite:///./racestats.db"  # o PostgreSQL luego
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DATABASE: str = "racestats"
    CACHE_TTL: int = 3600

    class Config:
        env_file = ".env"

settings = Settings()
