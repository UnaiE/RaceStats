from fastapi import HTTPException
from app.services.mongo_services import get_all, get_one_by_field, get_one, create, update, delete

collection = "teams"

def get_all_teams():
    return get_all(collection)

def get_team(team_id: str):
    team = get_one_by_field(collection, "team_id", team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

def create_team_controller(team_data: dict):
    return create(collection, team_data)

def update_team_controller(team_id: str, team_data: dict):
    updated = update(collection, team_id, team_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Team not found")
    return updated

def delete_team_controller(team_id: str):
    deleted = delete(collection, team_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Team not found")
    return {"deleted": team_id}
