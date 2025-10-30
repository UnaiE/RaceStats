from pydantic import BaseModel, Field
from typing import Optional

class Race(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    race_id: str
    race_name: str
    round: Optional[int] = None
    season_year: int
    date: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    winner_id: Optional[str] = None
    circuit_id: Optional[str] = None

    class Config:
        orm_mode = True
