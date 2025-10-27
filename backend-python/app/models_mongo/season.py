from pydantic import BaseModel
from typing import Optional, List

class Season(BaseModel):
    season_id: str
    year: int
    champion_driver: Optional[str] = None
    champion_team: Optional[str] = None
    races: Optional[List[str]] = []
    status: str = "finished"
