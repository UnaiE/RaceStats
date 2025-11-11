from pydantic import BaseModel, Field
from typing import Optional

class Race(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    session_key: int
    session_name: str
    meeting_key: int
    meeting_name: Optional[str] = None
    circuit_key: int
    location: str
    country_key: int
    date_start: str
    date_end: str
    year: int

    class Config:
        from_attributes = True  # Actualizado de orm_mode para Pydantic v2

