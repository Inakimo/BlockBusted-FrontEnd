import { useState, useEffect } from 'react'
import { toast } from '../utils/toast.js'

const URL_BASE = 'http://localhost:4002'

const ETIQUETAS = {
  1: '¡Cinta rayada!',
  2: 'Mala copia',
  3: 'Pasable para un domingo',
  4: 'Muy buena parodia',
  5: '¡Joya retro imprescindible!',
}

function Estrellas({ valor, interactivo, hovered, onHover, onLeave, onClick }) {
  return (
    <div className="flex items-center gap-1" onMouseLeave={onLeave}>
      {[1, 2, 3, 4, 5].map((n) => {
        const activa = n <= (hovered ?? valor)
        return (
          <button
            key={n}
            type="button"
            className={`text-[22px] transition-transform hover:scale-125 focus:outline-none select-none ${activa ? 'text-[#FFA000]' : 'text-outline'} ${interactivo ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ background: 'none', border: 'none', padding: 0 }}
            onMouseEnter={interactivo ? () => onHover(n) : undefined}
            onClick={interactivo ? () => onClick(n) : undefined}
            aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
            tabIndex={interactivo ? 0 : -1}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: activa ? "'FILL' 1" : "'FILL' 0", fontSize: '22px' }}
            >
              star
            </span>
          </button>
        )
      })}
    </div>
  )
}

function SeccionResenas({ peliculaId, usuario, token }) {
  const [resenas, setResenas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [puntuacion, setPuntuacion] = useState(5)
  const [hovered, setHovered] = useState(null)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [errorForm, setErrorForm] = useState(null)

  const esComprador = usuario && usuario.role === 'COMPRADOR'
  const yaReseno = esComprador && resenas.some((r) => r.usuarioNombre === usuario.username)

  useEffect(() => {
    fetch(`${URL_BASE}/api/peliculas/${peliculaId}/resenas`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => { setResenas(data); setCargando(false) })
      .catch(() => setCargando(false))
  }, [peliculaId])

  const promedio = resenas.length
    ? (resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length).toFixed(1)
    : null

  function handleSubmit(e) {
    e.preventDefault()
    if (!comentario.trim()) { setErrorForm('Escribí un comentario.'); return }
    setErrorForm(null)
    setEnviando(true)

    fetch(`${URL_BASE}/api/peliculas/${peliculaId}/resenas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ puntuacion, comentario }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        setEnviando(false)
        if (!ok) { setErrorForm(data.message || 'No se pudo publicar la reseña.'); return }
        setResenas((prev) => [data, ...prev])
        setComentario('')
        setPuntuacion(5)
        toast('¡Reseña publicada!')
      })
      .catch(() => { setEnviando(false); setErrorForm('Error de conexión.') })
  }

  return (
    <section className="mt-space-xl pt-space-md" style={{ borderTop: '4px solid #000000' }}>
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-space-md p-space-md"
        style={{ backgroundColor: '#000000', border: '4px solid #ffd700', boxShadow: '6px 6px 0px #a90111', borderRadius: '6px' }}
      >
        <div className="space-y-space-xs">
          <span
            className="text-cream font-label-sm px-2 py-0.5 inline-block uppercase tracking-wider font-extrabold -rotate-1"
            style={{ backgroundColor: '#a90111', border: '2px solid #000000' }}
          >
            LIBRO DE RECLAMACIONES Y ALABANZAS
          </span>
          <h2 className="font-headline-lg text-primary-container uppercase tracking-wider leading-none drop-shadow-[2px_2px_0_#a90111]" style={{ fontSize: '36px' }}>
            ★ RESEÑAS DE SOCIOS
          </h2>
          <p className="font-body-md text-cream">Deja tu veredicto cinéfilo antes de que se rebobine la cinta.</p>
        </div>

        {promedio && (
          <div
            className="bg-card-surface p-space-sm flex items-center gap-space-md self-start md:self-auto"
            style={{ border: '3px solid #000000', boxShadow: '4px 4px 0 #000', borderRadius: '6px', minWidth: '220px' }}
          >
            <div
              className="bg-primary-container text-ink-black flex items-center justify-center font-headline-lg font-extrabold"
              style={{ width: '56px', height: '56px', border: '2px solid #000000', boxShadow: '2px 2px 0 #000', fontSize: '28px', borderRadius: '4px', flexShrink: 0 }}
            >
              {promedio}
            </div>
            <div className="flex flex-col">
              <Estrellas valor={Math.round(parseFloat(promedio))} interactivo={false} />
              <span className="font-label-sm text-ink-black uppercase font-bold tracking-wide">Puntuación Media</span>
              <span className="font-body-sm text-muted-gray" style={{ fontSize: '12px' }}>
                {resenas.length} reseña{resenas.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid form + lista */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-space-lg items-start">

        {/* Formulario */}
        <div
          className="lg:col-span-5 bg-card-surface p-space-md pt-8 flex flex-col gap-space-md text-ink-black relative"
          style={{ border: '4px solid #000000', boxShadow: '6px 6px 0px #000000', borderRadius: '6px' }}
        >
          <div
            className="absolute -top-3 right-4 text-ink-black font-label-sm font-extrabold px-space-sm py-1 rotate-2 uppercase"
            style={{ backgroundColor: '#ffd700', border: '2px solid #000000', boxShadow: '3px 3px 0px #000000' }}
          >
            ¡DANOS TU VEREDICTO!
          </div>

          <div className="flex items-center gap-2" style={{ borderBottom: '2px solid #000000', paddingBottom: '8px' }}>
            <span className="material-symbols-outlined text-secondary-container text-3xl">rate_review</span>
            <div>
              <h3 className="font-headline-md text-ink-black uppercase leading-tight tracking-wide" style={{ fontSize: '22px' }}>DEJAR TU RESEÑA</h3>
              <p className="font-body-sm text-muted-gray" style={{ fontSize: '12px' }}>Comparte tu opinión con la comunidad VHS</p>
            </div>
          </div>

          {!esComprador ? (
            <p className="font-body-sm text-muted-gray text-center py-space-md">
              {usuario ? 'Solo compradores pueden dejar reseñas.' : 'Iniciá sesión como comprador para dejar una reseña.'}
            </p>
          ) : yaReseno ? (
            <div
              className="p-space-sm text-ink-black font-label-md text-center uppercase"
              style={{ backgroundColor: '#ffd700', border: '2px solid #000000', borderRadius: '4px' }}
            >
              ★ Ya dejaste tu reseña para esta película
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
              {/* Estrellas */}
              <div>
                <label className="font-label-md text-ink-black block uppercase tracking-wider mb-1" style={{ fontSize: '12px' }}>
                  Tu Calificación:
                </label>
                <div
                  className="flex items-center gap-space-sm p-2"
                  style={{ backgroundColor: '#FFF8E7', border: '3px solid #000000', boxShadow: '2px 2px 0 #000', borderRadius: '4px' }}
                >
                  <Estrellas
                    valor={puntuacion}
                    interactivo={true}
                    hovered={hovered}
                    onHover={setHovered}
                    onLeave={() => setHovered(null)}
                    onClick={setPuntuacion}
                  />
                  <span className="font-label-sm text-secondary-container font-extrabold uppercase ml-auto" style={{ fontSize: '11px' }}>
                    {ETIQUETAS[hovered ?? puntuacion]}
                  </span>
                </div>
              </div>

              {/* Comentario */}
              <div>
                <label className="font-label-md text-ink-black block uppercase tracking-wider mb-1" htmlFor="comentario-resena" style={{ fontSize: '12px' }}>
                  Tu Crítica:
                </label>
                <textarea
                  id="comentario-resena"
                  rows={4}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escribe tu crítica cinematográfica..."
                  className="w-full p-3 text-ink-black font-body-sm focus:outline-none resize-none leading-relaxed"
                  style={{ backgroundColor: '#FFF8E7', border: '3px solid #000000', boxShadow: '2px 2px 0 #000', borderRadius: '4px' }}
                />
              </div>

              {errorForm && (
                <p className="font-label-sm text-cream uppercase px-space-sm py-1" style={{ backgroundColor: '#a90111', border: '2px solid #000', borderRadius: '4px' }}>
                  {errorForm}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full text-ink-black font-headline-sm tracking-wider py-3 uppercase flex items-center justify-center gap-space-xs cursor-pointer disabled:opacity-50 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px]"
                style={{ backgroundColor: '#ffd700', border: '3px solid #000000', boxShadow: '4px 4px 0px #000000', borderRadius: '6px', fontSize: '18px' }}
              >
                <span>★</span>
                <span>{enviando ? 'PUBLICANDO...' : 'PUBLICAR RESEÑA'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Lista de reseñas */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {cargando ? (
            <p className="font-body-sm text-on-surface-variant text-center py-space-xl">Cargando reseñas...</p>
          ) : resenas.length === 0 ? (
            <div
              className="bg-card-surface p-space-lg text-center text-ink-black"
              style={{ border: '4px solid #000000', boxShadow: '4px 4px 0 #000', borderRadius: '6px' }}
            >
              <span className="material-symbols-outlined text-4xl text-muted-gray block mb-2">rate_review</span>
              <p className="font-headline-sm text-ink-black uppercase">Todavía no hay reseñas</p>
              <p className="font-body-sm text-muted-gray">¡Sé el primero en dar tu veredicto!</p>
            </div>
          ) : (
            resenas.map((r) => <TarjetaResena key={r.id} resena={r} />)
          )}
        </div>
      </div>
    </section>
  )
}

function TarjetaResena({ resena }) {
  const iniciales = resena.usuarioNombre
    .split(/[\s@_.-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SO'

  const fecha = resena.fecha
    ? new Date(resena.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''

  return (
    <article
      className="bg-card-surface p-space-md flex flex-col gap-space-xs text-ink-black"
      style={{ border: '4px solid #000000', boxShadow: '6px 6px 0px #000000', borderRadius: '6px' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-space-xs" style={{ borderBottom: '2px solid #000000', paddingBottom: '8px' }}>
        <div className="flex items-center gap-space-sm">
          <div
            className="flex items-center justify-center font-headline-sm text-ink-black flex-shrink-0"
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #000000', backgroundColor: '#ffd700', boxShadow: '2px 2px 0 #000', fontSize: '16px' }}
          >
            {iniciales}
          </div>
          <div>
            <h4 className="font-headline-sm text-ink-black leading-tight uppercase" style={{ fontSize: '16px' }}>
              {resena.usuarioNombre}
            </h4>
            <span className="font-body-sm text-muted-gray" style={{ fontSize: '12px' }}>{fecha}</span>
          </div>
        </div>
        <Estrellas valor={resena.puntuacion} interactivo={false} />
      </div>
      <p className="font-body-md text-ink-black leading-relaxed" style={{ fontSize: '14px' }}>
        «{resena.comentario}»
      </p>
    </article>
  )
}

export default SeccionResenas
