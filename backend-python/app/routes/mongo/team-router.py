from fastapi import APIRouter, HTTPException
from typing import List
from app.services.mongo_services import get_all, get_one, create, update, delete
from app.models_mongo.team import Team

router = APIRouter()

collection_name = "teams"

@router.get("/", response_model=List[Team])
async def read_teams():
    return await get_all(collection_name)

@router.get("/{team_id}", response_model=Team)
async def read_team(team_id: str):
    team = await get_one(collection_name, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.post("/", response_model=Team)
async def create_team(team: Team):
    return await create(collection_name, team.dict())

@router.put("/{team_id}", response_model=Team)
async def update_team(team_id: str, team: Team):
    updated = await update(collection_name, team_id, team.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Team not found")
    return updated

@router.delete("/{team_id}")
async def delete_team(team_id: str):
    deleted_count = await delete(collection_name, team_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team not found")
    return {"deleted": deleted_count}
