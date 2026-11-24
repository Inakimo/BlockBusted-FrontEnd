import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { restoreSession } from './store/authSlice'
import { fetchCantidadCarrito } from './store/carritoSlice'
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Inicio from './views/Inicio.jsx'
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
import Favoritos from './views/Favoritos.jsx'
import Toast from './components/Toast.jsx'

function App() {
  const dispatch = useDispatch()
  const { usuario, sesionLista } = useSelector((s) => s.auth)

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  useEffect(() => {
    if (usuario) dispatch(fetchCantidadCarrito())
  }, [usuario, dispatch])

  return (
    <div className="min-h-screen flex flex-col bg-comic-bg text-cream font-montserrat selection:bg-comic-yellow selection:text-ink-black">
      <Navigation />
      <main className="w-full pt-[72px] flex-1">
        {sesionLista ? (
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/carrito" element={
              <ProtectedRoute rolesPermitidos={['COMPRADOR']} redirectTo="/catalogo">
                <Carrito />
              </ProtectedRoute>
            } />
            <Route path="/favoritos" element={
              <ProtectedRoute rolesPermitidos={['COMPRADOR']} redirectTo="/catalogo">
                <Favoritos />
              </ProtectedRoute>
            } />
            <Route path="/mis-ordenes" element={
              <ProtectedRoute rolesPermitidos={['COMPRADOR']} redirectTo="/catalogo">
                <MisOrdenes />
              </ProtectedRoute>
            } />
            <Route path="/mis-peliculas" element={
              <ProtectedRoute rolesPermitidos={['VENDEDOR']} redirectTo="/catalogo">
                <MisPeliculas />
              </ProtectedRoute>
            } />
            <Route path="/mi-perfil" element={
              <ProtectedRoute redirectTo="/login">
                <MiPerfil />
              </ProtectedRoute>
            } />
            <Route path="/categorias" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']} redirectTo="/">
                <Categorias />
              </ProtectedRoute>
            } />
            <Route path="/usuarios" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']} redirectTo="/">
                <Usuarios />
              </ProtectedRoute>
            } />
            <Route path="/ordenes" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']} redirectTo="/">
                <OrdenesAdmin />
              </ProtectedRoute>
            } />
            <Route path="/pelicula" element={<DetallePelicula />} />
          </Routes>
        ) : (
          <div className="w-full py-space-xl flex items-center justify-center">
            <p className="font-headline-md text-headline-md text-cream uppercase">Restaurando sesión...</p>
          </div>
        )}
      </main>
      <Footer />
      <Toast />
    </div>
  )
}

export default App
