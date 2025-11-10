# backend-python/app/services/openf1_import_service.py
import httpx
from app.resources.db_mongo import get_collection

OPENF1_BASE = "https://api.openf1.org/v1"

# === DRIVERS ===
async def import_drivers():
    print("⏳ Importando pilotos únicos desde OpenF1...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{OPENF1_BASE}/drivers")
        response.raise_for_status()
        drivers = response.json()

    drivers_collection = get_collection("drivers")

    # Agrupar por driver_number (para evitar duplicados)
    unique_drivers = {}
    for d in drivers:
        driver_id = d.get("driver_number")
        if driver_id not in unique_drivers:
            unique_drivers[driver_id] = {
                "driver_id": driver_id,
                "full_name": d.get("full_name"),
                "name_acronym": d.get("name_acronym"),
                "country_code": d.get("country_code"),
                "headshot_url": d.get("headshot_url"),
            }

    for driver in unique_drivers.values():
        await drivers_collection.update_one(
            {"driver_id": driver["driver_id"]},
            {"$set": driver},
            upsert=True
        )

    print(f"✅ {len(unique_drivers)} pilotos únicos actualizados.")


# === RACES ===
async def import_sessions():
    print("⏳ Importando sesiones (carreras) desde OpenF1...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{OPENF1_BASE}/sessions")
        response.raise_for_status()
        sessions = response.json()

    races_collection = get_collection("races")

    for s in sessions:
        # Filtramos solo sesiones de carrera
        if s.get("session_name") == "Race":
            doc = {
                "session_key": s.get("session_key"),
                "meeting_key": s.get("meeting_key"),
                "circuit_key": s.get("circuit_key"),
                "location": s.get("location"),
                "country_key": s.get("country_key"),
                "date_start": s.get("date_start"),
                "date_end": s.get("date_end"),
                "year": s.get("year"),
                "session_name": s.get("session_name"),
                "meeting_name": s.get("meeting_name"),
            }
            await races_collection.update_one(
                {"session_key": s.get("session_key")},
                {"$set": doc},
                upsert=True
            )

    print(f"✅ {len(sessions)} sesiones procesadas (solo carreras guardadas).")


# === SEASONS ===
async def import_seasons():
    print("⏳ Construyendo temporadas (agrupando carreras por año)...")
    races_collection = get_collection("races")
    seasons_collection = get_collection("seasons")

    years = await races_collection.distinct("year")
    for y in years:
        race_count = await races_collection.count_documents({"year": y})
        await seasons_collection.update_one(
            {"year": str(y)},
            {"$set": {"year": str(y), "race_count": race_count}},
            upsert=True
        )

    print(f"✅ {len(years)} temporadas registradas.")


# === MAIN ENTRY ===
async def import_all_openf1_data():
    """Carga completa de datos históricos básicos de OpenF1."""
    await import_drivers()
    await import_sessions()
    await import_seasons()
    print("🚀 Importación desde OpenF1 completada.")
