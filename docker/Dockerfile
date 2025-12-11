FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run configure
RUN NODE_OPTIONS=--max-old-space-size=8192 npm run generate

FROM nginxinc/nginx-unprivileged:1.25-alpine as app
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY ./docker/vhost.conf /etc/nginx/conf.d/default.conf
