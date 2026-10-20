import { useState, useEffect } from 'react'

const URL_BASE = 'http://localhost:4002'

function MisPeliculas({ token, usuario }) {
  const [peliculas, setPeliculas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [panelAbierto, setPanelAbierto] = useState(null)

  const [nuevaTitulo, setNuevaTitulo] = useState('')
  const [nuevaDescripcion, setNuevaDescripcion] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [nuevoStock, setNuevoStock] = useState('')
  const [nuevaCategoriaId, setNuevaCategoriaId] = useState('')
  const [creando, setCreando] = useState(false)
  const [errorCrear, setErrorCrear] = useState(null)

  const [editTitulo, setEditTitulo] = useState('')
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editPrecio, setEditPrecio] = useState('')
  const [editCategoriaId, setEditCategoriaId] = useState('')

  const [nuevoStockValor, setNuevoStockValor] = useState('')
  const [nuevoDescuento, setNuevoDescuento] = useState('')
  const [nuevaFotoUrl, setNuevaFotoUrl] = useState('')

  function cargarPeliculas() {
    if (peliculas.length === 0) setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/peliculas`)
      .then((response) => response.json())
      .then((data) => {
        const misPeliculas = data.content.filter(
          (p) => p.vendedor && p.vendedor.id === usuario.id
        )
        setPeliculas(misPeliculas)
        setCargando(false)
      })
      .catch((err) => {
        console.error('Error al cargar películas', err)
        setError('No se pudieron cargar las películas.')
        setCargando(false)
      })
  }

  useEffect(() => {
    fetch(`${URL_BASE}/api/categorias`)
      .then((response) => response.json())
      .then((data) => { setCategorias(data.content) })
      .catch((err) => { console.error('Error al cargar categorías', err) })

    cargarPeliculas()
  }, [])

  function abrirPanel(peliculaId, tipo, pelicula) {
    if (panelAbierto && panelAbierto.id === peliculaId && panelAbierto.tipo === tipo) {
      setPanelAbierto(null)
      return
    }
    setPanelAbierto({ id: peliculaId, tipo })

    if (tipo === 'editar') {
      setEditTitulo(pelicula.titulo)
      setEditDescripcion(pelicula.descripcion)
      setEditPrecio(pelicula.precio)
      setEditCategoriaId(pelicula.categoria ? pelicula.categoria.id : '')
    }
    if (tipo === 'stock') {
      setNuevoStockValor(pelicula.stock)
    }
    if (tipo === 'descuento') {
      setNuevoDescuento(pelicula.descuentoPorcentaje)
    }
    if (tipo === 'fotos') {
      setNuevaFotoUrl('')
    }
  }

  function handleCrearPelicula(e) {
    e.preventDefault()
    if (nuevaTitulo.trim() === '') { alert('El título es obligatorio'); return }
    if (nuevaDescripcion.trim() === '') { alert('La descripción es obligatoria'); return }
    if (nuevoPrecio === '') { alert('El precio es obligatorio'); return }
    if (nuevoStock === '') { alert('El stock es obligatorio'); return }
    if (nuevaCategoriaId === '') { alert('La categoría es obligatoria'); return }

    setCreando(true)
    setErrorCrear(null)

    fetch(`${URL_BASE}/api/peliculas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo: nuevaTitulo,
        descripcion: nuevaDescripcion,
        precio: Number(nuevoPrecio),
        stock: Number(nuevoStock),
        categoriaId: Number(nuevaCategoriaId),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            setErrorCrear(data.message || 'No se pudo crear la película.')
            setCreando(false)
          })
        }
        return response.json().then(() => {
          setNuevaTitulo('')
          setNuevaDescripcion('')
          setNuevoPrecio('')
          setNuevoStock('')
          setNuevaCategoriaId('')
          setCreando(false)
          cargarPeliculas()
        })
      })
      .catch((err) => {
        console.error('Error al crear película', err)
        setErrorCrear('Error de conexión.')
        setCreando(false)
      })
  }

  function handleEditar(peliculaId) {
    if (editTitulo.trim() === '') { alert('El título es obligatorio'); return }
    if (editDescripcion.trim() === '') { alert('La descripción es obligatoria'); return }
    if (editPrecio === '') { alert('El precio es obligatorio'); return }
    if (editCategoriaId === '') { alert('La categoría es obligatoria'); return }

    fetch(`${URL_BASE}/api/peliculas/${peliculaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo: editTitulo,
        descripcion: editDescripcion,
        precio: Number(editPrecio),
        categoriaId: Number(editCategoriaId),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para editar esta película.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        setPanelAbierto(null)
        cargarPeliculas()
      })
      .catch((err) => { console.error('Error al editar película', err) })
  }

  function handleCambiarStock(peliculaId) {
    if (nuevoStockValor === '') { alert('El stock es obligatorio'); return }

    fetch(`${URL_BASE}/api/peliculas/${peliculaId}/stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ stock: Number(nuevoStockValor) }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para cambiar el stock.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        setPanelAbierto(null)
        cargarPeliculas()
      })
      .catch((err) => { console.error('Error al cambiar stock', err) })
  }

  function handleCambiarDescuento(peliculaId) {
    if (nuevoDescuento === '') { alert('El descuento es obligatorio'); return }

    fetch(`${URL_BASE}/api/peliculas/${peliculaId}/descuento`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ descuentoPorcentaje: Number(nuevoDescuento) }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para cambiar el descuento.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        setPanelAbierto(null)
        cargarPeliculas()
      })
      .catch((err) => { console.error('Error al cambiar descuento', err) })
  }

  function handleAgregarFoto(peliculaId) {
    if (nuevaFotoUrl.trim() === '') { alert('La URL de la foto es obligatoria'); return }

    fetch(`${URL_BASE}/api/peliculas/${peliculaId}/fotos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ urls: [nuevaFotoUrl] }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para agregar fotos.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        setNuevaFotoUrl('')
        cargarPeliculas()
      })
      .catch((err) => { console.error('Error al agregar foto', err) })
  }

  function handleEliminarFoto(peliculaId, fotoId) {
    fetch(`${URL_BASE}/api/peliculas/${peliculaId}/fotos/${fotoId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudo eliminar la foto.')
          return
        }
        cargarPeliculas()
      })
      .catch((err) => { console.error('Error al eliminar foto', err) })
  }

  function handleEliminarPelicula(peliculaId) {
    fetch(`${URL_BASE}/api/peliculas/${peliculaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para eliminar esta película.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        cargarPeliculas()
      })
      .catch((err) => { console.error('Error al eliminar película', err) })
  }

  if (cargando && peliculas.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-sm md:px-margin py-space-xl">
        <p className="font-headline-md text-headline-md text-cream text-center">Cargando películas...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-sm md:px-margin py-space-xl">
        <p className="font-headline-md text-headline-md text-secondary-container text-center">{error}</p>
      </div>
    )
  }

  // Totales (sin reduce — contamos con loop simple)
  let totalStock = 0
  for (let i = 0; i < peliculas.length; i++) {
    totalStock = totalStock + peliculas[i].stock
  }

  const panelInputStyle = { border: '2px solid #000000', borderRadius: '4px' }
  const campoBtnStyle = { border: '2px solid #000000' }

  return (
    <div className="relative w-full pb-space-xl overflow-hidden">
      {/* Pop art dots */}
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
            <div
              className="bg-surface-container-high shadow-[3px_3px_0px_#000000] px-space-md py-space-xs flex items-center gap-space-sm"
              style={{ border: '2px solid #000000' }}
            >
              <span className="font-headline-sm text-headline-sm text-primary-container">{peliculas.length}</span>
              <div className="font-label-sm text-label-sm text-on-surface uppercase leading-none">
                TÍTULOS<br/><span className="text-on-surface-variant">ACTIVOS</span>
              </div>
            </div>
            <div
              className="bg-surface-container-high shadow-[3px_3px_0px_#000000] px-space-md py-space-xs flex items-center gap-space-sm"
              style={{ border: '2px solid #000000' }}
            >
              <span className="font-headline-sm text-headline-sm text-secondary">{totalStock}</span>
              <div className="font-label-sm text-label-sm text-on-surface uppercase leading-none">
                CINTAS<br/><span className="text-on-surface-variant">TOTAL STOCK</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form crear */}
        <section
          className="relative bg-card-surface shadow-[5px_5px_0px_#000000] p-space-md md:p-space-lg text-ink-black"
          style={{ border: '3px solid #000000', borderRadius: '10px' }}
        >
          <div
            className="absolute -top-3 -right-3 bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-[2px] shadow-[2px_2px_0px_#000000] uppercase tracking-wider"
            style={{ border: '2px solid #000000', transform: 'rotate(3deg)' }}
          >
            ★ NUEVA ENTRADA ★
          </div>
          <div className="flex items-center gap-space-xs mb-space-md">
            <span className="material-symbols-outlined text-[28px] text-secondary-container">add_box</span>
            <h2 className="font-headline-lg text-headline-lg text-ink-black uppercase tracking-wider">
              AGREGAR NUEVA PELÍCULA
            </h2>
          </div>

          {errorCrear && (
            <div
              className="mb-space-lg text-error-container shadow-[3px_3px_0px_#000000] p-space-sm md:p-space-md flex items-start gap-space-sm"
              style={{ backgroundColor: '#fee2e2', border: '3px solid #93000a', borderRadius: '8px' }}
            >
              <span className="material-symbols-outlined text-[28px] text-error-container flex-shrink-0 animate-bounce">warning</span>
              <div className="flex-1">
                <p className="font-label-lg text-label-lg uppercase tracking-wide text-error-container">
                  ¡ATENCIÓN! CINTA DAÑADA: {errorCrear}
                </p>
                <p className="font-body-sm text-body-sm text-ink-black mt-1">
                  Verifica que el título no esté duplicado en tu estante y que el precio unitario sea un monto mayor a cero.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleCrearPelicula} className="space-y-space-md">
            <div>
              <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
                Título de la Película <span className="text-secondary-container">*</span>
              </label>
              <input
                type="text"
                value={nuevaTitulo}
                onChange={(e) => setNuevaTitulo(e.target.value)}
                className="w-full text-ink-black font-body-md text-body-md px-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all"
                style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
                placeholder="Ej: El Padrino"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
                Sinopsis / Descripción VHS <span className="text-secondary-container">*</span>
              </label>
              <textarea
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
                rows="3"
                className="w-full text-ink-black font-body-md text-body-md px-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all resize-y"
                style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
                placeholder="Describe el argumento, año original de estreno, edición coleccionista..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div>
                <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
                  Precio de Alquiler / Venta ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-headline-sm text-ink-black">$</span>
                  <input
                    type="number"
                    min="0"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(e.target.value)}
                    className="w-full text-ink-black font-body-md text-body-md pl-space-lg pr-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all"
                    style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
                    placeholder="1500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
                  Stock Disponible (Copias)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-muted-gray">inventory_2</span>
                  <input
                    type="number"
                    min="0"
                    value={nuevoStock}
                    onChange={(e) => setNuevoStock(e.target.value)}
                    className="w-full text-ink-black font-body-md text-body-md pl-space-lg pr-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all"
                    style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
                    placeholder="10"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
                  Categoría del Pasillo
                </label>
                <div className="relative">
                  <select
                    value={nuevaCategoriaId}
                    onChange={(e) => setNuevaCategoriaId(e.target.value)}
                    className="w-full appearance-none text-ink-black font-body-md text-body-md px-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all cursor-pointer"
                    style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
                  >
                    <option value="">Selecciona categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-black">arrow_drop_down</span>
                </div>
              </div>
            </div>

            <div className="pt-space-sm flex justify-end">
              <button
                type="submit"
                disabled={creando}
                className="bg-primary-container text-ink-black font-headline-md text-headline-md uppercase tracking-wider px-space-xl py-space-sm shadow-[4px_4px_0px_#000000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000] transition-all flex items-center gap-space-xs disabled:opacity-50"
                style={{ border: '3px solid #000000' }}
              >
                <span className="material-symbols-outlined text-[26px]">video_call</span>
                {creando ? 'CREANDO...' : 'CREAR PELÍCULA'}
              </button>
            </div>
          </form>
        </section>

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
            <div
              className="bg-card-surface text-ink-black p-space-xl text-center shadow-[5px_5px_0px_#000000]"
              style={{ border: '3px solid #000000', borderRadius: '10px' }}
            >
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
                      {/* VHS thumbnail */}
                      <div
                        className="w-16 h-20 bg-ink-black shadow-[2px_2px_0px_#000000] overflow-hidden flex-shrink-0 relative"
                        style={{ border: '2px solid #000000' }}
                      >
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
                          <h3 className="font-headline-md text-headline-md uppercase tracking-wider text-ink-black">
                            {pelicula.titulo}
                          </h3>
                          {tieneDescuento && (
                            <span
                              className="bg-primary-container text-ink-black font-label-sm text-label-sm px-space-xs py-[1px] shadow-[1px_1px_0px_#000000] uppercase font-black"
                              style={{ border: '2px solid #000000' }}
                            >
                              {pelicula.descuentoPorcentaje}% DTO
                            </span>
                          )}
                          {pelicula.stock === 0 && (
                            <span className="bg-error-container text-cream font-label-sm text-label-sm px-space-xs py-[1px] uppercase font-bold" style={{ border: '1px solid #000000' }}>
                              AGOTADO
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-space-xs text-muted-gray font-label-md text-label-md flex-wrap">
                          <span className="font-bold uppercase tracking-wider" style={{ color: '#0061a9' }}>
                            {pelicula.categoria && pelicula.categoria.descripcion}
                          </span>
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
                      <button
                        type="button"
                        onClick={() => abrirPanel(pelicula.id, 'editar', pelicula)}
                        className={`font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] transition-all flex items-center gap-1 uppercase ${esTipo('editar') ? 'bg-primary-container text-ink-black font-bold' : 'text-ink-black hover:bg-cream'}`}
                        style={{ backgroundColor: esTipo('editar') ? '#ffd700' : '#f9fafb', border: '2px solid #000000' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        {esTipo('editar') ? 'Editando...' : 'Editar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirPanel(pelicula.id, 'stock', pelicula)}
                        className={`font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] transition-all flex items-center gap-1 uppercase ${esTipo('stock') ? 'bg-primary-container text-ink-black font-bold' : 'text-ink-black hover:bg-cream'}`}
                        style={{ backgroundColor: esTipo('stock') ? '#ffd700' : '#f9fafb', border: '2px solid #000000' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">inventory</span>
                        {esTipo('stock') ? 'Ajustando...' : 'Stock'}
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirPanel(pelicula.id, 'descuento', pelicula)}
                        className={`font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] transition-all flex items-center gap-1 uppercase ${esTipo('descuento') ? 'bg-primary-container text-ink-black font-bold' : 'text-ink-black hover:bg-cream'}`}
                        style={{ backgroundColor: esTipo('descuento') ? '#ffd700' : '#f9fafb', border: '2px solid #000000' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">percent</span>
                        {esTipo('descuento') ? 'Activo' : 'Descuento'}
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirPanel(pelicula.id, 'fotos', pelicula)}
                        className={`font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] transition-all flex items-center gap-1 uppercase ${esTipo('fotos') ? 'bg-primary-container text-ink-black font-bold' : 'text-ink-black hover:bg-cream'}`}
                        style={{ backgroundColor: esTipo('fotos') ? '#ffd700' : '#f9fafb', border: '2px solid #000000' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">photo_library</span>
                        {esTipo('fotos') ? 'Galería' : 'Fotos'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminarPelicula(pelicula.id)}
                        className="text-error-container font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] hover:bg-error-container hover:text-cream transition-all flex items-center gap-1 uppercase"
                        style={{ backgroundColor: '#fee2e2', border: '2px solid #93000a' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span> Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Panel editar */}
                  {esTipo('editar') && (
                    <div
                      className="mt-space-md p-space-md shadow-[3px_3px_0px_#000000]"
                      style={{ backgroundColor: '#f3f4f6', border: '2px solid #000000', borderRadius: '8px' }}
                    >
                      <div className="flex items-center justify-between pb-space-xs mb-space-sm" style={{ borderBottom: '1px solid rgba(107,114,128,0.3)' }}>
                        <span className="font-headline-sm text-headline-sm uppercase text-ink-black flex items-center gap-1">
                          <span className="material-symbols-outlined text-[20px]" style={{ color: '#0061a9' }}>edit_note</span>
                          Editar Ficha Técnica
                        </span>
                        <span className="font-label-sm text-label-sm text-muted-gray uppercase">ID #{pelicula.id}</span>
                      </div>
                      <div className="space-y-space-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                          <div>
                            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">Título</label>
                            <input type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)}
                              className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-space-sm py-[6px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9]"
                              style={panelInputStyle} />
                          </div>
                          <div className="grid grid-cols-2 gap-space-sm">
                            <div>
                              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">Precio ($)</label>
                              <input type="number" min="0" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)}
                                className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-space-sm py-[6px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9]"
                                style={panelInputStyle} />
                            </div>
                            <div>
                              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">Categoría</label>
                              <select value={editCategoriaId} onChange={(e) => setEditCategoriaId(e.target.value)}
                                className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-space-sm py-[6px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9]"
                                style={panelInputStyle}>
                                <option value="">Seleccionar...</option>
                                {categorias.map((cat) => (
                                  <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">Descripción</label>
                          <textarea rows="2" value={editDescripcion} onChange={(e) => setEditDescripcion(e.target.value)}
                            className="w-full bg-card-surface text-ink-black font-body-sm text-body-sm px-space-sm py-[6px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9] leading-snug"
                            style={panelInputStyle} />
                        </div>
                        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                          <button type="button" onClick={() => setPanelAbierto(null)}
                            className="bg-card-surface text-ink-black font-label-md text-label-md px-space-md py-[6px] shadow-[2px_2px_0px_#000000] hover:bg-cream uppercase"
                            style={campoBtnStyle}>
                            Cancelar
                          </button>
                          <button type="button" onClick={() => handleEditar(pelicula.id)}
                            className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-[6px] shadow-[2px_2px_0px_#000000] uppercase font-bold flex items-center gap-1"
                            style={campoBtnStyle}>
                            <span className="material-symbols-outlined text-[18px]">save</span> Guardar Cambios
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Panel stock */}
                  {esTipo('stock') && (
                    <div
                      className="mt-space-md p-space-md shadow-[3px_3px_0px_#000000]"
                      style={{ backgroundColor: '#f3f4f6', border: '2px solid #000000', borderRadius: '8px' }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-[24px] text-primary-container bg-ink-black p-1 rounded">inventory_2</span>
                          <div>
                            <div className="font-headline-sm text-headline-sm uppercase text-ink-black leading-tight">
                              Modificar Existencias en Depósito
                            </div>
                            <div className="font-body-sm text-body-sm text-muted-gray">
                              Ingresa el número total de cajas VHS físicas disponibles para préstamo.
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-sm flex-wrap">
                          <div className="flex items-center bg-card-surface shadow-[2px_2px_0px_#000000]" style={{ border: '2px solid #000000', borderRadius: '4px' }}>
                            <span className="font-label-sm text-label-sm text-muted-gray px-space-xs uppercase">Unidades:</span>
                            <input type="number" min="0" value={nuevoStockValor} onChange={(e) => setNuevoStockValor(e.target.value)}
                              className="w-20 px-2 py-1 text-center font-headline-sm text-headline-sm text-ink-black focus:outline-none"
                              style={{ borderLeft: '2px solid #000000' }} />
                          </div>
                          <button type="button" onClick={() => setPanelAbierto(null)}
                            className="bg-card-surface text-ink-black font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] hover:bg-cream uppercase"
                            style={campoBtnStyle}>
                            Cancelar
                          </button>
                          <button type="button" onClick={() => handleCambiarStock(pelicula.id)}
                            className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-[7px] shadow-[2px_2px_0px_#000000] uppercase font-bold flex items-center gap-1"
                            style={campoBtnStyle}>
                            <span className="material-symbols-outlined text-[16px]">check_circle</span> Actualizar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Panel descuento */}
                  {esTipo('descuento') && (
                    <div
                      className="mt-space-md p-space-md shadow-[3px_3px_0px_#000000]"
                      style={{ backgroundColor: '#f3f4f6', border: '2px solid #000000', borderRadius: '8px' }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-[24px] text-cream bg-secondary-container p-1 rounded" style={{ border: '1px solid #000000' }}>local_offer</span>
                          <div>
                            <div className="font-headline-sm text-headline-sm uppercase text-ink-black leading-tight">
                              Promoción Semanal / Oferta Marquee
                            </div>
                            <div className="font-body-sm text-body-sm text-muted-gray">
                              Configura el porcentaje de rebaja directa (0 a 100) aplicada al precio base (${pelicula.precio}).
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-sm flex-wrap">
                          <div className="relative flex items-center bg-card-surface shadow-[2px_2px_0px_#000000]" style={{ border: '2px solid #000000', borderRadius: '4px' }}>
                            <input type="number" min="0" max="100" value={nuevoDescuento} onChange={(e) => setNuevoDescuento(e.target.value)}
                              className="w-20 px-2 py-1 text-center font-headline-sm text-headline-sm text-ink-black focus:outline-none" />
                            <span className="font-headline-sm text-headline-sm pr-2 text-secondary-container font-bold">%</span>
                          </div>
                          <button type="button" onClick={() => setPanelAbierto(null)}
                            className="bg-card-surface text-ink-black font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] hover:bg-cream uppercase"
                            style={campoBtnStyle}>
                            Cancelar
                          </button>
                          <button type="button" onClick={() => handleCambiarDescuento(pelicula.id)}
                            className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-[7px] shadow-[2px_2px_0px_#000000] uppercase font-bold flex items-center gap-1"
                            style={campoBtnStyle}>
                            <span className="material-symbols-outlined text-[16px]">save</span> Aplicar DTO
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Panel fotos */}
                  {esTipo('fotos') && (
                    <div
                      className="mt-space-md p-space-md shadow-[3px_3px_0px_#000000] space-y-space-md"
                      style={{ backgroundColor: '#f3f4f6', border: '2px solid #000000', borderRadius: '8px' }}
                    >
                      <div className="flex items-center justify-between pb-space-xs" style={{ borderBottom: '1px solid rgba(107,114,128,0.3)' }}>
                        <span className="font-headline-sm text-headline-sm uppercase text-ink-black flex items-center gap-1">
                          <span className="material-symbols-outlined text-[20px] text-secondary-container">collections</span>
                          Afiches y Galería de Portadas VHS
                        </span>
                        <button type="button" onClick={() => setPanelAbierto(null)}
                          className="font-label-sm text-label-sm text-muted-gray hover:text-ink-black uppercase font-bold flex items-center gap-1 bg-transparent border-none cursor-pointer">
                          <span className="material-symbols-outlined text-[16px]">close</span> Cerrar
                        </button>
                      </div>

                      <div>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-muted-gray mb-space-xs">
                          Imágenes Actuales del Ejemplar:
                        </label>
                        {pelicula.fotos && pelicula.fotos.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-space-sm">
                            {pelicula.fotos.map((foto, indice) => (
                              <div key={foto.id} className="flex flex-col bg-card-surface p-1 shadow-[2px_2px_0px_#000000] rounded" style={{ border: '2px solid #000000' }}>
                                <div className="h-24 w-full overflow-hidden bg-ink-black">
                                  <img src={foto.url} alt={`Foto ${indice + 1}`} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] font-bold text-center py-[2px] text-muted-gray uppercase">PORTADA {indice + 1}</span>
                                <button type="button" onClick={() => handleEliminarFoto(pelicula.id, foto.id)}
                                  className="w-full text-error-container text-[11px] font-bold py-[2px] hover:bg-error-container hover:text-cream transition-colors uppercase"
                                  style={{ backgroundColor: '#fee2e2', border: '1px solid #93000a' }}>
                                  Quitar
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="font-body-sm text-body-sm text-muted-gray italic">Sin fotos cargadas.</p>
                        )}
                      </div>

                      <div className="pt-space-xs" style={{ borderTop: '1px solid rgba(107,114,128,0.2)' }}>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">
                          Cargar Nueva URL de Imagen o Afiche:
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-xs">
                          <input type="url" value={nuevaFotoUrl} onChange={(e) => setNuevaFotoUrl(e.target.value)}
                            className="flex-1 bg-card-surface text-ink-black font-body-sm text-body-sm px-space-sm py-[7px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9]"
                            style={panelInputStyle}
                            placeholder="https://images.blockbusted.club/posters/..." />
                          <button type="button" onClick={() => handleAgregarFoto(pelicula.id)}
                            className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-[7px] shadow-[2px_2px_0px_#000000] uppercase font-bold flex items-center justify-center gap-1"
                            style={campoBtnStyle}>
                            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span> Agregar Foto
                          </button>
                        </div>
                      </div>
                    </div>
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
              <div className="font-headline-sm text-headline-sm text-primary-container uppercase">
                Panel del vendedor
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                Administrá tus películas: creá nuevas, actualizá precio, stock, descuento y fotos.
              </div>
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
