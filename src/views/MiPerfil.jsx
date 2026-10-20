import { useState } from 'react'

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

  if (!usuario) {
    return (
      <div className="w-full flex items-center justify-center p-margin-sm">
        <p className="font-headline-md text-headline-md uppercase text-cream">No estás logueado.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full py-space-xl px-margin-sm md:px-margin flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-secondary-container opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-16 w-80 h-80 rounded-full bg-primary-container opacity-20 blur-3xl pointer-events-none"></div>

      <div
        className="relative w-full max-w-[580px] bg-card-surface text-ink-black p-6 sm:p-10 z-10 shadow-[6px_6px_0px_#000000]"
        style={{ border: '4px solid #000000', borderRadius: '12px' }}
      >
        {/* Sticker */}
        <div className="absolute -top-4 -right-2 sm:-right-4 z-20 transition-transform hover:rotate-0" style={{ transform: 'rotate(-3deg)' }}>
          <div
            className="bg-primary-container text-ink-black font-label-sm text-label-sm tracking-wider uppercase px-3 py-1 shadow-[3px_3px_0px_#000000] flex items-center gap-1"
            style={{ border: '2.5px solid #000000' }}
          >
            <span className="material-symbols-outlined text-label-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            SOCIO FUNDADOR CLUB VHS
          </div>
        </div>

        {/* Header */}
        <div className="pb-space-md mb-space-lg flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm" style={{ borderBottom: '3px solid #000000' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-3 h-3 bg-secondary-container" style={{ border: '1px solid #000000' }}></span>
              <span className="font-label-sm text-label-sm tracking-widest text-muted-gray uppercase">TARJETA DE CLIENTE #{usuario.id}</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg tracking-wide uppercase leading-none text-ink-black drop-shadow-[2px_2px_0px_#ffd700]">
              Mi perfil
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm tracking-tight text-ink-black bg-cream px-2 py-0.5 shadow-[1px_1px_0px_#000000]" style={{ border: '1px solid #000000' }}>EDICIÓN 1994</span>
          </div>
        </div>

        {/* Success banner */}
        {exito && (
          <div
            className="mb-space-lg bg-[#d1fae5] text-ink-black p-3 shadow-[3px_3px_0px_#000000] flex items-center justify-between gap-3"
            style={{ border: '3px solid #10b981', borderRadius: '4px' }}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#059669] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-label-md text-label-md">Perfil actualizado correctamente</span>
            </div>
            <button
              aria-label="Cerrar notificación"
              type="button"
              onClick={() => setExito(false)}
              className="text-ink-black hover:opacity-70 flex items-center bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">close</span>
            </button>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div
            className="mb-space-lg bg-secondary-fixed text-ink-black p-3 shadow-[3px_3px_0px_#000000] flex items-start gap-3"
            style={{ border: '3px solid #E53935', borderRadius: '4px' }}
          >
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div className="flex-1">
              <p className="font-label-md text-label-md text-secondary-container uppercase leading-none">¡Oops! Error en la cinta</p>
              <p className="font-body-sm text-body-sm text-ink-black mt-0.5 font-medium">{error}</p>
            </div>
            <button
              aria-label="Cerrar alerta"
              type="button"
              onClick={() => setError(null)}
              className="text-ink-black hover:text-secondary-container bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-label-md">close</span>
            </button>
          </div>
        )}

        {/* Dossier */}
        <div className="bg-cream p-4 shadow-[3px_3px_0px_#000000] mb-space-lg space-y-3" style={{ border: '3px solid #000000', borderRadius: '4px' }}>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2" style={{ borderBottom: '2px solid rgba(0,0,0,0.2)' }}>
            <span className="font-label-sm text-label-sm tracking-wider text-muted-gray uppercase">TIPO DE MEMBRESÍA</span>
            <div className="flex items-center gap-1.5 bg-primary-container text-ink-black font-label-sm text-label-sm px-3 py-0.5 shadow-[2px_2px_0px_#000000]" style={{ border: '2px solid #000000', borderRadius: '9999px' }}>
              <span className="material-symbols-outlined text-label-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              {usuario.role}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 text-muted-gray">
              <span className="material-symbols-outlined text-label-lg">lock</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Correo Registrado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md text-ink-black font-mono">{usuario.email}</span>
              <span className="font-label-sm text-[10px] uppercase bg-surface-container-highest text-cream px-1.5 py-0.5" style={{ border: '1px solid #000000', borderRadius: '2px' }}>Fijo</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-space-md">
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm tracking-wider text-ink-black uppercase" htmlFor="usernameInput">
              Nombre de Usuario
            </label>
            <div className="relative">
              <input
                id="usernameInput"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-3.5 py-2.5 shadow-[2px_2px_0px_#000000] focus:outline-none focus:shadow-[4px_4px_0px_#1E88E5] transition-all"
                style={{ border: '3px solid #000000', borderRadius: '4px' }}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-gray text-label-lg pointer-events-none">badge</span>
            </div>
            <p className="font-body-sm text-[12px] text-muted-gray">Tu seudónimo en reseñas de VHS y alquileres del videoclub.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm tracking-wider text-ink-black uppercase" htmlFor="firstNameInput">
                Nombre
              </label>
              <input
                id="firstNameInput"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-3.5 py-2.5 shadow-[2px_2px_0px_#000000] focus:outline-none focus:shadow-[4px_4px_0px_#1E88E5] transition-all"
                style={{ border: '3px solid #000000', borderRadius: '4px' }}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm tracking-wider text-ink-black uppercase" htmlFor="lastNameInput">
                Apellido
              </label>
              <input
                id="lastNameInput"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-3.5 py-2.5 shadow-[2px_2px_0px_#000000] focus:outline-none focus:shadow-[4px_4px_0px_#1E88E5] transition-all"
                style={{ border: '3px solid #000000', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div className="pt-space-xs">
            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-primary-container text-ink-black font-headline-md text-headline-md py-2.5 px-space-md shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000000] transition-all tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: '3px solid #000000', borderRadius: '4px' }}
            >
              <span className="material-symbols-outlined text-headline-md">save</span>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>

        {/* Barcode */}
        <div className="mt-space-md flex flex-col items-center justify-center opacity-80">
          <div className="flex items-end gap-[3px] h-8">
            <span className="w-[2px] h-full bg-ink-black"></span>
            <span className="w-[1px] h-full bg-ink-black"></span>
            <span className="w-[4px] h-full bg-ink-black"></span>
            <span className="w-[2px] h-full bg-ink-black"></span>
            <span className="w-[5px] h-full bg-ink-black"></span>
            <span className="w-[1px] h-full bg-ink-black"></span>
            <span className="w-[3px] h-full bg-ink-black"></span>
            <span className="w-[2px] h-full bg-ink-black"></span>
            <span className="w-[6px] h-full bg-ink-black"></span>
            <span className="w-[2px] h-full bg-ink-black"></span>
            <span className="w-[1px] h-full bg-ink-black"></span>
            <span className="w-[3px] h-full bg-ink-black"></span>
            <span className="w-[4px] h-full bg-ink-black"></span>
            <span className="w-[1px] h-full bg-ink-black"></span>
            <span className="w-[3px] h-full bg-ink-black"></span>
            <span className="w-[5px] h-full bg-ink-black"></span>
            <span className="w-[2px] h-full bg-ink-black"></span>
          </div>
          <span className="font-label-sm text-[10px] tracking-widest text-ink-black mt-1">BB-8910-VIP-ES</span>
        </div>
      </div>
    </div>
  )
}

export default MiPerfil
