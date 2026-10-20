# BlockBusted Frontend — Guía de Presentación

## 1. Arquitectura general

El proyecto es una **Single Page Application (SPA)** hecha con **React + Vite**.

```
src/
├── main.jsx          → punto de entrada, monta <App> dentro de <BrowserRouter>
├── App.jsx           → estado global + definición de rutas
├── components/
│   ├── Navigation.jsx    → menú de navegación (cambia según el rol)
│   └── TarjetaPelicula.jsx → tarjeta individual en el catálogo
└── views/
    ├── Catalogo.jsx      → lista de películas (público)
    ├── Login.jsx         → formulario de login
    ├── Registro.jsx      → formulario de registro
    ├── Carrito.jsx       → carrito de compras (COMPRADOR)
    ├── MisOrdenes.jsx    → historial de órdenes (COMPRADOR)
    ├── MisPeliculas.jsx  → ABM de películas (VENDEDOR)
    ├── Categorias.jsx    → ABM de categorías (ADMIN)
    ├── Usuarios.jsx      → gestión de usuarios (ADMIN)
    ├── OrdenesAdmin.jsx  → todas las órdenes (ADMIN)
    ├── MiPerfil.jsx      → ver y editar perfil (cualquier usuario logueado)
    └── DetallePelicula.jsx → detalle de una película
```

**Backend:** Spring Boot corriendo en `http://localhost:4002`. Se conecta con `fetch`.

---

## 2. Estado global y autenticación

### Estado global en App.jsx

```jsx
const [token, setToken] = useState(null)
const [usuario, setUsuario] = useState(null)
```

- `token`: el JWT que devuelve el backend al loguear
- `usuario`: objeto `{ id, username, email, firstName, lastName, role }`
- Ambos viven en `App.jsx` y se pasan por **props** a las vistas que los necesitan
- Si recargás la página, se pierden (no hay localStorage). Es intencional.

### Flujo de login (Login.jsx)

1. Usuario llena email + password y hace submit
2. `fetch POST /api/v1/auth/authenticate` → recibe `{ access_token }`
3. Con ese token, hace un segundo `fetch GET /api/usuarios/me` con el header `Authorization: Bearer <token>`
4. Recibe el objeto usuario con su rol
5. Llama `onLogin(token, usuario)` → `App.jsx` guarda los dos en estado
6. Redirige al catálogo con `useNavigate()`

```jsx
function handleLogin(nuevoToken, nuevoUsuario) {
  setToken(nuevoToken)
  setUsuario(nuevoUsuario)
}
```

### Cierre de sesión

`handleLogout()` en App.jsx pone token y usuario en `null`. Navigation llama a esa función con `onLogout`.

---

## 3. Navegación condicional (Navigation.jsx)

El menú cambia según el valor de `usuario.role` usando renderizado condicional:

```jsx
{!usuario && (
  // Mostrar: Iniciar sesión · Registrarse
)}
{usuario && usuario.role === 'COMPRADOR' && (
  // Mostrar: Carrito · Mis órdenes
)}
{usuario && usuario.role === 'VENDEDOR' && (
  // Mostrar: Mis películas
)}
{usuario && usuario.role === 'ADMIN' && (
  // Mostrar: Categorías · Usuarios · Órdenes
)}
{usuario && (
  // Mostrar: Mi perfil · Salir (para cualquier usuario logueado)
)}
```

---

## 4. Cómo se hacen los fetch

### Patrón básico (GET público)

```jsx
fetch(`${URL_BASE}/api/peliculas`)
  .then((response) => response.json())
  .then((data) => {
    setPeliculas(data.content)   // respuestas paginadas traen .content
    setCargando(false)
  })
  .catch((error) => {
    console.error('Error al cargar películas', error)
    setError('No se pudieron cargar las películas.')
    setCargando(false)
  })
```

### Con autenticación (POST protegido)

```jsx
fetch(`${URL_BASE}/api/carrito/items`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ peliculaId, cantidad }),
})
  .then((response) => {
    if (!response.ok) {
      return response.json().then((data) => {
        alert(data.message)   // el backend devuelve { message: "..." }
      })
    }
    cargarCarrito()   // refrescar datos después de cada acción
  })
  .catch((error) => { console.error(error) })
```

### Casos especiales importantes

| Situación | Cómo manejarlo |
|-----------|---------------|
| Error 403 (sin permiso/sin token) | Spring Security devuelve cuerpo vacío, NO llamar `.json()`. Checar `response.status === 403` antes |
| DELETE exitoso | Responde 200 con cuerpo vacío. NO llamar `response.json()` |
| Listados paginados | La lista viene en `data.content`, no directamente en `data` |

---

## 5. Vistas — qué hace cada una

### Catálogo (público)
- Al montar: carga categorías con `useEffect([], [])`
- Al cambiar `categoriaSeleccionada`: carga películas filtradas con `useEffect([categoriaSeleccionada])`
- Si es COMPRADOR: muestra input de cantidad + botón "Agregar al carrito"
- Si stock = 0: muestra "Sin stock"

### Login y Registro
- Formulario controlado con `useState` por campo
- Validación con `if (campo.trim() === '') { alert(...); return }`
- Después de login exitoso → llama `onLogin(token, usuario)` y redirige con `useNavigate()`

### Carrito (COMPRADOR)
- Carga el carrito al montar
- Acciones: cambiar cantidad (PUT), quitar item (DELETE), vaciar carrito (DELETE /api/carrito)
- "Confirmar compra": POST /api/ordenes → redirige a Mis órdenes

### Mis órdenes (COMPRADOR)
- Lista las órdenes del usuario
- Botón "Cancelar orden" solo aparece si `orden.estado === 'CONFIRMADA'`

### Mis películas (VENDEDOR)
- Carga todas las películas y filtra con `.filter()` las que tienen `pelicula.vendedor.id === usuario.id`
- Formulario para crear nueva película
- Por cada película: botones Editar / Stock / Descuento / Fotos / Eliminar
- Cada botón abre un "panel inline" controlado con `panelAbierto = { id, tipo }`

### Categorías (ADMIN)
- Lista de categorías, formulario para crear, botón editar inline, botón eliminar (baja lógica)

### Usuarios (ADMIN)
- Lista de usuarios, `<select>` para cambiar rol (PUT /api/usuarios/{id}/rol), botón eliminar

### Órdenes Admin (ADMIN)
- Todas las órdenes del sistema con comprador y estado

### Mi perfil
- Muestra datos del usuario
- Formulario para editar username, firstName, lastName (PUT /api/usuarios/me)
- Llama `onActualizarUsuario(datosActualizados)` para actualizar el estado en App.jsx

---

## 6. Conceptos de React usados

### useState
```jsx
const [peliculas, setPeliculas] = useState([])
const [cargando, setCargando] = useState(true)
const [error, setError] = useState(null)
```
Cada vista tiene su propio estado local para los datos, el estado de carga y los errores.

### useEffect
```jsx
// Cargar al montar (array vacío)
useEffect(() => {
  cargarDatos()
}, [])

// Cargar cuando cambia una dependencia
useEffect(() => {
  cargarPeliculas()
}, [categoriaSeleccionada])
```

### Renderizado condicional
```jsx
// Si cargando, mostrar mensaje
if (cargando) return <p>Cargando...</p>
if (error) return <p>{error}</p>

// Dentro del JSX
{items.length === 0 ? (
  <p>Tu carrito está vacío.</p>
) : (
  <div>...</div>
)}

// Con &&
{usuario && <p>Hola {usuario.username}</p>}
```

### Listas con .map()
```jsx
{peliculas.map((pelicula) => (
  <TarjetaPelicula key={pelicula.id} pelicula={pelicula} />
))}
```

### Props y comunicación padre-hijo
- El padre pasa datos al hijo: `<Carrito token={token} />`
- El hijo avisa al padre: `<Login onLogin={handleLogin} />`

### useNavigate
```jsx
const navigate = useNavigate()
navigate('/')   // redirige después de una acción
```

---

## 7. Preguntas frecuentes en presentaciones

**¿Dónde se guarda el token?**
En el estado de `App.jsx` con `useState`. No se usa `localStorage`.

**¿Por qué se pierde la sesión al recargar?**
Porque el token vive en memoria (estado de React), no en almacenamiento persistente. Es la decisión de diseño del proyecto.

**¿Cómo sabe la app qué menú mostrar?**
Después de loguear, llama a `/api/usuarios/me` para obtener el rol. Ese rol se guarda en el estado `usuario` y la Navigation lo lee para mostrar las opciones correctas.

**¿Cómo funciona el filtro de películas por categoría?**
El `<select>` actualiza el estado `categoriaSeleccionada`. El `useEffect` tiene esa variable como dependencia, entonces se vuelve a ejecutar y hace un nuevo `fetch` al backend con `?categoriaId=...`.

**¿Cómo el vendedor ve solo sus películas?**
El backend no tiene un endpoint "mis películas". La app pide todas las películas y filtra con `.filter()` las que tienen `pelicula.vendedor.id === usuario.id`.

**¿Qué pasa si el backend devuelve un error?**
Se chequea `response.ok`. Si es `false`, se lee `data.message` y se muestra al usuario con `alert()` o en un `<div>` de error.

**¿Cómo se actualiza la lista después de una acción (crear, editar, eliminar)?**
Después de cada operación exitosa se vuelve a llamar la función que carga los datos (por ejemplo `cargarPeliculas()`). No hay un estado global sincronizado, se refrescan los datos desde el servidor.

**¿Por qué algunos DELETE no llaman .json()?**
El backend responde con cuerpo vacío en los DELETE exitosos. Llamar `.json()` sobre un cuerpo vacío tira error. Solo se llama `.json()` cuando sabemos que hay un body (POST, PUT, y los DELETE fallidos que devuelven un mensaje de error).

---

## 8. Flujo completo de una compra

1. Usuario (COMPRADOR) entra al catálogo → ve las películas
2. Elige cantidad y hace clic en "Agregar al carrito" → `POST /api/carrito/items`
3. Va a Carrito → ve los items, puede cambiar cantidades o quitar items
4. Hace clic en "Confirmar compra" → `POST /api/ordenes` (sin body)
5. El backend crea la orden y vacía el carrito → la app redirige a Mis órdenes
6. En Mis órdenes puede ver la orden y cancelarla si quiere → `PUT /api/ordenes/{id}/cancelar`
