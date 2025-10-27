from pydantic import BaseModel
from typing import Optional

class Driver(BaseModel):
    driver_id: str
    given_name: str
    family_name: str
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None
    permanent_number: Optional[str] = None
    championships: int = 0
    podiums: int = 0
    points: int = 0
    wins: int = 0
    team: Optional[str] = None

    class Config:
        orm_mode = True
