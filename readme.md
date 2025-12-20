# RaceStats 🏎️

Aplicación web completa para explorar, comparar y analizar datos de Fórmula 1. RaceStats proporciona estadísticas detalladas sobre pilotos, equipos, carreras, circuitos y coches, con datos enriquecidos de múltiples fuentes incluyendo la API oficial de F1, Ergast y OpenF1.

## 📑 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido-con-docker)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints Principales](#-endpoints-principales)
- [Desarrollo Local](#-desarrollo-local-opcional)
- [Arquitectura](#-arquitectura)
- [Solución de Problemas](#-solución-de-problemas)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características Principales

### 📊 Visualización de Datos
- **Pilotos**: Perfiles completos con biografías, estadísticas de carrera, últimas noticias y galerías de imágenes
- **Equipos**: Historia del equipo, logros, pilotos actuales, patrocinadores y datos técnicos
- **Carreras**: Resultados detallados de carreras, clasificaciones y análisis de rendimiento
- **Circuitos**: Información técnica, mapas de pista y estadísticas históricas
- **Coches**: Especificaciones técnicas completas (motor, chasis, aerodinámica)
- **Campeonatos**: Clasificaciones de pilotos y constructores en tiempo real con cálculo automático de puntos
- **Clima**: Pronósticos meteorológicos para próximas carreras con WeatherAPI

### 👤 Gestión de Usuarios
- **Autenticación**: Sistema completo de registro/inicio de sesión con hash seguro de contraseñas (bcrypt)
- **Favoritos**: Guarda tus pilotos, equipos, coches, carreras y circuitos favoritos
- **Comparaciones**: Compara hasta 4 pilotos con estadísticas visuales
- **Comparaciones Guardadas**: Almacena y recupera tus comparaciones favoritas de pilotos

### 📰 Contenido Enriquecido
- Noticias de F1 en tiempo real desde Formula1.com y RaceFans
- Galerías de imágenes desde Wikipedia y fuentes oficiales
- Curiosidades y logros de carrera
- Biografías completas de pilotos y equipos

### 🏆 Datos Temporada 2025
La aplicación incluye **resultados auténticos de la temporada 2025 de F1**:
- **Campeón de Pilotos**: Lando Norris (McLaren) - 423 puntos
- **Campeón de Constructores**: McLaren - 833 puntos
- Las 24 carreras con ganadores y podios reales
- Datos históricos de las temporadas 2023-2025

## � Capturas de Pantalla

> 💡 **Nota**: Para ver la aplicación en acción, ejecuta `docker compose up -d` y visita http://localhost:5173

### Características Destacadas

- **Dashboard Principal**: Vista general con countdown de próxima carrera y noticias
- **Perfiles de Pilotos**: Biografías completas con estadísticas, galerías y noticias
- **Comparador**: Compara hasta 4 pilotos lado a lado con gráficos
- **Favoritos**: Gestiona y accede rápidamente a tus pilotos/equipos favoritos
- **Clasificaciones**: Visualiza clasificaciones en tiempo real de campeonatos
- **Detalles de Carreras**: Resultados completos con podios y puntos

## �🛠️ Stack Tecnológico

### Frontend
- **React 18** con hooks modernos y context
- **Vite** para desarrollo rápido y builds optimizados
- **TailwindCSS** para estilos responsivos
- **React Router** para navegación
- **Axios** para comunicación con API

### Backend
- **FastAPI** (Python) - API principal con soporte async
- **Express.js** (Node.js) - Microservicio de web scraping
- **MongoDB** - Base de datos NoSQL para datos F1
- **PostgreSQL** - Base de datos SQL para gestión de usuarios
- **Motor** - Driver async de MongoDB
- **SQLAlchemy** - ORM de SQL

### Infraestructura
- **Docker & Docker Compose** - Contenedorización
- **Nginx** - API Gateway y reverse proxy
- **bcrypt** - Hash seguro de contraseñas
- **CORS** - Compartición de recursos entre orígenes

## 📋 Estructura del Proyecto

```
RaceStats/
├── api-gateway/            # API Gateway (proxy a FastAPI y Node)
│   ├── Dockerfile
│   ├── index.js            # Punto de entrada del gateway
│   └── package.json
├── backend-node/           # Backend Node.js (Express)
│   ├── Dockerfile
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── routes/
│   │   │   └── scrapingRoutes.js
│   │   └── services/
│   │       └── scrapingService.js  # Scraping de noticias
│   └── package.json
├── backend-python/         # Backend Python (FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py         # API principal con CORS y routers
│   │   ├── controllers/    # Controladores MongoDB y PostgreSQL
│   │   │   ├── mongo/      # Pilotos, equipos, carreras, etc.
│   │   │   └── sql/        # Usuarios, favoritos, comparaciones
│   │   ├── models_mongo/   # Modelos de datos MongoDB
│   │   ├── models_sql/     # Modelos SQLAlchemy (User, Favorite, Comparison)
│   │   ├── routes/         # Routers organizados por base de datos
│   │   │   ├── mongo/      # Endpoints de datos F1
│   │   │   └── sql/        # Endpoints de autenticación y usuarios
│   │   ├── schemas/        # Schemas Pydantic para validación
│   │   ├── services/       # Lógica de negocio y servicios externos
│   │   │   ├── ergast_service.py        # Integración Ergast API
│   │   │   ├── openf1_import_service.py # Importación OpenF1
│   │   │   ├── weather_service.py       # WeatherAPI
│   │   │   ├── mongo_services.py
│   │   │   └── sql_services.py
│   │   └── resources/
│   │       ├── db_mongo.py # Conexión MongoDB
│   │       └── db_sql.py   # Conexión PostgreSQL
│   └── cache/              # Cache para WeatherAPI
├── frontend/               # Frontend React + Vite + Tailwind v4
│   ├── Dockerfile
│   ├── src/
│   │   ├── App.jsx         # Routing principal con rutas protegidas
│   │   ├── main.jsx
│   │   ├── index.css       # Tailwind v4 imports
│   │   ├── api/
│   │   │   └── authApi.js  # Cliente API de autenticación
│   │   ├── components/
│   │   │   ├── F1News.jsx
│   │   │   ├── FavoriteButton.jsx      # Botón para añadir favoritos
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RaceCountdown.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── TeamNews.jsx
│   │   │   └── WeatherForecast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Context de autenticación
│   │   ├── hooks/
│   │   │   └── useCountdown.js
│   │   └── pages/
│   │       ├── Dashboard.jsx           # Página principal
│   │       ├── AuthPage.jsx            # Login/Register
│   │       ├── FavoritesPage.jsx       # Gestión de favoritos
│   │       ├── ComparisonsPage.jsx     # Comparador de pilotos
│   │       ├── ChampionshipDetailPage.jsx
│   │       ├── DriverDetailPage.jsx    # Con FavoriteButton
│   │       ├── TeamDetailPage.jsx      # Con FavoriteButton
│   │       ├── RaceDetailPage.jsx      # Con FavoriteButton
│   │       ├── DetailPages.jsx         # Circuit y Car con FavoriteButton
│   │       └── ...                     # Otras páginas de listados
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml      # Orquestación de 6 servicios
└── .gitignore
```

## 🚀 Inicio Rápido con Docker

### Requisitos Previos

- **Docker Desktop** (Windows/macOS) o **Docker Engine** (Linux)
  - [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Git** (para clonar el repositorio)
- **Mínimo 4GB RAM** disponible para contenedores
- **Puertos libres**: 5173, 8080, 8000, 3001, 27017, 5432

### Instalación

```powershell
# Clonar el repositorio
git clone https://github.com/tu-usuario/racestats.git
cd racestats
# Desde la raíz del proyecto
docker compose up --build -d

# Ver estado
docker compose ps

# Logs de un servicio (ejemplo frontend)
docker compose logs -f frontend

# Parar todo
docker compose down
```

### Servicios y URLs
- **Frontend (Vite)**: http://localhost:5173
  - Dashboard: http://localhost:5173/dashboard
  - Login: http://localhost:5173/login
  - Favoritos: http://localhost:5173/favorites
  - Comparador: http://localhost:5173/comparisons
- **API Gateway**: http://localhost:8080
- **FastAPI**: http://localhost:8000
  - Docs interactivos: http://localhost:8000/docs
  - OpenAPI JSON: http://localhost:8000/openapi.json
- **Backend Node**: http://localhost:3001
- **MongoDB**: localhost:27017 (expuesto al host)
  - Base de datos: `racestats`
  - Colecciones: drivers (50), teams (10), races (87), circuits (24), cars (39), championships (3), seasons
- **PostgreSQL**: localhost:5432 (expuesto al host)
  - Base de datos: `racestats`
  - Tablas: users, favorites, comparisons

## 📊 Datos Disponibles

### MongoDB - Datos de F1
- **Pilotos (50)**: Información completa desde OpenF1 y Ergast, enriquecida con Wikipedia
- **Equipos (10)**: Historia, logros, patrocinadores, noticias
- **Carreras (87)**: Resultados, clasificaciones, puntuación
- **Circuitos (24)**: Especificaciones técnicas, mapas de trazado
- **Coches (39)**: Especificaciones completas (motor, chasis, aerodinámica, peso, etc.)
- **Campeonatos (3)**: 2023, 2024, 2025 con clasificaciones completas
- **Temporadas**: Datos históricos desde 1950

### PostgreSQL - Datos de Usuarios
- **Users**: Sistema de autenticación con bcrypt
- **Favorites**: Relación usuario-entidad (driver/team/car/race/circuit)
- **Comparisons**: Comparaciones guardadas por usuario

### Rutas útiles
- Gateway health: GET http://localhost:8080/health
- Proxy a FastAPI: GET http://localhost:8080/api/python/
- Proxy a Node: GET http://localhost:8080/api/node/health
- FastAPI raíz: GET http://localhost:8000/
- Node health: GET http://localhost:3001/health
- Frontend login (SPA): http://localhost:5173/login

Notas de Compose
- Se eliminó la clave `version` (obsoleta) para evitar warnings.
- Para evitar incompatibilidades de binarios, `node_modules` se gestionan dentro de los contenedores (volúmenes anónimos), no en el host.
- El frontend ejecuta Vite con `--host 0.0.0.0` para exponer a `localhost`.

### Variables de Entorno

Definidas en `docker-compose.yml` (ya configuradas por defecto):

| Variable | Servicio | Valor por Defecto | Descripción |
|----------|----------|-------------------|-------------|
| `POSTGRES_USER` | PostgreSQL | `admin` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | PostgreSQL | `admin` | Contraseña de PostgreSQL |
| `POSTGRES_DB` | PostgreSQL | `racestats` | Base de datos PostgreSQL |
| `MONGO_URI` | FastAPI | `mongodb://mongo:27017/racestats` | Conexión a MongoDB |
| `FRONTEND_URL` | FastAPI | `http://localhost:5173` | URL del frontend para CORS |
| `VITE_API_URL` | Frontend | `http://localhost:8080` | URL del API Gateway |
| `WEATHER_API_KEY` | FastAPI | _(vacío)_ | API key de WeatherAPI (opcional) |

> 💡 **Tip**: Para producción, crea un archivo `.env` y modifica estas variables con valores seguros.

## 🏗️ Arquitectura

RaceStats utiliza una arquitectura de microservicios con separación clara de responsabilidades:

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  Frontend (React/Vite)  │  Puerto 5173
│  - SPA con React Router │
│  - TailwindCSS v4       │
│  - Gestión estado/auth  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   API Gateway (Nginx)   │  Puerto 8080
│  - Proxy reverso        │
│  - Enrutamiento         │
└─────┬──────────┬────────┘
      │          │
      ▼          ▼
┌──────────┐  ┌────────────┐
│ FastAPI  │  │  Node.js   │
│ (Python) │  │ (Express)  │
│ Puerto   │  │ Puerto     │
│  8000    │  │  3001      │
└────┬─────┘  └─────┬──────┘
     │              │
     │              ▼
     │        ┌──────────┐
     │        │ Scraping │
     │        │ Noticias │
     │        └──────────┘
     │
     ├───────────────┬───────────────┐
     ▼               ▼               ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ MongoDB  │   │PostgreSQL│   │ APIs     │
│ Datos F1 │   │ Usuarios │   │ Externas │
│  27017   │   │   5432   │   │          │
└──────────┘   └──────────┘   └──────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     ▼              ▼              ▼
                 Ergast F1      OpenF1       Wikipedia
                   API           API           API
```

### Flujo de Datos

1. **Frontend** → Envía peticiones HTTP al API Gateway
2. **API Gateway** → Enruta a FastAPI o Node.js según el endpoint
3. **FastAPI** → Maneja datos F1 (MongoDB) y usuarios (PostgreSQL)
4. **Node.js** → Realiza web scraping de noticias
5. **Servicios externos** → Enriquecen datos con APIs de terceros
6. **Respuesta** → Viaja de vuelta al frontend para renderizar

## 🔑 Endpoints Principales

### Autenticación y Usuarios (PostgreSQL)
```bash
POST /auth/register          # Registro de nuevo usuario
POST /auth/login             # Iniciar sesión
GET  /users/                 # Listar usuarios
GET  /users/{user_id}        # Obtener usuario específico
```

### Favoritos
```bash
GET    /favorites/user/{user_id}    # Obtener favoritos del usuario
POST   /favorites/                  # Añadir favorito
DELETE /favorites/{favorite_id}     # Eliminar favorito
```

### Comparaciones
```bash
GET    /comparisons/user/{user_id}  # Obtener comparaciones guardadas
POST   /comparisons/                # Guardar nueva comparación
DELETE /comparisons/{comparison_id} # Eliminar comparación
```

### Datos de F1 (MongoDB)
```bash
GET /drivers/                    # Listar todos los pilotos
GET /drivers/{driver_id}         # Obtener piloto específico
GET /drivers/{driver_id}/stats   # Estadísticas del piloto

GET /teams/                      # Listar equipos
GET /teams/{team_id}             # Obtener equipo específico

GET /races/                      # Listar carreras
GET /races/{race_id}             # Obtener carrera con resultados

GET /circuits/                   # Listar circuitos
GET /circuits/{circuit_id}       # Obtener circuito específico

GET /cars/                       # Listar coches
GET /cars/{car_id}               # Obtener coche con especificaciones

GET /championships/              # Listar campeonatos
GET /championships/{year}        # Obtener campeonato por año

GET /seasons/                    # Listar temporadas
GET /seasons/{year}              # Obtener temporada específica
```

### Otros Servicios
```bash
GET /weather/forecast/{location}  # Predicción meteorológica
GET /api/scrape/news              # Noticias de F1 (Node.js)
```

## 💻 Desarrollo local (opcional)

### Backend Python (FastAPI)

Usa el entorno virtual del proyecto y el `requirements.txt` ya preparado.

```powershell
# Crear y activar venv (Windows PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Instalar dependencias del backend
pip install -r backend-python/requirements.txt

# Ejecutar FastAPI en local
cd backend-python
python -m uvicorn app.main:app --reload
```

El `requirements.txt` incluye, entre otros: fastapi, uvicorn, sqlalchemy, motor, pymongo,
pydantic, pydantic-settings, email-validator, httpx, requests, passlib[bcrypt], bcrypt 3.2.2,
dnspython, psycopg2-binary.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Tailwind CSS v4 está configurado con `@tailwindcss/postcss` y `src/index.css`:

```css
@import "tailwindcss";
```

## 🛠️ Tecnologías

### Frontend
- **React 18.3.1** - Biblioteca UI con hooks y context
- **Vite 6** - Build tool ultra rápido
- **Tailwind CSS v4** - Framework CSS utility-first
- **React Router v6** - Navegación SPA con rutas protegidas

### Backend
- **FastAPI** - Framework Python asíncrono para APIs REST
- **Express.js** - Framework Node.js para scraping y gateway
- **SQLAlchemy** - ORM para PostgreSQL
- **Motor** / **PyMongo** - Cliente asíncrono para MongoDB
- **Pydantic v2** - Validación de datos y schemas
- **Passlib + Bcrypt** - Hash seguro de contraseñas

### Bases de Datos
- **MongoDB 7** - Base de datos NoSQL para datos de F1
- **PostgreSQL 16** - Base de datos relacional para usuarios

### APIs Externas
- **Ergast F1 API** - Datos históricos de F1
- **OpenF1** - Datos en tiempo real de F1
- **Wikipedia API** - Enriquecimiento de biografías e imágenes
- **WeatherAPI** - Predicciones meteorológicas (opcional)

### Infraestructura
- **Docker** - Containerización
- **Docker Compose** - Orquestación de 6 servicios

## 📦 Qué commitear

Se recomienda subir al repositorio:
- `docker-compose.yml` y todos los `Dockerfile`
- `.gitignore` y los `.dockerignore`
- Código fuente, `requirements.txt`, `package.json` y `package-lock.json`

No subir:
- `node_modules/`, `.venv/`, `dist/`, `build/`, caches (`__pycache__`, `.pytest_cache`, `.vite`, `.eslintcache`), bases de datos locales (`racestats.db`) ni ficheros `.env` (usa un `.env.example`).

## 🧩 Solución de problemas

### Problemas comunes

**El frontend no carga o muestra errores de autenticación:**
- Asegúrate de que el usuario esté correctamente guardado en localStorage
- Cierra sesión y vuelve a iniciar sesión para normalizar la estructura del usuario
- Verifica que el backend de FastAPI esté ejecutándose en el puerto 8000

**Los favoritos no se cargan o muestran "Cargando...":**
- Abre la consola del navegador (F12) y busca errores
- Verifica que el usuario tenga `id` (no `user_id`) en el objeto de autenticación
- Comprueba que las entidades favoritas existan en MongoDB

**Las comparaciones no guardan:**
- Verifica que el usuario esté autenticado
- Revisa la consola para errores de la API
- Asegúrate de que PostgreSQL esté ejecutándose

**Error "No se pudieron cargar las estadísticas":**
- Algunos pilotos pueden no tener datos completos de Ergast
- Es normal para pilotos nuevos o de reserva

**El scraping de noticias falla:**
- El servicio usa noticias mock mientras el scraping real está en desarrollo
- No afecta la funcionalidad principal de la aplicación

### Comandos útiles de Docker

```powershell
# Ver logs de un servicio específico
docker logs racestats_frontend
docker logs racestats_backend_fastapi

# Reiniciar un servicio
docker restart racestats_frontend

# Acceder a la shell de un contenedor
docker exec -it racestats_backend_fastapi bash
docker exec -it racestats_postgres psql -U admin -d racestats

# Ver estadísticas de recursos
docker stats

# Limpiar contenedores y volúmenes
docker compose down -v
```

### Base de datos

```powershell
# Conectar a MongoDB
docker exec -it racestats_mongo mongosh racestats

# Conectar a PostgreSQL
docker exec -it racestats_postgres psql -U admin -d racestats

# Ver favoritos de un usuario
docker exec -it racestats_postgres psql -U admin -d racestats -c "SELECT * FROM favorites WHERE user_id = 1;"
```

---

## 📈 Estado del Proyecto

✅ **Completado:**
- Sistema de autenticación completo con bcrypt
- CRUD de favoritos con enriquecimiento de datos
- Comparador de pilotos con visualización interactiva
- Integración de datos desde múltiples fuentes (Ergast, OpenF1, Wikipedia)
- Especificaciones técnicas completas para todos los coches
- Sistema de campeonatos con cálculo automático de puntuación
- Páginas de detalle enriquecidas para todas las entidades
- Botones de favoritos integrados en todas las páginas de detalle
- Datos auténticos de la temporada 2025 de F1
- Arquitectura de microservicios con Docker
- Documentación completa del proyecto






## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Ergast API** - Por proporcionar datos históricos de F1
- **OpenF1** - Por datos en tiempo real de carreras
- **Wikipedia** - Por enriquecer biografías e imágenes
- **Formula1.com** - Por ser fuente de noticias oficiales
- **La comunidad de F1** - Por su pasión y apoyo

---

¡Listo! Con `docker compose up --build -d` deberías tener el stack completo funcionando. Inicia sesión en http://localhost:5173/login para comenzar a explorar.


