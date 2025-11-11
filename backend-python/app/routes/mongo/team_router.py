from fastapi import APIRouter
from typing import List
from app.controllers.mongo.team_controller import (
    get_all_teams, get_team, create_team_controller,
    update_team_controller, delete_team_controller
)
from app.schemas.mongo.team_schemas import Team
from app.services.openf1_import_service import import_teams

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("/", response_model=List[Team])
def read_teams():
    return get_all_teams()

@router.get("/{team_id}", response_model=Team, summary="Obtener equipo por team_id")
def read_team(team_id: str):
    """Obtener equipo por team_id (ej: 'red_bull_racing', 'ferrari', 'mercedes')"""
    return get_team(team_id)

@router.post("/", response_model=Team)
def create_team(team: Team):
    return create_team_controller(team.dict())

@router.put("/{team_id}", response_model=Team, summary="Actualizar equipo")
def update_team(team_id: str, team: Team):
    """Actualizar equipo por team_id"""
    return update_team_controller(team_id, team.dict())

@router.delete("/{team_id}", summary="Eliminar equipo")
def delete_team(team_id: str):
    """Eliminar equipo por team_id"""
    return delete_team_controller(team_id)

@router.post("/refresh", summary="Actualizar equipos desde OpenF1")
def refresh_teams():
    """
    Descarga equipos desde la API de OpenF1 (extraídos de /drivers)
    y los guarda en MongoDB.
    """
    result = import_teams()
    return {"message": "✅ Equipos actualizados desde OpenF1", "stats": result}
