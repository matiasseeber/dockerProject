FROM node:16.18.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY server.js ./
COPY src ./

FROM node:16.18.0-alpine

ARG PORT
ARG SENTRY_DSN

ENV PORT=$PORT
ENV SENTRY_DSN=$SENTRY_DSN

COPY --from=build /app /app

WORKDIR /app

EXPOSE 8080

CMD ["node", "server.js"]

#COMO PROBARLO: docker run -p 8080:8080 -e PORT=8080 -e SENTRY_DSN=your_runtime_sentry_dsn your_image_name