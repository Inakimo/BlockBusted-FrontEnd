import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from '../utils/toast.js'
import PageLoading from '../components/PageLoading.jsx'
import PageError from '../components/PageError.jsx'
import NuevaPeliculaForm from '../components/NuevaPeliculaForm.jsx'
import PanelEditar from '../components/PanelEditar.jsx'
import PanelStock from '../components/PanelStock.jsx'
import PanelDescuento from '../components/PanelDescuento.jsx'
import PanelFotos from '../components/PanelFotos.jsx'

const URL_BASE = 'http://localhost:4002'

function MisPeliculas() {
  const { token, usuario } = useSelector((s) => s.auth)
  const [peliculas, setPeliculas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [panelAbierto, setPanelAbierto] = useState(null)

  function cargarPeliculas() {
    if (peliculas.length === 0) setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/peliculas`)
      .then((res) => res.json())
      .then((data) => {
        setPeliculas(data.content.filter((p) => p.vendedor && p.vendedor.id === usuario.id))
        setCargando(false)
      })
      .catch(() => { setError('No se pudieron cargar las películas.'); setCargando(false) })
  }

  useEffect(() => {
    fetch(`${URL_BASE}/api/categorias`)
      .then((res) => res.json())
      .then((data) => setCategorias(data.content))
      .catch(() => {})
    cargarPeliculas()
  }, [])

  function abrirPanel(peliculaId, tipo) {
    if (panelAbierto && panelAbierto.id === peliculaId && panelAbierto.tipo === tipo) {
      setPanelAbierto(null)
      return
    }
    setPanelAbierto({ id: peliculaId, tipo })
  }

  function handleEliminarPelicula(peliculaId) {
    fetch(`${URL_BASE}/api/peliculas/${peliculaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) { toast('No tenés permiso para eliminar esta película.'); return }
          return res.json().then((d) => toast(d.message))
        }
        setPeliculas((prev) => prev.filter((p) => p.id !== peliculaId))
      })
      .catch(() => toast('Error de conexión.'))
  }

  if (cargando && peliculas.length === 0) return <PageLoading texto="Cargando películas..." />
  if (error) return <PageError texto={error} />

  let totalStock = 0
  for (let i = 0; i < peliculas.length; i++) totalStock += peliculas[i].stock

  return (
    <div className="relative w-full pb-space-xl overflow-hidden">
      <div className="absolute -top-10 -right-10 w-96 h-96 opacity-10 pointer-events-none select-none" style={{ backgroundImage: 'radial-gradient(#ffd700 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
      <div className="absolute top-1/3 -left-12 w-80 h-80 opacity-10 pointer-events-none select-none" style={{ backgroundImage: 'radial-gradient(#a90111 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>

      <div className="max-w-7xl mx-auto px-margin-sm md:px-margin pt-space-lg space-y-space-xl">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-md" style={{ borderBottom: '4px solid #000000' }}>
          <div className="space-y-space-xs">
            <div
              className="inline-flex items-center gap-space-xs bg-primary-container text-ink-black px-space-sm py-[3px] shadow-[3px_3px_0px_#000000]"
              style={{ border: '2px solid #000000', transform: 'rotate(-1deg)' }}
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest">PANEL DE VENDEDOR / CATÁLOGO PROPIO</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-cream tracking-wide uppercase drop-shadow-[4px_4px_0px_#000000]">
              MIS PELÍCULAS
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-[20px]">videocam</span>
              Controla tu estantería física, inventario VHS de colección y promociones de alquiler.
            </p>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="bg-surface-container-high shadow-[3px_3px_0px_#000000] px-space-md py-space-xs flex items-center gap-space-sm" style={{ border: '2px solid #000000' }}>
              <span className="font-headline-sm text-headline-sm text-primary-container">{peliculas.length}</span>
              <div className="font-label-sm text-label-sm text-on-surface uppercase leading-none">TÍTULOS<br /><span className="text-on-surface-variant">ACTIVOS</span></div>
            </div>
            <div className="bg-surface-container-high shadow-[3px_3px_0px_#000000] px-space-md py-space-xs flex items-center gap-space-sm" style={{ border: '2px solid #000000' }}>
              <span className="font-headline-sm text-headline-sm text-secondary">{totalStock}</span>
              <div className="font-label-sm text-label-sm text-on-surface uppercase leading-none">CINTAS<br /><span className="text-on-surface-variant">TOTAL STOCK</span></div>
            </div>
          </div>
        </section>

        <NuevaPeliculaForm categorias={categorias} onCreada={(nueva) => setPeliculas((prev) => [...prev, nueva])} />

        {/* Lista */}
        <section className="space-y-space-lg">
          <div className="flex items-center justify-between pb-space-xs" style={{ borderBottom: '2px solid #ffd700' }}>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary-container text-[26px]">video_library</span>
              <h2 className="font-headline-lg text-headline-lg text-cream tracking-wider uppercase">
                CATÁLOGO EN GESTIÓN ({peliculas.length})
              </h2>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest hidden sm:inline-block">
              FORMATO FÍSICO VHS / BETAMAX
            </span>
          </div>

          {peliculas.length === 0 ? (
            <div className="bg-card-surface text-ink-black p-space-xl text-center shadow-[5px_5px_0px_#000000]" style={{ border: '3px solid #000000', borderRadius: '10px' }}>
              <p className="font-headline-md text-headline-md uppercase">Todavía no publicaste ninguna película.</p>
            </div>
          ) : (
            peliculas.map((pelicula) => {
              const esteAbierto = panelAbierto && panelAbierto.id === pelicula.id
              const esTipo = (t) => esteAbierto && panelAbierto.tipo === t
              const tieneDescuento = pelicula.descuentoPorcentaje > 0
              const precioFinal = parseInt(pelicula.precio - pelicula.precio * pelicula.descuentoPorcentaje / 100)

              return (
                <article
                  key={pelicula.id}
                  className="bg-card-surface shadow-[5px_5px_0px_#000000] p-space-md text-ink-black transition-all"
                  style={{ border: '3px solid #000000', borderRadius: '10px' }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                    <div className="flex items-start sm:items-center gap-space-md">
                      {/* Thumbnail */}
                      <div className="w-16 h-20 bg-ink-black shadow-[2px_2px_0px_#000000] overflow-hidden flex-shrink-0 relative" style={{ border: '2px solid #000000' }}>
                        {pelicula.fotos && pelicula.fotos.length > 0 ? (
                          <img src={pelicula.fotos[0].url} alt={pelicula.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary-container text-[28px]">movie</span>
                          </div>
                        )}
                        <span className="absolute top-1 left-1 bg-secondary-container text-cream text-[9px] font-bold px-[3px] leading-tight" style={{ border: '1px solid #000000' }}>VHS</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <h3 className="font-headline-md text-headline-md uppercase tracking-wider text-ink-black">{pelicula.titulo}</h3>
                          {tieneDescuento && (
                            <span className="bg-primary-container text-ink-black font-label-sm text-label-sm px-space-xs py-[1px] shadow-[1px_1px_0px_#000000] uppercase font-black" style={{ border: '2px solid #000000' }}>
                              {pelicula.descuentoPorcentaje}% DTO
                            </span>
                          )}
                          {pelicula.stock === 0 && (
                            <span className="bg-error-container text-cream font-label-sm text-label-sm px-space-xs py-[1px] uppercase font-bold" style={{ border: '1px solid #000000' }}>AGOTADO</span>
                          )}
                        </div>
                        <div className="flex items-center gap-space-xs text-muted-gray font-label-md text-label-md flex-wrap">
                          <span className="font-bold uppercase tracking-wider" style={{ color: '#0061a9' }}>{pelicula.categoria && pelicula.categoria.descripcion}</span>
                          <span>•</span>
                          {tieneDescuento ? (
                            <>
                              <span className="line-through text-muted-gray">${pelicula.precio}</span>
                              <span className="text-secondary-container font-headline-sm text-headline-sm">${precioFinal}</span>
                            </>
                          ) : (
                            <span className="text-secondary-container font-headline-sm text-headline-sm">${pelicula.precio}</span>
                          )}
                          <span>•</span>
                          <span
                            className="text-[12px] font-bold px-space-xs py-[1px] rounded"
                            style={pelicula.stock === 0
                              ? { backgroundColor: '#fee2e2', color: '#93000a', border: '1px solid #93000a' }
                              : { backgroundColor: '#2a2933', color: '#e5e0ee', border: '1px solid #000000' }}
                          >
                            Stock: {pelicula.stock}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-space-xs flex-wrap">
                      {[
                        { tipo: 'editar', icon: 'edit', label: 'Editar', labelAct: 'Editando...' },
                        { tipo: 'stock', icon: 'inventory', label: 'Stock', labelAct: 'Ajustando...' },
                        { tipo: 'descuento', icon: 'percent', label: 'Descuento', labelAct: 'Activo' },
                        { tipo: 'fotos', icon: 'photo_library', label: 'Fotos', labelAct: 'Galería' },
                      ].map(({ tipo, icon, label, labelAct }) => (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => abrirPanel(pelicula.id, tipo)}
                          className={`font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] transition-all flex items-center gap-1 uppercase cursor-pointer ${esTipo(tipo) ? 'bg-primary-container text-ink-black font-bold' : 'text-ink-black hover:bg-cream'}`}
                          style={{ backgroundColor: esTipo(tipo) ? '#ffd700' : '#f9fafb', border: '2px solid #000000' }}
                        >
                          <span className="material-symbols-outlined text-[16px]">{icon}</span>
                          {esTipo(tipo) ? labelAct : label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleEliminarPelicula(pelicula.id)}
                        className="text-error-container font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] hover:bg-error-container hover:text-cream transition-all flex items-center gap-1 uppercase cursor-pointer"
                        style={{ backgroundColor: '#fee2e2', border: '2px solid #93000a' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span> Eliminar
                      </button>
                    </div>
                  </div>

                  {esTipo('editar') && (
                    <PanelEditar
                      pelicula={pelicula}
                      categorias={categorias}
                      token={token}
                      onGuardado={(cambios) => {
                        setPeliculas((prev) => prev.map((p) => p.id === pelicula.id ? { ...p, ...cambios } : p))
                        setPanelAbierto(null)
                      }}
                      onCancelar={() => setPanelAbierto(null)}
                    />
                  )}
                  {esTipo('stock') && (
                    <PanelStock
                      pelicula={pelicula}
                      token={token}
                      onActualizado={(cambios) => {
                        setPeliculas((prev) => prev.map((p) => p.id === pelicula.id ? { ...p, ...cambios } : p))
                        setPanelAbierto(null)
                      }}
                      onCancelar={() => setPanelAbierto(null)}
                    />
                  )}
                  {esTipo('descuento') && (
                    <PanelDescuento
                      pelicula={pelicula}
                      token={token}
                      onActualizado={(cambios) => {
                        setPeliculas((prev) => prev.map((p) => p.id === pelicula.id ? { ...p, ...cambios } : p))
                        setPanelAbierto(null)
                      }}
                      onCancelar={() => setPanelAbierto(null)}
                    />
                  )}
                  {esTipo('fotos') && (
                    <PanelFotos
                      pelicula={pelicula}
                      token={token}
                      onActualizado={(nuevasFotos) => setPeliculas((prev) => prev.map((p) => p.id === pelicula.id ? { ...p, fotos: nuevasFotos } : p))}
                      onCerrar={() => setPanelAbierto(null)}
                    />
                  )}
                </article>
              )
            })
          )}
        </section>

        {/* Bottom guide */}
        <section
          className="bg-surface-container-high shadow-[4px_4px_0px_#000000] p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md"
          style={{ border: '3px solid #000000', borderRadius: '10px' }}
        >
          <div className="flex items-center gap-space-sm">
            <div className="p-2 bg-primary-container text-ink-black shadow-[2px_2px_0px_#000000]" style={{ border: '2px solid #000000' }}>
              <span className="material-symbols-outlined text-[32px] block">tips_and_updates</span>
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-primary-container uppercase">Panel del vendedor</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">Administrá tus películas: creá nuevas, actualizá precio, stock, descuento y fotos.</div>
            </div>
          </div>
          <div
            className="flex items-center gap-space-xs font-label-sm text-label-sm text-cream bg-secondary-container px-space-sm py-[4px] shadow-[2px_2px_0px_#000000] uppercase"
            style={{ border: '1px solid #000000' }}
          >
            <span className="material-symbols-outlined text-[16px]">verified</span> ESTADO: VENDEDOR CERTIFICADO
          </div>
        </section>
      </div>
    </div>
  )
}

export default MisPeliculas
