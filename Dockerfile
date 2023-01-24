FROM node:18.13 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@8.19.3
RUN npm install
COPY ./ .
COPY docker/index.html public/index.html
COPY docker/vue.config.js ./vue.config.js
COPY docker/Config.js src/Config.js

RUN npm run build

FROM nginx:1.23.3-alpine as production-stage
WORKDIR /usr/app

COPY --from=build-stage /app/dist /usr/share/nginx/html/

COPY docker/default.conf /etc/nginx/conf.d/

EXPOSE 80
