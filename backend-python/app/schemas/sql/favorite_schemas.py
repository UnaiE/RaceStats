from pydantic import BaseModel

class FavoriteBase(BaseModel):
    entity_type: str  # driver, team, race, car
    entity_id: str    # ID de MongoDB

class FavoriteCreate(FavoriteBase):
    user_id: int

class FavoriteResponse(FavoriteBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
