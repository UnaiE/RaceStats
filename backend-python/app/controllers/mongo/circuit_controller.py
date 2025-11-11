from fastapi import HTTPException
from app.services.mongo_services import get_all,get_one_by_field, get_one, create, update, delete

collection = "circuits"

def get_all_circuits():
    return get_all(collection)

def get_circuit(circuit_id: str):
    circuit = get_one_by_field(collection, "circuit_key", circuit_id)
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return circuit

def create_circuit_controller(circuit_data: dict):
    return create(collection, circuit_data)

def update_circuit_controller(circuit_id: str, circuit_data: dict):
    updated = update(collection, circuit_id, circuit_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return updated

def delete_circuit_controller(circuit_id: str):
    deleted = delete(collection, circuit_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return {"deleted": circuit_id}
