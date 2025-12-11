FROM node:20-alpine

USER node
WORKDIR /app

COPY --chown=node package*.json ./
RUN npm ci
COPY --chown=node . .
ENV NUXT_PORT=80
ENV NUXT_HOST=0.0.0.0
ENV NUXT_TARGET=server
RUN npm run configure
RUN npm run build

CMD ["./node_modules/.bin/nuxt", "start"]
