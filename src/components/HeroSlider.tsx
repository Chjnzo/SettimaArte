import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { HeroSlide } from '@/data/images'

interface HeroSliderProps {
  slides: HeroSlide[]
  title?: string
  subtitle?: string
  interval?: number
  ctas?: { label: string; href: string }[]
  tagline?: string
}

export default function HeroSlider({
  slides,
  title,
  subtitle,
  interval = 12000,
  ctas,
  tagline,
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
        {(title || subtitle) && <HeroText title={title} subtitle={subtitle} ctas={ctas} />}
      </section>
    )
  }

  const slide = slides[current]
  const isHomeLayout = !!tagline

  return (
    <section data-header-dark className="relative w-full h-[calc(100dvh+4rem)] -mt-16 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {slide.type === 'video' && slide.videoId ? (
            <VideoSlide videoId={slide.videoId} alt={slide.alt} />
          ) : (
            <img
              src={slide.src}
              alt={slide.alt ?? ''}
              className="w-full h-full object-cover"
              loading={current === 0 ? 'eager' : 'lazy'}
              fetchPriority={current === 0 ? 'high' : 'auto'}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {isHomeLayout ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      ) : (
        <div className="absolute inset-0 bg-black/45" />
      )}

      {isHomeLayout ? (
        <HomeHeroContent
          tagline={tagline}
          slide={slide}
          current={current}
          total={slides.length}
          onDotClick={setCurrent}
        />
      ) : (
        <>
          {(title || subtitle || (ctas && ctas.length > 0)) && (
            <HeroText title={title} subtitle={subtitle} ctas={ctas} />
          )}
          {slides.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-pressed={i === current}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function HomeHeroContent({
  tagline,
  slide,
  current,
  total,
  onDotClick,
}: {
  tagline: string
  slide: HeroSlide
  current: number
  total: number
  onDotClick: (i: number) => void
}) {
  return (
    <div className="absolute inset-0 flex flex-col z-10">
      {/* Spacer: spinge il contenuto in basso ma non oltre il 45% dello schermo */}
      <div className="flex-1 max-h-[45vh]" />

      <div className="px-6 md:px-16 pb-12 md:pb-16 w-full max-w-6xl mx-auto">

        {/* Tagline — leggibile */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/70 font-funnel text-sm md:text-base font-medium mb-5 md:mb-6 max-w-md leading-snug"
        >
          {tagline}
        </motion.p>

        {/* Fucsia separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="w-10 h-[2px] mb-6 md:mb-8"
          style={{ backgroundColor: 'var(--color-fucsia)', transformOrigin: 'left' }}
        />

        {/* Titolo animato — altezza FISSA così CTA e dots non si spostano mai */}
        <div className="h-36 md:h-40 flex items-end overflow-hidden mb-7 md:mb-8">
          <AnimatePresence mode="wait">
            <motion.h1
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-funnel font-bold text-white leading-[1.1] max-w-[30ch] text-xl md:text-2xl lg:text-3xl"
            >
              {slide.slideTitle}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* CTA + navigazione — sempre montati */}
        <div className="flex items-center gap-6">
          <Link
            to={slide.cta?.href ?? '#'}
            className="inline-flex items-center gap-2.5 font-funnel font-semibold text-sm md:text-base px-7 py-3 md:px-8 md:py-3.5 rounded-full text-blu bg-white hover:bg-white/90 active:scale-[0.98] transition-all duration-200 shrink-0"
          >
            Scopri di più
            <span aria-hidden style={{ color: 'var(--color-fucsia)' }}>→</span>
          </Link>

          {total > 1 && (
            <div className="flex items-center gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => onDotClick(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-pressed={i === current}
                  className="py-2 px-1 cursor-pointer group"
                >
                  <span
                    className={`block rounded-full transition-all duration-350 ${
                      i === current
                        ? 'bg-white w-10 h-[3px]'
                        : 'bg-white/40 w-5 h-[3px] group-hover:bg-white/70 group-hover:w-7'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VideoSlide({ videoId, alt }: { videoId: string; alt?: string }) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(false)
    const handler = (e: MessageEvent) => {
      if (e.origin !== 'https://www.youtube.com') return
      try {
        const data = JSON.parse(e.data as string)
        if (data.event === 'infoDelivery' && data.info?.playerState >= 1) setPlaying(true)
      } catch { /* non-JSON */ }
    }
    window.addEventListener('message', handler)
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
      <div
        className="absolute inset-0 bg-video-fallback transition-opacity duration-700 pointer-events-none"
        style={{ opacity: playing ? 0 : 1 }}
      />
    </>
  )
}

function HeroText({
  title,
  subtitle,
  ctas,
}: {
  title?: string
  subtitle?: string
  ctas?: { label: string; href: string }[]
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/80 text-base md:text-lg mb-4 font-funnel tracking-wide uppercase"
        >
          {subtitle}
        </motion.p>
      )}
      {title && (
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white font-funnel font-bold text-4xl md:text-5xl lg:text-6xl max-w-4xl leading-tight mb-8"
        >
          {title}
        </motion.h1>
      )}
      {ctas && ctas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {ctas.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className="inline-flex items-center font-funnel font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/60 text-white hover:bg-white hover:text-blu transition-all duration-200 backdrop-blur-sm bg-white/10"
            >
              {label}
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  )
}
