import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HeroSlide } from '@/data/images'

interface HeroSliderProps {
  slides: HeroSlide[]
  title?: string
  subtitle?: string
  interval?: number
}

export default function HeroSlider({
  slides,
  title,
  subtitle,
  interval = 5000,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, interval)
    return () => clearInterval(timer)
  }, [slides.length, interval])

  if (slides.length === 0) {
    return (
      <section data-header-dark className="relative w-full h-[calc(100dvh+4rem)] -mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-blu" />
        {(title || subtitle) && <HeroText title={title} subtitle={subtitle} />}
      </section>
    )
  }

  const slide = slides[current]

  return (
    <section data-header-dark className="relative w-full h-[calc(100dvh+4rem)] -mt-16 overflow-hidden">
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {slide.type === 'video' && slide.videoId ? (
            <VideoSlide videoId={slide.videoId} alt={slide.alt} />
          ) : (
            <img
              src={slide.src}
              alt={slide.alt ?? ''}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text */}
      {(title || subtitle) && <HeroText title={title} subtitle={subtitle} />}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-6' : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function VideoSlide({ videoId, alt }: { videoId: string; alt?: string }) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(false)

    // YouTube manda playerState via postMessage quando enablejsapi=1
    const handler = (e: MessageEvent) => {
      if (e.origin !== 'https://www.youtube.com') return
      try {
        const data = JSON.parse(e.data as string)
        // playerState 1 = playing, 3 = buffering con frame visibile
        if (data.event === 'infoDelivery' && data.info?.playerState >= 1) {
          setPlaying(true)
        }
      } catch { /* ignora messaggi non JSON */ }
    }
    window.addEventListener('message', handler)

    // Fallback: se postMessage non arriva (es. restrizioni browser) mostra dopo 3s
    const fallback = setTimeout(() => setPlaying(true), 3000)

    return () => {
      window.removeEventListener('message', handler)
      clearTimeout(fallback)
    }
  }, [videoId])

  return (
    <>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`}
        title={alt ?? 'Video hero'}
        allow="autoplay; encrypted-media"
        className="absolute inset-0 w-full h-full pointer-events-none scale-[1.3] transition-opacity duration-700"
        style={{ border: 'none', opacity: playing ? 1 : 0 }}
      />
      {/* Sfondo scuro che copre il buffering — scompare quando il video inizia */}
      <div
        className="absolute inset-0 bg-[#111] transition-opacity duration-700 pointer-events-none"
        style={{ opacity: playing ? 0 : 1 }}
      />
    </>
  )
}

function HeroText({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/80 text-lg mb-4 font-funnel"
        >
          {subtitle}
        </motion.p>
      )}
      {title && (
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white font-funnel font-bold text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-tight"
        >
          {title}
        </motion.h1>
      )}
    </div>
  )
}
