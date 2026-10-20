import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const URL_BASE = 'http://localhost:4002'

function Registro({ onLogin }) {
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('COMPRADOR')
  const [mostrarPassword, setMostrarPassword] = useState(false)
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
    <div className="w-full flex items-center justify-center p-margin-sm">
      <div
        className="flex flex-col w-full items-center justify-center py-6 px-4 relative overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(rgba(255, 215, 0, 0.12) 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}
      >
        {/* Halftone decors */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary-container rounded-full opacity-10 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-12 w-64 h-64 bg-secondary-container rounded-full opacity-15 blur-3xl pointer-events-none"></div>

        {/* Main card */}
        <div
          className="w-full max-w-[480px] bg-card-surface text-ink-black relative z-10 p-8 sm:p-9 shadow-[6px_6px_0px_#000000]"
          style={{ border: '4px solid #000000', borderRadius: '12px' }}
        >
          {/* Sticker badge */}
          <div className="absolute -top-4 right-4 sm:-top-5 sm:right-6 transform rotate-3 hover:rotate-0 transition-transform cursor-default z-20">
            <div
              className="bg-primary-container text-ink-black font-label-sm tracking-wider uppercase px-3 py-1.5 shadow-[3px_3px_0px_#000000] flex items-center gap-1.5"
              style={{ border: '2px solid #000000' }}
            >
              <span className="material-symbols-outlined text-label-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_activity</span>
              <span>¡UNITE AL CLUB DEL CELULOIDE!</span>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col items-center text-center mt-1 mb-5">
            <h1 className="font-headline-lg text-headline-lg uppercase tracking-wide text-ink-black mt-2 drop-shadow-[2px_2px_0px_#FFD700]">
              Crear cuenta
            </h1>
            <p className="font-body-sm text-body-sm text-muted-gray mt-1 max-w-xs font-semibold leading-snug">
              Comenzá a alquilar y coleccionar las mejores parodias
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="mb-5 bg-secondary-fixed text-ink-black p-3 flex items-start gap-3 shadow-[3px_3px_0px_#000000] transition-all"
              style={{ border: '3px solid #E53935', borderRadius: '4px' }}
            >
              <span className="material-symbols-outlined text-secondary-container text-headline-sm shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <div className="flex-1">
                <p className="font-label-md text-label-md text-secondary-container leading-none uppercase">¡Oops! Error en la cinta</p>
                <p className="font-body-sm text-body-sm text-ink-black mt-0.5 font-medium">{error}</p>
              </div>
              <button
                aria-label="Cerrar alerta"
                className="text-ink-black hover:text-secondary-container p-0.5 bg-transparent border-none cursor-pointer"
                onClick={() => setError(null)}
                type="button"
              >
                <span className="material-symbols-outlined text-label-md">close</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="flex flex-col text-left">
              <label className="font-label-md text-label-md uppercase text-ink-black mb-1 flex items-center justify-between" htmlFor="username">
                <span>Nombre de usuario</span>
                <span className="font-label-sm text-label-sm text-muted-gray">Único</span>
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="mi_usuario"
                  className="w-full bg-card-surface font-body-md text-body-md text-ink-black placeholder:text-muted-gray px-3.5 py-2.5 transition-all outline-none focus:shadow-[3px_3px_0px_#1E88E5]"
                  style={{ border: '3px solid #000000', borderRadius: '4px' }}
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-muted-gray text-label-lg pointer-events-none">
                  alternate_email
                </span>
              </div>
            </div>

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col text-left">
                <label className="font-label-md text-label-md uppercase text-ink-black mb-1" htmlFor="firstname">
                  Nombre
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Juan"
                  className="w-full bg-card-surface font-body-md text-body-md text-ink-black placeholder:text-muted-gray px-3 py-2.5 transition-all outline-none focus:shadow-[3px_3px_0px_#1E88E5]"
                  style={{ border: '3px solid #000000', borderRadius: '4px' }}
                />
              </div>
              <div className="flex flex-col text-left">
                <label className="font-label-md text-label-md uppercase text-ink-black mb-1" htmlFor="lastname">
                  Apellido
                </label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Pérez"
                  className="w-full bg-card-surface font-body-md text-body-md text-ink-black placeholder:text-muted-gray px-3 py-2.5 transition-all outline-none focus:shadow-[3px_3px_0px_#1E88E5]"
                  style={{ border: '3px solid #000000', borderRadius: '4px' }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col text-left">
              <label className="font-label-md text-label-md uppercase text-ink-black mb-1" htmlFor="email">
                Email de socio
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-card-surface font-body-md text-body-md text-ink-black placeholder:text-muted-gray px-3.5 py-2.5 transition-all outline-none focus:shadow-[3px_3px_0px_#1E88E5]"
                  style={{ border: '3px solid #000000', borderRadius: '4px' }}
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-muted-gray text-label-lg pointer-events-none">
                  mail
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col text-left">
              <label className="font-label-md text-label-md uppercase text-ink-black mb-1" htmlFor="password">
                Contraseña secreta
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-card-surface font-body-md text-body-md text-ink-black placeholder:text-muted-gray px-3.5 py-2.5 pr-10 transition-all outline-none focus:shadow-[3px_3px_0px_#1E88E5]"
                  style={{ border: '3px solid #000000', borderRadius: '4px' }}
                />
                <button
                  aria-label="Ver u ocultar contraseña"
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-2.5 text-muted-gray hover:text-ink-black bg-transparent border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-label-lg">
                    {mostrarPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Role select */}
            <div className="flex flex-col text-left">
              <label className="font-label-md text-label-md uppercase text-ink-black mb-1" htmlFor="role">
                Tipo de credencial
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-cream font-body-md text-body-md text-ink-black px-3.5 py-2.5 appearance-none cursor-pointer outline-none transition-all focus:shadow-[3px_3px_0px_#1E88E5]"
                  style={{ border: '3px solid #000000', borderRadius: '4px' }}
                >
                  <option value="COMPRADOR">Comprador (Quiero alquilar y comprar)</option>
                  <option value="VENDEDOR">Vendedor (Quiero publicar parodias)</option>
                </select>
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none bg-primary-container"
                  style={{ borderLeft: '3px solid #000000' }}
                >
                  <span className="material-symbols-outlined text-ink-black text-headline-sm font-bold">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>

            {/* CTA button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-primary-container text-ink-black font-headline-md text-headline-md tracking-wider uppercase py-3 px-6 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000000] shadow-[4px_4px_0px_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: '3px solid #000000', borderRadius: '4px' }}
              >
                <span className="material-symbols-outlined text-headline-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                  badge
                </span>
                <span>{cargando ? 'Registrando...' : 'Crear cuenta'}</span>
              </button>
            </div>
          </form>

          {/* Separator + login link */}
          <div
            className="mt-6 pt-5 flex flex-col items-center justify-center text-center relative"
            style={{ borderTop: '2px dashed #000000' }}
          >
            <div className="absolute -top-3.5 bg-card-surface px-2">
              <span className="material-symbols-outlined text-primary-container text-label-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                movie
              </span>
            </div>
            <p className="font-body-md text-body-md text-ink-black font-medium">
              ¿Ya tenés cuenta?{' '}
              <Link
                to="/login"
                className="font-label-lg text-label-lg uppercase tracking-wide underline ml-1 hover:text-ink-black transition-colors"
                style={{ color: '#1E88E5', textDecorationColor: '#1E88E5', textUnderlineOffset: '3px' }}
              >
                Iniciá sesión
              </Link>
            </p>
            <div className="mt-4 flex items-center gap-2 text-muted-gray font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-label-sm">verified_user</span>
              <span>VHS 100% LIBRE DE MULTAS POR DEMORA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registro
