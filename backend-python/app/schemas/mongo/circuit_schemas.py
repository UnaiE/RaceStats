from pydantic import BaseModel, Field
from typing import Optional

class Circuit(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    circuit_key: int
    circuit_short_name: str
    
    class Config:
        from_attributes = True
