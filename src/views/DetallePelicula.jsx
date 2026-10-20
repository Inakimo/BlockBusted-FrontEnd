import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const URL_BASE = 'http://localhost:4002'

function DetallePelicula({ token, usuario, onCarritoActualizado }) {
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
        if (onCarritoActualizado) onCarritoActualizado()
      })
      .catch((err) => {
        console.error('Error al agregar al carrito', err)
        setMensajeCarrito({ tipo: 'error', texto: 'Error de conexión.' })
      })
  }

  if (cargando) {
    return (
      <div className="w-full max-w-5xl mx-auto px-margin-sm py-space-md">
        <p className="font-headline-md text-headline-md text-cream text-center">Cargando película...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-margin-sm py-space-md">
        <p className="font-headline-md text-headline-md text-secondary-container text-center">{error}</p>
      </div>
    )
  }
  if (!pelicula) return null

  const tieneDescuento = pelicula.descuentoPorcentaje > 0
  const precioFinal = parseInt(pelicula.precio - pelicula.precio * pelicula.descuentoPorcentaje / 100)
  const fotos = pelicula.fotos && pelicula.fotos.length > 0 ? pelicula.fotos : null

  function disminuir() {
    if (cantidad > 1) setCantidad(cantidad - 1)
  }
  function aumentar() {
    if (cantidad < pelicula.stock) setCantidad(cantidad + 1)
  }

  return (
    <div className="w-full py-space-md" style={{ backgroundColor: '#0F0E17' }}>
      <div className="max-w-5xl mx-auto px-margin-sm flex flex-col gap-space-sm">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-space-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-space-xs font-label-md text-cream hover:text-primary-container transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary-container">arrow_back</span>
            <span>Volver</span>
          </button>
          <span
            className="bg-primary-container text-ink-black font-label-sm px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase tracking-wider"
            style={{ border: '2px solid #000000' }}
          >
            REF #BB-{pelicula.id}
          </span>
        </div>

        {/* Two-column compact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-start">

          {/* Left: poster */}
          <div className="md:col-span-5 flex flex-col gap-space-xs">
            <div
              className="bg-card-surface shadow-[6px_6px_0px_#000000] p-space-sm relative"
              style={{ border: '4px solid #000000', borderRadius: '10px' }}
            >
              <div
                className="relative w-full bg-ink-black overflow-hidden"
                style={{ border: '3px solid #000000', borderRadius: '4px', aspectRatio: '3/4' }}
              >
                {fotos ? (
                  <img src={fotos[fotoActiva].url} alt={pelicula.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-[80px]">movie</span>
                  </div>
                )}
                {tieneDescuento && (
                  <div
                    className="absolute top-2 right-2 bg-secondary-container text-cream font-label-md px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase"
                    style={{ border: '2px solid #000000', transform: 'rotate(4deg)' }}
                  >
                    -{pelicula.descuentoPorcentaje}%
                  </div>
                )}
              </div>

              {/* Thumbnails inline */}
              {fotos && fotos.length > 1 && (
                <div className="mt-space-xs grid grid-cols-4 gap-space-xs">
                  {fotos.map((foto, indice) => (
                    <button
                      key={foto.id}
                      type="button"
                      onClick={() => setFotoActiva(indice)}
                      className={`overflow-hidden shadow-[1px_1px_0_#000] aspect-square cursor-pointer ${indice === fotoActiva ? 'ring-2 ring-primary-container' : ''}`}
                      style={{ border: '2px solid #000000', borderRadius: '3px' }}
                    >
                      <img src={foto.url} alt={`Foto ${indice + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div
            className="md:col-span-7 bg-card-surface shadow-[6px_6px_0px_#000000] p-space-md flex flex-col gap-space-sm text-ink-black"
            style={{ border: '4px solid #000000', borderRadius: '10px' }}
          >
            {/* Category + vendor */}
            <div className="flex flex-wrap items-center gap-space-xs">
              <span
                className="text-cream font-label-sm px-space-sm py-0.5 shadow-[2px_2px_0px_#000000] uppercase tracking-wider font-extrabold"
                style={{ backgroundColor: '#1E88E5', border: '2px solid #000000' }}
              >
                {pelicula.categoria && pelicula.categoria.descripcion}
              </span>
              <span className="font-label-sm text-muted-gray uppercase tracking-wider">
                Vendedor: {pelicula.vendedor && pelicula.vendedor.username}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-headline-lg text-headline-lg leading-[1.05] text-ink-black uppercase drop-shadow-[2px_2px_0_#ffd700]">
              {pelicula.titulo}
            </h1>

            {/* Description */}
            <p className="font-body-sm text-ink-black leading-snug">
              {pelicula.descripcion}
            </p>

            {/* Price + stock */}
            <div className="pt-space-xs flex flex-wrap items-center justify-between gap-space-sm" style={{ borderTop: '2px solid #000000' }}>
              <div>
                {tieneDescuento && (
                  <span className="font-label-sm text-muted-gray line-through block text-body-sm">Precio: ${pelicula.precio}</span>
                )}
                <span className="font-headline-md text-headline-md text-secondary-container leading-none font-extrabold drop-shadow-[1px_1px_0_#000]">
                  ${tieneDescuento ? precioFinal : pelicula.precio}
                </span>
              </div>

              {pelicula.stock > 0 ? (
                <span
                  className="bg-primary-container text-ink-black font-label-md px-space-sm py-1 shadow-[2px_2px_0_#000000] uppercase tracking-wider"
                  style={{ border: '2px solid #000000' }}
                >
                  Stock: {pelicula.stock}
                </span>
              ) : (
                <span
                  className="bg-secondary-container text-cream font-label-md px-space-sm py-1 shadow-[2px_2px_0_#000000] uppercase tracking-wider"
                  style={{ border: '2px solid #000000' }}
                >
                  Sin stock
                </span>
              )}
            </div>

            {/* Alert */}
            {mensajeCarrito && (
              <div
                className={`p-space-xs px-space-sm shadow-[2px_2px_0px_#000000] font-label-sm uppercase ${mensajeCarrito.tipo === 'exito' ? 'bg-primary-container text-ink-black' : 'bg-secondary-container text-cream'}`}
                style={{ border: '2px solid #000000', borderRadius: '4px' }}
              >
                {mensajeCarrito.texto}
              </div>
            )}

            {/* Purchase controls */}
            {usuario && usuario.role === 'COMPRADOR' && pelicula.stock > 0 && (
              <div className="flex items-center gap-space-sm">
                <div
                  className="flex items-center bg-cream shadow-[2px_2px_0_#000000]"
                  style={{ border: '2px solid #000000', borderRadius: '999px' }}
                >
                  <button
                    type="button"
                    aria-label="Disminuir"
                    onClick={disminuir}
                    className="w-8 h-8 flex items-center justify-center font-headline-sm text-ink-black hover:bg-primary-container transition-colors cursor-pointer bg-transparent"
                    style={{ borderRight: '2px solid #000000' }}
                  >
                    -
                  </button>
                  <span className="font-headline-sm text-ink-black px-space-sm min-w-[32px] text-center">{cantidad}</span>
                  <button
                    type="button"
                    aria-label="Aumentar"
                    onClick={aumentar}
                    className="w-8 h-8 flex items-center justify-center font-headline-sm text-ink-black hover:bg-primary-container transition-colors cursor-pointer bg-transparent"
                    style={{ borderLeft: '2px solid #000000' }}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAgregarAlCarrito}
                  className="flex-1 bg-primary-container text-ink-black font-headline-sm px-space-md py-2 shadow-[3px_3px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] transition-all uppercase flex items-center justify-center gap-space-xs cursor-pointer"
                  style={{ border: '3px solid #000000', borderRadius: '999px' }}
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  <span>Agregar al carrito</span>
                </button>
              </div>
            )}

            {!usuario && pelicula.stock > 0 && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-secondary-container text-cream font-label-md tracking-wider py-space-xs shadow-[3px_3px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] transition-all uppercase flex items-center justify-center gap-space-xs cursor-pointer"
                style={{ border: '3px solid #000000', borderRadius: '999px' }}
              >
                <span className="material-symbols-outlined">bolt</span>
                <span>Iniciá sesión para comprar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetallePelicula
