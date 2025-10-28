from fastapi import APIRouter
from typing import List
from app.controllers.mongo.season_controller import (
    get_all_seasons, get_season, create_season_controller,
    update_season_controller, delete_season_controller
)
from app.schemas.mongo.season_schemas import Season

router = APIRouter(prefix="/seasons", tags=["Seasons"])

@router.get("/", response_model=List[Season])
async def read_seasons():
    return await get_all_seasons()

@router.get("/{season_id}", response_model=Season)
async def read_season(season_id: str):
    return await get_season(season_id)

@router.post("/", response_model=Season)
async def create_season(season: Season):
    return await create_season_controller(season.dict())

@router.put("/{season_id}", response_model=Season)
async def update_season(season_id: str, season: Season):
    return await update_season_controller(season_id, season.dict())

@router.delete("/{season_id}")
async def delete_season(season_id: str):
    return await delete_season_controller(season_id)
