from pydantic import BaseModel
from typing import Optional, List

class Championship(BaseModel):
    championship_id: str
    name: str
    governing_body: Optional[str] = "FIA"
    description: Optional[str] = None
    founded: Optional[int] = None
    country: Optional[str] = None
    logo_url: Optional[str] = None
    seasons: Optional[List[int]] = []  # IDs de temporadas
