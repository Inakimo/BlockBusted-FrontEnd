import { Link } from 'react-router-dom'

function Navigation({ usuario, onLogout, cantidadCarrito }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0b12] border-b-[3px] border-black shadow-[0_4px_0px_#000000]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Logo + Badge */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            alt="BlockBusted Logo"
            className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJQ7ZBplp5PY66mgtjxcb1j7KDvbfJGTw3Aoq4MRbEWpL4a1X_nI8InaeSORLNB7na6PAR5RNi8YqMl_CWKVbJQGJy5LHbze5uM-C007J-sWT6rcwqcSLNxs8Bms09pJ2Mw7_Fqn0Wl7EKqm3TG81zsQAfgT0JuV-MfvP4t3s1dNMmkqqI0VilFHJdpvTP5OLmMiKumrMkup6aP-G2SxgioUoT19iN_NJ7PPn1wa4bznNYYvjDiXKE"
            onError={(e) => {
              e.currentTarget.src = '/logo.png'
            }}
          />
          <span className="hidden sm:inline-block bg-comic-red text-cream font-montserrat font-black text-xs px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] rotate-[-3deg] uppercase tracking-wider">
            VHS LIVE
          </span>
        </Link>

        {/* Navigation & Auth */}
        <nav className="flex items-center gap-3 sm:gap-6 flex-wrap justify-end">
          <Link
            to="/catalogo"
            className="font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-yellow transition-colors tracking-wide"
          >
            Catálogo
          </Link>

          {!usuario && (
            <>
              <Link
                to="/login"
                className="font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-yellow transition-colors tracking-wide"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="inline-flex items-center justify-center font-montserrat font-extrabold text-sm uppercase bg-comic-yellow text-ink-black px-5 py-2 rounded-full border-[3px] border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000000] transition-all"
              >
                Registrarse
              </Link>
            </>
          )}

          {usuario && usuario.role === 'COMPRADOR' && (
            <>
              <Link
                to="/carrito"
                className="relative font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-yellow transition-colors tracking-wide inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                <span>Carrito</span>
                {cantidadCarrito > 0 && (
                  <span
                    className="ml-1 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-comic-red text-cream font-montserrat font-black text-xs leading-none shadow-[2px_2px_0px_#000000]"
                    style={{ border: '2px solid #000000', borderRadius: '999px' }}
                  >
                    {cantidadCarrito}
                  </span>
                )}
              </Link>
              <Link
                to="/mis-ordenes"
                className="font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-yellow transition-colors tracking-wide"
              >
                Mis órdenes
              </Link>
            </>
          )}

          {usuario && usuario.role === 'VENDEDOR' && (
            <Link
              to="/mis-peliculas"
              className="font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-yellow transition-colors tracking-wide"
            >
              Mis películas
            </Link>
          )}

          {usuario && usuario.role === 'ADMIN' && (
            <>
              <Link
                to="/categorias"
                className="font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-yellow transition-colors tracking-wide"
              >
                Categorías
              </Link>
              <Link
                to="/usuarios"
                className="font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-yellow transition-colors tracking-wide"
              >
                Usuarios
              </Link>
              <Link
                to="/ordenes"
                className="font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-yellow transition-colors tracking-wide"
              >
                Órdenes
              </Link>
            </>
          )}

          {usuario && (
            <>
              <Link
                to="/mi-perfil"
                className="font-montserrat font-bold text-sm text-comic-yellow hover:text-cream uppercase transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                {usuario.username}
              </Link>
              <button
                onClick={onLogout}
                className="font-montserrat font-bold text-sm uppercase text-cream hover:text-comic-red transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
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
