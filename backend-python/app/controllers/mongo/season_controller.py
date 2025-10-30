from fastapi import HTTPException
from app.services.mongo_services import get_all,get_one_by_field, get_one, create, update, delete

collection = "seasons"

async def get_all_seasons():
    return await get_all(collection)

async def get_season(season_id: str):
    season = await get_one_by_field(collection, "season_id", season_id)
    if not season:
        raise HTTPException(status_code=404, detail="Season not found")
    return season

async def create_season_controller(season_data: dict):
    return await create(collection, season_data)

async def update_season_controller(season_id: str, season_data: dict):
    updated = await update(collection, season_id, season_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Season not found")
    return updated

async def delete_season_controller(season_id: str):
    deleted = await delete(collection, season_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Season not found")
    return {"deleted": season_id}
