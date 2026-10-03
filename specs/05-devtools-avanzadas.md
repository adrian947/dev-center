# SPEC 05 — Dev Toolbox: herramientas avanzadas (regex, diff, markdown, cron)

> **Status:** Borrador
> **Depends on:** SPEC 01
> **Date:** 2026-10-03
> **Objective:** Implementar 4 herramientas interactivas (Regex tester, Diff, Markdown preview, Cron parser) que corren 100% en el navegador.

## Alcance

**Entra:**

- Las 4 tools de la tabla de abajo con UI, lógica pura, estados vacío/error, responsive, i18n es/en, tests vitest y un smoke e2e.
- Alta de la ruta y de `route` en `DEV_TOOLS` para cada tool.
- Dependencias nuevas en `frontend`: `diff`, `marked`, `dompurify`, `cron-parser`, `cronstrue`, con carga dinámica.

**Fuera de alcance (para specs futuros):**

- Cliente HTTP (`http`) y One-Time Secret (`oneTimeSecret`): requieren backend.
- Diff de archivos subidos, diff de tres vías o merge.
- Markdown con extensiones (Mermaid, matemáticas, resaltado de código por lenguaje).
- Cron de Quartz/Spring con segundos o años; solo cron estándar de 5 campos.
- Cualquier envío de contenido al backend.
- Tools de los specs 02, 03 y 04.

## Modelo de datos

Esta feature no introduce estructuras de datos persistentes. Estado local en memoria por tool. Reutiliza `ToolLayout` y `useToolUsage` del SPEC 01.

| `id`       | Ruta                | Vista               | Lógica                          | Librería                       |
| ---------- | ------------------- | ------------------- | ------------------------------- | ------------------------------ |
| `regex`    | `/devtools/regex`   | `RegexView.vue`     | `utils/devtools/regex.ts`       | nativa (`RegExp`)              |
| `diff`     | `/devtools/diff`    | `DiffView.vue`      | `utils/devtools/diff.ts`        | `diff`                         |
| `markdown` | `/devtools/markdown`| `MarkdownView.vue`  | `utils/devtools/markdown.ts`    | `marked`, `dompurify`          |
| `cron`     | `/devtools/cron`    | `CronView.vue`      | `utils/devtools/cron.ts`        | `cron-parser`, `cronstrue`     |

Contrato funcional por tool:

- **Regex:** campos "regex" y "texto de prueba"; flags `g i m s u` como toggles; muestra cantidad de matches, cada match con índice y grupos (numerados y nombrados); resalta los matches en el texto; error de sintaxis visible sin romper la vista; protección ante regex catastrófica (ver Riesgos).
- **Diff:** dos textos (original y modificado); modos línea, palabra y carácter; vista unificada y lado a lado; contadores de líneas agregadas/eliminadas; opción de ignorar espacios en blanco.
- **Markdown:** editor y vista previa en vivo; HTML renderizado siempre sanitizado con DOMPurify; botón copiar HTML; en pantallas angostas, pestañas Editor/Vista previa.
- **Cron:** expresión de 5 campos; descripción en lenguaje natural según el idioma de la app (es/en); próximas 10 ejecuciones en zona local o UTC (selector); error por expresión inválida.

## Plan de implementación

1. Agregar `route` a las 4 entradas de `DEV_TOOLS` y las 4 rutas con vista mínima sobre `ToolLayout`.
2. Regex: lógica + tests (flags, grupos nombrados, sin matches, regex inválida, regex vacía), vista con resaltado, i18n.
3. Instalar `diff`; Diff: lógica + tests (líneas/palabras/carácter, ignorar espacios), vista unificada y lado a lado, i18n.
4. Instalar `marked` y `dompurify`; Markdown: lógica + tests (render básico, sanitización de `<script>` y `onerror`), vista con pestañas responsive, i18n.
5. Instalar `cron-parser` y `cronstrue`; Cron: lógica + tests (`*/5 * * * *`, `0 9 * * 1-5`, inválida), vista, i18n.
6. Un smoke e2e por tool en `tests/e2e/devtools/<id>.spec.ts`.

Cada ítem 2–5 es un commit propio.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint` y `npm run test` pasan.
- [ ] Las 4 cards muestran "Disponible" y navegan a su ruta.
- [ ] Ninguna de las 4 vistas envía el contenido del usuario por red (solo el `POST /api/tools/recent` del SPEC 01).
- [ ] Regex: `(?<y>\d{4})-(\d{2})` con flag `g` sobre `2024-05 y 2025-06` muestra 2 matches, con el grupo nombrado `y` y el grupo 2 en cada uno.
- [ ] Regex: `(` muestra un error de sintaxis y la vista sigue operativa.
- [ ] Regex: alternar el flag `i` cambia la cantidad de matches en un texto con mayúsculas y minúsculas.
- [ ] Diff: `a\nb` contra `a\nc` en modo línea muestra 1 línea eliminada y 1 agregada.
- [ ] Diff: con "ignorar espacios", `a  b` y `a b` no producen diferencias.
- [ ] Markdown: `# Hola` renderiza un `<h1>`; `<script>alert(1)</script>` y `<img src=x onerror=alert(1)>` no producen elementos ejecutables en la vista previa.
- [ ] Cron: `*/5 * * * *` muestra una descripción "cada 5 minutos" (es) / "Every 5 minutes" (en) y 10 próximas ejecuciones separadas por 5 minutos.
- [ ] Cron: `61 * * * *` muestra error y no rompe la vista.
- [ ] `diff`, `marked`, `dompurify`, `cron-parser` y `cronstrue` están en chunks separados en `vite build`.
- [ ] Cada vista tiene estado vacío, claves i18n en es y en, y no desborda a 375 px de ancho.
- [ ] Cada tool tiene al menos un test vitest de su lógica y un smoke e2e que pasa.

## Decisiones

- **Sí:** `marked` + `DOMPurify`. El markdown del usuario se renderiza como HTML; sin sanitizar sería un vector XSS.
- **No:** `v-html` sin sanitizar. Nunca, ni para entrada propia.
- **Sí:** `RegExp` nativa para Regex. Es el motor que usará el código JS real del usuario.
- **Sí:** `diff` por la calidad de su algoritmo y modos línea/palabra/carácter.
- **Sí:** `cron-parser` + `cronstrue` en vez de parsear a mano. Cron tiene casos borde (rangos, pasos, nombres) y la descripción localizada es trabajo ya resuelto.
- **No:** cron de 6/7 campos (Quartz). Un dialecto distinto; spec propio si se necesita.
- **Sí:** todo en frontend. Regla del plan inicial.

## Riesgos

| Riesgo                                                      | Mitigación                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Regex catastrófica (backtracking) congela la pestaña        | Ejecutar en un Web Worker con tiempo límite (ej. 1 s) y botón de cancelar; aviso "tiempo excedido". |
| XSS por el HTML renderizado de Markdown                     | Sanitizar siempre con DOMPurify y test con `<script>` y `onerror`.                 |
| Diff sobre textos enormes lento                             | Límite de entrada de 1 MB por lado con aviso visible.                              |
| Descripción de cron no existe en el idioma pedido           | `cronstrue` soporta `es` y `en`; si falla la carga del locale, caer a inglés.      |

## Lo que **no** está en este spec

- Cliente HTTP y One-Time Secret.
- Diff de archivos, tres vías o merge.
- Markdown con Mermaid, matemáticas o resaltado de código.
- Cron Quartz/Spring.
- Tools de texto/datos, seguridad y conversores.

Cada uno de esos, si llega, va en su propio spec.
