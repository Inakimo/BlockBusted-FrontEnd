import { useState, useEffect } from 'react'

const URL_BASE = 'http://localhost:4002'

function MisOrdenes({ token }) {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [ordenACancelar, setOrdenACancelar] = useState(null)

  function cargarOrdenes() {
    setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/ordenes`, {
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
  }

  useEffect(() => {
    cargarOrdenes()
  }, [])

  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr)
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const anio = fecha.getFullYear()
    return `${dia}/${mes}/${anio}`
  }

  function handleCancelarOrden(ordenId) {
    fetch(`${URL_BASE}/api/ordenes/${ordenId}/cancelar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para cancelar esta orden.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        setOrdenACancelar(null)
        cargarOrdenes()
      })
      .catch((err) => {
        console.error('Error al cancelar orden', err)
        alert('Error de conexión.')
      })
  }

  if (cargando) {
    return (
      <div className="w-full max-w-6xl mx-auto px-margin-sm lg:px-margin py-space-xl">
        <p className="font-headline-md text-headline-md text-cream text-center">Cargando órdenes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-margin-sm lg:px-margin py-space-xl">
        <p className="font-headline-md text-headline-md text-secondary-container text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      {/* Ticker tape */}
      <div className="w-full bg-secondary-container py-1 px-4 overflow-hidden flex items-center justify-between text-cream font-label-sm text-label-sm uppercase tracking-widest" style={{ borderBottom: '2px solid #000000' }}>
        <div className="flex items-center gap-space-md">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
            TERMINAL SOCIO #8942-B
          </span>
          <span className="hidden md:inline">• REBOBINE SUS CINTAS ANTES DE DEVOLVER •</span>
          <span className="hidden lg:inline">• HORARIO DE ENTREGA 24/7 EN BUZÓN •</span>
        </div>
        <div className="flex items-center gap-space-xs font-label-sm text-primary-container">
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          HISTORIAL DE CUENTA ACTIVA
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-margin-sm lg:px-margin py-space-xl">
        {/* Header */}
        <header className="mb-space-xl relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div
                className="inline-flex items-center gap-space-xs bg-primary-container text-ink-black font-label-sm text-label-sm px-space-sm py-0.5 shadow-[3px_3px_0_#000000] uppercase mb-space-xs transform -rotate-1"
                style={{ border: '2px solid #000000' }}
              >
                <span className="material-symbols-outlined text-[16px]">movie_filter</span>
                Miembro Oficial BlockBusted
              </div>
              <h1 className="font-headline-lg text-display-lg text-cream tracking-wider uppercase drop-shadow-[4px_4px_0_#000000]">
                MIS ÓRDENES
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                Historial de alquileres y compras registradas en el videoclub. Revisa los detalles de tus cintas y gestiona tus reservas pendientes.
              </p>
            </div>
          </div>
          {/* Negatives strip */}
          <div className="mt-space-lg h-3 w-full bg-ink-black flex gap-2 overflow-hidden px-1 items-center opacity-80" style={{ borderTop: '2px solid #35333e', borderBottom: '2px solid #35333e' }}>
            {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map((i) => (
              <div key={i} className="w-2 h-1 bg-cream flex-shrink-0"></div>
            ))}
          </div>
        </header>

        {ordenes.length === 0 ? (
          <div
            className="bg-card-surface text-ink-black p-space-xl text-center shadow-[6px_6px_0px_#000000]"
            style={{ border: '3px solid #000000', borderRadius: '10px' }}
          >
            <span className="material-symbols-outlined text-[48px] text-muted-gray">receipt_long</span>
            <p className="font-headline-md text-headline-md uppercase mt-space-sm">Todavía no realizaste ninguna compra.</p>
          </div>
        ) : (
          <div className="space-y-space-lg">
            {ordenes.map((orden) => {
              const esConfirmada = orden.estado === 'CONFIRMADA'
              return (
                <article
                  key={orden.id}
                  className="bg-card-surface text-ink-black shadow-[6px_6px_0px_#000000] p-space-md sm:p-space-lg transition-all duration-150 relative"
                  style={{ border: '3px solid #000000', borderRadius: '10px', opacity: esConfirmada ? 1 : 0.95 }}
                >
                  {/* Status tab */}
                  {esConfirmada ? (
                    <div
                      className="absolute -top-3.5 left-6 bg-primary-container text-ink-black font-label-sm text-label-sm px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase tracking-wider flex items-center gap-1"
                      style={{ border: '2px solid #000000' }}
                    >
                      <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      DESPACHO EN PROCESO
                    </div>
                  ) : (
                    <div
                      className="absolute -top-3.5 left-6 font-label-sm text-label-sm px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase tracking-wider flex items-center gap-1 font-black"
                      style={{ backgroundColor: '#fee2e2', color: '#E53935', border: '2px solid #000000' }}
                    >
                      <span className="material-symbols-outlined text-[14px]">do_not_disturb_on</span>
                      TRANSACCIÓN REVOCADA
                    </div>
                  )}

                  {/* Top bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md pt-space-xs" style={{ borderBottom: '3px solid #000000' }}>
                    <div className="flex flex-wrap items-center gap-space-sm">
                      <span className="font-headline-lg text-headline-lg text-ink-black tracking-wider drop-shadow-[1px_1px_0_#ffd700]">
                        ORDEN #{orden.id}
                      </span>
                      <span className="text-ink-black font-bold hidden sm:inline">•</span>
                      <div className="flex items-center gap-1 font-body-sm text-body-sm font-semibold text-muted-gray">
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        <span>{formatearFecha(orden.fecha)}</span>
                      </div>
                      {esConfirmada ? (
                        <span
                          className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_#000000] uppercase tracking-wider flex items-center gap-1 font-extrabold"
                          style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '2px solid #000000' }}
                        >
                          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#10b981', border: '1px solid #000000' }}></span>
                          CONFIRMADA
                        </span>
                      ) : (
                        <span
                          className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_#000000] uppercase tracking-wider flex items-center gap-1 font-black"
                          style={{ backgroundColor: '#fee2e2', color: '#E53935', border: '2px solid #000000' }}
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                          CANCELADA
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-space-xs self-end sm:self-auto px-space-sm py-1 rounded shadow-[2px_2px_0_#000000]"
                      style={{ backgroundColor: esConfirmada ? '#FFF8E7' : '#f3f4f6', border: '2px solid #000000' }}
                    >
                      <span className={esConfirmada ? 'font-label-sm text-label-sm text-ink-black uppercase font-bold' : 'font-label-sm text-label-sm text-muted-gray uppercase font-bold line-through'}>TOTAL:</span>
                      <span
                        className={esConfirmada ? 'font-headline-lg text-headline-lg tracking-wide leading-none' : 'font-headline-lg text-headline-lg text-muted-gray tracking-wide leading-none line-through'}
                        style={esConfirmada ? { color: '#E53935' } : {}}
                      >
                        ${orden.total}
                      </span>
                    </div>
                  </div>

                  {/* Detalles table */}
                  <div className="my-space-md overflow-x-auto">
                    <table className="w-full text-left border-collapse" style={{ border: '2px solid #000000' }}>
                      <thead>
                        <tr className="bg-ink-black text-cream">
                          <th className="py-2.5 px-3 font-headline-sm text-headline-sm uppercase tracking-wider" style={{ borderRight: '2px solid #000000' }}>Película</th>
                          <th className="py-2.5 px-3 font-headline-sm text-headline-sm uppercase tracking-wider text-center w-20" style={{ borderRight: '2px solid #000000' }}>Cant.</th>
                          <th className="py-2.5 px-3 font-headline-sm text-headline-sm uppercase tracking-wider text-right w-36" style={{ borderRight: '2px solid #000000' }}>Precio unit.</th>
                          <th className="py-2.5 px-3 font-headline-sm text-headline-sm uppercase tracking-wider text-right w-32 bg-surface-container-high text-primary-container">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-body-sm">
                        {orden.detalles.map((detalle) => (
                          <tr key={detalle.id} style={{ borderTop: '2px solid #000000', opacity: esConfirmada ? 1 : 0.8 }}>
                            <td className="py-3 px-3" style={{ borderRight: '2px solid #000000' }}>
                              <div className="flex items-center gap-space-sm">
                                <div
                                  className="w-10 h-14 bg-ink-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_#000000]"
                                  style={{ border: '2px solid #000000', borderRadius: '4px' }}
                                >
                                  <span className="material-symbols-outlined text-primary-container text-[20px]">movie</span>
                                </div>
                                <div>
                                  <div className="font-body-md text-body-md font-bold text-ink-black">
                                    {detalle.pelicula && detalle.pelicula.titulo}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="bg-secondary-container text-cream text-[10px] font-extrabold px-1.5 py-0.5 uppercase" style={{ border: '1px solid #000000', borderRadius: '2px' }}>
                                      VHS Deluxe
                                    </span>
                                    <span className="text-muted-gray text-xs font-medium">Estuche clamshell original</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-body-md" style={{ borderRight: '2px solid #000000' }}>
                              {detalle.cantidad}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-ink-black" style={{ borderRight: '2px solid #000000' }}>
                              ${detalle.precioUnitario}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-body-md text-ink-black" style={{ backgroundColor: esConfirmada ? 'rgba(255,248,231,0.3)' : '#f3f4f6' }}>
                              ${detalle.precioUnitario * detalle.cantidad}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  {esConfirmada ? (
                    <div className="pt-space-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md" style={{ borderTop: '2px dashed #000000' }}>
                      <div className="flex items-center gap-2 text-muted-gray font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[20px] text-ink-black">package_2</span>
                        <span>Envío a domicilio seleccionado</span>
                      </div>
                      <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setOrdenACancelar(orden)}
                          className="w-full sm:w-auto bg-card-surface font-label-md text-label-md px-space-md py-2.5 shadow-[3px_3px_0px_#000000] transition-all flex items-center justify-center gap-1.5 uppercase font-extrabold cursor-pointer"
                          style={{ color: '#E53935', border: '3px solid #E53935', borderRadius: '4px' }}
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                          Cancelar orden
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="pt-space-sm p-space-sm flex items-center gap-space-sm"
                      style={{ backgroundColor: '#f3f4f6', border: '2px solid #000000', borderRadius: '4px' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-cream flex-shrink-0 shadow-[1px_1px_0_#000000]"
                        style={{ border: '1px solid #000000' }}
                      >
                        <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-muted-gray font-medium">
                        Orden anulada. Importe reembolsado en saldo club.
                      </p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal cancelación */}
      {ordenACancelar && (
        <div className="fixed inset-0 z-50 bg-ink-black/80 flex items-center justify-center p-4">
          <div
            className="bg-card-surface text-ink-black shadow-[8px_8px_0_#ffd700] max-w-md w-full p-space-lg relative"
            style={{ border: '4px solid #000000', borderRadius: '12px' }}
          >
            <div
              className="w-14 h-14 rounded-full shadow-[3px_3px_0_#000000] flex items-center justify-center mx-auto mb-space-md"
              style={{ backgroundColor: '#fee2e2', color: '#E53935', border: '3px solid #000000' }}
            >
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-center text-ink-black uppercase tracking-wider mb-space-xs">
              ¿CANCELAR ORDEN #{ordenACancelar.id}?
            </h3>
            <p className="font-body-md text-body-md text-muted-gray text-center mb-space-lg">
              Esta acción devolverá las copias a las estanterías del videoclub. El reintegro de <strong className="text-ink-black">${ordenACancelar.total}</strong> se procesará al instante en tu saldo club.
            </p>
            <div className="flex flex-col sm:flex-row gap-space-sm">
              <button
                type="button"
                onClick={() => setOrdenACancelar(null)}
                className="flex-1 bg-cream text-ink-black font-label-md text-label-md py-3 shadow-[3px_3px_0_#000000] uppercase transition-all"
                style={{ border: '3px solid #000000', borderRadius: '4px' }}
              >
                No, mantener
              </button>
              <button
                type="button"
                onClick={() => handleCancelarOrden(ordenACancelar.id)}
                className="flex-1 text-cream font-label-md text-label-md py-3 shadow-[3px_3px_0_#000000] uppercase transition-all"
                style={{ backgroundColor: '#E53935', border: '3px solid #000000', borderRadius: '4px' }}
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MisOrdenes
