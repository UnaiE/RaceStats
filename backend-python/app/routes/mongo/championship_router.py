from fastapi import APIRouter, HTTPException
from typing import List
from app.services.mongo_services import get_all, get_one, create, update, delete
from app.models_mongo.championship import Championship

router = APIRouter()

collection_name = "championships"

@router.get("/", response_model=List[Championship])
async def read_championships():
    return await get_all(collection_name)

@router.get("/{championship_id}", response_model=Championship)
async def read_championship(championship_id: str):
    championship = await get_one(collection_name, championship_id)
    if not championship:
        raise HTTPException(status_code=404, detail="Championship not found")
    return championship

@router.post("/", response_model=Championship)
async def create_championship(championship: Championship):
    return await create(collection_name, championship.dict())

@router.put("/{championship_id}", response_model=Championship)
async def update_championship(championship_id: str, championship: Championship):
    updated = await update(collection_name, championship_id, championship.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Championship not found")
    return updated

@router.delete("/{championship_id}")
async def delete_championship(championship_id: str):
    deleted_count = await delete(collection_name, championship_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Championship not found")
    return {"deleted": deleted_count}
