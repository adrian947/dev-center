export const JSON_EXAMPLE =
  '{"empresa":{"nombre":"Leverbox","activa":true,"usuarios":[{"id":1,"nombre":"Adrian","roles":["admin","dev"]},{"id":2,"nombre":"Guillermo","roles":["support"]}],"config":{"pais":"AR","moneda":"ARS","limites":{"max":100,"min":1}}}}';

export const BASE64_EXAMPLE = "Hola, DevCenter! héllo 😀";

export const URL_EXAMPLE = "https://example.com/buscar?q=hola mundo&lang=es&page=2";

export const HTML_ENTITIES_EXAMPLE = `<a href="https://example.com?a=1&b=2" title='Hi'>Click</a>`;

export const CASE_EXAMPLE = "hello world foo bar";

export const CSV_EXAMPLE = "name,role,age\nAda,admin,36\nLinus,dev,54\nGrace,support,45";

export const CSS_EXAMPLE = `/* Estilos de ejemplo */
.card {
  margin: 0 auto;
  padding: 16px 24px;
  color: #ff0000;
}

.card:hover {
  color: #00ff00;
}
`;

export const SQL_EXAMPLE =
  "select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = 1 group by u.id, u.name order by orders desc limit 10";
