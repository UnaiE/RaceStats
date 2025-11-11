from pydantic import BaseModel, Field
from typing import Optional

class Race(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    race_id: Optional[int] = None  # Opcional porque las Sprint no tienen race_id
    session_key: int
    session_name: str
    meeting_key: int
    meeting_name: Optional[str] = None
    circuit_key: Optional[int] = None  # Opcional para carreras importadas manualmente
    location: str
    country_key: Optional[int] = None  # Opcional para carreras importadas manualmente
    date_start: str
    date_end: Optional[str] = None  # Opcional para carreras importadas manualmente
    year: int

    class Config:
        from_attributes = True  # Actualizado de orm_mode para Pydantic v2

