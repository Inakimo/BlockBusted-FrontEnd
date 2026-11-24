import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCantidadCarrito } from '../store/carritoSlice'
import { toast } from '../utils/toast.js'
import PageLoading from '../components/PageLoading.jsx'
import PageError from '../components/PageError.jsx'
import CartItemRow from '../components/CartItemRow.jsx'
import DiscountCodeForm from '../components/DiscountCodeForm.jsx'

const URL_BASE = 'http://localhost:4002'

function Carrito() {
  const dispatch = useDispatch()
  const token = useSelector((s) => s.auth.token)
  const [carrito, setCarrito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const navigate = useNavigate()

  function cargarCarrito() {
    if (!carrito) setCargando(true)
    setError(null)
    fetch(`${URL_BASE}/api/carrito`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) { setError('No se pudo cargar el carrito.'); setCargando(false); return }
        return res.json().then((data) => { setCarrito(data); setCargando(false) })
      })
      .catch(() => { setError('Error de conexión.'); setCargando(false) })
  }

  useEffect(() => { cargarCarrito() }, [])

  function handleCambiarCantidad(itemId, nuevaCantidad) {
    if (nuevaCantidad < 1) return
    fetch(`${URL_BASE}/api/carrito/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) { toast('No tenés permiso para modificar el carrito.'); return }
          return res.json().then((d) => toast(d.message))
        }
        cargarCarrito()
        dispatch(fetchCantidadCarrito())
      })
      .catch(() => {})
  }

  function handleQuitarItem(itemId) {
    fetch(`${URL_BASE}/api/carrito/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) { setError('No se pudo quitar el item.'); return }
        cargarCarrito()
        dispatch(fetchCantidadCarrito())
      })
      .catch(() => {})
  }

  function handleVaciarCarrito() {
    fetch(`${URL_BASE}/api/carrito`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) { setError('No se pudo vaciar el carrito.'); return }
        cargarCarrito()
        dispatch(fetchCantidadCarrito())
      })
      .catch(() => {})
  }

  function handleQuitarCodigo() {
    fetch(`${URL_BASE}/api/carrito/descuento`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      .then((res) => { if (res.ok) return res.json().then(setCarrito) })
      .catch(() => {})
  }

  function handleConfirmarCompra() {
    setConfirmando(true)
    fetch(`${URL_BASE}/api/ordenes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) { toast('No tenés permiso para realizar la compra.'); setConfirmando(false); return }
          return res.json().then((d) => { toast(d.message || 'No se pudo confirmar la compra.'); setConfirmando(false) })
        }
        return res.json().then(() => { dispatch(fetchCantidadCarrito()); navigate('/mis-ordenes') })
      })
      .catch(() => setConfirmando(false))
  }

  if (cargando && !carrito) return <PageLoading texto="Cargando carrito..." />
  if (error) return <PageError texto={error} />

  const items = carrito && carrito.items ? carrito.items : []
  const totalCintas = items.reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0)

  let subtotalCarrito = 0
  for (const it of items) {
    const p = it.pelicula
    if (p) {
      const pf = p.descuentoPorcentaje > 0 ? parseInt(p.precio - p.precio * p.descuentoPorcentaje / 100) : p.precio
      subtotalCarrito += pf * it.cantidad
    }
  }

  const descuentoTotal = carrito && carrito.descuentoPorcentaje ? carrito.descuentoPorcentaje : 0
  const totalCarrito = descuentoTotal > 0
    ? Math.round(subtotalCarrito - subtotalCarrito * descuentoTotal / 100)
    : subtotalCarrito

  return (
    <div className="relative w-full overflow-hidden pb-space-xl">
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
            <h1 className="font-headline-lg text-display-lg text-cream tracking-wide drop-shadow-[4px_4px_0_#000000] uppercase">Mi carrito</h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleVaciarCarrito}
              className="group bg-cream text-ink-black font-label-md text-label-md px-space-md py-space-sm shadow-[3px_3px_0_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#000000] transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer border-none self-start md:self-end"
            >
              <span className="material-symbols-outlined text-label-lg text-secondary-container group-hover:rotate-12 transition-transform">delete_sweep</span>
              Vaciar carrito
            </button>
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
            {/* Items */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-lg">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onCambiarCantidad={handleCambiarCantidad}
                  onQuitarItem={handleQuitarItem}
                />
              ))}
            </div>

            {/* Checkout ticket */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
              <div className="relative bg-card-surface text-ink-black shadow-[6px_6px_0_#000000] p-space-lg overflow-hidden">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-background rounded-b-full"></div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-background rounded-t-full"></div>

                <div className="text-center pb-space-sm">
                  <div className="inline-block bg-ink-black text-primary-container font-label-sm text-[10px] px-space-sm py-0.5 tracking-widest uppercase mb-1">
                    TICKET DE CAJA · REGISTRADORA #03
                  </div>
                  <h2 className="font-headline-md text-headline-md text-ink-black tracking-wider uppercase">Resumen de compra</h2>
                  <div className="font-label-sm text-muted-gray text-xs tracking-widest uppercase">BLOCKBUSTED VIDEO CLUB NO. 402</div>
                </div>

                <div className="my-space-md py-1 flex justify-between items-center text-[11px] font-label-sm text-muted-gray uppercase" style={{ borderTop: '2px dashed rgba(0,0,0,0.4)' }}>
                  <span>DESCRIPCIÓN</span><span>TOTAL</span>
                </div>

                <div className="space-y-space-sm font-body-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-gray font-semibold">Subtotal ({totalCintas} {totalCintas === 1 ? 'cinta' : 'cintas'})</span>
                    <span className="font-bold text-ink-black">${subtotalCarrito}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-gray font-semibold flex items-center gap-1">
                      <span>Envío Garantizado</span>
                      <span className="text-[10px] bg-ink-black text-cream px-1 uppercase">Pizza VHS</span>
                    </span>
                    <span className="font-bold text-primary-fixed-dim uppercase tracking-wider bg-ink-black px-1.5 py-0.5 text-xs">GRATIS</span>
                  </div>
                  {descuentoTotal > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-black font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary-container">sell</span>
                        Descuento {carrito.codigoDescuento} ({descuentoTotal}%)
                        <button
                          type="button"
                          onClick={handleQuitarCodigo}
                          className="text-secondary-container hover:opacity-70 cursor-pointer bg-transparent border-none p-0 ml-1"
                          title="Quitar descuento"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                      <span className="font-bold text-[#059669]">-${subtotalCarrito - totalCarrito}</span>
                    </div>
                  )}
                  <div className="pt-space-sm" style={{ borderBottom: '4px double #000000' }}></div>
                  <div className="pt-space-xs flex items-baseline justify-between">
                    <div>
                      <span className="font-headline-sm text-headline-sm text-ink-black uppercase leading-none block">Total a pagar</span>
                      <span className="font-label-sm text-[11px] text-muted-gray uppercase tracking-wider">IVA INCLUIDO · RECARGOS $0</span>
                    </div>
                    <span className="font-headline-lg text-headline-lg text-secondary-container leading-none drop-shadow-[2px_2px_0_#000000]">${totalCarrito}</span>
                  </div>
                </div>

                {!carrito.codigoDescuento && (
                  <div className="mt-space-md">
                    <DiscountCodeForm token={token} onExito={setCarrito} />
                  </div>
                )}

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

                <div className="mt-space-lg pt-space-sm flex flex-col items-center justify-center gap-1" style={{ borderTop: '1px solid rgba(0,0,0,0.2)' }}>
                  <svg className="w-48 h-10 text-ink-black" fill="currentColor" viewBox="0 0 190 40">
                    {[[0,3],[6,2],[11,5],[19,2],[24,6],[33,2],[38,4],[45,8],[56,2],[61,5],[69,3],[75,6],[84,2],[89,4],[96,3],[102,7],[112,2],[117,5],[125,3],[131,6],[140,2],[145,5],[153,3],[159,8],[170,3],[176,5],[184,4]].map(([x, w]) => (
                      <rect key={x} height="35" width={w} x={x} y="0" />
                    ))}
                  </svg>
                  <span className="font-label-sm text-[10px] tracking-[0.3em] text-ink-black uppercase">* 8 9 0 0 2 1 4 4 0 2 *</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-space-xl grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {[
              { icon: 'replay', title: 'Garantía de rebobinado', desc: 'Si tu cinta se traba o tiene lluvia magnética, te enviamos otra copia en 24h sin cargo.', bg: 'bg-primary-container', color: 'text-ink-black', rotate: 'hover:-rotate-1' },
              { icon: 'shield', title: 'Pago seguro 100%', desc: 'Aceptamos tarjeta de socio, monedas del arcade y transacciones cifradas vintage.', bg: 'bg-secondary-container', color: 'text-cream', rotate: 'hover:rotate-1' },
              { icon: 'all_inbox', title: 'Buzón nocturno 24 horas', desc: 'Devolvé tus títulos en cualquier sucursal BlockBusted sin bajarte de tu monopatín.', bg: 'bg-card-surface', color: 'text-ink-black', rotate: 'hover:-rotate-1' },
            ].map(({ icon, title, desc, bg, color, rotate }) => (
              <div key={title} className={`bg-surface-container p-space-md shadow-[4px_4px_0_#000000] flex items-center gap-space-md transform ${rotate} transition-transform`}>
                <div className={`w-12 h-12 rounded-full ${bg} ${color} flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_#000000]`}>
                  <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-cream uppercase leading-none mb-1">{title}</h3>
                  <p className="font-body-sm text-body-sm text-xs text-on-surface-variant">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Carrito
