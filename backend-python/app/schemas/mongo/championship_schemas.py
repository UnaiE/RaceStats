from pydantic import BaseModel, Field
from typing import Optional, List

class Championship(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    championship_id: str
    name: str
    governing_body: Optional[str] = "FIA"
    description: Optional[str] = None
    founded: Optional[int] = None
    country: Optional[str] = None
    logo_url: Optional[str] = None
    seasons: Optional[List[int]] = []

    class Config:
        orm_mode = True
