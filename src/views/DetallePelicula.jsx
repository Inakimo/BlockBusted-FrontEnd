import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './DetallePelicula.css'

const URL_BASE = 'http://localhost:4002'

function DetallePelicula({ token, usuario }) {
  const location = useLocation()
  const navigate = useNavigate()
  const peliculaId = location.state && location.state.peliculaId

  const [pelicula, setPelicula] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [fotoActiva, setFotoActiva] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [mensajeCarrito, setMensajeCarrito] = useState(null)

  useEffect(() => {
    if (!peliculaId) {
      navigate('/')
      return
    }

    fetch(`${URL_BASE}/api/peliculas/${peliculaId}`)
      .then((response) => {
        if (!response.ok) {
          setError('No se pudo cargar la película.')
          setCargando(false)
          return
        }
        return response.json().then((data) => {
          setPelicula(data)
          setCargando(false)
        })
      })
      .catch((err) => {
        console.error('Error al cargar película', err)
        setError('Error de conexión.')
        setCargando(false)
      })
  }, [peliculaId])

  function handleAgregarAlCarrito() {
    if (!token) { navigate('/login'); return }

    fetch(`${URL_BASE}/api/carrito/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ peliculaId: pelicula.id, cantidad }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { setMensajeCarrito({ tipo: 'error', texto: 'No tenés permiso.' }); return }
          return response.json().then((data) => {
            setMensajeCarrito({ tipo: 'error', texto: data.message })
          })
        }
        setMensajeCarrito({ tipo: 'exito', texto: '¡Película agregada al carrito!' })
        setTimeout(() => setMensajeCarrito(null), 3000)
      })
      .catch((err) => {
        console.error('Error al agregar al carrito', err)
        setMensajeCarrito({ tipo: 'error', texto: 'Error de conexión.' })
      })
  }

  if (cargando) return <p className="estado-mensaje">Cargando película...</p>
  if (error) return <p className="estado-error">{error}</p>
  if (!pelicula) return null

  const tieneDescuento = pelicula.descuentoPorcentaje > 0
  const precioFinal = pelicula.precio - pelicula.precio * pelicula.descuentoPorcentaje / 100
  const fotos = pelicula.fotos && pelicula.fotos.length > 0 ? pelicula.fotos : null

  return (
    <section className="detalle-contenedor">
      <button onClick={() => navigate(-1)} className="detalle-volver">
        ← Volver
      </button>

      <div className="detalle-cuerpo">
        {/* Galería de fotos */}
        <div className="detalle-galeria">
          <div className="detalle-foto-principal">
            {fotos ? (
              <img
                src={fotos[fotoActiva].url}
                alt={pelicula.titulo}
                className="detalle-img"
              />
            ) : (
              <div className="detalle-sin-foto">🎬</div>
            )}
          </div>

          {fotos && fotos.length > 1 && (
            <div className="detalle-miniaturas">
              {fotos.map((foto, indice) => (
                <button
                  key={foto.id}
                  onClick={() => setFotoActiva(indice)}
                  className={indice === fotoActiva ? 'miniatura miniatura-activa' : 'miniatura'}
                >
                  <img src={foto.url} alt={`Foto ${indice + 1}`} className="miniatura-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detalle-info">
          <p className="detalle-categoria">
            {pelicula.categoria && pelicula.categoria.descripcion}
          </p>

          <h1 className="detalle-titulo">{pelicula.titulo}</h1>

          <p className="detalle-vendedor">
            Vendido por {pelicula.vendedor && pelicula.vendedor.username}
          </p>

          <div className="detalle-precios">
            {tieneDescuento ? (
              <>
                <span className="detalle-precio-original">${pelicula.precio}</span>
                <span className="detalle-precio-final">${precioFinal}</span>
                <span className="detalle-badge">-{pelicula.descuentoPorcentaje}%</span>
              </>
            ) : (
              <span className="detalle-precio-final">${pelicula.precio}</span>
            )}
          </div>

          <p className="detalle-stock">
            {pelicula.stock > 0 ? `${pelicula.stock} unidades disponibles` : 'Sin stock'}
          </p>

          <p className="detalle-descripcion">{pelicula.descripcion}</p>

          {mensajeCarrito && (
            <div className={mensajeCarrito.tipo === 'exito' ? 'detalle-alerta-exito' : 'detalle-alerta-error'}>
              {mensajeCarrito.texto}
            </div>
          )}

          {usuario && usuario.role === 'COMPRADOR' && pelicula.stock > 0 && (
            <div className="detalle-accion">
              <input
                type="number"
                min="1"
                max={pelicula.stock}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="detalle-input-cantidad"
              />
              <button onClick={handleAgregarAlCarrito} className="detalle-btn-carrito">
                Agregar al carrito
              </button>
            </div>
          )}

          {!usuario && pelicula.stock > 0 && (
            <button onClick={() => navigate('/login')} className="detalle-btn-carrito">
              Iniciá sesión para comprar
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default DetallePelicula
