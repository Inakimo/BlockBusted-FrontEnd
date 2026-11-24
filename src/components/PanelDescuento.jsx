import { useState } from 'react'
import { toast } from '../utils/toast.js'

const URL_BASE = 'http://localhost:4002'
const btnStyle = { border: '2px solid #000000' }

function PanelDescuento({ pelicula, token, onActualizado, onCancelar }) {
  const [descuento, setDescuento] = useState(pelicula.descuentoPorcentaje)

  function handleAplicar() {
    if (descuento === '') { toast('El descuento es obligatorio'); return }

    fetch(`${URL_BASE}/api/peliculas/${pelicula.id}/descuento`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ descuentoPorcentaje: Number(descuento) }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) { toast('No tenés permiso para cambiar el descuento.'); return }
          return res.json().then((d) => toast(d.message))
        }
        onActualizado({ descuentoPorcentaje: Number(descuento) })
      })
      .catch(() => toast('Error de conexión.'))
  }

  return (
    <div
      className="mt-space-md p-space-md shadow-[3px_3px_0px_#000000]"
      style={{ backgroundColor: '#f3f4f6', border: '2px solid #000000', borderRadius: '8px' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs">
          <span
            className="material-symbols-outlined text-[24px] text-cream bg-secondary-container p-1 rounded"
            style={{ border: '1px solid #000000' }}
          >
            local_offer
          </span>
          <div>
            <div className="font-headline-sm text-headline-sm uppercase text-ink-black leading-tight">
              Promoción Semanal / Oferta Marquee
            </div>
            <div className="font-body-sm text-body-sm text-muted-gray">
              Porcentaje de rebaja (0–100) sobre el precio base (${pelicula.precio}).
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <div
            className="relative flex items-center bg-card-surface shadow-[2px_2px_0px_#000000]"
            style={{ border: '2px solid #000000', borderRadius: '4px' }}
          >
            <input
              type="number"
              min="0"
              max="100"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className="w-20 px-2 py-1 text-center font-headline-sm text-headline-sm text-ink-black focus:outline-none"
            />
            <span className="font-headline-sm text-headline-sm pr-2 text-secondary-container font-bold">%</span>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="bg-card-surface text-ink-black font-label-md text-label-md px-space-sm py-[7px] shadow-[2px_2px_0px_#000000] hover:bg-cream uppercase cursor-pointer"
            style={btnStyle}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAplicar}
            className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-[7px] shadow-[2px_2px_0px_#000000] uppercase font-bold flex items-center gap-1 cursor-pointer"
            style={btnStyle}
          >
            <span className="material-symbols-outlined text-[16px]">save</span> Aplicar DTO
          </button>
        </div>
      </div>
    </div>
  )
}

export default PanelDescuento
