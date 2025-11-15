"""
Script para mapear los driver_id de OpenF1 con los ergast_id de Ergast API
y agregar biografías e información adicional a los pilotos
"""
from pymongo import MongoClient

# Mapeo manual de driver_number a ergast_id
DRIVER_ERGAST_MAPPING = {
    # Red Bull Racing
    1: "max_verstappen",
    11: "perez",
    
    # Mercedes
    63: "russell",
    44: "hamilton",
    
    # Ferrari
    16: "leclerc",
    55: "sainz",
    
    # McLaren
    4: "norris",
    81: "piastri",
    
    # Aston Martin
    14: "alonso",
    18: "stroll",
    
    # Alpine
    10: "gasly",
    31: "ocon",
    
    # Williams
    23: "albon",
    2: "sargeant",
    
    # AlphaTauri/RB
    3: "ricciardo",
    22: "tsunoda",
    
    # Alfa Romeo/Sauber
    77: "bottas",
    24: "zhou",
    
    # Haas
    20: "kevin_magnussen",
    27: "hulkenberg",
}

# Biografías en español (breves)
DRIVER_BIOGRAPHIES = {
    1: "Max Verstappen es un piloto neerlandés de Fórmula 1 que compite para Red Bull Racing. Hijo del expiloto de F1 Jos Verstappen, Max es el campeón más joven de la historia y uno de los pilotos más dominantes de la era moderna, ganando múltiples campeonatos consecutivos desde 2021.",
    
    44: "Lewis Hamilton es un piloto británico considerado uno de los mejores de todos los tiempos. Con 7 campeonatos mundiales (empatado con Michael Schumacher), Hamilton ha sido una fuerza dominante en la F1 durante más de una década con Mercedes.",
    
    14: "Fernando Alonso es un piloto español bicampeón del mundo (2005, 2006) con Renault. Conocido por su increíble habilidad al volante y longevidad en el deporte, continúa compitiendo a alto nivel con Aston Martin.",
    
    16: "Charles Leclerc es un piloto monegasco que compite para Ferrari. Considerado uno de los talentos más prometedores de su generación, ha demostrado velocidad excepcional y habilidades de calificación.",
    
    4: "Lando Norris es un piloto británico que compite para McLaren. Conocido por su velocidad, personalidad carismática y habilidades en streaming, se ha establecido como uno de los pilotos jóvenes más talentosos de la parrilla.",
    
    11: "Sergio 'Checo' Pérez es un piloto mexicano que compite para Red Bull Racing. Conocido por su habilidad para cuidar los neumáticos y sus overtakes espectaculares, es fundamental para las estrategias de equipo de Red Bull.",
    
    63: "George Russell es un piloto británico que compite para Mercedes. Después de impresionar en Williams, se unió a Mercedes en 2022 y rápidamente demostró su velocidad y capacidad de luchar por victorias.",
    
    55: "Carlos Sainz es un piloto español que compite para Ferrari. Hijo del legendario piloto de rally Carlos Sainz Sr., ha demostrado consistencia y velocidad a lo largo de su carrera en F1.",
    
    81: "Oscar Piastri es un piloto australiano que compite para McLaren. Campeón de F3 y F2 en años consecutivos, llegó a la F1 en 2023 tras una controversial transferencia desde Alpine y rápidamente demostró su talento ganando su primera carrera.",
    
    18: "Lance Stroll es un piloto canadiense que compite para Aston Martin. Hijo del empresario Lawrence Stroll, ha logrado varios podios en su carrera y fue campeón de F3 Europea en 2016 antes de llegar a la F1.",
    
    10: "Pierre Gasly es un piloto francés que compite para Alpine. Después de ganar su primera carrera con AlphaTauri en Monza 2020, se ha consolidado como un piloto rápido y consistente en la parrilla.",
    
    31: "Esteban Ocon es un piloto francés que compite para Alpine. Ganador del caótico GP de Hungría 2021, es conocido por su estilo agresivo y su capacidad para extraer el máximo de su monoplaza.",
    
    23: "Alexander Albon es un piloto tailandés-británico que compite para Williams. Después de su paso por Red Bull, regresó a la F1 con Williams en 2022 y ha sido clave en el resurgimiento del equipo.",
    
    2: "Logan Sargeant es un piloto estadounidense que compitió para Williams. Primer piloto estadounidense de tiempo completo en F1 desde Scott Speed, su carrera en la máxima categoría fue breve pero marcó un hito para el automovilismo estadounidense.",
    
    3: "Daniel Ricciardo es un piloto australiano conocido por su sonrisa característica y adelantamientos audaces. Ganador de 8 Grandes Premios, es uno de los pilotos más carismáticos de la parrilla y regresó a la F1 con AlphaTauri/RB en 2023.",
    
    22: "Yuki Tsunoda es un piloto japonés que compite para RB (AlphaTauri). Conocido por su agresividad al volante y sus intensas comunicaciones por radio, es el piloto japonés más competitivo en la F1 actual.",
    
    77: "Valtteri Bottas es un piloto finlandés que compite para Sauber. Ganador de 10 Grandes Premios con Mercedes como compañero de Hamilton, es conocido por su velocidad en calificación y su amor por el ciclismo.",
    
    24: "Zhou Guanyu es un piloto chino que compite para Sauber. Primer piloto chino de tiempo completo en F1, llegó a la máxima categoría tras una exitosa carrera en F2 y representa un mercado importante para el deporte.",
    
    20: "Kevin Magnussen es un piloto danés que compite para Haas. Conocido por su estilo agresivo y defensivo, logró un podio en su debut en F1 y es respetado por su habilidad en batallas rueda a rueda.",
    
    27: "Nico Hülkenberg es un piloto alemán que compite para Haas. Conocido como el piloto con más carreras sin podio antes de lograrlo, ha demostrado consistencia y velocidad a lo largo de una extensa carrera en F1.",
    
    40: "Liam Lawson es un piloto neozelandés que compite para RB. Después de impresionar en sus apariciones como sustituto en 2023, consiguió un asiento de tiempo completo y se ha mostrado como un talento prometedor.",
    
    43: "Franco Colapinto es un piloto argentino que debutó con Williams en 2024. Primer piloto argentino en F1 desde Gastón Mazzacane, llegó a la máxima categoría tras destacar en F2 y generó gran entusiasmo en Latinoamérica.",
    
    61: "Jack Doohan es un piloto australiano que compite para Alpine. Hijo del legendario motociclista Mick Doohan, llegó a F1 en 2024 tras una sólida carrera en las categorías inferiores.",
    
    38: "Oliver Bearman es un piloto británico que debutó con Ferrari como sustituto en 2024. Miembro de la academia de Ferrari, impresionó al anotar puntos en su primera carrera reemplazando a Carlos Sainz.",
}

# Datos curiosos en español
INTERESTING_FACTS = {
    1: [
        "Debutó en F1 con solo 17 años, siendo el piloto más joven en hacerlo",
        "Su primera victoria llegó a los 18 años en el GP de España 2016",
        "Tiene su propio circuito virtual y es fanático de las carreras sim racing",
        "Su padre Jos Verstappen también fue piloto de F1"
    ],
    44: [
        "Primer y único piloto negro en la historia de la F1",
        "Es vegano desde 2017 y aboga por causas medioambientales",
        "Ha ganado más de 100 Grandes Premios en su carrera",
        "Posee su propia marca de moda y ha asistido a la Met Gala",
        "Fue nombrado Caballero por la Reina Isabel II en 2021"
    ],
    14: [
        "Es el piloto más experimentado en la historia de la F1 con más de 380 carreras",
        "Ganó sus dos campeonatos con Renault siendo el campeón más joven en ese momento",
        "Es embajador de UNICEF",
        "Ha competido en las 24 Horas de Le Mans y ganó en 2018 y 2019",
        "Conocido por su radio team incisivo y memorable"
    ],
    16: [
        "Creció en el Principado de Mónaco, como Ayrton Senna",
        "Su ídolo era Jules Bianchi, quien fue su mentor antes de fallecer",
        "Ganó los campeonatos de F2 y GP3 en su primera temporada",
        "Toca el piano en su tiempo libre",
        "Su número de carrera #16 es en honor a Jules Bianchi"
    ],
    4: [
        "Es un streamer popular en Twitch fuera de la F1",
        "Compite regularmente en carreras virtuales",
        "Debutó en F1 a los 19 años con McLaren",
        "Es conocido por su sentido del humor en las redes sociales",
        "Tiene una gran amistad con Carlos Sainz desde sus días como compañeros de equipo"
    ],
    11: [
        "Primer piloto mexicano en ganar un GP desde 1970 (Pedro Rodríguez)",
        "Conocido como el 'Ministro de Defensa' por sus habilidades defensivas",
        "Salvó a Force India/Racing Point de la bancarrota en 2018",
        "Es embajador de varias marcas mexicanas",
        "Su apodo 'Checo' viene de 'Sergio' en diminutivo mexicano"
    ],
    81: [
        "Ganó F3 en 2021 y F2 en 2022 en años consecutivos",
        "Fue el centro de una controversia de contratos entre Alpine y McLaren",
        "Su primera victoria llegó en el GP de Azerbaiyán 2024",
        "Es conocido por su estilo de pilotaje suave y eficiente",
        "Comparte pasión por el golf con su compañero Lando Norris"
    ],
    10: [
        "Ganó el GP de Italia 2020 con AlphaTauri tras una carrera caótica",
        "Fue compañero de equipo de Max Verstappen en Red Bull en 2019",
        "Es amigo cercano de Charles Leclerc desde el karting",
        "Fue campeón de GP2 en 2016",
        "Conocido por su mentalidad resiliente tras su paso difícil en Red Bull"
    ],
    31: [
        "Creció en circunstancias humildes y fue apoyado por Mercedes en categorías menores",
        "Ganó el caótico GP de Hungría 2021 con Alpine",
        "Fue compañero de equipo de Sergio Pérez en Force India",
        "Es conocido por su pilotaje agresivo y batallas intensas",
        "Tiene una rivalidad histórica con Fernando Alonso desde su tiempo juntos en Alpine"
    ],
    23: [
        "Nació en Londres pero compite bajo licencia tailandesa",
        "Fue piloto de Red Bull Racing en 2019-2020",
        "Pasó un año fuera de F1 como piloto reserva antes de regresar con Williams",
        "Es conocido por su feedback técnico detallado",
        "Tiene una gran habilidad en condiciones mixtas y lluvia"
    ],
    3: [
        "Famoso por su celebración 'shoey' (beber champagne de su bota)",
        "Apodado 'Honey Badger' por su estilo agresivo",
        "Ganó 7 de sus 8 carreras con Red Bull Racing",
        "Su sonrisa y personalidad lo han hecho uno de los favoritos de los fans",
        "Protagonizó la serie de Netflix 'Drive to Survive' en varios episodios memorables"
    ],
    22: [
        "El piloto japonés más joven en debutar en F1",
        "Conocido por sus intensas y emocionales comunicaciones por radio",
        "Es muy bajo de estatura (1.59m) pero muy agresivo al volante",
        "Fue parte de la academia de pilotos de Honda",
        "Apodado 'Tsunami Tsunoda' por su estilo impetuoso"
    ],
    77: [
        "Apodado 'Porridge' por sus desayunos tradicionales finlandeses",
        "Casado con la ciclista profesional Tiffany Cromwell",
        "Logró 20 pole positions con Mercedes",
        "Es conocido por su pasión extrema por el ciclismo",
        "Tiene un alter ego en redes llamado 'Valtteri Bottas 2.0'"
    ],
    20: [
        "Logró un podio en su debut en F1 en Australia 2014",
        "Es conocido por su estilo de pilotaje agresivo y defensivo",
        "Padre de una niña, comparte frecuentemente momentos familiares",
        "Fue sancionado varias veces por maniobras defensivas límite",
        "Regresó a Haas en 2022 tras un año sabático"
    ],
    27: [
        "Tiene el récord de más carreras antes de lograr su primer podio (181)",
        "Apodado 'Hulk' por su apellido y complexión física",
        "Ganador de las 24 Horas de Le Mans 2015",
        "Fue piloto reserva de Aston Martin antes de regresar full-time",
        "Conocido por sus calificaciones sólidas y consistencia"
    ],
    55: [
        "Su padre Carlos Sainz Sr. es bicampeón del Mundial de Rally",
        "Compañero de equipo de Lando Norris en McLaren (2019-2020)",
        "Logró su primera victoria en el GP de Gran Bretaña 2022",
        "Conocido como 'Smooth Operator' por su estilo de pilotaje",
        "Fichó por Ferrari para 2021-2024 antes de unirse a Williams"
    ],
    63: [
        "Ganó el campeonato de GP3 y F2 en años consecutivos",
        "Es el primer británico en ganar para Mercedes desde Lewis Hamilton",
        "Fue piloto de desarrollo de Mercedes durante años antes de su debut",
        "Conocido por su profesionalismo y presentaciones de PowerPoint al equipo",
        "Su primera victoria llegó en Brasil 2022 en condiciones difíciles"
    ],
}

def add_ergast_and_info():
    """Agregar ergast_id, biografías y datos curiosos a pilotos"""
    import os
    # Use mongo hostname when running in Docker, localhost otherwise
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    if "mongo" not in mongo_uri and os.path.exists("/.dockerenv"):
        mongo_uri = "mongodb://mongo:27017/"
    
    client = MongoClient(mongo_uri)
    db = client.racestats  # Base de datos correcta
    drivers_collection = db.drivers
    
    updated_count = 0
    
    for driver_number, ergast_id in DRIVER_ERGAST_MAPPING.items():
        update_data = {"ergast_id": ergast_id}
        
        # Agregar biografía si existe
        if driver_number in DRIVER_BIOGRAPHIES:
            update_data["biography"] = DRIVER_BIOGRAPHIES[driver_number]
        
        # Agregar datos curiosos si existen
        if driver_number in INTERESTING_FACTS:
            update_data["interesting_facts"] = INTERESTING_FACTS[driver_number]
        
        # Buscar por driver_id (que es el número del piloto en OpenF1)
        result = drivers_collection.update_one(
            {"driver_id": driver_number},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            updated_count += 1
            print(f"✅ Actualizado piloto #{driver_number} con ergast_id: {ergast_id}")
    
    print(f"\n📊 Total pilotos actualizados: {updated_count}")
    client.close()

if __name__ == "__main__":
    print("🔧 Agregando ergast_id, biografías y datos curiosos a pilotos...\n")
    add_ergast_and_info()
    print("\n✅ Proceso completado")
