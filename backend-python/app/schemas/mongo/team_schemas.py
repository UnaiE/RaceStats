from pydantic import BaseModel
from typing import Optional

class Team(BaseModel):
    name: str
    nationality: Optional[str] = None
    championships: int = 0
    founded: Optional[int] = None
    team_principal: Optional[str] = None
    engine: Optional[str] = None

    class Config:
        orm_mode = True
