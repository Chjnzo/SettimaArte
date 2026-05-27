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
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row gap-10 md:gap-20 items-start"
        >
          <h2 className="font-funnel font-bold text-3xl md:text-4xl lg:text-5xl text-blu leading-tight md:flex-1">
            Settima Arte è il progetto educational di Oriocenter, un'occasione educativa per
            sperimentare il mondo del lavoro utilizzando il linguaggio a loro più noto: il video.
          </h2>
          <div className="md:flex-1 flex flex-col gap-4">
            <p className="text-base text-blu/70 leading-relaxed">
              Nel <strong>1911</strong> Ricciotto Canudo introdusse il concetto di settima arte,
              riconoscendo nel cinema una nuova forma d'arte in grado di fondere le arti dello
              spazio con quelle del tempo.
            </p>
            <p className="text-base text-blu/70 leading-relaxed">
              Oggi SettimaArte porta questa visione dentro i corridoi di{' '}
              <strong>Oriocenter</strong>, trasformando un centro commerciale in un set
              cinematografico vivo, dove gli studenti diventano i protagonisti.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function GeoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{ backgroundColor: 'var(--color-azzurro-light)' }}
      className="w-full py-16 md:py-20"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro">
            Chi può partecipare
          </p>
          <p className="text-blu text-xl md:text-2xl leading-relaxed font-funnel font-medium">
            La partecipazione a questo progetto educational di Oriocenter è aperto a tutte le scuole
            secondarie di II° grado della provincia di Bergamo e non solo! L'ultima edizione ha visto
            infatti partecipare istituti delle province di{' '}
            <strong className="font-bold">Brescia, Lecco, Como e Monza Brianza</strong>.
          </p>
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
          title="Il progetto educational di Oriocenter"
          subtitle="SettimaArte"
          ctas={[
            { label: 'Scopri FSL', href: '/fsl' },
            { label: 'Scopri il Festival', href: '/festival' },
            { label: 'Scopri il Cortometraggio', href: '/cortometraggio' },
          ]}
        />

        {/* 2. Intro */}
        <IntroSection />

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
