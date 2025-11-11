from pydantic import BaseModel, Field
from typing import Optional, Union

class Season(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    year: Union[str, int]
    race_count: int = 0

    class Config:
        from_attributes = True
