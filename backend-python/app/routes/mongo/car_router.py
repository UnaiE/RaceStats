from fastapi import APIRouter
from typing import List
from app.controllers.mongo.car_controller import (
    get_all_cars, get_car, create_car_controller,
    update_car_controller, delete_car_controller
)
from app.schemas.mongo.car_schemas import Car
from app.services.openf1_import_service import import_cars

router = APIRouter(prefix="/cars", tags=["Cars"])

@router.get("/", response_model=List[Car])
def read_cars():
    return get_all_cars()

@router.get("/{car_id}", response_model=Car, summary="Obtener coche por car_id")
def read_car(car_id: str):
    """Obtener coche por car_id (ej: 'red_bull_2024', 'ferrari_2023')"""
    return get_car(car_id)

@router.post("/refresh", summary="Actualizar coches desde equipos OpenF1")
def refresh_cars():
    """
    Genera coches combinando:
    - Equipos existentes (de OpenF1)
    - Años de las temporadas disponibles
    Crea un coche por cada combinación equipo-año.
    """
    result = import_cars()
    return {"message": "✅ Coches generados desde equipos", "stats": result}

@router.post("/", response_model=Car)
def create_car(car: Car):
    return create_car_controller(car.dict())

@router.put("/{car_id}", response_model=Car, summary="Actualizar coche")
def update_car(car_id: str, car: Car):
    """Actualizar coche por car_id"""
    return update_car_controller(car_id, car.dict())

@router.delete("/{car_id}", summary="Eliminar coche")
def delete_car(car_id: str):
    """Eliminar coche por car_id"""
    return delete_car_controller(car_id)
