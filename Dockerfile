FROM node:16.18.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY server.js ./
COPY src ./

FROM ubuntu:latest

ARG PORT
ARG SENTRY_DSN

ENV PORT=$PORT
ENV SENTRY_DSN=$SENTRY_DSN

COPY --from=build /app /app

WORKDIR /app
CMD ["node", "server.js"]