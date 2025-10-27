# app/resources/db_mongo.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.resources.config import settings
# Configuración de la conexión a MongoDB
MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "racestats"
# Conexión a la base de datos MongoDB
client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

# Colecciones
drivers_collection = db["drivers"]
teams_collection = db["teams"]
races_collection = db["races"]
cars_collection = db["cars"]
circuits_collection = db["circuits"]
seasons_collection = db["seasons"]
championships_collection = db["championships"]
