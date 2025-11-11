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

@router.get("/{season_id}", response_model=Season)
def read_season(season_id: str):
    return get_season(season_id)

@router.post("/refresh", summary="Actualizar temporadas desde carreras")
def refresh_seasons():
    """Construye temporadas agrupando las carreras por año."""
    result = import_seasons()
    return {"message": "✅ Temporadas actualizadas", "stats": result}

@router.post("/", response_model=Season)
def create_season(season: Season):
    return create_season_controller(season.dict())

@router.put("/{season_id}", response_model=Season)
def update_season(season_id: str, season: Season):
    return update_season_controller(season_id, season.dict())

@router.delete("/{season_id}")
def delete_season(season_id: str):
    return delete_season_controller(season_id)

