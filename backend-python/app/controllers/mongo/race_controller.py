from fastapi import HTTPException
from app.services.mongo_services import get_all, get_one_by_field, get_one, create, update, delete

collection = "races"

def get_all_races():
    return get_all(collection)

def get_race(race_id: str):
    race = get_one_by_field(collection, "race_id", race_id)
    if not race:
        raise HTTPException(status_code=404, detail="Race not found")
    return race

def create_race_controller(race_data: dict):
    return create(collection, race_data)

def update_race_controller(race_id: str, race_data: dict):
    updated = update(collection, race_id, race_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Race not found")
    return updated

def delete_race_controller(race_id: str):
    deleted = delete(collection, race_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Race not found")
    return {"deleted": race_id}
