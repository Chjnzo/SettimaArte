import { useState } from 'react'
import { Play } from 'lucide-react'

interface VideoEmbedProps {
  src: string
  title?: string
  /** URL thumbnail custom; se omesso usa quella YouTube automatica */
  thumbnail?: string
}

function getYouTubeId(url: string): string | null {
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url
  const m = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  )
  return m ? m[1] : null
}

function toEmbedUrl(src: string): string {
  const id = getYouTubeId(src)
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
  return src
}

function getThumbnail(src: string, custom?: string): string | null {
  if (custom) return custom
  const id = getYouTubeId(src)
  if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  return null
}

export default function VideoEmbed({ src, title = 'Video', thumbnail }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)
  const thumb = getThumbnail(src, thumbnail)
  const embedSrc = toEmbedUrl(src)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-squircle bg-black">
      {!playing && thumb ? (
        <button
          onClick={() => setPlaying(true)}
          aria-label={`Riproduci: ${title}`}
          className="group absolute inset-0 w-full h-full"
        >
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 group-hover:bg-white rounded-full p-4 transition-all duration-200 group-hover:scale-110 shadow-lg">
              <Play size={28} className="text-blu fill-blu ml-1" />
            </div>
          </div>
        </button>
      ) : (
        <iframe
          src={playing ? embedSrc : src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  )
}
