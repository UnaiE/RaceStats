from pydantic import BaseModel
from typing import Optional, List

class ChampionshipBase(BaseModel):
    name: str
    governing_body: Optional[str] = "FIA"
    description: Optional[str] = None
    founded: Optional[int] = None
    country: Optional[str] = None
    logo_url: Optional[str] = None

class ChampionshipCreate(ChampionshipBase):
    pass  # mismo formato para creación

class ChampionshipResponse(ChampionshipBase):
    id: int

    class Config:
        orm_mode = True  # permite devolver objetos SQLAlchemy
