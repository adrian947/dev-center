# SPEC 03 — Dev Toolbox: seguridad y generadores

> **Status:** Borrador
> **Depends on:** SPEC 01
> **Date:** 2026-10-03
> **Objective:** Implementar 6 herramientas de seguridad y generación (JWT, hash, contraseñas, tokens, datos falsos, QR) que corren 100% en el navegador.

## Alcance

**Entra:**

- Las 6 tools de la tabla de abajo con UI, lógica pura, estados vacío/error, responsive, i18n es/en, tests vitest y un smoke e2e.
- Alta de la ruta y de `route` en `DEV_TOOLS` para cada tool.
- Dependencias nuevas en `frontend`: `spark-md5` (MD5), `@faker-js/faker`, `qrcode`, con carga dinámica.

**Fuera de alcance (para specs futuros):**

- Verificación de firma de JWT (requiere secreto o clave; el aviso de que decodificar no verifica es obligatorio).
- HMAC, bcrypt/argon2 y hashing de archivos.
- One-Time Secret (requiere backend).
- Cualquier envío de contenido al backend.
- Tools de los specs 02, 04 y 05.

## Modelo de datos

Esta feature no introduce estructuras de datos persistentes. Estado local en memoria por tool. Reutiliza `ToolLayout` y `useToolUsage` del SPEC 01.

| `id`                | Ruta                          | Vista                        | Lógica                                   | Librería                          |
| ------------------- | ----------------------------- | ---------------------------- | ---------------------------------------- | --------------------------------- |
| `jwt`               | `/devtools/jwt`               | `JwtView.vue`                | `utils/devtools/jwt.ts`                  | nativa (`atob`, `JSON`)           |
| `hash`              | `/devtools/hash`              | `HashView.vue`               | `utils/devtools/hash.ts`                 | `SubtleCrypto`, `spark-md5`       |
| `passwordGenerator` | `/devtools/password-generator`| `PasswordGeneratorView.vue`  | `utils/devtools/password.ts`             | `crypto.getRandomValues`          |
| `tokenGenerator`    | `/devtools/token-generator`   | `TokenGeneratorView.vue`     | `utils/devtools/token.ts`                | `crypto.getRandomValues`          |
| `fakeDataGenerator` | `/devtools/fake-data`         | `FakeDataGeneratorView.vue`  | `utils/devtools/fakeData.ts`             | `@faker-js/faker`                 |
| `qrCode`            | `/devtools/qr-code`           | `QrCodeView.vue`             | `utils/devtools/qr.ts`                   | `qrcode`                          |

Contrato funcional por tool:

- **JWT:** pegar token; mostrar HEADER, PAYLOAD (JSON formateado) y SIGNATURE (cruda); resumen con algoritmo (`alg`), `iss`, `sub`, `exp`, `iat`, `nbf` y el resto de claims; `exp`/`iat`/`nbf` en fecha legible y badge "Expirado"/"Vigente". Advertencia fija y visible: "Decodificar un JWT no verifica su firma." (en inglés: "Decoding a JWT does not verify its signature."). Token mal formado muestra error. No se envía al backend.
- **Hash:** SHA-1, SHA-256, SHA-384, SHA-512 vía `SubtleCrypto` y MD5 vía `spark-md5` (marcado "inseguro/legacy"); entrada texto UTF-8; todas las salidas a la vez en hex en minúsculas, con copiar y opción mayúsculas.
- **Contraseñas:** longitud 8–128, sets (minúsculas, mayúsculas, dígitos, símbolos), excluir caracteres ambiguos, cantidad 1–20; indicador de entropía en bits; copiar.
- **Tokens:** formato hex, base64url o alfanumérico; longitud en bytes 8–128; cantidad 1–20; copiar.
- **Datos falsos:** esquema de campos elegibles (nombre, email, teléfono, dirección, empresa, fecha, UUID), locale es/en, cantidad 1–100, salida JSON o CSV; copiar.
- **QR:** texto/URL a QR, nivel de corrección L/M/Q/H, tamaño, descarga PNG y SVG.

## Plan de implementación

1. Agregar `route` a las 6 entradas de `DEV_TOOLS` y las 6 rutas con vista mínima sobre `ToolLayout`.
2. JWT: lógica + tests (token válido, sin firma, base64url con padding faltante, JSON inválido), vista con advertencia, i18n.
3. Hash: instalar `spark-md5`; lógica + tests con vectores conocidos (`abc`, cadena vacía), vista, i18n.
4. Contraseñas: lógica + tests (longitud, sets respetados, exclusión de ambiguos, sin sesgo de módulo), vista, i18n.
5. Tokens: lógica + tests (longitud y alfabeto por formato), vista, i18n.
6. Datos falsos: instalar `@faker-js/faker`; lógica + tests (cantidad, campos, formato CSV escapado), vista, i18n.
7. QR: instalar `qrcode`; lógica + tests, vista con descarga PNG/SVG, i18n.
8. Un smoke e2e por tool en `tests/e2e/devtools/<id>.spec.ts`.

Cada ítem 2–7 es un commit propio.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint` y `npm run test` pasan.
- [ ] Las 6 cards muestran "Disponible" y navegan a su ruta.
- [ ] Ninguna de las 6 vistas envía el contenido del usuario por red (solo el `POST /api/tools/recent` del SPEC 01).
- [ ] JWT: un token HS256 de ejemplo muestra `alg = HS256`, el payload formateado y la advertencia de firma siempre visible.
- [ ] JWT: un token con `exp` en el pasado muestra el badge "Expirado".
- [ ] JWT: un texto que no tiene tres segmentos muestra error y no rompe la vista.
- [ ] Hash: `abc` produce SHA-256 `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` y MD5 `900150983cd24fb0d6963f7d28e17f72`.
- [ ] Contraseñas: con longitud 32 y solo dígitos, el resultado tiene 32 caracteres y todos son dígitos.
- [ ] Contraseñas: con "excluir ambiguos", ningún resultado contiene `0 O 1 l I`.
- [ ] Tokens: formato hex de 16 bytes produce 32 caracteres `[0-9a-f]`.
- [ ] Datos falsos: cantidad 5 en JSON produce un array de 5 objetos con los campos elegidos; CSV escapa comas y comillas.
- [ ] QR: el texto `https://example.com` genera un QR visible y los botones PNG y SVG descargan archivos no vacíos.
- [ ] `@faker-js/faker` y `qrcode` están en chunks separados en `vite build`, no en el bundle inicial.
- [ ] Cada vista tiene estado vacío, claves i18n en es y en, y no desborda a 375 px de ancho.
- [ ] Cada tool tiene al menos un test vitest de su lógica y un smoke e2e que pasa.

## Decisiones

- **Sí:** `crypto.getRandomValues` con rechazo de muestreo (sin sesgo de módulo) para contraseñas y tokens. Es la fuente criptográfica del navegador.
- **No:** `Math.random`. No es criptográficamente seguro.
- **Sí:** MD5 incluido pero marcado como legacy. Sigue siendo pedido para checksums; `SubtleCrypto` no lo ofrece.
- **No:** verificar firma de JWT. Exige manejar secretos en el navegador; otro spec si se quiere.
- **Sí:** advertencia de firma siempre visible, no colapsable. Requisito del plan inicial.
- **Sí:** `@faker-js/faker` con carga dinámica. Es pesado, pero generar datos realistas a mano no compensa.
- **Sí:** todo en frontend. Regla del plan inicial.

## Riesgos

| Riesgo                                               | Mitigación                                                                 |
| ---------------------------------------------------- | -------------------------------------------------------------------------- |
| `SubtleCrypto` solo existe en contextos seguros      | `localhost` y HTTPS lo cumplen; si falta, mostrar error claro en Hash.     |
| Usuario pega un JWT de producción                    | Decodificación 100% local; criterio de aceptación de cero peticiones con contenido. |
| Bundle de `@faker-js/faker` demasiado grande         | Importar solo el locale elegido (`es`/`en`) con `import()` dinámico.       |

## Lo que **no** está en este spec

- Verificación de firma JWT, HMAC, bcrypt/argon2, hash de archivos.
- One-Time Secret.
- Envío de contenido al backend.
- Tools de texto/datos, conversores, regex/diff/markdown/cron.

Cada uno de esos, si llega, va en su propio spec.
