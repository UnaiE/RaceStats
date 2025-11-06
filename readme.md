# RaceStats

RaceStats es una aplicación web para visualizar y comparar datos históricos y actuales de Fórmula 1. Ofrece estadísticas de pilotos, escuderías y carreras, con datos en tiempo real a través de APIs públicas, y una arquitectura de microservicios (Python y Node.js) expuesta vía REST y un API Gateway.

## 📋 Estructura del Proyecto

```
RaceStats/
├── api-gateway/            # API Gateway (proxy a FastAPI y Node)
│   ├── Dockerfile
│   ├── index.js            # Punto de entrada del gateway
│   ├── package.json
│   └── .dockerignore
├── backend-node/           # Backend Node.js (Express)
│   ├── Dockerfile
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── openapi.json
│   ├── package.json
│   └── .dockerignore
├── backend-python/         # Backend Python (FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── resources/
│   │   └── ...
│   └── .dockerignore
├── frontend/               # Frontend React + Vite + Tailwind v4
│   ├── Dockerfile
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css       # Tailwind v4 ("@import \"tailwindcss\";")
│   ├── postcss.config.js   # Usa '@tailwindcss/postcss'
│   ├── vite.config.js
│   ├── package.json
│   └── .dockerignore
├── docker-compose.yml      # Orquestación de servicios
└── .gitignore              # Ignora venv, node_modules, builds, .env, etc.
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
- Frontend (Vite): http://localhost:5173
- API Gateway: http://localhost:8080
- FastAPI: http://localhost:8000
- Backend Node: http://localhost:3001
- MongoDB: 27017 (expuesto al host)
- PostgreSQL: 5432 (expuesto al host)

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
- PostgreSQL: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST=postgres`, `POSTGRES_PORT=5432`
- MongoDB: `MONGO_URI=mongodb://mongo:27017/racestats`
- CORS Frontend: `FRONTEND_URL=http://localhost:5173`
- Frontend (Vite): `VITE_API_URL=http://localhost:8080`

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

- Frontend → React + Vite + Tailwind CSS v4
- Backend Python → FastAPI
- Backend Node.js → Express.js
- API Gateway → Node.js / http-proxy-middleware / Swagger UI
- BD relacional → PostgreSQL (driver psycopg2-binary) vía SQLAlchemy
- BD no relacional → MongoDB (Motor / PyMongo)
- Infraestructura → Docker / Docker Compose

## 📦 Qué commitear

Se recomienda subir al repositorio:
- `docker-compose.yml` y todos los `Dockerfile`
- `.gitignore` y los `.dockerignore`
- Código fuente, `requirements.txt`, `package.json` y `package-lock.json`

No subir:
- `node_modules/`, `.venv/`, `dist/`, `build/`, caches (`__pycache__`, `.pytest_cache`, `.vite`, `.eslintcache`), bases de datos locales (`racestats.db`) ni ficheros `.env` (usa un `.env.example`).

## 🧩 Solución de problemas

- El warning de Compose sobre `version` ya está resuelto al eliminar la clave.
- Si el frontend no arranca dentro de Docker por binarios de Rollup, asegúrate de usar la imagen `node:20` (no `alpine`) o reconstruye con `docker compose build --no-cache`.
- Si un servicio Node reinicia en bucle por dependencias faltantes, valida su `package.json` y reconstruye la imagen (`docker compose build <servicio>`).

---

¡Listo! Con `docker compose up --build -d` deberías tener el stack completo funcionando en los puertos indicados.


