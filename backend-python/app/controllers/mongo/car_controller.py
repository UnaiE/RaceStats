from fastapi import HTTPException
from app.services.mongo_services import get_all,get_one_by_field, get_one, create, update, delete

collection = "cars"

def get_all_cars():
    return get_all(collection)

def get_car(car_id: str):
    car = get_one_by_field(collection, "car_id", car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

def create_car_controller(car_data: dict):
    return create(collection, car_data)

def update_car_controller(car_id: str, car_data: dict):
    updated = update(collection, car_id, car_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Car not found")
    return updated

def delete_car_controller(car_id: str):
    deleted = delete(collection, car_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"deleted": car_id}
