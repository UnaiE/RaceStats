"""
Script para importar resultados de carreras desde OpenF1 API
y almacenarlos en MongoDB para mostrarlos en RaceDetailPage
"""
from pymongo import MongoClient
import requests
import os
from datetime import datetime

# Sistema de puntuación F1 (2010-presente)
POINTS_SYSTEM = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
}

def calculate_points(position):
    """Calcula los puntos según la posición final"""
    try:
        pos = int(position)
        return POINTS_SYSTEM.get(pos, 0)
    except (ValueError, TypeError):
        return 0

def get_race_results_from_openf1(session_key):
    """Obtener resultados de una carrera desde OpenF1 API"""
    try:
        # Obtener posiciones finales
        url = f"https://api.openf1.org/v1/position?session_key={session_key}"
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return None
            
        positions_data = response.json()
        
        if not positions_data:
            return None
        
        # Agrupar por driver_number y obtener la última posición de cada piloto
        driver_final_positions = {}
        for pos in positions_data:
            driver_num = pos.get('driver_number')
            date = pos.get('date')
            position = pos.get('position')
            
            if driver_num and position:
                if driver_num not in driver_final_positions:
                    driver_final_positions[driver_num] = {'position': position, 'date': date}
                else:
                    # Mantener la posición más reciente
                    if date > driver_final_positions[driver_num]['date']:
                        driver_final_positions[driver_num] = {'position': position, 'date': date}
        
        # Obtener información de pilotos
        drivers_url = f"https://api.openf1.org/v1/drivers?session_key={session_key}"
        drivers_response = requests.get(drivers_url, timeout=10)
        
        if drivers_response.status_code != 200:
            return None
            
        drivers_data = drivers_response.json()
        
        # Crear diccionario de pilotos
        drivers_dict = {}
        for driver in drivers_data:
            driver_num = driver.get('driver_number')
            if driver_num:
                drivers_dict[driver_num] = {
                    'full_name': driver.get('full_name'),
                    'name_acronym': driver.get('name_acronym'),
                    'team_name': driver.get('team_name'),
                    'team_colour': driver.get('team_colour'),
                    'headshot_url': driver.get('headshot_url')
                }
        
        # Combinar resultados
        results = []
        for driver_num, pos_data in driver_final_positions.items():
            if driver_num in drivers_dict:
                driver_info = drivers_dict[driver_num]
                position = pos_data['position']
                results.append({
                    'position': position,
                    'driver_number': driver_num,
                    'driver_name': driver_info['full_name'],
                    'driver_acronym': driver_info['name_acronym'],
                    'team_name': driver_info['team_name'],
                    'team_colour': driver_info['team_colour'],
                    'headshot_url': driver_info['headshot_url'],
                    'points': calculate_points(position)
                })
        
        # Ordenar por posición
        results.sort(key=lambda x: x['position'])
        
        return results if results else None
        
    except Exception as e:
        print(f"Error obteniendo resultados de OpenF1: {e}")
        return None

def import_race_results():
    """Importar resultados de todas las carreras desde OpenF1"""
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    if "mongo" not in mongo_uri and os.path.exists("/.dockerenv"):
        mongo_uri = "mongodb://mongo:27017/"
    
    client = MongoClient(mongo_uri)
    db = client.racestats
    races_collection = db.races
    
    # Obtener todas las carreras que tienen session_key
    races = list(races_collection.find({"session_key": {"$exists": True}}))
    
    print(f"📊 Encontradas {len(races)} carreras con session_key\n")
    
    updated_count = 0
    failed_count = 0
    
    for race in races:
        session_key = race.get('session_key')
        race_name = race.get('meeting_name', 'Carrera')
        year = race.get('year', 'N/A')
        
        print(f"🏁 Procesando: {race_name} ({year}) - Session: {session_key}")
        
        # Obtener resultados desde OpenF1
        results = get_race_results_from_openf1(session_key)
        
        if results:
            # Actualizar la carrera con los resultados
            races_collection.update_one(
                {"session_key": session_key},
                {"$set": {"race_results": results, "results_updated_at": datetime.utcnow()}}
            )
            updated_count += 1
            print(f"   ✅ {len(results)} resultados guardados")
        else:
            failed_count += 1
            print(f"   ⚠️  No se encontraron resultados")
        
        print()
    
    print("=" * 80)
    print(f"✅ Carreras actualizadas con resultados: {updated_count}")
    print(f"⚠️  Carreras sin resultados: {failed_count}")
    print(f"📊 Total procesadas: {len(races)}")
    print("=" * 80)
    
    client.close()

if __name__ == "__main__":
    print("🔧 Importando resultados de carreras desde OpenF1 API...\n")
    import_race_results()
    print("\n✅ Proceso completado")
