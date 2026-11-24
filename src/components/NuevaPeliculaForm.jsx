import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from '../utils/toast.js'

const URL_BASE = 'http://localhost:4002'

function NuevaPeliculaForm({ categorias, onCreada }) {
  const token = useSelector((s) => s.auth.token)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [creando, setCreando] = useState(false)
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (titulo.trim() === '') { toast('El título es obligatorio'); return }
    if (descripcion.trim() === '') { toast('La descripción es obligatoria'); return }
    if (precio === '') { toast('El precio es obligatorio'); return }
    if (stock === '') { toast('El stock es obligatorio'); return }
    if (categoriaId === '') { toast('La categoría es obligatoria'); return }

    setCreando(true)
    setError(null)

    fetch(`${URL_BASE}/api/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ titulo, descripcion, precio: Number(precio), stock: Number(stock), categoriaId: Number(categoriaId) }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { setError(d.message || 'No se pudo crear la película.'); setCreando(false) })
        return res.json().then((data) => {
          setTitulo('')
          setDescripcion('')
          setPrecio('')
          setStock('')
          setCategoriaId('')
          setCreando(false)
          onCreada(data)
        })
      })
      .catch(() => { setError('Error de conexión.'); setCreando(false) })
  }

  return (
    <section
      className="relative bg-card-surface shadow-[5px_5px_0px_#000000] p-space-md md:p-space-lg text-ink-black"
      style={{ border: '3px solid #000000', borderRadius: '10px' }}
    >
      <div
        className="absolute -top-3 -right-3 bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-[2px] shadow-[2px_2px_0px_#000000] uppercase tracking-wider"
        style={{ border: '2px solid #000000', transform: 'rotate(3deg)' }}
      >
        ★ NUEVA ENTRADA ★
      </div>
      <div className="flex items-center gap-space-xs mb-space-md">
        <span className="material-symbols-outlined text-[28px] text-secondary-container">add_box</span>
        <h2 className="font-headline-lg text-headline-lg text-ink-black uppercase tracking-wider">
          AGREGAR NUEVA PELÍCULA
        </h2>
      </div>

      {error && (
        <div
          className="mb-space-lg text-error-container shadow-[3px_3px_0px_#000000] p-space-sm md:p-space-md flex items-start gap-space-sm"
          style={{ backgroundColor: '#fee2e2', border: '3px solid #93000a', borderRadius: '8px' }}
        >
          <span className="material-symbols-outlined text-[28px] text-error-container flex-shrink-0 animate-bounce">warning</span>
          <div className="flex-1">
            <p className="font-label-lg text-label-lg uppercase tracking-wide text-error-container">
              ¡ATENCIÓN! CINTA DAÑADA: {error}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-space-md">
        <div>
          <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
            Título de la Película <span className="text-secondary-container">*</span>
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full text-ink-black font-body-md text-body-md px-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all"
            style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
            placeholder="Ej: El Padrino"
          />
        </div>
        <div>
          <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
            Sinopsis / Descripción VHS <span className="text-secondary-container">*</span>
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            className="w-full text-ink-black font-body-md text-body-md px-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all resize-y"
            style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
            placeholder="Describe el argumento, año original de estreno, edición coleccionista..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div>
            <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
              Precio de Alquiler / Venta ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-headline-sm text-ink-black">$</span>
              <input
                type="number"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full text-ink-black font-body-md text-body-md pl-space-lg pr-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all"
                style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
                placeholder="1500"
              />
            </div>
          </div>
          <div>
            <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
              Stock Disponible (Copias)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-muted-gray">inventory_2</span>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full text-ink-black font-body-md text-body-md pl-space-lg pr-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all"
                style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
                placeholder="10"
              />
            </div>
          </div>
          <div>
            <label className="block font-label-md text-label-md uppercase tracking-wider text-ink-black mb-space-xs">
              Categoría del Pasillo
            </label>
            <div className="relative">
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full appearance-none text-ink-black font-body-md text-body-md px-space-md py-[10px] focus:outline-none focus:shadow-[3px_3px_0px_#0061a9] transition-all cursor-pointer"
                style={{ backgroundColor: '#f9fafb', border: '3px solid #000000', borderRadius: '8px' }}
              >
                <option value="">Selecciona categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-black">arrow_drop_down</span>
            </div>
          </div>
        </div>
        <div className="pt-space-sm flex justify-end">
          <button
            type="submit"
            disabled={creando}
            className="bg-primary-container text-ink-black font-headline-md text-headline-md uppercase tracking-wider px-space-xl py-space-sm shadow-[4px_4px_0px_#000000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000] transition-all flex items-center gap-space-xs disabled:opacity-50 cursor-pointer"
            style={{ border: '3px solid #000000' }}
          >
            <span className="material-symbols-outlined text-[26px]">video_call</span>
            {creando ? 'CREANDO...' : 'CREAR PELÍCULA'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default NuevaPeliculaForm
