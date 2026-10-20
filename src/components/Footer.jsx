function Footer() {
  return (
    <footer className="w-full bg-[#0a0910] border-t-[4px] border-black pt-10 pb-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Footer Ticket Strip */}
        <div className="bg-cream text-ink-black border-[3px] border-black shadow-[6px_6px_0px_#000000] p-6 mb-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b-2 border-dashed border-black pb-4 mb-4">
            <div className="md:col-span-8 flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-comic-red text-cream font-montserrat text-[10px] px-2 py-0.5 border border-black uppercase font-bold tracking-wider">
                  ADMITE 1 CINÉFILO
                </span>
                <span className="font-montserrat text-[11px] text-muted-gray tracking-widest uppercase">
                  TICKET DE SOCIO #BB-80S-404
                </span>
              </div>
              <h3 className="font-bangers text-2xl text-ink-black tracking-wide leading-tight uppercase">
                BLOCK BUSTED VIDEO CLUB &amp; THEATER
              </h3>
              <p className="font-montserrat text-xs text-muted-gray">
                El santuario definitivo del celuloide serie B, VHS desgastados y joyas olvidadas de medianoche.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end items-center">
              <div className="bg-comic-yellow border-2 border-black shadow-[3px_3px_0px_#000000] px-4 py-2 text-center">
                <span className="block font-bangers text-xl text-ink-black leading-tight">RETRO-PASS</span>
                <span className="block font-montserrat text-[10px] text-ink-black uppercase font-black">ILIMITADO</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-montserrat text-xs text-ink-black font-bold text-center sm:text-left">
              AVISO: ¡Por favor rebobine sus cintas antes de devolverlas a la ranura exterior!
            </p>
            <div className="flex items-center gap-2 text-xs font-montserrat">
              <a className="text-ink-black uppercase underline hover:text-comic-red transition-colors" href="#cartelera">
                Política de Rebobinado
              </a>
              <span className="text-ink-black font-bold">•</span>
              <a className="text-ink-black uppercase underline hover:text-comic-red transition-colors" href="#por-que">
                Términos del Club
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t-2 border-[#242233] pt-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-comic-yellow text-xl">local_movies</span>
            <span className="font-bangers text-lg text-comic-yellow tracking-wider uppercase">
              BLOCK BUSTED MARQUEE © 2024
            </span>
          </div>
          <p className="font-montserrat text-xs text-[#8E889B] text-center md:text-left">
            Inspirado en la era dorada del videoclub de barrio y los cómics de pulpa. Ningún rollo VHS fue dañado durante la creación de este portal.
          </p>
          <div className="flex items-center gap-2">
            <a
              className="w-8 h-8 flex items-center justify-center bg-surface-dark border-2 border-black shadow-[2px_2px_0px_#FFD700] hover:bg-comic-yellow hover:text-ink-black transition-all"
              href="#"
              aria-label="Compartir"
            >
              <span className="material-symbols-outlined text-base">share</span>
            </a>
            <a
              className="w-8 h-8 flex items-center justify-center bg-surface-dark border-2 border-black shadow-[2px_2px_0px_#FFD700] hover:bg-comic-yellow hover:text-ink-black transition-all"
              href="#"
              aria-label="Videos"
            >
              <span className="material-symbols-outlined text-base">videocam</span>
            </a>
            <a
              className="w-8 h-8 flex items-center justify-center bg-surface-dark border-2 border-black shadow-[2px_2px_0px_#FFD700] hover:bg-comic-yellow hover:text-ink-black transition-all"
              href="#"
              aria-label="Foro"
            >
              <span className="material-symbols-outlined text-base">forum</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
