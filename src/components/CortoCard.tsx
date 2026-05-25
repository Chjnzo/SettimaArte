import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Trophy, Film, Users, Clapperboard } from 'lucide-react'
import VideoEmbed from './VideoEmbed'
import Gallery from './Gallery'
import type { EdizioneCorto } from '@/data/cortometraggio'

interface CortoCardProps {
  edizione: EdizioneCorto
  index: number
}

export default function CortoCard({ edizione }: CortoCardProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <article ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Header edizione ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-2">
            Edizione {edizione.anno}
          </p>
          <h2 className="font-funnel font-bold text-4xl md:text-5xl text-blu leading-tight">
            {edizione.titolo}
          </h2>
        </motion.div>

        {/* ── Descrizione edizione ── */}
        {edizione.descrizione && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-blu/75 leading-relaxed text-lg mb-10 max-w-3xl"
          >
            {edizione.descrizione}
          </motion.p>
        )}

        {/* ── Layout: locandina + info ── */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start mb-12">

          {/* Locandina */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full md:w-72 shrink-0"
          >
            {edizione.locandina ? (
              <img
                src={edizione.locandina}
                alt={`Locandina ${edizione.titolo}`}
                loading="lazy"
                className="w-full rounded-squircle shadow-xl object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-squircle bg-azzurro-light flex items-center justify-center">
                <Film size={48} className="text-blu/20" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 space-y-6"
          >
            {/* Scheda tecnica */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-blu/70">
                <Clapperboard size={15} className="text-azzurro shrink-0" />
                <span>Regia: <strong className="text-blu">{edizione.regia}</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-blu/70">
                <Users size={15} className="text-azzurro shrink-0 mt-0.5" />
                <span>Con: <strong className="text-blu">{edizione.attori.join(', ')}</strong></span>
              </div>
            </div>

            {/* Trama */}
            <div>
              <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-2">
                Trama
              </p>
              <p className="text-blu/75 leading-relaxed text-lg">{edizione.trama}</p>
            </div>

            {/* Premi */}
            {edizione.premi && edizione.premi.length > 0 && (
              <div>
                <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-3">
                  Riconoscimenti
                </p>
                <ul className="space-y-2">
                  {edizione.premi.map((premio, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                      className="flex items-start gap-3 text-sm text-blu/80"
                    >
                      <Trophy size={14} className="text-fucsia shrink-0 mt-0.5" />
                      <span>{premio}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Trailer ── */}
        {edizione.trailerSrc && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-12"
          >
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-4">
              Trailer
            </p>
            <VideoEmbed src={edizione.trailerSrc} title={`Trailer — ${edizione.titolo}`} />
          </motion.div>
        )}

        {/* ── Gallery backstage ── */}
        {edizione.backstagePhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-4">
              Dal set
            </p>
            <Gallery items={edizione.backstagePhotos} columns={3} showPlaceholders={false} />
          </motion.div>
        )}

        {/* Placeholder gallery quando non ci sono foto */}
        {edizione.backstagePhotos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro mb-4">
              Dal set
            </p>
            <Gallery items={[]} columns={3} showPlaceholders placeholderCount={6} />
          </motion.div>
        )}

      </div>
    </article>
  )
}
