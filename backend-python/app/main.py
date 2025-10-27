from fastapi import FastAPI
from app.routes.mongo import driver_router, team_router, race_router, car_router, circuit_router, season_router, championship_router
from app.routes.sql import user_router, favorite_router, comparison_router

app = FastAPI(title="RaceStats F1 API")
# MongoDB Routers
app.include_router(driver_router.router, prefix="/drivers", tags=["Drivers"])
app.include_router(team_router.router, prefix="/teams", tags=["Teams"])
app.include_router(race_router.router, prefix="/races", tags=["Races"])
app.include_router(car_router.router, prefix="/cars", tags=["Cars"])
app.include_router(circuit_router.router, prefix="/circuits", tags=["Circuits"])
app.include_router(season_router.router, prefix="/seasons", tags=["Seasons"])
app.include_router(championship_router.router, prefix="/championships", tags=["Championships"])
# SQL Routers
app.include_router(user_router.router, prefix="/users", tags=["Users"])
app.include_router(favorite_router.router, prefix="/favorites", tags=["Favorites"])
app.include_router(comparison_router.router, prefix="/comparisons", tags=["Comparisons"])
