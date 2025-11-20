from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict

class Championship(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, extra="allow")
    
    id: Optional[str] = Field(None, alias="_id")
    championship_id: Optional[str] = None
    name: str
    year: int
    type: Optional[str] = "Formula 1"
    status: Optional[str] = "in_progress"  # 'completed' or 'in_progress'
    
    # Race info
    total_races: Optional[int] = 0
    completed_races: Optional[int] = 0
    
    # Standings
    driver_standings: Optional[List[Dict]] = []
    constructor_standings: Optional[List[Dict]] = []
    
    # Champions
    champion_driver: Optional[str] = None
    champion_constructor: Optional[str] = None
    
    # Legacy fields
    governing_body: Optional[str] = "FIA"
    description: Optional[str] = None
    founded: Optional[int] = None
    country: Optional[str] = None
    logo_url: Optional[str] = None
    seasons: Optional[List[int]] = []
    seasons_count: Optional[int] = None
