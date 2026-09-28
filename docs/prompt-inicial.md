# Prompt inicial — DevCenter

> Especificación original pegada por el usuario al arrancar el proyecto.
> Se guarda tal cual para referencia futura del plan y los requisitos.

Quiero construir una aplicación web llamada "DevCenter".

El proyecto combina dos conceptos:

1. DEV TOOLBOX
   Una colección de herramientas útiles para desarrolladores.
   
2. COMMAND CENTER
   Un dashboard personal privado para centralizar tareas, notas, proyectos,
   links, actividad y accesos rápidos a las herramientas.

El objetivo es construir una aplicación que pueda utilizar diariamente y que
también sirva como proyecto para aprender y aplicar buenas prácticas de
Vue 3, TypeScript, Node.js, Express, PostgreSQL, Docker, OAuth, i18n,
Playwright y diseño de interfaces con PrimeVue.

==================================================
STACK
==================================================

Frontend:
- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia cuando realmente sea necesario
- TanStack Query para comunicación con API
- PrimeVue como librería principal de componentes
- PrimeIcons
- Vue I18n
- CSS moderno / CSS variables
- Diseño responsive
- Dark mode

Backend:
- Node.js
- TypeScript
- Express
- API REST
- Zod para validación
- Arquitectura modular

Database:
- Neon PostgreSQL
- ORM: Prisma

Authentication:
- Google OAuth 2.0
- Login mediante cuenta Google
- Cada usuario debe tener sus propios datos privados
- Ningún usuario puede acceder a datos de otro usuario

Infrastructure:
- Docker
- Docker Compose para desarrollo local
- El proyecto debe estar dockerizado desde el primer momento
- El deployment final será en Render
- La base de datos de producción será Neon

Testing:
- Playwright para E2E
- Vitest para unit tests cuando corresponda

==================================================
PRINCIPIOS GENERALES
==================================================

Quiero un proyecto profesional y mantenible.

NO generar un monolito de código desordenado.

Separar claramente:

frontend/
backend/

Utilizar TypeScript strict.

Evitar any salvo casos realmente justificados.

Aplicar separación de responsabilidades.

No duplicar lógica.

No crear abstracciones innecesarias.

Priorizar código sencillo y legible.

Todas las variables, funciones, clases y componentes deben utilizar nombres
claros y consistentes.

Los textos visibles para el usuario NO deben estar hardcodeados.

Todos los textos deben pasar por Vue I18n.

El idioma por defecto será español.

Idiomas soportados:

- es
- en

Debe existir un selector de idioma.

==================================================
ESTRUCTURA INICIAL
==================================================

Crear una estructura similar a:

/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── views/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── composables/
│   │   ├── services/
│   │   ├── locales/
│   │   │   ├── es.ts
│   │   │   └── en.ts
│   │   └── types/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── tasks/
│   │   │   ├── notes/
│   │   │   ├── projects/
│   │   │   ├── links/
│   │   │   └── activity/
│   │   ├── db/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.ts
│   └── ...
│
├── tests/
│   └── e2e/
│
├── docker-compose.yml
├── README.md
└── .env.example

La estructura puede adaptarse si existe una razón técnica clara.

==================================================
DOCKER
==================================================

Dockerizar el proyecto desde el inicio.

Crear:

- Dockerfile frontend
- Dockerfile backend
- docker-compose.yml
- .dockerignore

El entorno local debe poder iniciarse mediante:

docker compose up

No depender de instalaciones locales específicas salvo Docker.

No incluir secretos dentro de Dockerfiles.

Utilizar .env.example.

Las variables sensibles deben quedar fuera del repositorio.

==================================================
AUTHENTICATION
==================================================

Implementar autenticación mediante Google OAuth 2.0.

El usuario debe poder:

- iniciar sesión con Google
- cerrar sesión
- consultar su usuario actual
- mantener sesión
- acceder únicamente a sus propios datos

Crear una entidad User.

Información mínima:

User:
- id
- googleId
- email
- name
- avatarUrl
- createdAt
- updatedAt

No permitir que un usuario consulte registros pertenecientes a otro usuario.

Todas las entidades privadas deben tener una relación con User.

El backend debe validar la identidad del usuario en cada endpoint privado.

No confiar en un userId enviado desde el frontend.

El backend debe obtener el usuario autenticado desde la sesión/token.

==================================================
DATABASE
==================================================

Usar Prisma + PostgreSQL.

Preparar Prisma para Neon.

Crear migraciones.

Entidades iniciales:

User

Task

Note

Project

Link

Activity

FavoriteTool

RecentTool

La estructura exacta puede ajustarse si es necesario.

==================================================
COMMAND CENTER
==================================================

Crear un dashboard principal después del login.

Debe ser una pantalla realmente útil para el día a día.

Layout:

Sidebar
+
Topbar
+
Main content

Sidebar:

- Command Center
- Tasks
- Notes
- Projects
- Links
- Dev Toolbox
- Favorites
- Settings

Topbar:

- búsqueda
- command palette
- idioma
- theme
- avatar
- logout

Dashboard:

--------------------------------------------------
GOOD MORNING / BUENOS DÍAS
--------------------------------------------------

Mostrar:

- fecha actual
- tareas pendientes
- tareas vencidas
- tareas para hoy
- proyectos activos
- notas recientes
- herramientas recientes

Cards:

Tasks
Projects
Notes
Recent Tools

==================================================
TASKS
==================================================

Sistema completo de tareas.

Una Task debe soportar:

- title
- description
- status
- priority
- dueDate
- project
- tags
- createdAt
- updatedAt

Estados:

- TODO
- IN_PROGRESS
- DONE

Prioridades:

- LOW
- MEDIUM
- HIGH

Funcionalidades:

- crear
- editar
- eliminar
- completar
- cambiar estado
- cambiar prioridad
- asignar proyecto
- filtrar
- buscar
- ordenar
- visualizar tareas vencidas
- visualizar tareas de hoy

Crear:

- Task list
- Task detail
- Create/Edit dialog

Agregar filtros y estados vacíos.

==================================================
NOTES
==================================================

Sistema de notas privadas.

Crear:

- título
- contenido
- tags
- fecha
- favoritos

Permitir:

- crear
- editar
- eliminar
- buscar
- filtrar
- marcar favorito

El editor debe ser cómodo para notas técnicas.

Soportar Markdown.

Preview Markdown.

==================================================
PROJECTS
==================================================

Permitir crear proyectos personales.

Project:

- name
- description
- status
- color/icon
- startDate
- endDate
- createdAt

Estados:

- ACTIVE
- PAUSED
- COMPLETED
- ARCHIVED

Cada proyecto debe poder mostrar:

- tareas
- notas
- links
- actividad relacionada

==================================================
LINKS
==================================================

Crear un gestor de links.

Permitir guardar:

- title
- URL
- description
- category
- tags
- favorite

Ejemplos:

AWS
GitHub
Laravel
Vue
NestJS
Documentación
Tutoriales

Agregar búsqueda y filtros.

==================================================
DEV TOOLBOX
==================================================

Crear una sección independiente llamada:

Dev Toolbox

Debe contener inicialmente:

├── JSON
├── JWT
├── UUID
├── Regex
├── Timestamp
├── Cron
├── Base64
├── URL Encoder
├── SQL Formatter
├── Diff
├── Hash
├── Color
├── Markdown
└── HTTP

==================================================
REGLA IMPORTANTE PARA DEVTOOLS
==================================================

Siempre que una herramienta pueda ejecutarse de forma segura en el navegador
sin necesidad de backend, implementarla en FRONTEND.

No enviar información sensible al backend innecesariamente.

Especialmente:

- JWT
- JSON
- Base64
- URL Encoder
- Hash
- Regex
- UUID
- Timestamp
- Color
- Diff
- Markdown
- SQL Formatter

deben intentar ejecutarse completamente en frontend.

El backend solo debe utilizarse cuando realmente sea necesario.

==================================================
JSON TOOL
==================================================

Crear una herramienta profesional para trabajar con JSON.

Funciones:

- format
- minify
- validate
- sort keys
- copy
- clear

Layout preferido:

Editor izquierdo
Resultado derecho

Mostrar errores de parsing claramente.

Agregar shortcuts si es posible.

==================================================
JWT TOOL
==================================================

Permitir pegar un JWT.

Mostrar:

HEADER
PAYLOAD
SIGNATURE

Decodificar localmente.

Mostrar:

- algorithm
- issuer
- subject
- expiration
- issued at
- claims

Mostrar advertencia clara:

"Decoding a JWT does not verify its signature."

No enviar JWT al backend.

==================================================
UUID TOOL
==================================================

Generar UUID.

Soportar:

- UUID v4

Permitir:

- generar uno
- generar múltiples
- copiar
- limpiar

==================================================
REGEX TOOL
==================================================

Crear:

Regex
Input text

Mostrar:

- matches
- groups
- match count

Permitir flags:

g
i
m
s
u

Mostrar errores de regex.

==================================================
TIMESTAMP TOOL
==================================================

Convertir:

Unix timestamp
↔
Date

Soportar:

- seconds
- milliseconds

Mostrar:

- local time
- UTC
- ISO 8601

==================================================
CRON TOOL
==================================================

Permitir introducir una expresión cron.

Mostrar una explicación legible.

Ejemplo:

0 9 * * 1-5

→ Every weekday at 09:00

Agregar presets comunes.

==================================================
BASE64 TOOL
==================================================

Soportar:

Encode
Decode

Texto ↔ Base64

Todo local.

==================================================
URL ENCODER
==================================================

Soportar:

- encode
- decode

Mostrar resultado en tiempo real.

==================================================
SQL FORMATTER
==================================================

Editor SQL.

Funciones:

- format
- minify si es viable
- copy

No ejecutar SQL contra ninguna base de datos.

La herramienta debe ser únicamente formatter/parser.

==================================================
DIFF TOOL
==================================================

Dos editores:

Original
Modified

Mostrar diferencias visualmente.

Soportar:

- texto
- JSON

Agregar:

Swap
Clear
Copy

==================================================
HASH TOOL
==================================================

Permitir generar hashes localmente.

Soportar como mínimo:

- SHA-256
- SHA-384
- SHA-512

Si es técnicamente viable:

- MD5

Advertir si un algoritmo es considerado inseguro.

Nunca enviar el contenido al backend.

==================================================
COLOR TOOL
==================================================

Input:

HEX

Mostrar:

- HEX
- RGB
- HSL

Agregar color picker.

Mostrar variantes:

- lighter
- darker
- complementary

Permitir copiar valores.

==================================================
MARKDOWN TOOL
==================================================

Editor Markdown.

Split view:

Editor
Preview

Soportar:

- headings
- bold
- italic
- links
- lists
- code
- tables

Agregar copy/export si es sencillo.

==================================================
HTTP TOOL
==================================================

Crear un cliente HTTP sencillo estilo Postman.

Permitir:

GET
POST
PUT
PATCH
DELETE

Campos:

URL
Headers
Query Params
Body

Mostrar:

- status
- headers
- response
- response time

IMPORTANTE:

Analizar cuidadosamente CORS y seguridad.

No crear un proxy backend inseguro que permita SSRF.

Inicialmente priorizar requests permitidos desde el navegador.

Si se necesita backend para determinadas funcionalidades, implementar
protecciones explícitas contra SSRF y acceso a redes internas.

==================================================
FAVORITES
==================================================

El usuario puede marcar DevTools como favoritas.

Mostrar:

Favorites

en:

- Sidebar
- Dashboard

==================================================
RECENT TOOLS
==================================================

Guardar las herramientas utilizadas recientemente.

Ejemplo:

Recent

JSON
JWT
Timestamp
Diff

Esto puede persistirse por usuario.

==================================================
COMMAND PALETTE
==================================================

Implementar:

Ctrl + K

Mac:
Cmd + K

Permitir buscar:

Tools
Tasks
Notes
Projects
Links

Ejemplos:

"JWT"
"new task"
"create note"
"JSON"
"projects"

Debe ser rápida y navegable mediante teclado.

==================================================
DESIGN SYSTEM
==================================================

Usar PrimeVue como base.

No utilizar múltiples librerías de componentes que compitan entre sí.

Definir un sistema visual consistente.

Debe sentirse como una aplicación SaaS moderna para developers.

Inspiración conceptual:

Linear
Raycast
Vercel
GitHub
Notion

NO copiar interfaces literalmente.

Características:

- limpio
- profesional
- moderno
- alta densidad de información
- excelente tipografía
- buen spacing
- buen contraste
- responsive
- dark mode

Utilizar:

- Cards
- DataTable
- Dialog
- Drawer
- Tabs
- Select
- Input
- Button
- Toast
- Tooltip
- Skeleton
- Tag
- Badge
- Menu
- Command interface cuando sea necesario

==================================================
IMPECCABLE
==================================================

Diseñar la UI pensando en que será iterada utilizando Impeccable.

Los componentes deben ser claros y fácilmente modificables.

Evitar estilos inline innecesarios.

Centralizar tokens:

- spacing
- border radius
- typography
- colors
- shadows

Crear variables CSS para el design system.

Debe ser fácil modificar globalmente:

- accent color
- radius
- spacing
- typography

==================================================
I18N
==================================================

Idioma por defecto:

Español

Idioma secundario:

English

Todo texto visible debe utilizar i18n.

No hacer:

<button>Guardar</button>

Hacer:

<button>{{ t('common.save') }}</button>

Mantener los archivos:

locales/es.ts
locales/en.ts

La estructura de las traducciones debe ser equivalente.

==================================================
RESPONSIVE
==================================================

La aplicación debe funcionar correctamente en:

Desktop
Tablet
Mobile

En mobile:

Sidebar debe convertirse en navegación apropiada.

DataTables deben tener comportamiento responsive.

Los DevTools deben adaptarse correctamente.

==================================================
SECURITY
==================================================

Aplicar buenas prácticas desde el inicio.

- Validación backend con Zod
- Sanitización cuando corresponda
- CORS correctamente configurado
- Helmet
- Rate limiting para endpoints sensibles
- No exponer secrets
- No almacenar OAuth secrets en frontend
- No loguear tokens
- No almacenar información sensible innecesariamente
- Control estricto de ownership de recursos
- Prepared queries / Prisma
- HTTPS en producción
- Cookies seguras si se utiliza autenticación basada en sesión

==================================================
API
==================================================

Crear API REST consistente.

Ejemplos:

GET    /api/me

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/notes
POST   /api/notes
PATCH  /api/notes/:id
DELETE /api/notes/:id

GET    /api/projects
POST   /api/projects

GET    /api/links
POST   /api/links

GET    /api/activity

GET    /api/tools/recent
POST   /api/tools/recent

GET    /api/tools/favorites
POST   /api/tools/favorites
DELETE /api/tools/favorites/:tool

==================================================
ERROR HANDLING
==================================================

Implementar manejo consistente de errores.

Backend:

{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task not found"
  }
}

No devolver stack traces al frontend en producción.

Frontend:

Mostrar errores amigables mediante Toast/Message.

Crear estados:

- loading
- empty
- error
- success

para las pantallas apropiadas.

==================================================
PLAYWRIGHT
==================================================

Desde el inicio crear E2E tests.

No dejar Playwright para el final.

Crear tests para:

AUTH

- login
- authenticated dashboard
- logout

TASKS

- create task
- edit task
- complete task
- delete task
- filter task

NOTES

- create note
- edit note
- delete note

PROJECTS

- create project

DEVTOOLS

- JSON formatting
- JWT decoding
- UUID generation
- timestamp conversion
- Base64 encode/decode
- regex matching
- diff
- color conversion
- markdown preview

COMMAND CENTER

- dashboard loads
- command palette opens
- search tool
- navigate using keyboard

I18N

- switch Spanish → English
- switch English → Spanish

THEME

- switch light/dark

Los tests deben utilizar locators robustos:

Preferir:

getByRole()
getByLabel()
getByText()
getByPlaceholder()

Evitar selectores CSS frágiles.

==================================================
TESTABILITY
==================================================

Construir componentes pensando en testing.

Cuando sea necesario utilizar:

data-testid

pero preferir accesibilidad y roles antes que test IDs.

Todos los formularios deben tener labels accesibles.

Los botones deben tener nombres claros.

==================================================
PERFORMANCE
==================================================

Las DevTools frontend no deben realizar requests innecesarios.

Lazy load de las vistas de herramientas cuando sea apropiado.

No cargar todas las herramientas pesadas al iniciar la aplicación.

El dashboard debe cargar rápidamente.

==================================================
ACCESSIBILITY
==================================================

Utilizar HTML semántico.

Los controles deben poder utilizarse mediante teclado.

Agregar:

- aria-label cuando corresponda
- focus states
- keyboard navigation

El Command Palette debe ser completamente navegable mediante teclado.

==================================================
LOGGING
==================================================

Backend:

Utilizar un logger estructurado.

No usar console.log indiscriminadamente.

Nunca imprimir:

- OAuth tokens
- cookies
- passwords
- secrets

==================================================
ENVIRONMENT
==================================================

Crear:

.env.example

con variables similares a:

DATABASE_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

SESSION_SECRET=

FRONTEND_URL=
BACKEND_URL=

NODE_ENV=

Nunca incluir valores reales.

==================================================
RENDER
==================================================

Preparar el proyecto para Render.

El deployment final será:

Frontend
Backend
Neon PostgreSQL

El proyecto debe documentar claramente cómo desplegarlo.

Crear README con:

1. Requisitos
2. Desarrollo con Docker
3. Variables de entorno
4. Configuración de Google OAuth
5. Configuración de Neon
6. Migraciones Prisma
7. Ejecutar tests
8. Ejecutar Playwright
9. Build
10. Deploy en Render

==================================================
DESARROLLO POR FASES
==================================================

NO intentes implementar toda la aplicación de una sola vez.

Trabajar por fases.

FASE 1
──────

Scaffold completo.

- Vue
- Express
- TypeScript
- Docker
- Docker Compose
- Prisma
- Neon configuration
- PrimeVue
- Vue Router
- Vue I18n
- Playwright
- Vitest
- ESLint
- Prettier

Crear README.

Verificar que todo compile.

==================================================

FASE 2
──────

Authentication.

- Google OAuth
- User
- session
- protected routes
- logout

Crear tests.

==================================================

FASE 3
──────

Design system + layout.

- Sidebar
- Topbar
- responsive navigation
- theme
- language switcher
- Command Palette

Todavía sin implementar todos los módulos.

==================================================

FASE 4
──────

Command Center.

- Dashboard
- Tasks
- Notes
- Projects
- Links
- Activity

Crear CRUD completo.

Agregar E2E tests.

==================================================

FASE 5
──────

Dev Toolbox.

Implementar las herramientas una por una.

Orden:

1 JSON
2 JWT
3 UUID
4 Timestamp
5 Base64
6 URL Encoder
7 Regex
8 Hash
9 Diff
10 Color
11 Markdown
12 SQL Formatter
13 Cron
14 HTTP

Cada herramienta debe tener:

- UI
- lógica
- estados
- responsive
- i18n
- tests
- favorite
- recent tool tracking cuando corresponda

==================================================

FASE 6
──────

Polish.

- empty states
- loading states
- animaciones sutiles
- keyboard shortcuts
- responsive
- accessibility
- performance
- visual consistency

==================================================
REGLA FUNDAMENTAL DE IMPLEMENTACIÓN
==================================================

Después de cada fase:

1. Ejecutar TypeScript checks.
2. Ejecutar lint.
3. Ejecutar unit tests.
4. Ejecutar Playwright cuando corresponda.
5. Corregir errores.
6. Revisar la implementación.
7. Solo después continuar.

No avanzar dejando errores conocidos.

==================================================
GIT
==================================================

Crear commits pequeños y descriptivos.

Ejemplos:

feat(auth): add Google OAuth
feat(tasks): add task CRUD
feat(devtools): add JSON formatter
feat(devtools): add JWT decoder
feat(ui): add command palette
test(tasks): add task E2E tests

No realizar commits con:

- secrets
- .env
- node_modules
- build artifacts

==================================================
IMPORTANTE
==================================================

Antes de comenzar a escribir código:

1. Analiza los requisitos.
2. Identifica posibles problemas arquitectónicos.
3. Propón la estructura definitiva.
4. Identifica dependencias necesarias.
5. Identifica qué funcionalidades serán frontend-only.
6. Identifica riesgos de seguridad.
7. Identifica cómo funcionará Google OAuth en local y producción.
8. Identifica cómo se desplegará Express en Render.
9. Identifica cualquier incompatibilidad entre las tecnologías elegidas.
10. Presenta un plan de implementación.

NO empieces creando todas las funcionalidades inmediatamente.

Primero presenta el plan.

Después de mi aprobación, comienza con FASE 1.

Durante el desarrollo, si encontrás una decisión técnica importante que pueda
afectar arquitectura, seguridad, costos o deployment, detenerte y explicarla
antes de continuar.

El objetivo no es solamente "hacer que funcione".

Quiero que el resultado sea un proyecto profesional, mantenible, testeable,
responsive y agradable de utilizar diariamente.
