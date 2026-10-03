# SPEC 02 — Dev Toolbox: herramientas de texto y datos

> **Status:** Aprobado.
> **Depends on:** SPEC 01
> **Date:** 2026-10-03
> **Objective:** Implementar 8 herramientas de texto y datos (JSON, Base64, URL, entidades HTML, casing, CSV/JSON/YAML, minificador/beautifier, SQL) que corren 100% en el navegador.

## Alcance

**Entra:**

- Las 8 tools de la tabla de abajo, cada una con UI, lógica pura, estados vacío/error, responsive, i18n es/en, tests vitest y un smoke e2e.
- Alta de la ruta y de `route` en `DEV_TOOLS` para cada tool (pasan de "Próximamente" a "Disponible").
- Dependencias nuevas en `frontend`: `sql-formatter`, `yaml`, `papaparse`, `js-beautify`, `terser`, `csso`, `html-minifier-terser`, con carga dinámica (`import()`) dentro de la vista o de la lógica.

**Fuera de alcance (para specs futuros):**

- Cualquier envío de contenido al backend.
- Edición con resaltado de sintaxis o editor tipo Monaco.
- Tools de los specs 03, 04 y 05.
- Cliente HTTP y One-Time Secret.
- Guardar historial o contenido de las tools entre sesiones.

## Modelo de datos

Esta feature no introduce estructuras de datos persistentes. Cada tool mantiene estado local en memoria. Reutiliza `ToolLayout` y `useToolUsage` del SPEC 01.

| `id`                  | Ruta                           | Vista                         | Lógica                                    | Librería                                   |
| --------------------- | ------------------------------ | ----------------------------- | ----------------------------------------- | ------------------------------------------ |
| `json`                | `/devtools/json`               | `JsonView.vue`                | `utils/devtools/json.ts`                  | nativa (`JSON`)                            |
| `base64`              | `/devtools/base64`             | `Base64View.vue`              | `utils/devtools/base64.ts`                | nativa (`TextEncoder`/`btoa`)              |
| `urlEncoder`          | `/devtools/url-encoder`        | `UrlEncoderView.vue`          | `utils/devtools/urlEncoder.ts`            | nativa (`encodeURIComponent`, `URL`)       |
| `htmlEntityEscape`    | `/devtools/html-entities`      | `HtmlEntityEscapeView.vue`    | `utils/devtools/htmlEntities.ts`          | a mano                                     |
| `caseConverter`       | `/devtools/case-converter`     | `CaseConverterView.vue`       | `utils/devtools/caseConverter.ts`         | a mano                                     |
| `dataFormatConverter` | `/devtools/data-format`        | `DataFormatConverterView.vue` | `utils/devtools/dataFormat.ts`            | `yaml`, `papaparse`                        |
| `minifierBeautifier`  | `/devtools/minifier-beautifier`| `MinifierBeautifierView.vue`  | `utils/devtools/minifierBeautifier.ts`    | `js-beautify`, `terser`, `csso`, `html-minifier-terser` |
| `sqlFormatter`        | `/devtools/sql-formatter`      | `SqlFormatterView.vue`        | `utils/devtools/sqlFormatter.ts`          | `sql-formatter`                            |

Contrato funcional por tool:

- **JSON:** format (indentación 2/4/tab), minify, validate, sort keys (recursivo), copy, clear. Layout editor izquierdo / resultado derecho. Error de parseo con mensaje y posición (línea/columna cuando el motor la entregue). Atajo `Ctrl/Cmd+Enter` para formatear.
- **Base64:** encode/decode de texto UTF-8, variante URL-safe, error claro ante entrada inválida.
- **URL Encoder:** encode/decode de componente y de URL completa; tabla de query params parseados de una URL pegada.
- **Entidades HTML:** escape/unescape de entidades HTML (`& < > " '` y numéricas) y escape/unescape de string JSON.
- **Casing:** convierte a camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, Title Case y Sentence case; muestra todas las salidas a la vez, cada una con copiar.
- **CSV/JSON/YAML:** conversión entre los tres en cualquier dirección; CSV con encabezado y delimitador configurable (`,` `;` tab); errores de parseo visibles; JSON de entrada debe ser objeto/array para ir a CSV.
- **Minificador/Beautifier:** lenguaje CSS, JS o HTML; acción minify o beautify; muestra tamaño antes/después en bytes y porcentaje de ahorro.
- **SQL:** format con dialecto seleccionable (`sql`, `postgresql`, `mysql`, `sqlite`), mayúsculas de keywords on/off, indentación 2/4.

## Plan de implementación

1. Agregar `route` a las 8 entradas de `DEV_TOOLS` y las 8 rutas en `frontend/src/router/index.ts` (carga perezosa) apuntando a una vista mínima con `ToolLayout`. Las cards pasan a "Disponible".
2. JSON: lógica pura + tests, luego `JsonView.vue`, i18n es/en.
3. Base64: lógica + tests, vista, i18n.
4. URL Encoder: lógica + tests, vista, i18n.
5. Entidades HTML: lógica + tests, vista, i18n.
6. Casing: lógica + tests (incluye acrónimos, números, separadores mixtos), vista, i18n.
7. Instalar `yaml` y `papaparse`; CSV/JSON/YAML: lógica + tests, vista, i18n.
8. Instalar `sql-formatter`; SQL: lógica + tests, vista, i18n.
9. Instalar `js-beautify`, `terser`, `csso`, `html-minifier-terser`; Minificador/Beautifier: lógica + tests, vista, i18n.
10. Un smoke e2e por tool en `tests/e2e/devtools/<id>.spec.ts` (abre la ruta, ejecuta la acción principal, verifica salida).

Cada ítem 2–9 es un commit propio e incluye test unitario antes de pasar al siguiente.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint` y `npm run test` pasan.
- [ ] Las 8 cards muestran "Disponible" y navegan a su ruta.
- [ ] Abrir cualquiera de las 8 vistas con la red de DevTools abierta no genera ninguna petición con el contenido del usuario (solo el `POST /api/tools/recent` del SPEC 01).
- [ ] JSON: `{"b":1,"a":2}` con "sort keys" produce `{"a":2,"b":1}`; `{a:1}` muestra un error de parseo.
- [ ] Base64: `héllo` → `aMOpbGxv` → `héllo`; entrada `@@@` muestra error en decode.
- [ ] URL Encoder: `https://x.com/?q=a b&r=1` lista dos params `q=a b` y `r=1`.
- [ ] Entidades HTML: `<a href="x">&</a>` escapa a `&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;` y vuelve al original.
- [ ] Casing: `hello world foo` produce `helloWorldFoo`, `HelloWorldFoo`, `hello_world_foo`, `hello-world-foo`, `HELLO_WORLD_FOO`.
- [ ] CSV/JSON/YAML: un CSV de 2 filas con encabezado se convierte a un array JSON de 2 objetos y de vuelta al mismo CSV.
- [ ] SQL: `select a,b from t where x=1` se formatea en varias líneas con keywords en mayúscula.
- [ ] Minificador: minificar CSS con comentarios y espacios muestra tamaño final menor al inicial.
- [ ] Las librerías pesadas (`terser`, `js-beautify`, `csso`, `html-minifier-terser`, `sql-formatter`, `yaml`, `papaparse`) no están en el bundle inicial: aparecen en chunks separados en `vite build`.
- [ ] Cada vista tiene estado vacío, usa claves i18n en es y en, y no desborda a 375 px de ancho.
- [ ] Cada tool tiene al menos un test vitest de su lógica y un smoke e2e que pasa.

## Decisiones

- **Sí:** librerías ligeras con carga dinámica para SQL, YAML, CSV y minificación. Reimplementar esos parsers es más riesgo que dependencia.
- **No:** cero dependencias. Descartado por riesgo en SQL/YAML/CSV.
- **Sí:** lógica pura separada de la vista en `utils/devtools/`. Permite test unitario sin montar componentes.
- **Sí:** todo en frontend. Regla del plan inicial: nada sensible al backend.
- **Sí:** Minificador cubre CSS, JS y HTML con una librería por lenguaje. Cada una es la referencia de su lenguaje; se cargan solo al elegir ese lenguaje.
- **No:** editor con resaltado (Monaco/CodeMirror). Peso y complejidad; `textarea` monoespaciada alcanza.
- **Sí:** un commit por tool. Revisión y rollback acotados.

## Riesgos

| Riesgo                                              | Mitigación                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| `terser` y `html-minifier-terser` pesan y usan APIs de Node | Importar solo al elegir el lenguaje; si alguna no corre en navegador, verificar en el paso 9 y sustituir antes de seguir. |
| Entradas enormes bloquean la UI                     | Límite de entrada de 2 MB con aviso visible; sin trabajo en cada pulsación (acción explícita). |
| `btoa` falla con caracteres no Latin-1              | Codificar con `TextEncoder` antes de `btoa` (cubierto por test con `héllo` y emoji). |

## Lo que **no** está en este spec

- Envío de contenido al backend.
- Editor con resaltado de sintaxis.
- Tools de seguridad, conversores, regex/diff/markdown/cron.
- Cliente HTTP y One-Time Secret.

Cada uno de esos, si llega, va en su propio spec.
