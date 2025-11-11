from fastapi import APIRouter
from typing import List
from app.controllers.mongo.circuit_controller import (
    get_all_circuits, get_circuit, create_circuit_controller,
    update_circuit_controller, delete_circuit_controller
)
from app.schemas.mongo.circuit_schemas import Circuit
from app.services.openf1_import_service import import_circuits

router = APIRouter(prefix="/circuits", tags=["Circuits"])

@router.get("/", response_model=List[Circuit])
def read_circuits():
    return get_all_circuits()

@router.get("/{circuit_key}", response_model=Circuit, summary="Obtener circuito por circuit_key")
def read_circuit(circuit_key: int):
    """Obtener circuito por circuit_key (ej: 63 para Sakhir)"""
    return get_circuit(str(circuit_key))

@router.post("/refresh", summary="Actualizar circuitos desde OpenF1")
def refresh_circuits():
    """Descarga datos actualizados de circuitos desde OpenF1 API."""
    result = import_circuits()
    return {"message": "✅ Circuitos actualizados desde OpenF1", "stats": result}

@router.post("/", response_model=Circuit)
def create_circuit(circuit: Circuit):
    return create_circuit_controller(circuit.dict())

@router.put("/{circuit_key}", response_model=Circuit, summary="Actualizar circuito")
def update_circuit(circuit_key: int, circuit: Circuit):
    """Actualizar circuito por circuit_key"""
    return update_circuit_controller(str(circuit_key), circuit.dict())

@router.delete("/{circuit_key}", summary="Eliminar circuito")
def delete_circuit(circuit_key: int):
    """Eliminar circuito por circuit_key"""
    return delete_circuit_controller(str(circuit_key))

