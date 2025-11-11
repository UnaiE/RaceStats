from fastapi import APIRouter
from typing import List
from app.controllers.mongo.car_controller import (
    get_all_cars, get_car, create_car_controller,
    update_car_controller, delete_car_controller
)
from app.schemas.mongo.car_schemas import Car

router = APIRouter(prefix="/cars", tags=["Cars"])

@router.get("/", response_model=List[Car])
def read_cars():
    return get_all_cars()

@router.get("/{car_id}", response_model=Car)
def read_car(car_id: str):
    return get_car(car_id)

@router.post("/", response_model=Car)
def create_car(car: Car):
    return create_car_controller(car.dict())

@router.put("/{car_id}", response_model=Car)
def update_car(car_id: str, car: Car):
    return update_car_controller(car_id, car.dict())

@router.delete("/{car_id}")
def delete_car(car_id: str):
    return delete_car_controller(car_id)
