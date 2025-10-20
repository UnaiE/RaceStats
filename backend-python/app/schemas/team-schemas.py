from pydantic import BaseModel

class TeamBase(BaseModel):
    name: str
    nationality: str
    championships: int = 0
    points: int = 0
    wins: int = 0

class TeamResponse(TeamBase):
    id: int
    class Config:
        orm_mode = True
