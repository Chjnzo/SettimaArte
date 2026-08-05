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
    <section ref={ref} className="w-full py-14 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-16 max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-funnel font-bold text-3xl md:text-4xl lg:text-5xl text-blu leading-snug mb-10"
        >
          Settima Arte è il progetto educational Oriocenter per sperimentare il lavoro attraverso il linguaggio video
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg leading-relaxed font-funnel text-blu/60 max-w-2xl"
        >
          Nel 1911 Ricciotto Canudo introdusse il concetto di settima arte,
          riconoscendo nel cinema una nuova forma d'arte in grado di fondere le arti dello spazio
          con quelle del tempo.
        </motion.p>
      </div>
    </section>
  )
}

function CanudoBridge() {
  return null
}

function GeoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-12 md:px-16 max-w-4xl">
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
              secondarie di II° grado della provincia di Bergamo e non solo!
            </p>
            <p className="text-blu text-xl md:text-2xl leading-relaxed font-funnel font-medium">
              L'ultima edizione ha visto infatti partecipare istituti delle province di Brescia, Lecco, Como e Monza Brianza.
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
        <meta name="description" content="SettimaArte è il progetto educational di Oriocenter che offre agli studenti un'esperienza di Formazione Scuola-Lavoro centrata sul linguaggio cinematografico." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.settimaartefestival.it/" />
        <meta property="og:site_name" content="SettimaArte" />
        <meta property="og:locale" content="it_IT" />
        <meta property="og:title" content="SettimaArte | Il Progetto Educational di Oriocenter" />
        <meta property="og:description" content="SettimaArte è il progetto educational di Oriocenter che offre agli studenti un'esperienza di Formazione Scuola-Lavoro centrata sul linguaggio cinematografico." />
        <meta property="og:image" content="https://www.settimaartefestival.it/images/Home/Hero/esultanza-ragazzi-premio-oscar.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content="Ragazzi premiati al Settima Arte Festival" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SettimaArte | Il Progetto Educational di Oriocenter" />
        <meta name="twitter:description" content="SettimaArte è il progetto educational di Oriocenter che offre agli studenti un'esperienza di Formazione Scuola-Lavoro centrata sul linguaggio cinematografico." />
        <meta name="twitter:image" content="https://www.settimaartefestival.it/images/Home/Hero/esultanza-ragazzi-premio-oscar.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "SettimaArte",
          "description": "Progetto educational di Oriocenter dedicato alla Formazione Scuola-Lavoro attraverso il linguaggio cinematografico.",
          "url": "https://www.settimaartefestival.it",
          "logo": "https://www.settimaartefestival.it/logo/7arte-oriocenter_logo_2024.png",
          "sameAs": ["https://www.youtube.com/@OriocenterSelectedStores"],
          "parentOrganization": {
            "@type": "Organization",
            "name": "Oriocenter",
            "address": { "@type": "PostalAddress", "addressLocality": "Orio al Serio", "addressRegion": "BG", "addressCountry": "IT" }
          }
        })}</script>
      </Helmet>

      <Toaster richColors position="top-center" />
      <Header />

      <main>
        {/* 1. Hero */}
        <HeroSlider
          slides={heroHomeSlides}
          tagline="Settima Arte è il progetto educational Oriocenter per sperimentare il lavoro attraverso il linguaggio video."
        />

        {/* 2. Intro */}
        <IntroSection />

        {/* 2b. Canudo bridge */}
        <CanudoBridge />

        {/* 3. FSL */}
        <ProjectCard
          label="Progetto FSL"
          title="Formazione Scuola-Lavoro attraverso il cinema"
          description={<>
            <p>In un mondo in cui i giovani sfruttano sempre più supporti audio-visivi per esprimere chi sono, Oriocenter ha pensato dunque di rendere il <strong>cinema protagonista del suo progetto di Formazione Scuola-Lavoro</strong>.</p>
            <p>In collaborazione con Skillherz nel 2018 è nato il progetto <strong>Settima Arte</strong>, in cui gli studenti coinvolti raccontano le storie che vivono, osservano e immaginano, trasformando vetrine, negozi e corridoi in veri e propri set cinematografici.</p>
          </>}
          image={homeSezioniImages.fsl.src}
          ctaLabel="Scopri di più"
          ctaHref="/fsl"
          imagePosition="left"
        />

        {/* 4. Festival */}
        <ProjectCard
          label="Settima Arte Festival"
          title="I corti degli studenti sul grande schermo"
          description={<>
            <p>L'apprezzamento di studenti, genitori e scuole ha portato il progetto a svilupparsi in <strong>due edizioni annuali,</strong> una invernale e una primaverile, che si concludono con un <strong>evento finale</strong> - il Settima Arte Festival, nel quale i <strong>cortometraggi</strong> realizzati dalle scuole partecipanti vengono <strong>proiettati</strong> sul grande schermo della sala 14 di <strong>UCI Orio a Oriocenter</strong>.</p>
            <p>La partecipazione a questo evento è aperta a chiunque sia curioso di vedere i talenti del domani all'opera.</p>
          </>}
          image={homeSezioniImages.festival.src}
          ctaLabel="Scopri di più"
          ctaHref="/festival"
          imagePosition="right"
        />

        {/* 5. Cortometraggio */}
        <ProjectCard
          label="Cortometraggio Professionale"
          title="Un set vero, una troupe vera, un'esperienza unica"
          description={<>
            <p>Nelle ultime due edizioni il progetto ha fatto un passo in più. Al termine delle settimane di FSL, infatti, una decina di ragazzi tra i più meritevoli viene selezionata per vivere un'esperienza speciale: <strong>affiancare una vera troupe cinematografica nella realizzazione di un cortometraggio professionale</strong>. È un'occasione unica per gli studenti di lavorare fianco a fianco con figure come runner, costumisti, registi, camera trainee e tecnici di set.</p>
          </>}
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
