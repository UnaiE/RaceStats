from app.resources.db_mongo import db
from bson import ObjectId

# Funciones genéricas para CRUD
async def get_all(collection_name):
    collection = db[collection_name]
    cursor = collection.find({})
    results = []
    async for document in cursor:
        document["_id"] = str(document["_id"])
        results.append(document)
    return results

async def get_one(collection_name, object_id):
    collection = db[collection_name]
    doc = await collection.find_one({"_id": ObjectId(object_id)})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

async def create(collection_name, data: dict):
    collection = db[collection_name]
    result = await collection.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data

async def update(collection_name, object_id, data: dict):
    collection = db[collection_name]
    await collection.update_one({"_id": ObjectId(object_id)}, {"$set": data})
    return await get_one(collection_name, object_id)

async def delete(collection_name, object_id):
    collection = db[collection_name]
    result = await collection.delete_one({"_id": ObjectId(object_id)})
    return result.deleted_count
