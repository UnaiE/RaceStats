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

@router.get("/{circuit_id}", response_model=Circuit)
def read_circuit(circuit_id: str):
    return get_circuit(circuit_id)

@router.post("/refresh", summary="Actualizar circuitos desde OpenF1")
def refresh_circuits():
    """Descarga datos actualizados de circuitos desde OpenF1 API."""
    import_circuits()
    return {"message": "✅ Circuitos actualizados desde OpenF1"}

@router.post("/", response_model=Circuit)
def create_circuit(circuit: Circuit):
    return create_circuit_controller(circuit.dict())

@router.put("/{circuit_id}", response_model=Circuit)
def update_circuit(circuit_id: str, circuit: Circuit):
    return update_circuit_controller(circuit_id, circuit.dict())

@router.delete("/{circuit_id}")
def delete_circuit(circuit_id: str):
    return delete_circuit_controller(circuit_id)

