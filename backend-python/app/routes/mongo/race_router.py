from fastapi import APIRouter
from typing import List
from app.controllers.mongo.race_controller import (
    get_all_races, get_race, create_race_controller,
    update_race_controller, delete_race_controller
)
from app.schemas.mongo.race_schemas import Race

router = APIRouter(prefix="/races", tags=["Races"])

@router.get("/", response_model=List[Race])
async def read_races():
    return await get_all_races()

@router.get("/{race_id}", response_model=Race)
async def read_race(race_id: str):
    return await get_race(race_id)

@router.post("/", response_model=Race)
async def create_race(race: Race):
    return await create_race_controller(race.dict())

@router.put("/{race_id}", response_model=Race)
async def update_race(race_id: str, race: Race):
    return await update_race_controller(race_id, race.dict())

@router.delete("/{race_id}")
async def delete_race(race_id: str):
    return await delete_race_controller(race_id)
