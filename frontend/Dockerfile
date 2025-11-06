FROM node:20

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

EXPOSE 5173

# Ejecutar Vite en modo desarrollo con host 0.0.0.0 para acceso desde el host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
