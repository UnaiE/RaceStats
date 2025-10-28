import httpx
from app.services.mongo_services import create

BASE_URL = "https://ergast.com/api/f1"

async def fetch_drivers(season: int = None):
    url = f"{BASE_URL}/{season}/drivers.json" if season else f"{BASE_URL}/drivers.json"
    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        data = r.json()["MRData"]["DriverTable"]["Drivers"]
        for d in data:
            driver = {
                "driver_id": d["driverId"],
                "given_name": d["givenName"],
                "family_name": d["familyName"],
                "nationality": d["nationality"],
                "date_of_birth": d["dateOfBirth"]
            }
            await create("drivers", driver)
