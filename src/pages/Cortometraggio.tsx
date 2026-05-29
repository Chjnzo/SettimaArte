import { useRef, type ReactNode } from 'react'
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

  const paragraphs: ReactNode[] = [
    <>Il progetto Settima Arte nasce con un obiettivo chiaro: permettere agli studenti di sperimentare <strong>ruoli, tempi e responsabilità</strong> simili a quelli di un vero contesto professionale.</>,
    <>Nel tempo, osservando i ragazzi lavorare sui set, costruire storie, confrontarsi con vincoli e imprevisti, è emersa una domanda naturale: cosa succede quando questo potenziale viene portato ancora oltre?</>,
    <>Da questa domanda nasce l'evoluzione del progetto. Alcuni studenti selezionati tra i partecipanti alle diverse edizioni hanno l'opportunità di vivere un'esperienza unica: affiancare una <strong>troupe cinematografica professionale</strong> durante la produzione di un cortometraggio estivo. Non più simulazione, ma produzione reale. Non più esercizio creativo, ma responsabilità condivisa con professionisti del settore.</>,
    <>È qui che il percorso cambia scala. Gli studenti entrano in un <strong>set vero</strong>, con ritmi, standard e aspettative autentiche, contribuendo attivamente alla realizzazione di un'opera cinematografica.</>,
    <>Un passaggio che dimostra come il cinema, oltre a raccontare storie, possa diventare uno <strong>strumento educativo potente</strong>. È in questo incontro tra formazione e creatività che la "settima arte" rivela il suo valore più profondo: non solo per chi guarda, ma per chi la vive in prima persona.</>,
  ]

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        {paragraphs.map((content, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="text-blu/80 leading-relaxed text-lg font-funnel"
          >
            {content}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

// ─── L'iter — visual horizontal timeline ──────────────────────────────────────

const iterSteps = [
  {
    num: '01',
    title: 'Il tema e la commissione',
    text: 'Una commissione multidisciplinare definisce ogni anno il tema del cortometraggio e lo affida a una casa di produzione cinematografica.',
  },
  {
    num: '02',
    title: "L'ecosistema di competenze",
    text: 'Oriocenter coordina il progetto: Delta Index contribuisce alla base scientifica, educatori validano il valore formativo, Oki Doki Film garantisce la qualità cinematografica.',
  },
  {
    num: '03',
    title: 'Selezione dei 10 studenti',
    text: 'Durante le settimane FSL vengono selezionati 10 studenti per affidabilità, capacità di lavoro in squadra e attitudine a contribuire concretamente.',
  },
  {
    num: '04',
    title: "L'estate con Oki Doki Film",
    text: "Nel corso dell'estate, il team di Oki Doki Film realizza il cortometraggio coinvolgendo direttamente gli studenti in ogni fase della produzione.",
  },
]

function IterSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: 'var(--color-azzurro-light)' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 md:mb-20"
        >
          <SectionLabel>L'iter</SectionLabel>
          <SectionHeading>Come funziona</SectionHeading>
        </motion.div>

        {/* Steps grid */}
        <div className="relative">
          {/* Horizontal connector — desktop only */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'left center' }}
            className="hidden md:block absolute top-10 left-0 right-0 h-px bg-blu/20"
            aria-hidden
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            {iterSteps.map(({ num, title, text }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: 'easeOut' }}
                className="relative flex flex-col gap-4 md:gap-5"
              >
                {/* Vertical connector — mobile only, between steps */}
                {i < iterSteps.length - 1 && (
                  <span
                    className="sm:hidden absolute left-7 top-16 h-10 w-px bg-blu/20"
                    aria-hidden
                  />
                )}

                {/* Number */}
                <div className="relative">
                  <span
                    className="font-funnel font-bold leading-none select-none block"
                    style={{
                      fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
                      color: 'var(--color-fucsia)',
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </span>
                  {/* Dot on the horizontal line — desktop */}
                  <span
                    className="hidden md:block absolute left-0 w-3 h-3 rounded-full bg-fucsia border-2 border-azzurro-light"
                    style={{ top: '2.55rem', transform: 'translateY(-50%)' }}
                    aria-hidden
                  />
                </div>

                {/* Title */}
                <h3 className="font-funnel font-bold text-lg md:text-xl text-blu leading-snug">
                  {title}
                </h3>

                {/* Description */}
                <p className="font-funnel text-blu/65 text-sm md:text-base leading-relaxed">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Aspetti chiave ───────────────────────────────────────────────────────────

const aspetti = [
  { icon: Users,  title: 'Selezione di 10 studenti' },
  { icon: Star,   title: 'Supporto Delta Index' },
  { icon: Film,   title: 'Produzione professionale' },
  { icon: Award,  title: 'Festival nazionali' },
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
          className="mb-10"
        >
          <SectionLabel>In sintesi</SectionLabel>
          <SectionHeading>Gli aspetti chiave</SectionHeading>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {aspetti.map(({ icon: Icon, title }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.09 }}
              className="rounded-squircle border border-azzurro-light p-5 md:p-7 flex flex-col gap-4 hover:border-azzurro/40 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-azzurro/10 flex items-center justify-center shrink-0">
                <Icon size={24} className="text-azzurro" />
              </div>
              <p className="font-funnel font-bold text-blu text-base md:text-lg leading-snug">{title}</p>
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
      className="relative w-full py-28 md:py-40 overflow-hidden"
      style={{ backgroundColor: 'var(--color-blu)' }}
    >
      {/* Foto di sfondo */}
      {cortoCitazioneBg && (
        <img
          src={cortoCitazioneBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />
      )}

      {/* Gradiente overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blu/90 via-blu/40 to-transparent" />

      <div className="container mx-auto px-4 max-w-3xl text-center relative">
        <motion.blockquote
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Parte 1 — citazione vera e propria: bold italic, grande */}
          <p className="font-funnel font-bold italic text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed">
            "Investire sui giovani non dovrebbe essere un gesto simbolico, ma una scelta strategica
            capace di generare valore nel tempo."
          </p>

          {/* Separatore visivo */}
          <div className="my-8 flex items-center justify-center gap-4">
            <span className="flex-1 h-px bg-white/15 max-w-[80px]" />
            <span className="text-fucsia text-lg font-funnel font-bold">—</span>
            <span className="flex-1 h-px bg-white/15 max-w-[80px]" />
          </div>

          {/* Parte 2 — elaborazione: font leggero, non italic, più piccolo */}
          <p className="font-funnel font-light text-white/55 text-base md:text-lg leading-relaxed">
            Le esperienze sviluppate per Oriocenter attorno al linguaggio cinematografico mostrano
            come, quando l'incontro tra impresa e nuove generazioni è progettato con cura, possa
            dare vita a risultati inattesi — e talvolta straordinari.
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
        />

        {/* 2. Copy introduttivo */}
        <CopyIntro />

        {/* 3. L'iter — visual timeline */}
        <IterSection />

        {/* 4. Aspetti chiave */}
        <AspettiChiave />

        {/* 5. Gallery backstage studenti */}
        <BackstageStudentiGallery />

        {/* 6–7. Edizioni */}
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
