from pydantic import BaseModel

class ComparisonBase(BaseModel):
    entity_type: str
    entity_ids: str  # JSON string con IDs de MongoDB

class ComparisonCreate(ComparisonBase):
    user_id: int

class ComparisonResponse(ComparisonBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
