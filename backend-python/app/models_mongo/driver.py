# app/models_mongo/driver.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class Driver(BaseModel):
    model_config = ConfigDict(extra="allow", arbitrary_types_allowed=True)
    
    driver_id: str
    given_name: str
    family_name: str
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None
    permanent_number: Optional[str] = None
    championships: int = 0
    podiums: int = 0
    points: int = 0
    wins: int = 0
    poles: int = 0  # Pole positions
    team: Optional[str] = None
    
    # Additional info fields
    biography: Optional[str] = None
    interesting_facts: Optional[list[str]] = None
    country_code: Optional[str] = None
    
    # Career statistics from Ergast
    career_races: Optional[int] = None
    career_fastest_laps: Optional[int] = None
    first_race: Optional[str] = None  # First race date or year
    last_race: Optional[str] = None   # Last race date or year (if retired)
