import { Link } from 'react-router-dom'

function Navigation({ usuario, onLogout, cantidadCarrito }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-black border-b-4 border-primary-container shadow-[0_4px_0_#a90111]">
      <div className="h-[72px] max-w-7xl mx-auto px-margin-sm lg:px-margin flex items-center justify-between gap-space-md">

        {/* Logo */}
        <Link to="/" className="flex items-center group transition-transform active:translate-x-0.5 active:translate-y-0.5">
          <img src="/logo.png" alt="BlockBusted" className="h-16 w-auto object-contain drop-shadow-[2px_2px_0px_#a90111] group-hover:scale-105 transition-transform" />
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-space-md lg:gap-space-lg">
          <Link to="/" className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors">
            Catálogo
          </Link>

          {!usuario && (
            <>
              <Link to="/login" className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors">
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="bg-primary-container text-ink-black font-label-md text-label-md px-space-md py-space-xs rounded-full border-[3px] border-ink-black shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000] transition-all uppercase"
              >
                Registrarse
              </Link>
            </>
          )}

          {usuario && usuario.role === 'COMPRADOR' && (
            <>
              <Link to="/carrito" className="relative font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                <span>Carrito</span>
                {cantidadCarrito > 0 && (
                  <span
                    className="ml-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 bg-secondary-container text-cream font-label-sm text-label-sm leading-none shadow-[2px_2px_0px_#000000]"
                    style={{ border: '2px solid #000000', borderRadius: '999px' }}
                  >
                    {cantidadCarrito}
                  </span>
                )}
              </Link>
              <Link to="/mis-ordenes" className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors">
                Mis órdenes
              </Link>
            </>
          )}

          {usuario && usuario.role === 'VENDEDOR' && (
            <Link to="/mis-peliculas" className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors">
              Mis películas
            </Link>
          )}

          {usuario && usuario.role === 'ADMIN' && (
            <>
              <Link to="/categorias" className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors">
                Categorías
              </Link>
              <Link to="/usuarios" className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors">
                Usuarios
              </Link>
              <Link to="/ordenes" className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors">
                Órdenes
              </Link>
            </>
          )}

          {usuario && (
            <>
              <Link to="/mi-perfil" className="font-label-md text-label-md tracking-wider text-primary-container uppercase hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">badge</span>
                {usuario.username}
              </Link>
              <button
                onClick={onLogout}
                className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-secondary-container transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Salir
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navigation
