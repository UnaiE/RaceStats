from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class Car(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    id: Optional[str] = Field(None, alias="_id")
    car_id: Optional[str] = None
    constructor_id: Optional[str] = None
    team_name: Optional[str] = None
    year: Optional[int] = None
    nationality: Optional[str] = None
    team_colour: Optional[str] = None
    url: Optional[str] = None
    # Campos adicionales
    model_name: Optional[str] = None
    engine: Optional[str] = None
    chassis: Optional[str] = None
    power_unit: Optional[str] = None
    weight_kg: Optional[int] = None
    fuel_capacity_kg: Optional[int] = None
    gearbox: Optional[str] = None
    description: Optional[str] = None
    achievements: Optional[List[str]] = None
    image_url: Optional[str] = None
