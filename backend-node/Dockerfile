FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

EXPOSE 3001

CMD ["node", "src/server.js"]
