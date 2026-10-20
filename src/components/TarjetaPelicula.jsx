import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TarjetaPelicula.css'

function TarjetaPelicula({ pelicula, token, usuario, onAgregarAlCarrito }) {
  const [cantidad, setCantidad] = useState(1)
  const navigate = useNavigate()

  function handleVerDetalle() {
    navigate('/pelicula', { state: { peliculaId: pelicula.id } })
  }

  const primeraFoto = pelicula.fotos && pelicula.fotos.length > 0 ? pelicula.fotos[0].url : null
  const tieneDescuento = pelicula.descuentoPorcentaje > 0
  const precioFinal = pelicula.precio - pelicula.precio * pelicula.descuentoPorcentaje / 100

  function handleAgregar() {
    onAgregarAlCarrito(pelicula.id, cantidad)
  }

  return (
    <article className="tarjeta">
      <div className="tarjeta-imagen" onClick={handleVerDetalle} style={{ cursor: 'pointer' }}>
        {primeraFoto ? (
          <img src={primeraFoto} alt={pelicula.titulo} className="tarjeta-img" />
        ) : (
          <div className="tarjeta-sin-imagen">🎬</div>
        )}
        {tieneDescuento && (
          <span className="tarjeta-badge">-{pelicula.descuentoPorcentaje}%</span>
        )}
      </div>

      <div className="tarjeta-cuerpo">
        <h2 className="tarjeta-titulo" onClick={handleVerDetalle} style={{ cursor: 'pointer' }}>{pelicula.titulo}</h2>

        <p className="tarjeta-categoria">
          {pelicula.categoria && pelicula.categoria.descripcion}
        </p>

        <div className="tarjeta-precios">
          {tieneDescuento ? (
            <>
              <span className="precio-original">${pelicula.precio}</span>
              <span className="precio-final">${precioFinal}</span>
            </>
          ) : (
            <span className="precio-final">${pelicula.precio}</span>
          )}
        </div>

        <p className="tarjeta-stock">
          {pelicula.stock > 0 ? `Stock: ${pelicula.stock}` : 'Sin stock'}
        </p>

        {usuario && usuario.role === 'COMPRADOR' && (
          <div className="tarjeta-accion">
            {pelicula.stock > 0 ? (
              <>
                <input
                  type="number"
                  min="1"
                  max={pelicula.stock}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="tarjeta-input"
                />
                <button onClick={handleAgregar} className="tarjeta-btn">
                  Agregar al carrito
                </button>
              </>
            ) : (
              <p className="tarjeta-sin-stock">Sin stock</p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default TarjetaPelicula
