import { useState, useEffect } from 'react'
import './MisPeliculas.css'

const URL_BASE = 'http://localhost:4002'

function MisPeliculas({ token, usuario }) {
  const [peliculas, setPeliculas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // panel abierto por película: { id, tipo } donde tipo es 'editar'|'stock'|'descuento'|'fotos'
  const [panelAbierto, setPanelAbierto] = useState(null)

  // formulario nueva película
  const [nuevaTitulo, setNuevaTitulo] = useState('')
  const [nuevaDescripcion, setNuevaDescripcion] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [nuevoStock, setNuevoStock] = useState('')
  const [nuevaCategoriaId, setNuevaCategoriaId] = useState('')
  const [creando, setCreando] = useState(false)
  const [errorCrear, setErrorCrear] = useState(null)

  // valores de los paneles inline
  const [editTitulo, setEditTitulo] = useState('')
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editPrecio, setEditPrecio] = useState('')
  const [editCategoriaId, setEditCategoriaId] = useState('')

  const [nuevoStockValor, setNuevoStockValor] = useState('')
  const [nuevoDescuento, setNuevoDescuento] = useState('')
  const [nuevaFotoUrl, setNuevaFotoUrl] = useState('')

  function cargarPeliculas() {
    setCargando(true)
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

  if (cargando) return <p className="estado-mensaje">Cargando películas...</p>
  if (error) return <p className="estado-error">{error}</p>

  return (
    <section>
      <h1 className="mp-titulo">Mis películas</h1>

      {/* Formulario nueva película */}
      <div className="mp-seccion">
        <h2 className="mp-subtitulo">Agregar nueva película</h2>

        {errorCrear && <div className="mp-error">{errorCrear}</div>}

        <form onSubmit={handleCrearPelicula} className="mp-form-crear">
          <div className="mp-campo">
            <label className="mp-label">Título</label>
            <input
              type="text"
              value={nuevaTitulo}
              onChange={(e) => setNuevaTitulo(e.target.value)}
              className="mp-input"
              placeholder="Ej: El Padrino"
            />
          </div>

          <div className="mp-campo">
            <label className="mp-label">Descripción</label>
            <textarea
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              className="mp-input mp-textarea"
              placeholder="Descripción de la película..."
            />
          </div>

          <div className="mp-fila">
            <div className="mp-campo">
              <label className="mp-label">Precio ($)</label>
              <input
                type="number"
                min="0"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
                className="mp-input"
                placeholder="1500"
              />
            </div>

            <div className="mp-campo">
              <label className="mp-label">Stock</label>
              <input
                type="number"
                min="0"
                value={nuevoStock}
                onChange={(e) => setNuevoStock(e.target.value)}
                className="mp-input"
                placeholder="10"
              />
            </div>

            <div className="mp-campo">
              <label className="mp-label">Categoría</label>
              <select
                value={nuevaCategoriaId}
                onChange={(e) => setNuevaCategoriaId(e.target.value)}
                className="mp-input"
              >
                <option value="">Seleccionar...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={creando} className="mp-btn-primario">
            {creando ? 'Creando...' : 'Crear película'}
          </button>
        </form>
      </div>

      {/* Lista de películas */}
      {peliculas.length === 0 ? (
        <p className="estado-mensaje">Todavía no publicaste ninguna película.</p>
      ) : (
        <div className="mp-lista">
          {peliculas.map((pelicula) => (
            <div key={pelicula.id} className="mp-card">
              <div className="mp-card-encabezado">
                <div className="mp-card-info">
                  <h3 className="mp-card-titulo">{pelicula.titulo}</h3>
                  <p className="mp-card-meta">
                    {pelicula.categoria && pelicula.categoria.descripcion}
                    {' · '}${pelicula.precio}
                    {pelicula.descuentoPorcentaje > 0 && ` · ${pelicula.descuentoPorcentaje}% dto`}
                    {' · '}Stock: {pelicula.stock}
                  </p>
                </div>

                <div className="mp-card-acciones">
                  <button onClick={() => abrirPanel(pelicula.id, 'editar', pelicula)} className="mp-btn-accion">
                    Editar
                  </button>
                  <button onClick={() => abrirPanel(pelicula.id, 'stock', pelicula)} className="mp-btn-accion">
                    Stock
                  </button>
                  <button onClick={() => abrirPanel(pelicula.id, 'descuento', pelicula)} className="mp-btn-accion">
                    Descuento
                  </button>
                  <button onClick={() => abrirPanel(pelicula.id, 'fotos', pelicula)} className="mp-btn-accion">
                    Fotos
                  </button>
                  <button onClick={() => handleEliminarPelicula(pelicula.id)} className="mp-btn-eliminar">
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Panel editar */}
              {panelAbierto && panelAbierto.id === pelicula.id && panelAbierto.tipo === 'editar' && (
                <div className="mp-panel">
                  <h4 className="mp-panel-titulo">Editar datos</h4>
                  <div className="mp-campo">
                    <label className="mp-label">Título</label>
                    <input type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} className="mp-input" />
                  </div>
                  <div className="mp-campo">
                    <label className="mp-label">Descripción</label>
                    <textarea value={editDescripcion} onChange={(e) => setEditDescripcion(e.target.value)} className="mp-input mp-textarea" />
                  </div>
                  <div className="mp-fila">
                    <div className="mp-campo">
                      <label className="mp-label">Precio ($)</label>
                      <input type="number" min="0" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} className="mp-input" />
                    </div>
                    <div className="mp-campo">
                      <label className="mp-label">Categoría</label>
                      <select value={editCategoriaId} onChange={(e) => setEditCategoriaId(e.target.value)} className="mp-input">
                        <option value="">Seleccionar...</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mp-panel-botones">
                    <button onClick={() => handleEditar(pelicula.id)} className="mp-btn-primario">Guardar</button>
                    <button onClick={() => setPanelAbierto(null)} className="mp-btn-cancelar">Cancelar</button>
                  </div>
                </div>
              )}

              {/* Panel stock */}
              {panelAbierto && panelAbierto.id === pelicula.id && panelAbierto.tipo === 'stock' && (
                <div className="mp-panel">
                  <h4 className="mp-panel-titulo">Cambiar stock</h4>
                  <div className="mp-fila-corta">
                    <input
                      type="number"
                      min="0"
                      value={nuevoStockValor}
                      onChange={(e) => setNuevoStockValor(e.target.value)}
                      className="mp-input"
                    />
                    <button onClick={() => handleCambiarStock(pelicula.id)} className="mp-btn-primario">Guardar</button>
                    <button onClick={() => setPanelAbierto(null)} className="mp-btn-cancelar">Cancelar</button>
                  </div>
                </div>
              )}

              {/* Panel descuento */}
              {panelAbierto && panelAbierto.id === pelicula.id && panelAbierto.tipo === 'descuento' && (
                <div className="mp-panel">
                  <h4 className="mp-panel-titulo">Cambiar descuento (0 a 100)</h4>
                  <div className="mp-fila-corta">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nuevoDescuento}
                      onChange={(e) => setNuevoDescuento(e.target.value)}
                      className="mp-input"
                    />
                    <button onClick={() => handleCambiarDescuento(pelicula.id)} className="mp-btn-primario">Guardar</button>
                    <button onClick={() => setPanelAbierto(null)} className="mp-btn-cancelar">Cancelar</button>
                  </div>
                </div>
              )}

              {/* Panel fotos */}
              {panelAbierto && panelAbierto.id === pelicula.id && panelAbierto.tipo === 'fotos' && (
                <div className="mp-panel">
                  <h4 className="mp-panel-titulo">Fotos</h4>

                  {pelicula.fotos && pelicula.fotos.length > 0 ? (
                    <div className="mp-fotos-lista">
                      {pelicula.fotos.map((foto) => (
                        <div key={foto.id} className="mp-foto-item">
                          <img src={foto.url} alt="Foto de la película" className="mp-foto-img" />
                          <button
                            onClick={() => handleEliminarFoto(pelicula.id, foto.id)}
                            className="mp-btn-quitar-foto"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mp-sin-fotos">Sin fotos cargadas.</p>
                  )}

                  <div className="mp-fila-corta" style={{ marginTop: '1rem' }}>
                    <input
                      type="text"
                      value={nuevaFotoUrl}
                      onChange={(e) => setNuevaFotoUrl(e.target.value)}
                      className="mp-input"
                      placeholder="https://..."
                    />
                    <button onClick={() => handleAgregarFoto(pelicula.id)} className="mp-btn-primario">
                      Agregar
                    </button>
                    <button onClick={() => setPanelAbierto(null)} className="mp-btn-cancelar">
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default MisPeliculas
