import { useState, useEffect } from 'react'
import './Categorias.css'

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
    setCargando(true)
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

  if (cargando) return <p className="estado-mensaje">Cargando categorías...</p>
  if (error) return <p className="estado-error">{error}</p>

  return (
    <section>
      <h1 className="admin-titulo">Categorías</h1>

      <div className="admin-seccion">
        <h2 className="admin-subtitulo">Nueva categoría</h2>

        {errorCrear && <div className="admin-error">{errorCrear}</div>}

        <form onSubmit={handleCrear} className="admin-form-inline">
          <input
            type="text"
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
            className="admin-input"
            placeholder="Ej: Ciencia ficción"
          />
          <button type="submit" disabled={creando} className="admin-btn-primario">
            {creando ? 'Creando...' : 'Crear'}
          </button>
        </form>
      </div>

      <div className="admin-tabla-contenedor">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td className="admin-td-id">{categoria.id}</td>
                <td>
                  {editandoId === categoria.id ? (
                    <input
                      type="text"
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                      className="admin-input admin-input-inline"
                    />
                  ) : (
                    categoria.descripcion
                  )}
                </td>
                <td>
                  <div className="admin-acciones">
                    {editandoId === categoria.id ? (
                      <>
                        <button onClick={() => handleGuardarEdicion(categoria.id)} className="admin-btn-accion">
                          Guardar
                        </button>
                        <button onClick={() => setEditandoId(null)} className="admin-btn-cancelar">
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => abrirEditar(categoria)} className="admin-btn-accion">
                          Editar
                        </button>
                        <button onClick={() => handleEliminar(categoria.id)} className="admin-btn-eliminar">
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
    </section>
  )
}

export default Categorias
