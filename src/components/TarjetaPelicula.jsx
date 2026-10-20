import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TarjetaPelicula({ pelicula, token, usuario, onAgregarAlCarrito }) {
  const [cantidad, setCantidad] = useState(1)
  const navigate = useNavigate()

  function handleVerDetalle() {
    navigate('/pelicula', { state: { peliculaId: pelicula.id } })
  }

  const primeraFoto = pelicula.fotos && pelicula.fotos.length > 0 ? pelicula.fotos[0].url : null
  const tieneDescuento = pelicula.descuentoPorcentaje > 0
  const precioFinal = parseInt(pelicula.precio - pelicula.precio * pelicula.descuentoPorcentaje / 100)

  function handleAgregar() {
    onAgregarAlCarrito(pelicula.id, cantidad)
  }

  return (
    <article
      className="bg-card-surface flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] group relative shadow-[4px_4px_0px_#000000]"
      style={{ border: '3px solid #000000', borderRadius: '12px' }}
    >
      {/* Discount pill badge */}
      {tieneDescuento && (
        <div
          className="absolute top-2 right-2 z-20 bg-primary-container text-ink-black font-headline-sm text-headline-sm px-space-xs py-0.5 shadow-[2px_2px_0px_#000000] uppercase transform rotate-2"
          style={{ border: '2px solid #000000', borderRadius: '9999px' }}
        >
          -{pelicula.descuentoPorcentaje}% DTO
        </div>
      )}

      {/* Media poster */}
      <div
        className="relative w-full h-[210px] overflow-hidden bg-ink-black cursor-pointer"
        onClick={handleVerDetalle}
        style={{ borderBottom: '3px solid #000000' }}
      >
        {primeraFoto ? (
          <img
            src={primeraFoto}
            alt={pelicula.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '64px' }}>
              movie
            </span>
          </div>
        )}
        <div
          className="absolute bottom-1 left-1 bg-ink-black text-cream font-label-sm text-label-sm px-1.5 py-0.5 uppercase"
          style={{ border: '1px solid #ffd700' }}
        >
          VHS HI-FI
        </div>
      </div>

      {/* Card body */}
      <div className="p-space-sm flex flex-col flex-1 gap-1">
        <span
          className="font-label-sm text-label-sm text-on-tertiary-container tracking-wider uppercase"
          style={{ fontWeight: 800 }}
        >
          {pelicula.categoria && pelicula.categoria.descripcion}
        </span>
        <h2
          onClick={handleVerDetalle}
          className="font-headline-md text-headline-md text-ink-black uppercase leading-none tracking-wide group-hover:text-secondary-container transition-colors cursor-pointer"
        >
          {pelicula.titulo}
        </h2>

        <div className="flex items-baseline gap-space-xs mt-1">
          {tieneDescuento ? (
            <>
              <span className="font-body-sm text-body-sm text-muted-gray line-through">
                ${pelicula.precio}
              </span>
              <span className="font-headline-md text-headline-md text-secondary-container leading-none">
                ${precioFinal}
              </span>
            </>
          ) : (
            <span className="font-headline-md text-headline-md text-secondary-container leading-none">
              ${pelicula.precio}
            </span>
          )}
        </div>

        <span className="font-body-sm text-body-sm text-muted-gray">
          {pelicula.stock > 0 ? `Stock: ${pelicula.stock} unidades` : 'Sin stock'}
        </span>

        {/* Action footer: only for COMPRADOR */}
        {usuario && usuario.role === 'COMPRADOR' && (
          <div className="mt-auto pt-space-xs flex items-center gap-space-xs">
            {pelicula.stock > 0 ? (
              <>
                <input
                  type="number"
                  min="1"
                  max={pelicula.stock}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="w-[50px] h-[38px] text-center font-label-md text-label-md text-ink-black bg-cream focus:outline-none focus:bg-primary-container"
                  style={{ border: '2px solid #000000', borderRadius: '4px' }}
                />
                <button
                  onClick={handleAgregar}
                  className="flex-1 h-[38px] bg-primary-container text-ink-black font-headline-sm text-headline-sm uppercase px-space-xs shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000] transition-all flex items-center justify-center gap-1 cursor-pointer"
                  style={{ border: '3px solid #000000', borderRadius: '4px' }}
                >
                  <span className="material-symbols-outlined text-label-lg">shopping_cart</span>
                  <span>ALQUILAR</span>
                </button>
              </>
            ) : (
              <p
                className="w-full text-center bg-secondary-container text-cream font-label-md text-label-md uppercase py-2 shadow-[2px_2px_0px_#000000]"
                style={{ border: '2px solid #000000', borderRadius: '4px' }}
              >
                Sin stock
              </p>
            )}
          </div>
        )}

        {/* Barcode flourish for non-COMPRADOR */}
        {!(usuario && usuario.role === 'COMPRADOR') && (
          <div className="mt-auto pt-space-xs flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-muted-gray tracking-widest">
              CÓD: BB-{pelicula.id}
            </span>
            <span className="font-label-sm text-label-sm text-ink-black uppercase">BE KIND REWIND</span>
          </div>
        )}
      </div>
    </article>
  )
}

export default TarjetaPelicula
