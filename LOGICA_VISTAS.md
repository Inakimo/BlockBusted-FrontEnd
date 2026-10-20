# Lógica de las vistas — BlockBusted Frontend

Documento de estudio para la presentación oral. Explica, para cada vista y componente, qué hace la parte de React: props, hooks, llamadas al backend, handlers, renderizado condicional e interacciones. Todo el proyecto respeta las reglas de clase (solo `useState` + `useEffect`, `fetch` con `.then().catch()`, nada de async/await, nada de optional chaining, etc.).

---

## 0. Fundamentos comunes del proyecto

### 0.1 Estado global (en `App.jsx`)

Hay solo cuatro variables de estado globales, todas en `App.jsx`, que se pasan por props a las vistas que las necesitan:

| Estado | Valor inicial | Para qué sirve |
| :--- | :--- | :--- |
| `token` | `localStorage.getItem('token')` | JWT del usuario logueado. Si existe, se persiste en `localStorage`. |
| `usuario` | `null` | Objeto con `{id, username, email, firstName, lastName, role}` traído de `/api/usuarios/me`. |
| `cantidadCarrito` | `0` | Número de ítems del carrito. Lo muestra el "globo rojo" al lado del link del carrito. |
| `sesionLista` | `false` | Flag para no renderizar las rutas hasta terminar de restaurar la sesión. |

**Restauración de sesión** (al recargar la página, el token sigue en `localStorage`):

```jsx
useEffect(() => {
  if (!token) { setSesionLista(true); return }
  if (usuario) { setSesionLista(true); return }

  fetch(`${URL_BASE}/api/usuarios/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        localStorage.removeItem('token')
        setToken(null)
        setSesionLista(true)
        return
      }
      return response.json().then((data) => {
        setUsuario(data)
        setSesionLista(true)
      })
    })
    .catch((err) => {
      console.error('Error al restaurar sesión', err)
      localStorage.removeItem('token')
      setToken(null)
      setSesionLista(true)
    })
}, [token])
```

Mientras `sesionLista` es `false`, se muestra un mensaje "Restaurando sesión...". Si el token ya no sirve (expiró, 401/403), se limpia `localStorage` y la UI vuelve al estado de "no logueado".

**Login / logout:**

- `handleLogin(nuevoToken, nuevoUsuario)` → guarda token en `localStorage`, llena los estados.
- `handleLogout()` → borra token de `localStorage`, pone `token`/`usuario`/`cantidadCarrito` en null/0.

**Callback para el carrito** (`recargarCantidadCarrito`): hace `GET /api/carrito` y guarda `items.length` en `cantidadCarrito`. Se pasa como prop `onCarritoActualizado` al `Catalogo`, al `Carrito` y a `DetallePelicula`, que la llaman después de cada mutación (agregar, cambiar cantidad, quitar, vaciar, confirmar compra).

También corre automáticamente cuando cambia `token` o `usuario`:

```jsx
useEffect(() => { recargarCantidadCarrito() }, [token, usuario])
```

### 0.2 Navegación condicional (`Navigation.jsx`)

El `<header>` recibe `usuario`, `onLogout` y `cantidadCarrito`. Según el rol, muestra links distintos con renderizado condicional usando `&&`:

- **Sin login:** Catálogo · Iniciar sesión · Registrarse.
- **COMPRADOR:** Catálogo · Carrito (con globo rojo si `cantidadCarrito > 0`) · Mis órdenes.
- **VENDEDOR:** Catálogo · Mis películas.
- **ADMIN:** Catálogo · Categorías · Usuarios · Órdenes.
- Si hay `usuario`: aparece link al perfil con el username y botón Salir que llama `onLogout`.

El globo del carrito se renderiza solo cuando `cantidadCarrito > 0`:

```jsx
{cantidadCarrito > 0 && (
  <span style={{ border: '2px solid #000000', borderRadius: '999px' }}>
    {cantidadCarrito}
  </span>
)}
```

### 0.3 Patrones de fetch

Todas las vistas repiten estos patrones:

1. **GET con `.then().catch()`:**
   ```js
   fetch(URL)
     .then((response) => response.json())
     .then((data) => setAlgo(data))
     .catch((err) => console.error('...', err))
   ```
2. **403 trae cuerpo vacío** (lo tira Spring Security). Antes de hacer `response.json()` se chequea `response.ok` y `response.status === 403`.
3. **Listados paginados:** `GET /api/peliculas` y `GET /api/categorias` responden `{ content: [...] }`, por eso se usa `data.content`.
4. **DELETE exitoso** → cuerpo vacío, no se llama `response.json()`.
5. **Mensajes de error del backend:** se leen de `data.message`.

### 0.4 Reglas de clase cumplidas

- Solo `useState` y `useEffect` (nada de `useRef`, `useContext`, `useMemo`, hooks custom).
- `fetch` + `.then().catch()`, **nunca** `async/await` ni `axios`.
- Sin optional chaining (`?.`) ni nullish coalescing (`??`). Se usa `&&` o `if`.
- Sin `reduce`, `sort`, `forEach`, `join`, `split`, `Object.keys/entries`, `Math.*`, `toFixed`. Para redondear precios se usa `parseInt()`.
- Para sumar totales se usan loops `for` (ver `Carrito.jsx` y `MisPeliculas.jsx`).
- Única dependencia extra: `react-router-dom`.
- `localStorage` sí se usa (el profesor dio luz verde para persistir el token).

---

## 1. App (src/App.jsx)

### 1.1 Qué hace

Es el componente raíz. Define el estado global, hace la restauración de sesión y define las `<Routes>`. Monta `Navigation` arriba y `Footer` abajo.

### 1.2 Hooks usados

| Hook | Para qué |
| :--- | :--- |
| `useState(token)` | Lee `localStorage.getItem('token')` al montar. |
| `useState(usuario)` | Objeto del usuario logueado. |
| `useState(cantidadCarrito)` | Contador para el globo del navbar. |
| `useState(sesionLista)` | Gate para no renderizar `<Routes>` antes de restaurar sesión. |
| `useEffect([token])` | Restaura `usuario` cuando hay token (ver sección 0.1). |
| `useEffect([token, usuario])` | Recarga la cantidad del carrito al cambiar sesión. |

### 1.3 Rutas

| Ruta | Vista | Props relevantes |
| :--- | :--- | :--- |
| `/` | `Catalogo` | token, usuario, onCarritoActualizado |
| `/login` | `Login` | onLogin |
| `/registro` | `Registro` | onLogin |
| `/carrito` | `Carrito` | token, onCarritoActualizado |
| `/mis-ordenes` | `MisOrdenes` | token |
| `/mis-peliculas` | `MisPeliculas` | token, usuario |
| `/mi-perfil` | `MiPerfil` | token, usuario, onActualizarUsuario |
| `/categorias` | `Categorias` | token |
| `/usuarios` | `Usuarios` | token |
| `/ordenes` | `OrdenesAdmin` | token |
| `/pelicula` | `DetallePelicula` | token, usuario, onCarritoActualizado |

### 1.4 Preguntas posibles

- **¿Por qué `sesionLista`?** Para que, si refresco con el token en `localStorage`, no se dibuje el `Navigation` sin usuario (parecería que no estoy logueado). Esperamos a tener el perfil y recién renderizamos.
- **¿Qué pasa si el token expiró?** `GET /api/usuarios/me` devuelve 401/403, limpiamos `localStorage` y seteamos `token = null`.

---

## 2. Navigation (src/components/Navigation.jsx)

### 2.1 Qué hace

Barra de navegación fija arriba. Muestra links distintos según el rol y el globo rojo del carrito. No tiene estado propio: solo props y renderizado condicional con `&&`.

### 2.2 Props

| Prop | Shape |
| :--- | :--- |
| `usuario` | `{id, username, role, ...}` o `null` |
| `onLogout` | Función del padre que resetea sesión |
| `cantidadCarrito` | Número |

### 2.3 Interacciones destacables

- **Globo del carrito:** span circular con borde negro que solo aparece si `cantidadCarrito > 0`.
- Botón Salir llama `onLogout()` → se vacía el estado en `App.jsx`.
- Toda la navegación es con `<Link to="...">` de `react-router-dom`.

### 2.4 Preguntas posibles

- **¿Cómo se actualiza el globo?** `App.jsx` llama `recargarCantidadCarrito()` después de cada acción del carrito y pasa el nuevo número por props.

---

## 3. Footer (src/components/Footer.jsx)

### 3.1 Qué hace

Pie de página puramente visual. No tiene estado, props ni fetch. Solo HTML/CSS con enlaces falsos para dar el aire "retro videoclub".

### 3.2 Preguntas posibles

- **¿Tiene lógica?** No, es un mockup estético.

---

## 4. TarjetaPelicula (src/components/TarjetaPelicula.jsx)

### 4.1 Qué hace

Tarjeta reutilizable del catálogo. Muestra foto, categoría, título, precio (con/sin descuento), stock. Si el usuario es COMPRADOR, agrega input de cantidad y botón "ALQUILAR".

### 4.2 Props

| Prop | Para qué |
| :--- | :--- |
| `pelicula` | Objeto `Pelicula` del backend |
| `token` | Para habilitar/deshabilitar acciones |
| `usuario` | Para saber el rol |
| `onAgregarAlCarrito` | Función del padre `(peliculaId, cantidad)` |

### 4.3 Hooks

- `useState(cantidad)` = 1 → input de cantidad.
- `useNavigate()` → para ir a `/pelicula` al clickear la foto o el título.

### 4.4 Handlers

- `handleVerDetalle()` → `navigate('/pelicula', { state: { peliculaId: pelicula.id } })`. Pasa el id vía router state en lugar de un parámetro de URL.
- `handleAgregar()` → llama `onAgregarAlCarrito(pelicula.id, cantidad)`.

### 4.5 Renderizado condicional

- Si `tieneDescuento` (`descuentoPorcentaje > 0`): precio original tachado + precio final.
- Si `pelicula.stock > 0`: input + botón; si no: cartel "Sin stock".
- Botón solo visible si el usuario es COMPRADOR; si no, muestra un adorno con código BB-{id}.

### 4.6 Preguntas posibles

- **¿Cómo calculás el precio final?** `const precioFinal = parseInt(precio - precio * descuento / 100)`. Uso `parseInt` para evitar decimales (no puedo usar `toFixed` ni `Math.round`).

---

## 5. Catálogo (src/views/Catalogo.jsx)

### 5.1 Qué hace

Vista pública. Lista todas las películas (opcionalmente filtradas por categoría), permite al COMPRADOR agregarlas al carrito, muestra un toast al hacerlo.

### 5.2 Props

`token`, `usuario`, `onCarritoActualizado`.

### 5.3 Hooks

| State | Inicial | Para qué |
| :--- | :--- | :--- |
| `peliculas` | `[]` | Resultado del GET de películas |
| `categorias` | `[]` | Para el `<select>` del filtro |
| `categoriaSeleccionada` | `''` | Id del filtro activo |
| `cargando` | `true` | Loader |
| `error` | `null` | Mensaje de error |
| `mensajeCarrito` | `null` | Toast `{tipo, texto}` |

- `useEffect([])` → carga categorías una sola vez.
- `useEffect([categoriaSeleccionada])` → re-hace el GET de películas cuando cambia el filtro.

### 5.4 Endpoints

| Método | URL | Cuándo |
| :--- | :--- | :--- |
| GET | `/api/categorias` | Al montar |
| GET | `/api/peliculas` o `/api/peliculas?categoriaId=X` | Al cambiar el filtro |
| POST | `/api/carrito/items` body `{peliculaId, cantidad}` | Al hacer click en Alquilar |

### 5.5 Handlers

- `handleAgregarAlCarrito(peliculaId, cantidad)` → POST al carrito. Si falla, muestra `data.message` en el toast rojo. Si funciona, toast verde y llama `onCarritoActualizado()` para refrescar el globo del navbar.

### 5.6 Renderizado condicional

- `if (cargando) return <p>Cargando...</p>`
- `if (error) return <p>{error}</p>`
- Si `peliculas.length === 0` → mensaje de "pasillo vacío"; si no, grid con `.map()` de `TarjetaPelicula`.
- Toast flotante solo cuando `mensajeCarrito` no es null; se limpia con `setTimeout(..., 3000/4000)`.

### 5.7 Preguntas posibles

- **¿Por qué dos `useEffect`?** Uno para categorías (una vez), otro para películas (se re-dispara cada vez que cambia la categoría seleccionada).

---

## 6. Login (src/views/Login.jsx)

### 6.1 Qué hace

Formulario de inicio de sesión. Autentica, obtiene el perfil y llama `onLogin(token, usuario)` del padre para activar la sesión.

### 6.2 Hooks

`useState` para `email`, `password`, `mostrarPassword`, `error`, `cargando`. `useNavigate()` para redirigir a `/` después del login.

### 6.3 Endpoints

| Método | URL | Body |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/authenticate` | `{email, password}` → `{access_token}` |
| GET | `/api/usuarios/me` | con `Authorization: Bearer <token>` |

### 6.4 Handlers

- `handleSubmit(e)`: valida con `trim() === ''`, hace el POST de auth, con el token hace un segundo fetch del perfil, llama `onLogin` y navega a `/`.
- `cargarRolRapido(email, password)`: rellena los inputs con credenciales de prueba (botones Comprador / Vendedor / Admin).

### 6.5 Renderizado condicional

- Banner de error solo si `error`.
- Botón muestra "REBOBINANDO..." si `cargando === true`.
- Input de contraseña cambia `type` según `mostrarPassword`.

### 6.6 Preguntas posibles

- **¿Por qué dos fetch encadenados?** Porque el backend devuelve solo el token; el rol y los datos del usuario vienen de `/api/usuarios/me`.

---

## 7. Registro (src/views/Registro.jsx)

### 7.1 Qué hace

Formulario para crear cuenta. Igual que Login pero con más campos (`username`, `firstname`, `lastname`, `email`, `password`, `role`). Al registrar, hace el mismo flujo (token → perfil → `onLogin` → navegar a `/`).

### 7.2 Hooks

`useState` para cada campo + `mostrarPassword`, `error`, `cargando`. `useNavigate()`.

### 7.3 Endpoint

| Método | URL | Body |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/register` | `{username, firstname, lastname, email, password, role}` |
| GET | `/api/usuarios/me` | para traer el perfil con el token nuevo |

### 7.4 Handlers

- `handleSubmit(e)`: validaciones con `trim()`, POST de registro, luego `/me`, luego `onLogin` + `navigate('/')`.

### 7.5 Preguntas posibles

- **¿Por qué solo COMPRADOR o VENDEDOR en el select?** Porque ADMIN solo lo asigna un ADMIN desde `Usuarios`.

---

## 8. Detalle de película (src/views/DetallePelicula.jsx)

### 8.1 Qué hace

Vista compacta (sin scroll) del detalle de una película. Recibe el id vía `useLocation().state.peliculaId`. Muestra poster grande, miniaturas clickeables, descripción, precio, stock y controles de compra.

### 8.2 Hooks

| State | Para qué |
| :--- | :--- |
| `pelicula` (null) | Datos del backend |
| `cargando` (true) | Loader |
| `error` (null) | Mensaje de error |
| `fotoActiva` (0) | Índice de la foto grande que se ve |
| `cantidad` (1) | Para agregar al carrito |
| `mensajeCarrito` (null) | Mini alert de agregado |

- `useLocation()` para leer el `state`.
- `useNavigate()` para "volver" y para ir al login si no hay token.
- `useEffect([peliculaId])` → carga la película. Si no hay id, redirige a `/`.

### 8.3 Endpoints

| Método | URL |
| :--- | :--- |
| GET | `/api/peliculas/{id}` |
| POST | `/api/carrito/items` body `{peliculaId, cantidad}` |

### 8.4 Handlers

- `handleAgregarAlCarrito()` → si no hay token, va a `/login`. Si no, POST. Maneja 403 explícito. Si todo bien, llama `onCarritoActualizado()`.
- `disminuir()` / `aumentar()` → cambian `cantidad` respetando `pelicula.stock`.
- Click en una miniatura → `setFotoActiva(indice)`.

### 8.5 Renderizado condicional

- `if (cargando) ...`, `if (error) ...`, `if (!pelicula) return null`.
- Precio tachado solo si `tieneDescuento`.
- Bloque de controles solo si usuario COMPRADOR y hay stock; si no hay usuario, muestra botón "Iniciá sesión para comprar" que lleva a `/login`.

### 8.6 Preguntas posibles

- **¿Por qué `location.state` y no `useParams`?** Porque `useParams` no lo vimos en clase. El id se pasa como estado del router al navegar desde la tarjeta.

---

## 9. Carrito (src/views/Carrito.jsx)

### 9.1 Qué hace

Muestra los ítems del carrito del comprador, permite cambiar cantidad, quitar un ítem, vaciar y confirmar la compra. Calcula el total en el cliente con un `for` (no se puede usar `reduce`).

### 9.2 Hooks

| State | Para qué |
| :--- | :--- |
| `carrito` (null) | `{ id, items: [...] }` |
| `cargando` (true) | Loader |
| `error` (null) | Mensaje de error |
| `confirmando` (false) | Deshabilita el botón mientras se procesa la compra |

- `useEffect([])` → llama `cargarCarrito()` una vez.
- `useNavigate()` para ir a `/mis-ordenes` después de confirmar.

### 9.3 Endpoints

| Método | URL | Cuándo |
| :--- | :--- | :--- |
| GET | `/api/carrito` | Al cargar / tras cada acción |
| PUT | `/api/carrito/items/{itemId}` body `{cantidad}` | Cambiar cantidad |
| DELETE | `/api/carrito/items/{itemId}` | Quitar un ítem |
| DELETE | `/api/carrito` | Vaciar todo |
| POST | `/api/ordenes` sin body | Confirmar compra |

### 9.4 Handlers

- `handleCambiarCantidad(itemId, nuevaCantidad)` → PUT; si falla con 403, alerta; si no, recarga carrito + llama `onCarritoActualizado()`.
- `handleQuitarItem(itemId)` → DELETE del ítem.
- `handleVaciarCarrito()` → DELETE del carrito completo (el backend responde con cuerpo vacío, por eso no se llama `.json()`).
- `handleConfirmarCompra()` → POST a `/api/ordenes`. En éxito, navega a `/mis-ordenes`.

### 9.5 Cálculo del total (sin `reduce`)

```js
let totalCarrito = 0
for (const it of items) {
  const p = it.pelicula
  if (p) {
    const pf = p.descuentoPorcentaje > 0
      ? parseInt(p.precio - p.precio * p.descuentoPorcentaje / 100)
      : p.precio
    totalCarrito = totalCarrito + pf * it.cantidad
  }
}
```

### 9.6 Renderizado condicional

- Loader / error / "carrito vacío" / lista + ticket.
- Botón "Confirmar compra" muestra "Procesando..." mientras `confirmando` es true.

### 9.7 Preguntas posibles

- **¿Por qué el for en vez de `reduce`?** Porque `reduce` no lo vimos en clase.
- **¿Por qué `parseInt`?** Para redondear sin usar `Math.round` ni `toFixed`.

---

## 10. Mis órdenes (src/views/MisOrdenes.jsx)

### 10.1 Qué hace

Lista las órdenes del comprador. Cada orden muestra fecha, estado (CONFIRMADA/CANCELADA), total y una tabla con sus detalles. Permite cancelar órdenes CONFIRMADAS con un modal de confirmación.

### 10.2 Hooks

| State | Para qué |
| :--- | :--- |
| `ordenes` (`[]`) | Lista de órdenes |
| `cargando` (true) | Loader |
| `error` (null) | Mensaje de error |
| `ordenACancelar` (null) | Orden seleccionada para el modal |

- `useEffect([])` → `cargarOrdenes()`.

### 10.3 Endpoints

| Método | URL |
| :--- | :--- |
| GET | `/api/ordenes` |
| PUT | `/api/ordenes/{id}/cancelar` |

### 10.4 Handlers

- `cargarOrdenes()` → GET y setea estado.
- `formatearFecha(fechaStr)` → parsea ISO y arma `dd/mm/aaaa` manualmente con `getDate/getMonth/getFullYear` (sin librerías).
- `handleCancelarOrden(ordenId)` → PUT. Si éxito, cierra el modal (`setOrdenACancelar(null)`) y recarga la lista.

### 10.5 Interacciones

- Modal de cancelación: se renderiza solo cuando `ordenACancelar` no es null. Botones "No, mantener" (cierra) y "Sí, cancelar" (llama al handler).

### 10.6 Renderizado condicional

- Botón "Cancelar orden" solo visible si la orden está `CONFIRMADA`.
- Si está `CANCELADA`, muestra cartel de "Orden anulada".

### 10.7 Preguntas posibles

- **¿Por qué el modal como estado y no `confirm()`?** Para una UX más cuidada y porque podemos cerrarlo sin cancelar.

---

## 11. Mis películas (src/views/MisPeliculas.jsx)

### 11.1 Qué hace

Panel del VENDEDOR. Lista sus películas (filtradas en el cliente), permite crear una nueva, editar datos, cambiar stock, cambiar descuento, administrar fotos y eliminar.

### 11.2 Hooks (muchos `useState`)

- Datos: `peliculas`, `categorias`, `cargando`, `error`.
- Panel inline: `panelAbierto` (`{id, tipo}` o `null`). `tipo` ∈ `'editar' | 'stock' | 'descuento' | 'fotos'`.
- Form "crear": `nuevaTitulo`, `nuevaDescripcion`, `nuevoPrecio`, `nuevoStock`, `nuevaCategoriaId`, `creando`, `errorCrear`.
- Form "editar": `editTitulo`, `editDescripcion`, `editPrecio`, `editCategoriaId`.
- Otros panels: `nuevoStockValor`, `nuevoDescuento`, `nuevaFotoUrl`.

`useEffect([])` → carga categorías y películas (vía `cargarPeliculas()`).

Filtrado "mis películas":

```js
const misPeliculas = data.content.filter(
  (p) => p.vendedor && p.vendedor.id === usuario.id
)
```

### 11.3 Endpoints

| Método | URL | Para qué |
| :--- | :--- | :--- |
| GET | `/api/peliculas` | Todas (se filtra en cliente) |
| GET | `/api/categorias` | Para el `<select>` |
| POST | `/api/peliculas` | Crear |
| PUT | `/api/peliculas/{id}` | Editar título/desc/precio/categoría |
| PUT | `/api/peliculas/{id}/stock` | Cambiar stock |
| PUT | `/api/peliculas/{id}/descuento` | Cambiar descuento |
| POST | `/api/peliculas/{id}/fotos` body `{urls:[url]}` | Agregar foto |
| DELETE | `/api/peliculas/{id}/fotos/{fotoId}` | Quitar foto |
| DELETE | `/api/peliculas/{id}` | Eliminar película |

### 11.4 Handlers

Cada handler sigue el mismo patrón: validar inputs con `.trim()` o `=== ''`, hacer fetch con JWT, manejar 403 con `alert`, en éxito cerrar panel + `cargarPeliculas()`.

- `abrirPanel(peliculaId, tipo, pelicula)` → setea `panelAbierto` y pre-rellena los inputs del panel con los datos actuales. Si se vuelve a clickear el mismo panel, lo cierra (toggle).

### 11.5 Total de stock (sin `reduce`)

```js
let totalStock = 0
for (let i = 0; i < peliculas.length; i++) {
  totalStock = totalStock + peliculas[i].stock
}
```

### 11.6 Renderizado condicional

- Loader/error.
- Formulario de "crear" con `errorCrear` en banner.
- Si no hay películas → mensaje; si no, `.map()` que renderiza cada tarjeta + los paneles inline (`esTipo('editar') && ...`).

### 11.7 Preguntas posibles

- **¿Por qué filtrás en el cliente?** Porque el backend no tiene un endpoint "mis películas". Se usa el GET general y `filter` por `pelicula.vendedor.id === usuario.id`.
- **¿Por qué `panelAbierto` como objeto?** Para saber a la vez a qué película y qué tipo de panel está abierto; con un solo state se garantiza que solo haya un panel abierto por vez.

---

## 12. Mi perfil (src/views/MiPerfil.jsx)

### 12.1 Qué hace

Form para editar `username`, `firstName` y `lastName`. El email y el rol se muestran pero no se pueden cambiar.

### 12.2 Hooks

`useState` para `username`, `firstName`, `lastName` (iniciados con los valores de `usuario`), `guardando`, `error`, `exito`.

### 12.3 Props

`token`, `usuario`, `onActualizarUsuario` (es el propio `setUsuario` de App).

### 12.4 Endpoint

| Método | URL | Body |
| :--- | :--- | :--- |
| PUT | `/api/usuarios/me` | `{username, firstName, lastName}` |

### 12.5 Handler

- `handleSubmit(e)` → valida con `trim()`, PUT, en éxito llama `onActualizarUsuario(data)` para que el navbar también muestre el nuevo username.

### 12.6 Renderizado condicional

- Si `!usuario` → "No estás logueado".
- Banners de éxito/error con botones de cerrar.

### 12.7 Preguntas posibles

- **¿Por qué el padre te pasa `setUsuario` como prop?** Para que después de guardar, el estado global quede sincronizado sin repetir el fetch.

---

## 13. Categorías (src/views/Categorias.jsx)

### 13.1 Qué hace

Vista de ADMIN para dar de alta, editar y eliminar categorías.

### 13.2 Hooks

- `categorias`, `cargando`, `error`.
- Form crear: `nuevaDescripcion`, `creando`, `errorCrear`.
- Edición inline: `editandoId` (id de la fila en edición) + `editDescripcion`.

`useEffect([])` → `cargarCategorias()`.

### 13.3 Endpoints

| Método | URL | Cuándo |
| :--- | :--- | :--- |
| GET | `/api/categorias` | Al montar |
| POST | `/api/categorias` body `{descripcion}` | Crear |
| PUT | `/api/categorias/{id}` body `{descripcion}` | Guardar edición |
| DELETE | `/api/categorias/{id}` | Eliminar |

### 13.4 Handlers

- `handleCrear(e)` → POST. 409 (ya existe) se muestra como `errorCrear`.
- `abrirEditar(categoria)` → prepara `editandoId` y `editDescripcion`.
- `handleGuardarEdicion(id)` → PUT; en éxito, `setEditandoId(null)` + recarga.
- `handleEliminar(id)` → DELETE (baja lógica en el backend).

### 13.5 Renderizado condicional

Cada fila: si `editandoId === categoria.id` muestra un input + botones "Guardar/Cancelar"; si no, muestra el texto + botones "Editar/Eliminar".

### 13.6 Preguntas posibles

- **¿Qué pasa si una categoría ya existe?** El backend tira 409 con `message`, que se muestra en el banner `errorCrear`.

---

## 14. Usuarios (src/views/Usuarios.jsx)

### 14.1 Qué hace

Vista de ADMIN. Lista todos los usuarios con sus roles y permite cambiarles el rol con un `<select>` o eliminarlos.

### 14.2 Hooks

`usuarios`, `cargando`, `error`. `useEffect([])` → `cargarUsuarios()`.

### 14.3 Endpoints

| Método | URL | Body |
| :--- | :--- | :--- |
| GET | `/api/usuarios` | — |
| PUT | `/api/usuarios/{id}/rol` | `{role}` |
| DELETE | `/api/usuarios/{id}` | — |

### 14.4 Handlers

- `handleCambiarRol(id, nuevoRol)` → PUT. Dispara desde `onChange` del `<select>` de cada fila.
- `handleEliminar(id)` → DELETE.

### 14.5 Datos derivados

Calcula contadores con `.filter(...).length`:

```js
const totalAdmins = usuarios.filter((u) => u.role === 'ADMIN').length
const totalVendedores = usuarios.filter((u) => u.role === 'VENDEDOR').length
const totalCompradores = usuarios.filter((u) => u.role === 'COMPRADOR').length
```

### 14.6 Preguntas posibles

- **¿Por qué `filter` y no `reduce`?** `filter` sí lo vimos; `reduce` no.

---

## 15. Órdenes admin (src/views/OrdenesAdmin.jsx)

### 15.1 Qué hace

Vista de ADMIN. Lista TODAS las órdenes del sistema (de todos los usuarios), con sus detalles. Solo lectura (no cancela ni modifica).

### 15.2 Hooks

`ordenes`, `cargando`, `error`. `useEffect([])` → fetch inicial.

### 15.3 Endpoint

| Método | URL |
| :--- | :--- |
| GET | `/api/admin/ordenes` con `Authorization: Bearer <token>` |

### 15.4 Helpers

- `formatearFecha(fechaStr)` igual que en `MisOrdenes`.
- `totalConfirmadas` y `totalCanceladas` con `.filter(...).length`.

### 15.5 Renderizado condicional

- Loader / error / "no hay órdenes" / lista con `.map()`.
- Cada orden muestra badge verde (CONFIRMADA) o rojo (CANCELADA) y el total tachado si está cancelada.
- Si `orden.estado === 'CANCELADA'` muestra el cartel "Orden anulada" debajo de la tabla.

### 15.6 Preguntas posibles

- **¿Por qué no se cancelan desde acá?** Porque solo el comprador dueño puede cancelar su orden (regla del backend). El admin solo audita.

---

## Resumen oral (10 bullets para presentar)

1. **Estructura:** proyecto Vite + React (JSX, JavaScript puro), `react-router-dom` como única dependencia extra. Carpetas `views/` y `components/`.
2. **Estado global en `App.jsx`:** solo cuatro `useState` (`token`, `usuario`, `cantidadCarrito`, `sesionLista`), que se pasan por props. Sin Context, Redux ni Zustand.
3. **Sesión persistida:** el token vive en `localStorage`. Al cargar la app, un `useEffect` lee el token y hace `GET /api/usuarios/me` para restaurar el usuario; mientras tanto, `sesionLista = false` evita renderizar las rutas.
4. **Navegación por rol:** `Navigation` cambia los links con `&&` según `usuario.role`. El carrito muestra un globo rojo cuando `cantidadCarrito > 0`, que `App.jsx` mantiene actualizado con un callback `onCarritoActualizado`.
5. **Patrón de fetch:** siempre `.then((response) => response.json()).then(...).catch(console.error)`. Los endpoints protegidos mandan `Authorization: Bearer <token>`. Antes de `response.json()` chequeo `response.ok` por el 403 con cuerpo vacío.
6. **Listados paginados:** uso `data.content` para películas y categorías porque Spring los envuelve en un Page.
7. **Formularios:** `<form onSubmit>`, estado por input, validación con `trim() === ''`, mensajes de error vienen de `data.message` del backend.
8. **Cálculos sin `reduce`/`Math`:** el total del carrito y la suma de stock se hacen con `for`. Los precios con descuento se redondean con `parseInt(precio - precio * descuento / 100)`.
9. **Interacciones ricas:** toasts con `setTimeout`, modal de cancelar orden (`ordenACancelar`), panel inline en `MisPeliculas` (`panelAbierto = {id, tipo}`), edición inline en Categorías.
10. **Reglas de clase:** sin `async/await`, sin `?.`, sin `??`, sin hooks custom, sin `useRef`/`useContext`/`useMemo`/`useParams`. Para pasar el id al detalle uso `location.state`. Estilos con Tailwind (sumado al permiso de la profe para librerías visuales); la lógica sigue siendo "estudiante que recién aprendió React".
