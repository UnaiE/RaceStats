from bson import ObjectId
from fastapi import HTTPException
from app.resources.db_mongo import get_collection

# Función para convertir ObjectId a string
def serialize_doc(doc):
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    return doc

# Operaciones CRUD genéricas (SIN await, PyMongo es síncrono)
def get_one_by_field(collection_name: str, field: str, value: str):
    collection = get_collection(collection_name)
    
    # Para driver_id, buscar tanto string como int (debido a datos mixtos)
    if field == "driver_id":
        # Intentar convertir a int si es posible
        try:
            int_value = int(value)
            # Buscar por string O int
            result = collection.find_one({"$or": [{field: value}, {field: int_value}]})
        except ValueError:
            # Si no es numérico, buscar solo como string
            result = collection.find_one({field: value})
    else:
        result = collection.find_one({field: value})
    
    return serialize_doc(result)

def get_all(collection_name: str):
    collection = get_collection(collection_name)
    results = collection.find()
    return [serialize_doc(r) for r in results]

def get_one(collection_name: str, item_id: str):
    collection = get_collection(collection_name)
    result = collection.find_one({"_id": ObjectId(item_id)})
    return serialize_doc(result)

def create(collection_name: str, data: dict):
    collection = get_collection(collection_name)
    result = collection.insert_one(data)
    new_item = collection.find_one({"_id": result.inserted_id})
    return serialize_doc(new_item)

def update(collection_name: str, item_id: str, data: dict):
    collection = get_collection(collection_name)
    result = collection.update_one({"_id": ObjectId(item_id)}, {"$set": data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    updated_item = collection.find_one({"_id": ObjectId(item_id)})
    return serialize_doc(updated_item)

def delete(collection_name: str, item_id: str):
    collection = get_collection(collection_name)
    result = collection.delete_one({"_id": ObjectId(item_id)})
    return result.deleted_count
