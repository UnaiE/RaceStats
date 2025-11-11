from fastapi import APIRouter
from app.controllers.mongo import driver_controller
from app.services.openf1_import_service import import_drivers

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/", summary="Obtener todos los pilotos")
def get_all_drivers():
    """Devuelve todos los pilotos almacenados en MongoDB."""
    return driver_controller.get_all_drivers()

@router.get("/{driver_id}", summary="Obtener piloto por ID")
def get_driver(driver_id: int):
    """Devuelve un piloto específico por su driver_id (número del piloto)."""
    # Convertir int a string porque MongoDB guarda driver_id como string
    return driver_controller.get_driver(str(driver_id))

@router.post("/refresh", summary="Actualizar pilotos desde OpenF1")
async def refresh_drivers():
    """
    Descarga los datos actualizados desde la API pública de OpenF1
    y actualiza los pilotos almacenados en MongoDB.
    """
    await import_drivers()
    return {"message": "✅ Pilotos actualizados desde OpenF1"}
