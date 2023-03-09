FROM docker.io/library/node:latest as build

WORKDIR /app
COPY . .

RUN npm install && \
    npm run build

FROM docker.io/library/nginx:latest

COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
