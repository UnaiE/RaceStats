import httpx
from app.resources.db_mongo import get_collection

BASE_URL = "http://ergast.com/api/f1"

def fetch_drivers(season: int = None):
    """Importa pilotos desde Ergast API (síncrono)."""
    url = f"{BASE_URL}/{season}/drivers.json" if season else f"{BASE_URL}/drivers.json"
    
    with httpx.Client(timeout=30.0) as client:
        r = client.get(url)
        data = r.json()["MRData"]["DriverTable"]["Drivers"]
        
        drivers_collection = get_collection("drivers")
        for d in data:
            driver = {
                "driver_id": d["driverId"],
                "given_name": d["givenName"],
                "family_name": d["familyName"],
                "nationality": d["nationality"],
                "date_of_birth": d["dateOfBirth"]
            }
            drivers_collection.update_one(
                {"driver_id": driver["driver_id"]},
                {"$set": driver},
                upsert=True
            )


def fetch_constructors_by_year(year: int):
    """
    Obtiene constructores/equipos de una temporada específica desde Ergast API.
    Retorna lista de constructores con sus datos.
    """
    url = f"{BASE_URL}/{year}/constructors.json"
    
    with httpx.Client(timeout=30.0) as client:
        r = client.get(url)
        data = r.json()["MRData"]["ConstructorTable"]["Constructors"]
        return data
