from fastapi import APIRouter
from typing import List
from app.controllers.mongo.championship_controller import (
    get_all_championships, get_championship, create_championship_controller,
    update_championship_controller, delete_championship_controller
)
from app.schemas.mongo.championship_schemas import Championship
from app.services.openf1_import_service import import_championships

router = APIRouter(prefix="/championships", tags=["Championships"])

@router.get("/")
def read_championships():
    """Obtener todos los campeonatos"""
    data = get_all_championships()
    print(f"[DEBUG] get_all_championships returned {len(data)} items")
    for item in data:
        print(f"  - year: {item.get('year')}, championship_id: {item.get('championship_id')}")
    return data

@router.get("/{championship_id}", response_model=Championship, summary="Obtener campeonato por ID")
def read_championship(championship_id: str):
    """Obtener campeonato por championship_id (ej: 'f1_2023', 'f1_2024')"""
    return get_championship(championship_id)

@router.post("/refresh", summary="Actualizar campeonatos desde OpenF1")
def refresh_championships():
    """Genera campeonatos basándose en temporadas existentes."""
    result = import_championships()
    return {"message": "✅ Campeonatos actualizados", "stats": result}

@router.post("/", response_model=Championship)
def create_championship(championship: Championship):
    return create_championship_controller(championship.dict())

@router.put("/{championship_id}", response_model=Championship, summary="Actualizar campeonato")
def update_championship(championship_id: str, championship: Championship):
    """Actualizar campeonato por championship_id"""
    return update_championship_controller(championship_id, championship.dict())

@router.delete("/{championship_id}", summary="Eliminar campeonato")
def delete_championship(championship_id: str):
    """Eliminar campeonato por championship_id"""
    return delete_championship_controller(championship_id)
