from fastapi import HTTPException
from app.services.mongo_services import get_all, get_one_by_field, get_one, create, update, delete

collection = "championships"

def get_all_championships():
    return get_all(collection)

def get_championship(championship_id: str):
    championship = get_one_by_field(collection, "championship_id", championship_id)
    if not championship:
        raise HTTPException(status_code=404, detail="Championship not found")
    return championship

def create_championship_controller(championship_data: dict):
    return create(collection, championship_data)

def update_championship_controller(championship_id: str, championship_data: dict):
    updated = update(collection, championship_id, championship_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Championship not found")
    return updated

def delete_championship_controller(championship_id: str):
    deleted = delete(collection, championship_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Championship not found")
    return {"deleted": championship_id}
