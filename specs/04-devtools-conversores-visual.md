# SPEC 04 — Dev Toolbox: conversores y herramientas visuales

> **Status:** Borrador
> **Depends on:** SPEC 01
> **Date:** 2026-10-03
> **Objective:** Implementar 7 herramientas de conversión y análisis (timestamp, bases numéricas, unidades, color, contraste WCAG, CIDR, User-Agent) que corren 100% en el navegador.

## Alcance

**Entra:**

- Las 7 tools de la tabla de abajo con UI, lógica pura, estados vacío/error, responsive, i18n es/en, tests vitest y un smoke e2e.
- Alta de la ruta y de `route` en `DEV_TOOLS` para cada tool.
- Dependencia nueva en `frontend`: `ua-parser-js`, con carga dinámica.

**Fuera de alcance (para specs futuros):**

- CIDR sobre IPv6 (solo IPv4).
- Espacios de color avanzados (LAB, LCH, OKLCH, CMYK) y selector de paletas.
- Conversión de monedas o cualquier unidad que requiera datos externos.
- Cualquier envío de contenido al backend.
- Tools de los specs 02, 03 y 05.

## Modelo de datos

Esta feature no introduce estructuras de datos persistentes. Estado local en memoria por tool. Reutiliza `ToolLayout` y `useToolUsage` del SPEC 01.

| `id`                  | Ruta                         | Vista                       | Lógica                                | Librería       |
| --------------------- | ---------------------------- | --------------------------- | ------------------------------------- | -------------- |
| `timestamp`           | `/devtools/timestamp`        | `TimestampView.vue`         | `utils/devtools/timestamp.ts`         | nativa (`Intl`, `Date`) |
| `numberBaseConverter` | `/devtools/number-base`      | `NumberBaseConverterView.vue` | `utils/devtools/numberBase.ts`      | nativa (`BigInt`) |
| `unitConverter`       | `/devtools/unit-converter`   | `UnitConverterView.vue`     | `utils/devtools/units.ts`             | a mano         |
| `color`               | `/devtools/color`            | `ColorView.vue`             | `utils/devtools/color.ts`             | a mano         |
| `colorContrast`       | `/devtools/color-contrast`   | `ColorContrastView.vue`     | `utils/devtools/colorContrast.ts`     | a mano         |
| `cidrCalculator`      | `/devtools/cidr`             | `CidrCalculatorView.vue`    | `utils/devtools/cidr.ts`              | a mano         |
| `userAgentParser`     | `/devtools/user-agent`       | `UserAgentParserView.vue`   | `utils/devtools/userAgent.ts`         | `ua-parser-js` |

Contrato funcional por tool:

- **Timestamp:** Unix ↔ fecha. Entrada en segundos o milisegundos (selector, con autodetección sugerida por magnitud). Muestra hora local, UTC e ISO 8601. Botón "Ahora". Entrada de fecha→timestamp con campo fecha/hora y zona local o UTC.
- **Bases numéricas:** entero (soporta valores mayores a 2^53 con `BigInt`) entre binario, octal, decimal y hexadecimal, más base personalizada 2–36; todas las salidas a la vez; error ante dígitos inválidos para la base de entrada.
- **Unidades:** categorías longitud, masa, volumen, temperatura, tiempo, datos digitales (decimal y binario: KB/KiB…), velocidad; selector de unidad origen/destino, intercambio, resultado con precisión configurable.
- **Color:** entrada HEX (3/4/6/8 dígitos), RGB(A) o HSL(A); salida en las tres notaciones con copiar; selector nativo `<input type="color">` y vista previa.
- **Contraste WCAG:** dos colores (texto y fondo); muestra ratio con dos decimales y estado AA/AAA para texto normal y grande; vista previa del par.
- **CIDR:** IPv4 con prefijo (`192.168.1.0/24`); muestra máscara, wildcard, red, broadcast, primer y último host, cantidad de hosts y el prefijo en binario; error ante IP o prefijo inválidos.
- **User-Agent:** pegar un UA; muestra navegador, versión, motor, sistema operativo, dispositivo y arquitectura; botón "Usar el de este navegador".

## Plan de implementación

1. Agregar `route` a las 7 entradas de `DEV_TOOLS` y las 7 rutas con vista mínima sobre `ToolLayout`.
2. Timestamp: lógica + tests (segundos vs ms, `0`, fechas inválidas, zona UTC), vista, i18n.
3. Bases numéricas: lógica + tests (`255`, valores > 2^53, base 36, dígitos inválidos), vista, i18n.
4. Unidades: lógica + tests por categoría (incluye temperatura, que no es lineal pura), vista, i18n.
5. Color: lógica + tests de ida y vuelta HEX↔RGB↔HSL, vista, i18n.
6. Contraste: lógica + tests con pares de ratio conocido, vista, i18n.
7. CIDR: lógica + tests (`/24`, `/32`, `/31`, `/0`, entradas inválidas), vista, i18n.
8. User-Agent: instalar `ua-parser-js`; lógica + tests con UAs de ejemplo, vista, i18n.
9. Un smoke e2e por tool en `tests/e2e/devtools/<id>.spec.ts`.

Cada ítem 2–8 es un commit propio.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint` y `npm run test` pasan.
- [ ] Las 7 cards muestran "Disponible" y navegan a su ruta.
- [ ] Ninguna de las 7 vistas envía el contenido del usuario por red (solo el `POST /api/tools/recent` del SPEC 01).
- [ ] Timestamp: `0` en segundos muestra UTC `1970-01-01` y ISO `1970-01-01T00:00:00.000Z`.
- [ ] Timestamp: `1700000000000` en milisegundos y `1700000000` en segundos muestran la misma fecha.
- [ ] Bases: `255` decimal muestra `ff`, `11111111` y `377`; `9007199254740993` se convierte sin perder precisión.
- [ ] Bases: `12` en base binaria muestra error de dígito inválido.
- [ ] Unidades: `1 km` a metros da `1000`; `0 °C` a °F da `32`; `1 KiB` a bytes da `1024`.
- [ ] Color: `#ff0000` muestra `rgb(255, 0, 0)` y `hsl(0, 100%, 50%)`; `#f00` produce el mismo resultado.
- [ ] Contraste: `#000000` sobre `#ffffff` da `21.00` con AA y AAA aprobados; `#777777` sobre `#ffffff` falla AAA de texto normal.
- [ ] CIDR: `192.168.1.0/24` muestra máscara `255.255.255.0`, broadcast `192.168.1.255`, 254 hosts, primer host `192.168.1.1` y último `192.168.1.254`.
- [ ] CIDR: `10.0.0.0/33` y `300.1.1.1/24` muestran error y no rompen la vista.
- [ ] User-Agent: un UA de Chrome en Windows muestra navegador "Chrome" y sistema "Windows".
- [ ] `ua-parser-js` está en un chunk separado en `vite build`.
- [ ] Cada vista tiene estado vacío, claves i18n en es y en, y no desborda a 375 px de ancho.
- [ ] Cada tool tiene al menos un test vitest de su lógica y un smoke e2e que pasa.

## Decisiones

- **Sí:** `BigInt` para bases numéricas. `Number` pierde precisión sobre 2^53.
- **Sí:** CIDR solo IPv4. IPv6 duplica la complejidad y el uso diario es mayoritariamente IPv4.
- **No:** reimplementar el parseo de User-Agent. Es una lista enorme y cambiante; `ua-parser-js` la mantiene.
- **Sí:** conversión de unidades con tabla de factores propia y casos especiales para temperatura. Sin datos externos ni dependencia.
- **Sí:** contraste por la fórmula de luminancia relativa de WCAG 2.x. Es el estándar referenciado por AA/AAA.
- **No:** espacios de color extra (OKLCH, CMYK). Fuera del uso previsto; spec propio si se pide.
- **Sí:** todo en frontend. Regla del plan inicial.

## Riesgos

| Riesgo                                                    | Mitigación                                                                       |
| --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Redondeo de punto flotante en unidades (`0.1 + 0.2`)      | Precisión configurable y tests con tolerancia explícita.                         |
| Zona horaria distinta entre CI y local rompe tests de timestamp | Los tests fijan la zona o comparan solo UTC/ISO.                           |
| Autodetección s/ms errónea para fechas cercanas a 1970    | Es solo una sugerencia; el selector manual manda.                                |

## Lo que **no** está en este spec

- IPv6 en CIDR.
- Espacios de color avanzados.
- Datos externos (monedas, zonas horarias online).
- Envío de contenido al backend.
- Tools de texto/datos, seguridad, regex/diff/markdown/cron.

Cada uno de esos, si llega, va en su propio spec.
