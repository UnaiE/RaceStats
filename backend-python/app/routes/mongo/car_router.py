from fastapi import APIRouter
from typing import List
from app.controllers.mongo.car_controller import (
    get_all_cars, get_car, create_car_controller,
    update_car_controller, delete_car_controller
)
from app.schemas.mongo.car_schemas import Car

router = APIRouter(prefix="/cars", tags=["Cars"])

@router.get("/", response_model=List[Car])
async def read_cars():
    return await get_all_cars()

@router.get("/{car_id}", response_model=Car)
async def read_car(car_id: str):
    return await get_car(car_id)

@router.post("/", response_model=Car)
async def create_car(car: Car):
    return await create_car_controller(car.dict())

@router.put("/{car_id}", response_model=Car)
async def update_car(car_id: str, car: Car):
    return await update_car_controller(car_id, car.dict())

@router.delete("/{car_id}")
async def delete_car(car_id: str):
    return await delete_car_controller(car_id)
