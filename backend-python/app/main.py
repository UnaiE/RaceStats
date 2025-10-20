from fastapi import FastAPI
from routes import drivers, races

app = FastAPI(title="RaceStats F1 Data API")

app.include_router(drivers.router)
app.include_router(races.router)
