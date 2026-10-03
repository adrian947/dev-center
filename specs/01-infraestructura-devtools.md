# SPEC 01 — Infraestructura compartida del Dev Toolbox (favoritos, recientes, ToolLayout)

> **Status:** Aprobado
> **Depends on:** ninguno
> **Date:** 2026-10-03
> **Objective:** Dejar listo el backend de favoritos/recientes y el layout común de cada tool, para que los specs 02–05 solo agreguen herramientas.

## Por qué existe este spec

Hoy `UuidGeneratorView.vue` es una vista suelta con header y estilos propios. Copiar ese patrón 25 veces generaría deuda. Además, el plan inicial pide favoritos y "recent tool tracking" por cada tool, y el backend no tiene nada de eso (`backend/src/modules/tools/` está vacío y el schema Prisma lo difiere explícitamente). Se resuelve una vez, antes de las tools.

## Alcance

**Entra:**

- Modelos Prisma `FavoriteTool` y `RecentTool` + migración.
- Catálogo de ids de tools en `shared` (validación Zod en backend y frontend).
- Módulo backend `tools`: favoritos y recientes por usuario.
- Composable `useToolUsage` (TanStack Query) en frontend.
- Componente `ToolLayout.vue` (back, icono, título, descripción, estrella de favorito, registro de uso al montar).
- Refactor de `UuidGeneratorView.vue` para usar `ToolLayout`.
- Estrella de favorito en las cards de `DevToolsView.vue`.
- Card "Recent Tools" del dashboard con datos reales (reemplaza `mockTools`).
- Vista `/favorites` mostrando las tools favoritas.
- Tests vitest (backend y frontend) y un e2e de favoritos/recientes.

**Fuera de alcance (para specs futuros):**

- Cualquier herramienta nueva (specs 02–05).
- Favoritos de otras entidades (links, notas, proyectos). `/favorites` solo lista tools.
- Cliente HTTP y One-Time Secret (requieren backend, spec propio).
- Tools en el command palette.
- Sincronización de favoritos entre usuarios o compartir.

## Modelo de datos

```prisma
model FavoriteTool {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  toolId    String
  createdAt DateTime @default(now())

  @@unique([userId, toolId])
  @@index([userId])
  @@map("favorite_tools")
}

model RecentTool {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  toolId     String
  lastUsedAt DateTime @default(now())
  useCount   Int      @default(1)

  @@unique([userId, toolId])
  @@index([userId, lastUsedAt])
  @@map("recent_tools")
}
```

`User` gana las relaciones `favoriteTools FavoriteTool[]` y `recentTools RecentTool[]`.

```ts
// shared/src/schemas/tool.ts
export const TOOL_IDS = [/* los ids de DEV_TOOLS: "json", "jwt", "uuid", ... */] as const;
export const toolIdSchema = z.enum(TOOL_IDS);
export const trackRecentToolSchema = z.object({ toolId: toolIdSchema });
```

Convenciones:

- `toolId` es el `id` de `DEV_TOOLS` (`frontend/src/data/devtools.ts`). No hay tabla de catálogo: el catálogo vive en frontend y `shared` solo valida ids.
- Ruta de cada tool: `/devtools/` + id en kebab-case (`urlEncoder` → `/devtools/url-encoder`). Excepción heredada: `uuid` → `/devtools/uuid`.
- Vista de cada tool: `frontend/src/views/devtools/<IdEnPascal>View.vue` (excepción heredada: `UuidGeneratorView.vue`).
- Lógica pura de cada tool: `frontend/src/utils/devtools/<id>.ts` con test `<id>.test.ts` al lado.
- Textos: clave `devtools.<id>.*` en `es.ts` y `en.ts`.

## Plan de implementación

1. Agregar `shared/src/schemas/tool.ts` con `TOOL_IDS`, `toolIdSchema`, `trackRecentToolSchema`; exportar desde `shared/src/index.ts`. Hacer que `DEV_TOOLS` en el frontend tipe su `id` con `ToolId`.
2. Agregar los modelos Prisma y la migración. Correr `npm run prisma:generate --workspace backend`. Quitar `FavoriteTool/RecentTool` del comentario de diferidos en `schema.prisma`.
3. Crear `backend/src/modules/tools/tools.routes.ts` con `requireAuth` y los endpoints de abajo; montarlo en `backend/src/routes/index.ts`.
4. Tests backend (vitest) de los endpoints: alta idempotente, baja, listado ordenado, poda, aislamiento entre usuarios, `toolId` inválido → 400.
5. Crear `frontend/src/composables/useToolUsage.ts`: `favorites`, `recents`, `isFavorite(id)`, `toggleFavorite(id)`, `trackUse(id)`.
6. Crear `frontend/src/components/devtools/ToolLayout.vue` (props `toolId`, `icon`; slots `default` y `actions`). Llama a `trackUse` una vez al montar.
7. Refactorizar `UuidGeneratorView.vue` con `ToolLayout`, sin cambiar su comportamiento.
8. Agregar estrella de favorito a las cards de `DevToolsView.vue` (la estrella no navega).
9. Reemplazar `mockTools` por `recents` reales en la card "Recent Tools" de `DashboardView.vue`; borrar `mockTools` de `mockDashboard.ts`.
10. Reemplazar `ComingSoonView` en `/favorites` por una vista que lista las tools favoritas (estado vacío incluido). i18n es/en.
11. e2e `tests/e2e/devtools/favorites-recents.spec.ts`.

Endpoints (todos bajo `/api/tools`, requieren sesión):

| Método | Ruta                  | Efecto                                                             |
| ------ | --------------------- | ------------------------------------------------------------------ |
| GET    | `/favorites`          | Lista `toolId` favoritos del usuario, por `createdAt` desc.        |
| PUT    | `/favorites/:toolId`  | Marca favorito. Idempotente.                                       |
| DELETE | `/favorites/:toolId`  | Quita favorito. Idempotente.                                       |
| GET    | `/recent`             | Últimas 8 tools distintas por `lastUsedAt` desc.                   |
| POST   | `/recent`             | Upsert `{ toolId }`: `lastUsedAt = now()`, `useCount += 1`. Poda lo que exceda 20 filas del usuario. |

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint` y `npm run test` pasan.
- [ ] La migración se aplica sobre un Postgres limpio con `prisma migrate dev`.
- [ ] `PUT /api/tools/favorites/json` dos veces seguidas deja una sola fila y responde 2xx ambas veces.
- [ ] `PUT /api/tools/favorites/no-existe` responde 400.
- [ ] Un usuario no ve los favoritos ni recientes de otro.
- [ ] `POST /api/tools/recent` con el mismo `toolId` dos veces deja una fila con `useCount = 2`.
- [ ] Tras 21 tools distintas registradas, el usuario tiene como máximo 20 filas en `recent_tools`.
- [ ] `GET /api/tools/recent` devuelve como máximo 8 elementos.
- [ ] Abrir `/devtools/uuid` agrega `uuid` a la card "Recent Tools" del dashboard.
- [ ] Clic en la estrella de una card de `/devtools` marca el favorito sin navegar; recargar conserva la marca.
- [ ] `/favorites` lista exactamente las tools marcadas y muestra estado vacío si no hay ninguna.
- [ ] La vista UUID se ve y se comporta igual que antes del refactor, con la estrella de favorito en el header.
- [ ] `mockTools` ya no existe en el código.
- [ ] El e2e de favoritos/recientes pasa.

## Decisiones

- **Sí:** dos tablas con `toolId` string. El catálogo cambia más seguido que el modelo; evita migrar y sembrar por cada tool nueva.
- **No:** tabla `Tool` de catálogo con FK. Más rígido sin ganancia para uso personal.
- **Sí:** validar `toolId` contra `TOOL_IDS` de `shared`. Evita basura en DB y mantiene frontend y backend alineados.
- **Sí:** registrar el uso al abrir la tool (montaje de `ToolLayout`), no por acción interna. Una sola línea en un solo lugar, en vez de código en cada tool.
- **Sí:** mostrar 8 recientes y podar a 20 en backend. Margen para cambiar el límite visible sin perder historial.
- **Sí:** `ToolLayout` + `useToolUsage` compartidos y refactor de UUID. Evita 25 copias del header y los estilos.
- **No:** favoritos en `localStorage`. Se perderían entre dispositivos y habría que migrarlos después.
- **No:** incluir `http` y `oneTimeSecret` en estos specs. Necesitan backend propio (proxy anti-CORS, secretos con TTL).

## Riesgos

| Riesgo                                                      | Mitigación                                                                  |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| `POST /recent` en cada montaje genera tráfico redundante    | El composable lo dispara una vez por montaje; fallo de red se ignora sin romper la tool. |
| Una tool se renombra y queda un `toolId` huérfano en DB     | Los ids de `TOOL_IDS` no se renombran; si ocurre, migración explícita.      |
| El refactor de UUID rompe estilos existentes                | Criterio de aceptación de paridad visual y smoke e2e de UUID.               |

## Lo que **no** está en este spec

- Ninguna herramienta nueva.
- Favoritos de links, notas o proyectos.
- Cliente HTTP y One-Time Secret.
- Tools en el command palette.

Cada uno de esos, si llega, va en su propio spec.
