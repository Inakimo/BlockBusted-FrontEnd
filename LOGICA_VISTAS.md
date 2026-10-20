# Guía de estudio — Lógica de las vistas (BlockBusted Frontend)

Este documento explica, vista por vista, cómo funciona el frontend de BlockBusted. Está pensado para preparar una presentación oral: cada sección es corta, con bullets, tablas y los fragmentos de código que conviene saber de memoria.

---

## 0. Conceptos transversales

### 0.1 Estado global (en `App.jsx`)

- Todo el estado global vive en `App.jsx` con dos `useState`:
  - `const [token, setToken] = useState(null)` — JWT devuelto por el backend.
  - `const [usuario, setUsuario] = useState(null)` — objeto `{ id, username, email, firstName, lastName, role }`.
- `handleLogin(token, usuario)` setea los dos; se pasa como prop `onLogin` a `Login` y `Registro`.
- `handleLogout()` setea los dos a `null` (cerrar sesión = perder el estado).
- No se usa `localStorage` ni `useContext`: todo se pasa por props a las rutas (`<Catalogo token={token} usuario={usuario} />`, etc.).
- Si recargás la página, se pierde la sesión. Es aceptable: lo dicta la regla "solo lo que vimos en clase".

### 0.2 Navegación condicional (`Navigation.jsx`)

- Componente puramente visual: recibe `usuario` y `onLogout` como props.
- Usa renderizado condicional con `&&` para mostrar enlaces según el rol:
  - **Sin login** (`!usuario`): Catálogo, Iniciar sesión, Registrarse.
  - **COMPRADOR**: Carrito, Mis órdenes.
  - **VENDEDOR**: Mis películas.
  - **ADMIN**: Categorías, Usuarios, Órdenes.
  - **Siempre logueado**: enlace a Mi perfil + botón Salir (dispara `onLogout`).
- Navegación con `<Link to="...">` de `react-router-dom`.

### 0.3 Patrones comunes de fetch

Todas las vistas siguen el mismo esquema (sacado de `PostList.jsx` del demo):

```js
fetch(`${URL_BASE}/api/algo`, {
  headers: { 'Authorization': `Bearer ${token}` },
})
  .then((response) => {
    if (!response.ok) {
      // 403 → body vacío (Spring Security). No llames a response.json().
      if (response.status === 403) { alert('No tenés permiso'); return }
      return response.json().then((data) => { alert(data.message) })
    }
    return response.json().then((data) => { setAlgo(data) })
  })
  .catch((err) => { console.error('Error', err) })
```

Puntos clave que repiten todas las vistas:
- `.then().catch()` (nada de `async/await`).
- Chequeo de `response.ok` antes de `response.json()`.
- Caso especial 403: no hay body, se avisa con `alert`.
- Los `DELETE` del backend responden 200 con cuerpo vacío → no se llama a `response.json()`.
- Listados paginados (`/api/peliculas`, `/api/categorias`) vienen envueltos: `data.content`.

### 0.4 Reglas de clase cumplidas

- Solo `useState` + `useEffect`. Nada de `useContext`, `useRef`, `useMemo`, `useReducer`, hooks personalizados.
- Nada de `async/await`, siempre `.then().catch()`.
- Nada de optional chaining (`?.`): se usa `objeto && objeto.prop`.
- Nada de `localStorage`/`sessionStorage`.
- Única dependencia extra: `react-router-dom` (y la librería de estilos elegida, Tailwind).
- Validaciones simples con `if (campo.trim() === '')` + `alert`.
- Listas renderizadas con `.map((x) => <Comp key={x.id} />)`.

---

## 1. Catálogo (`src/views/Catalogo.jsx`)

### Qué hace
Vista pública que lista todas las películas en una grilla. Permite filtrar por categoría con un `<select>` y, si el usuario es COMPRADOR, agregar películas al carrito desde cada tarjeta. Es la ruta `/`.

### Props que recibe
- `token` (string | null) — para autenticar el POST al carrito.
- `usuario` (objeto | null) — para decidir si mostrar el botón "Agregar al carrito" en la tarjeta.

### Hooks usados

| Variable | Inicial | Qué guarda |
|---|---|---|
| `peliculas` | `[]` | Lista de películas del backend |
| `categorias` | `[]` | Categorías del `<select>` |
| `categoriaSeleccionada` | `''` | ID de la categoría del filtro (string vacío = todas) |
| `cargando` | `true` | Flag de carga |
| `error` | `null` | Texto de error |
| `mensajeCarrito` | `null` | Toast `{ tipo, texto }` tras agregar al carrito |

Dos `useEffect`:
- `[]` — Carga categorías una sola vez al montar.
- `[categoriaSeleccionada]` — Carga películas cada vez que cambia el filtro. Dispara `setCargando(true)` al principio.

### Fetch / endpoints

| Método | URL | Cuándo |
|---|---|---|
| GET | `/api/categorias` | Al montar |
| GET | `/api/peliculas` o `/api/peliculas?categoriaId=X` | Al montar y al cambiar filtro |
| POST | `/api/carrito/items` | Al apretar "Agregar al carrito" en una tarjeta |

```js
useEffect(() => {
  setCargando(true)
  const urlPeliculas = categoriaSeleccionada
    ? `${URL_BASE}/api/peliculas?categoriaId=${categoriaSeleccionada}`
    : `${URL_BASE}/api/peliculas`
  fetch(urlPeliculas)
    .then((r) => r.json())
    .then((data) => { setPeliculas(data.content); setCargando(false) })
    .catch(...)
}, [categoriaSeleccionada])
```

### Handlers principales
- `handleAgregarAlCarrito(peliculaId, cantidad)` — Se pasa como prop a cada `TarjetaPelicula`. Hace POST a `/api/carrito/items` con `{ peliculaId, cantidad }`. Si el backend responde con error (sin stock, por ejemplo), muestra el `data.message` como toast rojo por 4 segundos. Si sale bien, toast verde por 3 segundos. Usa `setTimeout` para esconderlo.

### Renderizado condicional
- `if (cargando) return <p>Cargando películas...</p>`
- `if (error) return <p>{error}</p>`
- Si `peliculas.length === 0` → mensaje "Cintas no encontradas".
- Si `mensajeCarrito` → toast flotante arriba a la derecha.

### Datos locales vs servidor
- Servidor: `peliculas`, `categorias`.
- Locales (solo UI): `categoriaSeleccionada`, `cargando`, `error`, `mensajeCarrito`.

### Interacciones destacables
- Toast temporal con `setTimeout` para auto-ocultarlo.
- El filtro de categoría es reactivo: cambiarlo dispara un nuevo fetch gracias al `useEffect` con dependencia `[categoriaSeleccionada]`.

### Preguntas que te pueden hacer
- **¿Por qué dos `useEffect`?** Porque las categorías se cargan una sola vez (dependencia `[]`) y las películas se recargan cada vez que cambia el filtro (dependencia `[categoriaSeleccionada]`).
- **¿Qué pasa si el usuario no está logueado y aprieta "Agregar"?** El botón solo se muestra si `usuario.role === 'COMPRADOR'`, así que no aparece. Además, el handler chequea `if (!token) return`.
- **¿Por qué `data.content`?** Spring devuelve listados paginados como un objeto con la lista dentro de `content`.

---

## 2. TarjetaPelicula (`src/components/TarjetaPelicula.jsx`)

### Qué hace
Componente reutilizable que muestra una película del catálogo (poster, título, precio, stock) y, si corresponde, el input de cantidad + botón "Alquilar". También permite ir al detalle haciendo clic en la imagen o el título.

### Props que recibe
- `pelicula` (objeto) — forma `Pelicula` del backend.
- `token` (string | null).
- `usuario` (objeto | null).
- `onAgregarAlCarrito(peliculaId, cantidad)` — función del padre.

### Hooks usados
- `const [cantidad, setCantidad] = useState(1)` — cantidad local del input.
- `const navigate = useNavigate()` — para ir al detalle.

### Lógica
- `primeraFoto` = `pelicula.fotos && pelicula.fotos.length > 0 ? pelicula.fotos[0].url : null`.
- `tieneDescuento` = `pelicula.descuentoPorcentaje > 0`.
- `precioFinal` = `pelicula.precio - pelicula.precio * pelicula.descuentoPorcentaje / 100`.
- `handleVerDetalle()` → `navigate('/pelicula', { state: { peliculaId: pelicula.id } })`.
- `handleAgregar()` → llama al callback del padre.

### Renderizado condicional
- Badge de descuento solo si `tieneDescuento`.
- Precio tachado + precio con descuento, o solo precio original.
- Si `usuario.role === 'COMPRADOR'`: input + botón o "Sin stock".
- Si no es comprador: barra de código decorativa en el footer.

### Preguntas que te pueden hacer
- **¿Por qué usar `navigate` con `state` en vez de un path con ID?** No usamos `useParams` (prohibido). El objeto `state` se recupera con `useLocation` en `DetallePelicula`.
- **¿Por qué el estado `cantidad` vive en la tarjeta y no en el catálogo?** Porque es un detalle de UI aislado de cada tarjeta.

---

## 3. Login (`src/views/Login.jsx`)

### Qué hace
Formulario de inicio de sesión. Envía email + password al backend, obtiene el token JWT, luego pide el perfil del usuario y lo guarda en el estado global vía `onLogin`.

### Props
- `onLogin(token, usuario)` — callback a `App.jsx`.

### Hooks

| Variable | Inicial | Qué guarda |
|---|---|---|
| `email` | `''` | Input email |
| `password` | `''` | Input password |
| `mostrarPassword` | `false` | Toggle ver/ocultar |
| `error` | `null` | Mensaje de error |
| `cargando` | `false` | Flag de envío |

Además `useNavigate()` para redirigir al catálogo tras loguearse.

### Fetch

```js
fetch(`${URL_BASE}/api/v1/auth/authenticate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
  .then((response) => {
    if (!response.ok) { /* muestra data.message */ }
    return response.json().then((data) => {
      const token = data.access_token
      fetch(`${URL_BASE}/api/usuarios/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((usuario) => { onLogin(token, usuario); navigate('/') })
    })
  })
```

Dos fetchs encadenados: autenticar → obtener perfil → `onLogin` + redirigir.

### Handlers
- `handleSubmit(e)` — Valida que email y password no estén vacíos con `trim()`. Hace el fetch doble.
- `cargarRolRapido(email, password)` — Botones de acceso rápido (Comprador, Vendedor, Admin) que precargan credenciales de prueba.

### Renderizado condicional
- Banner de error si `error`.
- Botón muestra "REBOBINANDO..." mientras `cargando`.
- Toggle de icono visibility/visibility_off según `mostrarPassword`.

### Preguntas que te pueden hacer
- **¿Por qué dos llamadas al backend al loguearse?** Porque el JWT no trae el rol: hay que pedir `/api/usuarios/me` para saber quién es y qué puede hacer.
- **¿Dónde se guarda el token?** En el `useState` de `App.jsx`. No se persiste.

---

## 4. Registro (`src/views/Registro.jsx`)

### Qué hace
Formulario de registro para nuevos usuarios (COMPRADOR o VENDEDOR). Igual que Login pero con más campos. Al terminar: token → perfil → login automático.

### Props
- `onLogin(token, usuario)`.

### Hooks
`username`, `firstname`, `lastname`, `email`, `password` (todos `''`), `role` (`'COMPRADOR'`), `mostrarPassword` (`false`), `error` (`null`), `cargando` (`false`), + `useNavigate()`.

### Fetch

| Método | URL | Body |
|---|---|---|
| POST | `/api/v1/auth/register` | `{ username, firstname, lastname, email, password, role }` |
| GET | `/api/usuarios/me` | — (con token) |

Mismo encadenamiento que Login.

### Handlers
- `handleSubmit(e)` — Cinco validaciones con `trim()`, luego POST al register y GET al me.

### Preguntas que te pueden hacer
- **¿Por qué no permitís registrar ADMIN desde el frontend?** Porque sería un agujero de seguridad: el `<select>` solo tiene COMPRADOR y VENDEDOR.
- **¿El rol se envía al backend?** Sí, en el body del register.

---

## 5. DetallePelicula (`src/views/DetallePelicula.jsx`)

### Qué hace
Vista de detalle de una película (ruta `/pelicula`). Recibe el ID por `location.state` (desde `TarjetaPelicula`). Muestra portada, galería de fotos, precio, descripción y, si es COMPRADOR, controles para agregar al carrito con cantidad +/-.

### Props
- `token`, `usuario`.

### Hooks

| Variable | Inicial | Qué guarda |
|---|---|---|
| `pelicula` | `null` | Objeto película |
| `cargando` | `true` | Flag |
| `error` | `null` | Mensaje |
| `fotoActiva` | `0` | Índice de la foto grande |
| `cantidad` | `1` | Cantidad a comprar |
| `mensajeCarrito` | `null` | Toast |

Además: `useLocation()` y `useNavigate()`.

```js
const peliculaId = location.state && location.state.peliculaId
```

### `useEffect`

```js
useEffect(() => {
  if (!peliculaId) { navigate('/'); return }
  fetch(`${URL_BASE}/api/peliculas/${peliculaId}`)
    .then(...)
}, [peliculaId])
```

Si no vino un ID en el state, redirige al catálogo.

### Fetch
- GET `/api/peliculas/:id` al montar.
- POST `/api/carrito/items` al agregar (solo COMPRADOR).

### Handlers
- `handleAgregarAlCarrito()` — Si no hay token, redirige a `/login`. Si sí, hace el POST.
- `disminuir()` / `aumentar()` — Ajustan `cantidad` dentro del rango `[1, stock]`.

### Renderizado condicional
- `cargando` → "Cargando película..."
- `error` → mensaje de error.
- `!pelicula` → `return null`.
- Galería de miniaturas solo si `fotos.length > 1`.
- Botones de agregar solo si `usuario.role === 'COMPRADOR' && stock > 0`.
- Si no hay usuario y hay stock: botón "Iniciá sesión para comprar" que redirige a `/login`.

### Preguntas que te pueden hacer
- **¿Por qué pasás el ID por `state` y no por `useParams`?** Porque `useParams` no lo vimos en clase.
- **¿Qué hace el `useEffect` si no hay `peliculaId`?** Redirige al catálogo con `navigate('/')`.

---

## 6. Carrito (`src/views/Carrito.jsx`)

### Qué hace
Muestra los items del carrito del COMPRADOR, permite cambiar cantidad, quitar items, vaciar el carrito y confirmar la compra. Al confirmar, redirige a Mis órdenes.

### Props
- `token`.

### Hooks

| Variable | Inicial | Qué guarda |
|---|---|---|
| `carrito` | `null` | Objeto `{ id, items, total }` |
| `cargando` | `true` | Flag |
| `error` | `null` | Mensaje |
| `confirmando` | `false` | Flag botón de confirmar |
| `cupon` | `''` | Input cupón (solo visual) |
| `cuponAplicado` | `false` | Toggle visual |

Además `useNavigate()`.

Función `cargarCarrito()` separada que hace el GET y se reutiliza después de cada acción.

### Fetch

| Método | URL | Cuándo |
|---|---|---|
| GET | `/api/carrito` | Al montar y después de cada acción |
| PUT | `/api/carrito/items/:itemId` | Cambiar cantidad |
| DELETE | `/api/carrito/items/:itemId` | Quitar item |
| DELETE | `/api/carrito` | Vaciar carrito |
| POST | `/api/ordenes` | Confirmar compra |

### Handlers
- `handleCambiarCantidad(itemId, nuevaCantidad)` — Si `nuevaCantidad < 1` corta. PUT con nueva cantidad total. Después recarga.
- `handleQuitarItem(itemId)` — DELETE del item + recarga.
- `handleVaciarCarrito()` — DELETE del carrito completo + recarga.
- `handleConfirmarCompra()` — POST a `/api/ordenes` sin body (compra lo que haya en el carrito). Si sale bien, `navigate('/mis-ordenes')`.
- `handleAplicarCupon()` — Solo cosmético, no habla con el backend.

### Renderizado condicional
- `cargando` / `error`.
- Si `items.length === 0` → "Tu carrito está vacío".
- Si hay items → grilla con cards + ticket de resumen a la derecha (sticky).
- Botón "Vaciar carrito" solo si hay items.

### Datos locales vs servidor
- Servidor: `carrito` entero (items y total vienen calculados).
- Locales: `cupon`, `cuponAplicado` (nunca se envían al backend).

### Preguntas que te pueden hacer
- **¿Por qué re-fetchear el carrito después de cada acción en vez de modificar el estado local?** Para mantener consistencia con el backend: el total viene recalculado del servidor.
- **¿Qué hace el cupón?** Solo decorativo. No existe endpoint de cupones.
- **¿Por qué el POST de ordenes no tiene body?** Porque el backend ya sabe qué carrito pertenece al usuario (lo saca del JWT).

---

## 7. MisOrdenes (`src/views/MisOrdenes.jsx`)

### Qué hace
Lista las órdenes del COMPRADOR logueado. Para cada orden muestra fecha, estado, total y tabla de detalles. Si está CONFIRMADA, permite cancelarla con un modal de confirmación.

### Props
- `token`.

### Hooks

| Variable | Inicial | Qué guarda |
|---|---|---|
| `ordenes` | `[]` | Lista de órdenes |
| `cargando` | `true` | Flag |
| `error` | `null` | Mensaje |
| `ordenACancelar` | `null` | Orden que abre el modal |

Función `cargarOrdenes()` separada para reutilizar.

### Fetch
- GET `/api/ordenes` al montar.
- PUT `/api/ordenes/:id/cancelar` al confirmar cancelación.

### Handlers
- `formatearFecha(str)` — Helper manual (sin librerías de fechas): `new Date` + `getDate`, `getMonth` + 1, `getFullYear`.
- `handleCancelarOrden(id)` — PUT, maneja 403, al salir bien cierra el modal (`setOrdenACancelar(null)`) y recarga.

### Renderizado condicional
- `cargando` / `error`.
- `ordenes.length === 0` → "Todavía no realizaste ninguna compra".
- Cada orden: tag CONFIRMADA (verde) o CANCELADA (rojo).
- Botón "Cancelar orden" solo si `esConfirmada`.
- Modal al final solo si `ordenACancelar` es truthy.

### Interacciones destacables
- Modal de confirmación controlado por `ordenACancelar` (un objeto, no un boolean, para poder mostrar el ID y total en el modal).

### Preguntas que te pueden hacer
- **¿Por qué guardás el objeto orden entero en `ordenACancelar` y no solo el ID?** Para mostrar `#{ordenACancelar.id}` y `${ordenACancelar.total}` en el modal sin volver a buscar.
- **¿Por qué formateás la fecha manualmente?** Porque no se permite `dayjs` ni `moment`.

---

## 8. MisPeliculas (`src/views/MisPeliculas.jsx`)

### Qué hace
Panel del VENDEDOR. Lista sus propias películas, permite crear una nueva, editar datos, cambiar stock, cambiar descuento, agregar/quitar fotos y eliminar. No existe endpoint "mis películas": pide todas y filtra con `.filter`.

### Props
- `token`, `usuario`.

### Hooks (muchos — es la vista más grande)

Estados principales:
- `peliculas` (`[]`), `categorias` (`[]`), `cargando` (`true`), `error` (`null`).
- `panelAbierto` (`null`) — objeto `{ id, tipo }` que indica qué panel inline está desplegado en qué película.

Estados del formulario de creación:
- `nuevaTitulo`, `nuevaDescripcion`, `nuevoPrecio`, `nuevoStock`, `nuevaCategoriaId` (`''`), `creando` (`false`), `errorCrear` (`null`).

Estados del panel editar:
- `editTitulo`, `editDescripcion`, `editPrecio`, `editCategoriaId`.

Estados de stock/descuento/fotos:
- `nuevoStockValor`, `nuevoDescuento`, `nuevaFotoUrl`.

### `useEffect` con `[]`
Carga categorías y películas al montar:

```js
useEffect(() => {
  fetch(`${URL_BASE}/api/categorias`)...
  cargarPeliculas()
}, [])
```

### Filtrado "mis películas"

```js
const misPeliculas = data.content.filter(
  (p) => p.vendedor && p.vendedor.id === usuario.id
)
```

### Fetch / endpoints

| Método | URL | Para qué |
|---|---|---|
| GET | `/api/peliculas` | Listar (y filtrar) |
| GET | `/api/categorias` | Combo de categorías |
| POST | `/api/peliculas` | Crear |
| PUT | `/api/peliculas/:id` | Editar |
| PUT | `/api/peliculas/:id/stock` | Cambiar stock |
| PUT | `/api/peliculas/:id/descuento` | Cambiar descuento |
| POST | `/api/peliculas/:id/fotos` | Agregar foto (body `{ urls: [url] }`) |
| DELETE | `/api/peliculas/:id/fotos/:fotoId` | Quitar foto |
| DELETE | `/api/peliculas/:id` | Eliminar película |

### Handlers
- `abrirPanel(peliculaId, tipo, pelicula)` — Toggle del panel inline. Si estaba abierto el mismo, lo cierra; si no, lo abre y precarga los campos según el tipo (`'editar'`, `'stock'`, `'descuento'`, `'fotos'`).
- `handleCrearPelicula(e)` — Valida los 5 campos, POST, al salir bien limpia los inputs y recarga.
- `handleEditar(id)`, `handleCambiarStock(id)`, `handleCambiarDescuento(id)`, `handleAgregarFoto(id)`, `handleEliminarFoto(id, fotoId)`, `handleEliminarPelicula(id)` — Todos siguen el mismo patrón: fetch, chequeo de 403, al salir bien recarga.

### Totales sin `reduce`
Como `reduce` no está permitido, se usa un `for` clásico:

```js
let totalStock = 0
for (let i = 0; i < peliculas.length; i++) {
  totalStock = totalStock + peliculas[i].stock
}
```

### Renderizado condicional
- `cargando` / `error`.
- `errorCrear` muestra banner en el formulario de alta.
- Lista vacía → "Todavía no publicaste ninguna película".
- Cada película tiene 4 paneles inline (editar/stock/descuento/fotos) que se muestran según `panelAbierto`.
- Dentro del panel de fotos: si hay fotos, grilla; si no, mensaje.

### Preguntas que te pueden hacer
- **¿Por qué no hay endpoint "mis películas"?** El backend no lo expone. Se pide todo y se filtra con `.filter` por `vendedor.id === usuario.id`.
- **¿Por qué usás un `for` para el totalStock?** Porque `reduce` no está en la lista de métodos permitidos.
- **¿Cómo funciona el toggle de los paneles inline?** `panelAbierto` guarda `{ id, tipo }`. Al clickear el mismo botón dos veces se cierra. Las comparaciones usan `esTipo(t)` que chequea id y tipo.

---

## 9. MiPerfil (`src/views/MiPerfil.jsx`)

### Qué hace
Formulario para que el usuario logueado edite su `username`, `firstName` y `lastName`. El email y el rol se muestran pero no se editan.

### Props
- `token`, `usuario`, `onActualizarUsuario(nuevoUsuario)` — callback para actualizar el estado global.

### Hooks

| Variable | Inicial | Qué guarda |
|---|---|---|
| `username` | `usuario.username` | Input |
| `firstName` | `usuario.firstName` | Input |
| `lastName` | `usuario.lastName` | Input |
| `guardando` | `false` | Flag |
| `error` | `null` | Mensaje |
| `exito` | `false` | Banner de éxito |

Sin `useEffect`: los inputs ya se inicializan con los datos del `usuario` recibido por prop.

### Fetch
- PUT `/api/usuarios/me` con `{ username, firstName, lastName }`.
- Al salir bien, llama a `onActualizarUsuario(data)` para que `App.jsx` refresque el `usuario` global.

### Handlers
- `handleSubmit(e)` — Tres validaciones con `trim()`, PUT, actualiza estado global y muestra banner `exito`.

### Renderizado condicional
- `if (!usuario) return <p>No estás logueado.</p>`
- Banners de éxito y error con botón de cerrar.

### Preguntas que te pueden hacer
- **¿Por qué `onActualizarUsuario`?** Porque si cambia el username, el navbar tiene que mostrar el nuevo. Hay que subir el cambio al estado global de `App.jsx`.
- **¿Por qué los estados se inicializan con `usuario.username` directo y no con `useEffect`?** Porque la vista se monta cuando ya hay un usuario; alcanza con pasar el valor inicial al `useState`.

---

## 10. Categorias (`src/views/Categorias.jsx`)

### Qué hace
Panel ADMIN para listar, crear, editar y eliminar categorías. Vista con form a la izquierda y tabla editable a la derecha.

### Props
- `token`.

### Hooks

| Variable | Inicial | Qué guarda |
|---|---|---|
| `categorias` | `[]` | Lista |
| `cargando` | `true` | Flag |
| `error` | `null` | Mensaje |
| `nuevaDescripcion` | `''` | Input de alta |
| `creando` | `false` | Flag alta |
| `errorCrear` | `null` | Error en alta |
| `editandoId` | `null` | ID de la categoría que se está editando inline |
| `editDescripcion` | `''` | Input de edición |

### Fetch

| Método | URL | Para qué |
|---|---|---|
| GET | `/api/categorias` | Listar |
| POST | `/api/categorias` | Crear |
| PUT | `/api/categorias/:id` | Editar |
| DELETE | `/api/categorias/:id` | Baja lógica |

### Handlers
- `handleCrear(e)` — Valida descripción, POST, limpia input, recarga.
- `abrirEditar(categoria)` — Setea `editandoId` y `editDescripcion`.
- `handleGuardarEdicion(id)` — PUT, cierra el modo edición (`setEditandoId(null)`), recarga.
- `handleEliminar(id)` — DELETE + recarga.

### Renderizado condicional
- Dentro de cada `<tr>`, si `editandoId === categoria.id` → muestra input + botones Guardar/Cancelar. Si no → muestra texto + botones Editar/Eliminar.

### Preguntas que te pueden hacer
- **¿Qué pasa cuando eliminás una categoría?** El backend hace baja lógica: la categoría deja de aparecer en los listados pero sigue existiendo (para no romper películas que la usaban).
- **¿Por qué `editandoId` en vez de un boolean?** Para saber qué fila está en modo edición (solo una a la vez).

---

## 11. Usuarios (`src/views/Usuarios.jsx`)

### Qué hace
Panel ADMIN para listar todos los usuarios, cambiar su rol con un `<select>` o eliminarlos.

### Props
- `token`.

### Hooks
- `usuarios` (`[]`), `cargando` (`true`), `error` (`null`).

### Fetch

| Método | URL | Para qué |
|---|---|---|
| GET | `/api/usuarios` | Listar |
| PUT | `/api/usuarios/:id/rol` | Cambiar rol |
| DELETE | `/api/usuarios/:id` | Eliminar |

### Handlers
- `handleCambiarRol(id, nuevoRol)` — PUT con `{ role: nuevoRol }`, recarga.
- `handleEliminar(id)` — DELETE + recarga.

### Métricas calculadas con `.filter`

```js
const totalAdmins = usuarios.filter((u) => u.role === 'ADMIN').length
const totalVendedores = usuarios.filter((u) => u.role === 'VENDEDOR').length
const totalCompradores = usuarios.filter((u) => u.role === 'COMPRADOR').length
```

### Renderizado condicional
- Loader / error / tabla.
- Dentro de cada fila, badge "VIP ADMIN" o "PRO" según el rol (con `&&`).

### Preguntas que te pueden hacer
- **¿Por qué el `<select>` dispara el PUT directamente en el `onChange`?** Porque es una acción simple e inmediata, no hace falta un botón de confirmar.
- **¿Cómo contás los admins sin `reduce`?** Con `.filter(...).length`.

---

## 12. OrdenesAdmin (`src/views/OrdenesAdmin.jsx`)

### Qué hace
Panel ADMIN de solo lectura: lista todas las órdenes del sistema con comprador, estado, total y detalle de ítems. Muestra métricas de confirmadas vs canceladas arriba.

### Props
- `token`.

### Hooks
- `ordenes` (`[]`), `cargando` (`true`), `error` (`null`).

### Fetch
- GET `/api/admin/ordenes` al montar.

### Handlers / helpers
- `formatearFecha(str)` — Mismo helper manual que en MisOrdenes.
- `totalConfirmadas = ordenes.filter((o) => o.estado === 'CONFIRMADA').length`
- `totalCanceladas = ordenes.filter((o) => o.estado === 'CANCELADA').length`

### Renderizado condicional
- Loader / error / lista vacía.
- Por cada orden: badge CONFIRMADA (verde) o CANCELADA (rojo).
- Si está cancelada: tabla con texto tachado + banner "Orden anulada".

### Datos locales vs servidor
- Todo viene del servidor. No hay edición ni acciones destructivas (el admin solo audita).

### Preguntas que te pueden hacer
- **¿Qué diferencia hay entre esta vista y MisOrdenes?** Esta usa `/api/admin/ordenes` (ADMIN only) y es de solo lectura. MisOrdenes usa `/api/ordenes` (sus propias) y permite cancelar.
- **¿Cómo calculás los totales?** Con `.filter(...).length`, igual que en Usuarios.

---

## Resumen rápido para la defensa oral

- **Un solo estado global** en `App.jsx` con `token` y `usuario`. Nada de Redux, nada de Context.
- **Navegación** con `react-router-dom`: `BrowserRouter` en `main.jsx`, `Routes/Route` en `App.jsx`, `Link` en el navbar, `useNavigate`/`useLocation` donde hace falta.
- **Comunicación con el backend** siempre con `fetch` encadenado (`.then().catch()`), chequeo de `response.ok` y manejo especial del 403.
- **Formularios controlados** con `useState` por campo, validación con `trim()`, `preventDefault` en submit.
- **Renderizado condicional** con `if` antes del return (cargando, error), `&&` (badges, modales) y ternario (precio con/sin descuento, confirmada/cancelada).
- **Listas** con `.map` y `key={item.id}`. Filtrados con `.filter`. Nada de `reduce` ni `sort`.
- **Separación por rol** se hace en dos lugares: en el navbar (qué enlaces se ven) y en cada vista (qué botones/acciones aparecen según `usuario.role`).
