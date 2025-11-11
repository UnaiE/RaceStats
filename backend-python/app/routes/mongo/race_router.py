from fastapi import APIRouter
from typing import List, Optional
from app.controllers.mongo.race_controller import (
    get_all_races, get_race, create_race_controller,
    update_race_controller, delete_race_controller
)
from app.schemas.mongo.race_schemas import Race
from app.services.openf1_import_service import import_races

router = APIRouter(prefix="/races", tags=["Races"])

@router.get("/", response_model=List[Race])
def read_races():
    return get_all_races()

@router.get("/{race_id}", response_model=Race, summary="Obtener carrera por race_id")
def read_race(race_id: int):
    """Obtener carrera por race_id (session_key, ej: 7953, 9472)"""
    return get_race(str(race_id))

@router.post("/", response_model=Race)
def create_race(race: Race):
    return create_race_controller(race.dict())

@router.put("/{race_id}", response_model=Race, summary="Actualizar carrera")
def update_race(race_id: int, race: Race):
    """Actualizar carrera por race_id"""
    return update_race_controller(str(race_id), race.dict())

@router.delete("/{race_id}", summary="Eliminar carrera")
def delete_race(race_id: int):
    """Eliminar carrera por race_id"""
    return delete_race_controller(str(race_id))

@router.post("/refresh", summary="Actualizar carreras desde OpenF1")
def refresh_races(year: Optional[int] = None):
    """
    Descarga sesiones de carrera desde la API de OpenF1.
    Opcionalmente filtrar por año.
    """
    result = import_races(year=year)
    return {"message": f"✅ Carreras actualizadas desde OpenF1{f' (año {year})' if year else ''}", "stats": result}
