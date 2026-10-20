import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const URL_BASE = 'http://localhost:4002'

function Carrito({ token, onCarritoActualizado }) {
  const [carrito, setCarrito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const navigate = useNavigate()

  function cargarCarrito() {
    if (!carrito) setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/carrito`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudo cargar el carrito.')
          setCargando(false)
          return
        }
        return response.json().then((data) => {
          setCarrito(data)
          setCargando(false)
        })
      })
      .catch((err) => {
        console.error('Error al cargar carrito', err)
        setError('Error de conexión.')
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarCarrito()
  }, [])

  function handleCambiarCantidad(itemId, nuevaCantidad) {
    if (nuevaCantidad < 1) return

    fetch(`${URL_BASE}/api/carrito/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para modificar el carrito.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        cargarCarrito()
        if (onCarritoActualizado) onCarritoActualizado()
      })
      .catch((err) => { console.error('Error al cambiar cantidad', err) })
  }

  function handleQuitarItem(itemId) {
    fetch(`${URL_BASE}/api/carrito/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudo quitar el item.')
          return
        }
        cargarCarrito()
        if (onCarritoActualizado) onCarritoActualizado()
      })
      .catch((err) => { console.error('Error al quitar item', err) })
  }

  function handleVaciarCarrito() {
    fetch(`${URL_BASE}/api/carrito`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudo vaciar el carrito.')
          return
        }
        cargarCarrito()
        if (onCarritoActualizado) onCarritoActualizado()
      })
      .catch((err) => { console.error('Error al vaciar carrito', err) })
  }

  function handleConfirmarCompra() {
    setConfirmando(true)

    fetch(`${URL_BASE}/api/ordenes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para realizar la compra.'); setConfirmando(false); return }
          return response.json().then((data) => {
            alert(data.message || 'No se pudo confirmar la compra.')
            setConfirmando(false)
          })
        }
        return response.json().then(() => {
          if (onCarritoActualizado) onCarritoActualizado()
          navigate('/mis-ordenes')
        })
      })
      .catch((err) => {
        console.error('Error al confirmar compra', err)
        setConfirmando(false)
      })
  }

  if (cargando && !carrito) {
    return (
      <div className="w-full py-space-xl px-margin-sm flex items-center justify-center">
        <p className="font-headline-md text-headline-md uppercase text-cream">Cargando carrito...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-space-xl px-margin-sm flex items-center justify-center">
        <p className="font-headline-md text-headline-md uppercase text-secondary-container">{error}</p>
      </div>
    )
  }

  const items = carrito && carrito.items ? carrito.items : []

  let totalCarrito = 0
  for (const it of items) {
    const p = it.pelicula
    if (p) {
      const pf = p.descuentoPorcentaje > 0 ? parseInt(p.precio - p.precio * p.descuentoPorcentaje / 100) : p.precio
      totalCarrito = totalCarrito + pf * it.cantidad
    }
  }

  return (
    <div className="relative w-full overflow-hidden pb-space-xl">
      {/* Ambient decors */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex justify-between">
        <div className="w-96 h-96 rounded-full bg-primary-container blur-3xl -top-24 -left-24"></div>
        <div className="w-96 h-96 rounded-full bg-secondary-container blur-3xl top-1/2 -right-24"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-margin-sm lg:px-margin pt-space-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg pb-space-md">
          <div className="space-y-space-xs">
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-1 shadow-[2px_2px_0_#000000] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-label-sm">confirmation_number</span>
                TICKET NO. 89-4402
              </span>
              <span className="bg-card-surface text-ink-black font-label-sm text-label-sm px-space-sm py-1 shadow-[2px_2px_0_#000000] uppercase tracking-widest">
                {items.length} {items.length === 1 ? 'PELÍCULA' : 'PELÍCULAS'} EN CINTA
              </span>
            </div>
            <h1 className="font-headline-lg text-display-lg text-cream tracking-wide drop-shadow-[4px_4px_0_#000000] uppercase">
              Mi carrito
            </h1>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-space-sm self-start md:self-end">
              <button
                onClick={handleVaciarCarrito}
                className="group bg-cream text-ink-black font-label-md text-label-md px-space-md py-space-sm shadow-[3px_3px_0_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#000000] transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer border-none"
              >
                <span className="material-symbols-outlined text-label-lg text-secondary-container group-hover:rotate-12 transition-transform">delete_sweep</span>
                <span>Vaciar carrito</span>
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-card-surface text-ink-black p-space-xl shadow-[4px_4px_0_#000000] text-center space-y-space-md">
            <span className="material-symbols-outlined text-6xl text-secondary-container">remove_shopping_cart</span>
            <h3 className="font-headline-lg text-headline-lg uppercase">¡Tu carrito está vacío!</h3>
            <p className="font-body-md text-body-md text-muted-gray max-w-md mx-auto">
              No has seleccionado ninguna cinta magnética. Pasá por nuestros pasillos y rescatá clásicos inmortales.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Cart items list */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-lg">
              {items.map((item) => {
                const peli = item.pelicula
                const precio = peli && peli.precio
                const descuento = peli && peli.descuentoPorcentaje
                const precioFinal = peli && descuento > 0 ? parseInt(precio - precio * descuento / 100) : precio
                const subtotal = precioFinal * item.cantidad
                const foto = peli && peli.fotos && peli.fotos.length > 0 && peli.fotos[0].url

                return (
                  <article key={item.id} className="bg-card-surface text-ink-black p-space-md lg:p-space-lg shadow-[4px_4px_0_#000000] transition-all relative">
                    {peli && descuento > 0 && (
                      <div className="absolute -top-3 -right-3 z-10 bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase tracking-wider flex items-center gap-1" style={{ transform: 'rotate(6deg)' }}>
                        <span className="material-symbols-outlined text-label-sm">local_fire_department</span>
                        {descuento}% OFF APLICADO
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md">
                      {/* Thumbnail */}
                      <div className="relative w-full sm:w-28 sm:h-36 h-48 bg-ink-black shadow-[3px_3px_0_#000000] flex-shrink-0 overflow-hidden">
                        {foto ? (
                          <img
                            src={foto}
                            alt={item.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary-container text-5xl">movie</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-ink-black/85 text-primary-container text-center py-0.5 font-label-sm text-[10px] tracking-widest uppercase">
                          VHS · HI-FI
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between h-full space-y-space-xs">
                        <div>
                          <div className="flex items-center gap-space-xs mb-1">
                            {peli && peli.categoria && (
                              <span className="bg-ink-black text-primary-container font-label-sm text-[11px] px-1.5 py-0.5 uppercase tracking-wide">
                                {peli.categoria.descripcion}
                              </span>
                            )}
                            <span className="text-muted-gray text-xs font-bold uppercase tracking-wider">
                              CÓD: BB-{item.peliculaId}
                            </span>
                          </div>
                          <h2 className="font-headline-md text-headline-md text-ink-black tracking-wide leading-none uppercase">
                            {item.titulo}
                          </h2>
                          {peli && peli.descripcion && (
                            <p className="font-body-sm text-body-sm text-muted-gray text-xs mt-0.5" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {peli.descripcion}
                            </p>
                          )}
                        </div>

                        {peli && (
                          <div className="flex items-baseline gap-space-sm pt-space-xs">
                            <span className="font-headline-sm text-headline-sm text-secondary-container leading-none font-bold">
                              ${precioFinal}
                            </span>
                            {descuento > 0 && (
                              <>
                                <span className="font-label-sm text-label-sm text-muted-gray line-through text-xs">
                                  ${precio}
                                </span>
                                <span className="bg-primary text-on-primary font-label-sm text-[10px] px-1 shadow-[1px_1px_0_#000000] uppercase">
                                  AHORRÁS ${precio - precioFinal} C/U
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity controls & actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-space-md pt-space-sm sm:pt-0 sm:pl-space-md" style={{ borderLeft: 'none' }}>
                        <div className="flex items-center shadow-[2px_2px_0_#000000] bg-cream">
                          <button
                            aria-label="Disminuir cantidad"
                            type="button"
                            onClick={() => handleCambiarCantidad(item.id, item.cantidad - 1)}
                            className="w-8 h-8 flex items-center justify-center text-ink-black hover:bg-primary-container transition-colors active:translate-y-0.5 bg-cream border-none cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-9 h-8 flex items-center justify-center font-label-md text-label-md text-ink-black bg-card-surface select-none">
                            {item.cantidad}
                          </span>
                          <button
                            aria-label="Aumentar cantidad"
                            type="button"
                            onClick={() => handleCambiarCantidad(item.id, item.cantidad + 1)}
                            className="w-8 h-8 flex items-center justify-center text-ink-black hover:bg-primary-container transition-colors active:translate-y-0.5 bg-cream border-none cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>

                        {peli && (
                          <div className="text-right">
                            <span className="font-label-sm text-[10px] text-muted-gray uppercase block tracking-wider">SUBTOTAL</span>
                            <span className="font-headline-sm text-headline-sm text-ink-black font-bold tracking-tight leading-none">
                              ${subtotal}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleQuitarItem(item.id)}
                          className="text-secondary-container hover:text-ink-black font-label-sm text-label-sm uppercase flex items-center gap-1 transition-colors cursor-pointer py-1 bg-transparent border-none"
                        >
                          <span className="material-symbols-outlined text-label-md">delete</span>
                          <span className="underline decoration-2 underline-offset-2">Quitar</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Checkout ticket */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
              <div className="relative bg-card-surface text-ink-black shadow-[6px_6px_0_#000000] p-space-lg overflow-hidden">
                {/* Perforation notches */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-background rounded-b-full"></div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-background rounded-t-full"></div>

                {/* Ticket header */}
                <div className="text-center pb-space-sm">
                  <div className="inline-block bg-ink-black text-primary-container font-label-sm text-[10px] px-space-sm py-0.5 tracking-widest uppercase mb-1">
                    TICKET DE CAJA · REGISTRADORA #03
                  </div>
                  <h2 className="font-headline-md text-headline-md text-ink-black tracking-wider uppercase">
                    Resumen de compra
                  </h2>
                  <div className="font-label-sm text-muted-gray text-xs tracking-widest uppercase">
                    BLOCKBUSTED VIDEO CLUB NO. 402
                  </div>
                </div>

                {/* Divider */}
                <div className="my-space-md py-1 flex justify-between items-center text-[11px] font-label-sm text-muted-gray uppercase" style={{ borderTop: '2px dashed rgba(0,0,0,0.4)' }}>
                  <span>DESCRIPCIÓN</span>
                  <span>TOTAL</span>
                </div>

                {/* Breakdown */}
                <div className="space-y-space-sm font-body-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-gray font-semibold">Subtotal ({items.length} {items.length === 1 ? 'cinta' : 'cintas'})</span>
                    <span className="font-bold text-ink-black">${totalCarrito}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-gray font-semibold flex items-center gap-1">
                      <span>Envío Garantizado</span>
                      <span className="text-[10px] bg-ink-black text-cream px-1 uppercase">Pizza VHS</span>
                    </span>
                    <span className="font-bold text-primary-fixed-dim uppercase tracking-wider bg-ink-black px-1.5 py-0.5 text-xs">
                      GRATIS
                    </span>
                  </div>

                  <div className="pt-space-sm" style={{ borderBottom: '4px double #000000' }}></div>

                  {/* Total */}
                  <div className="pt-space-xs flex items-baseline justify-between">
                    <div>
                      <span className="font-headline-sm text-headline-sm text-ink-black uppercase leading-none block">
                        Total a pagar
                      </span>
                      <span className="font-label-sm text-[11px] text-muted-gray uppercase tracking-wider">
                        IVA INCLUIDO · RECARGOS $0
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-lg text-headline-lg text-secondary-container leading-none drop-shadow-[2px_2px_0_#000000]">
                        ${totalCarrito}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-space-lg space-y-space-sm">
                  <button
                    type="button"
                    onClick={handleConfirmarCompra}
                    disabled={confirmando}
                    className="w-full bg-primary-container text-ink-black font-headline-md text-headline-md py-space-md shadow-[4px_4px_0_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#000000] transition-all flex items-center justify-center gap-space-sm uppercase tracking-wider cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{confirmando ? 'Procesando...' : 'Confirmar compra'}</span>
                    <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                  </button>
                  <div className="flex items-center justify-center gap-space-xs text-muted-gray font-label-sm text-[11px] uppercase tracking-wider pt-1">
                    <span className="material-symbols-outlined text-sm text-primary-fixed-dim">lock</span>
                    <span>PAGO ENCRIPTADO 128-BIT ANALÓGICO</span>
                  </div>
                </div>

                {/* Barcode */}
                <div className="mt-space-lg pt-space-sm flex flex-col items-center justify-center gap-1" style={{ borderTop: '1px solid rgba(0,0,0,0.2)' }}>
                  <svg className="w-48 h-10 text-ink-black" fill="currentColor" viewBox="0 0 190 40">
                    <rect height="35" width="3" x="0" y="0"></rect>
                    <rect height="35" width="2" x="6" y="0"></rect>
                    <rect height="35" width="5" x="11" y="0"></rect>
                    <rect height="35" width="2" x="19" y="0"></rect>
                    <rect height="35" width="6" x="24" y="0"></rect>
                    <rect height="35" width="2" x="33" y="0"></rect>
                    <rect height="35" width="4" x="38" y="0"></rect>
                    <rect height="35" width="8" x="45" y="0"></rect>
                    <rect height="35" width="2" x="56" y="0"></rect>
                    <rect height="35" width="5" x="61" y="0"></rect>
                    <rect height="35" width="3" x="69" y="0"></rect>
                    <rect height="35" width="6" x="75" y="0"></rect>
                    <rect height="35" width="2" x="84" y="0"></rect>
                    <rect height="35" width="4" x="89" y="0"></rect>
                    <rect height="35" width="3" x="96" y="0"></rect>
                    <rect height="35" width="7" x="102" y="0"></rect>
                    <rect height="35" width="2" x="112" y="0"></rect>
                    <rect height="35" width="5" x="117" y="0"></rect>
                    <rect height="35" width="3" x="125" y="0"></rect>
                    <rect height="35" width="6" x="131" y="0"></rect>
                    <rect height="35" width="2" x="140" y="0"></rect>
                    <rect height="35" width="5" x="145" y="0"></rect>
                    <rect height="35" width="3" x="153" y="0"></rect>
                    <rect height="35" width="8" x="159" y="0"></rect>
                    <rect height="35" width="3" x="170" y="0"></rect>
                    <rect height="35" width="5" x="176" y="0"></rect>
                    <rect height="35" width="4" x="184" y="0"></rect>
                  </svg>
                  <span className="font-label-sm text-[10px] tracking-[0.3em] text-ink-black uppercase">
                    * 8 9 0 0 2 1 4 4 0 2 *
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom pegatinas */}
        {items.length > 0 && (
          <div className="mt-space-xl grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="bg-surface-container p-space-md shadow-[4px_4px_0_#000000] flex items-center gap-space-md transform hover:-rotate-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-primary-container text-ink-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_#000000]">
                <span className="material-symbols-outlined text-2xl">replay</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-cream uppercase leading-none mb-1">
                  Garantía de rebobinado
                </h3>
                <p className="font-body-sm text-body-sm text-xs text-on-surface-variant">
                  Si tu cinta se traba o tiene lluvia magnética, te enviamos otra copia en 24h sin cargo.
                </p>
              </div>
            </div>
            <div className="bg-surface-container p-space-md shadow-[4px_4px_0_#000000] flex items-center gap-space-md transform hover:rotate-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-cream flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_#000000]">
                <span className="material-symbols-outlined text-2xl">shield</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-cream uppercase leading-none mb-1">
                  Pago seguro 100%
                </h3>
                <p className="font-body-sm text-body-sm text-xs text-on-surface-variant">
                  Aceptamos tarjeta de socio, monedas del arcade y transacciones cifradas vintage.
                </p>
              </div>
            </div>
            <div className="bg-surface-container p-space-md shadow-[4px_4px_0_#000000] flex items-center gap-space-md transform hover:-rotate-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-card-surface text-ink-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_#000000]">
                <span className="material-symbols-outlined text-2xl">all_inbox</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-cream uppercase leading-none mb-1">
                  Buzón nocturno 24 horas
                </h3>
                <p className="font-body-sm text-body-sm text-xs text-on-surface-variant">
                  Devolvé tus títulos en cualquier sucursal BlockBusted sin bajarte de tu monopatín.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Carrito
