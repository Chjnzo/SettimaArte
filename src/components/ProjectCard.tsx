import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

interface ProjectCardProps {
  label: string
  title: string
  description: string
  image?: string
  imagePlaceholderClass?: string
  ctaLabel: string
  ctaHref: string
  imagePosition?: 'left' | 'right'
}

export default function ProjectCard({
  label,
  title,
  description,
  image,
  imagePlaceholderClass = 'bg-azzurro-light',
  ctaLabel,
  ctaHref,
  imagePosition = 'left',
}: ProjectCardProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const textOrder = imagePosition === 'right' ? 'md:order-first' : 'md:order-last'
  const imgOrder = imagePosition === 'right' ? 'md:order-last' : 'md:order-first'

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
        >
          {/* Image */}
          <div className={`w-full md:flex-1 ${imgOrder}`}>
            {image ? (
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover rounded-squircle shadow-lg"
              />
            ) : (
              <div
                className={`w-full aspect-[4/3] rounded-squircle shadow-lg ${imagePlaceholderClass}`}
              />
            )}
          </div>

          {/* Text */}
          <div className={`w-full md:flex-1 flex flex-col gap-4 ${textOrder}`}>
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-azzurro">
              {label}
            </p>
            <h2 className="font-funnel font-bold text-3xl md:text-4xl text-blu leading-tight">
              {title}
            </h2>
            <p className="text-blu/80 leading-relaxed text-lg">{description}</p>
            <div>
              <Link
                to={ctaHref}
                className="inline-block border-2 border-azzurro text-azzurro font-funnel font-semibold px-6 py-3 rounded-squircle hover:bg-azzurro hover:text-white transition-colors duration-200"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
