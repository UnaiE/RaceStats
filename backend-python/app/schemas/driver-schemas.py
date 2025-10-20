from pydantic import BaseModel

class DriverBase(BaseModel):
    driver_id: str
    given_name: str
    family_name: str
    nationality: str
    date_of_birth: str
    permanent_number: str | None = None
    championships: int = 0
    podiums: int = 0
    points: int = 0
    wins: int = 0

class DriverResponse(DriverBase):
    id: int

    class Config:
        orm_mode = True
