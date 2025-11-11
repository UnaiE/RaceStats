# backend-python/app/services/openf1_import_service.py
import httpx
from app.resources.db_mongo import get_collection

OPENF1_BASE = "https://api.openf1.org/v1"

# === DRIVERS ===
def import_drivers():
    """Importa pilotos únicos desde OpenF1 API (síncrono)."""
    print("⏳ Importando pilotos desde OpenF1...")
    
    with httpx.Client(timeout=30.0) as client:
        response = client.get(f"{OPENF1_BASE}/drivers")
        response.raise_for_status()
        drivers = response.json()

    drivers_collection = get_collection("drivers")

    # Agrupar por driver_number (para evitar duplicados)
    unique_drivers = {}
    for d in drivers:
        driver_id = d.get("driver_number")
        if driver_id and driver_id not in unique_drivers:
            unique_drivers[driver_id] = {
                "driver_id": driver_id,
                "full_name": d.get("full_name"),
                "name_acronym": d.get("name_acronym"),
                "country_code": d.get("country_code"),
                "headshot_url": d.get("headshot_url"),
                "team_name": d.get("team_name"),
            }

    for driver in unique_drivers.values():
        drivers_collection.update_one(
            {"driver_id": driver["driver_id"]},
            {"$set": driver},
            upsert=True
        )

    print(f"✅ {len(unique_drivers)} pilotos únicos guardados.")
    return {"imported": len(unique_drivers)}


# === TEAMS ===
def import_teams():
    """Importa equipos únicos desde OpenF1 API."""
    print("⏳ Importando equipos desde OpenF1...")
    
    # OpenF1 no tiene endpoint /teams, los sacamos de /drivers
    with httpx.Client(timeout=30.0) as client:
        response = client.get(f"{OPENF1_BASE}/drivers")
        response.raise_for_status()
        drivers = response.json()

    teams_collection = get_collection("teams")

    # Extraer equipos únicos de los pilotos
    unique_teams = {}
    for d in drivers:
        team_name = d.get("team_name")
        team_colour = d.get("team_colour")
        
        if team_name and team_name not in unique_teams:
            unique_teams[team_name] = {
                "team_id": team_name.lower().replace(" ", "_"),
                "name": team_name,
                "colour": f"#{team_colour}" if team_colour else None,
            }

    for team in unique_teams.values():
        teams_collection.update_one(
            {"team_id": team["team_id"]},
            {"$set": team},
            upsert=True
        )

    print(f"✅ {len(unique_teams)} equipos únicos guardados.")
    return {"imported": len(unique_teams)}


# === RACES / SESSIONS ===
def import_races(year: int = None):
    """Importa sesiones de carrera desde OpenF1 API."""
    print(f"⏳ Importando carreras desde OpenF1{f' (año {year})' if year else ''}...")
    
    url = f"{OPENF1_BASE}/sessions"
    params = {"year": year} if year else {}
    
    with httpx.Client(timeout=30.0) as client:
        response = client.get(url, params=params)
        response.raise_for_status()
        sessions = response.json()

    races_collection = get_collection("races")
    race_count = 0

    for s in sessions:
        # Filtramos solo sesiones de carrera
        if s.get("session_name") == "Race":
            doc = {
                "race_id": s.get("session_key"),  # Usar session_key como ID
                "session_key": s.get("session_key"),
                "meeting_key": s.get("meeting_key"),
                "circuit_key": s.get("circuit_key"),
                "location": s.get("location"),
                "country_key": s.get("country_key"),
                "country_name": s.get("country_name"),
                "date_start": s.get("date_start"),
                "date_end": s.get("date_end"),
                "year": s.get("year"),
                "session_name": s.get("session_name"),
                "meeting_name": s.get("meeting_name"),
                "circuit_short_name": s.get("circuit_short_name"),
            }
            races_collection.update_one(
                {"race_id": s.get("session_key")},
                {"$set": doc},
                upsert=True
            )
            race_count += 1

    print(f"✅ {race_count} carreras guardadas.")
    return {"imported": race_count}


# === SEASONS ===
def import_seasons():
    """Construye temporadas agrupando carreras por año."""
    print("⏳ Construyendo temporadas...")
    races_collection = get_collection("races")
    seasons_collection = get_collection("seasons")

    years = races_collection.distinct("year")
    
    for y in years:
        if y:  # Validar que year no sea None
            race_count = races_collection.count_documents({"year": y})
            seasons_collection.update_one(
                {"year": str(y)},
                {"$set": {"year": str(y), "race_count": race_count}},
                upsert=True
            )

    print(f"✅ {len(years)} temporadas registradas.")
    return {"imported": len(years)}


# === CIRCUITS ===
def import_circuits():
    """Importa circuitos únicos desde carreras guardadas."""
    print("⏳ Importando circuitos desde datos de carreras...")
    races_collection = get_collection("races")
    circuits_collection = get_collection("circuits")

    # Extraer circuitos únicos de las carreras
    unique_circuits = {}
    for race in races_collection.find():
        circuit_key = race.get("circuit_key")
        if circuit_key and circuit_key not in unique_circuits:
            unique_circuits[circuit_key] = {
                "circuit_key": circuit_key,
                "circuit_short_name": race.get("circuit_short_name", f"Circuit {circuit_key}"),
            }

    for circuit in unique_circuits.values():
        circuits_collection.update_one(
            {"circuit_key": circuit["circuit_key"]},
            {"$set": circuit},
            upsert=True
        )

    print(f"✅ {len(unique_circuits)} circuitos guardados.")
    return {"imported": len(unique_circuits)}


# === CHAMPIONSHIPS ===
def import_championships():
    """Genera campeonatos basándose en temporadas."""
    print("⏳ Generando campeonatos desde temporadas...")
    seasons_collection = get_collection("seasons")
    championships_collection = get_collection("championships")

    # Crear un campeonato por cada temporada
    championship_count = 0
    for season in seasons_collection.find():
        year = season.get("year")
        if year:
            championship_id = f"f1_{year}"
            doc = {
                "championship_id": championship_id,
                "name": f"Formula 1 World Championship {year}",
                "year": year,
                "season_count": 1,
            }
            championships_collection.update_one(
                {"championship_id": championship_id},
                {"$set": doc},
                upsert=True
            )
            championship_count += 1

    print(f"✅ {championship_count} campeonatos generados.")
    return {"imported": championship_count}


# === MAIN ENTRY ===
def import_all_openf1_data():
    """Carga completa de datos históricos básicos de OpenF1."""
    print("🚀 Iniciando importación completa desde OpenF1...")
    
    results = {
        "drivers": import_drivers(),
        "teams": import_teams(),
        "races": import_races(),
        "circuits": import_circuits(),
        "seasons": import_seasons(),
        "championships": import_championships(),
    }
    
    print("✅ Importación completada.")
    return results

