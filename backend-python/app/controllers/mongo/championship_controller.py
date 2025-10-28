from fastapi import HTTPException
from app.services.mongo_services import get_all, get_one, create, update, delete

collection = "championships"

async def get_all_championships():
    return await get_all(collection)

async def get_championship(championship_id: str):
    championship = await get_one(collection, championship_id)
    if not championship:
        raise HTTPException(status_code=404, detail="Championship not found")
    return championship

async def create_championship_controller(championship_data: dict):
    return await create(collection, championship_data)

async def update_championship_controller(championship_id: str, championship_data: dict):
    updated = await update(collection, championship_id, championship_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Championship not found")
    return updated

async def delete_championship_controller(championship_id: str):
    deleted = await delete(collection, championship_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Championship not found")
    return {"deleted": championship_id}
