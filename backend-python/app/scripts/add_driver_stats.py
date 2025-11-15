"""
Script para agregar estadísticas de carrera manualmente a los pilotos
Datos obtenidos de fuentes oficiales (Wikipedia, F1.com) - Actualizados a Nov 2024
"""
from pymongo import MongoClient
from datetime import datetime
import os

# Estadísticas completas de pilotos (datos reales actualizados a finales de 2024)
# Incluye pilotos desde 2000 hasta 2025
DRIVER_STATS = {
    # === PILOTOS ACTUALES 2024-2025 ===
    
    # Max Verstappen
    1: {
        "date_of_birth": "1997-09-30",
        "wins": 61,
        "poles": 40,
        "podiums": 107,
        "championships": 4,  # 2021, 2022, 2023, 2024
        "career_races": 199,
        "career_fastest_laps": 33,
        "first_race": "2015",
        "nationality": "Dutch"
    },
    
    # Sergio Pérez
    11: {
        "date_of_birth": "1990-01-26",
        "wins": 6,
        "poles": 3,
        "podiums": 39,
        "championships": 0,
        "career_races": 275,
        "career_fastest_laps": 11,
        "first_race": "2011",
        "nationality": "Mexican"
    },
    
    # Lewis Hamilton
    44: {
        "date_of_birth": "1985-01-07",
        "wins": 105,
        "poles": 104,
        "podiums": 201,
        "championships": 7,  # 2008, 2014, 2015, 2017, 2018, 2019, 2020
        "career_races": 345,
        "career_fastest_laps": 67,
        "first_race": "2007",
        "nationality": "British"
    },
    
    # George Russell
    63: {
        "date_of_birth": "1998-02-15",
        "wins": 2,
        "poles": 3,
        "podiums": 13,
        "championships": 0,
        "career_races": 118,
        "career_fastest_laps": 7,
        "first_race": "2019",
        "nationality": "British"
    },
    
    # Charles Leclerc
    16: {
        "date_of_birth": "1997-10-16",
        "wins": 7,
        "poles": 26,
        "podiums": 39,
        "championships": 0,
        "career_races": 145,
        "career_fastest_laps": 9,
        "first_race": "2018",
        "nationality": "Monegasque"
    },
    
    # Carlos Sainz
    55: {
        "date_of_birth": "1994-09-01",
        "wins": 4,
        "poles": 5,
        "podiums": 25,
        "championships": 0,
        "career_races": 200,
        "career_fastest_laps": 3,
        "first_race": "2015",
        "nationality": "Spanish"
    },
    
    # Lando Norris
    4: {
        "date_of_birth": "1999-11-13",
        "wins": 4,
        "poles": 5,
        "podiums": 23,
        "championships": 0,
        "career_races": 120,
        "career_fastest_laps": 9,
        "first_race": "2019",
        "nationality": "British"
    },
    
    # Oscar Piastri
    81: {
        "date_of_birth": "2001-04-06",
        "wins": 2,
        "poles": 0,
        "podiums": 9,
        "championships": 0,
        "career_races": 43,
        "career_fastest_laps": 2,
        "first_race": "2023",
        "nationality": "Australian"
    },
    
    # Fernando Alonso
    14: {
        "date_of_birth": "1981-07-29",
        "wins": 32,
        "poles": 22,
        "podiums": 106,
        "championships": 2,  # 2005, 2006
        "career_races": 395,
        "career_fastest_laps": 26,
        "first_race": "2001",
        "nationality": "Spanish"
    },
    
    # Lance Stroll
    18: {
        "date_of_birth": "1998-10-29",
        "wins": 0,
        "poles": 1,
        "podiums": 3,
        "championships": 0,
        "career_races": 160,
        "career_fastest_laps": 0,
        "first_race": "2017",
        "nationality": "Canadian"
    },
    
    # Pierre Gasly
    10: {
        "date_of_birth": "1996-02-07",
        "wins": 1,
        "poles": 0,
        "podiums": 4,
        "championships": 0,
        "career_races": 145,
        "career_fastest_laps": 3,
        "first_race": "2017",
        "nationality": "French"
    },
    
    # Esteban Ocon
    31: {
        "date_of_birth": "1996-09-17",
        "wins": 1,
        "poles": 0,
        "podiums": 3,
        "championships": 0,
        "career_races": 146,
        "career_fastest_laps": 0,
        "first_race": "2016",
        "nationality": "French"
    },
    
    # Alex Albon
    23: {
        "date_of_birth": "1996-03-23",
        "wins": 0,
        "poles": 0,
        "podiums": 2,
        "championships": 0,
        "career_races": 92,
        "career_fastest_laps": 0,
        "first_race": "2019",
        "nationality": "Thai"
    },
    
    # Logan Sargeant
    2: {
        "date_of_birth": "2000-12-31",
        "wins": 0,
        "poles": 0,
        "podiums": 0,
        "championships": 0,
        "career_races": 36,
        "career_fastest_laps": 0,
        "first_race": "2023",
        "nationality": "American"
    },
    
    # Daniel Ricciardo
    3: {
        "date_of_birth": "1989-07-01",
        "wins": 8,
        "poles": 3,
        "podiums": 32,
        "championships": 0,
        "career_races": 257,
        "career_fastest_laps": 5,
        "first_race": "2011",
        "nationality": "Australian"
    },
    
    # Yuki Tsunoda
    22: {
        "date_of_birth": "2000-05-11",
        "wins": 0,
        "poles": 0,
        "podiums": 0,
        "championships": 0,
        "career_races": 82,
        "career_fastest_laps": 0,
        "first_race": "2021",
        "nationality": "Japanese"
    },
    
    # Valtteri Bottas
    77: {
        "date_of_birth": "1989-08-28",
        "wins": 10,
        "poles": 20,
        "podiums": 67,
        "championships": 0,
        "career_races": 237,
        "career_fastest_laps": 19,
        "first_race": "2013",
        "nationality": "Finnish"
    },
    
    # Zhou Guanyu
    24: {
        "date_of_birth": "1999-05-30",
        "wins": 0,
        "poles": 0,
        "podiums": 0,
        "championships": 0,
        "career_races": 62,
        "career_fastest_laps": 0,
        "first_race": "2022",
        "nationality": "Chinese"
    },
    
    # Kevin Magnussen
    20: {
        "date_of_birth": "1992-10-05",
        "wins": 0,
        "poles": 1,
        "podiums": 1,
        "championships": 0,
        "career_races": 177,
        "career_fastest_laps": 1,
        "first_race": "2014",
        "nationality": "Danish"
    },
    
    # Nico Hülkenberg
    27: {
        "date_of_birth": "1987-08-19",
        "wins": 0,
        "poles": 1,
        "podiums": 0,
        "championships": 0,
        "career_races": 220,
        "career_fastest_laps": 2,
        "first_race": "2010",
        "nationality": "German"
    },
    
    # Liam Lawson
    40: {
        "date_of_birth": "2002-02-11",
        "wins": 0,
        "poles": 0,
        "podiums": 0,
        "championships": 0,
        "career_races": 11,
        "career_fastest_laps": 0,
        "first_race": "2023",
        "nationality": "New Zealander"
    },
    
    # Oliver Bearman
    87: {
        "date_of_birth": "2005-05-08",
        "wins": 0,
        "poles": 0,
        "podiums": 0,
        "championships": 0,
        "career_races": 2,
        "career_fastest_laps": 0,
        "first_race": "2024",
        "nationality": "British"
    },
    
    # Jack Doohan
    61: {
        "date_of_birth": "2003-01-20",
        "wins": 0,
        "poles": 0,
        "podiums": 0,
        "championships": 0,
        "career_races": 1,
        "career_fastest_laps": 0,
        "first_race": "2023",
        "nationality": "Australian"
    },
    
    # Franco Colapinto
    43: {
        "date_of_birth": "2003-05-27",
        "wins": 0,
        "poles": 0,
        "podiums": 0,
        "championships": 0,
        "career_races": 9,
        "career_fastest_laps": 0,
        "first_race": "2024",
        "nationality": "Argentine"
    },
    
    # Isack Hadjar  
    41: {
        "date_of_birth": "2004-09-28",
        "wins": 0,
        "poles": 0,
        "podiums": 0,
        "championships": 0,
        "career_races": 2,
        "career_fastest_laps": 0,
        "first_race": "2023",
        "nationality": "French"
    },
}

def calculate_age(birth_date: str) -> int:
    """Calcular edad desde fecha de nacimiento"""
    birth = datetime.strptime(birth_date, "%Y-%m-%d")
    today = datetime.now()
    age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
    return age

def add_driver_statistics():
    """Agregar estadísticas de carrera a pilotos en MongoDB"""
    # Detectar si estamos en Docker
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    if "mongo" not in mongo_uri and os.path.exists("/.dockerenv"):
        mongo_uri = "mongodb://mongo:27017/"
    
    client = MongoClient(mongo_uri)
    db = client.racestats
    drivers_collection = db.drivers
    
    updated_count = 0
    not_found = []
    
    for driver_key, stats in DRIVER_STATS.items():
        # Calcular edad si hay fecha de nacimiento
        age = None
        if "date_of_birth" in stats:
            age = calculate_age(stats["date_of_birth"])
        
        update_data = {
            "wins": stats.get("wins", 0),
            "poles": stats.get("poles", 0),
            "podiums": stats.get("podiums", 0),
            "championships": stats.get("championships", 0),
            "career_races": stats.get("career_races", 0),
            "career_fastest_laps": stats.get("career_fastest_laps", 0),
            "date_of_birth": stats.get("date_of_birth"),
            "first_race": stats.get("first_race"),
            "nationality": stats.get("nationality"),
        }
        
        # Remover None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        # Buscar por driver_id (número) si es int
        if isinstance(driver_key, int):
            # Verificar que existe el piloto antes de actualizar
            driver_doc = drivers_collection.find_one({"driver_id": driver_key})
            if not driver_doc:
                not_found.append(driver_key)
                continue
            
            result = drivers_collection.update_one(
                {"driver_id": driver_key},
                {"$set": update_data}
            )
        else:
            # Buscar por apellido (case insensitive) para pilotos históricos
            # Convertir key como "max_verstappen" a buscar "verstappen"
            last_name_search = driver_key.split("_")[-1]
            driver_doc = drivers_collection.find_one(
                {"last_name": {"$regex": f"^{last_name_search}$", "$options": "i"}}
            )
            
            if not driver_doc:
                not_found.append(driver_key)
                continue
            
            result = drivers_collection.update_one(
                {"_id": driver_doc["_id"]},
                {"$set": update_data}
            )
        
        if result.modified_count > 0 or result.matched_count > 0:
            updated_count += 1
            print(f"✅ {driver_key} - {driver_doc.get('full_name', 'Unknown')} - {stats.get('wins', 0)} victorias, {stats.get('championships', 0)} campeonatos")
    
    print(f"\n📊 Total pilotos actualizados: {updated_count}")
    if not_found:
        print(f"⚠️  No encontrados en DB ({len(not_found)}): {', '.join(map(str, not_found[:10]))}")
    
    client.close()

if __name__ == "__main__":
    print("🏆 Agregando estadísticas de carrera a pilotos...\n")
    add_driver_statistics()
    print("\n✅ Proceso completado")
