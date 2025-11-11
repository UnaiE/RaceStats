from fastapi import APIRouter
from app.controllers.mongo import driver_controller
from app.services.openf1_import_service import import_drivers

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/", summary="Obtener todos los pilotos")
def get_all_drivers():
    """Devuelve todos los pilotos almacenados en MongoDB."""
    return driver_controller.get_all_drivers()

@router.get("/{driver_number}", summary="Obtener piloto por número")
def get_driver(driver_number: int):
    """Obtener piloto por número de piloto (ej: 1 para Verstappen, 44 para Hamilton)"""
    return driver_controller.get_driver(str(driver_number))

@router.post("/refresh", summary="Actualizar pilotos desde OpenF1")
def refresh_drivers():
    """
    Descarga los datos actualizados desde la API pública de OpenF1
    y actualiza los pilotos almacenados en MongoDB.
    """
    result = import_drivers()
    return {"message": "✅ Pilotos actualizados desde OpenF1", "stats": result}
