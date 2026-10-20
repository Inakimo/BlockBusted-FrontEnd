function Footer() {
  return (
    <footer className="w-full bg-ink-black border-t-4 border-primary-container shadow-[0_-4px_0_#a90111] pt-space-xl pb-space-lg mt-space-xl">
      <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-space-xl">

          <div className="md:col-span-2 space-y-space-sm">
            <div className="flex items-center gap-space-sm">
              <img src="/logo.png" alt="BlockBusted" className="h-20 w-auto object-contain drop-shadow-[3px_3px_0_#a90111]" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              Tu videoclub de confianza en línea. Las mejores joyas en VHS, Betamax y cartuchos retro con entrega directa a tu cueva de cinéfilo nostálgico. Rebobinar es educación.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <div className="bg-secondary-container text-cream font-label-sm text-label-sm px-space-sm py-0.5 border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase">
                BE KIND REWIND
              </div>
              <div className="bg-primary-container text-ink-black font-label-sm text-label-sm px-space-sm py-0.5 border-2 border-ink-black shadow-[2px_2px_0px_#000000] uppercase">
                HI-FI STEREO
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-headline-sm text-headline-sm text-cream uppercase mb-space-sm tracking-wide border-b-2 border-primary-container pb-1 inline-block">
              Pasillos
            </h3>
            <ul className="space-y-space-xs">
              <li className="font-body-sm text-body-sm"><a href="#" className="text-on-surface-variant hover:text-primary-container transition-colors">Películas de Culto</a></li>
              <li className="font-body-sm text-body-sm"><a href="#" className="text-on-surface-variant hover:text-primary-container transition-colors">Terror Serie B</a></li>
              <li className="font-body-sm text-body-sm"><a href="#" className="text-on-surface-variant hover:text-primary-container transition-colors">Acción Ochentera</a></li>
              <li className="font-body-sm text-body-sm"><a href="#" className="text-on-surface-variant hover:text-primary-container transition-colors">Sci-Fi Cyberpunk</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline-sm text-headline-sm text-cream uppercase mb-space-sm tracking-wide border-b-2 border-primary-container pb-1 inline-block">
              Atención al Socio
            </h3>
            <ul className="space-y-space-xs">
              <li className="font-body-sm text-body-sm"><a href="#" className="text-on-surface-variant hover:text-primary-container transition-colors">Buzón de Devolución 24H</a></li>
              <li className="font-body-sm text-body-sm"><a href="#" className="text-on-surface-variant hover:text-primary-container transition-colors">Carnet de Miembro VIP</a></li>
              <li className="font-body-sm text-body-sm"><a href="#" className="text-on-surface-variant hover:text-primary-container transition-colors">Preguntas Frecuentes</a></li>
              <li className="font-body-sm text-body-sm"><a href="#" className="text-on-surface-variant hover:text-primary-container transition-colors">Contacto Marquee</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t-2 border-surface-container-highest pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 1989-2024 BLOCKBUSTED ENTERTAINMENT INC. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest">
            POR FAVOR REBOBINE ANTES DE SALIR
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
