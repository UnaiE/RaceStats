from fastapi import HTTPException
from app.services.mongo_services import get_all, get_one_by_field, get_one, create, update, delete

collection = "drivers"

def get_all_drivers():
    return get_all(collection)

def get_driver(driver_id: str):
    driver = get_one_by_field(collection, "driver_id", driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

def create_driver_controller(driver_data: dict):
    return create(collection, driver_data)

def update_driver_controller(driver_id: str, driver_data: dict):
    updated = update(collection, driver_id, driver_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Driver not found")
    return updated

def delete_driver_controller(driver_id: str):
    deleted = delete(collection, driver_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    return {"deleted": driver_id}
