import { useState, useEffect } from 'react'
import TarjetaPelicula from '../components/TarjetaPelicula.jsx'
import './Catalogo.css'

const URL_BASE = 'http://localhost:4002'

function Catalogo({ token, usuario }) {
  const [peliculas, setPeliculas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [mensajeCarrito, setMensajeCarrito] = useState(null)

  useEffect(() => {
    fetch(`${URL_BASE}/api/categorias`)
      .then((response) => response.json())
      .then((data) => { setCategorias(data.content) })
      .catch((error) => { console.error('Error al cargar categorías', error) })
  }, [])

  useEffect(() => {
    setCargando(true)
    setError(null)

    const urlPeliculas = categoriaSeleccionada
      ? `${URL_BASE}/api/peliculas?categoriaId=${categoriaSeleccionada}`
      : `${URL_BASE}/api/peliculas`

    fetch(urlPeliculas)
      .then((response) => response.json())
      .then((data) => {
        setPeliculas(data.content)
        setCargando(false)
      })
      .catch((error) => {
        console.error('Error al cargar películas', error)
        setError('No se pudieron cargar las películas.')
        setCargando(false)
      })
  }, [categoriaSeleccionada])

  function handleAgregarAlCarrito(peliculaId, cantidad) {
    if (!token) return

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
            setMensajeCarrito({ tipo: 'error', texto: data.message })
            setTimeout(() => setMensajeCarrito(null), 4000)
          })
        }
        setMensajeCarrito({ tipo: 'exito', texto: '¡Película agregada al carrito!' })
        setTimeout(() => setMensajeCarrito(null), 3000)
      })
      .catch((error) => {
        console.error('Error al agregar al carrito', error)
        setMensajeCarrito({ tipo: 'error', texto: 'No se pudo agregar al carrito.' })
        setTimeout(() => setMensajeCarrito(null), 4000)
      })
  }

  if (cargando) return <p className="estado-mensaje">Cargando películas...</p>
  if (error) return <p className="estado-error">{error}</p>

  return (
    <section>
      <div className="catalogo-encabezado">
        <h1 className="catalogo-titulo">Catálogo</h1>

        <div className="catalogo-filtro">
          <label htmlFor="filtroCategoria" className="filtro-label">Categoría</label>
          <select
            id="filtroCategoria"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.descripcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mensajeCarrito && (
        <div className={mensajeCarrito.tipo === 'exito' ? 'alerta-exito' : 'alerta-error'}>
          {mensajeCarrito.texto}
        </div>
      )}

      {peliculas.length === 0 ? (
        <p className="estado-mensaje">No hay películas en esta categoría.</p>
      ) : (
        <div className="catalogo-grilla">
          {peliculas.map((pelicula) => (
            <TarjetaPelicula
              key={pelicula.id}
              pelicula={pelicula}
              token={token}
              usuario={usuario}
              onAgregarAlCarrito={handleAgregarAlCarrito}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Catalogo
