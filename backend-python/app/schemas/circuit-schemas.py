from pydantic import BaseModel
from typing import Optional

class CircuitBase(BaseModel):
    circuit_id: str
    name: str
    location: Optional[str] = None
    country: Optional[str] = None
    length_km: Optional[float] = None
    turns: Optional[int] = None
    first_gp_year: Optional[int] = None
    lap_record: Optional[str] = None
    image_url: Optional[str] = None

class CircuitResponse(CircuitBase):
    id: int
    class Config:
        orm_mode = True
