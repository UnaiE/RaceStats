from fastapi import HTTPException
from app.services.mongo_services import get_all,get_one_by_field, get_one, create, update, delete

collection = "seasons"

def get_all_seasons():
    return get_all(collection)

def get_season(season_id: str):
    season = get_one_by_field(collection, "year", season_id)
    if not season:
        raise HTTPException(status_code=404, detail="Season not found")
    return season

def create_season_controller(season_data: dict):
    return create(collection, season_data)

def update_season_controller(season_id: str, season_data: dict):
    updated = update(collection, season_id, season_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Season not found")
    return updated

def delete_season_controller(season_id: str):
    deleted = delete(collection, season_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Season not found")
    return {"deleted": season_id}
