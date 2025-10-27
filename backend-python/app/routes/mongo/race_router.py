from fastapi import APIRouter, HTTPException
from typing import List
from app.services.mongo_services import get_all, get_one, create, update, delete
from app.models_mongo.race import Race

router = APIRouter()

collection_name = "races"

@router.get("/", response_model=List[Race])
async def read_races():
    return await get_all(collection_name)

@router.get("/{race_id}", response_model=Race)
async def read_race(race_id: str):
    race = await get_one(collection_name, race_id)
    if not race:
        raise HTTPException(status_code=404, detail="Race not found")
    return race

@router.post("/", response_model=Race)
async def create_race(race: Race):
    return await create(collection_name, race.dict())

@router.put("/{race_id}", response_model=Race)
async def update_race(race_id: str, race: Race):
    updated = await update(collection_name, race_id, race.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Race not found")
    return updated

@router.delete("/{race_id}")
async def delete_race(race_id: str):
    deleted_count = await delete(collection_name, race_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Race not found")
    return {"deleted": deleted_count}
