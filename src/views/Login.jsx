import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Formulario.css'

const URL_BASE = 'http://localhost:4002'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    if (email.trim() === '') { alert('El email es obligatorio'); return }
    if (password.trim() === '') { alert('La contraseña es obligatoria'); return }

    setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/v1/auth/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            setError(data.message || 'Email o contraseña incorrectos')
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
        console.error('Error al iniciar sesión', err)
        setError('Error de conexión. Intentá de nuevo.')
        setCargando(false)
      })
  }

  return (
    <div className="form-contenedor">
      <div className="form-card">
        <h1 className="form-titulo">Iniciar sesión</h1>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-cuerpo">
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

          <button type="submit" disabled={cargando} className="form-btn-primario">
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="form-pie">
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="form-link">Registrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
