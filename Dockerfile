# Etap budowania aplikacji
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
COPY . .

# Ustaw zmienną środowiskową na etapie budowania
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Budowanie aplikacji
RUN npm install
RUN npm run build

# Etap serwowania aplikacji
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
