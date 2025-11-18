from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict

class Race(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    race_id : str
    race_name: str
    round: Optional[int] = None
    season_year: int
    date: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    winner_id: Optional[str] = None
    circuit_id: Optional[str] = None
    
    # Nuevos campos para información adicional
    fastest_lap: Optional[Dict] = None  # {"driver_name": str, "time": str, "lap": int}
    safety_car_deployments: Optional[int] = None  # Número de despliegues de Safety Car
    virtual_safety_car: Optional[int] = None  # Número de despliegues de VSC
    total_laps: Optional[int] = None
    race_distance: Optional[str] = None  # Ej: "305.355 km"
    race_results: Optional[List[Dict]] = None  # Lista de resultados con posición, piloto, tiempo, etc.

