# RaceStats

RaceStats es una aplicación web completa para visualizar, comparar y gestionar datos históricos y actuales de Fórmula 1. Ofrece estadísticas detalladas de pilotos, escuderías, carreras, circuitos y monoplazas, con datos enriquecidos desde múltiples fuentes (Ergast API, OpenF1, Wikipedia), sistema de autenticación de usuarios, favoritos personalizables y comparaciones interactivas.

## ✨ Características Principales

### 📊 Visualización de Datos
- **Pilotos**: Perfiles completos con biografías, estadísticas de carrera, noticias y galerías de imágenes
- **Equipos**: Historia, logros, pilotos actuales, patrocinadores y datos técnicos
- **Carreras**: Resultados detallados, clasificaciones y análisis de rendimiento
- **Circuitos**: Información técnica, mapas de trazado y estadísticas históricas
- **Coches**: Especificaciones técnicas completas (motor, chasis, aerodinámica, etc.)
- **Campeonatos**: Clasificaciones de pilotos y constructores con puntuación automática
- **Clima**: Predicciones meteorológicas para próximas carreras (WeatherAPI)

### 👤 Gestión de Usuarios
- **Autenticación**: Sistema completo de registro/login con hash de contraseñas (bcrypt)
- **Favoritos**: Guarda tus pilotos, equipos, coches, carreras y circuitos favoritos
- **Comparador**: Compara hasta 4 pilotos con estadísticas visuales destacadas
- **Comparaciones Guardadas**: Almacena y recupera tus comparaciones favoritas

### 📰 Contenido Enriquecido
- Noticias en tiempo real de Formula1.com y RaceFans
- Galerías de imágenes desde Wikipedia
- Datos curiosos y logros de carrera
- Biografías completas de pilotos y equipos

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
│   │   ├── resources/
│   │   │   ├── db_mongo.py # Conexión MongoDB
│   │   │   └── db_sql.py   # Conexión PostgreSQL
│   │   └── scripts/
│   │       └── import_openf1.py  # Script de importación de datos
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

## 🚀 Arranque rápido con Docker

Requisitos: Docker Desktop (Windows/macOS) o Docker Engine (Linux).

```powershell
# Desde la raíz del proyecto
docker compose up --build -d

# Ver estado
docker compose ps

# Logs de un servicio (ejemplo frontend)


# Parar todo
docker compose down
```

Servicios y URLs
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

Rutas útiles
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

Variables de entorno (definidas en `docker-compose.yml`)
- **PostgreSQL**: `POSTGRES_USER=admin`, `POSTGRES_PASSWORD=admin`, `POSTGRES_DB=racestats`
- **MongoDB**: `MONGO_URI=mongodb://mongo:27017/racestats`
- **CORS Frontend**: `FRONTEND_URL=http://localhost:5173`
- **Frontend (Vite)**: `VITE_API_URL=http://localhost:8080`
- **WeatherAPI**: `WEATHER_API_KEY` (opcional, para predicciones meteorológicas)

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
- Sistema de autenticación completo
- CRUD de favoritos con enriquecimiento de datos
- Comparador de pilotos con visualización interactiva
- Integración de datos desde múltiples fuentes (Ergast, OpenF1, Wikipedia)
- Especificaciones técnicas completas para todos los coches
- Sistema de campeonatos con cálculo automático de puntuación
- Páginas de detalle enriquecidas para todas las entidades
- Botones de favoritos integrados en todas las páginas de detalle

🚧 **En desarrollo:**
- Scraping real de noticias (actualmente usa datos mock)
- Sección "Mis Comparaciones Guardadas"
- Comparador de equipos y coches
- Notificaciones para favoritos
- Función de compartir comparaciones

---

¡Listo! Con `docker compose up --build -d` deberías tener el stack completo funcionando. Inicia sesión en http://localhost:5173/login para comenzar a explorar.


