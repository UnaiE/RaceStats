from pydantic import BaseModel
from typing import Optional

class CarBase(BaseModel):
    name: str
    model_year: int
    team_id: Optional[int] = None
    engine: Optional[str] = None
    weight_kg: Optional[float] = None
    top_speed_kmh: Optional[float] = None
    acceleration_0_100: Optional[float] = None
    power_hp: Optional[int] = None
    image_url: Optional[str] = None

class CarResponse(CarBase):
    id: int
    class Config:
        orm_mode = True
