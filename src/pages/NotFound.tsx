import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Pagina non trovata | SettimaArte</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-8xl font-bold font-funnel text-[var(--color-azzurro)]">404</h1>
        <p className="text-xl">Pagina non trovata</p>
        <Link to="/" className="text-[var(--color-azzurro)] underline">Torna alla Home</Link>
      </main>
    </>
  )
}
