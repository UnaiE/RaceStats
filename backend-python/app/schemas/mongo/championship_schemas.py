from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any

class DriverStanding(BaseModel):
    position: int
    driver: str
    team: Optional[str] = None
    points: int
    wins: Optional[int] = 0

class ConstructorStanding(BaseModel):
    position: int
    team: str
    points: int
    wins: Optional[int] = 0

class Championship(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, 
        populate_by_name=True, 
        extra="allow"  # Permitir campos adicionales
    )
    
    id: Optional[str] = Field(None, alias="_id")
    championship_id: Optional[str] = None
    name: str
    year: int
    season_count: Optional[int] = 1
    
    # Race info
    total_races: Optional[int] = 0
    completed_races: Optional[int] = 0
    
    # Status
    status: Optional[str] = "En Progreso"
    
    # Champions
    champion: Optional[str] = None
    champion_driver: Optional[str] = None  # Alias para frontend
    winning_team: Optional[str] = None
    champion_constructor: Optional[str] = None  # Alias para frontend
    
    # Standings
    driver_standings: Optional[List[Dict[str, Any]]] = []
    constructor_standings: Optional[List[Dict[str, Any]]] = []
