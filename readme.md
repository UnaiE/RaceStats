# RaceStats 🏎️

Aplicación web completa para explorar, comparar y analizar datos de Fórmula 1. RaceStats proporciona estadísticas detalladas sobre pilotos, equipos, carreras, circuitos y coches, con datos enriquecidos de múltiples fuentes incluyendo la API oficial de F1, Ergast y OpenF1.

---

## ⚡ Inicio Rápido (TL;DR)

```powershell
# 1. Instala Docker Desktop: https://www.docker.com/products/docker-desktop
# 2. Clona y arranca:
git clone https://github.com/tu-usuario/racestats.git
cd racestats
docker compose up --build -d

# 3. Espera 30-60 segundos y abre tu navegador:
# 🌐 http://localhost:5173
```

**¡Eso es todo!** La aplicación estará corriendo con todos los servicios listos.

---

## 📑 Tabla de Contenidos

- [⚡ Inicio Rápido (TL;DR)](#-inicio-rápido-tldr)
- [🚀 Guía de Instalación y Ejecución](#-guía-de-instalación-y-ejecución)
  - [0️⃣ Software Necesario](#0️⃣-software-necesario)
  - [1️⃣ Clonar el Repositorio](#1️⃣-clonar-el-repositorio)
  - [2️⃣ Servicios que se Arrancarán](#2️⃣-servicios-que-se-arrancarán)
  - [3️⃣ Dependencias (Automáticas)](#3️⃣-dependencias-automáticas)
  - [4️⃣ Arrancar el Servidor](#4️⃣-arrancar-el-servidor-stack-completo)
  - [5️⃣ Acceder a la Aplicación](#5️⃣-acceder-a-la-aplicación-cliente)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#️-arquitectura)
- [Endpoints Principales](#-endpoints-principales)


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

## 🚀 Guía de Instalación y Ejecución

### 0️⃣ Software Necesario

Antes de comenzar, asegúrate de tener instalado:

| Software | Versión Mínima | Descarga |
|----------|----------------|----------|
| **Docker Desktop** | 20.10+ | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |
| **Git** | 2.0+ | [git-scm.com/downloads](https://git-scm.com/downloads) |

**Requisitos del Sistema:**
- **RAM**: Mínimo 4GB disponible para contenedores
- **Espacio en disco**: 5GB libres
- **Puertos libres**: 5173, 8080, 8000, 3001, 27017, 5432

> 💡 **Nota**: No necesitas instalar Node.js, Python, MongoDB ni PostgreSQL. Docker se encarga de todo.

### 1️⃣ Clonar el Repositorio

```powershell
# Clonar el proyecto
git clone https://github.com/tu-usuario/racestats.git
cd racestats
```

### 2️⃣ Servicios que se Arrancarán

El proyecto levanta automáticamente **6 servicios** en contenedores Docker:

| Servicio | Descripción | Puerto |
|----------|-------------|--------|
| **frontend** | Aplicación React + Vite | 5173 |
| **api-gateway** | Gateway Nginx (proxy) | 8080 |
| **backend_fastapi** | API Python FastAPI | 8000 |
| **backend_node** | API Node.js Express | 3001 |
| **mongo** | Base de datos MongoDB | 27017 |
| **postgres** | Base de datos PostgreSQL | 5432 |

### 3️⃣ Dependencias (Automáticas)

**No necesitas instalar dependencias manualmente.** Docker se encarga de todo:

- **Frontend**: `npm install` se ejecuta automáticamente en el contenedor
- **Backend Python**: `pip install -r requirements.txt` se ejecuta automáticamente
- **Backend Node**: `npm install` se ejecuta automáticamente en ambos backends

### 4️⃣ Arrancar el Servidor (Stack Completo)

```powershell
# Desde la raíz del proyecto (RaceStats/)
docker compose up --build -d
```

**¿Qué hace este comando?**
- `up`: Levanta todos los servicios
- `--build`: Construye las imágenes Docker (primera vez o si hay cambios)
- `-d`: Modo detached (ejecuta en segundo plano)

**Verificar que todo funciona:**

```powershell
# Ver estado de los contenedores
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f frontend
docker compose logs -f backend_fastapi
```

**Espera a que todos los servicios estén "healthy" o "running" (30-60 segundos).**

### 5️⃣ Acceder a la Aplicación Cliente

Una vez que los servicios estén corriendo, abre tu navegador:

#### 🌐 **Acceso Principal**

**Frontend (Interfaz de Usuario)**
- **URL**: http://localhost:5173
- **Páginas disponibles**:
  - Dashboard: http://localhost:5173/dashboard
  - Login/Registro: http://localhost:5173/login
  - Pilotos: http://localhost:5173/drivers
  - Equipos: http://localhost:5173/teams
  - Carreras: http://localhost:5173/races
  - Favoritos: http://localhost:5173/favorites
  - Comparador: http://localhost:5173/comparisons

#### 🔧 **Acceso a APIs (para desarrollo)**

- **API Gateway**: http://localhost:8080
- **FastAPI Docs**: http://localhost:8000/docs (Swagger interactivo)
- **FastAPI OpenAPI**: http://localhost:8000/openapi.json
- **Backend Node Health**: http://localhost:3001/health

#### 📊 **Acceso a Bases de Datos (opcional)**

```powershell
# MongoDB (desde terminal)
docker exec -it racestats_mongo mongosh racestats

# PostgreSQL (desde terminal)
docker exec -it racestats_postgres psql -U admin -d racestats
```

### 🛑 Detener los Servicios

```powershell
# Detener todos los contenedores (conserva datos)
docker compose down

# Detener y eliminar volúmenes (BORRA DATOS)
docker compose down -v

# Reiniciar un servicio específico
docker compose restart frontend
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

