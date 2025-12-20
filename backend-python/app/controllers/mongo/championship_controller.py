from fastapi import HTTPException
from app.services.mongo_services import get_all, get_one_by_field, get_one, create, update, delete

collection = "championships"

def get_all_championships():
    data = get_all(collection)
    print(f"[CONTROLLER] get_all_championships: {len(data)} items from DB")
    for item in data:
        print(f"  [CONTROLLER] - {item.get('year')} ({item.get('championship_id')})")
    return data

def get_championship(championship_id: str):
    # Intentar buscar por championship_id primero
    championship = get_one_by_field(collection, "championship_id", championship_id)
    
    # Si no se encuentra, intentar por year
    if not championship:
        try:
            year = int(championship_id)
            championship = get_one_by_field(collection, "year", year)
        except ValueError:
            pass
    
    # Si aún no se encuentra, intentar por _id
    if not championship:
        championship = get_one(collection, championship_id)
    
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
