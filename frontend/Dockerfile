FROM docker.io/library/node:latest as build

WORKDIR /app
COPY . .

RUN npm install && \
    npm run build

FROM docker.io/library/nginx:latest

COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Expose Nginx server on port 80
EXPOSE 80
