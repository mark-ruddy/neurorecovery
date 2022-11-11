FROM docker.io/library/node:latest as build

WORKDIR /app
COPY . .

RUN npm install && \
    npm run build

FROM docker.io/library/nginx:latest

COPY --from=build /app/dist/installments_frontend /usr/share/nginx/html
EXPOSE 80
