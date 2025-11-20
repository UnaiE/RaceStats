from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any

class Team(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, extra="allow")
    
    id: Optional[str] = Field(None, alias="_id")
    team_id: str
    name: str
    colour: Optional[str] = None
    logo: Optional[str] = None
    
    # Campos adicionales enriquecidos
    news: Optional[List[Dict[str, Any]]] = None
    images_gallery: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    sponsors_scraped: Optional[List[str]] = None
    wiki_info: Optional[Dict[str, Any]] = None
    
    # Campos existentes opcionales
    constructors_championships: Optional[int] = None
    country_code: Optional[str] = None
    drivers_championships: Optional[int] = None
    founded_year: Optional[int] = None
    history: Optional[str] = None
    legendary_drivers: Optional[List[str]] = None
    sponsors: Optional[List[str]] = None
    interesting_facts: Optional[List[str]] = None
    total_podiums: Optional[int] = None
    total_wins: Optional[int] = None
    team_name: Optional[str] = None
    team_colour: Optional[str] = None

