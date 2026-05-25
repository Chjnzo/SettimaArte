import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import HeroSlider from '@/components/HeroSlider'
import VotazioniSection from '@/components/VotazioniSection'
import { festivalGalleryEvento, festivalGalleryBackstage } from '@/data/festival'
import { heroFestivalImage } from '@/data/images'

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

  const paragraphs = [
    "Operare su un set cinematografico è un'esperienza intensa, coinvolgente, capace di mettere davvero alla prova ogni competenza. Ed è proprio per questo che il percorso non si conclude semplicemente con la fine delle attività. Si trasforma in un evento.",
    "Al termine delle settimane di Formazione Scuola-Lavoro, Oriocenter celebra il lavoro degli studenti con una vera e propria giornata-evento aperta al pubblico: genitori, insegnanti, amici e visitatori diventano parte di un momento collettivo, pensato per dare visibilità e riconoscimento ai progetti realizzati.",
    "L'esperienza inizia già nelle settimane precedenti: le locandine e i cortometraggi vengono pubblicati online e si aprono le votazioni da casa. Il pubblico può guardare, scegliere e sostenere i lavori preferiti. In questa fase, i ragazzi sono chiamati ad un ruolo attivo, mobilitando la propria rete e promuovendo il proprio progetto attraverso tutti i canali possibili per raccogliere voti e visibilità. Si crea così attesa, confronto e partecipazione.",
    "Due volte l'anno, a Dicembre e a Giugno, le classi si ritrovano nella sala 14 di UCI Orio a Oriocenter. I cortometraggi vengono proiettati sul grande schermo, trasformando il lavoro svolto in un'esperienza cinematografica completa, condivisa con gli altri partecipanti e con il pubblico.",
    "Ma non è solo una proiezione: è un vero format. Durante la mattinata, gli studenti tornano a mettersi in gioco con nuove sfide dal vivo, mentre una giuria d'eccezione osserva, valuta e assegna i premi. Tra gli ospiti delle diverse edizioni ci sono stati volti noti come Frank Matano e i Pampers, affiancati da registi e professionisti della casa di produzione Oki Doki Film, partner del progetto. La giuria assegna riconoscimenti come miglior attore, miglior locandina e miglior storia. Ma il premio più importante resta nelle mani del pubblico: è il voto da casa a decretare il vincitore assoluto di ogni edizione.",
    "E per alcuni ragazzi, questo non è il punto di arrivo. Nel corso dell'anno, infatti, vengono selezionati gli studenti che avranno l'opportunità di prendere parte a una produzione cinematografica estiva realizzata insieme a Oki Doki Film. Un'esperienza ancora più avanzata, che porta i ragazzi a confrontarsi con un set professionale reale. Un percorso che continua, cresce e si evolve.",
  ]

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            className="text-blu/75 leading-relaxed text-lg"
          >
            {text}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '~500', label: 'Studenti coinvolti per edizione' },
  { value: '16', label: 'Cortometraggi per evento' },
  { value: '5.000', label: 'Voti online per evento' },
]

function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: 'var(--color-azzurro-light)' }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <p className="font-funnel font-bold text-6xl md:text-7xl text-blu leading-none">
                {value}
              </p>
              <p className="mt-3 text-blu/60 font-funnel text-base">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Link al Cortometraggio ───────────────────────────────────────────────────

function CortoLink() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
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
            <p className="text-blu/65 leading-relaxed">
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
}

function GalleryBlock({ label, title, items, columns = 3, bg = 'bg-white' }: GalleryBlockProps) {
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
          <Gallery items={items} columns={columns} showPlaceholders={items.length === 0} />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Festival() {
  return (
    <>
      <Helmet>
        <title>Festival | I Cortometraggi degli Studenti | SettimaArte</title>
        <link rel="canonical" href="https://www.settimaartefestival.it/festival" />
        <meta
          name="description"
          content="Il Settima Arte Festival proietta i cortometraggi degli studenti alla sala 14 di UCI Orio a Oriocenter. Due edizioni l'anno, giuria d'eccezione, votazioni online aperte a tutti."
        />
      </Helmet>

      <Header />

      <main>
        {/* 1. Hero */}
        <HeroSlider
          slides={[heroFestivalImage]}
          subtitle="Settima Arte Festival"
          title="In occasione del Festival i corti degli studenti sono proiettati sul maxischermo di UCI Orio a Oriocenter"
        />

        {/* 2. Copy evento + come funziona */}
        <CopyEvento />

        {/* 3. Risultati numerici */}
        <StatsSection />

        {/* 4. Link cortometraggio professionale */}
        <CortoLink />

        {/* 5. Votazioni — visibile solo in dicembre e giugno */}
        <VotazioniSection />

        {/* 6. Gallery foto evento */}
        <GalleryBlock
          label="Gallery"
          title="Le serate del Festival"
          items={festivalGalleryEvento}
          columns={3}
          bg="bg-white border-t border-azzurro-light"
        />

        {/* 7. Gallery video backstage */}
        <GalleryBlock
          label="Backstage"
          title="Il dietro le quinte"
          items={festivalGalleryBackstage}
          columns={3}
          bg="bg-white border-t border-azzurro-light"
        />
      </main>

      <Footer />
    </>
  )
}
