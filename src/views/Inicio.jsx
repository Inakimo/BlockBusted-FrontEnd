import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const URL_BASE = 'http://localhost:4002'

const VHS_FORMATS = ['VHS PAL-B', 'BETAMAX HD', 'VHS MONO', 'VHS STEREO', 'VHS SP-MODE', 'BETAMAX SP', 'VHS HI-FI', 'VHS T-160']
const BADGE_LABELS = ['SERIE Z', 'CLÁSICO', 'PULP', 'HORROR', 'ACCIÓN', 'COMEDIA', 'SCI-FI', 'SUSPENSO']

function PosterPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#111]">
      <span className="material-symbols-outlined text-comic-yellow" style={{ fontSize: '64px' }}>movie</span>
    </div>
  )
}

function CardSkeleton({ dark }) {
  const base = dark ? 'bg-ink-black border-[3px] border-black shadow-[4px_4px_0px_#FFD700]' : 'bg-card-surface border-[3px] border-black shadow-[5px_5px_0px_#000000]'
  return (
    <div className={`${base} flex flex-col overflow-hidden animate-pulse`}>
      <div className={`aspect-[3/4] w-full ${dark ? 'bg-[#1a1a2e]' : 'bg-[#d0c9db]'}`} />
      <div className={`p-4 flex flex-col gap-3 ${dark ? '' : 'bg-cream'}`}>
        <div className={`h-3 w-2/3 rounded ${dark ? 'bg-[#333045]' : 'bg-[#c0b9cb]'}`} />
        <div className={`h-5 w-full rounded ${dark ? 'bg-[#2a273f]' : 'bg-[#b0a9bb]'}`} />
        <div className={`h-3 w-1/2 rounded ${dark ? 'bg-[#333045]' : 'bg-[#c0b9cb]'}`} />
      </div>
    </div>
  )
}

function Inicio() {
  const [peliculas, setPeliculas] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${URL_BASE}/api/peliculas`)
      .then(r => r.json())
      .then(data => {
        setPeliculas(Array.isArray(data) ? data : (data.content || []))
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  const principales = peliculas.slice(0, 4)
  const bside = peliculas.slice(4, 8)

  return (
    <div className="w-full bg-comic-bg text-cream font-montserrat">
      {/* MARQUEE CELLULOID TICKER */}
      <div className="w-full bg-comic-yellow border-b-[3px] border-black py-2 overflow-hidden shadow-[0_3px_0px_#000000] relative z-20">
        <div
          className="flex items-center gap-16 whitespace-nowrap font-montserrat text-xs sm:text-sm font-black text-ink-black uppercase tracking-widest"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center gap-16 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="text-comic-red">★</span> NUEVOS ESTRENOS EN VHS &amp; BETAMAX <span className="text-comic-red">★</span>
              </span>
              <span className="flex items-center gap-1.5">
                📼 REBOBINE SUS CINTAS O COBRAREMOS $2.00 DE PENALIZACIÓN
              </span>
              <span className="flex items-center gap-1.5">
                💥 100% LIBRE DE CRÍTICA ESPECIALIZADA Y BUEN GUSTO
              </span>
            </span>
          ))}
          <span className="hidden lg:inline-flex items-center gap-1.5">
            🍿 PALOMITAS CON MANTEQUILLA RADIACTIVA A SOLO $0.50
          </span>
        </div>
      </div>

      {/* HERO PRESENTATION */}
      <section className="relative w-full overflow-hidden bg-comic-bg pt-12 pb-16 px-4 md:px-8 border-b-[4px] border-black">
        {/* Retro Halftone Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFD700_2px,transparent_2px)] [background-size:18px_18px]" />

        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Retro Comic Banner */}
          <div className="inline-flex items-center gap-2 bg-comic-red text-cream px-4 py-1 border-[3px] border-black shadow-[4px_4px_0px_#000000] rotate-[-1.5deg] mb-6">
            <span className="material-symbols-outlined text-comic-yellow text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="font-montserrat text-xs sm:text-sm uppercase tracking-widest font-black">
              ★ BIENVENIDOS A BLOCK BUSTED ★ EL VIDEOCLUB MÁS CUTRE DE LA TIERRA
            </span>
            <span className="material-symbols-outlined text-comic-yellow text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>

          {/* Hero Title in Bangers Font */}
          <h1 className="font-bangers text-5xl sm:text-7xl lg:text-8xl text-cream tracking-wide uppercase leading-none drop-shadow-[5px_5px_0px_#000000] max-w-5xl mb-6">
            ¡PELÍCULAS QUE{' '}
            <span className="text-comic-yellow bg-ink-black px-3 py-0.5 border-[3px] border-comic-yellow inline-block rotate-[1.5deg] shadow-[4px_4px_0px_#E53935]">
              NUNCA DEBIERON
            </span>{' '}
            EXISTIR, PERO AQUÍ ESTÁN!
          </h1>

          {/* Feature Tags / Pills */}
          <div className="mb-6 flex flex-wrap justify-center items-center gap-3">
            <span className="bg-comic-yellow text-ink-black font-montserrat text-xs px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000000] uppercase font-black rotate-[-2deg]">
              📼 VHS SP-MODE STEREO
            </span>
            <span className="bg-comic-red text-cream font-montserrat text-xs px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000000] uppercase font-black rotate-[2deg]">
              💥 100% CUTRE-GARANTIZADO
            </span>
            <span className="bg-[#2a273f] text-comic-yellow font-montserrat text-xs px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000000] uppercase font-black rotate-[-1deg]">
              ⚠️ NO APTO PARA CINÉFILOS PEDANTES
            </span>
          </div>

          {/* Subtitle */}
          <p className="font-montserrat text-base sm:text-lg text-[#D0C9DB] max-w-2xl mb-8 leading-relaxed font-medium">
            El santuario definitivo del celuloide de contrabando, parodias de bajísimo presupuesto y desastres visuales grabados sobre cintas recicladas de telenovelas. Pasa, saca tu carnet y no toques los cabezales sucios.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/catalogo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-montserrat text-base uppercase bg-comic-yellow text-ink-black px-8 py-3.5 border-[3px] border-black shadow-[5px_5px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] transition-all font-black"
            >
              <span className="material-symbols-outlined text-xl">play_circle</span>
              EXPLORAR CATÁLOGO
            </Link>
            <a
              href="#por-que"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-montserrat text-base uppercase bg-card-surface text-ink-black px-8 py-3.5 border-[3px] border-black shadow-[5px_5px_0px_#E53935] hover:bg-cream hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#E53935] active:translate-x-[2px] active:translate-y-[2px] transition-all font-black"
            >
              <span className="material-symbols-outlined text-comic-red text-xl">videocam</span>
              CONOCER MÁS
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1: JOYAS DEL ESTANTE PRINCIPAL */}
      <section className="w-full bg-surface-darker border-b-[4px] border-black py-14 px-4 md:px-8" id="cartelera">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-block bg-comic-yellow text-ink-black font-montserrat text-xs px-2.5 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] uppercase font-black rotate-[-2deg] mb-2">
                ESTRENOS RECIÉN REBOBINADOS
              </div>
              <h2 className="font-bangers text-4xl sm:text-5xl text-cream uppercase tracking-wide">
                JOYAS DEL ESTANTE PRINCIPAL
              </h2>
              <p className="font-montserrat text-sm text-[#A09BAC]">
                Ediciones en celuloide manchado que la crítica oficial intentó quemar en la hoguera.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block bg-comic-red text-cream font-montserrat text-xs font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000000] uppercase">
                {principales.length} TÍTULOS DISPONIBLES EN SALA
              </span>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-1 bg-comic-yellow text-ink-black font-montserrat text-xs font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000000] uppercase hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                VER TODOS <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* 4 Primary Posters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cargando
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} dark={false} />)
              : principales.map((peli, i) => {
              const foto = peli.fotos && peli.fotos.length > 0 ? peli.fotos[0].url : null
              const tieneDto = peli.descuentoPorcentaje > 0
              const precioFinal = tieneDto ? Math.round(peli.precio - peli.precio * peli.descuentoPorcentaje / 100) : peli.precio
              return (
                <article
                  key={peli.id}
                  className="bg-card-surface text-ink-black border-[3px] border-black shadow-[5px_5px_0px_#000000] hover:translate-y-[-4px] hover:shadow-[7px_7px_0px_#FFD700] transition-all flex flex-col overflow-hidden cursor-pointer"
                  onClick={() => navigate('/pelicula', { state: { peliculaId: peli.id } })}
                >
                  <div className="relative bg-ink-black border-b-[3px] border-black overflow-hidden aspect-[3/4]">
                    {foto
                      ? <img alt={peli.titulo} className="w-full h-full object-cover" src={foto} />
                      : <PosterPlaceholder />
                    }
                    {tieneDto && (
                      <div className="absolute top-2 left-2 bg-comic-red text-cream font-montserrat text-[11px] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-black uppercase rotate-[-4deg]">
                        -{peli.descuentoPorcentaje}% DTO
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-comic-yellow text-ink-black font-montserrat text-[11px] px-2 py-0.5 border border-black font-extrabold uppercase">
                      {VHS_FORMATS[i % VHS_FORMATS.length]}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between bg-cream">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-montserrat text-xs text-muted-gray uppercase font-bold tracking-wider">
                          {peli.categoria?.descripcion || 'VIDEOCLUB'}
                        </span>
                        <span className="bg-comic-yellow text-ink-black px-2 py-0.5 font-montserrat text-xs font-black border border-black">
                          ${precioFinal}
                        </span>
                      </div>
                      <h3 className="font-bangers text-2xl text-ink-black leading-tight uppercase mb-2">
                        {peli.titulo}
                      </h3>
                      <div className="bg-card-surface border-2 border-black p-2 shadow-[2px_2px_0px_#000000] mb-3">
                        <p className="font-montserrat text-xs text-ink-black italic font-medium">
                          {peli.stock > 0 ? `Stock: ${peli.stock} unidades disponibles` : 'Sin stock actualmente'}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t-2 border-dashed border-gray-400 flex items-center justify-between">
                      <span className="font-montserrat text-xs text-comic-red uppercase font-extrabold">
                        CÓD: BB-{peli.id}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); navigate('/pelicula', { state: { peliculaId: peli.id } }) }}
                        className="bg-ink-black text-cream hover:bg-comic-yellow hover:text-ink-black font-montserrat text-xs px-3 py-1 border border-black uppercase font-bold transition-colors"
                      >
                        VER
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: COMIC PANELS (FILOSOFÍA) */}
      <section className="w-full bg-comic-bg py-14 px-4 md:px-8 border-b-[4px] border-black" id="por-que">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="bg-comic-red text-cream font-montserrat text-xs px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000000] uppercase font-black">
              NUESTRA FILOSOFÍA ANALÓGICA
            </span>
            <h2 className="font-bangers text-4xl sm:text-6xl text-comic-yellow uppercase tracking-wide mt-2">
              ¿POR QUÉ CONFIAR EN NUESTRA BASURA?
            </h2>
            <p className="font-montserrat text-sm sm:text-base text-[#D0C9DB] mt-2">
              En un mundo lleno de resolución 4K y sonido Dolby envolvente, nosotros defendemos el derecho inalienable a la cinta arrugada y los subtítulos desfasados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Panel #01 */}
            <div className="bg-card-surface text-ink-black border-[3px] border-black shadow-[6px_6px_0px_#000000] p-6 flex flex-col justify-between relative pt-8">
              <div className="absolute -top-3.5 left-4 bg-comic-yellow text-ink-black px-3 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-bangers text-lg uppercase font-bold rotate-[-3deg]">
                PANEL #01
              </div>
              <div>
                <div className="w-12 h-12 bg-comic-red text-cream border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">tv_off</span>
                </div>
                <h3 className="font-bangers text-2xl text-ink-black uppercase mb-2">
                  CINTAS 100% DESMAGNETIZADAS
                </h3>
                <p className="font-montserrat text-sm text-muted-gray mb-4">
                  Garantía absoluta de tracking inestable, bandas de estática horizontales y el inconfundible chirrido de cabezales que piden auxilio a gritos.
                </p>
              </div>
              <div className="bg-cream border border-black p-2 text-center">
                <span className="font-montserrat text-xs text-ink-black font-black uppercase">
                  ESTÁNDAR: VHS CHURRO-VISION
                </span>
              </div>
            </div>

            {/* Panel #02 */}
            <div className="bg-card-surface text-ink-black border-[3px] border-black shadow-[6px_6px_0px_#000000] p-6 flex flex-col justify-between relative pt-8">
              <div className="absolute -top-3.5 left-4 bg-comic-yellow text-ink-black px-3 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-bangers text-lg uppercase font-bold rotate-[2deg]">
                PANEL #02
              </div>
              <div>
                <div className="w-12 h-12 bg-[#2a273f] text-comic-yellow border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">record_voice_over</span>
                </div>
                <h3 className="font-bangers text-2xl text-ink-black uppercase mb-2">
                  DOBLAJES IMPROVISADOS
                </h3>
                <p className="font-montserrat text-sm text-muted-gray mb-4">
                  Todos los efectos especiales han sido doblados con la boca por nuestros becarios: explosiones con &apos;¡PUM!&apos;, disparos láser con &apos;¡PIU-PIU!&apos; y risas malévolas sin talento.
                </p>
              </div>
              <div className="bg-cream border border-black p-2 text-center">
                <span className="font-montserrat text-xs text-ink-black font-black uppercase">
                  SONIDO: MONO DE GARAJE
                </span>
              </div>
            </div>

            {/* Panel #03 */}
            <div className="bg-card-surface text-ink-black border-[3px] border-black shadow-[6px_6px_0px_#000000] p-6 flex flex-col justify-between relative pt-8">
              <div className="absolute -top-3.5 left-4 bg-comic-yellow text-ink-black px-3 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-bangers text-lg uppercase font-bold rotate-[-2deg]">
                PANEL #03
              </div>
              <div>
                <div className="w-12 h-12 bg-comic-yellow text-ink-black border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">alarm_on</span>
                </div>
                <h3 className="font-bangers text-2xl text-ink-black uppercase mb-2">
                  ALQUILER SIN PRISAS (CASI)
                </h3>
                <p className="font-montserrat text-sm text-muted-gray mb-4">
                  Tienes 48 horas completas para reunir a tus amigos y reírte hasta llorar. Si tardas un día más, te cobramos un recargo de bolsa de gusanitos rancios.
                </p>
              </div>
              <div className="bg-cream border border-black p-2 text-center">
                <span className="font-montserrat text-xs text-ink-black font-black uppercase">
                  POLÍTICA: REBOBINA O MUERE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LA CAJA FUERTE DE LA SERIE Z */}
      <section className="w-full bg-surface-darker border-b-[4px] border-black py-14 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-comic-red text-cream font-montserrat text-xs px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] uppercase font-bold mb-2">
                <span className="material-symbols-outlined text-sm">lock_open</span> CINTAS CLASIFICADAS: ZONA B
              </div>
              <h2 className="font-bangers text-4xl sm:text-5xl text-cream uppercase tracking-wide">
                LA CAJA FUERTE DE LA SERIE Z
              </h2>
            </div>
            <p className="font-montserrat text-xs sm:text-sm text-[#A09BAC] max-w-md">
              Copias rescatadas de rastros ambulantes, gasolineras abandonadas y sótanos de abuelas despistadas.
            </p>
          </div>

          {/* 4 B-Side Posters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cargando
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} dark={true} />)
              : bside.map((peli, i) => {
              const foto = peli.fotos && peli.fotos.length > 0 ? peli.fotos[0].url : null
              const precioFinal = peli.descuentoPorcentaje > 0
                ? Math.round(peli.precio - peli.precio * peli.descuentoPorcentaje / 100)
                : peli.precio
              return (
                <div
                  key={peli.id}
                  className="bg-ink-black border-[3px] border-black shadow-[4px_4px_0px_#FFD700] p-3 flex flex-col group cursor-pointer"
                  onClick={() => navigate('/pelicula', { state: { peliculaId: peli.id } })}
                >
                  <div className="relative overflow-hidden aspect-[3/4] border-2 border-[#333045] mb-3 bg-[#111]">
                    {foto
                      ? <img alt={peli.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={foto} />
                      : <PosterPlaceholder />
                    }
                    <span className="absolute top-2 right-2 bg-comic-red text-cream font-montserrat text-[10px] px-2 py-0.5 border border-black font-bold uppercase">
                      {peli.categoria?.descripcion || BADGE_LABELS[i % BADGE_LABELS.length]}
                    </span>
                  </div>
                  <h4 className="font-bangers text-xl text-cream uppercase mb-1">
                    {peli.titulo}
                  </h4>
                  <p className="font-montserrat text-xs text-[#A09BAC] mb-3 flex-1 leading-relaxed">
                    {peli.stock > 0 ? `${peli.stock} unidades en stock` : 'Sin stock'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#333045]">
                    <span className="font-montserrat text-xs text-comic-yellow font-black">${precioFinal} / DÍA</span>
                    <button
                      onClick={e => { e.stopPropagation(); navigate('/pelicula', { state: { peliculaId: peli.id } }) }}
                      className="font-montserrat text-xs text-cream uppercase underline hover:text-comic-yellow bg-transparent border-none cursor-pointer"
                    >
                      DETALLES
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: TESTIMONIOS (SPEECH BUBBLES) */}
      <section className="w-full bg-comic-bg py-14 px-4 md:px-8 border-b-[4px] border-black">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <span className="bg-comic-yellow text-ink-black font-montserrat text-xs px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000000] uppercase font-black">
              OPINIONES SIN CENSURA NI CRITERIO
            </span>
            <h2 className="font-bangers text-4xl sm:text-5xl text-cream uppercase tracking-wide mt-2">
              LO QUE DICEN NUESTROS SOCIOS DEL CLUB
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonio 1 */}
            <div className="flex flex-col items-start">
              <div className="bg-card-surface text-ink-black border-[3px] border-black shadow-[5px_5px_0px_#000000] p-5 rounded-lg relative mb-4 w-full">
                <p className="font-montserrat text-sm italic text-ink-black font-semibold">
                  &quot;Alquilé &apos;Termineitor&apos; pensando que era una comedia y terminé llorando cuando el vespino se quedó sin bujía. Es una obra maestra del cine involuntario.&quot;
                </p>
                <div className="absolute -bottom-3 left-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-card-surface" />
              </div>
              <div className="flex items-center gap-3 ml-3">
                <div className="w-10 h-10 bg-comic-yellow border-2 border-black flex items-center justify-center font-bangers text-lg text-ink-black font-bold">
                  MP
                </div>
                <div>
                  <span className="font-montserrat text-xs sm:text-sm text-cream block uppercase font-bold">
                    Manolo &apos;El Pausa&apos;
                  </span>
                  <span className="font-montserrat text-[11px] text-[#A09BAC]">
                    Socio #1024 • Experto en rebobinar a lápiz
                  </span>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="flex flex-col items-start">
              <div className="bg-card-surface text-ink-black border-[3px] border-black shadow-[5px_5px_0px_#000000] p-5 rounded-lg relative mb-4 w-full">
                <p className="font-montserrat text-sm italic text-ink-black font-semibold">
                  &quot;La cinta de los Cazafantasmas venía con un trozo de celo pegado en la ranura y grabada encima de una comunión. 10 de 10, volvería a alquilar.&quot;
                </p>
                <div className="absolute -bottom-3 left-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-card-surface" />
              </div>
              <div className="flex items-center gap-3 ml-3">
                <div className="w-10 h-10 bg-comic-red text-cream border-2 border-black flex items-center justify-center font-bangers text-lg font-bold">
                  CG
                </div>
                <div>
                  <span className="font-montserrat text-xs sm:text-sm text-cream block uppercase font-bold">
                    Clara Gómez
                  </span>
                  <span className="font-montserrat text-[11px] text-[#A09BAC]">
                    Socia #440 • Coleccionista de Betamax
                  </span>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="flex flex-col items-start">
              <div className="bg-card-surface text-ink-black border-[3px] border-black shadow-[5px_5px_0px_#000000] p-5 rounded-lg relative mb-4 w-full">
                <p className="font-montserrat text-sm italic text-ink-black font-semibold">
                  &quot;El encargado me amenazó con limpiarme las gafas con alcohol isopropílico si no devolvía Star Warts a tiempo. Un servicio al cliente insuperable.&quot;
                </p>
                <div className="absolute -bottom-3 left-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-card-surface" />
              </div>
              <div className="flex items-center gap-3 ml-3">
                <div className="w-10 h-10 bg-[#2a273f] text-comic-yellow border-2 border-black flex items-center justify-center font-bangers text-lg font-bold">
                  RT
                </div>
                <div>
                  <span className="font-montserrat text-xs sm:text-sm text-cream block uppercase font-bold">
                    Rafa &apos;Tracking&apos;
                  </span>
                  <span className="font-montserrat text-[11px] text-[#A09BAC]">
                    Socio #007 • Amante del cine de medianoche
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CALL TO ACTION (VINTAGE TICKET STUB) */}
      <section className="w-full bg-surface-darker py-14 px-4 md:px-8 border-b-[4px] border-black">
        <div className="max-w-[1080px] mx-auto">
          <div className="bg-cream text-ink-black border-[4px] border-black shadow-[8px_8px_0px_#000000] p-6 md:p-10 relative overflow-hidden">
            {/* Notches */}
            <div className="absolute -top-5 left-1/4 w-9 h-9 rounded-full bg-surface-darker border-b-[4px] border-black hidden sm:block" />
            <div className="absolute -bottom-5 left-1/4 w-9 h-9 rounded-full bg-surface-darker border-t-[4px] border-black hidden sm:block" />
            <div className="absolute -top-5 right-1/4 w-9 h-9 rounded-full bg-surface-darker border-b-[4px] border-black hidden sm:block" />
            <div className="absolute -bottom-5 right-1/4 w-9 h-9 rounded-full bg-surface-darker border-t-[4px] border-black hidden sm:block" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-comic-red text-cream font-montserrat text-xs px-2.5 py-0.5 border border-black uppercase font-black">
                    PASE OFICIAL DE MIEMBRO
                  </span>
                  <span className="font-montserrat text-xs text-muted-gray uppercase tracking-widest font-bold">
                    TICKET NO. 994-BLOCK-CUTRE
                  </span>
                </div>
                <h2 className="font-bangers text-3xl sm:text-4xl text-ink-black leading-tight uppercase font-black">
                  ¿LISTO PARA PERDER LA FE EN EL SÉPTIMO ARTE?
                </h2>
                <p className="font-montserrat text-sm text-muted-gray leading-relaxed max-w-xl">
                  Regístrate hoy mismo en el club. Recibe en tu buzón nuestra revista de fotocopias grapadas con las peores recomendaciones del mes y un carnet laminado que no sirve para nada pero queda genial en tu cartera.
                </p>
                <div className="flex items-center gap-4 pt-2 text-ink-black font-montserrat text-xs uppercase font-bold flex-wrap">
                  <span className="flex items-center gap-1">✓ SIN SUSCRIPCIONES RARAS</span>
                  <span className="flex items-center gap-1">✓ DEVOLUCIÓN POR RANURA</span>
                  <span className="flex items-center gap-1">✓ OLOR A CINTA VIEJA</span>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-black">
                <div className="w-full text-center">
                  <span className="block font-montserrat text-xs text-muted-gray uppercase font-bold mb-1">
                    CUOTA DE ENTRADA
                  </span>
                  <span className="block font-bangers text-5xl text-comic-red leading-none mb-3">
                    $0.00
                  </span>
                  <Link
                    to="/registro"
                    className="w-full inline-block font-montserrat text-sm uppercase bg-comic-yellow text-ink-black py-2.5 px-4 border-[3px] border-black shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] transition-all font-black"
                  >
                    SACAR CARNET AHORA
                  </Link>
                  <span className="block font-montserrat text-[11px] text-muted-gray mt-2 italic">
                    *Requiere promesa solemne de rebobinado.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Inicio
