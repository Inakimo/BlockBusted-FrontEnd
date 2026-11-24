import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCantidadCarrito } from '../store/carritoSlice'
import TarjetaPelicula from '../components/TarjetaPelicula.jsx'
import PageLoading from '../components/PageLoading.jsx'
import PageError from '../components/PageError.jsx'
import { toast } from '../utils/toast.js'

const URL_BASE = 'http://localhost:4002'

function Catalogo() {
  const dispatch = useDispatch()
  const token = useSelector((s) => s.auth.token)
  const usuario = useSelector((s) => s.auth.usuario)
  const [peliculas, setPeliculas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [mensajeCarrito, setMensajeCarrito] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch(`${URL_BASE}/api/categorias`).then((r) => r.json()),
      fetch(`${URL_BASE}/api/peliculas?size=1000`).then((r) => r.json()),
    ])
      .then(([catData, pelData]) => {
        setCategorias(catData.content)
        setPeliculas(pelData.content)
        setCargando(false)
      })
      .catch(() => {
        setError('No se pudieron cargar las películas.')
        setCargando(false)
      })
  }, [])

  const peliculasFiltradas = peliculas.filter((p) => {
    const coincideCategoria = !categoriaSeleccionada || String(p.categoria?.id) === String(categoriaSeleccionada)
    const coincideNombre = !busqueda.trim() || p.titulo.toLowerCase().includes(busqueda.trim().toLowerCase())
    return coincideCategoria && coincideNombre
  })

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
        dispatch(fetchCantidadCarrito())
      })
      .catch((error) => {
        console.error('Error al agregar al carrito', error)
        setMensajeCarrito({ tipo: 'error', texto: 'No se pudo agregar al carrito.' })
        setTimeout(() => setMensajeCarrito(null), 4000)
      })
  }

  function handleEliminarPelicula(peliculaId) {
    fetch(`${URL_BASE}/api/peliculas/${peliculaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => toast(d.message || 'No se pudo eliminar.'))
        setPeliculas((prev) => prev.filter((p) => p.id !== peliculaId))
        toast('Película eliminada.')
      })
      .catch(() => toast('Error de conexión.'))
  }

  if (cargando) return <PageLoading texto="Cargando películas..." />
  if (error) return <PageError texto={error} />

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin py-space-lg flex flex-col gap-space-lg">
        {/* Header row with title + filter */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-lg relative"
          style={{ borderBottom: '4px solid #000000' }}
        >
          {/* Decorative sticker */}
          <div
            className="absolute -top-3 right-0 md:right-1/3 rotate-6 bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-0.5 shadow-[2px_2px_0px_#000000] uppercase hidden sm:block"
            style={{ border: '2px solid #000000' }}
          >
            ★ REBOBINADO GARANTIZADO ★
          </div>

          {/* Title block */}
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-space-xs">
              <span
                className="bg-primary-container text-ink-black font-label-sm text-label-sm px-space-xs py-0.5 shadow-[2px_2px_0px_#000000] uppercase"
                style={{ border: '2px solid #000000' }}
              >
                ESTANTERÍA PRINCIPAL
              </span>
            </div>
            <h1
              className="font-display-lg text-display-lg text-cream tracking-wider uppercase leading-none mt-1"
              style={{ textShadow: '3px 3px 0 #a90111' }}
            >
              CATÁLOGO
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              ¡Las mejores parodias del celuloide en cinta magnetofónica y digital! Copias de contrabando autorizadas.
            </p>
          </div>

          {/* Filters: search + category */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-space-sm self-start md:self-end">
            {/* Search by name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="busquedaNombre" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                BUSCAR
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-black" style={{ fontSize: '20px' }}>
                  search
                </span>
                <input
                  id="busquedaNombre"
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre de película..."
                  className="bg-card-surface text-ink-black font-label-lg text-label-lg py-space-xs pl-9 pr-space-md shadow-[4px_4px_0px_#000000] focus:outline-none"
                  style={{ border: '3px solid #000000', borderRadius: '12px', minWidth: '220px' }}
                />
                {busqueda && (
                  <button
                    type="button"
                    onClick={() => setBusqueda('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-black cursor-pointer"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-col gap-1">
              <label htmlFor="filtroCategoria" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                CATEGORÍA
              </label>
              <div className="relative">
                <select
                  id="filtroCategoria"
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="appearance-none bg-card-surface text-ink-black font-label-lg text-label-lg py-space-xs pl-space-md pr-10 shadow-[4px_4px_0px_#000000] focus:outline-none cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5"
                  style={{ border: '3px solid #000000', borderRadius: '12px' }}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.descripcion}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-black font-bold">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cart toast message */}
        {mensajeCarrito && (
          <div
            className={`fixed top-24 right-4 sm:right-8 z-50 flex items-center gap-space-sm px-space-md py-space-sm shadow-[4px_4px_0px_#000000] ${mensajeCarrito.tipo === 'exito' ? 'bg-surface-container-highest' : 'bg-secondary-container'}`}
            style={{ border: '3px solid #000000', borderRadius: '12px' }}
          >
            <span
              className="material-symbols-outlined text-primary-container font-black"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {mensajeCarrito.tipo === 'exito' ? 'check_circle' : 'error'}
            </span>
            <span className="font-label-lg text-label-lg text-cream tracking-wide">
              {mensajeCarrito.texto}
            </span>
          </div>
        )}

        {/* Movie grid or empty state */}
        {peliculasFiltradas.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-space-xl bg-surface-container-low text-center p-space-md"
            style={{ border: '3px solid #000000', borderRadius: '12px' }}
          >
            <span className="material-symbols-outlined text-primary-container mb-space-xs" style={{ fontSize: '48px' }}>
              sentiment_dissatisfied
            </span>
            <h3 className="font-headline-md text-headline-md text-cream uppercase">
              ¡Cintas no encontradas en este pasillo!
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-1">
              {busqueda
                ? `No hay películas con "${busqueda}"${categoriaSeleccionada ? ' en esta categoría' : ''}.`
                : 'Parece que el encargado olvidó rebobinar y archivar esta sección. Prueba seleccionando otra categoría.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {peliculasFiltradas.map((pelicula) => (
              <TarjetaPelicula
                key={pelicula.id}
                pelicula={pelicula}
                onAgregarAlCarrito={handleAgregarAlCarrito}
                onEliminar={usuario?.role === 'ADMIN' ? handleEliminarPelicula : null}
              />
            ))}
          </div>
        )}

        {/* Bottom ticker marquee */}
        <div
          className="w-full bg-ink-black p-space-sm flex flex-wrap items-center justify-between gap-space-sm mt-space-md shadow-[4px_4px_0px_#a90111]"
          style={{ border: '3px solid #ffd700', borderRadius: '4px' }}
        >
          <div className="flex items-center gap-space-sm">
            <span
              className="bg-primary-container text-ink-black font-headline-sm text-headline-sm px-space-xs py-0.5 uppercase"
              style={{ border: '1px solid #000000' }}
            >
              AVISO LEGAL
            </span>
            <span className="font-body-sm text-body-sm text-cream">
              Multa de $2.00 por cada cinta devuelta sin rebobinar al cabezal inicial.
            </span>
          </div>
          <div className="flex items-center gap-space-xs text-secondary-fixed">
            <span className="material-symbols-outlined text-label-lg">local_shipping</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">
              ENVÍO EN 24H EN CAJA DE PIZZA RETRO
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Catalogo
