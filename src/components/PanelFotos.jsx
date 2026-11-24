import { useState } from 'react'
import { toast } from '../utils/toast.js'

const URL_BASE = 'http://localhost:4002'

function PanelFotos({ pelicula, token, onActualizado, onCerrar }) {
  const [archivo, setArchivo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)

  function handleAgregar() {
    if (!archivo) { toast('Seleccioná una imagen'); return }

    setSubiendo(true)
    const formData = new FormData()
    formData.append('file', archivo)

    fetch(`${URL_BASE}/api/peliculas/${pelicula.id}/fotos/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        setSubiendo(false)
        if (!res.ok) {
          if (res.status === 403) { toast('No tenés permiso para agregar fotos.'); return }
          return res.json().then((d) => toast(d.message))
        }
        return res.json().then((data) => {
          setArchivo(null)
          const nuevas = Array.isArray(data) ? data : [data]
          onActualizado([...(pelicula.fotos || []), ...nuevas])
          toast('Foto agregada correctamente.', 'success')
        })
      })
      .catch(() => { setSubiendo(false); toast('Error de conexión.') })
  }

  function handleEliminar(fotoId) {
    fetch(`${URL_BASE}/api/peliculas/${pelicula.id}/fotos/${fotoId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          onActualizado((pelicula.fotos || []).filter((f) => f.id !== fotoId))
          toast('Foto eliminada.', 'success')
        }
      })
      .catch(() => toast('Error de conexión.'))
  }

  return (
    <div
      className="mt-space-md p-space-md shadow-[3px_3px_0px_#000000] space-y-space-md"
      style={{ backgroundColor: '#f3f4f6', border: '2px solid #000000', borderRadius: '8px' }}
    >
      <div
        className="flex items-center justify-between pb-space-xs"
        style={{ borderBottom: '1px solid rgba(107,114,128,0.3)' }}
      >
        <span className="font-headline-sm text-headline-sm uppercase text-ink-black flex items-center gap-1">
          <span className="material-symbols-outlined text-[20px] text-secondary-container">collections</span>
          Afiches y Galería de Portadas VHS
        </span>
        <button
          type="button"
          onClick={onCerrar}
          className="font-label-sm text-label-sm text-muted-gray hover:text-ink-black uppercase font-bold flex items-center gap-1 bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span> Cerrar
        </button>
      </div>

      <div>
        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-muted-gray mb-space-xs">
          Imágenes Actuales:
        </label>
        {pelicula.fotos && pelicula.fotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-space-sm">
            {pelicula.fotos.map((foto, indice) => (
              <div
                key={foto.id}
                className="flex flex-col bg-card-surface p-1 shadow-[2px_2px_0px_#000000] rounded"
                style={{ border: '2px solid #000000' }}
              >
                <div className="h-24 w-full overflow-hidden bg-ink-black">
                  <img src={foto.url} alt={`Foto ${indice + 1}`} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-center py-[2px] text-muted-gray uppercase">PORTADA {indice + 1}</span>
                <button
                  type="button"
                  onClick={() => handleEliminar(foto.id)}
                  className="w-full text-error-container text-[11px] font-bold py-[2px] hover:bg-error-container hover:text-cream transition-colors uppercase cursor-pointer"
                  style={{ backgroundColor: '#fee2e2', border: '1px solid #93000a' }}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body-sm text-body-sm text-muted-gray italic">Sin fotos cargadas.</p>
        )}
      </div>

      <div className="pt-space-xs" style={{ borderTop: '1px solid rgba(107,114,128,0.2)' }}>
        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-ink-black mb-1">
          Subir Nueva Imagen:
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-xs">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setArchivo(e.target.files[0] || null)}
            className="flex-1 bg-card-surface text-ink-black font-body-sm text-body-sm px-space-sm py-[6px] focus:outline-none cursor-pointer file:mr-2 file:py-1 file:px-2 file:border file:border-black file:bg-cream file:text-ink-black file:font-bold file:text-xs file:uppercase file:cursor-pointer"
            style={{ border: '2px solid #000000', borderRadius: '4px' }}
          />
          <button
            type="button"
            onClick={handleAgregar}
            disabled={subiendo || !archivo}
            className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-[7px] shadow-[2px_2px_0px_#000000] uppercase font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            style={{ border: '2px solid #000000' }}
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            {subiendo ? 'Subiendo...' : 'Subir Foto'}
          </button>
        </div>
        {archivo && (
          <p className="mt-1 font-body-sm text-body-sm text-muted-gray">{archivo.name}</p>
        )}
      </div>
    </div>
  )
}

export default PanelFotos
