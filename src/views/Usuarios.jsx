import { useState, useEffect } from 'react'

const URL_BASE = 'http://localhost:4002'

function Usuarios({ token }) {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  function cargarUsuarios() {
    if (usuarios.length === 0) setCargando(true)
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

  if (cargando && usuarios.length === 0) return <p className="text-center text-cream font-body-lg text-body-lg py-space-xl">Cargando usuarios...</p>
  if (error) return <p className="text-center text-secondary-container font-body-lg text-body-lg py-space-xl">{error}</p>

  const totalAdmins = usuarios.filter((u) => u.role === 'ADMIN').length
  const totalVendedores = usuarios.filter((u) => u.role === 'VENDEDOR').length
  const totalCompradores = usuarios.filter((u) => u.role === 'COMPRADOR').length

  return (
    <section className="max-w-7xl mx-auto px-margin-sm md:px-margin py-space-lg md:py-space-xl w-full flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-sm border-b-4 border-ink-black relative">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="bg-secondary-container text-cream px-space-sm py-[2px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] font-label-sm text-label-sm uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-body-sm" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
              ADMINISTRACIÓN DE SOCIOS Y PERFILES
            </span>
            <span className="bg-primary-container text-ink-black px-space-sm py-[2px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] font-label-sm text-label-sm font-bold uppercase tracking-widest hidden sm:inline-block">
              LIBRO DE REGISTRO #1989
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-cream tracking-wide drop-shadow-[4px_4px_0px_#000000] uppercase select-none">
            USUARIOS
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Directorio general de usuarios registrados, roles y membresías de videoclub. Modificá permisos o cancelá carnets de socio en tiempo real.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-card-surface p-space-md border-2 border-ink-black shadow-[4px_4px_0px_#000000] flex items-center justify-between relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] transition-all">
          <div>
            <span className="font-label-sm text-label-sm text-muted-gray uppercase tracking-widest block font-bold">TOTAL SOCIOS</span>
            <span className="font-display-lg text-display-lg text-ink-black tracking-wide leading-none">{usuarios.length}</span>
            <div className="flex items-center gap-1 text-on-tertiary-container font-label-sm text-label-sm mt-1">
              <span className="material-symbols-outlined text-[16px]">groups</span>
              <span>Socios activos</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-tertiary-container border-2 border-ink-black shadow-[2px_2px_0px_#000000] flex items-center justify-center text-ink-black">
            <span className="material-symbols-outlined text-headline-lg" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
          </div>
        </div>

        <div className="bg-card-surface p-space-md border-2 border-ink-black shadow-[4px_4px_0px_#000000] flex items-center justify-between relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] transition-all">
          <div>
            <span className="font-label-sm text-label-sm text-muted-gray uppercase tracking-widest block font-bold">VENDEDORES ACTIVOS</span>
            <span className="font-display-lg text-display-lg text-secondary-container tracking-wide leading-none">{totalVendedores}</span>
            <div className="flex items-center gap-1 text-secondary-container font-label-sm text-label-sm mt-1 font-bold">
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Con stock VHS</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-primary-container border-2 border-ink-black shadow-[2px_2px_0px_#000000] flex items-center justify-center text-ink-black">
            <span className="material-symbols-outlined text-headline-lg" style={{ fontVariationSettings: "'FILL' 1" }}>point_of_sale</span>
          </div>
        </div>

        <div className="bg-card-surface p-space-md border-2 border-ink-black shadow-[4px_4px_0px_#000000] flex items-center justify-between relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] transition-all">
          <div>
            <span className="font-label-sm text-label-sm text-muted-gray uppercase tracking-widest block font-bold">ADMINISTRADORES</span>
            <span className="font-display-lg text-display-lg text-ink-black tracking-wide leading-none">{totalAdmins}</span>
            <div className="flex items-center gap-1 text-on-tertiary-container font-label-sm text-label-sm mt-1 font-bold">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Acceso Nivel Bóveda</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-secondary-container border-2 border-ink-black shadow-[2px_2px_0px_#000000] flex items-center justify-center text-cream">
            <span className="material-symbols-outlined text-headline-lg" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-card-surface border-2 border-ink-black shadow-[6px_6px_0px_#000000] rounded-xl overflow-hidden flex flex-col">
        <div className="p-space-md bg-cream border-b-2 border-ink-black flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-ink-black text-headline-sm">groups</span>
            <span className="font-label-md text-label-md text-ink-black font-bold uppercase">
              Mostrando <span className="text-secondary-container font-black">{usuarios.length}</span> socios registrados
            </span>
          </div>
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="bg-card-surface text-ink-black font-label-sm text-label-sm px-space-sm py-[6px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase font-bold">ADMIN ({totalAdmins})</span>
            <span className="bg-card-surface text-ink-black font-label-sm text-label-sm px-space-sm py-[6px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase font-bold">VENDEDOR ({totalVendedores})</span>
            <span className="bg-card-surface text-ink-black font-label-sm text-label-sm px-space-sm py-[6px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase font-bold">COMPRADOR ({totalCompradores})</span>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink-black text-cream border-b-2 border-ink-black">
                <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider w-16 text-center text-primary-container">#</th>
                <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider">USUARIO</th>
                <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider">EMAIL</th>
                <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider">NOMBRE Y APELLIDO</th>
                <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider">ROL ASIGNADO</th>
                <th className="py-space-sm px-space-md font-headline-sm text-headline-sm tracking-wider text-right pr-space-lg">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink-black text-ink-black font-body-md text-body-md">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-cream/70 transition-colors">
                  <td className="py-space-md px-space-md font-label-lg text-label-lg font-bold text-center bg-cream/40">#{u.id}</td>
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-lg text-label-lg font-bold text-ink-black">{u.username}</span>
                      {u.role === 'ADMIN' && (
                        <span className="bg-primary-container text-ink-black px-space-xs py-[1px] border border-ink-black shadow-[1px_1px_0px_#000000] font-label-sm text-[10px] font-black uppercase flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                          VIP ADMIN
                        </span>
                      )}
                      {u.role === 'VENDEDOR' && (
                        <span className="bg-tertiary-container text-ink-black px-space-xs py-[1px] border border-ink-black font-label-sm text-[10px] font-black uppercase">
                          PRO
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-space-md px-space-md font-body-sm text-body-sm text-muted-gray font-semibold">
                    {u.email}
                  </td>
                  <td className="py-space-md px-space-md font-body-md text-body-md font-bold text-ink-black">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="inline-block relative">
                      <select
                        value={u.role}
                        onChange={(e) => handleCambiarRol(u.id, e.target.value)}
                        className={`appearance-none ${u.role === 'ADMIN' ? 'bg-primary-container' : 'bg-card-surface'} text-ink-black font-label-md text-label-md pl-3 pr-8 py-1.5 border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase font-bold cursor-pointer focus:outline-none focus:shadow-[3px_3px_0px_#0061a9]`}
                      >
                        <option value="COMPRADOR">COMPRADOR</option>
                        <option value="VENDEDOR">VENDEDOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-black text-body-md">arrow_drop_down</span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md text-right pr-space-lg">
                    <button
                      type="button"
                      onClick={() => handleEliminar(u.id)}
                      className="bg-card-surface text-secondary-container hover:bg-secondary-container hover:text-cream font-label-sm text-label-sm px-space-sm py-[6px] border-2 border-secondary-container shadow-[2px_2px_0px_#000000] hover:shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] uppercase font-bold transition-all inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-space-md bg-cream border-t-2 border-ink-black flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-[2px] h-8 bg-card-surface px-2 py-1 border border-ink-black shadow-[1px_1px_0px_#000000] select-none">
              <div className="w-[2px] h-full bg-ink-black"></div>
              <div className="w-[4px] h-full bg-ink-black"></div>
              <div className="w-[1px] h-full bg-ink-black"></div>
              <div className="w-[3px] h-full bg-ink-black"></div>
              <div className="w-[1px] h-full bg-ink-black"></div>
              <div className="w-[2px] h-full bg-ink-black"></div>
              <div className="w-[5px] h-full bg-ink-black"></div>
              <div className="w-[1px] h-full bg-ink-black"></div>
              <div className="w-[3px] h-full bg-ink-black"></div>
              <div className="w-[2px] h-full bg-ink-black"></div>
            </div>
            <span className="font-label-md text-label-md text-ink-black font-bold uppercase">
              Total: <span className="text-secondary-container font-black">{usuarios.length}</span> socios
            </span>
          </div>
        </div>
      </div>

      {/* Bulletin box */}
      <div className="p-space-md bg-surface-container-high border-2 border-ink-black shadow-[4px_4px_0px_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="bg-primary-container p-2 border-2 border-ink-black shadow-[2px_2px_0px_#000000] shrink-0">
            <span className="material-symbols-outlined text-headline-md text-ink-black">info</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-cream uppercase">Protocolo de Roles del Videoclub</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Los socios con rol <strong>VENDEDOR</strong> poseen acceso a carga de catálogos y modificación de stocks. Los <strong>ADMINS</strong> pueden desincorporar cuentas y reasignar privilegios en todas las sucursales.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Usuarios
