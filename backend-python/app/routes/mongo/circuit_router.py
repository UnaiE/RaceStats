from fastapi import APIRouter
from typing import List
from app.controllers.mongo.circuit_controller import (
    get_all_circuits, get_circuit, create_circuit_controller,
    update_circuit_controller, delete_circuit_controller
)
from app.schemas.mongo.circuit_schemas import Circuit

router = APIRouter(prefix="/circuits", tags=["Circuits"])

@router.get("/", response_model=List[Circuit])
async def read_circuits():
    return await get_all_circuits()

@router.get("/{circuit_id}", response_model=Circuit)
async def read_circuit(circuit_id: str):
    return await get_circuit(circuit_id)

@router.post("/", response_model=Circuit)
async def create_circuit(circuit: Circuit):
    return await create_circuit_controller(circuit.dict())

@router.put("/{circuit_id}", response_model=Circuit)
async def update_circuit(circuit_id: str, circuit: Circuit):
    return await update_circuit_controller(circuit_id, circuit.dict())

@router.delete("/{circuit_id}")
async def delete_circuit(circuit_id: str):
    return await delete_circuit_controller(circuit_id)
