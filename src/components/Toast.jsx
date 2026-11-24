import { useState, useEffect } from 'react'

const TIPOS = {
  error:   { label: 'ALERTA',   headerBg: '#a90111', headerText: '#ffffff', starBg: '#a90111', icon: 'report',        badgeIcon: 'close',  badgeBg: '#000' },
  success: { label: 'ÉXITO',    headerBg: '#ffd700', headerText: '#000000', starBg: '#ffd700', icon: 'check_circle',  badgeIcon: 'check',  badgeBg: '#059669' },
  warning: { label: 'ATENCIÓN', headerBg: '#d97706', headerText: '#ffffff', starBg: '#d97706', icon: 'warning',       badgeIcon: 'info',   badgeBg: '#000' },
  info:    { label: 'INFO',     headerBg: '#1E88E5', headerText: '#ffffff', starBg: '#1E88E5', icon: 'info',          badgeIcon: 'info',   badgeBg: '#1E88E5' },
}

let nextId = 0

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    function handler(e) {
      const { message, type = 'error', subtitle } = e.detail
      const id = ++nextId
      setToasts(prev => [...prev, { id, message, type, subtitle, num: id }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
    }
    window.addEventListener('bb-toast', handler)
    return () => window.removeEventListener('bb-toast', handler)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none"
      style={{ maxWidth: '460px', width: 'calc(100vw - 48px)' }}
    >
      {toasts.map(({ id, message, type, subtitle, num }) => {
        const cfg = TIPOS[type] || TIPOS.error
        return (
          <div
            key={id}
            className="pointer-events-auto relative overflow-hidden"
            style={{
              backgroundColor: '#f5f0e8',
              border: '4px solid #000000',
              borderRadius: '8px',
              boxShadow: '8px 8px 0 #000000',
              animation: 'toastPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Header bar */}
            <div
              className="flex items-center gap-2 px-3 py-1.5"
              style={{ backgroundColor: cfg.headerBg, borderBottom: '3px solid #000000' }}
            >
              <span style={{ color: cfg.headerText, fontSize: '13px', lineHeight: 1 }}>★</span>
              <span
                className="font-montserrat font-black tracking-widest uppercase"
                style={{ color: cfg.headerText, fontSize: '11px' }}
              >
                VIÑETA #{String(num).padStart(2, '0')} · {cfg.label}
              </span>
            </div>

            {/* Body */}
            <div className="flex items-center gap-4 px-4 py-3 pr-10">
              {/* Starburst icon */}
              <div
                className="relative shrink-0 flex items-center justify-center"
                style={{
                  width: '56px',
                  height: '56px',
                  clipPath: 'polygon(50% 0%, 61% 15%, 79% 9%, 73% 27%, 98% 35%, 82% 50%, 98% 65%, 73% 73%, 79% 91%, 61% 85%, 50% 100%, 39% 85%, 21% 91%, 27% 73%, 2% 65%, 18% 50%, 2% 35%, 27% 27%, 21% 9%, 39% 15%)',
                  backgroundColor: cfg.starBg,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '26px', color: cfg.headerText, fontVariationSettings: "'FILL' 1" }}
                >
                  {cfg.icon}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-montserrat font-black text-ink-black uppercase leading-tight"
                  style={{ fontSize: '14px' }}
                >
                  {message}
                </p>
                {subtitle && (
                  <p
                    className="font-montserrat text-muted-gray mt-1 leading-snug"
                    style={{ fontSize: '12px' }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== id))}
              className="absolute top-2 right-2 flex items-center justify-center cursor-pointer"
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#a90111',
                border: '2px solid #000000',
                borderRadius: '50%',
                boxShadow: '2px 2px 0 #000000',
              }}
            >
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '13px', fontWeight: 900 }}
              >
                close
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
