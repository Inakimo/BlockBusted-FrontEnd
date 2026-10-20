# Frontend BlockBusted — instrucciones para Claude

Vas a ayudarme a construir el frontend de **BlockBusted**, una tienda online de películas, para un trabajo práctico de la facultad. El backend ya está hecho (Spring Boot \+ JWT) y corre en `http://localhost:4002`.

## ⚠️ REGLA MÁS IMPORTANTE: solo lo que vimos en clase

La profesora fue clara: **si usamos IA, el código tiene que usar solamente lo que vimos en clase**. Si aparece una función, librería o forma de hacer las cosas que no vimos, **me reprueba**. Por eso:

- Antes de escribir cualquier cosa, revisá los demos de clase que están en la carpeta `material-clase/` de este repo (`React fetch Demo` y `React Hooks Demo`) y **copiá su estilo**: cómo declaran componentes, cómo usan `useState`/`useEffect`, cómo hacen `fetch`, cómo manejan formularios y listas. La lista de permitidos de abajo sale de esos demos y de las notas de clase (HTML, CSS, Principales métodos de JavaScript, React-Vite y Renderizado condicional).  
- Si para resolver algo necesitás una herramienta que **no está en la lista de permitidos de abajo**, **no la uses**: pará y preguntame primero. Prefiero una solución más larga o más simple antes que una "más elegante" con algo que no vimos.  
- El código tiene que parecer escrito por un estudiante que recién aprendió React: simple, claro y sin abstracciones de más. Si dudás entre dos formas, elegí la más básica.  
- Los nombres de variables, componentes y textos van en español, como en los demos.

### ✅ Permitido (lo que vimos en clase)

**Proyecto** (nota "React-Vite")

- Crear el proyecto con `npm create vite@latest` → framework **React** → variante **JavaScript** (no TypeScript ni SWC) → rolldown-vite: **No** → instalar con npm: **Sí**.  
- React 18 con archivos `.jsx`.  
- Estructura de carpetas como en los demos y la nota: `src/components/` (por ejemplo Header, Login, Card), `src/views/` (por ejemplo Home, Cart, Checkout), `App.jsx`, `main.jsx`, `App.css`, `index.css`.  
- Buenas prácticas de la nota: nombres de componentes en **PascalCase**, **CSS modular** (un archivo `.css` por componente o vista, importado en ese componente) e inicializar Git desde el comienzo.

**Componentes**

- Componentes funcionales escritos de cualquiera de las dos formas de los demos: `const Card = () => { ... }` o `function PostList() { ... }`, con `export default` (o `export const` como `Home`).  
- Props con desestructuración en los parámetros: `function PostCard({id, title, body})`.  
- Pasar funciones por props para que el hijo avise al padre, como `deleteTodo` en `Todo`.  
- Fragments `<> ... </>`.

**Hooks**

- **Solo `useState` y `useEffect`.** `useEffect` se usa con array de dependencias (`[]` para cargar al montar, `[count]` para reaccionar a cambios).

**Datos / API**

- `fetch` encadenado con `.then((response) => response.json())`, `.then((data) => { setAlgo(data) })` y `.catch((error) => { console.error('Error al cargar', error) })`, exactamente como en `PostList.jsx`.  
- La URL base en una constante con template literal: `` fetch(`${URL}/api/peliculas`) ``.  
- Para POST/PUT/DELETE se sigue usando `fetch`, agregando `method`, `headers` (`'Content-Type': 'application/json'` y `'Authorization': Bearer ${token}`) y `body: JSON.stringify(...)`.

**Formularios**

- `<form onSubmit={(e) => e.preventDefault()}>`, `<label>`, `<input>`, `<select>` y `<button onClick={handleClick}>`.  
- `onChange={handleChange}` con `setX(e.target.value)`.  
- Validar con `if (campo.trim() === '') { alert('...'); return }`.

**Métodos de JavaScript** (nota "Principales métodos de JavaScript"; usá **solo estos**)

- **Arrays:** `map`, `filter`, `find`, `findIndex`, `some`, `every`, `push`, `pop`, `shift`, `unshift`, `slice`, `at`, `reverse` y `fill`. También `splice` y el spread `[...array]`, que aparecen en `Form.jsx`.  
- **Strings:** `toLowerCase`, `toUpperCase`, `includes`, `slice` y `replace`, más `trim`, que aparece en `Form.jsx`.  
- En JSX, las listas se renderizan con `.map((item) => <Componente key={item.id} ... />)`, siempre con `key` única.  
- Las listas filtradas según el estado se arman con `.filter(...)` (PDF de renderizado condicional).  
- Template literals.

**HTML** (nota "HTML")

- Etiquetas semánticas en lugar de `<div>` genéricos: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` y `<footer>`.  
- Encabezados `<h1>`–`<h6>`, `<p>`, listas `<ul>`/`<ol>`/`<li>`, `<a>`, y `<img>` **siempre con `alt`**.  
- Estructura jerárquica clara. Nada de etiquetas obsoletas como `<font>` o `<center>`.

**Renderizado condicional** (PDF "Renderizado condicional")

- `if` antes del `return` (por ejemplo, `if (cargando) return <p>Cargando...</p>`).  
- `&&`, como en `{usuario && <p>Hola {usuario.username}</p>}`.  
- Ternario `? :` para mostrar una cosa u otra.  
- Recordá que React no renderiza `false`, `null` ni `undefined`.  
- Evitá condicionales muy anidados.

**Navegación** (`react-router-dom`, como en el `React fetch Demo`)

- `<BrowserRouter>` en `main.jsx`, `<Routes>` y `<Route path='...' element={<... />} />` en `App.jsx`.  
- `<Link to='...'>` para el menú, como en `Navigation.jsx`.  
- `useNavigate()` para redirigir después de una acción y `useLocation()` si hace falta.

**Estilos** (nota "CSS")

- CSS común en archivos `.css` importados (`import './Card.css'`).  
- Selectores de tipo (`div`), clase (`.card`, usando `className` en JSX), id (`#id`), atributo (`a[href="..."]`) y universal (`*`).  
- Box model: `width`, `height`, `margin`, `padding`, `border`, `border-radius`, `background-color`, `display` y `position`.  
- **Flexbox** (`display: flex`, `justify-content`, `align-items`) y **Grid** (`display: grid`, `grid-template-columns`, `gap`) para la maquetación.  
- **Media queries** (`@media screen and (max-width: 768px) { ... }`) para que se vea bien en el celular.  
- **Librerías de estilos: la profesora confirmó que se puede usar cualquiera** (la nota de CSS menciona Tailwind, Bootstrap, Material UI y Ant Design). **Antes de instalar una, preguntame cuál quiero usar.** Una vez elegida, usala de forma consistente en todo el proyecto. La librería se usa solo para la parte visual: la lógica (estado, `fetch`, formularios, renderizado condicional) sigue las reglas de esta lista.

### ❌ Prohibido (no lo vimos; no lo uses sin preguntarme)

- `async`/`await` (usá `.then().catch()`).  
- **Axios** y **Redux**: la nota de React-Vite los nombra como parte del "ecosistema", pero en clase no los usamos y la profesora todavía no confirmó que se puedan usar. Los pedidos se hacen con `fetch` y el estado con `useState`.  
- `useContext`, `createContext`, `useReducer`, `useRef`, `useMemo`, `useCallback`, `useParams` o hooks personalizados (`useAlgo`).  
- Zustand o cualquier otro manejador de estado.  
- TypeScript.  
- Librerías de formularios (Formik, React Hook Form), de fechas (dayjs, moment) o de íconos.  
- Componentes de clase, `PropTypes`, `React.memo`, `lazy`/`Suspense`, `Outlet`, rutas anidadas o loaders del router.  
- Métodos que **no** están en la nota de métodos: `reduce`, `sort`, `forEach`, `flatMap`, `join`, `split`, `Object.keys`/`Object.entries`, `toFixed`, `Math.*` y similares. Si hace falta uno, preguntame. Por ejemplo, los totales de carrito y órdenes ya vienen calculados del backend, no hace falta `reduce`.  
- Optional chaining (`?.`) y nullish coalescing (`??`). Usá `&&` o un `if`.  
- `localStorage`/`sessionStorage` (no aparecen en ningún material). El token y el usuario logueado viven en un `useState` de `App.jsx` y se pasan por props. Si recargás la página, se pierde la sesión, y es aceptable.  
- Instalar cualquier dependencia que no sea `react-router-dom` o la librería de estilos que yo elija.

Si en algún momento te parece que falta algo de esta lista para resolver un problema, decímelo y lo vemos juntos. No lo resuelvas por tu cuenta.

---

## Backend: cómo funciona

- **URL base:** `http://localhost:4002`  
- **CORS:** el backend solo acepta pedidos desde `http://localhost:5173`, el puerto por defecto de Vite. No cambies el puerto del frontend. Si Vite arranca en otro porque el 5173 está ocupado, cerrá lo que lo esté usando.  
- **Autenticación:** JWT. Login y registro devuelven `{ "access_token": "..." }`. En los endpoints protegidos se manda el header `Authorization: Bearer <token>`.  
- **Roles:** `ADMIN`, `VENDEDOR` y `COMPRADOR`. El token **no** trae el rol a la vista: después de loguearte llamá a `GET /api/usuarios/me` para saber quién es el usuario y qué rol tiene.  
- **Formato de error** (todos los errores de negocio):

```json
{ "timestamp": "...", "status": 404, "error": "Not Found", "message": "No existe la pelicula con id 7" }
```

  Mostrale al usuario el campo `message`.

- **Ojo:**  
  - Un **403 por falta de permisos o de token** lo genera Spring Security y **viene con el cuerpo vacío**, así que `response.json()` falla. Antes de leer el JSON revisá `response.ok` y `response.status`.  
  - Los `DELETE` exitosos responden **200 con cuerpo vacío**: no llames `response.json()` en esos casos.  
- **Listados paginados:** `GET /api/peliculas` y `GET /api/categorias` devuelven un objeto de Spring con la lista dentro de **`content`** (`data.content`).

### Endpoints

**Auth (público)**

| Método | Ruta | Body | Respuesta |
| :---- | :---- | :---- | :---- |
| POST | `/api/v1/auth/register` | `{ username, firstname, lastname, email, password, role }` | `{ access_token }` |
| POST | `/api/v1/auth/authenticate` | `{ email, password }` | `{ access_token }` (401 si la contraseña es incorrecta) |

**Usuarios**

| Método | Ruta | Rol | Body / notas |
| :---- | :---- | :---- | :---- |
| GET | `/api/usuarios/me` | cualquiera logueado | → `{ id, username, email, firstName, lastName, role }` |
| PUT | `/api/usuarios/me` | cualquiera logueado | `{ username, firstName, lastName }` |
| GET | `/api/usuarios` | ADMIN | lista de usuarios |
| PUT | `/api/usuarios/{id}/rol` | ADMIN | `{ role }` |
| DELETE | `/api/usuarios/{id}` | ADMIN | — |

**Categorías**

| Método | Ruta | Rol | Body / notas |
| :---- | :---- | :---- | :---- |
| GET | `/api/categorias` | público | → `{ content: [ { id, descripcion } ] }` |
| GET | `/api/categorias/{id}` | público | → `{ id, descripcion }` |
| POST | `/api/categorias` | ADMIN | `{ descripcion }` (409 si ya existe) |
| PUT | `/api/categorias/{id}` | ADMIN | `{ descripcion }` |
| DELETE | `/api/categorias/{id}` | ADMIN | baja lógica: deja de aparecer en los listados |

**Películas**

| Método | Ruta | Rol | Body / notas |
| :---- | :---- | :---- | :---- |
| GET | `/api/peliculas` | público | opcional `?categoriaId=1` → `{ content: [Pelicula] }` |
| GET | `/api/peliculas/{id}` | público | → `Pelicula` |
| POST | `/api/peliculas` | VENDEDOR | `{ titulo, descripcion, precio, stock, categoriaId }` |
| PUT | `/api/peliculas/{id}` | VENDEDOR dueño | `{ titulo, descripcion, precio, categoriaId }` |
| DELETE | `/api/peliculas/{id}` | VENDEDOR dueño | 409 si ya forma parte de una orden |
| PUT | `/api/peliculas/{id}/stock` | VENDEDOR dueño | `{ stock }` |
| PUT | `/api/peliculas/{id}/descuento` | VENDEDOR dueño | `{ descuentoPorcentaje }` (0 a 100) |
| POST | `/api/peliculas/{id}/fotos` | VENDEDOR dueño | `{ urls: ["http://..."] }` → lista de `{ id, url }` |
| DELETE | `/api/peliculas/{id}/fotos/{fotoId}` | VENDEDOR dueño | — |

Forma de `Pelicula`:

```json
{
  "id": 1, "titulo": "The Matrix", "descripcion": "...", "precio": 1500.0,
  "descuentoPorcentaje": 10, "stock": 10,
  "categoria": { "id": 1, "descripcion": "Acción" },
  "vendedor": { "id": 2, "username": "vendedor1" },
  "fotos": [ { "id": 1, "url": "http://..." } ]
}
```

El precio final se calcula como `precio - precio * descuentoPorcentaje / 100`. No existe un endpoint "mis películas": el vendedor obtiene todas con `GET /api/peliculas` y filtra con `.filter` las que tienen `pelicula.vendedor.id === usuario.id`.

**Carrito (COMPRADOR)**

| Método | Ruta | Body / notas |
| :---- | :---- | :---- |
| GET | `/api/carrito` | → `{ id, items: [ { id, peliculaId, titulo, cantidad } ] }` |
| POST | `/api/carrito/items` | `{ peliculaId, cantidad }` (400 con mensaje si no hay stock) |
| PUT | `/api/carrito/items/{itemId}` | `{ cantidad }` (la cantidad nueva total) |
| DELETE | `/api/carrito/items/{itemId}` | → carrito actualizado |
| DELETE | `/api/carrito` | vacía el carrito (cuerpo vacío) |

**Órdenes**

| Método | Ruta | Rol | Notas |
| :---- | :---- | :---- | :---- |
| POST | `/api/ordenes` | COMPRADOR | sin body; compra lo que hay en el carrito → 201 `Orden` |
| GET | `/api/ordenes` | COMPRADOR | mis órdenes |
| GET | `/api/ordenes/{id}` | COMPRADOR dueño | → `Orden` |
| PUT | `/api/ordenes/{id}/cancelar` | COMPRADOR dueño | pasa a `CANCELADA` |
| GET | `/api/admin/ordenes` | ADMIN | todas las órdenes |

Forma de `Orden`:

```json
{
  "id": 1, "fecha": "2026-10-19T10:30:00", "estado": "CONFIRMADA", "total": 2700.0,
  "comprador": { "id": 3, "username": "comprador1" },
  "detalles": [ {
    "id": 1, "peliculaId": 1, "titulo": "The Matrix", "cantidad": 3,
    "precioOriginal": 1200.0, "descuentoPorcentaje": 25, "precioFinal": 900.0, "subtotal": 2700.0
  } ]
}
```

`estado` puede ser `CONFIRMADA` o `CANCELADA`.

### Usuarios de prueba

- `admin@blockbusted.com` / `admin123` (ADMIN)  
- `vendedor@blockbusted.com` / `vendedor123` (VENDEDOR)  
- `comprador@blockbusted.com` / `comprador123` (COMPRADOR)

---

## Qué tiene que tener el frontend

**Estado global en `App.jsx`:** `token` y `usuario` con `useState`, que se pasan por props a las vistas que los necesitan. Cerrar sesión = poner los dos en `null`.

**Navegación (`Navigation.jsx`):** el menú cambia según el rol, usando renderizado condicional.

- **Sin login:** Catálogo · Iniciar sesión · Registrarse  
- **COMPRADOR:** Catálogo · Carrito · Mis órdenes · Mi perfil · Salir  
- **VENDEDOR:** Catálogo · Mis películas · Mi perfil · Salir  
- **ADMIN:** Catálogo · Categorías · Usuarios · Órdenes · Mi perfil · Salir

**Vistas (`src/views/`)**

1. **Catálogo** (público): lista de películas con `<select>` de categorías para filtrar. Cada tarjeta muestra título, categoría, precio (y precio con descuento si tiene), stock y primera foto. Si COMPRADOR: input de cantidad + botón "Agregar al carrito". Sin stock → "Sin stock".
2. **Login** y **Registro**: formularios con validación. Al loguearse, guardar token, llamar `/api/usuarios/me` y redirigir al catálogo. Mostrar `message` del error.
3. **Carrito** (COMPRADOR): items con cantidad editable, quitar item, vaciar carrito, confirmar compra. Vacío → "Tu carrito está vacío".
4. **Mis órdenes** (COMPRADOR): lista con fecha, estado, total y detalle. Botón "Cancelar orden" solo si `CONFIRMADA`.
5. **Mis películas** (VENDEDOR): sus películas con editar, stock, descuento, fotos y eliminar; formulario para crear.
6. **Categorías** (ADMIN): alta, edición y baja.
7. **Usuarios** (ADMIN): listado con `<select>` para cambiar rol y botón eliminar.
8. **Órdenes** (ADMIN): todas las órdenes con comprador y estado.
9. **Mi perfil**: ver y editar username, nombre y apellido.

En todas las vistas que cargan datos: "Cargando..." mientras llega y error si falla. Después de cada acción, volver a pedir los datos.

## Cómo trabajamos

1. Empezar por Vite + router + Catálogo (público). Mostrar resultado antes de seguir.
2. Después Login y Registro, luego vistas del comprador, vendedor y por último admin.
3. Una vista por vez con explicación breve de cada parte.
4. Si algo del backend da error (CORS, etc.), avisar en lugar de rodearlo desde el front.
