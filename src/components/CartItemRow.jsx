function CartItemRow({ item, onCambiarCantidad, onQuitarItem }) {
  const peli = item.pelicula
  const precio = peli && peli.precio
  const descuento = peli && peli.descuentoPorcentaje
  const precioFinal = peli && descuento > 0 ? parseInt(precio - precio * descuento / 100) : precio
  const subtotal = precioFinal * item.cantidad
  const foto = peli && peli.fotos && peli.fotos.length > 0 && peli.fotos[0].url

  return (
    <article className="bg-card-surface text-ink-black p-space-md lg:p-space-lg shadow-[4px_4px_0_#000000] transition-all relative">
      {peli && descuento > 0 && (
        <div
          className="absolute -top-3 -right-3 z-10 bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-0.5 shadow-[2px_2px_0_#000000] uppercase tracking-wider flex items-center gap-1"
          style={{ transform: 'rotate(6deg)' }}
        >
          <span className="material-symbols-outlined text-label-sm">local_fire_department</span>
          {descuento}% OFF APLICADO
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-28 sm:h-36 h-48 bg-ink-black shadow-[3px_3px_0_#000000] flex-shrink-0 overflow-hidden">
          {foto ? (
            <img src={foto} alt={item.titulo} className="w-full h-full object-cover" />
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
              <p
                className="font-body-sm text-body-sm text-muted-gray text-xs mt-0.5"
                style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
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
                  <span className="font-label-sm text-label-sm text-muted-gray line-through text-xs">${precio}</span>
                  <span className="bg-primary text-on-primary font-label-sm text-[10px] px-1 shadow-[1px_1px_0_#000000] uppercase">
                    AHORRÁS ${precio - precioFinal} C/U
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-space-md pt-space-sm sm:pt-0 sm:pl-space-md">
          <div className="flex items-center shadow-[2px_2px_0_#000000] bg-cream">
            <button
              aria-label="Disminuir cantidad"
              type="button"
              onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
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
              onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
              className="w-8 h-8 flex items-center justify-center text-ink-black hover:bg-primary-container transition-colors active:translate-y-0.5 bg-cream border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          {peli && (
            <div className="text-right">
              <span className="font-label-sm text-[10px] text-muted-gray uppercase block tracking-wider">SUBTOTAL</span>
              <span className="font-headline-sm text-headline-sm text-ink-black font-bold tracking-tight leading-none">${subtotal}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => onQuitarItem(item.id)}
            className="text-secondary-container hover:text-ink-black font-label-sm text-label-sm uppercase flex items-center gap-1 transition-colors cursor-pointer py-1 bg-transparent border-none"
          >
            <span className="material-symbols-outlined text-label-md">delete</span>
            <span className="underline decoration-2 underline-offset-2">Quitar</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default CartItemRow
