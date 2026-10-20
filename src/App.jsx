import { useState } from 'react'
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

function App() {
  const [token, setToken] = useState(null)
  const [usuario, setUsuario] = useState(null)

  function handleLogin(nuevoToken, nuevoUsuario) {
    setToken(nuevoToken)
    setUsuario(nuevoUsuario)
  }

  function handleLogout() {
    setToken(null)
    setUsuario(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navigation usuario={usuario} onLogout={handleLogout} />
      <main className="w-full pt-[72px] flex-1">
        <Routes>
          <Route path="/" element={<Catalogo token={token} usuario={usuario} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/registro" element={<Registro onLogin={handleLogin} />} />
          <Route path="/carrito" element={<Carrito token={token} />} />
          <Route path="/mis-ordenes" element={<MisOrdenes token={token} />} />
          <Route path="/mis-peliculas" element={<MisPeliculas token={token} usuario={usuario} />} />
          <Route path="/mi-perfil" element={<MiPerfil token={token} usuario={usuario} onActualizarUsuario={setUsuario} />} />
          <Route path="/categorias" element={<Categorias token={token} />} />
          <Route path="/usuarios" element={<Usuarios token={token} />} />
          <Route path="/ordenes" element={<OrdenesAdmin token={token} />} />
          <Route path="/pelicula" element={<DetallePelicula token={token} usuario={usuario} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
