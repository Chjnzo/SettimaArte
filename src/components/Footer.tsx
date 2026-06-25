import { Link } from 'react-router-dom'
import { Mail, Instagram, Youtube } from 'lucide-react'

const navLinks = [
  { label: 'FSL', to: '/fsl' },
  { label: 'Festival', to: '/festival' },
  { label: 'Cortometraggio', to: '/cortometraggio' },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/settima_arte_official/',
    icon: Instagram,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@oriocenter',
    icon: Youtube,
  },
]

export default function Footer() {
  return (
    <footer data-header-dark style={{ backgroundColor: 'var(--color-blu)' }} className="text-white">
      <div className="container mx-auto px-4 pt-16 pb-8 max-w-6xl">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-10 md:pb-12 border-b border-white/10">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <img
              src="/logo/7arte-oriocenter_logo_2024_negativo.png"
              alt="SettimaArte"
              loading="lazy"
              className="h-11 w-auto object-contain self-start"
            />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs font-funnel">
              Il progetto educational di Oriocenter fa sperimentare il mondo
              del lavoro attraverso il cinema
            </p>
          </div>

          {/* Col 2 — Navigazione */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-white/40">
              Navigazione
            </p>
            <nav className="flex flex-col gap-3">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-funnel text-white/70 hover:text-white transition-colors duration-200 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Contatti & Social */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-white/40">
              Contatti & Social
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@skillherz.com"
                className="flex items-center gap-2 text-sm font-funnel text-white/70 hover:text-white transition-colors duration-200 w-fit"
              >
                <Mail size={15} className="text-azzurro shrink-0" />
                info@skillherz.com
              </a>
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-funnel text-white/70 hover:text-white transition-colors duration-200 w-fit"
                >
                  <Icon size={15} className="text-azzurro shrink-0" />
                  {label}
                  <span className="sr-only"> (apre in nuova scheda)</span>
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40 font-funnel">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} SettimaArte. Tutti i diritti riservati.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a
              href="https://drive.google.com/file/d/1emqaFFBUK-GNDwBRA1Ti6QTY0AxrQ1iS/view"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
