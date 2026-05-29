import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Toaster } from 'sonner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSlider from '@/components/HeroSlider'
import ProjectCard from '@/components/ProjectCard'
import FAQAccordion from '@/components/FAQAccordion'
import ContactForm from '@/components/ContactForm'
import { faqData } from '@/data/faq'
import { heroHomeSlides, homeSezioniImages } from '@/data/images'

function IntroSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-funnel font-bold text-2xl md:text-3xl lg:text-4xl text-blu leading-snug"
        >
          Settima Arte è il progetto educational di Oriocenter, un'occasione educativa per
          sperimentare il mondo del lavoro utilizzando il linguaggio a loro più noto: il video.
        </motion.h2>
      </div>
    </section>
  )
}

function CanudoBridge() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Anno come ancora visiva */}
          <div className="flex items-center gap-3">
            <span className="h-px w-10 inline-block" style={{ backgroundColor: 'var(--color-fucsia)' }} />
            <span className="font-funnel font-bold text-sm tracking-[0.2em]" style={{ color: 'var(--color-fucsia)' }}>
              1911
            </span>
            <span className="h-px w-10 inline-block" style={{ backgroundColor: 'var(--color-fucsia)' }} />
          </div>

          <p className="text-base md:text-lg leading-relaxed font-funnel text-blu/65">
            Ricciotto Canudo riconobbe nel cinema una nuova forma d'arte capace di fondere
            le arti dello spazio con quelle del tempo. Oggi <strong className="text-blu font-semibold">SettimaArte</strong> porta
            questa visione dentro i corridoi di <strong className="text-blu font-semibold">Oriocenter</strong>,
            trasformando un centro commerciale in un set cinematografico vivo dove gli studenti
            diventano i protagonisti.
          </p>

          {/* Freccia verso il basso — invita a scoprire le sezioni */}
          <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5 mt-2 opacity-30" fill="none" stroke="var(--color-blu)" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}

function GeoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white overflow-x-clip">
      <div className="container mx-auto px-6 md:px-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Parentesi aperta */}
          <svg
            aria-hidden
            viewBox="0 0 40 120"
            className="absolute -left-8 md:-left-14 top-0 bottom-0 w-6 md:w-9 h-full"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M32 4 L8 4 L8 116 L32 116"
              stroke="var(--color-fucsia)"
              strokeWidth="6"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Parentesi chiusa */}
          <svg
            aria-hidden
            viewBox="0 0 40 120"
            className="absolute -right-8 md:-right-14 top-0 bottom-0 w-6 md:w-9 h-full"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M8 4 L32 4 L32 116 L8 116"
              stroke="var(--color-fucsia)"
              strokeWidth="6"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="px-4 md:px-6 py-6 md:py-8 flex flex-col gap-4">
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro">
              Chi può partecipare
            </p>
            <p className="text-blu text-xl md:text-2xl leading-relaxed font-funnel font-medium">
              La partecipazione a questo progetto educational di Oriocenter è aperto a tutte le scuole
              secondarie di II° grado della provincia di Bergamo e non solo! L'ultima edizione ha visto
              infatti partecipare istituti delle province di{' '}
              <strong className="font-bold">Brescia, Lecco, Como e Monza Brianza</strong>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const scrollTarget = searchParams.get('scroll')
    if (scrollTarget) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <>
      <Helmet>
        <title>SettimaArte | Il Progetto Educational di Oriocenter</title>
        <link rel="canonical" href="https://www.settimaartefestival.it/" />
        <meta
          name="description"
          content="SettimaArte è il progetto educational di Oriocenter che offre agli studenti un'esperienza di Formazione Scuola-Lavoro centrata sul linguaggio cinematografico."
        />
      </Helmet>

      <Toaster richColors position="top-center" />
      <Header />

      <main>
        {/* 1. Hero */}
        <HeroSlider
          slides={heroHomeSlides}
          tagline="Settima Arte è il progetto educational di Oriocenter per sperimentare il mondo del lavoro attraverso il linguaggio video."
        />

        {/* 2. Intro */}
        <IntroSection />

        {/* 2b. Canudo bridge */}
        <CanudoBridge />

        {/* 3. FSL */}
        <ProjectCard
          label="Progetto FSL"
          title="Formazione Scuola-Lavoro attraverso il cinema"
          description="In un mondo in cui i giovani sfruttano sempre più supporti audio-visivi per esprimere chi sono, Oriocenter ha pensato dunque di rendere il cinema protagonista del suo progetto di Formazione Scuola-Lavoro. In collaborazione con Skillherz nel 2018 è nato il progetto Settima Arte, in cui gli studenti coinvolti raccontano le storie che vivono, osservano e immaginano, trasformando vetrine, negozi e corridoi in veri e propri set cinematografici."
          image={homeSezioniImages.fsl.src}
          ctaLabel="Scopri di più"
          ctaHref="/fsl"
          imagePosition="left"
        />

        {/* 4. Festival */}
        <ProjectCard
          label="Settima Arte Festival"
          title="I corti degli studenti sul grande schermo"
          description="L'apprezzamento di studenti, genitori e scuole ha portato il progetto a svilupparsi in due edizioni annuali, una invernale e una primaverile, che si concludono con un evento finale — il Settima Arte Festival, nel quale i cortometraggi realizzati dalle scuole partecipanti vengono proiettati sul grande schermo della sala 14 di UCI Orio a Oriocenter. La partecipazione a questo evento è aperta a chiunque sia curioso di vedere i talenti del domani all'opera."
          image={homeSezioniImages.festival.src}
          ctaLabel="Scopri di più"
          ctaHref="/festival"
          imagePosition="right"
        />

        {/* 5. Cortometraggio */}
        <ProjectCard
          label="Cortometraggio Professionale"
          title="Un set vero, una troupe vera, un'esperienza unica"
          description="Nelle ultime due edizioni il progetto ha fatto un passo in più. Al termine delle settimane di FSL, una decina di ragazzi tra i più meritevoli viene selezionata per vivere un'esperienza speciale: affiancare una vera troupe cinematografica nella realizzazione di un cortometraggio professionale. È un'occasione unica per gli studenti di lavorare fianco a fianco con figure come runner, costumisti, registi, camera trainee e tecnici di set."
          image={homeSezioniImages.cortometraggio.src}
          ctaLabel="Scopri di più"
          ctaHref="/cortometraggio"
          imagePosition="left"
        />

        {/* 6. Nota geografica */}
        <GeoSection />

        {/* 7. FAQ */}
        <FAQAccordion items={faqData} />

        {/* 8. Contact */}
        <ContactForm />
      </main>

      <Footer />
    </>
  )
}
