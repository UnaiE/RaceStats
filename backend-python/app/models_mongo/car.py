from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class Car(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    car_id: Optional[str] = None
    name: Optional[str] = None
    model_year: Optional[int] = None
    team: Optional[str] = None
    engine: Optional[str] = None
    weight_kg: Optional[float] = None
    top_speed_kmh: Optional[float] = None
    acceleration_0_100: Optional[float] = None
    power_hp: Optional[int] = None
    # Nuevos campos
    constructor_id: Optional[str] = None
    team_name: Optional[str] = None
    team_colour: Optional[str] = None
    year: Optional[int] = None
    model_name: Optional[str] = None
    chassis: Optional[str] = None
    power_unit: Optional[str] = None
    fuel_capacity_kg: Optional[int] = None
    gearbox: Optional[str] = None
    description: Optional[str] = None
    achievements: Optional[List[str]] = None
    image_url: Optional[str] = None
    nationality: Optional[str] = None
    url: Optional[str] = None
