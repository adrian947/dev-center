# DevCenter

Dev Toolbox + Command Center personal. Monorepo con Vue 3 + TypeScript en el
frontend, Express + TypeScript + Prisma en el backend, PostgreSQL (Neon en
producción, contenedor local en desarrollo) y autenticación con Google OAuth.

> Estado actual: autenticación con Google OAuth y CRUD de Tareas/Notas/Proyectos
> implementados. Links/Activity, Favoritos y el Dev Toolbox quedan para fases
> posteriores (ver `docs`/plan del proyecto).

## Arquitectura en una frase

Un solo servicio Node en producción: Express expone la API REST bajo `/api`
y sirve el build estático de Vue para todo lo demás. En desarrollo, Vite
sirve el frontend con hot reload y proxea `/api` hacia el backend, por lo
que el navegador ve siempre un único origen (cookies simples, sin CORS).

```
dev-center/
├── shared/     # Zod schemas + tipos compartidos entre frontend y backend
├── backend/    # Express + TypeScript + Prisma
├── frontend/   # Vue 3 + TypeScript + Vite + PrimeVue
└── tests/e2e/  # Playwright
```

## 1. Requisitos

- Docker + Docker Compose (única dependencia obligatoria para levantar todo).
- Node.js 20+ y npm 10+ si se quiere correr algo fuera de Docker (tests,
  linter, etc.).
- Una cuenta de Google Cloud para las credenciales OAuth (ver sección 4).
- Una cuenta de Neon para la base de datos de producción (ver sección 5).

## 2. Desarrollo con Docker

```bash
cp .env.example .env   # completar valores según secciones 3-4
docker compose up
```

Esto levanta:

- `postgres` en `localhost:5432` (Postgres 16, datos persistidos en el
  volumen `postgres_data`).
- `backend` en `http://localhost:3001` (Express con hot reload vía `tsx`).
- `frontend` en `http://localhost:5173` (Vite, proxea `/api` al backend).

Alternativa sin Docker (requiere Postgres local propio):

```bash
npm install
npm run dev:backend    # terminal 1
npm run dev:frontend   # terminal 2
```

## 3. Variables de entorno

Ver `.env.example` para la lista completa. Resumen:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de Postgres (pooled en prod/Neon). |
| `DIRECT_URL` | Connection string directo, usado solo por `prisma migrate`. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales OAuth de Google. |
| `GOOGLE_CALLBACK_URL` | Redirect URI registrado en Google Cloud Console. |
| `SESSION_SECRET` | Secreto para firmar el JWT propio (generar con `openssl rand -base64 48`). |
| `FRONTEND_URL` / `BACKEND_URL` | Usadas para CORS y para construir URLs de redirect. |
| `NODE_ENV` / `PORT` | Configuración del servidor Express. |

Nunca commitear `.env` (ya está en `.gitignore`). Nunca loguear estos valores.

## 4. Configuración de Google OAuth

1. Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
2. Configurar la pantalla de consentimiento OAuth (tipo "External" para uso
   personal, no requiere verificación si el usuario está en la lista de
   testers).
3. Crear credenciales → "OAuth client ID" → tipo "Web application".
4. Authorized redirect URIs:
   - Local: `http://localhost:3001/api/auth/google/callback`
   - Producción: `https://<tu-servicio>.onrender.com/api/auth/google/callback`
5. Copiar Client ID y Client Secret a `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## 5. Configuración de Neon

1. Crear un proyecto en [Neon](https://neon.tech/).
2. Copiar el **pooled connection string** (con `-pooler` en el host) a
   `DATABASE_URL` en el entorno de producción (Render).
3. Copiar el connection string **directo** (sin pooler) a `DIRECT_URL`,
   usado únicamente por `prisma migrate deploy`.
4. En desarrollo local no se depende de Neon: `docker-compose.yml` levanta
   un Postgres propio. Neon se usa solo en Render (y opcionalmente un branch
   de Neon para staging).

## 6. Migraciones Prisma

```bash
# Contra el Postgres local del docker-compose:
npm run prisma:migrate --workspace backend -- --name init

# Generar el cliente Prisma tras cambiar el schema:
npm run prisma:generate --workspace backend

# Aplicar migraciones ya creadas contra Neon (producción):
DATABASE_URL=... DIRECT_URL=... npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

## 7. Ejecutar tests

```bash
npm run typecheck   # tsc/vue-tsc en los 3 workspaces
npm run lint
npm run test         # vitest (backend + frontend)
```

## 8. Ejecutar Playwright

```bash
npx playwright install --with-deps   # una sola vez
docker compose up -d                 # backend + frontend deben estar corriendo
npm run test:e2e
```

## 9. Build

```bash
npm run build   # build:shared -> build:backend -> build:frontend
```

Para replicar exactamente el artefacto de producción:

```bash
docker build -f backend/Dockerfile --target production -t devcenter .
docker run --env-file .env -p 3001:3001 devcenter
```

## 10. Deploy en Render

1. Crear un **Web Service** en Render, tipo "Docker", apuntando a este repo,
   con `backend/Dockerfile` y build target `production`, build context la
   raíz del repo.
2. Configurar las variables de entorno de la sección 3 en el dashboard de
   Render (nunca en el repo). `DATABASE_URL`/`DIRECT_URL` apuntan a Neon.
3. Configurar el "Pre-Deploy Command" (o un job manual la primera vez) con:
   `npx prisma migrate deploy --schema backend/prisma/schema.prisma`.
4. `GOOGLE_CALLBACK_URL` y `FRONTEND_URL`/`BACKEND_URL` deben apuntar al
   dominio `https://<tu-servicio>.onrender.com` asignado por Render.
5. Render provee HTTPS automáticamente; las cookies quedan `Secure=true`.

---

## Convenciones del proyecto

- TypeScript strict en los 3 workspaces, evitar `any`.
- Todo texto visible en la UI pasa por Vue I18n (`frontend/src/locales`).
- Cada entidad privada pertenece a un `User`; el backend nunca confía en un
  `userId` enviado por el cliente, siempre lo deriva del JWT verificado.
- DevTools que puedan ejecutarse 100% en el navegador se implementan solo en
  frontend (ver Dev Toolbox, Fase 5).
- Commits pequeños, estilo `feat(scope): mensaje`.
