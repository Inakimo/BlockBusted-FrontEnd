import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { fetchCantidadCarrito } from '../store/carritoSlice'
import { toast } from '../utils/toast.js'

const URL_BASE = 'http://localhost:4002'

function Login() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState(null)
  const [pendiente, setPendiente] = useState(false)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    if (email.trim() === '') { toast('El email es obligatorio'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { toast('El email no es válido'); return }
    if (password.trim() === '') { toast('La contraseña es obligatoria'); return }

    setCargando(true)
    setError(null)
    setPendiente(false)

    fetch(`${URL_BASE}/api/v1/auth/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json()
            .then((data) => {
              if (data.pendiente) {
                setPendiente(true)
              } else {
                setError(data.message || 'Email o contraseña incorrectos')
              }
              setCargando(false)
            })
            .catch(() => {
              setError('Email o contraseña incorrectos')
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
              dispatch(login({ token, usuario }))
              dispatch(fetchCantidadCarrito())
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
    <div className="w-full flex items-center justify-center p-margin-sm">
      <div className="flex flex-col w-full items-center justify-center py-6 px-4 relative overflow-hidden select-none">
        {/* Halftone decorative rings */}
        <div
          className="absolute -top-12 -left-12 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#ffd700 20%, transparent 20%)', backgroundSize: '10px 10px' }}
        ></div>
        <div
          className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full opacity-15 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#e53935 20%, transparent 20%)', backgroundSize: '12px 12px' }}
        ></div>

        {/* Floating comic dialogue bubble */}
        <div className="relative w-full max-w-[460px] flex justify-end -mb-4 z-20 pr-4">
          <div
            className="bg-primary-container text-ink-black font-label-sm text-label-sm px-2.5 py-1 flex items-center gap-1.5 shadow-[3px_3px_0_#000] rotate-3"
            style={{ border: '2px solid #000000', borderRadius: '4px' }}
          >
            <span className="material-symbols-outlined text-label-sm">videocam</span>
            <span>¡CINTAS REBOBINADAS!</span>
          </div>
        </div>

        {/* Main card */}
        <div
          className="relative w-full max-w-[460px] bg-card-surface text-ink-black p-8 sm:p-10 shadow-[6px_6px_0_#000] z-10"
          style={{ border: '4px solid #000000', borderRadius: '12px' }}
        >
          {/* NEW tape corner sticker */}
          <div
            className="absolute -top-3 -left-3 w-10 h-6 bg-cream -rotate-12 shadow-[2px_2px_0_#000] pointer-events-none opacity-90 flex items-center justify-center font-label-sm text-ink-black"
            style={{ border: '2px solid #000000', fontSize: '9px', fontWeight: 900 }}
          >
            NEW
          </div>

          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-5">
            <h1
              className="font-headline-lg text-headline-lg uppercase text-ink-black tracking-wider mt-3 text-center"
              style={{ textShadow: '2px 2px 0px #ffd700' }}
            >
              INICIAR SESIÓN
            </h1>
            <p className="font-body-sm text-body-sm text-muted-gray text-center font-semibold mt-0.5">
              Accede a tu cuenta de BlockBusted
            </p>
          </div>

          {/* Pendiente banner */}
          {pendiente && (
            <div
              className="mb-5 text-ink-black p-4 flex items-start gap-3 shadow-[3px_3px_0_#000] transition-all"
              style={{ backgroundColor: '#fef3c7', border: '3px solid #d97706', borderRadius: '6px' }}
            >
              <span className="material-symbols-outlined shrink-0 text-headline-sm mt-0.5" style={{ color: '#d97706', fontVariationSettings: "'FILL' 1" }}>
                hourglass_empty
              </span>
              <div className="flex-1">
                <p className="font-label-md text-label-md uppercase font-black mb-1" style={{ color: '#92400e' }}>Cuenta pendiente de aprobación</p>
                <p className="font-body-sm text-body-sm font-medium" style={{ color: '#78350f' }}>
                  Tu solicitud de vendedor está esperando que un administrador la apruebe. Una vez aprobada vas a poder ingresar.
                </p>
              </div>
              <button
                type="button"
                className="bg-transparent border-none cursor-pointer p-0.5"
                onClick={() => setPendiente(false)}
                aria-label="Cerrar"
                style={{ color: '#92400e' }}
              >
                <span className="material-symbols-outlined text-label-md">close</span>
              </button>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div
              className="mb-5 bg-secondary-fixed text-ink-black p-3 flex items-center gap-2.5 shadow-[3px_3px_0_#000] transition-all"
              style={{ border: '3px solid #a90111', borderRadius: '6px' }}
            >
              <span className="material-symbols-outlined text-secondary-container shrink-0 text-label-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
              <p className="font-label-md text-label-md leading-snug flex-1">{error}</p>
              <button
                type="button"
                className="text-ink-black bg-transparent border-none cursor-pointer p-0.5"
                onClick={() => setError(null)}
                aria-label="Cerrar alerta"
              >
                <span className="material-symbols-outlined text-label-md">close</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email field */}
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="email"
                className="font-label-sm text-label-sm uppercase tracking-wider text-muted-gray flex items-center justify-between"
              >
                <span>EMAIL</span>
                <span
                  className="font-label-md text-ink-black uppercase bg-cream px-1.5 py-0.5"
                  style={{ border: '1px solid #000000', fontSize: '10px' }}
                >
                  Socio Club
                </span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cinefilo@parodias.com"
                  className="w-full bg-cream text-ink-black font-body-md text-body-md p-3 pl-10 outline-none focus:shadow-[3px_3px_0_#1E88E5] transition-all placeholder:text-muted-gray"
                  style={{ border: '3px solid #000000', borderRadius: '8px' }}
                />
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-muted-gray text-label-lg pointer-events-none">
                  mail
                </span>
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="font-label-sm text-label-sm uppercase tracking-wider text-muted-gray">
                  CONTRASEÑA
                </label>
                <span className="font-label-sm text-label-sm text-muted-gray">¿La olvidaste?</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream text-ink-black font-body-md text-body-md p-3 pl-10 pr-10 outline-none focus:shadow-[3px_3px_0_#1E88E5] transition-all placeholder:text-muted-gray"
                  style={{ border: '3px solid #000000', borderRadius: '8px' }}
                />
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-muted-gray text-label-lg pointer-events-none">
                  lock
                </span>
                <button
                  type="button"
                  aria-label="Ver u ocultar clave"
                  className="absolute right-3 top-3 text-muted-gray bg-transparent border-none cursor-pointer p-0.5"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                >
                  <span className="material-symbols-outlined text-label-lg">
                    {mostrarPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* VHS-PASS stripe */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-label-md text-label-md text-ink-black">Recordar mi tarjeta</span>
              <span className="font-label-sm text-label-sm text-secondary-container font-extrabold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-label-sm">bolt</span>
                VHS-PASS
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-2 bg-primary-container text-ink-black font-headline-md text-headline-md tracking-wider uppercase py-3 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#000] shadow-[4px_4px_0_#000] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: '3px solid #000000', borderRadius: '6px' }}
            >
              <span className="material-symbols-outlined text-headline-md">
                {cargando ? 'sync' : 'movie'}
              </span>
              <span>{cargando ? 'REBOBINANDO...' : 'INGRESAR A LA TIENDA'}</span>
            </button>
          </form>

          {/* Footer registration link */}
          <div className="pt-2 text-center" style={{ borderTop: '1px solid rgba(107,114,128,0.3)' }}>
            <p className="font-body-sm text-body-sm text-muted-gray">
              ¿No tenés cuenta?{' '}
              <Link
                to="/registro"
                className="font-label-md text-label-md underline ml-1 transition-colors"
                style={{ color: '#1E88E5', textUnderlineOffset: '4px', fontWeight: 700 }}
              >
                Registrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom marquee stamp */}
        <div className="mt-6 flex items-center justify-center gap-2 text-on-surface opacity-60 font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-label-sm">local_activity</span>
          <span>BLOCKBUSTED VIDEO RENTAL • EST. 1994 • PARODIA OFICIAL</span>
        </div>
      </div>
    </div>
  )
}

export default Login
