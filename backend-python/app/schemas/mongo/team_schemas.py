from pydantic import BaseModel, Field
from typing import Optional

class Team(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    team_id: str
    name: str
    colour: Optional[str] = None

    class Config:
        from_attributes = True  # Actualizado de orm_mode para Pydantic v2

