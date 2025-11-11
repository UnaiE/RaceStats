# 🧱 Etapa base: Python 3.11 (recomendada para compatibilidad)
FROM python:3.11-slim

# 📂 Crea y define el directorio de trabajo
WORKDIR /app

# ⚙️ Evita que Python guarde archivos .pyc y buffers en stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 🧰 Instala dependencias del sistema necesarias para psycopg2 y MongoDB
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 🧾 Copia requirements.txt primero (para aprovechar el caché de Docker)
COPY requirements.txt .

# 📦 Instala dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# 🧩 Copia el resto del código del backend
COPY . .

# ⚙️ Variables de entorno por defecto (puedes sobreescribir en docker-compose)
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USER=admin
ENV DB_PASS=admin
ENV DB_NAME=racestats
ENV MONGO_URI=mongodb://mongo:27017

# 🚀 Expone el puerto 8000
EXPOSE 8000

# ▶️ Comando por defecto: ejecutar FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
