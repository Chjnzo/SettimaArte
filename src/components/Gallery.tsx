import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, LayoutGrid, Play } from 'lucide-react'
import VideoEmbed from './VideoEmbed'

const loadedUrls = new Set<string>()

export interface GalleryItem {
  src: string
  alt: string
  type?: 'image' | 'video'
  videoId?: string
  platform?: 'youtube' | 'vimeo'
}

interface GalleryProps {
  items: GalleryItem[]
  columns?: 2 | 3 | 4
  showPlaceholders?: boolean
  placeholderCount?: number
  /** Quanti item mostrare come preview. 0 = mostra tutto senza overlay. Default: 3 */
  initialVisible?: number
}

const PLACEHOLDER_COLS = 6

function preloadImages(srcs: string[]) {
  srcs.forEach((src) => {
    if (loadedUrls.has(src)) return
    const img = new Image()
    img.onload = () => loadedUrls.add(src)
    img.src = src
  })
}

// ── Preview image (on-page) ────────────────────────────────────────────────────

function GalleryImage({
  src,
  alt,
  onClick,
  onHover,
}: {
  src: string
  alt: string
  onClick: () => void
  onHover?: () => void
}) {
  const [loaded, setLoaded] = useState(() => loadedUrls.has(src))

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
      className="group relative overflow-hidden rounded-squircle aspect-[4/3] w-full bg-azzurro-light focus:outline-none focus:ring-2 focus:ring-azzurro"
      aria-label={`Apri foto: ${alt}`}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-azzurro-light via-white/60 to-azzurro-light animate-[shimmer_1.4s_ease-in-out_infinite] bg-[length:200%_100%]" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => { loadedUrls.add(src); setLoaded(true) }}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-squircle" />
    </button>
  )
}

// ── Video item ─────────────────────────────────────────────────────────────────

function VideoGalleryItem({ item }: { item: GalleryItem }) {
  if (item.videoId === undefined) {
    return (
      <div className="rounded-squircle overflow-hidden w-full">
        <VideoEmbed src={item.src} title={item.alt} />
      </div>
    )
  }

  if (!item.videoId) {
    return (
      <div className="relative overflow-hidden rounded-squircle aspect-video w-full bg-azzurro-light cursor-not-allowed">
        <img src={item.src} alt="" aria-hidden className="w-full h-full object-cover opacity-40" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/50 rounded-full p-4">
            <Play size={28} className="text-blu/30 fill-blu/30 ml-1" />
          </div>
        </div>
        <span className="absolute bottom-3 left-0 right-0 text-center text-xs text-white/70 font-funnel px-2">
          {item.alt}
        </span>
      </div>
    )
  }

  const ytUrl = `https://www.youtube.com/watch?v=${item.videoId}`
  const thumb = `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`

  return (
    <a
      href={ytUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Guarda su YouTube: ${item.alt}`}
      className="group relative overflow-hidden rounded-squircle aspect-video w-full bg-black block focus:outline-none focus:ring-2 focus:ring-azzurro"
    >
      <img src={thumb} alt={item.alt} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/20 group-hover:from-fucsia/40 group-hover:via-black/20 group-hover:to-black/20 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 group-hover:bg-white rounded-full p-4 transition-all duration-200 group-hover:scale-110 shadow-lg">
          <Play size={28} className="text-blu fill-blu ml-1" />
        </div>
      </div>
    </a>
  )
}

// ── Overlay grid image (with shimmer) ──────────────────────────────────────────

function OverlayGridImage({
  item,
  index,
  onClick,
}: {
  item: GalleryItem
  index: number
  onClick: () => void
}) {
  const [loaded, setLoaded] = useState(() => loadedUrls.has(item.src))

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-white/5 focus:outline-none focus:ring-2 focus:ring-azzurro"
      aria-label={`Apri foto: ${item.alt}`}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
      <img
        src={item.src}
        alt={item.alt}
        loading="eager"
        decoding="async"
        fetchPriority={index < 8 ? 'high' : 'auto'}
        onLoad={() => { loadedUrls.add(item.src); setLoaded(true) }}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200" />
    </button>
  )
}

// ── Full-screen gallery overlay ────────────────────────────────────────────────

type OverlayMode = 'grid' | 'slider'

function GalleryOverlay({
  items,
  initialIndex,
  initialMode,
  onClose,
}: {
  items: GalleryItem[]
  initialIndex: number
  initialMode: OverlayMode
  onClose: () => void
}) {
  const [mode, setMode] = useState<OverlayMode>(initialMode)
  const [current, setCurrent] = useState(initialIndex)

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent((c) => Math.min(items.length - 1, c + 1)), [items.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (mode === 'slider') {
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, prev, next, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Preload adjacent images in slider mode
  useEffect(() => {
    if (mode !== 'slider') return
    const adjacent = [current - 1, current + 1].filter((i) => i >= 0 && i < items.length)
    preloadImages(adjacent.map((i) => items[i].src))
  }, [current, mode, items])

  return (
    <motion.div
      key="gallery-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80] bg-black"
    >
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6 py-4">
        <p className="text-white/40 font-funnel text-sm tabular-nums">
          {mode === 'slider' ? `${current + 1} / ${items.length}` : `${items.length} foto`}
        </p>
        <div className="flex items-center gap-2">
          {mode === 'slider' && (
            <button
              onClick={() => setMode('grid')}
              aria-label="Vista griglia"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            >
              <LayoutGrid size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Chiudi galleria"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Grid mode ── */}
      {mode === 'grid' && (
        <div className="absolute inset-0 overflow-y-auto pt-16 pb-8 px-3 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 md:gap-2 max-w-7xl mx-auto">
            {items.map((item, i) => (
              <OverlayGridImage
                key={i}
                item={item}
                index={i}
                onClick={() => { setCurrent(i); setMode('slider') }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Slider mode ── */}
      {mode === 'slider' && (
        <>
          <div
            className="absolute inset-0 flex items-center justify-center pt-14 pb-20 px-14 md:px-20"
            onClick={onClose}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                src={items[current]?.src}
                alt={items[current]?.alt ?? ''}
                loading="eager"
                fetchPriority="high"
                className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
          </div>

          {current > 0 && (
            <button
              onClick={prev}
              aria-label="Precedente"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {current < items.length - 1 && (
            <button
              onClick={next}
              aria-label="Successivo"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10"
            >
              <ChevronRight size={26} />
            </button>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 h-[4.5rem] flex items-center gap-1.5 px-4 overflow-x-auto bg-gradient-to-t from-black/70 to-transparent"
            style={{ scrollbarWidth: 'none' }}
          >
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Foto ${i + 1}`}
                aria-pressed={i === current}
                className={`shrink-0 h-12 w-16 rounded overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azzurro ${
                  i === current ? 'ring-2 ring-white opacity-100' : 'opacity-35 hover:opacity-60'
                }`}
              >
                <img src={item.src} alt="" loading="eager" decoding="async" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}

// ── Main Gallery component ─────────────────────────────────────────────────────

export default function Gallery({
  items,
  columns = 3,
  showPlaceholders = true,
  placeholderCount = PLACEHOLDER_COLS,
  initialVisible = 3,
}: GalleryProps) {
  const [overlay, setOverlay] = useState<{ mode: OverlayMode; index: number } | null>(null)
  const preloadedRef = useRef(false)

  const imageItems = items.filter((it) => it.type !== 'video')
  const imageSrcs = imageItems.map((it) => it.src)

  const triggerPreload = useCallback(() => {
    if (preloadedRef.current) return
    preloadedRef.current = true
    preloadImages(imageSrcs)
  }, [imageSrcs])

  const openAtPhoto = useCallback(
    (globalIndex: number) => {
      const imageIndex = items
        .slice(0, globalIndex + 1)
        .filter((it) => it.type !== 'video').length - 1
      setOverlay({ mode: 'slider', index: Math.max(0, imageIndex) })
    },
    [items],
  )

  const colClass: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  if (items.length === 0 && !showPlaceholders) return null

  const limit = initialVisible === 0 ? items.length : initialVisible
  const previewItems = items.slice(0, limit)
  const hasMore = items.length > limit

  return (
    <>
      {/* ── Preview grid ── */}
      <div className={`grid gap-4 ${colClass[columns]}`}>
        {items.length > 0
          ? previewItems.map((item, i) =>
              item.type === 'video' ? (
                <div key={i}><VideoGalleryItem item={item} /></div>
              ) : (
                <div key={i}>
                  <GalleryImage
                    src={item.src}
                    alt={item.alt}
                    onClick={() => openAtPhoto(i)}
                    onHover={triggerPreload}
                  />
                </div>
              ),
            )
          : Array.from({ length: placeholderCount }).map((_, i) => (
              <div key={i} className="rounded-squircle aspect-[4/3] overflow-hidden bg-azzurro-light/60">
                <div className="w-full h-full bg-gradient-to-r from-azzurro-light via-white/60 to-azzurro-light animate-[shimmer_1.4s_ease-in-out_infinite] bg-[length:200%_100%]" />
              </div>
            ))}
      </div>

      {/* ── "Vedi tutto" → opens overlay grid ── */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setOverlay({ mode: 'grid', index: 0 })}
            onMouseEnter={triggerPreload}
            onFocus={triggerPreload}
            className="px-6 py-3 rounded-squircle border border-azzurro text-azzurro font-funnel font-semibold text-sm hover:bg-azzurro hover:text-white transition-all duration-200"
          >
            Vedi tutto
          </button>
        </div>
      )}

      {/* ── Overlay ── */}
      <AnimatePresence>
        {overlay !== null && imageItems.length > 0 && (
          <GalleryOverlay
            items={imageItems}
            initialIndex={overlay.index}
            initialMode={overlay.mode}
            onClose={() => setOverlay(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
