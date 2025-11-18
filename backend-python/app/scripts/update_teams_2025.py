"""
Script para limpiar equipos obsoletos y actualizar con equipos 2025
Equipos F1 2025:
1. Red Bull Racing
2. Mercedes
3. Ferrari
4. McLaren
5. Aston Martin
6. Alpine
7. Williams
8. Haas F1 Team
9. Sauber (Kick Sauber/Stake F1)
10. RB (Racing Bulls)
"""
from pymongo import MongoClient
import os

# Equipos obsoletos a eliminar
TEAMS_TO_DELETE = [
    "alfa_romeo",      # Ya no existe, ahora es Kick Sauber/Stake
    "alphatauri",      # Renombrado a RB
    "racing_bulls",    # Duplicado, usar solo 'rb'
]

# Datos completos y actualizados de equipos 2025
TEAMS_2025_DATA = {
    "red_bull_racing": {
        "country_code": "at",
        "founded_year": 2005,
        "constructors_championships": 6,  # 2010-2013, 2022-2023
        "drivers_championships": 7,  # Vettel 4x, Verstappen 3x
        "total_wins": 118,  # Actualizado a finales 2024
        "total_podiums": 272,
        "history": "Red Bull Racing fue fundado en 2005 cuando la empresa de bebidas energéticas Red Bull compró el equipo Jaguar Racing. Bajo la dirección técnica de Adrian Newey, el equipo dominó la era de los motores V8 con Sebastian Vettel ganando cuatro campeonatos consecutivos (2010-2013). Tras años de desarrollo, regresaron a la cima con Max Verstappen, quien comenzó una nueva era de dominación desde 2021, ganando tres campeonatos consecutivos con récords históricos. El equipo es conocido por su innovación técnica, estrategias agresivas y por desarrollar jóvenes talentos a través de su academia de pilotos.",
        "sponsors": ["Oracle", "Honda RBPT", "AT&T", "Bybit", "Puma", "Rauch"],
        "legendary_drivers": ["Sebastian Vettel", "Max Verstappen", "Mark Webber", "Daniel Ricciardo", "David Coulthard"],
        "interesting_facts": [
            "Max Verstappen ganó 19 de 22 carreras en 2023, un récord histórico",
            "Adrian Newey es considerado el mejor diseñador de F1 de todos los tiempos",
            "Red Bull también tiene un equipo de Fórmula E y equipos en motociclismo",
            "La sede está en Milton Keynes, Reino Unido, en las antiguas instalaciones de Jaguar"
        ]
    },
    "mercedes": {
        "country_code": "de",
        "founded_year": 2010,
        "constructors_championships": 8,  # 2014-2021 (récord consecutivo)
        "drivers_championships": 9,  # Hamilton 7x, Rosberg 1x
        "total_wins": 125,
        "total_podiums": 297,
        "history": "Mercedes-AMG Petronas Formula One Team fue establecido en 2010 cuando Mercedes-Benz compró Brawn GP (campeón en 2009). El equipo creó la dinastía más dominante en la historia moderna de la F1, ganando ocho campeonatos de constructores consecutivos (2014-2021) durante la era híbrida turbo. Lewis Hamilton ganó seis de sus siete títulos con Mercedes, estableciendo múltiples récords. Dirigido por Toto Wolff y con tecnología de punta en Brackley, Inglaterra, Mercedes estableció nuevos estándares de excelencia. Aunque perdieron la hegemonía en 2022-2023, siguen siendo un equipo de élite buscando recuperar el campeonato.",
        "sponsors": ["Petronas", "IWC", "AMD", "Crowdstrike", "Tommy Hilfiger", "Monster Energy", "Epson"],
        "legendary_drivers": ["Lewis Hamilton", "Nico Rosberg", "Michael Schumacher", "Valtteri Bottas", "George Russell"],
        "interesting_facts": [
            "Ganaron 8 campeonatos consecutivos de constructores (2014-2021), récord absoluto",
            "Lewis Hamilton tiene más victorias (84) con Mercedes que ningún piloto con un solo equipo",
            "El color plateado 'Flecha de Plata' es icónico desde los años 30",
            "En 2020 corrieron con un monoplaza negro en apoyo al movimiento Black Lives Matter"
        ]
    },
    "ferrari": {
        "country_code": "it",
        "founded_year": 1950,
        "constructors_championships": 16,  # Último en 2008
        "drivers_championships": 15,  # Último Räikkönen 2007
        "total_wins": 245,  # Más victorias en la historia
        "total_podiums": 808,  # Más podios en la historia
        "history": "Scuderia Ferrari es el equipo más antiguo, exitoso e icónico de la Fórmula 1, compitiendo desde la primera temporada en 1950. Fundado por Enzo Ferrari, el equipo es sinónimo de pasión italiana y excelencia en el automovilismo. Con 16 campeonatos de constructores y 15 de pilotos, Ferrari ha visto pasar leyendas como Michael Schumacher (5 títulos consecutivos 2000-2004), Juan Manuel Fangio, Niki Lauda y Alberto Ascari. El 'Cavallino Rampante' (caballo rampante) es el símbolo más reconocido del automovilismo. A pesar de años sin campeonatos desde 2008, Ferrari mantiene una base de fans apasionada mundial, especialmente en Monza, su casa espiritual.",
        "sponsors": ["Shell", "Santander", "Ray-Ban", "Puma", "HP", "Aramco", "UNiCREDIT"],
        "legendary_drivers": ["Michael Schumacher", "Niki Lauda", "Alberto Ascari", "Juan Manuel Fangio", "Kimi Räikkönen", "Fernando Alonso", "Felipe Massa", "Gilles Villeneuve"],
        "interesting_facts": [
            "Único equipo que ha participado en todas las temporadas de F1 desde 1950",
            "El rojo 'Rosso Corsa' es el color de carreras tradicional de Italia",
            "Tienen derecho de veto sobre cambios reglamentarios por su importancia histórica",
            "Fiorano, su circuito de pruebas privado, es donde se desarrollan los monoplazas",
            "Enzo Ferrari decía: 'Las carreras se ganan los domingos, pero se pierden en la fábrica'"
        ]
    },
    "mclaren": {
        "country_code": "gb",
        "founded_year": 1963,
        "constructors_championships": 8,  # Último en 1998
        "drivers_championships": 12,  # Último Hamilton 2008
        "total_wins": 184,
        "total_podiums": 499,
        "history": "McLaren Racing fue fundado por el piloto neozelandés Bruce McLaren en 1963. El equipo vivió su época dorada en los años 80 y 90 con la dupla McLaren-Honda, ganando campeonatos con pilotos legendarios como Ayrton Senna, Alain Prost y Mika Häkkinen. McLaren es sinónimo de innovación técnica y excelencia operativa. Después de una difícil era con motores Honda propios (2015-2017) y años complicados, el equipo ha experimentado un fuerte resurgimiento desde 2019, volviendo a ganar carreras en 2021 y luchando por victorias regularmente desde 2023. El icónico color naranja 'papaya' fue restaurado en 2017, conectando con la herencia de Bruce McLaren.",
        "sponsors": ["Google Android", "Cisco", "Dell Technologies", "OKX", "Coca-Cola", "BAT"],
        "legendary_drivers": ["Ayrton Senna", "Alain Prost", "Mika Häkkinen", "Lewis Hamilton", "Niki Lauda", "James Hunt", "Lando Norris"],
        "interesting_facts": [
            "Bruce McLaren murió probando un coche deportivo en 1970 a los 32 años",
            "El McLaren MP4/4 de 1988 ganó 15 de 16 carreras, el dominio más absoluto de la historia",
            "Ron Dennis transformó el equipo en los 80 con su obsesión por la perfección",
            "También compiten en IndyCar donde ganaron las 500 Millas de Indianápolis en 2024",
            "El McLaren Technology Centre en Woking es una obra maestra arquitectónica"
        ]
    },
    "aston_martin": {
        "country_code": "gb",
        "founded_year": 2021,
        "constructors_championships": 0,
        "drivers_championships": 0,
        "total_wins": 1,  # Vettel Hungría 2021 como Aston Martin
        "total_podiums": 19,  # Como Aston Martin
        "history": "Aston Martin Aramco F1 Team representa el regreso de la icónica marca británica a la F1 como constructor, tras sus apariciones esporádicas en los años 50-60. El equipo es la evolución de Racing Point/Force India, adquirido por el empresario canadiense Lawrence Stroll en 2018. Con inversiones masivas incluyendo una nueva fábrica de última generación, túnel de viento y el fichaje de Fernando Alonso en 2023, Aston Martin busca convertirse en contendiente por campeonatos. El verde británico de carreras ha vuelto a la parrilla, y con Adrian Newey fichado para 2025, las ambiciones son máximas. La asociación con Honda para motores desde 2026 marca una nueva era.",
        "sponsors": ["Aramco", "Cognizant", "Salesforce", "HSBC", "Peroni", "Santander"],
        "legendary_drivers": ["Fernando Alonso", "Sebastian Vettel", "Sergio Pérez (como Racing Point)", "Lance Stroll"],
        "interesting_facts": [
            "Adrian Newey, el mejor diseñador de F1, se unió al equipo en 2024",
            "Lawrence Stroll es coleccionista de Ferraris clásicos y dueño de Aston Martin Lagonda",
            "La nueva fábrica en Silverstone costó más de £200 millones",
            "James Bond conduce Aston Martin en las películas, dando visibilidad global a la marca",
            "Desde 2026 usarán motores Honda works, la misma asociación que dominó con McLaren"
        ]
    },
    "alpine": {
        "country_code": "fr",
        "founded_year": 2021,
        "constructors_championships": 2,  # Como Renault: 2005-2006
        "drivers_championships": 2,  # Alonso 2005-2006
        "total_wins": 35,  # Como Renault
        "total_podiums": 169,
        "history": "BWT Alpine F1 Team es la reencarnación deportiva de Renault en F1, usando la marca Alpine desde 2021. El equipo Renault tiene una historia gloriosa: campeones con Fernando Alonso (2005-2006) y proveedor de motores para Red Bull durante su era dorada (2010-2013). La base en Enstone, Inglaterra, ha visto pasar a múltiples campeones desde los días de Benetton (campeones con Schumacher en 1994-95). Como Alpine, el equipo representa las aspiraciones deportivas francesas y busca desarrollar talento local. Aunque han luchado por consistencia, siguen siendo un equipo histórico con infraestructura de élite y ambiciones de volver al frente.",
        "sponsors": ["BWT", "Castrol", "Google", "Hugo Boss", "DP World"],
        "legendary_drivers": ["Fernando Alonso", "Alain Prost", "René Arnoux", "Esteban Ocon", "Pierre Gasly"],
        "interesting_facts": [
            "Renault fue el primer equipo en usar motores turbo en F1 (1977)",
            "La academia de pilotos ha producido talentos como Piastri, aunque se fue a McLaren",
            "El nombre Alpine viene de la legendaria marca francesa de autos deportivos",
            "Han ganado más campeonatos como proveedor de motores (12) que como equipo (2)",
            "Carlos Ghosn rescató al equipo cuando lo compró a Benetton en 2000"
        ]
    },
    "williams": {
        "country_code": "gb",
        "founded_year": 1977,
        "constructors_championships": 9,  # Último en 1997
        "drivers_championships": 7,  # Último Villeneuve 1997
        "total_wins": 114,
        "total_podiums": 313,
        "history": "Williams Racing es uno de los equipos más exitosos y respetados en la historia de la F1. Fundado por Sir Frank Williams y el ingeniero Patrick Head, el equipo dominó en los años 80 y 90 ganando 9 campeonatos de constructores y 7 de pilotos con leyendas como Nelson Piquet, Nigel Mansell, Alain Prost, Damon Hill y Jacques Villeneuve. Pioneros en tecnología (suspensión activa, dirección asistida), Williams fue sinónimo de innovación. Después de décadas difíciles y la venta a Dorilton Capital en 2020, el equipo está en reconstrucción. El fallecimiento de Sir Frank en 2021 marcó el fin de una era, pero su legado perdura como símbolo de determinación y excelencia independiente.",
        "sponsors": ["Duracell", "Kraken", "Gulf Oil", "Sofina Foods", "Ezen"],
        "legendary_drivers": ["Nigel Mansell", "Alain Prost", "Damon Hill", "Nelson Piquet", "Jacques Villeneuve", "Ayrton Senna", "Juan Pablo Montoya"],
        "interesting_facts": [
            "Sir Frank Williams dirigió el equipo desde una silla de ruedas tras un accidente en 1986",
            "Ayrton Senna murió al volante de un Williams en Imola 1994, el fin de semana más trágico de la F1",
            "El FW14B de 1992 es considerado uno de los mejores monoplazas de todos los tiempos",
            "Fueron el último equipo independiente antes de ser vendidos en 2020",
            "La familia Williams mantuvo el control durante 43 años, un récord de longevidad"
        ]
    },
    "haas_f1_team": {
        "country_code": "us",
        "founded_year": 2016,
        "constructors_championships": 0,
        "drivers_championships": 0,
        "total_wins": 0,
        "total_podiums": 0,
        "history": "Haas F1 Team es el primer equipo estadounidense en competir en la Fórmula 1 desde 1986 (último fue Haas Lola). Fundado por Gene Haas, magnate de la industria de maquinaria CNC y dueño del equipo NASCAR Stewart-Haas Racing, el equipo debutó en 2016 con un modelo de negocio innovador: comprar componentes permitidos de Ferrari (motor, caja de cambios, suspensión) y asociarse con Dallara para el chasis. Esto les permitió ser competitivos inmediatamente, anotando puntos en su debut. Aunque han sufrido temporadas difíciles terminando últimos en 2021 y 2023, representan la ambición estadounidense en un deporte dominado por europeos. Con el crecimiento de la F1 en EE.UU., Haas busca consolidarse.",
        "sponsors": ["MoneyGram", "Alpinestars", "Workday", "Tata Communications"],
        "legendary_drivers": ["Romain Grosjean", "Kevin Magnussen", "Nico Hülkenberg"],
        "interesting_facts": [
            "Su sede está en Kannapolis, Carolina del Norte, EE.UU., única base fuera de Europa",
            "Gene Haas cumplió una condena de prisión por fraude fiscal antes de fundar el equipo",
            "Romain Grosjean sobrevivió milagrosamente a un accidente en llamas en Baréin 2020",
            "Son el equipo con menos presupuesto y personal de toda la parrilla",
            "Nikita Mazepin fue despedido en 2022 tras la invasión rusa a Ucrania"
        ]
    },
    "kick_sauber": {
        "country_code": "ch",
        "founded_year": 1993,
        "constructors_championships": 0,
        "drivers_championships": 0,
        "total_wins": 1,  # Kubica Canadá 2008 como BMW Sauber
        "total_podiums": 26,
        "history": "Stake F1 Team Kick Sauber es la encarnación actual del histórico equipo suizo Sauber, fundado por Peter Sauber en 1993. El equipo ha operado bajo varios nombres: Sauber (1993-2005, 2010-2018), BMW Sauber (2006-2009, su mejor era terminando 2° en 2007), Alfa Romeo Racing (2019-2023) y actualmente Stake F1 Team Kick Sauber. A pesar de nunca ganar un campeonato, Sauber es respetado como cantera de talentos: Räikkönen, Massa, Vettel, Leclerc, Pérez y Zhou comenzaron aquí. En 2026, Audi asumirá el control total renombrándolo Audi F1 Team, marcando el regreso de la marca alemana a la F1. La base en Hinwil, Suiza, ha sido el hogar del equipo desde su fundación.",
        "sponsors": ["Stake", "Kick", "Puma", "C4 Energy"],
        "legendary_drivers": ["Kimi Räikkönen", "Sebastian Vettel", "Charles Leclerc", "Robert Kubica", "Felipe Massa", "Sergio Pérez"],
        "interesting_facts": [
            "Audi comprará el equipo en 2026, marcando su debut en F1",
            "Peter Sauber vendió el equipo pero siguió involucrado hasta 2016",
            "Robert Kubica sufrió un grave accidente de rally en 2011 que casi le cuesta el brazo",
            "Kimi Räikkönen debutó aquí en 2001 con solo 23 carreras de monoplazas previas",
            "El equipo ha sobrevivido múltiples crisis financieras y cambios de dueños"
        ]
    },
    "rb": {
        "country_code": "it",
        "founded_year": 2006,  # Como Toro Rosso
        "constructors_championships": 0,
        "drivers_championships": 0,
        "total_wins": 2,  # Vettel 2008, Gasly 2020
        "total_podiums": 4,
        "history": "Visa Cash App RB Formula One Team, conocido como RB o VCARB, es el equipo hermano de Red Bull Racing. Fundado en 2006 cuando Red Bull compró Minardi, ha operado como Scuderia Toro Rosso (2006-2019), AlphaTauri (2020-2023) y RB desde 2024. Su misión principal es desarrollar jóvenes pilotos de la Red Bull Junior Team antes de promoverlos al equipo principal. A pesar de ser considerado 'equipo B', ha logrado victorias memorables: Sebastian Vettel en Monza 2008 (siendo el ganador más joven de la historia en ese momento) y Pierre Gasly en Monza 2020 bajo lluvia. Con base en Faenza, Italia (antiguas instalaciones de Minardi), el equipo ha sido trampolín para Vettel, Ricciardo, Verstappen, Sainz y otros campeones.",
        "sponsors": ["Visa Cash App", "Hugo Boss", "Red Bull"],
        "legendary_drivers": ["Sebastian Vettel", "Max Verstappen", "Daniel Ricciardo", "Pierre Gasly", "Carlos Sainz Jr.", "Yuki Tsunoda"],
        "interesting_facts": [
            "Vettel ganó su primera carrera aquí a los 21 años, récord vigente hasta 2016",
            "Max Verstappen debutó en F1 con ellos a los 17 años, el más joven de la historia",
            "El nombre cambió 3 veces en 18 años: Toro Rosso → AlphaTauri → RB",
            "Gasly lloró en el podio de Monza 2020, dedicando la victoria a Anthoine Hubert",
            "Fabrizio Barbazza fue su único piloto italiano en 18 años hasta 2006"
        ]
    }
}

def update_teams_2025():
    """Limpiar equipos obsoletos y actualizar datos 2025"""
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    if "mongo" not in mongo_uri and os.path.exists("/.dockerenv"):
        mongo_uri = "mongodb://mongo:27017/"
    
    client = MongoClient(mongo_uri)
    db = client.racestats
    teams_collection = db.teams
    
    # Eliminar equipos obsoletos
    print("🗑️  Eliminando equipos obsoletos...")
    for team_id in TEAMS_TO_DELETE:
        result = teams_collection.delete_one({"team_id": team_id})
        if result.deleted_count > 0:
            print(f"   ❌ Eliminado: {team_id}")
    
    print("\n📝 Actualizando equipos 2025...")
    updated_count = 0
    
    for team_id, team_data in TEAMS_2025_DATA.items():
        result = teams_collection.update_one(
            {"team_id": team_id},
            {"$set": team_data}
        )
        
        if result.modified_count > 0 or result.matched_count > 0:
            updated_count += 1
            print(f"   ✅ {team_id}")
        else:
            print(f"   ⚠️  No encontrado: {team_id}")
    
    print(f"\n📊 Total equipos actualizados: {updated_count}/{len(TEAMS_2025_DATA)}")
    print(f"📊 Equipos eliminados: {len(TEAMS_TO_DELETE)}")
    
    # Mostrar resumen final
    final_teams = list(teams_collection.find({}, {'team_id': 1, 'name': 1}).sort('name', 1))
    print(f"\n🏁 Equipos F1 2025 en base de datos: {len(final_teams)}")
    for team in final_teams:
        print(f"   - {team.get('name', 'N/A')}")
    
    client.close()

if __name__ == "__main__":
    print("🔧 Actualizando equipos para temporada 2025...\n")
    update_teams_2025()
    print("\n✅ Proceso completado")
