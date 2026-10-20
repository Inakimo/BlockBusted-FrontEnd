import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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

  if (cargando) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-sm lg:px-margin py-space-xl">
        <p className="font-headline-md text-headline-md text-cream text-center">Cargando película...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-sm lg:px-margin py-space-xl">
        <p className="font-headline-md text-headline-md text-secondary-container text-center">{error}</p>
      </div>
    )
  }
  if (!pelicula) return null

  const tieneDescuento = pelicula.descuentoPorcentaje > 0
  const precioFinal = pelicula.precio - pelicula.precio * pelicula.descuentoPorcentaje / 100
  const fotos = pelicula.fotos && pelicula.fotos.length > 0 ? pelicula.fotos : null

  function disminuir() {
    if (cantidad > 1) setCantidad(cantidad - 1)
  }
  function aumentar() {
    if (cantidad < pelicula.stock) setCantidad(cantidad + 1)
  }

  return (
    <div className="w-full py-space-md lg:py-space-xl" style={{ backgroundColor: '#0F0E17' }}>
      <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin flex flex-col gap-space-lg">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-space-xs font-label-md text-cream hover:text-primary-container transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary-container">arrow_back</span>
            <span>Volver al Catálogo</span>
          </button>
          <div className="flex items-center gap-space-xs">
            <span
              className="bg-secondary-container text-cream font-label-sm px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase tracking-wider"
              style={{ border: '2px solid #000000' }}
            >
              {pelicula.stock > 0 ? 'STOCK LIMITADO VHS' : 'SIN STOCK'}
            </span>
            <span
              className="bg-primary-container text-ink-black font-label-sm px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase tracking-wider hidden sm:inline-block"
              style={{ border: '2px solid #000000' }}
            >
              REF #BB-{pelicula.id}
            </span>
          </div>
        </div>

        {/* Two-column panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left column: poster + stills */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div
              className="bg-card-surface shadow-[6px_6px_0px_#000000] p-space-md flex flex-col relative overflow-hidden"
              style={{ border: '4px solid #000000', borderRadius: '12px' }}
            >
              <div
                className="absolute top-4 left-4 z-10 bg-secondary-container text-cream font-label-sm px-space-sm py-1 shadow-[3px_3px_0px_#000000] uppercase tracking-wide"
                style={{ border: '2px solid #000000', transform: 'rotate(-2deg)' }}
              >
                EDICIÓN COLECCIONISTA VHS + DIGITAL
              </div>
              <div
                className="absolute top-4 right-4 z-10 bg-primary-container text-ink-black font-label-sm px-2 py-1 shadow-[3px_3px_0px_#000000] font-extrabold uppercase"
                style={{ border: '2px solid #000000', transform: 'rotate(3deg)' }}
              >
                HI-FI CINTA NEGRA
              </div>

              <div
                className="relative w-full aspect-[2/3] bg-ink-black overflow-hidden mt-8"
                style={{ border: '3px solid #000000', borderRadius: '4px' }}
              >
                {fotos ? (
                  <img src={fotos[fotoActiva].url} alt={pelicula.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-[120px]">movie</span>
                  </div>
                )}
                <div
                  className="absolute bottom-3 right-3 bg-primary-container text-ink-black p-1 shadow-[2px_2px_0_#000]"
                  style={{ border: '2px solid #000000', transform: 'rotate(-6deg)' }}
                >
                  <span className="font-headline-sm text-headline-sm leading-none block">CINTA 100% REBOBINADA</span>
                </div>
              </div>

              <div className="mt-space-md flex items-center justify-between pt-space-sm" style={{ borderTop: '2px solid #000000' }}>
                <div className="flex items-center gap-1 text-primary-container drop-shadow-[1px_1px_0_#000]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-md text-ink-black ml-1">4.9/5</span>
                </div>
                <span className="font-label-sm text-muted-gray uppercase">(142 socios opinan)</span>
              </div>
            </div>

            {/* Thumbnails */}
            {fotos && fotos.length > 1 && (
              <div
                className="bg-card-surface shadow-[6px_6px_0px_#000000] p-space-sm flex flex-col gap-space-xs"
                style={{ border: '4px solid #000000', borderRadius: '12px' }}
              >
                <span className="font-label-sm text-ink-black uppercase tracking-wider px-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary-container text-base">movie</span>
                  Fotogramas de la Cinta (Haz clic para ampliar)
                </span>
                <div className="grid grid-cols-3 gap-space-sm">
                  {fotos.map((foto, indice) => (
                    <button
                      key={foto.id}
                      type="button"
                      onClick={() => setFotoActiva(indice)}
                      className={`overflow-hidden shadow-[2px_2px_0_#000] aspect-video hover:opacity-90 transition-all cursor-pointer ${indice === fotoActiva ? 'ring-4 ring-primary-container' : ''}`}
                      style={{ border: '2px solid #000000', borderRadius: '4px' }}
                    >
                      <img src={foto.url} alt={`Foto ${indice + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Audio specs */}
            <div
              className="bg-surface-container-high shadow-[4px_4px_0_#000000] p-space-md text-on-surface flex items-center justify-between"
              style={{ border: '3px solid #000000', borderRadius: '12px' }}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary-container text-3xl">videocam</span>
                <div>
                  <p className="font-label-md text-cream uppercase">Caja Negra Clásica</p>
                  <p className="font-body-sm text-on-surface-variant">Incluye pegatina "Por Favor Rebobine"</p>
                </div>
              </div>
              <span className="bg-ink-black text-primary-container font-headline-sm px-space-sm py-1 rounded" style={{ border: '1px solid rgba(255,215,0,0.4)' }}>
                NTSC / SP
              </span>
            </div>
          </div>

          {/* Right column */}
          <div
            className="lg:col-span-7 bg-card-surface shadow-[6px_6px_0px_#000000] p-space-md lg:p-space-xl flex flex-col gap-space-md text-ink-black"
            style={{ border: '4px solid #000000', borderRadius: '12px' }}
          >
            {/* Genre + barcode */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm" style={{ borderBottom: '2px solid #000000' }}>
              <div className="flex items-center gap-space-xs">
                <span
                  className="text-cream font-label-sm px-space-md py-1 shadow-[2px_2px_0px_#000000] uppercase tracking-wider font-extrabold"
                  style={{ backgroundColor: '#1E88E5', border: '2px solid #000000' }}
                >
                  {pelicula.categoria && pelicula.categoria.descripcion}
                </span>
                <span
                  className="bg-primary-container text-ink-black font-label-sm px-space-sm py-1 shadow-[2px_2px_0px_#000000] uppercase"
                  style={{ border: '2px solid #000000' }}
                >
                  PARODIA DE CULTO
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs font-bold tracking-widest text-muted-gray">
                <span>||||| ||| |||| ||</span>
                <span className="text-ink-black">COD: BB-{pelicula.id}</span>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col">
              <h1 className="font-headline-lg text-[42px] lg:text-[50px] leading-[1] text-ink-black tracking-wide uppercase drop-shadow-[2px_2px_0_#ffd700]">
                {pelicula.titulo}
              </h1>
              <div className="h-1.5 w-32 bg-secondary-container mt-2"></div>
            </div>

            {/* Specs line */}
            <div
              className="bg-cream p-space-xs px-space-sm shadow-[2px_2px_0_#000000] flex flex-wrap items-center gap-x-space-md gap-y-1 font-label-md text-body-sm text-ink-black"
              style={{ border: '2px solid #000000' }}
            >
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">calendar_month</span> Año 1984</span>
              <span>•</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">timer</span> 98 Min</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">person</span>
                Vendedor: {pelicula.vendedor && pelicula.vendedor.username}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">tv</span> Formato VHS / 1080p</span>
            </div>

            {/* Description */}
            <div className="space-y-space-xs">
              <p className="font-body-md text-ink-black leading-relaxed">
                {pelicula.descripcion}
              </p>
            </div>

            {/* Speech bubble review */}
            <div
              className="relative bg-primary text-ink-black p-space-md shadow-[4px_4px_0px_#000000] mt-space-xs"
              style={{ border: '3px solid #000000', borderRadius: '4px' }}
            >
              <div
                className="absolute -top-3 left-6 bg-secondary-container text-cream px-2 py-0.5 font-label-sm uppercase"
                style={{ border: '2px solid #000000' }}
              >
                Crítica Destacada
              </div>
              <p className="font-body-lg text-ink-black italic font-bold">
                «Más divertida que la original y con efectos un 80% más cutres.»
              </p>
              <p className="font-label-md text-right text-muted-gray mt-1 uppercase tracking-wider">
                — El Diario Pulp (Sección Videoclub Clandestino)
              </p>
            </div>

            {/* Bonus box */}
            <div
              className="bg-surface text-cream p-space-sm shadow-[3px_3px_0px_#000000] flex items-center justify-between gap-space-sm mt-space-xs"
              style={{ border: '3px solid #000000', borderRadius: '4px' }}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary-container text-2xl">featured_play_list</span>
                <div>
                  <span className="font-label-md text-primary-container block uppercase tracking-wide">Contenido Extra Especial:</span>
                  <span className="font-body-sm text-on-surface">Bloopers &amp; Escenas eliminadas incluidas al final del rebobinado.</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary-fixed">auto_awesome</span>
            </div>

            {/* Price + stock */}
            <div className="pt-space-md flex flex-wrap items-center justify-between gap-space-md" style={{ borderTop: '2px solid #000000' }}>
              <div>
                {tieneDescuento && (
                  <span className="font-label-sm text-muted-gray line-through block text-body-sm">Precio Oficial: ${pelicula.precio}</span>
                )}
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-md text-[38px] text-secondary-container leading-none font-extrabold drop-shadow-[1px_1px_0_#000]">
                    ${tieneDescuento ? precioFinal : pelicula.precio}
                  </span>
                  {tieneDescuento && (
                    <span
                      className="font-label-sm bg-secondary text-on-secondary-fixed-variant px-1.5 py-0.5 rounded uppercase font-bold"
                      style={{ border: '1px solid #000000' }}
                    >
                      -{pelicula.descuentoPorcentaje}% REBAJA
                    </span>
                  )}
                </div>
              </div>

              {pelicula.stock > 0 ? (
                <div
                  className="flex items-center gap-space-xs bg-primary-container text-ink-black px-space-md py-1.5 shadow-[3px_3px_0_#000000] animate-pulse"
                  style={{ border: '2px solid #000000' }}
                >
                  <span className="material-symbols-outlined text-error-container">warning</span>
                  <span className="font-label-md uppercase tracking-wider font-extrabold">¡Solo quedan {pelicula.stock} en stock!</span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-space-xs bg-error-container text-cream px-space-md py-1.5 shadow-[3px_3px_0_#000000]"
                  style={{ border: '2px solid #000000' }}
                >
                  <span className="material-symbols-outlined">block</span>
                  <span className="font-label-md uppercase tracking-wider font-extrabold">SIN STOCK</span>
                </div>
              )}
            </div>

            {/* Alert */}
            {mensajeCarrito && (
              <div
                className={`p-space-sm shadow-[3px_3px_0px_#000000] font-label-md uppercase ${mensajeCarrito.tipo === 'exito' ? 'bg-primary-container text-ink-black' : 'bg-secondary-container text-cream'}`}
                style={{ border: '3px solid #000000', borderRadius: '4px' }}
              >
                {mensajeCarrito.texto}
              </div>
            )}

            {/* Purchase controls */}
            {usuario && usuario.role === 'COMPRADOR' && pelicula.stock > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm pt-space-xs">
                <div
                  className="flex items-center justify-between bg-cream shadow-[3px_3px_0_#000000] px-space-sm py-1 min-w-[130px]"
                  style={{ border: '3px solid #000000', borderRadius: '999px' }}
                >
                  <button
                    type="button"
                    aria-label="Disminuir"
                    onClick={disminuir}
                    className="w-8 h-8 flex items-center justify-center font-headline-sm text-ink-black hover:bg-primary-container rounded transition-colors cursor-pointer"
                    style={{ border: '1px solid #000000' }}
                  >
                    -
                  </button>
                  <span className="font-headline-sm text-headline-sm text-ink-black px-space-sm">{cantidad}</span>
                  <button
                    type="button"
                    aria-label="Aumentar"
                    onClick={aumentar}
                    className="w-8 h-8 flex items-center justify-center font-headline-sm text-ink-black hover:bg-primary-container rounded transition-colors cursor-pointer"
                    style={{ border: '1px solid #000000' }}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAgregarAlCarrito}
                  className="flex-1 bg-primary-container text-ink-black font-headline-sm text-headline-sm tracking-wider px-space-lg py-2.5 shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000] transition-all uppercase flex items-center justify-center gap-space-xs cursor-pointer"
                  style={{ border: '3px solid #000000', borderRadius: '999px' }}
                >
                  <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                  <span>¡Agregar al Carrito!</span>
                </button>
              </div>
            )}

            {!usuario && pelicula.stock > 0 && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-secondary-container text-cream font-label-md text-label-md tracking-wider py-space-sm shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] transition-all uppercase flex items-center justify-center gap-space-xs cursor-pointer"
                style={{ border: '3px solid #000000', borderRadius: '999px' }}
              >
                <span className="material-symbols-outlined">bolt</span>
                <span>Iniciá sesión para comprar</span>
              </button>
            )}

            {/* Guarantee footer */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-space-md text-muted-gray text-body-sm pt-space-xs" style={{ borderTop: '1px solid #35333e' }}>
              <span className="flex items-center gap-1 font-label-sm uppercase">
                <span className="material-symbols-outlined text-base text-ink-black">local_shipping</span> Envío en estuche acorazado
              </span>
              <span className="flex items-center gap-1 font-label-sm uppercase">
                <span className="material-symbols-outlined text-base text-ink-black">replay</span> 30 Días de Garantía
              </span>
              <span className="flex items-center gap-1 font-label-sm uppercase">
                <span className="material-symbols-outlined text-base text-ink-black">security</span> Pago 100% Protegido
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetallePelicula
