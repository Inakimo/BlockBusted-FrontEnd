import { useState } from 'react'

const URL_BASE = 'http://localhost:4002'

function DiscountCodeForm({ token, onExito }) {
  const [codigo, setCodigo] = useState('')
  const [aplicando, setAplicando] = useState(false)
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!codigo.trim()) return
    setAplicando(true)
    setError(null)

    fetch(`${URL_BASE}/api/carrito/descuento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ codigo: codigo.trim() }),
    })
      .then((res) => {
        setAplicando(false)
        if (!res.ok) return res.json().then((d) => setError(d.message || 'Código inválido.'))
        return res.json().then((data) => { onExito(data); setCodigo('') })
      })
      .catch(() => { setAplicando(false); setError('Error de conexión.') })
  }

  return (
    <div style={{ borderTop: '2px dashed rgba(0,0,0,0.2)', paddingTop: '12px' }}>
      <p className="font-label-sm text-[11px] text-muted-gray uppercase tracking-wider mb-1">Código de descuento</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="BLOCKBUSTER10"
          className="flex-1 bg-card-surface text-ink-black font-body-sm text-body-sm px-2 py-1.5 shadow-[2px_2px_0_#000000] focus:outline-none uppercase font-bold text-sm"
          style={{ border: '2px solid #000000' }}
        />
        <button
          type="submit"
          disabled={aplicando || !codigo.trim()}
          className="bg-ink-black text-primary-container font-label-sm text-label-sm px-3 py-1.5 shadow-[2px_2px_0_#000000] uppercase tracking-wider cursor-pointer border-none disabled:opacity-50"
          style={{ border: '2px solid #000000' }}
        >
          {aplicando ? '...' : 'Aplicar'}
        </button>
      </form>
      {error && <p className="text-secondary-container font-body-sm text-[11px] mt-1">{error}</p>}
    </div>
  )
}

export default DiscountCodeForm
