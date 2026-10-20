import { useState, useEffect } from 'react'

const URL_BASE = 'http://localhost:4002'

function OrdenesAdmin({ token }) {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${URL_BASE}/api/admin/ordenes`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudieron cargar las órdenes.')
          setCargando(false)
          return
        }
        return response.json().then((data) => {
          setOrdenes(data)
          setCargando(false)
        })
      })
      .catch((err) => {
        console.error('Error al cargar órdenes', err)
        setError('Error de conexión.')
        setCargando(false)
      })
  }, [])

  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr)
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const anio = fecha.getFullYear()
    return `${dia}/${mes}/${anio}`
  }

  if (cargando) return <p className="text-center text-cream font-body-lg text-body-lg py-space-xl">Cargando órdenes...</p>
  if (error) return <p className="text-center text-secondary-container font-body-lg text-body-lg py-space-xl">{error}</p>

  const totalConfirmadas = ordenes.filter((o) => !o.estado || o.estado === 'CONFIRMADA').length
  const totalCanceladas = ordenes.filter((o) => o.estado === 'CANCELADA').length

  return (
    <section className="max-w-7xl mx-auto w-full px-margin-sm md:px-margin py-space-lg flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b-4 border-ink-black pb-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-space-xs flex-wrap">
            <span className="bg-primary-container text-ink-black font-label-sm text-label-sm px-space-xs py-[2px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              SISTEMA CENTRAL DE AUDITORÍA
            </span>
            <span className="bg-secondary-container text-cream font-label-sm text-label-sm px-space-xs py-[2px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase tracking-widest hidden sm:inline-block">
              TERMINAL ADMIN #4
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-cream tracking-wide uppercase drop-shadow-[3px_3px_0px_#000000] m-0 leading-none">
            TODAS LAS ÓRDENES
          </h1>
          <div className="inline-block self-start bg-surface-container-high text-on-surface-variant font-label-md text-label-md px-space-sm py-[3px] border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase tracking-wider">
            📼 MONITOR GENERAL DE VENTAS Y ALQUILERES DE CINTAS
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-card-surface border-[3px] border-ink-black shadow-[4px_4px_0px_#000000] p-space-md relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-primary-container border-2 border-ink-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_#000000] opacity-80 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-ink-black text-[28px]">receipt_long</span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-muted-gray mb-space-xs">Total de Órdenes</div>
            <div className="font-headline-lg text-headline-lg text-secondary-container tracking-wider">{ordenes.length} <span className="font-body-sm text-body-sm text-ink-black uppercase">Tickets</span></div>
          </div>
          <div className="mt-space-sm pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between text-ink-black">
            <span className="font-label-sm text-label-sm uppercase font-bold text-on-tertiary-container">Registro general</span>
            <span className="font-label-sm text-label-sm bg-primary-container px-space-xs py-[1px] border border-ink-black">ACTIVO</span>
          </div>
        </div>

        <div className="bg-card-surface border-[3px] border-ink-black shadow-[4px_4px_0px_#000000] p-space-md relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-tertiary-container border-2 border-ink-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_#000000] opacity-80 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-ink-black text-[28px]">check_circle</span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-muted-gray mb-space-xs">Confirmadas</div>
            <div className="font-headline-lg text-headline-lg text-ink-black tracking-wider">{totalConfirmadas} <span className="font-body-sm text-body-sm text-muted-gray uppercase">Ok</span></div>
          </div>
          <div className="mt-space-sm pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-muted-gray font-bold">En curso</span>
            <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed-variant px-space-xs py-[1px] border border-ink-black">STOCK OK</span>
          </div>
        </div>

        <div className="bg-card-surface border-[3px] border-ink-black shadow-[4px_4px_0px_#000000] p-space-md relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-cream border-2 border-ink-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_#000000] opacity-80 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-secondary-container text-[28px]">cancel</span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-muted-gray mb-space-xs">Canceladas</div>
            <div className="font-headline-lg text-headline-lg text-ink-black tracking-wider">{totalCanceladas} <span className="font-body-sm text-body-sm text-muted-gray uppercase">Reversas</span></div>
          </div>
          <div className="mt-space-sm pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-secondary-container font-bold">Anuladas</span>
            <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-container px-space-xs py-[1px] border border-ink-black">REEMBOLSO</span>
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      {ordenes.length === 0 ? (
        <div className="bg-card-surface border-[3px] border-ink-black shadow-[6px_6px_0px_#000000] p-space-xl text-center flex flex-col items-center justify-center gap-space-md">
          <div className="w-20 h-20 bg-secondary-container text-cream border-2 border-ink-black shadow-[3px_3px_0px_#000000] flex items-center justify-center rounded-full">
            <span className="material-symbols-outlined text-[42px]">sentiment_dissatisfied</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg text-ink-black uppercase tracking-wider m-0">¡NO HAY ÓRDENES REGISTRADAS!</h2>
            <p className="font-body-md text-body-md text-muted-gray mt-space-xs">Todavía no se registraron tickets en la terminal.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-space-lg">
          {ordenes.map((orden) => {
            const esConfirmada = !orden.estado || orden.estado === 'CONFIRMADA'
            return (
              <div
                key={orden.id}
                className="bg-card-surface border-[3px] border-ink-black shadow-[5px_5px_0px_#000000] overflow-hidden transition-transform duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000000]"
              >
                {/* Header */}
                <div className="bg-surface-container-lowest text-cream p-space-md border-b-[3px] border-ink-black flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <span className="font-headline-md text-headline-md text-primary-container tracking-wider drop-shadow-[1px_1px_0px_#000000]">
                      ORDEN #{orden.id}
                    </span>
                    <span className="text-on-surface-variant font-label-md text-label-md">·</span>
                    <span className="bg-surface-container-high px-space-xs py-[2px] font-label-sm text-label-sm text-cream border border-ink-black uppercase">
                      📅 {formatearFecha(orden.fecha)}
                    </span>
                    {orden.usuario && (
                      <>
                        <span className="text-on-surface-variant font-label-md text-label-md">·</span>
                        <div className="flex items-center gap-1 font-label-md text-label-md text-cream">
                          <span className="text-muted-gray uppercase font-bold">Cliente:</span>
                          <span className="text-primary-container underline decoration-secondary font-bold">{orden.usuario.username}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-space-md flex-wrap">
                    {esConfirmada ? (
                      <div className="bg-[#10b981] text-ink-black font-label-sm text-label-sm font-extrabold px-space-sm py-[4px] border-[2px] border-ink-black shadow-[2px_2px_0px_#000000] flex items-center gap-1 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
                        CONFIRMADA
                      </div>
                    ) : (
                      <div className="bg-secondary-container text-cream font-label-sm text-label-sm font-extrabold px-space-sm py-[4px] border-[2px] border-ink-black shadow-[2px_2px_0px_#000000] flex items-center gap-1 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px] font-bold">cancel</span>
                        CANCELADA
                      </div>
                    )}
                    <div className={
                      esConfirmada
                        ? 'bg-secondary-container text-cream font-headline-sm text-headline-sm px-space-md py-[4px] border-[2px] border-ink-black shadow-[3px_3px_0px_#000000] uppercase tracking-wider'
                        : 'bg-surface-container-high text-secondary font-headline-sm text-headline-sm px-space-md py-[4px] border-[2px] border-ink-black shadow-[3px_3px_0px_#000000] uppercase tracking-wider line-through decoration-secondary-container decoration-4'
                    }>
                      TOTAL: ${orden.total}
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className={`p-space-md flex flex-col gap-space-md ${!esConfirmada ? 'opacity-90' : ''}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border-[2px] border-ink-black">
                      <thead>
                        <tr className="bg-cream text-ink-black border-b-[2px] border-ink-black font-label-sm text-label-sm uppercase tracking-wider">
                          <th className="py-space-xs px-space-sm border-r-2 border-ink-black">Película / Título VHS</th>
                          <th className="py-space-xs px-space-sm border-r-2 border-ink-black text-center w-24">Cant.</th>
                          <th className="py-space-xs px-space-sm border-r-2 border-ink-black text-right w-32">Precio Unit.</th>
                          <th className={`py-space-xs px-space-sm text-right w-32 ${esConfirmada ? 'bg-primary-container' : 'bg-gray-200'}`}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-body-sm text-ink-black divide-y-2 divide-ink-black">
                        {orden.detalles.map((detalle) => (
                          <tr key={detalle.id} className={!esConfirmada ? 'bg-gray-50' : 'hover:bg-yellow-50 transition-colors'}>
                            <td className={`py-space-xs px-space-sm border-r-2 border-ink-black font-bold flex items-center gap-space-xs ${!esConfirmada ? 'line-through text-muted-gray' : ''}`}>
                              <span className={`w-3 h-3 inline-block border border-ink-black ${!esConfirmada ? 'bg-muted-gray' : 'bg-secondary-container'}`}></span>
                              <span className="font-headline-sm text-headline-sm tracking-wide">
                                {detalle.pelicula && detalle.pelicula.titulo}
                              </span>
                            </td>
                            <td className={`py-space-xs px-space-sm border-r-2 border-ink-black text-center font-bold ${!esConfirmada ? 'text-muted-gray' : ''}`}>
                              {detalle.cantidad}
                            </td>
                            <td className={`py-space-xs px-space-sm border-r-2 border-ink-black text-right font-medium ${!esConfirmada ? 'text-muted-gray' : ''}`}>
                              ${detalle.precioUnitario}
                            </td>
                            <td className={`py-space-xs px-space-sm text-right font-bold ${!esConfirmada ? 'text-muted-gray' : 'text-secondary-container'}`}>
                              ${detalle.precioUnitario * detalle.cantidad}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!esConfirmada && (
                    <div className="bg-secondary-fixed text-on-secondary-fixed border-[3px] border-secondary-container shadow-[3px_3px_0px_#000000] p-space-sm flex items-center gap-space-sm">
                      <div className="p-space-xs bg-secondary-container text-cream border-2 border-ink-black shadow-[1px_1px_0px_#000000]">
                        <span className="material-symbols-outlined text-[24px] block">info</span>
                      </div>
                      <div className="flex-1">
                        <span className="font-label-sm text-label-sm uppercase block font-black text-secondary-container">Orden anulada</span>
                        <p className="font-body-sm text-body-sm font-semibold text-ink-black m-0">
                          Esta orden fue cancelada. El importe fue reembolsado al comprador.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-surface-container-low px-space-md py-space-xs border-t-[2px] border-ink-black flex flex-wrap items-center justify-between gap-space-xs">
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase flex items-center gap-2">
                    <span>Ticket: <strong>#BB-{orden.id}</strong></span>
                    <span>·</span>
                    <span className="text-primary-container">{orden.detalles.length} ítem(s)</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default OrdenesAdmin
