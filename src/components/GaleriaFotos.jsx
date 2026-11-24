import { useState } from 'react'

function GaleriaFotos({ fotos, titulo, tieneDescuento, descuentoPorcentaje }) {
  const [fotoActiva, setFotoActiva] = useState(0)

  return (
    <div
      className="bg-card-surface shadow-[6px_6px_0px_#000000] p-space-sm relative"
      style={{ border: '4px solid #000000', borderRadius: '10px' }}
    >
      <div
        className="relative w-full bg-ink-black overflow-hidden"
        style={{ border: '3px solid #000000', borderRadius: '4px', aspectRatio: '3/4' }}
      >
        {fotos ? (
          <img src={fotos[fotoActiva].url} alt={titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container text-[80px]">movie</span>
          </div>
        )}
        {tieneDescuento && (
          <div
            className="absolute top-2 right-2 bg-secondary-container text-cream font-label-md px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase"
            style={{ border: '2px solid #000000', transform: 'rotate(4deg)' }}
          >
            -{descuentoPorcentaje}%
          </div>
        )}
      </div>

      {fotos && fotos.length > 1 && (
        <div className="mt-space-xs grid grid-cols-4 gap-space-xs">
          {fotos.map((foto, indice) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => setFotoActiva(indice)}
              className={`overflow-hidden shadow-[1px_1px_0_#000] aspect-square cursor-pointer ${indice === fotoActiva ? 'ring-2 ring-primary-container' : ''}`}
              style={{ border: '2px solid #000000', borderRadius: '3px' }}
            >
              <img src={foto.url} alt={`Foto ${indice + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default GaleriaFotos
