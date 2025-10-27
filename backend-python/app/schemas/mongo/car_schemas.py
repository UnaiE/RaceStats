from pydantic import BaseModel
from typing import Optional

class Car(BaseModel):
    name: str
    model_year: int
    team: Optional[str] = None
    engine: Optional[str] = None
    weight_kg: Optional[float] = None
    top_speed_kmh: Optional[float] = None
    acceleration_0_100: Optional[float] = None
    power_hp: Optional[int] = None

    class Config:
        orm_mode = True
