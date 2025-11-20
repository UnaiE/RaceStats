from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any

class Driver(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, extra="allow")
    
    id: Optional[str] = Field(None, alias="_id")
    driver_id: str
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None
    permanent_number: Optional[str] = None
    championships: Optional[int] = 0
    podiums: Optional[int] = 0
    points: Optional[int] = 0
    wins: Optional[int] = 0
    team: Optional[str] = None
    
    # Campos adicionales enriquecidos
    news: Optional[List[Dict[str, Any]]] = None
    images_gallery: Optional[List[str]] = None
    career_highlights: Optional[List[str]] = None
    stats_scraped: Optional[Dict[str, Any]] = None
    wiki_info: Optional[Dict[str, Any]] = None
    videos: Optional[List[str]] = None
    
    # Campos OpenF1
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    name_acronym: Optional[str] = None
    team_name: Optional[str] = None
    team_colour: Optional[str] = None
    driver_number: Optional[int] = None
    headshot_url: Optional[str] = None
    country_code: Optional[str] = None
    biography: Optional[str] = None
