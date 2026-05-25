import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'

function HeroContatto() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="w-full py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-4"
        >
          Contattaci
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="font-funnel font-bold text-5xl md:text-6xl lg:text-7xl text-blu leading-tight mb-8"
        >
          Parliamo
          <br />
          <span style={{ color: 'var(--color-azzurro)' }}>insieme.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="text-blu/70 text-lg leading-relaxed max-w-2xl mb-10"
        >
          Vuoi parlare con noi o hai ancora dubbi? Scrivi a{' '}
          <a
            href="mailto:info@skillherz.com"
            className="text-azzurro font-semibold hover:underline underline-offset-4"
          >
            info@skillherz.com
          </a>{' '}
          oppure compila il form sottostante per essere ricontattato.
        </motion.p>

        {/* Info di contatto rapido */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="mailto:info@skillherz.com"
            className="inline-flex items-center gap-3 bg-azzurro-light/60 hover:bg-azzurro-light rounded-squircle px-5 py-3 text-blu font-funnel font-semibold text-sm transition-colors"
          >
            <Mail size={16} className="text-azzurro shrink-0" />
            info@skillherz.com
          </a>
          <a
            href="https://www.oriocenter.it"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-azzurro-light/60 hover:bg-azzurro-light rounded-squircle px-5 py-3 text-blu font-funnel font-semibold text-sm transition-colors"
          >
            <Phone size={16} className="text-azzurro shrink-0" />
            Oriocenter — Bergamo
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default function Contattaci() {
  return (
    <>
      <Helmet>
        <title>Contattaci | SettimaArte</title>
        <link rel="canonical" href="https://www.settimaartefestival.it/contattaci" />
        <meta
          name="description"
          content="Contatta il team di SettimaArte — il progetto educational di Oriocenter. Scrivi a info@skillherz.com o compila il form."
        />
      </Helmet>

      <Header />

      <main>
        <HeroContatto />
        <ContactForm />
      </main>

      <Footer />
    </>
  )
}
