import { Link } from 'react-router-dom'

function Inicio() {
  return (
    <div className="w-full bg-comic-bg text-cream font-montserrat">
      {/* MARQUEE CELLULOID TICKER */}
      <div className="w-full bg-comic-yellow border-b-[3px] border-black py-2 overflow-hidden shadow-[0_3px_0px_#000000] relative z-20">
        <div className="flex items-center justify-around gap-6 whitespace-nowrap font-montserrat text-xs sm:text-sm font-black text-ink-black uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="text-comic-red">★</span> NUEVOS ESTRENOS EN VHS &amp; BETAMAX{' '}
            <span className="text-comic-red">★</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            📼 REBOBINE SUS CINTAS O COBRAREMOS $2.00 DE PENALIZACIÓN
          </span>
          <span className="flex items-center gap-1.5">
            💥 100% LIBRE DE CRÍTICA ESPECIALIZADA Y BUEN GUSTO
          </span>
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
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
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

          {/* Weekend Banner Promo Box */}
          <div className="w-full max-w-3xl bg-surface-dark border-[3px] border-black shadow-[6px_6px_0px_#FFD700] p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-comic-red text-cream flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000000] font-bangers text-2xl shrink-0">
                !
              </div>
              <div>
                <span className="font-montserrat text-sm text-comic-yellow uppercase block font-black">
                  OFERTA DE FIN DE SEMANA: 3 CINTAS POR $30
                </span>
                <span className="font-montserrat text-xs sm:text-sm text-[#c8c2d6]">
                  Llévate dos parodias absurdas y te regalamos una cinta atascada de artes marciales rumanas.
                </span>
              </div>
            </div>
            <div className="bg-cream text-ink-black font-montserrat text-xs px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-black uppercase tracking-wider shrink-0 rotate-[1deg]">
              CÓDIGO: CUTRE80
            </div>
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
                4 TÍTULOS DISPONIBLES EN SALA
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
            {/* Movie 1: Star Warts */}
            <article className="bg-card-surface text-ink-black border-[3px] border-black shadow-[5px_5px_0px_#000000] hover:translate-y-[-4px] hover:shadow-[7px_7px_0px_#FFD700] transition-all flex flex-col overflow-hidden">
              <div className="relative bg-ink-black border-b-[3px] border-black overflow-hidden aspect-[3/4]">
                <img
                  alt="Star Warts: Una Nueva Esperanza Rota"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Uv3AQBzLooKxqRaZHrnewApZ0d98uNjncltoer7UY8-Bi6OvPY7FiMvk9WxzPxZ4tXJzqBp04gn5vGVf9W3AQHGFD2snmgAvJWtetF5QdbYn4hKWFZP_lePjK41sXWKPTv4hq3JEQLt2BaVjYs9B-lelsKgjPx4Hu-YtqP9PCKvbTUXLO-HcwtCdoPttachYDDsJ6Rm-xweqYqwQnYEZzBqnu92ZtEyL6q0myGhea_mcQ-jtazkEZOxGo"
                />
                <div className="absolute top-2 left-2 bg-comic-red text-cream font-montserrat text-[11px] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-black uppercase rotate-[-4deg]">
                  CIENCIA FICCIÓN CUTRE - 25% DTO
                </div>
                <div className="absolute bottom-2 right-2 bg-comic-yellow text-ink-black font-montserrat text-[11px] px-2 py-0.5 border border-black font-extrabold uppercase">
                  VHS PAL-B
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between bg-cream">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-montserrat text-xs text-muted-gray uppercase font-bold tracking-wider">
                      AÑO 1977-ISH
                    </span>
                    <span className="bg-comic-yellow text-ink-black px-2 py-0.5 font-montserrat text-xs font-black border border-black">
                      $14.99
                    </span>
                  </div>
                  <h3 className="font-bangers text-2xl text-ink-black leading-tight uppercase mb-2">
                    STAR WARTS: ESPERANZA ROTA
                  </h3>
                  <div className="bg-card-surface border-2 border-black p-2 shadow-[2px_2px_0px_#000000] mb-3">
                    <p className="font-montserrat text-xs text-ink-black italic font-medium">
                      &quot;¡La espada láser hace ruido de fluorescente de cocina roto!&quot;
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t-2 border-dashed border-gray-400 flex items-center justify-between">
                  <span className="font-montserrat text-xs text-comic-red uppercase font-extrabold">
                    DURACIÓN: 84 MIN
                  </span>
                  <Link
                    to="/catalogo"
                    className="bg-ink-black text-cream hover:bg-comic-yellow hover:text-ink-black font-montserrat text-xs px-3 py-1 border border-black uppercase font-bold transition-colors inline-block text-center"
                  >
                    ALQUILAR
                  </Link>
                </div>
              </div>
            </article>

            {/* Movie 2: Matrix Recargada de Más */}
            <article className="bg-card-surface text-ink-black border-[3px] border-black shadow-[5px_5px_0px_#000000] hover:translate-y-[-4px] hover:shadow-[7px_7px_0px_#FFD700] transition-all flex flex-col overflow-hidden">
              <div className="relative bg-ink-black border-b-[3px] border-black overflow-hidden aspect-[3/4]">
                <img
                  alt="Matrix Recargada de Más"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Xhivl7pcO9QsvGbn4AIUknOg8oFh5MwRelGt9LfI97QWNedXnltiwb58-RA8qLoKbRkVFjmMk9n-p8xRXCRw-1z0gX92nBwJZIWv3uxcfoNgDlXSIlbYnt0Rv6RUSiWyF40hzWXd5We0IinlxPl5Uqjl8Twtf9PFII0Egi20btAP73LdGO2RzxbJtAT_sbNor5RjDvdAtZbs4wQpbi_K-6i-tZK2g00C0DTgk9JFz9oHLVH4pZtbUNKy8"
                />
                <div className="absolute top-2 left-2 bg-comic-red text-cream font-montserrat text-[11px] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-black uppercase rotate-[-3deg]">
                  BAGUETTES VOLADORAS - 40% DTO
                </div>
                <div className="absolute bottom-2 right-2 bg-comic-yellow text-ink-black font-montserrat text-[11px] px-2 py-0.5 border border-black font-extrabold uppercase">
                  BETAMAX HD
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between bg-cream">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-montserrat text-xs text-muted-gray uppercase font-bold tracking-wider">
                      AÑO 2003 (RE-HECHA)
                    </span>
                    <span className="bg-comic-yellow text-ink-black px-2 py-0.5 font-montserrat text-xs font-black border border-black">
                      $15.00
                    </span>
                  </div>
                  <h3 className="font-bangers text-2xl text-ink-black leading-tight uppercase mb-2">
                    MATRIX RECARGADA DE MÁS
                  </h3>
                  <div className="bg-card-surface border-2 border-black p-2 shadow-[2px_2px_0px_#000000] mb-3">
                    <p className="font-montserrat text-xs text-ink-black italic font-medium">
                      &quot;Esquiva barras de pan con gabardina de plástico reciclado.&quot;
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t-2 border-dashed border-gray-400 flex items-center justify-between">
                  <span className="font-montserrat text-xs text-comic-red uppercase font-extrabold">
                    DURACIÓN: 102 MIN
                  </span>
                  <Link
                    to="/catalogo"
                    className="bg-ink-black text-cream hover:bg-comic-yellow hover:text-ink-black font-montserrat text-xs px-3 py-1 border border-black uppercase font-bold transition-colors inline-block text-center"
                  >
                    ALQUILAR
                  </Link>
                </div>
              </div>
            </article>

            {/* Movie 3: Termineitor: Juicio Final Express */}
            <article className="bg-card-surface text-ink-black border-[3px] border-black shadow-[5px_5px_0px_#000000] hover:translate-y-[-4px] hover:shadow-[7px_7px_0px_#FFD700] transition-all flex flex-col overflow-hidden">
              <div className="relative bg-ink-black border-b-[3px] border-black overflow-hidden aspect-[3/4]">
                <img
                  alt="Termineitor: Juicio Final Express"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Wbx1lUhZHdIdaCSUu3jqrqm6YA-sAH4Wsb7aYLk8jUUlFwW3G_PQvEnTNA-5uCTLPUwBysfusDxu7dpgyGCXkFSNcdu7uAgaeUBGRRG6nUAtGh_vPl42m-Ly-6lSRN1U-YOecxag8mKNB6W_U7VFdBtzAcJMG1sQ4GPiMfnOO1XZLqV52Fog7M6NtshXjnUc-foOKjeROarsMumnq7zjeIrZ8vHfLUPVx-q8flOrW_KKVoE5UY0SyWkHc"
                />
                <div className="absolute top-2 left-2 bg-comic-red text-cream font-montserrat text-[11px] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-black uppercase rotate-[-5deg]">
                  EN VESPINO - 10% DTO
                </div>
                <div className="absolute bottom-2 right-2 bg-comic-yellow text-ink-black font-montserrat text-[11px] px-2 py-0.5 border border-black font-extrabold uppercase">
                  VHS MONO
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between bg-cream">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-montserrat text-xs text-muted-gray uppercase font-bold tracking-wider">
                      AÑO 1991 (CASI)
                    </span>
                    <span className="bg-comic-yellow text-ink-black px-2 py-0.5 font-montserrat text-xs font-black border border-black">
                      $15.75
                    </span>
                  </div>
                  <h3 className="font-bangers text-2xl text-ink-black leading-tight uppercase mb-2">
                    TERMINEITOR: JUICIO FINAL
                  </h3>
                  <div className="bg-card-surface border-2 border-black p-2 shadow-[2px_2px_0px_#000000] mb-3">
                    <p className="font-montserrat text-xs text-ink-black italic font-medium">
                      &quot;¡Volveré... en cuanto le ponga dos euros de mezcla al vespino!&quot;
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t-2 border-dashed border-gray-400 flex items-center justify-between">
                  <span className="font-montserrat text-xs text-comic-red uppercase font-extrabold">
                    DURACIÓN: 96 MIN
                  </span>
                  <Link
                    to="/catalogo"
                    className="bg-ink-black text-cream hover:bg-comic-yellow hover:text-ink-black font-montserrat text-xs px-3 py-1 border border-black uppercase font-bold transition-colors inline-block text-center"
                  >
                    ALQUILAR
                  </Link>
                </div>
              </div>
            </article>

            {/* Movie 4: Cazafantasmas de Barrio */}
            <article className="bg-card-surface text-ink-black border-[3px] border-black shadow-[5px_5px_0px_#000000] hover:translate-y-[-4px] hover:shadow-[7px_7px_0px_#FFD700] transition-all flex flex-col overflow-hidden">
              <div className="relative bg-ink-black border-b-[3px] border-black overflow-hidden aspect-[3/4]">
                <img
                  alt="Cazafantasmas de Barrio"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1U_4yUx-EfOgHllWe3OShGljEfX7ibKNd4YkGHbkv8l5_KA__cPm-C0EfPvqDbXfm8CEKAl8ah4O_SZnb7D8FjaV7HvwpSmc9NPOR4SFD_M79y8LlcIUOKH1FDb2DIuqyceYwpJOGl-bM6LmRLzIcozpmXUrRozNPKy_XQ16lPPj3yKrX0zBGmwiOxSIa7HItck2Hsz7JZW-6LPo3QmwRcoSqb2iMflig49eeZWDFAgqP2c1VXRYEOXYA"
                />
                <div className="absolute top-2 left-2 bg-comic-red text-cream font-montserrat text-[11px] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] font-black uppercase rotate-[3deg]">
                  ASPIRADORAS - 35% DTO
                </div>
                <div className="absolute bottom-2 right-2 bg-comic-yellow text-ink-black font-montserrat text-[11px] px-2 py-0.5 border border-black font-extrabold uppercase">
                  VHS STEREO
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between bg-cream">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-montserrat text-xs text-muted-gray uppercase font-bold tracking-wider">
                      AÑO 1984 BARATO
                    </span>
                    <span className="bg-comic-yellow text-ink-black px-2 py-0.5 font-montserrat text-xs font-black border border-black">
                      $13.65
                    </span>
                  </div>
                  <h3 className="font-bangers text-2xl text-ink-black leading-tight uppercase mb-2">
                    CAZAFANTASMAS DE BARRIO
                  </h3>
                  <div className="bg-card-surface border-2 border-black p-2 shadow-[2px_2px_0px_#000000] mb-3">
                    <p className="font-montserrat text-xs text-ink-black italic font-medium">
                      &quot;No cruces las aspiradoras, que salta el diferencial del bloque.&quot;
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t-2 border-dashed border-gray-400 flex items-center justify-between">
                  <span className="font-montserrat text-xs text-comic-red uppercase font-extrabold">
                    DURACIÓN: 91 MIN
                  </span>
                  <Link
                    to="/catalogo"
                    className="bg-ink-black text-cream hover:bg-comic-yellow hover:text-ink-black font-montserrat text-xs px-3 py-1 border border-black uppercase font-bold transition-colors inline-block text-center"
                  >
                    ALQUILAR
                  </Link>
                </div>
              </div>
            </article>
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
            {/* B-Side 1: Bat-Maníaco */}
            <div className="bg-ink-black border-[3px] border-black shadow-[4px_4px_0px_#FFD700] p-3 flex flex-col group">
              <div className="relative overflow-hidden aspect-[3/4] border-2 border-[#333045] mb-3 bg-[#111]">
                <img
                  alt="Bat-Maníaco: El Caballero Trasnochado"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WDhMGCPbQE6ng8wTutIeoamTwbcFlCzjdqbtuA6Jp_UAhzMC41-c4gws3BWiowbPe5yzfTvn0tBRJKHTuXLFER8Zek6hXB06uIpp2QwesvPJkSOorkRDnCnFySIacOWLl6ZGaeHHwIJDY05S3rJR845RlhK8ILuK9CDeMDF4JO2i4EulDS_CFQUQykqFl5BHgfungsybKrVr897R37-EEFsGw_8QuhI986b8h_74powEHqJ1FoZVyLRw"
                />
                <span className="absolute top-2 right-2 bg-comic-red text-cream font-montserrat text-[10px] px-2 py-0.5 border border-black font-bold uppercase">
                  SERIE Z
                </span>
              </div>
              <h4 className="font-bangers text-xl text-cream uppercase mb-1">
                BAT-MANÍACO: TRASNOCHADO
              </h4>
              <p className="font-montserrat text-xs text-[#A09BAC] mb-3 flex-1 leading-relaxed">
                Un vigilante con pijama viejo, insomnio severo y adicción al café recalentado de termo.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#333045]">
                <span className="font-montserrat text-xs text-comic-yellow font-black">$9.99 / DÍA</span>
                <Link to="/catalogo" className="font-montserrat text-xs text-cream uppercase underline hover:text-comic-yellow">
                  DETALLES
                </Link>
              </div>
            </div>

            {/* B-Side 2: Jurassic Pork */}
            <div className="bg-ink-black border-[3px] border-black shadow-[4px_4px_0px_#FFD700] p-3 flex flex-col group">
              <div className="relative overflow-hidden aspect-[3/4] border-2 border-[#333045] mb-3 bg-[#111]">
                <img
                  alt="Jurassic Pork: Parque Porcino"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WPTQ4CrxqhhbpcO9svxP9e8zv_OvZ-zrvV8piSUvw3ha9uLRivqom7Hq0298dYTGYXZuZKAFpP8Q9b0GHGAIaYdyzK1VW6kvQSmigSo0Nqj9ozcQXBAbI5BnbTK_1ImH2DSiKv9zY4wArs2sNASz1HY4MSBcubvmOGeT0HBQQ1nzqT8DfCHdVRdeZasc8hcoKOsTFB3HwihwOs85aOLca4cYJ1gdD_lS4NJppubiJRdFvFcR_zt4pvgK8"
                />
                <span className="absolute top-2 right-2 bg-comic-red text-cream font-montserrat text-[10px] px-2 py-0.5 border border-black font-bold uppercase">
                  CLÁSICO
                </span>
              </div>
              <h4 className="font-bangers text-xl text-cream uppercase mb-1">
                JURASSIC PORK: PARQUE PORCINO
              </h4>
              <p className="font-montserrat text-xs text-[#A09BAC] mb-3 flex-1 leading-relaxed">
                Cerdos gigantes de corral clonan embutidos ibéricos y siembran el pánico en la verbena.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#333045]">
                <span className="font-montserrat text-xs text-comic-yellow font-black">$11.20 / DÍA</span>
                <Link to="/catalogo" className="font-montserrat text-xs text-cream uppercase underline hover:text-comic-yellow">
                  DETALLES
                </Link>
              </div>
            </div>

            {/* B-Side 3: Pulp Friction */}
            <div className="bg-ink-black border-[3px] border-black shadow-[4px_4px_0px_#FFD700] p-3 flex flex-col group">
              <div className="relative overflow-hidden aspect-[3/4] border-2 border-[#333045] mb-3 bg-[#111]">
                <img
                  alt="Pulp Friction: Ficción Barata"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VJmYpcbY-G24R9XNFNLqP1poDWv8JPrHbpXsDKEDaNrgj-pnQnuTA3QMERSJEE06OfTTbW3R2o4oN9iYwYPNLPUBj_P42F0gMkRGxBJ9X_oLzJlt-M72cGdSeWjPW2wLsLRvihyRKBvwqaYt-AzLYBb6oKcHyuQd5XiaDGZu-EBhJGZsyZJkRtCFPl7ysI0nBalynAeDyJ6H8sYtYxgeVsOC1l7K8ZyAWnm3DAPwKmFR3_NrxOsqBjiyA"
                />
                <span className="absolute top-2 right-2 bg-comic-red text-cream font-montserrat text-[10px] px-2 py-0.5 border border-black font-bold uppercase">
                  PULP
                </span>
              </div>
              <h4 className="font-bangers text-xl text-cream uppercase mb-1">
                PULP FRICTION: FICCIÓN BARATA
              </h4>
              <p className="font-montserrat text-xs text-[#A09BAC] mb-3 flex-1 leading-relaxed">
                Dos matones en traje barato debaten durante dos horas sobre la salsa del cuarto de libra.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#333045]">
                <span className="font-montserrat text-xs text-comic-yellow font-black">$10.50 / DÍA</span>
                <Link to="/catalogo" className="font-montserrat text-xs text-cream uppercase underline hover:text-comic-yellow">
                  DETALLES
                </Link>
              </div>
            </div>

            {/* B-Side 4: Pesadilla en la Calle del Pan */}
            <div className="bg-ink-black border-[3px] border-black shadow-[4px_4px_0px_#FFD700] p-3 flex flex-col group">
              <div className="relative overflow-hidden aspect-[3/4] border-2 border-[#333045] mb-3 bg-[#111]">
                <img
                  alt="Pesadilla en la Calle del Pan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WcET7cDXqUSkowumkCMqXF9KFnE6dkOOLizWglZPoCGL3Mn194n2BFfxVWXgFGe6kHAQ3Kk90KmT-gLhCdkt0cIxKrfuWCsEy2zRaKv-_EwUMHNVC8qtyavxSgwFVlmFowS4yk-KbiOIPW6X_l7ZIOXzXH2jpoWSwv63dedo0_Vc35gmGk4dxs6MGwHXHVI1jAH4LroDsQmV9zfFHYweDvMevTYhJQlHJj8Dt2pCKLWLsjnKZTzZxaS8c"
                />
                <span className="absolute top-2 right-2 bg-comic-red text-cream font-montserrat text-[10px] px-2 py-0.5 border border-black font-bold uppercase">
                  HORROR
                </span>
              </div>
              <h4 className="font-bangers text-xl text-cream uppercase mb-1">
                PESADILLA: CALLE DEL PAN
              </h4>
              <p className="font-montserrat text-xs text-[#A09BAC] mb-3 flex-1 leading-relaxed">
                Un panadero siniestro con guantes de horno persigue a los noctámbulos con masa madre ácida.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#333045]">
                <span className="font-montserrat text-xs text-comic-yellow font-black">$8.75 / DÍA</span>
                <Link to="/catalogo" className="font-montserrat text-xs text-cream uppercase underline hover:text-comic-yellow">
                  DETALLES
                </Link>
              </div>
            </div>
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
