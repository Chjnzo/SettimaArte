import { useRef, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X, ExternalLink, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import HeroSlider from '@/components/HeroSlider'
import { fslBackstageMisto } from '@/data/fsl'
import { heroFSLImage, locandinePerEdizione } from '@/data/images'
import type { CortoEdizione } from '@/data/images'

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-3">
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-funnel font-bold text-3xl md:text-4xl lg:text-5xl text-blu leading-tight">
      {children}
    </h2>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '1.500', label: 'Studenti coinvolti' },
  { value: '60', label: 'Settimane di FSL' },
  { value: '14', label: 'Eventi organizzati' },
  { value: '76', label: 'Cortometraggi realizzati' },
]

function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section data-header-dark ref={ref} className="w-full py-14 md:py-28" style={{ backgroundColor: 'var(--color-blu)' }}>
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Titolo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-3">
            I numeri del progetto
          </p>
          <h2 className="font-funnel font-bold text-4xl md:text-5xl text-white leading-tight">
            Risultati raggiunti
          </h2>
        </motion.div>

        {/* Certificate of Merit — card prominente */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 rounded-squircle p-8 md:p-12"
          style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.18) 0%, rgba(234,179,8,0.06) 100%)', border: '1px solid rgba(234,179,8,0.35)' }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(234,179,8,0.2)' }}>
              <Trophy size={40} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-funnel font-semibold tracking-widest uppercase mb-3" style={{ color: 'rgba(234,179,8,0.8)' }}>
                Riconoscimento nazionale
              </p>
              <p className="font-funnel font-bold text-3xl md:text-4xl text-white leading-tight mb-3">
                CNCC Awards 2023 — Certificate of Merit
              </p>
              <p className="text-white/55 text-base md:text-lg font-funnel leading-relaxed">
                Consiglio Nazionale dei Centri Commerciali — categoria Corporate Social Responsibility
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4 numeri in riga */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
              className="text-center"
            >
              <p className="font-funnel font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-none">
                {value}
              </p>
              <p className="mt-3 text-white/50 text-sm md:text-base font-funnel">{label}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── Copy sections ────────────────────────────────────────────────────────────

function CopySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        {[
          <>Negli ultimi anni, i percorsi di Formazione Scuola-Lavoro sono diventati un passaggio obbligato per gli studenti delle scuole superiori. Spesso, però, docenti e ragazzi temono che queste esperienze si traducano in attività ripetitive e poco formative, come fare fotocopie o gestire semplici pratiche amministrative.</>,
          <>Oriocenter ha scelto un approccio diverso: investire in un <strong>progetto educational pensato per valorizzare davvero il potenziale degli studenti</strong>. All'interno degli spazi del mall, i partecipanti sono coinvolti in un'esperienza creativa che li sfida a raccontare un tema attraverso il linguaggio cinematografico. I ragazzi portano prospettive nuove, capacità di lettura del presente e una sensibilità comunicativa che spesso anticipa i cambiamenti.</>,
          <>Nel concreto, gli studenti vivono un <strong>percorso immersivo che riproduce dinamiche, tempi e responsabilità di un vero contesto professionale</strong>. <strong>Affiancati da videomaker ed educatori</strong>, sperimentano tutte le fasi di <strong>realizzazione di un cortometraggio</strong>, assumendo ruoli diversi – dalla regia alla produzione, fino alla recitazione - mettendo in gioco la propria creatività.</>,
          <>L'obiettivo non è formarli come registi o attori, ma offrire loro l'<strong>opportunità di far emergere competenze trasversali spesso invisibili finché non vengono messe alla prova</strong>. Collaborazione, gestione dello stress, capacità decisionale e ascolto reciproco diventano elementi concreti, che prendono forma attraverso l'esperienza diretta.</>,
        ].map((content, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="text-blu/80 leading-relaxed text-lg font-funnel"
          >
            {content}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

function CopyMidSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        {[
          <>Queste esperienze raccontano qualcosa di più ampio del cinema. Raccontano <strong>cosa accade quando le aziende decidono di aprire spazi reali ai giovani</strong>, permettendo loro di osservare, provare, sbagliare e contribuire. Non si tratta di offrire opportunità a parole, ma di creare contesti in cui il valore dei ragazzi si vede davvero - e spesso sorprende sia chi li osserva, sia chi lo conosce in circostanze differenti.</>,
          <>Per molte imprese, lavorare con la Generazione Z può sembrare complesso: linguaggi diversi, aspettative nuove, modalità relazionali in evoluzione. Ma proprio per questo diventa <strong>strategico costruire esperienze concrete e guidate</strong>, dove l'incontro avviene in modo strutturato e significativo. Oriocenter ha permesso che questo accadesse, rendendo il <strong>risultato non solo educativo ma culturale</strong>.</>,
        ].map((content, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            className="text-blu/80 leading-relaxed text-lg font-funnel"
          >
            {content}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

// ─── Gallery section wrapper ──────────────────────────────────────────────────

interface GalleryBlockProps {
  title: string
  label?: string
  items: import('@/components/Gallery').GalleryItem[]
  columns?: 2 | 3 | 4
  bg?: string
}

function GalleryBlock({ title, label, items, columns = 3, bg = 'bg-white' }: GalleryBlockProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={`w-full py-16 md:py-20 ${bg}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {label && <SectionLabel>{label}</SectionLabel>}
          <SectionHeading>{title}</SectionHeading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Gallery items={items} columns={columns} showPlaceholders={items.length === 0} />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Video Modal ──────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

interface VideoModalProps {
  corto: CortoEdizione | null
  onClose: () => void
}

function VideoModal({ corto, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!corto) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [corto, onClose])

  const ytId = corto?.videoYT ? getYouTubeId(corto.videoYT) : null
  const embedSrc = ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` : null

  return (
    <AnimatePresence>
      {corto && (
        <motion.div
          key="video-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modale */}
            <div className="flex items-start justify-between mb-3 px-1">
              <div>
                <p className="text-white font-funnel font-bold text-xl leading-tight">
                  {corto.titolo}
                </p>
                {corto.premi && corto.premi.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {corto.premi.map((p) => (
                      <span key={p} className="text-[10px] bg-fucsia/80 text-white font-funnel font-medium px-2 py-0.5 rounded-full">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {corto.videoYT && (
                  <a
                    href={corto.videoYT}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Apri su YouTube"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <button
                  onClick={onClose}
                  aria-label="Chiudi"
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
              {embedSrc ? (
                <iframe
                  src={embedSrc}
                  title={corto.titolo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/50">
                  <p className="font-funnel text-sm">Video non ancora disponibile</p>
                  {corto.videoYT && (
                    <a href={corto.videoYT} target="_blank" rel="noopener noreferrer" className="text-azzurro underline text-xs">
                      Apri il link
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Locandine per edizione ───────────────────────────────────────────────────

function CortoLocandina({ corto, onClick }: { corto: CortoEdizione; onClick: () => void }) {
  const hasVideo = Boolean(corto.videoYT)

  return (
    <button
      onClick={onClick}
      disabled={!hasVideo}
      className="group w-full flex flex-col gap-2 text-left focus:outline-none focus:ring-2 focus:ring-azzurro rounded-squircle disabled:cursor-default"
      aria-label={hasVideo ? `Guarda: ${corto.titolo}` : corto.titolo}
    >
      <div className="relative overflow-hidden rounded-squircle aspect-[2/3] bg-azzurro-light">
        {corto.locandina ? (
          <img
            src={corto.locandina}
            alt={`Locandina ${corto.titolo}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-disabled:group-hover:scale-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-3">
            <span className="text-xs text-blu/50 font-funnel text-center leading-snug">
              {corto.titolo}
            </span>
          </div>
        )}
        {hasVideo && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-3 shadow-lg scale-90 group-hover:scale-100">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blu ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs font-funnel font-semibold text-blu leading-snug line-clamp-2">
        {corto.titolo}
      </p>
      {corto.premi && corto.premi.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {corto.premi.map((p) => (
            <span key={p} className="text-[10px] bg-fucsia/10 text-fucsia font-funnel font-medium px-2 py-0.5 rounded-full">
              {p}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

const VISIBLE = 5
const PRELOAD = 2

function LocandineSection() {
  const anni = Object.keys(locandinePerEdizione).reverse()
  const [annoAttivo, setAnnoAttivo] = useState(anni[0])
  const [selectedCorto, setSelectedCorto] = useState<CortoEdizione | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [_dir, setDir] = useState<1 | -1>(1)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const cortiAttivi = locandinePerEdizione[annoAttivo].flatMap((ed) => ed.corti)

  useEffect(() => { setStartIndex(0) }, [annoAttivo])

  const canPrev = startIndex > 0
  const canNext = startIndex + VISIBLE < cortiAttivi.length

  const goNext = () => { if (!canNext) return; setDir(1);  setStartIndex(i => i + 1) }
  const goPrev = () => { if (!canPrev) return; setDir(-1); setStartIndex(i => i - 1) }

  const visibleItems = cortiAttivi.slice(startIndex, startIndex + VISIBLE)
  const preloadItems = cortiAttivi.slice(startIndex + VISIBLE, startIndex + VISIBLE + PRELOAD)
  const cols = Math.min(VISIBLE, Math.max(visibleItems.length, 1))

  return (
    <section ref={ref} className="w-full py-14 md:py-28 bg-white border-t border-azzurro-light">
      <div className="container mx-auto px-4 max-w-6xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <SectionLabel>Le edizioni</SectionLabel>
          <SectionHeading>I cortometraggi per anno</SectionHeading>
        </motion.div>

        {/* Year tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {anni.map((anno) => (
            <button
              key={anno}
              onClick={() => setAnnoAttivo(anno)}
              className={`px-5 py-2 rounded-squircle font-funnel font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azzurro ${
                anno === annoAttivo ? 'bg-azzurro text-white' : 'border border-azzurro text-azzurro bg-white hover:bg-azzurro/10'
              }`}
            >
              {anno}
            </button>
          ))}
        </motion.div>

        {/* Slider row */}
        <div className="flex gap-4 md:gap-6">

          {/* Arrow sx */}
          <button
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Precedente"
            className="shrink-0 self-start p-1 transition-opacity duration-200 focus:outline-none disabled:opacity-20 disabled:cursor-not-allowed opacity-70 hover:opacity-100"
            style={{ color: 'var(--color-fucsia)', marginTop: '13%' }}
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </button>

          {/* Cards */}
          <div className="flex-1">
            <div
              className="grid gap-4 md:gap-5"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {visibleItems.length > 0
                ? visibleItems.map((corto, i) => {
                    const globalIdx = startIndex + i
                    return (
                      <motion.div
                        key={`${annoAttivo}-${globalIdx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        <CortoLocandina corto={corto} onClick={() => setSelectedCorto(corto)} />
                      </motion.div>
                    )
                  })
                : Array.from({ length: VISIBLE }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] rounded-squircle bg-azzurro-light animate-pulse" />
                  ))}
            </div>

            {/* Preloaded items nascosti */}
            <div className="hidden" aria-hidden="true">
              {preloadItems.map((corto) =>
                corto.locandina ? <img key={corto.titolo} src={corto.locandina} loading="eager" decoding="async" alt="" /> : null
              )}
            </div>
          </div>

          {/* Arrow dx */}
          <button
            onClick={goNext}
            disabled={!canNext}
            aria-label="Successivo"
            className="shrink-0 self-start p-1 transition-opacity duration-200 focus:outline-none disabled:opacity-20 disabled:cursor-not-allowed opacity-70 hover:opacity-100"
            style={{ color: 'var(--color-fucsia)', marginTop: '13%' }}
          >
            <ChevronRight size={28} strokeWidth={2} />
          </button>
        </div>

        {/* Dot indicators */}
        {cortiAttivi.length > VISIBLE && (
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: cortiAttivi.length - VISIBLE + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > startIndex ? 1 : -1); setStartIndex(i) }}
                aria-label={`Vai alla posizione ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === startIndex ? 'w-5' : 'w-1.5 hover:opacity-60'
                }`}
                style={{ backgroundColor: i === startIndex ? 'var(--color-fucsia)' : 'rgba(229,5,118,0.25)' }}
              />
            ))}
          </div>
        )}
      </div>

      <VideoModal corto={selectedCorto} onClose={() => setSelectedCorto(null)} />
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FSL() {
  return (
    <>
      <Helmet>
        <title>Formazione Scuola-Lavoro | SettimaArte</title>
        <link rel="canonical" href="https://www.settimaartefestival.it/fsl" />
        <meta
          name="description"
          content="SettimaArte FSL: un percorso PCTO unico in cui gli studenti girano cortometraggi professionali all'interno di Oriocenter, a Bergamo."
        />
      </Helmet>

      <Header />

      <main>
        {/* 1. Hero */}
        <HeroSlider
          slides={[heroFSLImage]}
          subtitle="FSL — Formazione Scuola-Lavoro"
          title="Un'esperienza di Formazione Scuola-Lavoro unica nel suo genere"
        />

        {/* 2. Copy descrittivo */}
        <CopySection />

        {/* 3. Risultati numerici + Certificato */}
        <StatsSection />

        {/* 4. Copy intermedio */}
        <CopyMidSection />

        {/* 5. Gallery mista backstage */}
        <GalleryBlock
          title="Backstage dalle edizioni"
          label="Gallery"
          items={fslBackstageMisto}
          columns={3}
          bg="bg-white"
        />

        {/* 6. Locandine per anno/edizione */}
        <LocandineSection />

        {/* 7. YouTube CTA */}
        <section className="w-full py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl text-center flex flex-col items-center gap-6">
            <p className="font-funnel font-bold text-2xl md:text-3xl text-blu leading-snug">
              Vuoi vedere tutti i cortometraggi realizzati dagli studenti?
            </p>
            <p className="text-blu/60 font-funnel text-base md:text-lg">
              Sul canale YouTube di Oriocenter trovi tutte le edizioni del progetto FSL.
            </p>
            <a
              href="https://www.youtube.com/@OriocenterSelectedStores/featured"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-funnel font-semibold text-base px-8 py-4 rounded-squircle transition-all duration-200"
              style={{ backgroundColor: 'var(--color-blu)', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Vai al canale YouTube
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
