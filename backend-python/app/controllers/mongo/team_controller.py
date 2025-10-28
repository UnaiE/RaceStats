from fastapi import HTTPException
from app.services.mongo_services import get_all, get_one, create, update, delete

collection = "teams"

async def get_all_teams():
    return await get_all(collection)

async def get_team(team_id: str):
    team = await get_one(collection, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

async def create_team_controller(team_data: dict):
    return await create(collection, team_data)

async def update_team_controller(team_id: str, team_data: dict):
    updated = await update(collection, team_id, team_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Team not found")
    return updated

async def delete_team_controller(team_id: str):
    deleted = await delete(collection, team_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Team not found")
    return {"deleted": team_id}
