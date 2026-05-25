import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play, Grid2x2 } from 'lucide-react'
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
  /** Quanti item mostrare prima del pulsante "Vedi tutto". 0 = mostra tutto. Default: 6 */
  initialVisible?: number
}

const PLACEHOLDER_COLS = 6

function GalleryImage({
  src,
  alt,
  onClick,
}: {
  src: string
  alt: string
  onClick: () => void
}) {
  const [loaded, setLoaded] = useState(() => loadedUrls.has(src))

  const handleLoad = () => {
    loadedUrls.add(src)
    setLoaded(true)
  }

  return (
    <button
      onClick={onClick}
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
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-squircle" />
    </button>
  )
}

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

function renderItem(item: GalleryItem, globalIndex: number, onOpen: (i: number) => void) {
  return item.type === 'video' ? (
    <VideoGalleryItem item={item} />
  ) : (
    <GalleryImage src={item.src} alt={item.alt} onClick={() => onOpen(globalIndex)} />
  )
}

export default function Gallery({
  items,
  columns = 3,
  showPlaceholders = true,
  placeholderCount = PLACEHOLDER_COLS,
  initialVisible = 6,
}: GalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)

  const imageItems = items.filter((it) => it.type !== 'video')

  const openLightbox = useCallback((globalIndex: number) => {
    const imageIndex = items
      .slice(0, globalIndex + 1)
      .filter((it) => it.type !== 'video').length - 1
    setLightbox(imageIndex)
  }, [items])

  const prev = useCallback(() => setLightbox((i) => (i !== null && i > 0 ? i - 1 : i)), [])
  const next = useCallback(
    () => setLightbox((i) => (i !== null && i < imageItems.length - 1 ? i + 1 : i)),
    [imageItems.length],
  )

  // Keyboard nav — ESC chiude prima il lightbox, poi il gallery modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightbox !== null) { setLightbox(null); return }
        if (galleryOpen) setGalleryOpen(false)
      }
      if (lightbox === null) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, galleryOpen, prev, next])

  // Lock scroll quando gallery modal o lightbox sono aperti
  useEffect(() => {
    const locked = galleryOpen || lightbox !== null
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [galleryOpen, lightbox])

  const colClass: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  if (items.length === 0 && !showPlaceholders) return null

  const limit = initialVisible === 0 ? items.length : initialVisible
  const previewItems = items.slice(0, limit)
  const hasMore = items.length > limit

  const photoCount = imageItems.length
  const countLabel = photoCount === items.length
    ? `${photoCount} foto`
    : `${photoCount} foto · ${items.length - photoCount} video`

  return (
    <>
      {/* ── Griglia preview ── */}
      <div className={`grid gap-4 ${colClass[columns]}`}>
        {items.length > 0
          ? previewItems.map((item, i) => (
              <div key={i}>{renderItem(item, i, openLightbox)}</div>
            ))
          : Array.from({ length: placeholderCount }).map((_, i) => (
              <div key={i} className="rounded-squircle aspect-[4/3] overflow-hidden bg-azzurro-light/60">
                <div className="w-full h-full bg-gradient-to-r from-azzurro-light via-white/60 to-azzurro-light animate-[shimmer_1.4s_ease-in-out_infinite] bg-[length:200%_100%]" />
              </div>
            ))}
      </div>

      {/* ── Pulsante "Vedi tutta la gallery" ── */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setGalleryOpen(true)}
            className="group flex items-center gap-3 px-6 py-3 rounded-squircle border border-azzurro text-azzurro font-funnel font-semibold text-sm hover:bg-azzurro hover:text-white transition-all duration-200"
          >
            <Grid2x2 size={16} className="shrink-0" />
            <span>Vedi tutta la gallery</span>
            <span className="bg-azzurro/10 group-hover:bg-white/20 text-azzurro group-hover:text-white text-xs font-bold px-2 py-0.5 rounded-full tabular-nums transition-colors duration-200">
              +{items.length - limit}
            </span>
          </button>
        </div>
      )}

      {/* ── Gallery Modal (fullscreen) ── */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            key="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#0d0d0d] overflow-y-auto"
          >
            {/* Header sticky */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[#0d0d0d]/90 backdrop-blur-sm border-b border-white/8">
              <div>
                <p className="text-white font-funnel font-bold text-base leading-none">Tutta la gallery</p>
                <p className="text-white/40 text-xs font-funnel mt-1">{countLabel}</p>
              </div>
              <button
                onClick={() => setGalleryOpen(false)}
                aria-label="Chiudi gallery"
                className="bg-white/8 hover:bg-white/16 text-white rounded-full p-2.5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Grid completa */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-4 md:p-6 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {items.map((item, i) => (
                <div key={i}>{renderItem(item, i, (idx) => { openLightbox(idx) })}</div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox (z sopra il gallery modal) ── */}
      <AnimatePresence>
        {lightbox !== null && imageItems[lightbox] && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/90"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Chiudi"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>

            {lightbox > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Precedente"
                className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <div className="flex flex-col items-center gap-3 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={lightbox}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                src={imageItems[lightbox].src}
                alt={imageItems[lightbox].alt}
                className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>

            {lightbox < imageItems.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Successivo"
                className="absolute right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
              >
                <ChevronRight size={28} />
              </button>
            )}

            <p className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-xs tabular-nums">
              {lightbox + 1} / {imageItems.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
