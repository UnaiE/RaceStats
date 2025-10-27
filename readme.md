# RaceStats

RaceStats será una aplicación web interactiva en donde se permitirá visualizar y comparar datos históricos y actuales de la Fórmula 1. Se ofrecerán estadísticas de pilotos, escuderías y carreras en detalle, pudiendo consumir información en tiempo real gracias a las APIs públicas. 

Se trata de un proyecto que quiere acercar la analítica deportiva a los aficionados, mediante una interfaz moderna y ágil. Para ello, se hará uso de microservicios en Python y Node.js con una arquitectura basada en APIs RESTful.

## 📋 Estructura del Proyecto

```
RaceStats/
├── api-gateway/          # Gateway de API
├── backend-node/         # Backend en Node.js
├── backend-python/       # Backend en Python (FastAPI)
├── frontend/            # Frontend React
└── docker-compose.yml   # Configuración Docker
```

## 🚀 Configuración del Entorno

### Backend Python

#### 1. Crear y activar el entorno virtual

**Windows (PowerShell):**
```powershell
# Crear entorno virtual en la raíz del proyecto
python -m venv .venv

# Activar entorno virtual
.\.venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
source .venv/bin/activate
```

#### 2. Instalar dependencias

Una vez activado el entorno virtual, instala las dependencias necesarias:

```powershell
pip install fastapi uvicorn sqlalchemy motor pydantic pydantic-settings pymongo requests
```

O crea un archivo `requirements.txt` en `backend-python/`:

```txt
fastapi
uvicorn
sqlalchemy
motor
pydantic
pydantic-settings
pymongo
requests
```

Y luego instala con:
```powershell
pip install -r backend-python/requirements.txt
```

#### 3. Verificar la instalación

Para verificar que todo está instalado correctamente:

```powershell
pip list
```

### Dependencias del Proyecto

#### Backend Python
- **FastAPI**: Framework web moderno y rápido
- **Uvicorn**: Servidor ASGI para FastAPI
- **SQLAlchemy**: ORM para bases de datos SQL
- **Motor**: Driver asíncrono de MongoDB
- **Pydantic**: Validación de datos y configuración
- **PyMongo**: Driver de MongoDB
- **Requests**: Cliente HTTP

#### Frontend
- React.js
- (Más detalles en `frontend/racestats-ui/package.json`)

#### Backend Node.js
- (Detalles en `backend-node/package.json`)



## 📦 Docker

El proyecto incluye configuración Docker para facilitar el despliegue:

```powershell
docker-compose up
```

## 🛠️ Tecnologías

- Frontend → React
- Backend Python → FastAPI
- Backend Node.js → Express.js
- API Gateway → Node.js / OpenAPI 3.0 / Swagger
- BD Relacional → SQLAlchemy + SQLite
- BD No-Relacional → MongoDB
- API → OpenF1 / EargastF1
- Infraestructura → Docker / Docker compose
- Versión control → GitHUB


## 📝 Notas


