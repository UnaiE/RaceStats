"""
Router para obtener calendario de F1 desde APIs externas
"""
from fastapi import APIRouter, HTTPException
import requests
from datetime import datetime

router = APIRouter()

@router.get("/external-calendar/{year}")
async def get_external_calendar(year: int):
    """
    Obtiene el calendario de F1 desde Ergast API
    """
    try:
        # Intentar con Ergast API (fuente oficial)
        url = f"https://ergast.com/api/f1/{year}.json"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            
            # Formatear las carreras para que coincidan con nuestro schema
            formatted_races = []
            for race in races:
                circuit = race.get("Circuit", {})
                location = circuit.get("Location", {})
                
                race_date = race.get("date")
                race_time = race.get("time", "14:00:00Z")
                date_start = f"{race_date}T{race_time}"
                
                formatted_race = {
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
                    "session_key": 10000 + int(race.get("round")),
                    "meeting_key": 2000 + int(race.get("round")),
                }
                formatted_races.append(formatted_race)
            
            return {
                "source": "Ergast API",
                "total_races": len(formatted_races),
                "races": formatted_races
            }
        else:
            raise HTTPException(status_code=response.status_code, detail="Error al obtener calendario desde Ergast")
            
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error de conexión con Ergast API: {str(e)}")


@router.get("/next-race")
async def get_next_race():
    """
    Obtiene solo la próxima carrera desde API externa
    """
    try:
        current_year = datetime.now().year
        
        # Obtener calendario del año actual
        url = f"https://ergast.com/api/f1/{current_year}.json"
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            raise HTTPException(status_code=503, detail="Error al obtener calendario")
        
        data = response.json()
        races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
        
        # Filtrar la próxima carrera (fecha futura más cercana)
        now = datetime.now()
        future_races = []
        
        for race in races:
            race_date = race.get("date")
            race_time = race.get("time", "14:00:00Z")
            date_start_str = f"{race_date}T{race_time}"
            race_datetime = datetime.fromisoformat(date_start_str.replace("Z", "+00:00"))
            
            if race_datetime > now:
                circuit = race.get("Circuit", {})
                location = circuit.get("Location", {})
                
                future_races.append({
                    "meeting_name": race.get("raceName"),
                    "location": location.get("locality"),
                    "country_name": location.get("country"),
                    "circuit_short_name": circuit.get("circuitName"),
                    "session_name": "Race",
                    "date_start": date_start_str,
                    "year": int(race.get("season")),
                    "round": int(race.get("round")),
                    "url": race.get("url"),
                    "race_datetime": race_datetime
                })
        
        if not future_races:
            # Si no hay carreras futuras este año, intentar el año siguiente
            next_year = current_year + 1
            url = f"https://ergast.com/api/f1/{next_year}.json"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
                
                if races:
                    race = races[0]  # Primera carrera del año siguiente
                    circuit = race.get("Circuit", {})
                    location = circuit.get("Location", {})
                    
                    race_date = race.get("date")
                    race_time = race.get("time", "14:00:00Z")
                    date_start_str = f"{race_date}T{race_time}"
                    
                    return {
                        "source": "Ergast API",
                        "race": {
                            "meeting_name": race.get("raceName"),
                            "location": location.get("locality"),
                            "country_name": location.get("country"),
                            "circuit_short_name": circuit.get("circuitName"),
                            "session_name": "Race",
                            "date_start": date_start_str,
                            "year": int(race.get("season")),
                            "round": int(race.get("round")),
                            "url": race.get("url")
                        }
                    }
            
            raise HTTPException(status_code=404, detail="No hay carreras futuras disponibles")
        
        # Ordenar por fecha y tomar la más cercana
        future_races.sort(key=lambda x: x["race_datetime"])
        next_race = future_races[0]
        
        # Remover el campo auxiliar
        next_race.pop("race_datetime", None)
        
        return {
            "source": "Ergast API",
            "race": next_race
        }
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error de conexión: {str(e)}")
