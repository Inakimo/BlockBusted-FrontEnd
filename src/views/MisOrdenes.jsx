import { useState, useEffect } from 'react'
import './MisOrdenes.css'

const URL_BASE = 'http://localhost:4002'

function MisOrdenes({ token }) {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  function cargarOrdenes() {
    setCargando(true)
    setError(null)

    fetch(`${URL_BASE}/api/ordenes`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          setError('No se pudieron cargar las órdenes.')
          setCargando(false)
          return
        }
        return response.json().then((data) => {
          setOrdenes(data)
          setCargando(false)
        })
      })
      .catch((err) => {
        console.error('Error al cargar órdenes', err)
        setError('Error de conexión.')
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarOrdenes()
  }, [])

  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr)
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const anio = fecha.getFullYear()
    return `${dia}/${mes}/${anio}`
  }

  if (cargando) return <p className="estado-mensaje">Cargando órdenes...</p>
  if (error) return <p className="estado-error">{error}</p>

  return (
    <section>
      <h1 className="ordenes-titulo">Mis órdenes</h1>

      {ordenes.length === 0 ? (
        <p className="estado-mensaje">Todavía no realizaste ninguna compra.</p>
      ) : (
        <div className="ordenes-lista">
          {ordenes.map((orden) => (
            <div key={orden.id} className="orden-card">
              <div className="orden-encabezado">
                <div className="orden-meta">
                  <span className="orden-id">Orden #{orden.id}</span>
                  <span className="orden-fecha">{formatearFecha(orden.fecha)}</span>
                </div>
                <span className="orden-total">${orden.total}</span>
              </div>

              <div className="orden-detalles">
                <table className="detalles-tabla">
                  <thead>
                    <tr>
                      <th>Película</th>
                      <th>Cant.</th>
                      <th>Precio unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orden.detalles.map((detalle) => (
                      <tr key={detalle.id}>
                        <td>{detalle.pelicula && detalle.pelicula.titulo}</td>
                        <td>{detalle.cantidad}</td>
                        <td>${detalle.precioUnitario}</td>
                        <td>${detalle.precioUnitario * detalle.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default MisOrdenes
