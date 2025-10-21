from pydantic import BaseModel
from typing import Optional, List

class SeasonBase(BaseModel):
    year: int
    champion_driver: Optional[str] = None
    champion_team: Optional[str] = None
    races_count: Optional[int] = 0
    status: Optional[str] = "finished"

class SeasonCreate(SeasonBase):
    championship_id: Optional[int] = None

class SeasonResponse(SeasonBase):
    id: int
    championship_id: Optional[int] = None

    class Config:
        orm_mode = True
