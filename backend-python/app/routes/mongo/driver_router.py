from fastapi import APIRouter
from app.controllers.mongo import driver_controller
from app.services.openf1_import_service import import_drivers
from app.services.ergast_driver_service import ErgastDriverService

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/", summary="Obtener todos los pilotos")
def get_all_drivers():
    """Devuelve todos los pilotos almacenados en MongoDB."""
    return driver_controller.get_all_drivers()

@router.get("/{driver_id}", summary="Obtener piloto por número")
def get_driver(driver_id: int):
    """Obtener piloto por número de piloto (ej: 1 para Verstappen, 44 para Hamilton)"""
    # Buscar por driver_id que es el número del piloto en OpenF1
    from app.services.mongo_services import get_one_by_field
    driver = get_one_by_field("drivers", "driver_id", driver_id)
    if not driver:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@router.get("/{driver_id}/stats", summary="Obtener estadísticas completas del piloto")
def get_driver_stats(driver_id: int):
    """
    Obtener estadísticas completas del piloto incluyendo edad calculada
    (victorias, poles, podios, campeonatos, carreras totales, etc.)
    Los datos se obtienen directamente de MongoDB.
    """
    # Get driver from MongoDB using driver_id
    from app.services.mongo_services import get_one_by_field
    from fastapi import HTTPException
    driver = get_one_by_field("drivers", "driver_id", driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    # Calculate age if birth date available
    age = None
    birth_date = driver.get("date_of_birth")
    if birth_date:
        age = ErgastDriverService.calculate_age(birth_date)
    
    # Return complete stats with age
    complete_stats = {
        **driver,
        "age": age,
    }
    
    return complete_stats

@router.post("/refresh", summary="Actualizar pilotos desde OpenF1")
def refresh_drivers():
    """
    Descarga los datos actualizados desde la API pública de OpenF1
    y actualiza los pilotos almacenados en MongoDB.
    """
    result = import_drivers()
    return {"message": "✅ Pilotos actualizados desde OpenF1", "stats": result}
