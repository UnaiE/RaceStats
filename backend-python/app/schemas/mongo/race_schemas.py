from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class Race(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        extra="allow"  # Permitir campos adicionales
    )
    
    id: Optional[str] = Field(None, alias="_id")
    race_id: Optional[int] = None  # Opcional porque las Sprint no tienen race_id
    session_key: int
    session_name: str
    meeting_key: int
    meeting_name: Optional[str] = None
    circuit_key: Optional[int] = None  # Opcional para carreras importadas manualmente
    location: str
    country_key: Optional[int] = None  # Opcional para carreras importadas manualmente
    country_code: Optional[str] = None  # Código del país (ej: "GB", "ES")
    country_name: Optional[str] = None  # Nombre del país
    circuit_short_name: Optional[str] = None  # Nombre corto del circuito
    date_start: str
    date_end: Optional[str] = None  # Opcional para carreras importadas manualmente
    year: int
    round: Optional[int] = None  # Número de ronda en la temporada

