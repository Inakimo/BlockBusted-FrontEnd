import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
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
    <div style={{ minHeight: '100vh', backgroundColor: '#0F0E17', color: '#FFF8E7' }}>
      <Navigation usuario={usuario} onLogout={handleLogout} />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
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
    </div>
  )
}

export default App
