"""
Script para agregar logos a los equipos
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from resources.db_mongo import init_mongo, get_collection

# URLs de logos de equipos F1 (OpenF1 o fuentes oficiales)
TEAM_LOGOS = {
    "Red Bull Racing": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing-logo.png",
    "Ferrari": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/ferrari-logo.png",
    "Mercedes": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mercedes-logo.png",
    "McLaren": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mclaren-logo.png",
    "Aston Martin": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/aston-martin-logo.png",
    "Alpine": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/alpine-logo.png",
    "Williams": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/williams-logo.png",
    "RB": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb-logo.png",
    "Racing Bulls": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb-logo.png",
    "Kick Sauber": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/stake-f1-team-kick-sauber-logo.png",
    "Haas F1 Team": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team-logo.png",
    "Alfa Romeo": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2023/alfa-romeo-logo.png",
    "AlphaTauri": "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2023/alphatauri-logo.png",
}

def add_team_logos():
    """Agrega logos a los equipos en MongoDB"""
    init_mongo()
    teams_collection = get_collection("teams")
    
    updated = 0
    not_found = 0
    
    for team_name, logo_url in TEAM_LOGOS.items():
        # Buscar equipo por nombre
        team = teams_collection.find_one({"name": team_name})
        
        if team:
            # Actualizar con el logo
            teams_collection.update_one(
                {"_id": team["_id"]},
                {"$set": {"logo": logo_url}}
            )
            updated += 1
            print(f"✅ Logo agregado: {team_name}")
        else:
            not_found += 1
            print(f"⚠️ Equipo no encontrado: {team_name}")
    
    print(f"\n📊 Resumen:")
    print(f"   Logos agregados: {updated}")
    print(f"   Equipos no encontrados: {not_found}")
    
    # Listar todos los equipos
    all_teams = list(teams_collection.find())
    print(f"\n🏎️ Equipos en la base de datos ({len(all_teams)}):")
    for team in all_teams:
        has_logo = "✅" if team.get("logo") else "❌"
        print(f"   {has_logo} {team.get('name', 'Sin nombre')}")

if __name__ == "__main__":
    add_team_logos()
