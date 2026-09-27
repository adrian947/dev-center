# syntax=docker/dockerfile:1
# Build context must be the repo root (npm workspaces need shared/ and frontend/ package.json files too).

FROM node:20-alpine AS base
# Prisma's musl query/schema engines need libssl to run at all on Alpine.
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json* ./
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci

# ---- dev: used by docker-compose for local development (hot reload via bind mount) ----
FROM base AS dev
ENV NODE_ENV=development
WORKDIR /app
# Run as the "node" user (uid/gid 1000, matching typical host users) so files created inside
# the bind-mounted repo (migrations, generated code) aren't owned by root on the host.
RUN chown -R node:node /app
USER node
EXPOSE 3001
CMD ["sh", "-c", "npm run build:shared && npm run dev --workspace backend"]

# ---- build: compiles shared, backend and the frontend static bundle ----
FROM base AS build
COPY . .
RUN npm run prisma:generate --workspace backend
RUN npm run build:shared
RUN npm run build:backend
RUN npm run build:frontend

# ---- production: single image, Express serves the API and the built frontend ----
FROM node:20-alpine AS production
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --omit=dev
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma
COPY --from=build /app/frontend/dist ./frontend/dist
WORKDIR /app/backend
EXPOSE 3001
CMD ["node", "dist/server.js"]
