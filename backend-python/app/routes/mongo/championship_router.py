from fastapi import APIRouter
from typing import List
from app.controllers.mongo.championship_controller import (
    get_all_championships, get_championship, create_championship_controller,
    update_championship_controller, delete_championship_controller
)
from app.schemas.mongo.championship_schemas import Championship
from app.services.openf1_import_service import import_championships

router = APIRouter(prefix="/championships", tags=["Championships"])

@router.get("/", response_model=List[Championship])
def read_championships():
    return get_all_championships()

@router.get("/{championship_id}", response_model=Championship)
def read_championship(championship_id: str):
    return get_championship(championship_id)

@router.post("/refresh", summary="Actualizar campeonatos desde OpenF1")
def refresh_championships():
    """Genera campeonatos basándose en temporadas existentes."""
    import_championships()
    return {"message": "✅ Campeonatos actualizados"}

@router.post("/", response_model=Championship)
def create_championship(championship: Championship):
    return create_championship_controller(championship.dict())

@router.put("/{championship_id}", response_model=Championship)
def update_championship(championship_id: str, championship: Championship):
    return update_championship_controller(championship_id, championship.dict())

@router.delete("/{championship_id}")
def delete_championship(championship_id: str):
    return delete_championship_controller(championship_id)
