# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copia file base e tsconfig
COPY package*.json tsconfig*.json nx.json ../../tsconfig.tsnode.json ../../tsconfig.base.json ./
RUN npm install

# Copia tutto il codice e builda l'API
COPY . .
RUN npx nx build api

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Copia solo i file buildati (API in dist/api)
COPY --from=builder /app/dist/apps/api ./dist/apps/api
COPY package*.json ./

# Copia i tsconfig necessari per ts-node nel runtime (se vuoi eseguire i seed)
COPY ../../tsconfig.tsnode.json ./
COPY ../../tsconfig.base.json ./

# Copia librerie necessarie per i seed
COPY --from=builder /app/libs/api/models/src /app/libs/api/models/src

# Installa solo le dipendenze di produzione
RUN npm install 
#--omit=dev

EXPOSE 3000
CMD ["node", "dist/apps/api/main.js"]