import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Formulario.css'

const URL_BASE = 'http://localhost:4002'

function Registro({ onLogin }) {
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('COMPRADOR')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    if (username.trim() === '') { alert('El nombre de usuario es obligatorio'); return }
    if (firstname.trim() === '') { alert('El nombre es obligatorio'); return }
    if (lastname.trim() === '') { alert('El apellido es obligatorio'); return }
    if (email.trim() === '') { alert('El email es obligatorio'); return }
    if (password.trim() === '') { alert('La contraseña es obligatoria'); return }

    setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, firstname, lastname, email, password, role }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            setError(data.message || 'Error al registrarse')
            setCargando(false)
          })
        }
        return response.json().then((data) => {
          const token = data.access_token

          fetch(`${URL_BASE}/api/usuarios/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((usuario) => {
              onLogin(token, usuario)
              navigate('/')
            })
            .catch((err) => {
              console.error('Error al obtener usuario', err)
              setError('No se pudo obtener el perfil del usuario')
              setCargando(false)
            })
        })
      })
      .catch((err) => {
        console.error('Error al registrarse', err)
        setError('Error de conexión. Intentá de nuevo.')
        setCargando(false)
      })
  }

  return (
    <div className="form-contenedor">
      <div className="form-card">
        <h1 className="form-titulo">Crear cuenta</h1>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-cuerpo">
          <div className="form-campo">
            <label htmlFor="username" className="form-label">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="mi_usuario"
            />
          </div>

          <div className="form-fila">
            <div className="form-campo">
              <label htmlFor="firstname" className="form-label">Nombre</label>
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="form-input"
                placeholder="Juan"
              />
            </div>

            <div className="form-campo">
              <label htmlFor="lastname" className="form-label">Apellido</label>
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="form-input"
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="form-campo">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-campo">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-campo">
            <label htmlFor="role" className="form-label">Tipo de cuenta</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            >
              <option value="COMPRADOR">Comprador</option>
              <option value="VENDEDOR">Vendedor</option>
            </select>
          </div>

          <button type="submit" disabled={cargando} className="form-btn-primario">
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="form-pie">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="form-link">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Registro
