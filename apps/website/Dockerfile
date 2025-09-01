# Stage 1: Build
#FROM node:20-alpine AS builder
#WORKDIR /app

#COPY package*.json tsconfig*.json nx.json ./
#RUN npm install

#COPY . .
#RUN npx nx build website

# Stage 2: Runtime con nginx
#FROM nginx:alpine

# Website buildato in apps/dist/website
#COPY --from=builder /app/apps/dist/website /usr/share/nginx/html

#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig*.json nx.json ./
RUN npm install

COPY . .
RUN npx nx build website

# Stage 2: Runtime con nginx
FROM nginx:alpine

# Copia la build
COPY --from=builder /app/apps/dist/website /usr/share/nginx/html

# Copia la configurazione Nginx personalizzata
COPY apps/website/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]