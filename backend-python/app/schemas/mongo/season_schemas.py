from pydantic import BaseModel, Field
from typing import Optional, List

class Season(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    season_id: str
    year: int
    champion_driver: Optional[str] = None
    champion_team: Optional[str] = None
    races: Optional[List[str]] = []
    status: str = "finished"

    class Config:
        orm_mode = True
