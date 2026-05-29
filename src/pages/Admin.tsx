import { Helmet } from 'react-helmet-async'
import { ExternalLink, TableProperties } from 'lucide-react'

const GSHEET_URL = import.meta.env.VITE_GSHEET_URL as string | undefined

export default function Admin() {
  return (
    <>
      <Helmet>
        <title>Area Admin | SettimaArte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[100dvh] bg-neutral-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-squircle shadow-lg p-8 space-y-6">
          <img
            src="/logo/7arte-oriocenter_logo_2024.png"
            alt="SettimaArte"
            className="h-8 w-auto"
          />

          <div>
            <h1 className="font-funnel font-bold text-2xl text-blu mb-1">Area riservata</h1>
            <p className="text-blu/50 text-sm">
              Gestisci i dati delle votazioni Festival direttamente nel foglio Google.
            </p>
          </div>

          <div className="rounded-xl border border-azzurro-light bg-azzurro/5 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-azzurro/10 flex items-center justify-center shrink-0">
                <TableProperties size={20} className="text-azzurro" />
              </div>
              <div>
                <p className="font-funnel font-semibold text-blu text-sm">Foglio votazioni</p>
                <p className="text-blu/50 text-xs">
                  Modifica direttamente le righe nel Google Sheet. La sezione votazioni si aggiorna automaticamente.
                </p>
              </div>
            </div>

            {GSHEET_URL ? (
              <a
                href={GSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-azzurro hover:bg-azzurro/90 text-white font-funnel font-semibold px-6 py-3 rounded-squircle transition-colors text-sm"
              >
                Apri Google Sheet
                <ExternalLink size={14} />
              </a>
            ) : (
              <p className="text-xs text-red-400 font-funnel">
                Variabile VITE_GSHEET_URL non configurata in .env
              </p>
            )}
          </div>

          <div className="border-t border-azzurro-light pt-4">
            <p className="text-xs text-blu/35 font-funnel leading-relaxed">
              <strong className="text-blu/55">Struttura colonne sheet:</strong>{' '}
              id | edizione | classe | nome_progetto | trama | locandina_url | video_url | link_voto | attivo (TRUE/FALSE)
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
