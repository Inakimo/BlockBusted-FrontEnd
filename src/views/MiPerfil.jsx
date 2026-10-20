import { useState } from 'react'
import './Formulario.css'

const URL_BASE = 'http://localhost:4002'

function MiPerfil({ token, usuario, onActualizarUsuario }) {
  const [username, setUsername] = useState(usuario ? usuario.username : '')
  const [firstName, setFirstName] = useState(usuario ? usuario.firstName : '')
  const [lastName, setLastName] = useState(usuario ? usuario.lastName : '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()

    if (username.trim() === '') { alert('El nombre de usuario es obligatorio'); return }
    if (firstName.trim() === '') { alert('El nombre es obligatorio'); return }
    if (lastName.trim() === '') { alert('El apellido es obligatorio'); return }

    setGuardando(true)
    setError(null)
    setExito(false)

    fetch(`${URL_BASE}/api/usuarios/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ username, firstName, lastName }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            setError(data.message || 'No se pudo actualizar el perfil.')
            setGuardando(false)
          })
        }
        return response.json().then((data) => {
          onActualizarUsuario(data)
          setExito(true)
          setGuardando(false)
        })
      })
      .catch((err) => {
        console.error('Error al actualizar perfil', err)
        setError('Error de conexión.')
        setGuardando(false)
      })
  }

  if (!usuario) return <p className="estado-mensaje">No estás logueado.</p>

  return (
    <div className="form-contenedor">
      <div className="form-card">
        <h1 className="form-titulo">Mi perfil</h1>

        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ color: '#808080', fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}>Email</p>
          <p style={{ color: '#e5e5e5', margin: 0 }}>{usuario.email}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#808080', fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}>Rol</p>
          <p style={{ color: '#e5e5e5', margin: 0 }}>{usuario.role}</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        {exito && (
          <div style={{
            background: '#1a3a1a', color: '#4caf50', border: '1px solid #2d5a2d',
            borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem'
          }}>
            Perfil actualizado correctamente.
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-cuerpo">
          <div className="form-campo">
            <label htmlFor="username" className="form-label">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-fila">
            <div className="form-campo">
              <label htmlFor="firstName" className="form-label">Nombre</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-campo">
              <label htmlFor="lastName" className="form-label">Apellido</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={guardando} className="form-btn-primario">
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MiPerfil
