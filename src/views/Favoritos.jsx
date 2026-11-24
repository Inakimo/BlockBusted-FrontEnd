import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PageLoading from '../components/PageLoading.jsx'
import PageError from '../components/PageError.jsx'

const URL_BASE = 'http://localhost:4002'

function Favoritos() {
  const token = useSelector((s) => s.auth.token)
  const [favoritos, setFavoritos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  function cargarFavoritos() {
    setCargando(true)
    setError(null)
    fetch(`${URL_BASE}/api/favoritos`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) { setError('No se pudieron cargar los favoritos.'); setCargando(false); return }
        return res.json().then((data) => { setFavoritos(data); setCargando(false) })
      })
      .catch(() => { setError('Error de conexión.'); setCargando(false) })
  }

  useEffect(() => { cargarFavoritos() }, [])

  function handleQuitar(peliculaId) {
    fetch(`${URL_BASE}/api/favoritos/${peliculaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => { if (res.ok) cargarFavoritos() })
      .catch(() => {})
  }

  if (cargando) return <PageLoading texto="Cargando favoritos..." />
  if (error) return <PageError texto={error} />

  return (
    <div className="flex flex-col w-full">
      <div className="w-full bg-secondary-container py-1 px-4 mt-space-md overflow-hidden flex items-center justify-between text-cream font-label-sm text-label-sm uppercase tracking-widest" style={{ borderBottom: '2px solid #000000' }}>
        <div className="flex items-center gap-space-md">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            LISTA DE DESEOS BLOCKBUSTED
          </span>
          <span className="hidden md:inline">• TUS CINTAS FAVORITAS •</span>
        </div>
        <div className="flex items-center gap-space-xs font-label-sm text-primary-container">
          <span className="material-symbols-outlined text-[16px]">bookmark</span>
          {favoritos.length} GUARDADAS
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-margin-sm lg:px-margin py-space-xl">
        <header className="mb-space-xl">
          <div className="inline-flex items-center gap-space-xs bg-primary-container text-ink-black font-label-sm text-label-sm px-space-sm py-0.5 shadow-[3px_3px_0_#000000] uppercase mb-space-xs transform -rotate-1" style={{ border: '2px solid #000000' }}>
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            Tu Wishlist VHS
          </div>
          <h1 className="font-headline-lg text-display-lg text-cream tracking-wider uppercase drop-shadow-[4px_4px_0_#000000]">
            MIS FAVORITOS
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
            Cintas que marcaste para no perder de vista. Agregá desde el detalle de película.
          </p>
          <div className="mt-space-lg h-3 w-full bg-ink-black flex gap-2 overflow-hidden px-1 items-center opacity-80" style={{ borderTop: '2px solid #35333e', borderBottom: '2px solid #35333e' }}>
            {Array.from({ length: 22 }).map((_, i) => <div key={i} className="w-2 h-1 bg-cream flex-shrink-0"></div>)}
          </div>
        </header>

        {favoritos.length === 0 ? (
          <div className="bg-card-surface text-ink-black p-space-xl text-center shadow-[6px_6px_0px_#000000]" style={{ border: '3px solid #000000', borderRadius: '10px' }}>
            <span className="material-symbols-outlined text-[48px] text-muted-gray">heart_broken</span>
            <p className="font-headline-md text-headline-md uppercase mt-space-sm">Todavía no guardaste ninguna cinta.</p>
            <button
              onClick={() => navigate('/catalogo')}
              className="mt-space-md bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-space-sm shadow-[3px_3px_0_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#000000] transition-all uppercase tracking-wider cursor-pointer border-none"
              style={{ border: '2px solid #000000' }}
            >
              Ir al catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
            {favoritos.map((fav) => {
              const peli = fav.pelicula
              if (!peli) return null
              const foto = peli.fotos && peli.fotos.length > 0 ? peli.fotos[0].url : null
              const precioFinal = peli.descuentoPorcentaje > 0
                ? parseInt(peli.precio - peli.precio * peli.descuentoPorcentaje / 100)
                : peli.precio

              return (
                <article
                  key={fav.id}
                  className="bg-card-surface text-ink-black shadow-[4px_4px_0px_#000000] flex flex-col overflow-hidden relative group"
                  style={{ border: '3px solid #000000', borderRadius: '8px' }}
                >
                  {peli.descuentoPorcentaje > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-secondary-container text-cream font-label-sm text-[10px] px-2 py-0.5 shadow-[1px_1px_0_#000000] uppercase" style={{ border: '1px solid #000000' }}>
                      {peli.descuentoPorcentaje}% OFF
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleQuitar(peli.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-secondary-container text-cream flex items-center justify-center shadow-[1px_1px_0_#000000] hover:bg-cream hover:text-secondary-container transition-colors cursor-pointer border-none"
                    style={{ border: '1px solid #000000', borderRadius: '4px' }}
                    title="Quitar de favoritos"
                  >
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </button>

                  <div
                    className="h-44 bg-ink-black flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/pelicula?id=${peli.id}`)}
                  >
                    {foto ? (
                      <img src={foto} alt={peli.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="material-symbols-outlined text-primary-container text-5xl">movie</span>
                    )}
                  </div>

                  <div className="p-space-md flex flex-col gap-space-xs flex-1">
                    {peli.categoria && (
                      <span className="text-[10px] bg-ink-black text-primary-container font-label-sm px-1.5 py-0.5 uppercase tracking-wide self-start" style={{ border: '1px solid #000000' }}>
                        {peli.categoria.descripcion}
                      </span>
                    )}
                    <h2
                      className="font-headline-sm text-headline-sm text-ink-black leading-tight uppercase cursor-pointer hover:text-secondary-container transition-colors"
                      onClick={() => navigate(`/pelicula?id=${peli.id}`)}
                    >
                      {peli.titulo}
                    </h2>
                    <div className="flex items-baseline gap-space-xs mt-auto pt-space-xs">
                      <span className="font-headline-md text-headline-md text-secondary-container leading-none">${precioFinal}</span>
                      {peli.descuentoPorcentaje > 0 && (
                        <span className="font-body-sm text-body-sm text-muted-gray line-through text-xs">${peli.precio}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/pelicula?id=${peli.id}`)}
                      className="mt-space-xs w-full bg-ink-black text-primary-container font-label-sm text-label-sm py-1.5 uppercase tracking-wider hover:bg-secondary-container transition-colors cursor-pointer border-none shadow-[2px_2px_0_#000000]"
                      style={{ border: '2px solid #000000' }}
                    >
                      Ver detalles
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favoritos
