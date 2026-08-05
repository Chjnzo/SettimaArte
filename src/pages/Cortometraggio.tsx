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
import { galleryCortoLocandine } from '@/data/images'
import { useGallerySection } from '@/hooks/useGallerySection'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-funnel font-semibold tracking-widest uppercase mb-3 text-azzurro">
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
    <>Il progetto Settima Arte nasce con un obiettivo chiaro: permettere agli studenti di <strong>sperimentare ruoli, tempi e responsabilità</strong> simili a quelli di un <strong>vero contesto professionale</strong>.</>,
    <>Nel tempo, osservando i ragazzi lavorare sui set, costruire storie, confrontarsi con vincoli e imprevisti, è emersa una domanda naturale: cosa succede quando questo potenziale viene portato ancora oltre?</>,
    <>Da questa domanda nasce l'evoluzione del progetto.</>,
    <>Alcuni studenti selezionati tra i partecipanti alle diverse edizioni hanno l'opportunità di vivere un'esperienza unica: <strong>affiancare una troupe cinematografica professionale</strong> durante la produzione di un <strong>cortometraggio estivo</strong>. Non più simulazione, ma produzione reale. Non più esercizio creativo, ma responsabilità condivisa con professionisti del settore.</>,
    <>È qui che il <strong>percorso cambia scala</strong>. Gli studenti entrano in un set vero, con ritmi, standard e aspettative autentiche, contribuendo attivamente alla realizzazione di un'opera cinematografica.</>,
    <>Un passaggio che dimostra come il <strong>cinema</strong>, oltre a raccontare storie, possa diventare uno <strong>strumento educativo potente</strong>. È in questo incontro tra formazione e creatività che la <strong>"settima arte" rivela il suo valore più profondo: non solo per chi guarda, ma per chi la vive in prima persona</strong>.</>,
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

// ─── L'iter ───────────────────────────────────────────────────────────────────

const iterSteps = [
  {
    num: '01',
    title: 'Il tema e la produzione',
    text: 'Ogni anno, il progetto prende forma a partire da un lavoro condiviso. Una commissione composta da professionisti di ambiti diversi definisce il tema del cortometraggio, affidandone lo sviluppo a una casa di produzione cinematografica.',
  },
  {
    num: '02',
    title: "L'ecosistema di competenze",
    text: "Oriocenter è il promotore dell'iniziativa e coordina un ecosistema di competenze: l'Osservatorio Delta Index contribuisce alla definizione della base scientifica, educatori e psicologi validano il valore formativo del percorso, mentre la casa di produzione Oki Doki Film ne garantisce la qualità e la fattibilità cinematografica.",
  },
  {
    num: '03',
    title: 'La selezione degli studenti',
    text: "Durante le settimane di Formazione Scuola-Lavoro vengono selezionati 10 studenti che si distinguono per affidabilità, capacità di lavorare in squadra e attitudine a contribuire in modo concreto al progetto. Sono loro i protagonisti dell'esperienza estiva.",
  },
  {
    num: '04',
    title: 'Il cortometraggio',
    text: "Nel corso dell'estate, il team di Oki Doki Film realizza il cortometraggio coinvolgendo direttamente gli studenti nelle diverse fasi della produzione. Un'esperienza immersiva, intensa e altamente formativa, che lascia un segno profondo: non solo competenze, ma consapevolezza, metodo e memoria.",
  },
]

function IterSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-14 md:py-28 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <SectionHeading>L'iter</SectionHeading>
        </motion.div>
        <div className="space-y-0">
          {iterSteps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="flex gap-8 md:gap-12 pb-12 md:pb-14"
            >
              {/* Numero + linea verticale */}
              <div className="flex flex-col items-center shrink-0">
                <span
                  className="font-funnel font-bold text-3xl md:text-4xl leading-none"
                  style={{ color: 'var(--color-fucsia)' }}
                >
                  {step.num}
                </span>
                {i < iterSteps.length - 1 && (
                  <div className="mt-4 w-px flex-1" style={{ backgroundColor: 'var(--color-azzurro-light)' }} />
                )}
              </div>
              {/* Testo */}
              <div className="pb-2 flex flex-col gap-2">
                <p className="font-funnel font-bold text-xl md:text-2xl text-blu leading-snug">
                  {step.title}
                </p>
                <p className="text-blu/70 leading-relaxed text-base md:text-lg font-funnel">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Aspetti chiave ───────────────────────────────────────────────────────────

const aspetti = [
  { icon: Users,        title: 'Selezione di 10 studenti',       desc: 'I più meritevoli tra tutti i partecipanti FSL, scelti per affidabilità e attitudine al lavoro di squadra.' },
  { icon: Microscope,   title: 'Supporto contenutistico Delta Index', desc: 'Base scientifica e validazione del valore formativo di ogni edizione del progetto.' },
  { icon: Clapperboard, title: 'Produzione professionale', desc: 'Una casa di produzione cinematografica vera, con ritmi, standard e aspettative autentiche.' },
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

function BackstageStudentiGallery({ items }: { items: import('@/components/Gallery').GalleryItem[] }) {
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
            items={items}
            columns={3}
            showPlaceholders={items.length === 0}
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

          <p className="font-funnel font-bold italic text-2xl md:text-3xl lg:text-[2.1rem] text-white leading-[1.45] mb-10">
            Investire sui giovani non dovrebbe essere un gesto simbolico, ma una scelta strategica
            capace di generare valore nel tempo. Le esperienze sviluppate per Oriocenter attorno
            al linguaggio cinematografico mostrano come, quando l'incontro tra impresa e nuove
            generazioni è progettato con cura, possa dare vita a risultati inattesi — e talvolta
            straordinari.
          </p>

        </motion.blockquote>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Cortometraggio() {
  const backstageStudenti = useGallerySection('corto-backstage', cortoBackstageStudenti)
  const galleryLocandine = useGallerySection('corto-locandine', galleryCortoLocandine)
  const edizioniDynamic = edizioniData.map((ed) =>
    ed.anno === '2024' ? { ...ed, backstagePhotos: galleryLocandine } : ed
  )

  return (
    <>
      <Helmet>
        <title>Cortometraggio Professionale | SettimaArte</title>
        <link rel="canonical" href="https://www.settimaartefestival.it/cortometraggio" />
        <meta name="description" content="10 studenti selezionati affiancano una troupe professionale per produrre un cortometraggio estivo candidato ai principali festival nazionali italiani." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.settimaartefestival.it/cortometraggio" />
        <meta property="og:site_name" content="SettimaArte" />
        <meta property="og:locale" content="it_IT" />
        <meta property="og:title" content="Cortometraggio Professionale | SettimaArte" />
        <meta property="og:description" content="10 studenti selezionati affiancano una troupe professionale per produrre un cortometraggio estivo candidato ai principali festival nazionali italiani." />
        <meta property="og:image" content="https://www.settimaartefestival.it/images/Home/Hero/studentessa-take-fsl.JPG" />
        <meta property="og:image:alt" content="Studentessa durante le riprese del cortometraggio professionale Settima Arte" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cortometraggio Professionale | SettimaArte" />
        <meta name="twitter:description" content="10 studenti selezionati affiancano una troupe professionale per produrre un cortometraggio estivo candidato ai principali festival nazionali italiani." />
        <meta name="twitter:image" content="https://www.settimaartefestival.it/images/Home/Hero/studentessa-take-fsl.JPG" />
      </Helmet>

      <Header />

      <main>
        {/* 1. Hero */}
        <HeroSlider
          slides={[{ type: 'video', src: '', videoId: 'l9zSUCoaUw4', alt: 'BTS cortometraggio Oriocenter' }]}
          subtitle="Cortometraggio Professionale"
          title="Produzione cinematografica estiva professionale per gli studenti di Settima Arte"
        />

        {/* 2. Copy introduttivo */}
        <CopyIntro />

        {/* 3. L'iter */}
        <IterSection />

        {/* 4. Aspetti chiave */}
        <AspettiChiave />

        {/* 5. Gallery backstage studenti */}
        <BackstageStudentiGallery items={backstageStudenti} />

        {/* 6–7. Edizioni */}
        <div className="divide-y divide-azzurro-light">
          {edizioniDynamic.map((edizione) => (
            <EdizioneCortometraggio key={edizione.anno} edizione={edizione} />
          ))}
        </div>

        {/* 8. Citazione finale */}
        <CitazioneFinale />
      </main>

      <Footer />
    </>
  )
}
