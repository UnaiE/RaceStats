from fastapi import HTTPException
from app.services.mongo_services import get_all,get_one_by_field, get_one, create, update, delete

collection = "circuits"

async def get_all_circuits():
    return await get_all(collection)

async def get_circuit(circuit_id: str):
    circuit = await get_one_by_field(collection, "circuit_id", circuit_id)
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return circuit

async def create_circuit_controller(circuit_data: dict):
    return await create(collection, circuit_data)

async def update_circuit_controller(circuit_id: str, circuit_data: dict):
    updated = await update(collection, circuit_id, circuit_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return updated

async def delete_circuit_controller(circuit_id: str):
    deleted = await delete(collection, circuit_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return {"deleted": circuit_id}
