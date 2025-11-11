from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "racestats")

client = None
db = None

def init_mongo():
    """Inicializa la conexión global a MongoDB."""
    global client, db
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        client.admin.command("ping")
        print(f"✅ Conectado a MongoDB: {MONGO_URI}")
    except Exception as e:
        print(f"❌ Error al conectar a MongoDB: {e}")
        db = None

def get_collection(name: str):
    """Devuelve una colección del cliente global."""
    global db
    if db is None:
        raise RuntimeError("❌ MongoDB no está inicializado. Llama a init_mongo() primero.")
    return db[name]
