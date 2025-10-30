from fastapi import FastAPI
from app.routes.mongo import (
    driver_router, team_router, race_router,
    car_router, circuit_router, season_router, championship_router
)
from app.routes.sql import (
    user_router, favorite_router, comparison_router
)
from app.resources.db_mongo import init_mongo

app = FastAPI(
    title="RaceStats F1 API",
    description="Plataforma para consultar y comparar estadísticas de Fórmula 1.",
    version="1.0.0"
)

# Inicialización de Mongo
@app.on_event("startup")
async def startup_db_client():
    await init_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    print("🧹 Cerrando conexión Mongo...")

# MongoDB Routers
app.include_router(driver_router.router)
app.include_router(team_router.router)
app.include_router(race_router.router)
app.include_router(car_router.router)
app.include_router(circuit_router.router)
app.include_router(season_router.router)
app.include_router(championship_router.router)

# SQL Routers
app.include_router(user_router.router)
app.include_router(favorite_router.router)
app.include_router(comparison_router.router)

# Healthcheck
@app.get("/")
async def root():
    return {"status": "ok", "message": "API funcionando correctamente 🚀"}
