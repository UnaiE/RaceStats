from fastapi import APIRouter, HTTPException
from typing import List
from app.services.mongo_services import get_all, get_one, create, update, delete
from app.models_mongo.car import Car

router = APIRouter()

collection_name = "cars"

@router.get("/", response_model=List[Car])
async def read_cars():
    return await get_all(collection_name)

@router.get("/{car_id}", response_model=Car)
async def read_car(car_id: str):
    car = await get_one(collection_name, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@router.post("/", response_model=Car)
async def create_car(car: Car):
    return await create(collection_name, car.dict())

@router.put("/{car_id}", response_model=Car)
async def update_car(car_id: str, car: Car):
    updated = await update(collection_name, car_id, car.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Car not found")
    return updated

@router.delete("/{car_id}")
async def delete_car(car_id: str):
    deleted_count = await delete(collection_name, car_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"deleted": deleted_count}
