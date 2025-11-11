"""
Script para importar el calendario completo de F1 desde Ergast API
"""
import sys
from pathlib import Path
import requests
from datetime import datetime

# Agregar el directorio raíz al path
sys.path.append(str(Path(__file__).parent.parent))

from resources.db_mongo import init_mongo, get_collection

def get_known_2025_calendar():
    """Calendario conocido de F1 2025 - carreras restantes"""
    return [
        {
            "season": "2025",
            "round": "22",
            "raceName": "Las Vegas Grand Prix",
            "Circuit": {
                "circuitId": "vegas",
                "circuitName": "Las Vegas Street Circuit",
                "Location": {
                    "locality": "Las Vegas",
                    "country": "USA"
                }
            },
            "date": "2025-11-22",
            "time": "06:00:00Z",
            "url": "https://en.wikipedia.org/wiki/2025_Las_Vegas_Grand_Prix"
        },
        {
            "season": "2025",
            "round": "23",
            "raceName": "Qatar Grand Prix",
            "Circuit": {
                "circuitId": "losail",
                "circuitName": "Losail International Circuit",
                "Location": {
                    "locality": "Al Daayen",
                    "country": "Qatar"
                }
            },
            "date": "2025-11-30",
            "time": "17:00:00Z",
            "url": "https://en.wikipedia.org/wiki/2025_Qatar_Grand_Prix"
        },
        {
            "season": "2025",
            "round": "24",
            "raceName": "Abu Dhabi Grand Prix",
            "Circuit": {
                "circuitId": "yas_marina",
                "circuitName": "Yas Marina Circuit",
                "Location": {
                    "locality": "Abu Dhabi",
                    "country": "UAE"
                }
            },
            "date": "2025-12-07",
            "time": "13:00:00Z",
            "url": "https://en.wikipedia.org/wiki/2025_Abu_Dhabi_Grand_Prix"
        }
    ]


def fetch_f1_calendar(year=2025):
    """Obtiene el calendario de F1 desde Ergast API"""
    # Intentar con HTTPS primero
    urls = [
        f"https://ergast.com/api/f1/{year}.json",
        f"http://ergast.com/api/f1/{year}.json"
    ]
    
    for url in urls:
        try:
            print(f"🔄 Intentando: {url}")
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            print(f"✅ Obtenidas {len(races)} carreras de {year} desde Ergast API")
            return races
        except Exception as e:
            print(f"⚠️ Error con {url}: {e}")
            continue
    
    print(f"❌ No se pudo obtener calendario desde ninguna URL")
    
    # Fallback: calendario conocido de 2025 (carreras restantes)
    print("📅 Usando calendario conocido de 2025...")
    return get_known_2025_calendar()

def import_races_to_mongo(year=2025):
    """Importa carreras de Ergast API a MongoDB"""
    # Inicializar MongoDB
    init_mongo()
    races_collection = get_collection("races")
    
    # Obtener calendario desde Ergast
    ergast_races = fetch_f1_calendar(year)
    
    if not ergast_races:
        print("⚠️ No se obtuvieron carreras desde la API")
        return
    
    added = 0
    updated = 0
    
    for race in ergast_races:
        circuit = race.get("Circuit", {})
        location = circuit.get("Location", {})
        
        # Convertir fecha y hora de Ergast a ISO format
        race_date = race.get("date")
        race_time = race.get("time", "14:00:00Z")  # Hora por defecto si no está disponible
        
        # Combinar fecha y hora
        date_start = f"{race_date}T{race_time}"
        
        race_document = {
            "meeting_name": race.get("raceName"),
            "location": location.get("locality"),
            "country_name": location.get("country"),
            "circuit_short_name": circuit.get("circuitName"),
            "session_name": "Race",
            "session_type": "Race",
            "date_start": date_start,
            "year": int(race.get("season")),
            "round": int(race.get("round")),
            "circuit_id": circuit.get("circuitId"),
            "url": race.get("url"),
            # Claves únicas basadas en el round de Ergast
            "session_key": 10000 + int(race.get("round")),
            "meeting_key": 2000 + int(race.get("round")),
        }
        
        # Buscar si ya existe (por nombre y año)
        existing = races_collection.find_one({
            "meeting_name": race_document["meeting_name"],
            "year": year,
            "session_name": "Race"
        })
        
        if existing:
            # Actualizar si existe
            races_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": race_document}
            )
            updated += 1
            print(f"🔄 Actualizado: {race_document['meeting_name']}")
        else:
            # Insertar si no existe
            races_collection.insert_one(race_document)
            added += 1
            print(f"✅ Agregado: {race_document['meeting_name']} - {race_document['date_start']}")
    
    # Resumen
    total_races = races_collection.count_documents({
        "year": year,
        "session_name": "Race"
    })
    
    print(f"\n📊 Resumen:")
    print(f"   Carreras nuevas: {added}")
    print(f"   Carreras actualizadas: {updated}")
    print(f"   Total carreras {year}: {total_races}")
    
    # Mostrar próximas carreras
    now = datetime.now()
    upcoming = list(races_collection.find({
        "year": year,
        "session_name": "Race",
        "date_start": {"$gt": now.isoformat()}
    }).sort("date_start", 1).limit(3))
    
    if upcoming:
        print(f"\n🏁 Próximas carreras:")
        for race in upcoming:
            print(f"   - {race['meeting_name']}: {race['date_start']}")
    else:
        print(f"\n⚠️ No hay carreras futuras en {year}")

if __name__ == "__main__":
    import_races_to_mongo(2025)
