from fastapi import APIRouter
from typing import List
from app.controllers.mongo.championship_controller import (
    get_all_championships, get_championship, create_championship_controller,
    update_championship_controller, delete_championship_controller
)
from app.schemas.mongo.championship_schemas import Championship

router = APIRouter(prefix="/championships", tags=["Championships"])

@router.get("/", response_model=List[Championship])
async def read_championships():
    return await get_all_championships()

@router.get("/{championship_id}", response_model=Championship)
async def read_championship(championship_id: str):
    return await get_championship(championship_id)

@router.post("/", response_model=Championship)
async def create_championship(championship: Championship):
    return await create_championship_controller(championship.dict())

@router.put("/{championship_id}", response_model=Championship)
async def update_championship(championship_id: str, championship: Championship):
    return await update_championship_controller(championship_id, championship.dict())

@router.delete("/{championship_id}")
async def delete_championship(championship_id: str):
    return await delete_championship_controller(championship_id)
