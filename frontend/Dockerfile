# syntax=docker/dockerfile:1
# Dev-only image (hot reload via bind mount from docker-compose). Not used for the Render deploy,
# where the frontend is built as static assets and served by the backend image instead.

FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci

FROM base AS dev
ENV NODE_ENV=development
WORKDIR /app
# Run as "node" (uid/gid 1000, matching typical host users) so files written into the
# bind-mounted repo aren't owned by root on the host.
RUN chown -R node:node /app
USER node
EXPOSE 5173
CMD ["sh", "-c", "npm run build:shared && npm run dev --workspace frontend"]
