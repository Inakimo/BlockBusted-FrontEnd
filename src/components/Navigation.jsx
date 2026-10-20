import { Link } from 'react-router-dom'

function Navigation({ usuario, onLogout }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-black border-b-4 border-primary-container shadow-[0_4px_0_#a90111]">
      <div className="h-[72px] max-w-7xl mx-auto px-margin-sm lg:px-margin flex items-center justify-between gap-space-md">

        {/* Logo + brand */}
        <Link to="/" className="flex items-center gap-space-sm group transition-transform active:translate-x-0.5 active:translate-y-0.5">
          <div className="border-2 border-ink-black shadow-[2px_2px_0px_#ffd700] overflow-hidden rounded bg-ink-black flex items-center justify-center">
            <img src="/logo.png" alt="BlockBusted" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-lg text-headline-lg leading-none tracking-wider text-primary-container drop-shadow-[2px_2px_0_#a90111] group-hover:text-primary transition-colors">
              BLOCKBUSTED
            </span>
            <span className="font-label-sm text-label-sm tracking-widest text-cream uppercase -mt-1 hidden sm:block">
              Retro Video Club
            </span>
          </div>
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
              <Link to="/carrito" className="font-label-md text-label-md tracking-wider text-cream uppercase hover:text-primary-container transition-colors">
                Carrito
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
