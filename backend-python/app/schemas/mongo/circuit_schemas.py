from pydantic import BaseModel
from typing import Optional

class Circuit(BaseModel):
    circuit_id: str
    name: str
    location: Optional[str] = None
    country: Optional[str] = None
    length_km: Optional[float] = None
    turns: Optional[int] = None
    first_gp_year: Optional[int] = None
    lap_record: Optional[str] = None

    class Config:
        orm_mode = True
