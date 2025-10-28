from fastapi import APIRouter
from typing import List
from app.controllers.mongo.driver_controller import (
    get_all_drivers, get_driver, create_driver_controller,
    update_driver_controller, delete_driver_controller
)
from app.schemas.mongo.driver_schemas import Driver

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/", response_model=List[Driver])
async def read_drivers():
    return await get_all_drivers()

@router.get("/{driver_id}", response_model=Driver)
async def read_driver(driver_id: str):
    return await get_driver(driver_id)

@router.post("/", response_model=Driver)
async def create_driver(driver: Driver):
    return await create_driver_controller(driver.dict())

@router.put("/{driver_id}", response_model=Driver)
async def update_driver(driver_id: str, driver: Driver):
    return await update_driver_controller(driver_id, driver.dict())

@router.delete("/{driver_id}")
async def delete_driver(driver_id: str):
    return await delete_driver_controller(driver_id)
