from fastapi import APIRouter, HTTPException
from typing import List
from app.services.mongo_services import get_all, get_one, create, update, delete
from app.models_mongo.circuit import Circuit

router = APIRouter()

collection_name = "circuits"

@router.get("/", response_model=List[Circuit])
async def read_circuits():
    return await get_all(collection_name)

@router.get("/{circuit_id}", response_model=Circuit)
async def read_circuit(circuit_id: str):
    circuit = await get_one(collection_name, circuit_id)
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return circuit

@router.post("/", response_model=Circuit)
async def create_circuit(circuit: Circuit):
    return await create(collection_name, circuit.dict())

@router.put("/{circuit_id}", response_model=Circuit)
async def update_circuit(circuit_id: str, circuit: Circuit):
    updated = await update(collection_name, circuit_id, circuit.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return updated

@router.delete("/{circuit_id}")
async def delete_circuit(circuit_id: str):
    deleted_count = await delete(collection_name, circuit_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return {"deleted": deleted_count}
