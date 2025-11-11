from pydantic import BaseModel, Field
from typing import Optional

class Car(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    car_id: str  # Ej: "red_bull_2023", "ferrari_2024"
    constructor_id: str  # De Ergast: "red_bull", "ferrari"
    team_name: str  # Nombre del equipo
    year: int  # Temporada
    nationality: Optional[str] = None  # De Ergast
    team_colour: Optional[str] = None  # De OpenF1
    url: Optional[str] = None  # Wikipedia URL de Ergast

    class Config:
        from_attributes = True  # Pydantic v2
