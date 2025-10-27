from fastapi import APIRouter, HTTPException
from typing import List
from app.services.mongo_services import get_all, get_one, create, update, delete
from app.models_mongo.driver import Driver

router = APIRouter()

collection_name = "drivers"

@router.get("/", response_model=List[Driver])
async def read_drivers():
    return await get_all(collection_name)

@router.get("/{driver_id}", response_model=Driver)
async def read_driver(driver_id: str):
    driver = await get_one(collection_name, driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@router.post("/", response_model=Driver)
async def create_driver(driver: Driver):
    return await create(collection_name, driver.dict())

@router.put("/{driver_id}", response_model=Driver)
async def update_driver(driver_id: str, driver: Driver):
    updated = await update(collection_name, driver_id, driver.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Driver not found")
    return updated

@router.delete("/{driver_id}")
async def delete_driver(driver_id: str):
    deleted_count = await delete(collection_name, driver_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    return {"deleted": deleted_count}
