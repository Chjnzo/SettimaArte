import { Link } from 'react-router-dom'
import { Mail, Youtube } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'FSL', to: '/fsl' },
  { label: 'Festival', to: '/festival' },
  { label: 'Cortometraggio', to: '/cortometraggio' },
  { label: 'Privacy Policy', to: '/privacy' },
]

const socialLinks = [
  {
    label: 'YouTube Oriocenter',
    href: 'https://www.youtube.com/@oriocenter',
    icon: Youtube,
  },
]

export default function Footer() {
  return (
    <footer data-header-dark style={{ backgroundColor: 'var(--color-blu)' }} className="text-white">
      <div className="container mx-auto px-4 pt-16 pb-8 max-w-6xl">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <img
              src="/logo/7arte-oriocenter_logo_2024_negativo.png"
              alt="SettimaArte"
              loading="lazy"
              className="h-10 w-auto object-contain self-start"
            />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Il progetto educational di Oriocenter che porta il linguaggio
              cinematografico nelle scuole superiori della provincia di Bergamo
              e delle province limitrofe.
            </p>
            <p className="text-xs text-white/40 font-funnel">
              In collaborazione con Skillherz
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
                  className="text-sm text-white/70 hover:text-white transition-colors duration-200 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Contatti */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-funnel font-semibold tracking-widest uppercase text-white/40">
              Contatti
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@skillherz.com"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 w-fit"
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
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200 w-fit"
                >
                  <Icon size={15} className="text-azzurro shrink-0" />
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <p className="text-xs text-white/40 font-funnel">Oriocenter</p>
              <p className="text-sm text-white/60">Via Portico, 75</p>
              <p className="text-sm text-white/60">24050 Orio al Serio (BG)</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} SettimaArte. Tutti i diritti riservati.</p>
          <p>Un progetto <span className="text-white/60">Oriocenter</span> realizzato da <span className="text-white/60">Skillherz</span></p>
        </div>
      </div>
    </footer>
  )
}
