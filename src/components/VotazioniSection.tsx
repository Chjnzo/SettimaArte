import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { useVotazioni } from '@/hooks/useVotazioni'
import type { CortoCorrente } from '@/hooks/useVotazioni'
import { driveImageUrl } from '@/lib/utils'

// ── Helpers ────────────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

// ── Detail modal ───────────────────────────────────────────────────────────────

interface CortoModalProps {
  corti: CortoCorrente[]
  index: number | null
  onClose: () => void
  onNav: (index: number) => void
}

function CortoModal({ corti, index, onClose, onNav }: CortoModalProps) {
  const corto = index !== null ? corti[index] : null
  const hasPrev = index !== null && index > 0
  const hasNext = index !== null && index < corti.length - 1

  useEffect(() => {
    if (!corto) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onNav(index! - 1)
      if (e.key === 'ArrowRight' && hasNext) onNav(index! + 1)
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [corto, hasPrev, hasNext, index, onClose, onNav])

  const ytId = corto?.video_url ? getYouTubeId(corto.video_url) : null
  const embedSrc = ytId ? `https://www.youtube.com/embed/${ytId}?rel=0` : null

  return (
    <AnimatePresence>
      {corto && (
        <motion.div
          key="corto-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md"
          style={{ padding: '0 clamp(0px, 2.5vw, 40px)' }}
          onClick={onClose}
        >
          {/* Freccia prev — solo desktop */}
          <button
            onClick={(e) => { e.stopPropagation(); if (hasPrev) onNav(index! - 1) }}
            disabled={!hasPrev}
            aria-label="Corto precedente"
            className="shrink-0 w-11 h-11 rounded-full border border-white/20 hidden md:flex items-center justify-center text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40 disabled:opacity-15 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ marginRight: 'clamp(6px, 1.5vw, 20px)' }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={corto.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col md:flex-row w-full mx-3 md:mx-0 overflow-hidden shadow-2xl h-[88svh] md:h-[clamp(360px,78dvh,620px)]"
              style={{ borderRadius: 28, backgroundColor: 'var(--color-blu)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Colonna sinistra — video quadrato (desktop only) */}
              <div
                className="shrink-0 bg-black overflow-hidden hidden md:block"
                style={{ aspectRatio: '1 / 1', height: '100%' }}
              >
                {embedSrc ? (
                  <iframe
                    src={embedSrc}
                    title={corto.nome_progetto}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/10 font-funnel font-bold" style={{ fontSize: '8rem' }}>
                      {corto.classe}
                    </span>
                  </div>
                )}
              </div>

              {/* Video mobile — 16:9 sopra */}
              {embedSrc && (
                <div className="block md:hidden w-full bg-black shrink-0" style={{ aspectRatio: '16 / 9' }}>
                  <iframe
                    src={embedSrc}
                    title={corto.nome_progetto}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  />
                </div>
              )}

              {/* Colonna destra — info */}
              <div
                className="flex flex-col flex-1 min-w-0 min-h-0"
                style={{ background: 'var(--color-blu-dark)' }}
              >
                {/* Close */}
                <button
                  onClick={onClose}
                  aria-label="Chiudi"
                  className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <X size={16} />
                </button>

                <div className="flex flex-col flex-1 min-h-0 p-6 md:p-9 gap-4 md:gap-5">
                  {/* Header */}
                  <div className="pr-10 shrink-0">
                    <p
                      className="text-[11px] font-funnel font-semibold tracking-[0.16em] uppercase mb-2"
                      style={{ color: 'var(--color-fucsia)' }}
                    >
                      Classe {corto.classe}
                    </p>
                    <h3
                      className="font-funnel font-bold text-white leading-[1.1]"
                      style={{ fontSize: 'clamp(1.25rem, 2.8vw, 2.2rem)' }}
                    >
                      {corto.nome_progetto}
                    </h3>
                  </div>

                  {/* Trama — cresce e scrolla */}
                  {corto.trama && (
                    <div
                      className="flex-1 min-h-0 overflow-y-auto"
                      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.12) transparent' }}
                    >
                      <p className="text-white/55 text-sm leading-[1.75] font-funnel break-words pr-1">
                        {corto.trama}
                      </p>
                    </div>
                  )}

                  {/* CTA — full width, pin al fondo */}
                  {corto.link_voto && (
                    <a
                      href={corto.link_voto}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => window.gtag?.('event', 'cta_click', { cta_label: 'vota_qui', nome_progetto: corto.nome_progetto })}
                      className="shrink-0 flex items-center justify-center gap-2.5 font-funnel font-semibold py-4 rounded-2xl text-white text-base transition-opacity duration-200 hover:opacity-90"
                      style={{ backgroundColor: 'var(--color-fucsia)' }}
                    >
                      Vota qui!
                      <ExternalLink size={15} />
                      <span className="sr-only"> (apre in nuova scheda)</span>
                    </a>
                  )}
                </div>

                {/* Navigazione mobile — prev / next dentro la card */}
                <div
                  className="md:hidden flex items-center justify-between px-5 py-3 shrink-0 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); if (hasPrev) onNav(index! - 1) }}
                    disabled={!hasPrev}
                    aria-label="Corto precedente"
                    className="flex items-center gap-1 text-sm font-funnel font-semibold text-white/70 disabled:text-white/20 disabled:cursor-not-allowed min-h-[44px] px-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <ChevronLeft size={16} />
                    Prec.
                  </button>
                  <span className="text-white/30 text-xs font-funnel tabular-nums">
                    {(index ?? 0) + 1} / {corti.length}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (hasNext) onNav(index! + 1) }}
                    disabled={!hasNext}
                    aria-label="Corto successivo"
                    className="flex items-center gap-1 text-sm font-funnel font-semibold text-white/70 disabled:text-white/20 disabled:cursor-not-allowed min-h-[44px] px-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    Succ.
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Freccia next — solo desktop */}
          <button
            onClick={(e) => { e.stopPropagation(); if (hasNext) onNav(index! + 1) }}
            disabled={!hasNext}
            aria-label="Corto successivo"
            className="shrink-0 w-11 h-11 rounded-full border border-white/20 hidden md:flex items-center justify-center text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40 disabled:opacity-15 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ marginLeft: 'clamp(6px, 1.5vw, 20px)' }}
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Poster card ────────────────────────────────────────────────────────────────

function PosterCard({ corto, onClick }: { corto: CortoCorrente; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-squircle w-full"
      aria-label={`Dettagli: ${corto.nome_progetto}`}
    >
      <div className="relative overflow-hidden rounded-squircle aspect-[2/3] bg-white/10 w-full">
        {corto.locandina_url ? (
          <img
            src={driveImageUrl(corto.locandina_url) ?? corto.locandina_url}
            alt={`Locandina ${corto.nome_progetto}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 font-funnel font-bold text-5xl">{corto.classe}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end justify-center pb-6">
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-250 bg-white rounded-full px-5 py-2 shadow-lg">
            <span className="font-funnel font-semibold text-sm text-blu">Scopri</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-8">
          <p className="text-[11px] font-funnel font-semibold tracking-widest uppercase" style={{ color: 'var(--color-fucsia)' }}>
            Classe {corto.classe}
          </p>
        </div>
      </div>
      <p className="text-base font-funnel font-semibold text-white leading-snug line-clamp-2 px-1">
        {corto.nome_progetto}
      </p>
    </button>
  )
}

// ── Section ────────────────────────────────────────────────────────────────────

export default function VotazioniSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const { data: corti, isLoading, isError } = useVotazioni()
  const handleClose = useCallback(() => setSelectedIndex(null), [])

  if (isLoading || isError || !corti?.length) return null

  return (
    <section
      data-header-dark
      className="w-full py-14 md:py-28"
      style={{ backgroundColor: 'var(--color-blu)' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-funnel font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--color-fucsia)' }}>
            È il momento di votare
          </p>
          <h2 className="font-funnel font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
            Vota il tuo cortometraggio preferito
          </h2>
          <p className="mt-3 text-white/55 font-funnel text-base max-w-lg leading-relaxed">
            Clicca su una locandina per scoprire la trama, guardare il corto e votare.
          </p>
        </motion.div>

        {/* CSS grid — 2 cols mobile, 4 cols desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6"
        >
          {corti.map((corto, i) => (
            <PosterCard key={corto.id} corto={corto} onClick={() => setSelectedIndex(i)} />
          ))}
        </motion.div>
      </div>

      <CortoModal corti={corti} index={selectedIndex} onClose={handleClose} onNav={setSelectedIndex} />
    </section>
  )
}
