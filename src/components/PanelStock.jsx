import { useState } from 'react'
import { toast } from '../utils/toast.js'

const URL_BASE = 'http://localhost:4002'
const btnStyle = { border: '2px solid #000000' }

function PanelStock({ pelicula, token, onActualizado, onCancelar }) {
  const [stock, setStock] = useState(pelicula.stock)

  function handleActualizar() {
    if (stock === '') { toast('El stock es obligatorio'); return }

    fetch(`${URL_BASE}/api/peliculas/${pelicula.id}/stock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ stock: Number(stock) }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) { toast('No tenés permiso para cambiar el stock.'); return }
          return res.json().then((d) => toast(d.message))
        }
        onActualizado({ stock: Number(stock) })
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
          <span className="material-symbols-outlined text-[24px] text-primary-container bg-ink-black p-1 rounded">inventory_2</span>
          <div>
            <div className="font-headline-sm text-headline-sm uppercase text-ink-black leading-tight">
              Modificar Existencias en Depósito
            </div>
            <div className="font-body-sm text-body-sm text-muted-gray">
              Número total de cajas VHS físicas disponibles.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <div
            className="flex items-center bg-card-surface shadow-[2px_2px_0px_#000000]"
            style={{ border: '2px solid #000000', borderRadius: '4px' }}
          >
            <span className="font-label-sm text-label-sm text-muted-gray px-space-xs uppercase">Unidades:</span>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-20 px-2 py-1 text-center font-headline-sm text-headline-sm text-ink-black focus:outline-none"
              style={{ borderLeft: '2px solid #000000' }}
            />
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
            onClick={handleActualizar}
            className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-[7px] shadow-[2px_2px_0px_#000000] uppercase font-bold flex items-center gap-1 cursor-pointer"
            style={btnStyle}
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span> Actualizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PanelStock
