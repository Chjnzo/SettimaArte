import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { useVotazioni } from '@/hooks/useVotazioni'
import type { CortoCorrente } from '@/hooks/useVotazioni'

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
          style={{ padding: '0 clamp(6px, 2.5vw, 40px)' }}
          onClick={onClose}
        >
          {/* Freccia prev */}
          <button
            onClick={(e) => { e.stopPropagation(); if (hasPrev) onNav(index! - 1) }}
            disabled={!hasPrev}
            aria-label="Corto precedente"
            className="shrink-0 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40 disabled:opacity-15 disabled:cursor-not-allowed"
            style={{ marginRight: 'clamp(6px, 1.5vw, 20px)' }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={corto.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col md:flex-row w-full overflow-hidden shadow-2xl"
              style={{
                borderRadius: 28,
                backgroundColor: 'var(--color-blu)',
                height: 'clamp(360px, 78dvh, 620px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Colonna sinistra — video quadrato */}
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
                <div className="block md:hidden aspect-video w-full bg-black shrink-0">
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
                style={{ background: 'oklch(21% 0.06 258)' }}
              >
                {/* Close */}
                <button
                  onClick={onClose}
                  aria-label="Chiudi"
                  className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>

                <div className="flex flex-col flex-1 min-h-0 p-7 md:p-9 gap-5">
                  {/* Header */}
                  <div className="pr-10 shrink-0">
                    <p
                      className="text-[11px] font-funnel font-semibold tracking-[0.16em] uppercase mb-2.5"
                      style={{ color: 'var(--color-fucsia)' }}
                    >
                      Classe {corto.classe}
                    </p>
                    <h3
                      className="font-funnel font-bold text-white leading-[1.1]"
                      style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)' }}
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
                      <p className="text-white/55 text-sm md:text-base leading-[1.8] font-funnel break-words pr-1">
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
                      className="shrink-0 flex items-center justify-center gap-2.5 font-funnel font-semibold py-4 rounded-2xl text-white text-base transition-opacity duration-200 hover:opacity-90"
                      style={{ backgroundColor: 'var(--color-fucsia)' }}
                    >
                      Vota qui!
                      <ExternalLink size={15} />
                      <span className="sr-only"> (apre in nuova scheda)</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Freccia next */}
          <button
            onClick={(e) => { e.stopPropagation(); if (hasNext) onNav(index! + 1) }}
            disabled={!hasNext}
            aria-label="Corto successivo"
            className="shrink-0 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40 disabled:opacity-15 disabled:cursor-not-allowed"
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
            src={corto.locandina_url}
            alt={`Locandina ${corto.nome_progetto}`}
            loading="eager"
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

const CARD_W = 260   // px — card width
const GAP = 24       // px — gap between cards

export default function VotazioniSection() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const { data: corti, isLoading } = useVotazioni()

  const handleClose = useCallback(() => setSelectedIndex(null), [])

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [corti, updateArrows])

  const scroll = (dir: 'prev' | 'next') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: (CARD_W + GAP) * (dir === 'next' ? 1 : -1), behavior: 'smooth' })
  }

  if (isLoading || !corti?.length) return null

  return (
    <section
      data-header-dark
      ref={ref}
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: 'var(--color-blu)' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--color-fucsia)' }}>
              È il momento di votare
            </p>
            <h2 className="font-funnel font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Vota il tuo cortometraggio preferito
            </h2>
            <p className="mt-3 text-white/55 font-funnel text-base max-w-lg leading-relaxed">
              Clicca su una locandina per scoprire la trama, guardare il corto e votare.
            </p>
          </div>

          {/* Arrow controls */}
          {(canPrev || canNext) && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => scroll('prev')}
                disabled={!canPrev}
                aria-label="Precedente"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('next')}
                disabled={!canNext}
                aria-label="Successivo"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative"
        >
          <div
            ref={scrollRef}
            className="overflow-x-auto -mx-4 px-4 pb-4"
            style={{
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory',
            }}
          >
            <div
              className="flex"
              style={{ gap: GAP, width: 'max-content' }}
            >
              {corti.map((corto, i) => (
                <div
                  key={corto.id}
                  style={{ width: CARD_W, scrollSnapAlign: 'start', flexShrink: 0 }}
                >
                  <PosterCard corto={corto} onClick={() => setSelectedIndex(i)} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <CortoModal corti={corti} index={selectedIndex} onClose={handleClose} onNav={setSelectedIndex} />
    </section>
  )
}
