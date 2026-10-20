import { useState, useEffect } from 'react'
import './Usuarios.css'

const URL_BASE = 'http://localhost:4002'

function Usuarios({ token }) {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  function cargarUsuarios() {
    setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/usuarios`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudieron cargar los usuarios.')
          setCargando(false)
          return
        }
        return response.json().then((data) => {
          setUsuarios(data)
          setCargando(false)
        })
      })
      .catch((err) => {
        console.error('Error al cargar usuarios', err)
        setError('Error de conexión.')
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  function handleCambiarRol(usuarioId, nuevoRol) {
    fetch(`${URL_BASE}/api/usuarios/${usuarioId}/rol`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role: nuevoRol }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para cambiar el rol.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        cargarUsuarios()
      })
      .catch((err) => { console.error('Error al cambiar rol', err) })
  }

  function handleEliminar(usuarioId) {
    fetch(`${URL_BASE}/api/usuarios/${usuarioId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para eliminar este usuario.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        cargarUsuarios()
      })
      .catch((err) => { console.error('Error al eliminar usuario', err) })
  }

  if (cargando) return <p className="estado-mensaje">Cargando usuarios...</p>
  if (error) return <p className="estado-error">{error}</p>

  return (
    <section>
      <h1 className="admin-titulo">Usuarios</h1>

      <div className="admin-tabla-contenedor">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="admin-td-id">{u.id}</td>
                <td className="admin-td-bold">{u.username}</td>
                <td className="admin-td-muted">{u.email}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleCambiarRol(u.id, e.target.value)}
                    className="admin-select-rol"
                  >
                    <option value="COMPRADOR">COMPRADOR</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleEliminar(u.id)} className="admin-btn-eliminar">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Usuarios
