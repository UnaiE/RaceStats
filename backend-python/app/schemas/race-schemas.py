from pydantic import BaseModel

class RaceBase(BaseModel):
    season: str
    round: int
    race_name: str
    circuit_name: str
    date: str
    location: str
    country: str
    winner_id: str | None = None
    

class RaceResponse(RaceBase):
    id: int
    class Config:
        orm_mode = True
