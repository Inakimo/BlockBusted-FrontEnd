import { useState, useEffect } from 'react'

const URL_BASE = 'http://localhost:4002'

function Categorias({ token }) {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [nuevaDescripcion, setNuevaDescripcion] = useState('')
  const [creando, setCreando] = useState(false)
  const [errorCrear, setErrorCrear] = useState(null)

  const [editandoId, setEditandoId] = useState(null)
  const [editDescripcion, setEditDescripcion] = useState('')

  function cargarCategorias() {
    if (categorias.length === 0) setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/categorias`)
      .then((response) => response.json())
      .then((data) => {
        setCategorias(data.content)
        setCargando(false)
      })
      .catch((err) => {
        console.error('Error al cargar categorías', err)
        setError('No se pudieron cargar las categorías.')
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarCategorias()
  }, [])

  function handleCrear(e) {
    e.preventDefault()
    if (nuevaDescripcion.trim() === '') { alert('La descripción es obligatoria'); return }

    setCreando(true)
    setErrorCrear(null)

    fetch(`${URL_BASE}/api/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ descripcion: nuevaDescripcion }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            setErrorCrear(data.message || 'No se pudo crear la categoría.')
            setCreando(false)
          })
        }
        return response.json().then(() => {
          setNuevaDescripcion('')
          setCreando(false)
          cargarCategorias()
        })
      })
      .catch((err) => {
        console.error('Error al crear categoría', err)
        setErrorCrear('Error de conexión.')
        setCreando(false)
      })
  }

  function abrirEditar(categoria) {
    setEditandoId(categoria.id)
    setEditDescripcion(categoria.descripcion)
  }

  function handleGuardarEdicion(categoriaId) {
    if (editDescripcion.trim() === '') { alert('La descripción es obligatoria'); return }

    fetch(`${URL_BASE}/api/categorias/${categoriaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ descripcion: editDescripcion }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para editar esta categoría.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        setEditandoId(null)
        cargarCategorias()
      })
      .catch((err) => { console.error('Error al editar categoría', err) })
  }

  function handleEliminar(categoriaId) {
    fetch(`${URL_BASE}/api/categorias/${categoriaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para eliminar esta categoría.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        cargarCategorias()
      })
      .catch((err) => { console.error('Error al eliminar categoría', err) })
  }

  if (cargando && categorias.length === 0) return <p className="text-center text-cream font-body-lg text-body-lg py-space-xl">Cargando categorías...</p>
  if (error) return <p className="text-center text-secondary-container font-body-lg text-body-lg py-space-xl">{error}</p>

  return (
    <section className="relative w-full overflow-hidden pb-space-xl">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffd700 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
      ></div>

      <div className="max-w-7xl mx-auto px-margin-sm md:px-margin pt-space-md relative">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            <span className="text-primary-container font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">folder_special</span> BÓVEDA
            </span>
            <span className="text-muted-gray">/</span>
            <span className="text-cream">CONTROL MAESTRO</span>
            <span className="text-muted-gray">/</span>
            <span className="bg-secondary-container text-cream px-space-xs py-[1px] border-2 border-ink-black shadow-[2px_2px_0px_#000000]">PASILLOS VHS</span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-high border-2 border-ink-black shadow-[3px_3px_0px_#000000] px-space-sm py-[3px]">
            <span className="material-symbols-outlined text-primary-container text-[18px] animate-spin" style={{ animationDuration: '6s' }}>album</span>
            <span className="font-label-sm text-label-sm text-cream tracking-wider uppercase font-bold">BASE CINTAS: EN LÍNEA</span>
          </div>
        </div>

        {/* Header */}
        <div className="relative mb-space-lg">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div className="space-y-space-xs">
              <div className="inline-flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm bg-primary-container text-ink-black px-space-sm py-1 border-2 border-ink-black shadow-[3px_3px_0px_#000000] uppercase font-extrabold tracking-widest">
                  PANEL DE CONTROL ADMINISTRATIVO
                </span>
                <span className="bg-secondary-container text-cream text-[11px] font-extrabold px-space-xs py-1 border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase tracking-tighter">
                  NIVEL 1 • ADMIN ONLY
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-cream tracking-wide drop-shadow-[4px_4px_0px_#000000] uppercase flex items-baseline gap-space-xs">
                CATEGORÍAS
                <span className="text-primary-container text-headline-lg font-headline-lg">#PASILLOS</span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-snug">
                Gestión y clasificación de géneros y pasillos de la tienda. Control estricto de estanterías magnéticas y ficheros de videoclub.
              </p>
            </div>

            <div className="flex items-center gap-space-sm bg-surface-container border-2 border-ink-black shadow-[4px_4px_0px_#ffd700] p-space-sm self-start lg:self-end">
              <div className="bg-primary-container p-space-xs border-2 border-ink-black text-ink-black">
                <span className="material-symbols-outlined text-[28px] block">movie_filter</span>
              </div>
              <div className="text-left pr-space-xs">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Secciones</div>
                <div className="font-headline-sm text-headline-sm text-cream leading-none">{categorias.length} GÉNEROS REGISTRADOS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* LEFT: Nueva categoría */}
          <div className="lg:col-span-5 flex flex-col gap-gutter">
            <div className="bg-card-surface border-[3px] border-ink-black shadow-[5px_5px_0px_#000000] p-6 rounded-none relative">
              <div className="absolute -top-3.5 right-4 bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-[2px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase tracking-wider rotate-1">
                FICHA NUEVA
              </div>
              <div className="flex items-center gap-space-xs mb-space-md border-b-2 border-ink-black pb-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-[26px]">video_library</span>
                <h2 className="font-headline-md text-headline-md text-ink-black tracking-wide uppercase">
                  NUEVA CATEGORÍA
                </h2>
              </div>

              {errorCrear && (
                <div className="bg-[#fee2e2] text-error-container border-[3px] border-secondary-container shadow-[3px_3px_0px_#000000] p-space-sm mb-space-md flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-secondary-container text-[22px] shrink-0 mt-[2px]">warning</span>
                  <div>
                    <p className="font-label-md text-label-md text-secondary-container uppercase tracking-wide font-extrabold">¡ERROR! Conflicto en el fichero</p>
                    <p className="font-body-sm text-body-sm text-ink-black font-semibold">{errorCrear}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleCrear} className="flex flex-col gap-space-md">
                <div>
                  <label className="font-label-md text-label-md text-ink-black uppercase tracking-wider mb-space-xs flex items-center justify-between" htmlFor="categoryInput">
                    <span>DESCRIPCIÓN / GÉNERO</span>
                    <span className="text-muted-gray text-label-sm font-bold tracking-normal">Obligatorio</span>
                  </label>
                  <div className="relative">
                    <input
                      id="categoryInput"
                      type="text"
                      value={nuevaDescripcion}
                      onChange={(e) => setNuevaDescripcion(e.target.value)}
                      placeholder="Ej: Ciencia ficción"
                      className="w-full bg-[#f9fafb] text-ink-black font-body-lg text-body-lg font-bold px-space-md py-[11px] border-[3px] border-ink-black outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all placeholder:text-muted-gray placeholder:font-normal"
                    />
                    <div className="absolute right-3 top-3 text-muted-gray">
                      <span className="material-symbols-outlined text-[20px]">label</span>
                    </div>
                  </div>
                  <p className="mt-space-xs font-body-sm text-body-sm text-muted-gray">
                    Introduce el nombre del pasillo temático donde se organizarán los títulos.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={creando}
                  className="w-full bg-primary-container text-ink-black font-label-lg text-label-lg font-extrabold uppercase py-space-sm px-space-md border-[3px] border-ink-black shadow-[4px_4px_0px_#000000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] transition-all flex items-center justify-center gap-space-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[22px]">add_circle</span>
                  {creando ? 'CREANDO...' : 'CREAR CATEGORÍA'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Tabla */}
          <div className="lg:col-span-7">
            <div className="bg-card-surface border-[3px] border-ink-black shadow-[6px_6px_0px_#000000] p-space-md md:p-space-lg rounded-none relative">
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md border-b-[3px] border-ink-black pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-ink-black text-[28px]">format_list_bulleted</span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-ink-black leading-none uppercase">
                      ÍNDICE DE ESTANTERÍAS
                    </h3>
                    <span className="font-label-sm text-label-sm text-muted-gray uppercase tracking-widest font-bold">REGISTRO OFICIAL DE GÉNEROS</span>
                  </div>
                </div>
                <div className="bg-secondary-container text-cream px-space-sm py-[4px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] font-headline-sm text-headline-sm tracking-wider uppercase">
                  TOTAL: {categorias.length < 10 ? `0${categorias.length}` : categorias.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-ink-black text-cream border-2 border-ink-black">
                      <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider text-center w-16 border-r-2 border-ink-black">#</th>
                      <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider">DESCRIPCIÓN DEL GÉNERO</th>
                      <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider text-right w-56">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-ink-black border-2 border-ink-black font-body-md text-body-md text-ink-black">
                    {categorias.map((categoria) => (
                      <tr key={categoria.id} className={editandoId === categoria.id ? 'bg-[#FFF8E7] border-l-4 border-l-primary-container' : 'hover:bg-primary-container/10 transition-colors'}>
                        <td className={editandoId === categoria.id
                          ? 'py-space-md px-space-md text-center font-bold border-r-2 border-ink-black bg-primary-container/20'
                          : 'py-space-md px-space-md text-center font-bold border-r-2 border-ink-black bg-[#f3f4f6]'}>
                          <span className={editandoId === categoria.id
                            ? 'inline-block bg-primary-container text-ink-black font-label-sm text-label-sm px-2 py-[2px] font-extrabold border border-ink-black'
                            : 'inline-block bg-ink-black text-cream font-label-sm text-label-sm px-2 py-[2px]'}>
                            {categoria.id < 10 ? `0${categoria.id}` : categoria.id}
                          </span>
                        </td>
                        <td className="py-space-sm px-space-md font-bold tracking-wide">
                          {editandoId === categoria.id ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-extrabold tracking-widest text-secondary-container uppercase">EDICIÓN EN CURSO</span>
                              <input
                                type="text"
                                value={editDescripcion}
                                onChange={(e) => setEditDescripcion(e.target.value)}
                                className="w-full max-w-sm bg-white text-ink-black font-label-lg text-label-lg font-bold px-space-sm py-[6px] border-[3px] border-ink-black shadow-[3px_3px_0px_#0061a9] outline-none focus:ring-0"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-space-xs">
                              <span className="w-2.5 h-2.5 bg-secondary-container rounded-none"></span>
                              <span className="font-label-lg text-label-lg font-bold text-ink-black uppercase">{categoria.descripcion}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-space-md px-space-md text-right">
                          <div className="flex items-center justify-end gap-space-xs">
                            {editandoId === categoria.id ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleGuardarEdicion(categoria.id)}
                                  className="bg-primary-container text-ink-black font-label-sm text-label-sm uppercase font-extrabold px-space-sm py-[6px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0px_0px_0px_#000000] transition-all flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[16px]">save</span>
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditandoId(null)}
                                  className="bg-white text-ink-black font-label-sm text-label-sm uppercase font-extrabold px-space-sm py-[6px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] hover:bg-muted-gray/20 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0px_0px_0px_#000000] transition-all flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[16px]">close</span>
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => abrirEditar(categoria)}
                                  className="bg-transparent text-ink-black font-label-sm text-label-sm uppercase font-extrabold px-space-sm py-[6px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] hover:bg-cream active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0px_0px_0px_#000000] transition-all flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEliminar(categoria.id)}
                                  className="bg-transparent text-secondary-container font-label-sm text-label-sm uppercase font-extrabold px-space-sm py-[6px] border-2 border-secondary-container shadow-[2px_2px_0px_#000000] hover:bg-secondary-container hover:text-cream active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0px_0px_0px_#000000] transition-all flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                  Eliminar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-space-md pt-space-sm border-t-2 border-ink-black flex flex-col sm:flex-row items-center justify-between gap-space-xs font-label-sm text-label-sm text-muted-gray">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-ink-black">receipt_long</span>
                  <span className="font-bold text-ink-black">DISCO MAGNÉTICO ID: BB-CAT-89</span>
                </div>
                <div className="bg-primary-container text-ink-black font-extrabold px-space-xs py-[2px] border border-ink-black uppercase">
                  PÁGINA 1 DE 1
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Categorias
