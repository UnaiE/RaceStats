# app/services/mongo_services.py
from bson import ObjectId
from app.db.db_mongo import db  # Conexión ya inicializada (Motor o PyMongo)
from fastapi import HTTPException

def _get_collection(collection_name: str):
    return db[collection_name]

async def get_all(collection_name: str):
    collection = _get_collection(collection_name)
    results = await collection.find().to_list(length=None)
    return results

async def get_one(collection_name: str, item_id: str):
    collection = _get_collection(collection_name)
    result = await collection.find_one({"_id": ObjectId(item_id)})
    return result

async def create(collection_name: str, data: dict):
    collection = _get_collection(collection_name)
    result = await collection.insert_one(data)
    new_item = await collection.find_one({"_id": result.inserted_id})
    return new_item

async def update(collection_name: str, item_id: str, data: dict):
    collection = _get_collection(collection_name)
    result = await collection.update_one({"_id": ObjectId(item_id)}, {"$set": data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    updated_item = await collection.find_one({"_id": ObjectId(item_id)})
    return updated_item

async def delete(collection_name: str, item_id: str):
    collection = _get_collection(collection_name)
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    return result.deleted_count
