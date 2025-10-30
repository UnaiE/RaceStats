# app/resources/db_mongo.py
from motor.motor_asyncio import AsyncIOMotorClient

# Configuración de la conexión a MongoDB
MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "racestats"

client = None
db = None

async def init_mongo():
    """Inicializa la conexión a MongoDB"""
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]
    print(f"✅ Conectado a MongoDB: {MONGO_URI}")

def get_collection(name: str):
    """Obtiene una colección de MongoDB de forma segura"""
    if not db:
        raise Exception("❌ MongoDB no inicializado. Llama a init_mongo() antes de usar la DB.")
    return db[name]
