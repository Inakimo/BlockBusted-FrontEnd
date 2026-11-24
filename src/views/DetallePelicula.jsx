import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from '../utils/toast.js'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCantidadCarrito } from '../store/carritoSlice'
import PageLoading from '../components/PageLoading.jsx'
import PageError from '../components/PageError.jsx'
import GaleriaFotos from '../components/GaleriaFotos.jsx'
import SeccionResenas from '../components/SeccionResenas.jsx'

const URL_BASE = 'http://localhost:4002'

function DetallePelicula() {
  const dispatch = useDispatch()
  const { token, usuario } = useSelector((s) => s.auth)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const peliculaId = (location.state && location.state.peliculaId) || searchParams.get('id')

  const [pelicula, setPelicula] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [mensajeCarrito, setMensajeCarrito] = useState(null)
  const [esFavorito, setEsFavorito] = useState(false)
  const [toggleandoFav, setToggleandoFav] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)

  useEffect(() => {
    if (peliculaId && token && usuario && usuario.role === 'COMPRADOR') {
      fetch(`${URL_BASE}/api/favoritos/${peliculaId}/check`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then((res) => { if (res.ok) return res.json().then((d) => setEsFavorito(d.esFavorito)) })
        .catch(() => {})
    }
  }, [peliculaId, token, usuario])

  function handleToggleFavorito() {
    if (!token || !usuario || usuario.role !== 'COMPRADOR') { navigate('/login'); return }
    setToggleandoFav(true)
    const method = esFavorito ? 'DELETE' : 'POST'
    fetch(`${URL_BASE}/api/favoritos/${pelicula.id}`, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        setToggleandoFav(false)
        if (res.ok) setEsFavorito(!esFavorito)
      })
      .catch(() => setToggleandoFav(false))
  }

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

  function handleEliminar() {
    fetch(`${URL_BASE}/api/peliculas/${pelicula.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => toast(d.message || 'No se pudo eliminar.'))
        toast('Película eliminada.')
        navigate('/catalogo')
      })
      .catch(() => toast('Error de conexión.'))
  }

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
        dispatch(fetchCantidadCarrito())
      })
      .catch((err) => {
        console.error('Error al agregar al carrito', err)
        setMensajeCarrito({ tipo: 'error', texto: 'Error de conexión.' })
      })
  }

  if (cargando) return <PageLoading texto="Cargando película..." />
  if (error) return <PageError texto={error} />
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-start" id="detalle-top">

          {/* Left: poster */}
          <div className="md:col-span-5 flex flex-col gap-space-xs">
            <GaleriaFotos
              fotos={fotos}
              titulo={pelicula.titulo}
              tieneDescuento={tieneDescuento}
              descuentoPorcentaje={pelicula.descuentoPorcentaje}
            />
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
                {usuario && usuario.role === 'COMPRADOR' && (
                  <button
                    type="button"
                    disabled={toggleandoFav}
                    onClick={handleToggleFavorito}
                    className="w-10 h-10 flex items-center justify-center shadow-[3px_3px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] transition-all cursor-pointer border-none disabled:opacity-50 flex-shrink-0"
                    style={{
                      backgroundColor: esFavorito ? '#E53935' : '#fff8e7',
                      color: esFavorito ? '#fff' : '#E53935',
                      border: '3px solid #000000',
                      borderRadius: '999px'
                    }}
                    title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: esFavorito ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                )}
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

            {usuario?.role === 'ADMIN' && (
              <div className="pt-space-xs" style={{ borderTop: '2px dashed #000' }}>
                {confirmarEliminar ? (
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-ink-black uppercase font-bold flex-1">¿Eliminar esta película?</span>
                    <button
                      type="button"
                      onClick={handleEliminar}
                      className="bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-[6px] border-[2px] border-ink-black shadow-[2px_2px_0px_#000000] uppercase font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>Sí, eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmarEliminar(false)}
                      className="bg-cream text-ink-black font-label-sm text-label-sm px-space-sm py-[6px] border-[2px] border-ink-black shadow-[2px_2px_0px_#000000] uppercase font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmarEliminar(true)}
                    className="w-full bg-secondary-container text-cream font-label-sm text-label-sm px-space-md py-[6px] border-[2px] border-ink-black shadow-[2px_2px_0px_#000000] uppercase font-bold inline-flex items-center justify-center gap-1 cursor-pointer hover:shadow-[3px_3px_0px_#000000] transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                    Eliminar película
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Reseñas */}
        <SeccionResenas peliculaId={peliculaId} usuario={usuario} token={token} />
      </div>
    </div>
  )
}

export default DetallePelicula
