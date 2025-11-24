"""
Script para recalcular los puntos de los campeonatos correctamente.
Solo cuenta puntos de sesiones tipo 'Race', no sprints ni clasificación.
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from collections import defaultdict

# Configuración de MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/racestats")
DB_NAME = "racestats"

# Sistema de puntos F1
RACE_POINTS = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
}

SPRINT_POINTS = {
    1: 8, 2: 7, 3: 6, 4: 5, 5: 4,
    6: 3, 7: 2, 8: 1
}

async def recalculate_championships():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    # Obtener todos los campeonatos
    championships = await db.championships.find().to_list(length=None)
    
    for championship in championships:
        year = championship['year']
        print(f"\n{'='*60}")
        print(f"Recalculando campeonato {year}...")
        print(f"{'='*60}")
        
        # Obtener solo las sesiones tipo 'Race' de ese año
        # Obtener todas las carreras y sprints del año
        races = await db.races.find({
            "year": year,
            "session_type": {"$in": ["Race", "Sprint"]}
        }).to_list(length=None)
        
        print(f"Sesiones encontradas: {len(races)}")
        
        # Separar por tipo
        race_sessions = [r for r in races if r.get('session_type') == 'Race']
        sprint_sessions = [r for r in races if r.get('session_type') == 'Sprint']
        
        print(f"- Carreras principales: {len(race_sessions)}")
        print(f"- Sprints: {len(sprint_sessions)}")
        
        # Diccionarios para acumular puntos
        driver_stats = defaultdict(lambda: {
            'points': 0, 
            'wins': 0, 
            'team': None,
            'driver_name': None
        })
        
        constructor_stats = defaultdict(lambda: {
            'points': 0,
            'wins': 0
        })
        
        # Procesar cada carrera/sprint
        races_with_results = 0
        for race in races:
            # Verificar si la carrera tiene race_results
            if not race.get('race_results') or len(race['race_results']) == 0:
                continue
            
            races_with_results += 1
            session_type = race.get('session_type', 'Race')
            
            # Los resultados ya vienen ordenados por posición
            results = race['race_results']
            
            # Asignar puntos según posición final
            for result in results:
                position = result.get('position')
                driver_number = result.get('driver_number')
                driver_name = result.get('driver_name', 'Unknown')
                team_name = result.get('team_name', 'Unknown')
                
                if not driver_number or not position:
                    continue
                
                # Puntos según sistema F1 (diferentes para carreras y sprints)
                if session_type == 'Sprint':
                    points = SPRINT_POINTS.get(position, 0)
                else:  # Race
                    points = RACE_POINTS.get(position, 0)
                
                if points > 0:
                    driver_stats[driver_number]['points'] += points
                    driver_stats[driver_number]['driver_name'] = driver_name
                    driver_stats[driver_number]['team'] = team_name
                    constructor_stats[team_name]['points'] += points
                
                # Contar victorias
                if position == 1:
                    driver_stats[driver_number]['wins'] += 1
                    constructor_stats[team_name]['wins'] += 1
        
        print(f"Carreras con resultados: {races_with_results}")
        
        # Convertir a listas ordenadas
        driver_standings = []
        for driver_num, stats in driver_stats.items():
            driver_standings.append({
                'driver_name': stats['driver_name'],
                'team': stats['team'],
                'points': stats['points'],
                'wins': stats['wins'],
                'position': 0  # Se asignará después de ordenar
            })
        
        # Ordenar por puntos (descendente)
        driver_standings.sort(key=lambda x: (-x['points'], -x['wins']))
        
        # Asignar posiciones
        for i, driver in enumerate(driver_standings, 1):
            driver['position'] = i
        
        # Preparar standings de constructores
        constructor_standings = []
        for constructor_name, stats in constructor_stats.items():
            constructor_standings.append({
                'constructor_name': constructor_name,
                'points': stats['points'],
                'wins': stats['wins'],
                'position': 0
            })
        
        # Ordenar constructores por puntos
        constructor_standings.sort(key=lambda x: (-x['points'], -x['wins']))
        
        # Asignar posiciones
        for i, constructor in enumerate(constructor_standings, 1):
            constructor['position'] = i
        
        # Determinar campeones
        champion_driver = driver_standings[0]['driver_name'] if driver_standings else "TBD"
        champion_constructor = constructor_standings[0]['constructor_name'] if constructor_standings else "TBD"
        
        if driver_standings:
            print(f"\nCampeón Pilotos: {champion_driver} - {driver_standings[0]['points']} pts")
        if constructor_standings:
            print(f"Campeón Constructores: {champion_constructor} - {constructor_standings[0]['points']} pts")
        
        if driver_standings:
            print(f"\nTop 3 Pilotos:")
            for i, driver in enumerate(driver_standings[:3], 1):
                print(f"  {i}. {driver['driver_name']} ({driver['team']}) - {driver['points']} pts, {driver['wins']} victorias")
        
        # Actualizar el campeonato en la base de datos
        await db.championships.update_one(
            {"_id": championship["_id"]},
            {
                "$set": {
                    "driver_standings": driver_standings,
                    "constructor_standings": constructor_standings,
                    "champion_driver": champion_driver,
                    "champion_constructor": champion_constructor,
                    "completed_races": races_with_results,
                    "total_races": len(races)
                }
            }
        )
        
        print(f"\n✅ Campeonato {year} actualizado correctamente")
    
    client.close()
    print(f"\n{'='*60}")
    print("✅ Todos los campeonatos recalculados correctamente")
    print(f"{'='*60}")

if __name__ == "__main__":
    asyncio.run(recalculate_championships())
