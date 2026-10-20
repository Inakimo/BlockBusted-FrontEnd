import { Link } from 'react-router-dom'
import './Navigation.css'

function Navigation({ usuario, onLogout }) {
  return (
    <header className="nav-header">
      <nav className="nav-inner">
        <Link to="/">
          <img src="/logo.png" alt="BlockBusted" className="nav-logo-img" />
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">Catálogo</Link>
          </li>

          {!usuario && (
            <>
              <li>
                <Link to="/login" className="nav-link">Iniciar sesión</Link>
              </li>
              <li>
                <Link to="/registro" className="nav-btn">Registrarse</Link>
              </li>
            </>
          )}

          {usuario && usuario.role === 'COMPRADOR' && (
            <>
              <li><Link to="/carrito" className="nav-link">Carrito</Link></li>
              <li><Link to="/mis-ordenes" className="nav-link">Mis órdenes</Link></li>
            </>
          )}

          {usuario && usuario.role === 'VENDEDOR' && (
            <li><Link to="/mis-peliculas" className="nav-link">Mis películas</Link></li>
          )}

          {usuario && usuario.role === 'ADMIN' && (
            <>
              <li><Link to="/categorias" className="nav-link">Categorías</Link></li>
              <li><Link to="/usuarios" className="nav-link">Usuarios</Link></li>
              <li><Link to="/ordenes" className="nav-link">Órdenes</Link></li>
            </>
          )}

          {usuario && (
            <>
              <li><Link to="/mi-perfil" className="nav-link">{usuario.username}</Link></li>
              <li>
                <button onClick={onLogout} className="nav-link nav-logout">Salir</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
