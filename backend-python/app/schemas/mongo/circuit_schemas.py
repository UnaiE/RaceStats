from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class Circuit(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    id: Optional[str] = Field(None, alias="_id")
    circuit_key: Optional[int] = None
    circuit_short_name: Optional[str] = None
    name: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    country_code: Optional[str] = None
    length_km: Optional[float] = None
    turns: Optional[int] = None
    first_gp_year: Optional[int] = None
    lap_record: Optional[str] = None
    drs_zones: Optional[int] = None
    circuit_type: Optional[str] = None
    direction: Optional[str] = None
    layout_image: Optional[str] = None
    interesting_facts: Optional[List[str]] = None
