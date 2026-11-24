import { useState } from 'react'
import { toast } from '../utils/toast.js'

const URL_BASE = 'http://localhost:4002'
const inputStyle = { border: '2px solid #000000', borderRadius: '4px' }
const btnStyle = { border: '2px solid #000000' }

function PanelEditar({ pelicula, categorias, token, onGuardado, onCancelar }) {
  const [titulo, setTitulo] = useState(pelicula.titulo)
  const [descripcion, setDescripcion] = useState(pelicula.descripcion)
  const [precio, setPrecio] = useState(pelicula.precio)
  const [categoriaId, setCategoriaId] = useState(pelicula.categoria ? pelicula.categoria.id : '')

  function handleGuardar() {
    if (titulo.trim() === '') { toast('El título es obligatorio'); return }
    if (descripcion.trim() === '') { toast('La descripción es obligatoria'); return }
    if (precio === '') { toast('El precio es obligatorio'); return }
    if (categoriaId === '') { toast('La categoría es obligatoria'); return }

    const catObj = categorias.find((c) => c.id === Number(categoriaId))

    fetch(`${URL_BASE}/api/peliculas/${pelicula.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ titulo, descripcion, precio: Number(precio), categoriaId: Number(categoriaId) }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) { toast('No tenés permiso para editar esta película.'); return }
          return res.json().then((d) => toast(d.message))
        }
        onGuardado({ titulo, descripcion, precio: Number(precio), categoria: catObj })
      })
      .catch(() => toast('Error de conexión.'))
  }

  return (
    <div
      className="mt-space-md p-space-md shadow-[3px_3px_0px_#000000]"
      style={{ backgroundColor: '#f3f4f6', border: '2px solid #000000', borderRadius: '8px' }}
    >
      <div className="flex items-center justify-between pb-space-xs mb-space-sm" style={{ borderBottom: '1px solid rgba(107,114,128,0.3)' }}>
        <span className="font-headline-sm text-headline-sm uppercase text-ink-black flex items-center gap-1">
          <span className="material-symbols-outlined text-[20px]" style={{ color: '#0061a9' }}>edit_note</span>
          Editar Ficha Técnica
        </span>
        <span className="font-label-sm text-label-sm text-muted-gray uppercase">ID #{pelicula.id}</span>
      </div>
      <div className="space-y-space-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-space-sm py-[6px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9]"
              style={inputStyle}
            />
          </div>
          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">Precio ($)</label>
              <input
                type="number"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-space-sm py-[6px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9]"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">Categoría</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full bg-card-surface text-ink-black font-body-md text-body-md px-space-sm py-[6px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9]"
                style={inputStyle}
              >
                <option value="">Seleccionar...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">Descripción</label>
          <textarea
            rows="2"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-card-surface text-ink-black font-body-sm text-body-sm px-space-sm py-[6px] focus:outline-none focus:shadow-[2px_2px_0px_#0061a9] leading-snug"
            style={inputStyle}
          />
        </div>
        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            type="button"
            onClick={onCancelar}
            className="bg-card-surface text-ink-black font-label-md text-label-md px-space-md py-[6px] shadow-[2px_2px_0px_#000000] hover:bg-cream uppercase cursor-pointer"
            style={btnStyle}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-[6px] shadow-[2px_2px_0px_#000000] uppercase font-bold flex items-center gap-1 cursor-pointer"
            style={btnStyle}
          >
            <span className="material-symbols-outlined text-[18px]">save</span> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}

export default PanelEditar
