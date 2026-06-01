import { useRef, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, useInView } from 'framer-motion'
import { Users, Microscope, Clapperboard, Award } from 'lucide-react'
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
    text: 'Oriocenter coordina il progetto: Delta Index contribuisce alla base scientifica, educatori validano il valore formativo, OkiDoki garantisce la qualità cinematografica.',
  },
  {
    num: '03',
    title: 'Selezione dei 10 studenti',
    text: 'Durante le settimane FSL vengono selezionati 10 studenti per affidabilità, capacità di lavoro in squadra e attitudine a contribuire concretamente.',
  },
  {
    num: '04',
    title: "L'estate con OkiDoki",
    text: "Nel corso dell'estate, il team di OkiDoki realizza il cortometraggio coinvolgendo direttamente gli studenti in ogni fase della produzione.",
  },
]

function IterSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="w-full py-14 md:py-28"
      style={{ backgroundColor: 'var(--color-white)' }}
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

        {/* Timeline steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-[2.2rem] left-0 right-0 h-px"
            style={{ backgroundColor: 'var(--color-azzurro-light)', zIndex: 0 }}
          />
          {/* Animated fill */}
          <motion.div
            className="hidden md:block absolute top-[2.2rem] left-0 h-px origin-left"
            style={{ backgroundColor: 'var(--color-fucsia)', zIndex: 1, right: 0 }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 relative">
            {iterSteps.map(({ num, title, text }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: 'easeOut' }}
                className="flex flex-col gap-4 md:gap-5"
              >
                {/* Step dot + number */}
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                  <div
                    className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--color-fucsia)' }}
                  >
                    <span
                      className="font-funnel font-bold text-white leading-none select-none"
                      style={{ fontSize: '1.75rem' }}
                    >
                      {num}
                    </span>
                  </div>
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
  { icon: Users,        title: 'Selezione di 10 studenti',       desc: 'I più meritevoli tra tutti i partecipanti FSL, scelti per affidabilità e attitudine al lavoro di squadra.' },
  { icon: Microscope,   title: 'Supporto contenutistico Delta Index', desc: 'Base scientifica e validazione del valore formativo di ogni edizione del progetto.' },
  { icon: Clapperboard, title: 'Produzione professionale OkiDoki', desc: 'Una casa di produzione cinematografica vera, con ritmi, standard e aspettative autentiche.' },
  { icon: Award,        title: 'Candidatura ai festival nazionali', desc: 'Il cortometraggio partecipa ai principali festival italiani, con risultati concreti di rilievo.' },
]

function AspettiChiave() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      data-header-dark
      ref={ref}
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: 'var(--color-blu)' }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-funnel font-semibold tracking-widest uppercase mb-3 text-azzurro">
            In sintesi
          </p>
          <h2 className="font-funnel font-bold text-3xl md:text-5xl text-white leading-tight">
            Gli aspetti chiave
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {aspetti.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.09 }}
              className="flex gap-5 p-6 rounded-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(229,5,118,0.15)' }}
              >
                <Icon size={22} style={{ color: 'var(--color-fucsia)' }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="font-funnel font-bold text-white text-lg leading-snug">{title}</p>
                <p className="font-funnel text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
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
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-blu)', minHeight: '520px', display: 'flex', alignItems: 'center' }}
    >
      {/* Foto di sfondo */}
      {cortoCitazioneBg && (
        <img
          src={cortoCitazioneBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-25"
        />
      )}

      {/* Overlay gradient top+bottom per leggibilità */}
      <div className="absolute inset-0 bg-gradient-to-b from-blu/70 via-transparent to-blu/80" />
      <div className="absolute inset-0" style={{ background: 'rgba(32,36,76,0.45)' }} />

      <div className="container mx-auto px-6 max-w-3xl text-center relative py-24 md:py-36 w-full">
        <motion.blockquote
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Virgolette decorative */}
          <span
            className="block font-funnel font-bold leading-none select-none mb-6"
            style={{ fontSize: '5rem', color: 'var(--color-fucsia)', lineHeight: 1, opacity: 0.6 }}
            aria-hidden
          >
            "
          </span>

          {/* Citazione principale — bold italic */}
          <p className="font-funnel font-bold italic text-2xl md:text-3xl lg:text-[2.1rem] text-white leading-[1.45] mb-6">
            Investire sui giovani non dovrebbe essere un gesto simbolico, ma una scelta strategica
            capace di generare valore nel tempo.
          </p>

          {/* Seconda frase */}
          <p className="font-funnel font-medium italic text-white/75 text-lg md:text-xl leading-relaxed mb-10">
            Le esperienze sviluppate attorno al linguaggio cinematografico mostrano come, quando
            l'incontro tra impresa e nuove generazioni è progettato con cura, possa dare vita
            a risultati inattesi, e talvolta straordinari.
          </p>

          {/* Attributo */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-fucsia/60" />
            <p className="font-funnel font-semibold text-white/50 text-sm tracking-widest uppercase">
              Settima Arte — Oriocenter
            </p>
            <span className="h-px w-8 bg-fucsia/60" />
          </div>
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
          title="Produzione estiva con una troupe vera"
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
