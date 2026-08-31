import { useRef, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import HeroSlider from '@/components/HeroSlider'
import VotazioniSection from '@/components/VotazioniSection'
import { festivalGalleryEvento, festivalGalleryBackstage } from '@/data/festival'
import { heroFestivalImage } from '@/data/images'
import { useGallerySection } from '@/hooks/useGallerySection'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-3">
      {children}
    </p>
  )
}

function SectionHeading({ children, white = false }: { children: React.ReactNode; white?: boolean }) {
  return (
    <h2 className={`font-funnel font-bold text-3xl md:text-4xl lg:text-5xl leading-tight ${white ? 'text-white' : 'text-blu'}`}>
      {children}
    </h2>
  )
}


// ─── Copy evento ──────────────────────────────────────────────────────────────

function CopyEvento() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const paragraphs: ReactNode[] = [
    <><strong>Operare su un set cinematografico è un'esperienza intensa</strong>, coinvolgente, capace di mettere davvero alla prova ogni competenza. Ed è proprio per questo che il percorso non si conclude semplicemente con la fine delle attività. Si trasforma in un <strong>evento</strong>.</>,
    <>Al termine delle settimane di Formazione Scuola-Lavoro, Oriocenter celebra il lavoro degli studenti con una vera e propria giornata-evento aperta al pubblico: <strong>genitori, insegnanti, amici e visitatori diventano parte di un momento collettivo</strong>, pensato per dare visibilità e riconoscimento ai progetti realizzati.</>,
    <>L'esperienza inizia già nelle settimane precedenti: le locandine e i cortometraggi vengono pubblicati online e si aprono le <strong>votazioni da casa</strong>. Il pubblico può guardare, scegliere e sostenere i lavori preferiti. In questa fase, i ragazzi sono chiamati ad un ruolo attivo, mobilitando la propria rete e promuovendo il proprio progetto attraverso tutti i canali possibili per raccogliere voti e visibilità. Si crea così attesa, confronto e partecipazione. Due volte l'anno, a Dicembre e a Giugno, le classi si ritrovano nella sala 14 di UCI Orio a Oriocenter. I <strong>cortometraggi vengono proiettati sul grande schermo</strong>, trasformando il lavoro svolto in un'esperienza cinematografica completa, condivisa con gli altri partecipanti e con il pubblico.</>,
    <>Ma non è solo una proiezione: è un vero format. Durante la mattinata, gli studenti tornano a mettersi in gioco con nuove sfide dal vivo, mentre una <strong>giuria d'eccezione</strong> osserva, valuta e assegna i premi. Tra gli ospiti delle diverse edizioni ci sono stati volti noti come <strong>Frank Matano e i Pampers</strong>, affiancati da <strong>registi e professionisti della casa di produzione Oki Doki Film</strong>, partner del progetto. La giuria assegna riconoscimenti come miglior attore, miglior locandina e miglior storia. Ma il premio più importante resta nelle mani del pubblico: è il voto da casa a decretare il vincitore assoluto di ogni edizione.</>,
    <>E per alcuni ragazzi, questo non è il punto di arrivo. Nel corso dell'anno, infatti, vengono selezionati gli <strong>studenti che avranno l'opportunità di prendere parte a una produzione cinematografica estiva realizzata insieme a Oki Doki Film.</strong> Un'esperienza ancora più avanzata, che porta i ragazzi a confrontarsi con un set professionale reale. Un percorso che continua, cresce e si evolve.</>,
  ]

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        {paragraphs.map((content, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            className="text-blu/80 leading-relaxed text-lg font-funnel"
          >
            {content}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '500', label: 'Studenti coinvolti per edizione' },
  { value: '16', label: 'Cortometraggi per evento' },
  { value: '5.000', label: 'Voti online per evento' },
  { value: '4.000+', label: 'Partecipanti coinvolti' },
]

function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 md:py-28 bg-white overflow-x-clip">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 md:mb-20 text-center"
        >
          <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-3">
            I numeri del Festival
          </p>
          <h2 className="font-funnel font-bold text-4xl md:text-5xl text-blu leading-tight">
            Risultati raggiunti
          </h2>
        </motion.div>

        {/* Parentesi fucsia */}
        <div className="relative px-6 md:px-10">
          <svg aria-hidden viewBox="0 0 40 120" className="absolute left-0 top-0 bottom-0 w-5 md:w-7 h-full" preserveAspectRatio="none" fill="none">
            <path d="M30 4 L10 4 L10 116 L30 116" stroke="var(--color-fucsia)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg aria-hidden viewBox="0 0 40 120" className="absolute right-0 top-0 bottom-0 w-5 md:w-7 h-full" preserveAspectRatio="none" fill="none">
            <path d="M10 4 L30 4 L30 116 L10 116" stroke="var(--color-fucsia)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-14 md:gap-x-6 py-8 md:py-10">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="text-center px-1"
              >
                <p
                  className="font-funnel font-bold tabular-nums leading-none whitespace-nowrap text-4xl sm:text-5xl md:text-6xl text-blu"
                >
                  {value}
                </p>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.12 }}
                  className="mx-auto mt-4 block h-[3px] w-8 rounded-full bg-fucsia origin-center"
                />
                <p className="mt-4 text-blu/70 font-funnel text-sm md:text-base leading-snug max-w-[11rem] mx-auto">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Regolamento Festival ─────────────────────────────────────────────────────

// TODO: sostituire il percorso con l'URL reale del PDF quando disponibile
const REGOLAMENTO_PDF_URL = '/regolamento-festival.pdf'

function RegolamentoCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-10 md:py-14 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-squircle bg-blu/5 border border-blu/10 px-8 py-6"
        >
          <div className="flex items-center gap-4">
            <FileText size={32} className="shrink-0 text-fucsia" />
            <div>
              <p className="font-funnel font-semibold text-blu text-lg leading-tight">
                Regolamento del Festival
              </p>
              <p className="font-funnel text-blu/60 text-sm mt-0.5">
                Scarica il documento ufficiale con tutte le regole e le modalità di partecipazione
              </p>
            </div>
          </div>
          <a
            href={REGOLAMENTO_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'cta_click', { cta_label: 'regolamento_pdf', page: 'festival' })}
            className="shrink-0 inline-flex items-center gap-2 bg-fucsia hover:bg-fucsia/90 text-white font-funnel font-semibold px-6 py-3 rounded-squircle transition-colors duration-200"
          >
            <FileText size={16} />
            Leggi il regolamento
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Link al Cortometraggio ───────────────────────────────────────────────────

function CortoLink() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="rounded-squircle border-2 border-azzurro/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
          <div className="flex-1 space-y-3">
            <SectionLabel>Il passo successivo</SectionLabel>
            <h3 className="font-funnel font-bold text-2xl md:text-3xl text-blu">
              Scopri la produzione cinematografica estiva
            </h3>
            <p className="text-blu/80 leading-relaxed text-base">
              I ragazzi più meritevoli vengono selezionati per affiancare una troupe professionale
              nella realizzazione di un cortometraggio vero, candidato ai principali festival
              nazionali italiani.
            </p>
          </div>
          <Link
            to="/cortometraggio"
            className="shrink-0 inline-flex items-center gap-2 bg-azzurro hover:bg-azzurro/90 text-white font-funnel font-semibold px-7 py-4 rounded-squircle transition-colors duration-200"
          >
            Scopri di più
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Gallery block ────────────────────────────────────────────────────────────

interface GalleryBlockProps {
  label: string
  title: string
  items: import('@/components/Gallery').GalleryItem[]
  columns?: 2 | 3 | 4
  bg?: string
  initialVisible?: number
}

function GalleryBlock({ label, title, items, columns = 3, bg = 'bg-white', initialVisible }: GalleryBlockProps) {
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
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading>{title}</SectionHeading>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Gallery items={items} columns={columns} showPlaceholders={items.length === 0} initialVisible={initialVisible} />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Festival() {
  const galleryEvento = useGallerySection('festival-evento', festivalGalleryEvento)
  const galleryBackstage = useGallerySection('festival-backstage', festivalGalleryBackstage)

  return (
    <>
      <Helmet>
        <title>Festival | I Cortometraggi degli Studenti | SettimaArte</title>
        <link rel="canonical" href="https://settimaartefestival.it/festival" />
        <meta name="description" content="Il Settima Arte Festival proietta i cortometraggi degli studenti alla sala 14 di UCI Orio a Oriocenter. Due edizioni l'anno, giuria d'eccezione, votazioni online aperte a tutti." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://settimaartefestival.it/festival" />
        <meta property="og:site_name" content="SettimaArte" />
        <meta property="og:locale" content="it_IT" />
        <meta property="og:title" content="Festival | I Cortometraggi degli Studenti | SettimaArte" />
        <meta property="og:description" content="Il Settima Arte Festival proietta i cortometraggi degli studenti alla sala 14 di UCI Orio a Oriocenter. Due edizioni l'anno, giuria d'eccezione, votazioni online aperte a tutti." />
        <meta property="og:image" content="https://settimaartefestival.it/images/Festival/Hero/selfie-evento-ragazzi-felici.jpg" />
        <meta property="og:image:alt" content="Selfie di gruppo dei ragazzi al Settima Arte Festival" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Festival | I Cortometraggi degli Studenti | SettimaArte" />
        <meta name="twitter:description" content="Il Settima Arte Festival proietta i cortometraggi degli studenti alla sala 14 di UCI Orio a Oriocenter. Due edizioni l'anno, giuria d'eccezione, votazioni online aperte a tutti." />
        <meta name="twitter:image" content="https://settimaartefestival.it/images/Festival/Hero/selfie-evento-ragazzi-felici.jpg" />
      </Helmet>

      <Header />

      <main>
        {/* 1. Hero */}
        <HeroSlider
          slides={[heroFestivalImage]}
          subtitle="Il Settima Arte Festival"
          title="Evento conclusivo con proiezioni dei corti realizzati dagli studenti a UCI Cinemas Orio"
        />

        {/* 2. Copy evento + come funziona */}
        <CopyEvento />

        {/* 3. Risultati numerici */}
        <StatsSection />

        {/* 4. Regolamento Festival */}
        <RegolamentoCTA />

        {/* 5. Link cortometraggio professionale */}
        <CortoLink />

        {/* 6. Votazioni — visibile solo in dicembre e giugno */}
        <VotazioniSection />

        {/* 7. Gallery foto evento */}
        <GalleryBlock
          label="Gallery"
          title="Le giornate del festival"
          items={galleryEvento}
          columns={3}
          bg="bg-white border-t border-azzurro-light"
        />

        {/* 8. Gallery video backstage */}
        <GalleryBlock
          label="Backstage"
          title="Il dietro le quinte"
          items={galleryBackstage}
          columns={3}
          bg="bg-white border-t border-azzurro-light"
          initialVisible={0}
        />
      </main>

      <Footer />
    </>
  )
}
