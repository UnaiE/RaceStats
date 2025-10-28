from fastapi import APIRouter
from typing import List
from app.controllers.mongo.team_controller import (
    get_all_teams, get_team, create_team_controller,
    update_team_controller, delete_team_controller
)
from app.schemas.mongo.team_schemas import Team
router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("/", response_model=List[Team])
async def read_teams():
    return await get_all_teams()

@router.get("/{team_id}", response_model=Team)
async def read_team(team_id: str):
    return await get_team(team_id)

@router.post("/", response_model=Team)
async def create_team(team: Team):
    return await create_team_controller(team.dict())

@router.put("/{team_id}", response_model=Team)
async def update_team(team_id: str, team: Team):
    return await update_team_controller(team_id, team.dict())

@router.delete("/{team_id}")
async def delete_team(team_id: str):
    return await delete_team_controller(team_id)
