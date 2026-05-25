import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home',           to: '/',                num: null },
  { label: 'FSL',            to: '/fsl',             num: '01' },
  { label: 'Festival',       to: '/festival',        num: '02' },
  { label: 'Cortometraggio', to: '/cortometraggio',  num: '03' },
]

export default function Header() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Trasparente finché non si scrolla (over hero)
  const atTop = !scrolled

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          atTop
            ? 'bg-transparent border-b border-transparent'
            : 'bg-white/96 backdrop-blur-md border-b border-black/6 shadow-sm'
        }`}
        style={atTop ? { mixBlendMode: 'difference' } : undefined}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">

          {/* Logo — brightness-0 invert + mix-blend-mode gestisce adattamento colore */}
          <NavLink to="/" aria-label="SettimaArte — Home" className="shrink-0">
            <img
              src="/logo/7arte-oriocenter_logo_2024.png"
              alt="SettimaArte"
              className={`h-9 w-auto object-contain transition-all duration-500 ${atTop ? 'brightness-0 invert' : ''}`}
            />
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-azzurro rounded-sm"
              >
                {({ isActive }) => (
                  <span className="relative flex flex-col items-center px-4 py-2">
                    <span
                      className={`text-sm font-funnel font-semibold whitespace-nowrap transition-colors duration-300 ${
                        atTop
                          ? 'text-white'
                          : isActive ? 'text-blu' : 'text-blu/55 hover:text-blu'
                      }`}
                    >
                      {label}
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-5 rounded-full bg-white"
                        style={atTop ? undefined : { backgroundColor: 'var(--color-fucsia)' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            to="/contattaci"
            className={`hidden md:inline-flex items-center text-sm font-funnel font-semibold px-5 py-2 rounded-full border transition-all duration-300 shrink-0 ${
              atTop
                ? 'border-white text-white'
                : 'border-azzurro text-azzurro hover:bg-azzurro hover:text-white'
            }`}
          >
            Contattaci
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              atTop ? 'text-white' : 'text-blu hover:bg-azzurro-light/60'
            }`}
            onClick={() => setMobileOpen(true)}
            aria-label="Apri menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile — fullscreen overlay su sfondo blu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col md:hidden"
            style={{ backgroundColor: 'var(--color-blu)' }}
          >
            {/* Barra top */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0">
              <img
                src="/logo/7arte-oriocenter_logo_2024_negativo.png"
                alt="SettimaArte"
                className="h-8 w-auto"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Chiudi menu"
                className="p-2 text-white/60 hover:text-white transition-colors rounded-lg"
              >
                <X size={22} />
              </button>
            </div>

            {/* Link principali */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-0">
              {navLinks.map(({ label, to, num }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.22, ease: 'easeOut' }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                  >
                    {({ isActive }) => (
                      <span
                        className={`group flex items-baseline gap-4 py-5 border-b transition-colors ${
                          isActive ? 'border-fucsia/40' : 'border-white/8 hover:border-white/20'
                        }`}
                      >
                        {/* Numero */}
                        <span className="text-xs font-funnel font-bold text-fucsia tabular-nums w-5 shrink-0 leading-none mt-1">
                          {num ?? ''}
                        </span>

                        {/* Label */}
                        <span
                          className={`font-funnel font-bold leading-none transition-colors duration-200 ${
                            isActive ? 'text-white text-4xl' : 'text-white/40 group-hover:text-white/70 text-4xl'
                          }`}
                        >
                          {label}
                        </span>

                        {/* Freccia attivo */}
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-auto text-fucsia text-2xl font-funnel font-light"
                          >
                            →
                          </motion.span>
                        )}
                      </span>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Footer mobile */}
            <div className="px-8 pb-10 pt-5 border-t border-white/10 shrink-0">
              <Link
                to="/contattaci"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center font-funnel font-semibold text-sm text-blu bg-white hover:bg-white/90 rounded-squircle py-3.5 px-6 transition-colors"
              >
                Contattaci
              </Link>
              <p className="text-center text-white/25 text-xs font-funnel mt-4">
                settimaartefestival.it
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" aria-hidden="true" />
    </>
  )
}
