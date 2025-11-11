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

@router.get("/{race_id}", response_model=Race)
def read_race(race_id: str):
    return get_race(race_id)

@router.post("/", response_model=Race)
def create_race(race: Race):
    return create_race_controller(race.dict())

@router.put("/{race_id}", response_model=Race)
def update_race(race_id: str, race: Race):
    return update_race_controller(race_id, race.dict())

@router.delete("/{race_id}")
def delete_race(race_id: str):
    return delete_race_controller(race_id)

@router.post("/refresh", summary="Actualizar carreras desde OpenF1")
def refresh_races(year: Optional[int] = None):
    """
    Descarga sesiones de carrera desde la API de OpenF1.
    Opcionalmente filtrar por año.
    """
    result = import_races(year=year)
    return {"message": f"✅ Carreras actualizadas desde OpenF1{f' (año {year})' if year else ''}", "stats": result}
