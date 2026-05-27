import { useRef, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X, ExternalLink, Trophy } from 'lucide-react'
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
  { value: '1.450', label: 'Studenti coinvolti' },
  { value: '58', label: 'Settimane di FSL' },
  { value: '16', label: 'Eventi pubblici' },
  { value: '4.480', label: 'Persone coinvolte' },
]

function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section data-header-dark ref={ref} className="w-full py-20 md:py-28" style={{ backgroundColor: 'var(--color-blu)' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center mb-16">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <p className="font-funnel font-bold text-5xl md:text-7xl text-white leading-none">
                {value}
              </p>
              <p className="mt-3 text-white/60 text-sm md:text-base font-funnel">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Certificate of Merit — featured */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border border-yellow-400/40 rounded-squircle p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 bg-yellow-400/5"
        >
          <div className="w-16 h-16 rounded-2xl bg-yellow-400/15 flex items-center justify-center shrink-0">
            <Trophy size={32} className="text-yellow-400" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-yellow-400/80 mb-1">
              Riconoscimento
            </p>
            <p className="font-funnel font-bold text-xl md:text-2xl text-white leading-tight">
              Certificate of Merit — CNCC 2023
            </p>
            <p className="text-white/50 text-sm font-funnel mt-1">
              Consiglio Nazionale dei Centri Commerciali — premio per l'eccellenza nei progetti educational
            </p>
          </div>
        </motion.div>
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
          <>Negli ultimi anni, i percorsi di <strong>Formazione Scuola-Lavoro</strong> sono diventati un passaggio obbligato per gli studenti delle scuole superiori. Spesso, però, docenti e ragazzi temono che queste esperienze si traducano in attività ripetitive e poco formative, come fare fotocopie o gestire semplici pratiche amministrative.</>,
          <>Oriocenter ha scelto un approccio diverso: investire in un <strong>progetto educational</strong> pensato per valorizzare davvero il potenziale degli studenti. All'interno degli spazi del mall, i partecipanti sono coinvolti in un'esperienza creativa che li sfida a raccontare un tema attraverso il <strong>linguaggio cinematografico</strong>. I ragazzi portano prospettive nuove, capacità di lettura del presente e una sensibilità comunicativa che spesso anticipa i cambiamenti.</>,
          <>Nel concreto, gli studenti vivono un percorso immersivo che riproduce dinamiche, tempi e responsabilità di un vero contesto professionale. Affiancati da <strong>videomaker ed educatori</strong>, sperimentano tutte le fasi di realizzazione di un cortometraggio, assumendo ruoli diversi — dalla regia alla produzione, fino alla recitazione — mettendo in gioco la propria creatività.</>,
          <>L'obiettivo non è formarli come registi o attori, ma offrire loro l'opportunità di far emergere <strong>competenze trasversali</strong> spesso invisibili finché non vengono messe alla prova. Collaborazione, gestione dello stress, capacità decisionale e ascolto reciproco diventano elementi concreti, che prendono forma attraverso l'esperienza diretta.</>,
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
          <>Queste esperienze raccontano qualcosa di più ampio del cinema. Raccontano cosa accade quando le aziende decidono di <strong>aprire spazi reali ai giovani</strong>, permettendo loro di osservare, provare, sbagliare e contribuire. Non si tratta di offrire opportunità a parole, ma di creare contesti in cui il valore dei ragazzi si vede davvero — e spesso sorprende sia chi li osserva, sia chi lo conosce in circostanze differenti.</>,
          <>Per molte imprese, lavorare con la <strong>Generazione Z</strong> può sembrare complesso: linguaggi diversi, aspettative nuove, modalità relazionali in evoluzione. Ma proprio per questo diventa strategico costruire esperienze concrete e guidate, dove l'incontro avviene in modo strutturato e significativo. <strong>Oriocenter</strong> ha permesso che questo accadesse, rendendo il risultato non solo educativo ma culturale.</>,
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
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
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
      className="group flex flex-col gap-2 text-left focus:outline-none focus:ring-2 focus:ring-azzurro rounded-squircle disabled:cursor-default"
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

function LocandineSection() {
  const anni = Object.keys(locandinePerEdizione).reverse()
  const [annoAttivo, setAnnoAttivo] = useState(anni[0])
  const [selectedCorto, setSelectedCorto] = useState<CortoEdizione | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="w-full py-20 md:py-28 border-t border-azzurro-light"
      style={{ backgroundColor: 'var(--color-azzurro-light)' }}
    >
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
              className={`px-5 py-2 rounded-squircle font-funnel font-semibold text-sm transition-colors ${
                anno === annoAttivo
                  ? 'bg-azzurro text-white'
                  : 'border border-azzurro text-azzurro bg-white hover:bg-azzurro/10'
              }`}
            >
              {anno}
            </button>
          ))}
        </motion.div>

        {/* Edizioni anno attivo */}
        <motion.div
          key={annoAttivo}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-14"
        >
          {locandinePerEdizione[annoAttivo].map((edizione) => (
            <div key={edizione.label}>
              <h3 className="font-funnel font-bold text-2xl text-blu mb-8">
                {edizione.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {edizione.corti.map((corto) => (
                  <CortoLocandina
                    key={corto.titolo}
                    corto={corto}
                    onClick={() => setSelectedCorto(corto)}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
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
          title="Cinema come strumento educativo, Oriocenter come set"
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
      </main>

      <Footer />
    </>
  )
}
