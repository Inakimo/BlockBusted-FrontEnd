import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Carrito.css'

const URL_BASE = 'http://localhost:4002'

function Carrito({ token }) {
  const [carrito, setCarrito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const navigate = useNavigate()

  function cargarCarrito() {
    setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/carrito`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudo cargar el carrito.')
          setCargando(false)
          return
        }
        return response.json().then((data) => {
          setCarrito(data)
          setCargando(false)
        })
      })
      .catch((err) => {
        console.error('Error al cargar carrito', err)
        setError('Error de conexión.')
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarCarrito()
  }, [])

  function handleCambiarCantidad(itemId, nuevaCantidad) {
    if (nuevaCantidad < 1) return

    fetch(`${URL_BASE}/api/carrito/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para modificar el carrito.'); return }
          return response.json().then((data) => { alert(data.message) })
        }
        cargarCarrito()
      })
      .catch((err) => { console.error('Error al cambiar cantidad', err) })
  }

  function handleQuitarItem(itemId) {
    fetch(`${URL_BASE}/api/carrito/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudo quitar el item.')
          return
        }
        cargarCarrito()
      })
      .catch((err) => { console.error('Error al quitar item', err) })
  }

  function handleVaciarCarrito() {
    fetch(`${URL_BASE}/api/carrito`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudo vaciar el carrito.')
          return
        }
        cargarCarrito()
      })
      .catch((err) => { console.error('Error al vaciar carrito', err) })
  }

  function handleConfirmarCompra() {
    setConfirmando(true)

    fetch(`${URL_BASE}/api/ordenes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) { alert('No tenés permiso para realizar la compra.'); setConfirmando(false); return }
          return response.json().then((data) => {
            alert(data.message || 'No se pudo confirmar la compra.')
            setConfirmando(false)
          })
        }
        return response.json().then(() => {
          navigate('/mis-ordenes')
        })
      })
      .catch((err) => {
        console.error('Error al confirmar compra', err)
        setConfirmando(false)
      })
  }

  if (cargando) return <p className="estado-mensaje">Cargando carrito...</p>
  if (error) return <p className="estado-error">{error}</p>

  const items = carrito && carrito.items ? carrito.items : []

  if (items.length === 0) {
    return (
      <section className="carrito-vacio">
        <p className="estado-mensaje">Tu carrito está vacío.</p>
      </section>
    )
  }

  return (
    <section className="carrito-contenedor">
      <div className="carrito-encabezado">
        <h1 className="carrito-titulo">Mi carrito</h1>
        <button onClick={handleVaciarCarrito} className="btn-secundario">
          Vaciar carrito
        </button>
      </div>

      <div className="carrito-lista">
        {items.map((item) => (
          <div key={item.id} className="carrito-item">
            <div className="item-info">
              <p className="item-titulo">{item.pelicula && item.pelicula.titulo}</p>
              <p className="item-meta">
                ${item.pelicula && item.pelicula.precio}
                {item.pelicula && item.pelicula.descuentoPorcentaje > 0 && ` · ${item.pelicula.descuentoPorcentaje}% dto`}
              </p>
            </div>

            <div className="item-controles">
              <button
                onClick={() => handleCambiarCantidad(item.id, item.cantidad - 1)}
                className="cantidad-btn"
              >
                −
              </button>
              <span className="cantidad-valor">{item.cantidad}</span>
              <button
                onClick={() => handleCambiarCantidad(item.id, item.cantidad + 1)}
                className="cantidad-btn"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleQuitarItem(item.id)}
              className="btn-quitar"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="carrito-pie">
        <button
          onClick={handleConfirmarCompra}
          disabled={confirmando}
          className="btn-primario"
        >
          {confirmando ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </div>
    </section>
  )
}

export default Carrito
