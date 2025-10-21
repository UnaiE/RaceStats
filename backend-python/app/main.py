from fastapi import FastAPI
from app.resources import database
from app.resources.database import Base, engine
from app.routes import drivers, races, teams, championships, seasons, cars, circuits    

app = FastAPI(title="RaceStats F1 Data API")

# Crear las tablas en BD si no existen
Base.metadata.create_all(bind=engine)

# Rutas principales
app.include_router(drivers.router, prefix="/drivers", tags=["Drivers"])
app.include_router(races.router, prefix="/races", tags=["Races"])
app.include_router(teams.router, prefix="/teams", tags=["Teams"])
app.include_router(championships.router, prefix="/championships", tags=["Championships"])
app.include_router(seasons.router, prefix="/seasons", tags=["Seasons"])
app.include_router(cars.router, prefix="/cars", tags=["Cars"])
app.include_router(circuits.router, prefix="/circuits", tags=["Circuits"])

@app.get("/")
def root():
    return {"message": "Welcome to RaceStats F1 API"}
