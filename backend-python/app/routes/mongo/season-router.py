from fastapi import APIRouter, HTTPException
from typing import List
from app.services.mongo_services import get_all, get_one, create, update, delete
from app.models_mongo.season import Season

router = APIRouter()

collection_name = "seasons"

@router.get("/", response_model=List[Season])
async def read_seasons():
    return await get_all(collection_name)

@router.get("/{season_id}", response_model=Season)
async def read_season(season_id: str):
    season = await get_one(collection_name, season_id)
    if not season:
        raise HTTPException(status_code=404, detail="Season not found")
    return season

@router.post("/", response_model=Season)
async def create_season(season: Season):
    return await create(collection_name, season.dict())

@router.put("/{season_id}", response_model=Season)
async def update_season(season_id: str, season: Season):
    updated = await update(collection_name, season_id, season.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Season not found")
    return updated

@router.delete("/{season_id}")
async def delete_season(season_id: str):
    deleted_count = await delete(collection_name, season_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Season not found")
    return {"deleted": deleted_count}
