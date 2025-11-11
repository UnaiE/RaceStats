# backend-python/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers MongoDB
from app.routes.mongo import (
    driver_router,
    team_router,
    race_router,
    car_router,
    circuit_router,
    season_router,
    championship_router,
)

# Routers SQL
from app.routes.sql import (
    user_router,
    favorite_router,
    comparison_router,
    login_router  # router nuevo para login
)

# DB init
from app.resources.db_mongo import init_mongo
from app.resources.db_sql import init_sql_db

app = FastAPI(
    title="RaceStats F1 API",
    description="Plataforma para consultar y comparar estadísticas de Fórmula 1.",
    version="1.0.0"
)

# CORS
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicialización de DB
@app.on_event("startup")
async def startup_db():
    init_mongo()
    init_sql_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    print("🧹 Cerrando conexión Mongo...")

# Routers MongoDB
app.include_router(driver_router.router, tags=["Drivers"])
app.include_router(team_router.router, tags=["Teams"])
app.include_router(race_router.router, tags=["Races"])
app.include_router(car_router.router, tags=["Cars"])
app.include_router(circuit_router.router, tags=["Circuits"])
app.include_router(season_router.router, tags=["Seasons"])
app.include_router(championship_router.router, tags=["Championships"])

# Routers SQL
app.include_router(user_router.router, prefix="/users", tags=["Users"])
app.include_router(favorite_router.router, prefix="/favorites", tags=["Favorites"])
app.include_router(comparison_router.router, prefix="/comparisons", tags=["Comparisons"])
app.include_router(login_router.router, tags=["Users"])


# Healthcheck
@app.get("/")
async def root():
    return {"status": "ok", "message": "API funcionando correctamente 🚀"}
