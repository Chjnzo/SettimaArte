import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, useInView } from 'framer-motion'
import { Users, Star, Film, Award } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import HeroSlider from '@/components/HeroSlider'
import EdizioneCortometraggio from '@/components/EdizioneCortometraggio'
import { edizioniData, cortoBackstageStudenti, cortoCitazioneBg } from '@/data/cortometraggio'

function SectionLabel({ children, white = false }: { children: React.ReactNode; white?: boolean }) {
  return (
    <p className={`text-xs font-funnel font-semibold tracking-widest uppercase mb-3 ${white ? 'text-azzurro' : 'text-azzurro'}`}>
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


// ─── Copy introduttivo ────────────────────────────────────────────────────────

function CopyIntro() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const paragraphs = [
    "Il progetto Settima Arte nasce con un obiettivo chiaro: permettere agli studenti di sperimentare ruoli, tempi e responsabilità simili a quelli di un vero contesto professionale.",
    "Nel tempo, osservando i ragazzi lavorare sui set, costruire storie, confrontarsi con vincoli e imprevisti, è emersa una domanda naturale: cosa succede quando questo potenziale viene portato ancora oltre?",
    "Da questa domanda nasce l'evoluzione del progetto. Alcuni studenti selezionati tra i partecipanti alle diverse edizioni hanno l'opportunità di vivere un'esperienza unica: affiancare una troupe cinematografica professionale durante la produzione di un cortometraggio estivo. Non più simulazione, ma produzione reale. Non più esercizio creativo, ma responsabilità condivisa con professionisti del settore.",
    "È qui che il percorso cambia scala. Gli studenti entrano in un set vero, con ritmi, standard e aspettative autentiche, contribuendo attivamente alla realizzazione di un'opera cinematografica.",
    "Un passaggio che dimostra come il cinema, oltre a raccontare storie, possa diventare uno strumento educativo potente. È in questo incontro tra formazione e creatività che la \"settima arte\" rivela il suo valore più profondo: non solo per chi guarda, ma per chi la vive in prima persona.",
  ]

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="text-blu/75 leading-relaxed text-lg"
          >
            {text}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

// ─── L'iter ───────────────────────────────────────────────────────────────────

function IterSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const paragraphs = [
    "Ogni anno, il progetto prende forma a partire da un lavoro condiviso. Una commissione composta da professionisti di ambiti diversi definisce il tema del cortometraggio, affidandone lo sviluppo a una casa di produzione cinematografica.",
    "Oriocenter è il promotore dell'iniziativa e coordina un ecosistema di competenze: l'Osservatorio Delta Index contribuisce alla definizione della base scientifica, educatori e psicologi validano il valore formativo del percorso, mentre la casa di produzione Oki Doki Film ne garantisce la qualità e la fattibilità cinematografica.",
    "Durante le settimane di Formazione Scuola-Lavoro vengono selezionati 10 studenti che si distinguono per affidabilità, capacità di lavorare in squadra e attitudine a contribuire in modo concreto al progetto. Sono loro i protagonisti dell'esperienza estiva.",
    "Nel corso dell'estate, il team di Oki Doki Film realizza il cortometraggio coinvolgendo direttamente gli studenti nelle diverse fasi della produzione. Un'esperienza immersiva, intensa e altamente formativa, che lascia un segno profondo: non solo competenze, ma consapevolezza, metodo e memoria.",
  ]

  return (
    <section
      ref={ref}
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: 'var(--color-azzurro-light)' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-2xl"
        >
          <SectionLabel>L'iter</SectionLabel>
          <SectionHeading>Come funziona</SectionHeading>
        </motion.div>

        <div className="max-w-3xl space-y-8">
          {paragraphs.map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.09 }}
              className="text-blu/80 leading-relaxed text-lg"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Aspetti chiave ───────────────────────────────────────────────────────────

const aspetti = [
  {
    icon: Users,
    title: 'Selezione di 10 studenti',
    desc: 'I ragazzi più meritevoli tra tutti gli istituti partecipanti al percorso FSL vengono scelti per vivere questa esperienza.',
  },
  {
    icon: Star,
    title: 'Supporto Delta Index',
    desc: 'Supporto contenutistico e narrativo da parte del team di Delta Index per garantire la qualità della sceneggiatura.',
  },
  {
    icon: Film,
    title: 'Produzione professionale',
    desc: 'Troupe OkiDoki, attrezzatura cinema, attori professionisti. Nessun compromesso sulla qualità del set.',
  },
  {
    icon: Award,
    title: 'Festival nazionali',
    desc: 'I cortometraggi vengono candidati ai principali festival cinematografici italiani, con risultati già significativi.',
  },
]

function AspettiChiave() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionLabel>In sintesi</SectionLabel>
          <SectionHeading>Gli aspetti chiave del progetto</SectionHeading>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aspetti.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.09 }}
              className="rounded-squircle border border-azzurro-light p-6 flex flex-col gap-4 hover:border-azzurro/40 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-azzurro/10 flex items-center justify-center">
                <Icon size={20} className="text-azzurro" />
              </div>
              <p className="font-funnel font-semibold text-blu text-lg leading-snug">{title}</p>
              <p className="text-blu/60 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Gallery backstage studenti ───────────────────────────────────────────────

function BackstageStudentiGallery() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="w-full py-16 md:py-20 border-t"
      style={{ borderColor: 'var(--color-azzurro-light)' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <SectionLabel>Gallery</SectionLabel>
          <SectionHeading>Gli studenti sul set</SectionHeading>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Gallery
            items={cortoBackstageStudenti}
            columns={3}
            showPlaceholders={cortoBackstageStudenti.length === 0}
            placeholderCount={6}
          />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Citazione finale ─────────────────────────────────────────────────────────

function CitazioneFinale() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      data-header-dark
      ref={ref}
      className="relative w-full py-28 md:py-36 overflow-hidden"
      style={{ backgroundColor: 'var(--color-blu)' }}
    >
      {/* Foto di sfondo se disponibile */}
      {cortoCitazioneBg && (
        <img
          src={cortoCitazioneBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}

      {/* Gradiente overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blu/80 to-transparent" />

      <div className="container mx-auto px-4 max-w-3xl text-center relative">
        <motion.blockquote
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-funnel font-bold text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed">
            "Investire sui giovani non dovrebbe essere un gesto simbolico, ma una scelta strategica
            capace di generare valore nel tempo."
          </p>
        </motion.blockquote>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Cortometraggio() {
  return (
    <>
      <Helmet>
        <title>Cortometraggio Professionale | SettimaArte</title>
        <link rel="canonical" href="https://www.settimaartefestival.it/cortometraggio" />
        <meta
          name="description"
          content="10 studenti selezionati affiancano una troupe professionale per produrre un cortometraggio estivo candidato ai principali festival nazionali italiani."
        />
      </Helmet>

      <Header />

      <main>
        {/* 1. Hero */}
        <HeroSlider
          slides={[{ type: 'video', src: '', videoId: 'l9zSUCoaUw4', alt: 'BTS cortometraggio Oriocenter' }]}
          subtitle="Cortometraggio Professionale"
          title="Produzione cinematografica professionale estiva per alcuni studenti del progetto educational Settima Arte"
        />

        {/* 2. Copy introduttivo — 5 paragrafi */}
        <CopyIntro />

        {/* 3. L'iter — 6 step */}
        <IterSection />

        {/* 4. Aspetti chiave — 4 card */}
        <AspettiChiave />

        {/* 5. Gallery backstage studenti */}
        <BackstageStudentiGallery />

        {/* 6–7. Edizioni (2024 + 2025) */}
        <div className="divide-y divide-azzurro-light">
          {edizioniData.map((edizione, i) => (
            <EdizioneCortometraggio key={edizione.anno} edizione={edizione} index={i} />
          ))}
        </div>

        {/* 8. Citazione finale */}
        <CitazioneFinale />
      </main>

      <Footer />
    </>
  )
}
