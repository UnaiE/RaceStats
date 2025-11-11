from fastapi import APIRouter
from typing import List
from app.controllers.mongo.season_controller import (
    get_all_seasons, get_season, create_season_controller,
    update_season_controller, delete_season_controller
)
from app.schemas.mongo.season_schemas import Season
from app.services.openf1_import_service import import_seasons

router = APIRouter(prefix="/seasons", tags=["Seasons"])

@router.get("/", response_model=List[Season])
def read_seasons():
    return get_all_seasons()

@router.get("/{year}", response_model=Season, summary="Obtener temporada por año")
def read_season(year: int):
    """Obtener temporada por año (ej: 2023, 2024, 2025)"""
    return get_season(str(year))

@router.post("/refresh", summary="Actualizar temporadas desde carreras")
def refresh_seasons():
    """Construye temporadas agrupando las carreras por año."""
    result = import_seasons()
    return {"message": "✅ Temporadas actualizadas", "stats": result}

@router.post("/", response_model=Season)
def create_season(season: Season):
    return create_season_controller(season.dict())

@router.put("/{year}", response_model=Season, summary="Actualizar temporada")
def update_season(year: int, season: Season):
    """Actualizar temporada por año"""
    return update_season_controller(str(year), season.dict())

@router.delete("/{year}", summary="Eliminar temporada")
def delete_season(year: int):
    """Eliminar temporada por año"""
    return delete_season_controller(str(year))

