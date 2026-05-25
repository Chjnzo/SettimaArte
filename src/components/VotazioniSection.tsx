import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useVotazioni } from '@/hooks/useVotazioni'
import type { CortoCorrente } from '@/hooks/useVotazioni'
import VideoEmbed from './VideoEmbed'

function SkeletonCard() {
  return (
    <div className="rounded-squircle bg-white/10 overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="h-6 bg-white/10 rounded w-2/3" />
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-5/6" />
        <div className="h-10 bg-white/20 rounded-full w-1/2 mt-4" />
      </div>
    </div>
  )
}

function CortoVotazioneCard({ corto, index }: { corto: CortoCorrente; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-squircle bg-white/5 border border-white/10 overflow-hidden flex flex-col hover:bg-white/10 transition-colors duration-300"
    >
      {/* Locandina */}
      {corto.locandina_url ? (
        <div className="aspect-[2/3] overflow-hidden bg-white/5">
          <img
            src={corto.locandina_url}
            alt={`Locandina ${corto.nome_progetto}`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[2/3] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
          <span className="text-white/20 font-funnel font-bold text-5xl">
            {corto.classe}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Label + Titolo */}
        <div>
          <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-fucsia mb-1">
            Classe {corto.classe}
          </p>
          <h3 className="font-funnel font-bold text-xl text-white leading-snug">
            {corto.nome_progetto}
          </h3>
        </div>

        {/* Trama */}
        {corto.trama && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-4">{corto.trama}</p>
        )}

        {/* Video embed */}
        {corto.video_url && (
          <div className="rounded-lg overflow-hidden">
            <VideoEmbed src={corto.video_url} title={corto.nome_progetto} />
          </div>
        )}

        {/* CTA voto */}
        {corto.link_voto && (
          <div className="mt-auto pt-2">
            <a
              href={corto.link_voto}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-fucsia hover:bg-fucsia/90 text-white font-funnel font-semibold px-6 py-3 rounded-squircle transition-colors duration-200 text-sm"
            >
              Vota qui!
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default function VotazioniSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const now = new Date()
  const month = now.getMonth() // 5=giu, 11=dic
  const isVisible = month === 5 || month === 11

  const { data: corti, isLoading } = useVotazioni()

  if (!isVisible) return null

  return (
    <section
      ref={ref}
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: 'var(--color-blu)' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header sezione */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-fucsia mb-3">
            È il momento di votare
          </p>
          <h2 className="font-funnel font-bold text-4xl md:text-5xl text-white leading-tight">
            Vota il tuo cortometraggio preferito
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Guarda i corti, leggi le trame e vota la classe che ti ha colpito di più.
            Le votazioni sono aperte a tutti.
          </p>
        </motion.div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !corti?.length ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-white/50 text-center py-12"
          >
            Le votazioni apriranno a breve. Torna presto!
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {corti.map((corto, i) => (
              <CortoVotazioneCard key={corto.id} corto={corto} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
