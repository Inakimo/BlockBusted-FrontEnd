import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import Catalogo from './views/Catalogo.jsx'
import Login from './views/Login.jsx'
import Registro from './views/Registro.jsx'
import Carrito from './views/Carrito.jsx'
import MisOrdenes from './views/MisOrdenes.jsx'
import MisPeliculas from './views/MisPeliculas.jsx'
import MiPerfil from './views/MiPerfil.jsx'
import Categorias from './views/Categorias.jsx'
import Usuarios from './views/Usuarios.jsx'
import OrdenesAdmin from './views/OrdenesAdmin.jsx'
import DetallePelicula from './views/DetallePelicula.jsx'

const URL_BASE = 'http://localhost:4002'

function App() {
  const [token, setToken] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [cantidadCarrito, setCantidadCarrito] = useState(0)

  function handleLogin(nuevoToken, nuevoUsuario) {
    setToken(nuevoToken)
    setUsuario(nuevoUsuario)
  }

  function handleLogout() {
    setToken(null)
    setUsuario(null)
    setCantidadCarrito(0)
  }

  function recargarCantidadCarrito() {
    if (!token || !usuario || usuario.role !== 'COMPRADOR') return

    fetch(`${URL_BASE}/api/carrito`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) return
        return response.json().then((data) => {
          const items = data && data.items ? data.items : []
          setCantidadCarrito(items.length)
        })
      })
      .catch((err) => { console.error('Error al cargar cantidad del carrito', err) })
  }

  useEffect(() => {
    recargarCantidadCarrito()
  }, [token, usuario])

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navigation usuario={usuario} onLogout={handleLogout} cantidadCarrito={cantidadCarrito} />
      <main className="w-full pt-[72px] flex-1">
        <Routes>
          <Route path="/" element={<Catalogo token={token} usuario={usuario} onCarritoActualizado={recargarCantidadCarrito} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/registro" element={<Registro onLogin={handleLogin} />} />
          <Route path="/carrito" element={<Carrito token={token} onCarritoActualizado={recargarCantidadCarrito} />} />
          <Route path="/mis-ordenes" element={<MisOrdenes token={token} />} />
          <Route path="/mis-peliculas" element={<MisPeliculas token={token} usuario={usuario} />} />
          <Route path="/mi-perfil" element={<MiPerfil token={token} usuario={usuario} onActualizarUsuario={setUsuario} />} />
          <Route path="/categorias" element={<Categorias token={token} />} />
          <Route path="/usuarios" element={<Usuarios token={token} />} />
          <Route path="/ordenes" element={<OrdenesAdmin token={token} />} />
          <Route path="/pelicula" element={<DetallePelicula token={token} usuario={usuario} onCarritoActualizado={recargarCantidadCarrito} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
