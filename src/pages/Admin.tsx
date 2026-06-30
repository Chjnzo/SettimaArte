import { useState, useRef, useCallback, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Helmet } from 'react-helmet-async'

// ── Types ──────────────────────────────────────────────────────────────────────

interface CortoCorrente {
  id: number
  edizione: string
  classe: string
  nome_progetto: string
  trama: string | null
  locandina_url: string | null
  video_url: string | null
  link_voto: string | null
  attivo: boolean
}

type Phase = 'pin' | 'dashboard'

// ── PIN screen ─────────────────────────────────────────────────────────────────

interface PinScreenProps {
  onSuccess: (pin: string, corti: CortoCorrente[]) => void
}

function PinScreen({ onSuccess }: PinScreenProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const pin = digits.join('')

  const submit = useCallback(async (pinValue: string) => {
    if (pinValue.length < 4) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/admin/corti', {
        headers: { Authorization: `Bearer ${pinValue}` },
      })
      if (res.status === 401) {
        setError(true)
        setDigits(['', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const corti = (await res.json()) as CortoCorrente[]
      onSuccess(pinValue, corti)
    } catch {
      setError(true)
      setDigits(['', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    setError(false)
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
    if (digit && index === 3) {
      const fullPin = next.join('')
      if (fullPin.length === 4) submit(fullPin)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
      }
    } else if (e.key === 'Enter') {
      submit(pin)
    }
  }

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-azzurro-light)' }}
    >
      <div
        className="w-full max-w-sm bg-white shadow-xl p-8 space-y-8"
        style={{ borderRadius: 28 }}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/logo/7arte-oriocenter_logo_2024.png"
            alt="SettimaArte"
            className="h-9 w-auto"
          />
        </div>

        {/* Heading */}
        <div className="text-center space-y-1">
          <h1
            className="font-funnel font-bold text-2xl"
            style={{ color: 'var(--color-blu)' }}
          >
            Area riservata
          </h1>
          <p
            className="text-sm font-funnel"
            style={{ color: 'rgba(32,36,76,0.5)' }}
          >
            Inserisci il codice per accedere
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              autoFocus={i === 0}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Cifra ${i + 1} del PIN`}
              disabled={loading}
              className="w-14 h-16 text-center text-2xl font-funnel font-bold border-2 rounded-2xl outline-none transition-colors disabled:opacity-50"
              style={{
                borderColor: error
                  ? '#ef4444'
                  : d
                    ? 'var(--color-azzurro)'
                    : 'rgba(32,36,76,0.15)',
                color: 'var(--color-blu)',
                caretColor: 'var(--color-azzurro)',
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-sm font-funnel font-semibold text-red-500">
            Codice errato. Riprova.
          </p>
        )}

        {/* Submit */}
        <button
          onClick={() => submit(pin)}
          disabled={pin.length < 4 || loading}
          className="w-full py-4 rounded-2xl font-funnel font-bold text-base text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: 'var(--color-blu)' }}
        >
          {loading ? 'Verifica…' : 'Accedi'}
        </button>
      </div>
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

interface DashboardProps {
  initialCorti: CortoCorrente[]
  pinRef: React.RefObject<string>
  onLogout: () => void
}

function Dashboard({ initialCorti, pinRef, onLogout }: DashboardProps) {
  const [corti, setCorti] = useState<CortoCorrente[]>(initialCorti)
  const [edizione, setEdizione] = useState<string>(initialCorti[0]?.edizione ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Reset saved indicator after 2.5s
  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(t)
  }, [saved])

  const updateCorto = (id: number, field: keyof CortoCorrente, value: string | boolean) => {
    setCorti((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [field]: value === '' ? null : value } : c
      )
    )
    setSaved(false)
    setSaveError(null)
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    const payload = corti.map((c) => ({ ...c, edizione }))
    try {
      const res = await fetch('/api/admin/corti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pinRef.current}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCorti(payload)
      setSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }, [corti, edizione, pinRef])

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: 'var(--color-azzurro-light)' }}>
      {/* Sticky top bar */}
      <header
        className="sticky top-0 z-30 bg-white border-b flex items-center justify-between px-5 py-3"
        style={{ borderColor: 'rgba(32,36,76,0.1)' }}
      >
        <img
          src="/logo/7arte-oriocenter_logo_2024.png"
          alt="SettimaArte"
          className="h-7 w-auto"
        />
        <button
          onClick={onLogout}
          className="font-funnel font-semibold text-sm px-4 py-1.5 rounded-full border transition-colors hover:bg-gray-50"
          style={{ borderColor: 'rgba(32,36,76,0.2)', color: 'var(--color-blu)' }}
        >
          Esci
        </button>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1
            className="font-funnel font-bold text-2xl md:text-3xl"
            style={{ color: 'var(--color-blu)' }}
          >
            Gestione votazioni Festival
          </h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-2xl font-funnel font-bold text-sm text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-fucsia)' }}
          >
            {saved ? 'Salvato ✓' : saving ? 'Salvataggio…' : 'Salva tutto'}
          </button>
        </div>

        {/* Edizione field */}
        <div
          className="bg-white rounded-2xl p-5 border"
          style={{ borderColor: 'rgba(32,36,76,0.1)' }}
        >
          <label
            className="block font-funnel font-semibold text-sm mb-2"
            style={{ color: 'var(--color-blu)' }}
            htmlFor="edizione-input"
          >
            Edizione (si applica a tutte le schede al salvataggio)
          </label>
          <input
            id="edizione-input"
            type="text"
            value={edizione}
            onChange={(e) => setEdizione(e.target.value)}
            placeholder="es. giu_26"
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl border text-sm font-funnel outline-none transition-colors"
            style={{
              borderColor: 'rgba(32,36,76,0.15)',
              color: 'var(--color-blu)',
            }}
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {corti.map((corto) => (
            <CortoCard key={corto.id} corto={corto} onChange={updateCorto} />
          ))}
        </div>

        {/* Save error */}
        {saveError && (
          <p className="text-sm font-funnel font-semibold text-red-500 text-right">
            {saveError}
          </p>
        )}
      </main>

      {/* Sticky bottom save bar */}
      <div
        className="sticky bottom-0 z-20 bg-white border-t px-5 py-4 flex items-center justify-end"
        style={{ borderColor: 'rgba(32,36,76,0.1)' }}
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-2xl font-funnel font-bold text-base text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-fucsia)' }}
        >
          {saved ? 'Salvato ✓' : saving ? 'Salvataggio…' : 'Salva tutto'}
        </button>
      </div>
    </div>
  )
}

// ── Corto card ─────────────────────────────────────────────────────────────────

interface CortoCardProps {
  corto: CortoCorrente
  onChange: (id: number, field: keyof CortoCorrente, value: string | boolean) => void
}

function CortoCard({ corto, onChange }: CortoCardProps) {
  return (
    <div
      className="bg-white border p-6 space-y-4"
      style={{ borderRadius: 24, borderColor: 'rgba(32,36,76,0.1)' }}
    >
      {/* Top row: badge + toggle */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-funnel font-bold tracking-widest uppercase px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: 'var(--color-azzurro)' }}
        >
          Classe {corto.classe}
        </span>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span
            className="text-sm font-funnel font-semibold"
            style={{ color: 'var(--color-blu)' }}
          >
            Attiva
          </span>
          <button
            role="switch"
            aria-checked={corto.attivo}
            onClick={() => onChange(corto.id, 'attivo', !corto.attivo)}
            className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: corto.attivo ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.15)',
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: corto.attivo ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
        </label>
      </div>

      {/* Fields */}
      <Field
        label="Nome progetto *"
        htmlFor={`nome-${corto.id}`}
        required
      >
        <input
          id={`nome-${corto.id}`}
          type="text"
          value={corto.nome_progetto}
          onChange={(e) => onChange(corto.id, 'nome_progetto', e.target.value)}
          required
          className="field-input"
        />
      </Field>

      <Field label="Trama" htmlFor={`trama-${corto.id}`}>
        <textarea
          id={`trama-${corto.id}`}
          rows={3}
          value={corto.trama ?? ''}
          onChange={(e) => onChange(corto.id, 'trama', e.target.value)}
          className="field-input resize-none"
        />
      </Field>

      <Field label="Locandina URL" htmlFor={`locandina-${corto.id}`}>
        <input
          id={`locandina-${corto.id}`}
          type="text"
          value={corto.locandina_url ?? ''}
          onChange={(e) => onChange(corto.id, 'locandina_url', e.target.value)}
          placeholder="https://…"
          className="field-input"
        />
      </Field>

      <Field label="Video URL (YouTube)" htmlFor={`video-${corto.id}`}>
        <input
          id={`video-${corto.id}`}
          type="text"
          value={corto.video_url ?? ''}
          onChange={(e) => onChange(corto.id, 'video_url', e.target.value)}
          placeholder="https://youtu.be/…"
          className="field-input"
        />
      </Field>

      <Field label="Link voto (Google Form)" htmlFor={`voto-${corto.id}`}>
        <input
          id={`voto-${corto.id}`}
          type="text"
          value={corto.link_voto ?? ''}
          onChange={(e) => onChange(corto.id, 'link_voto', e.target.value)}
          placeholder="https://forms.gle/…"
          className="field-input"
        />
      </Field>
    </div>
  )
}

// ── Field wrapper ──────────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-funnel font-semibold"
        style={{ color: 'rgba(32,36,76,0.55)' }}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <style>{`
        .field-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          border: 1.5px solid rgba(32,36,76,0.12);
          font-family: inherit;
          font-size: 0.875rem;
          color: var(--color-blu);
          outline: none;
          transition: border-color 0.15s;
          background: white;
        }
        .field-input:focus {
          border-color: var(--color-azzurro);
        }
        .field-input::placeholder {
          color: rgba(32,36,76,0.3);
        }
      `}</style>
      {children}
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [phase, setPhase] = useState<Phase>('pin')
  const [corti, setCorti] = useState<CortoCorrente[]>([])
  const pinRef = useRef<string>('')

  const handleSuccess = useCallback((pin: string, data: CortoCorrente[]) => {
    pinRef.current = pin
    setCorti(data)
    setPhase('dashboard')
  }, [])

  const handleLogout = useCallback(() => {
    pinRef.current = ''
    setCorti([])
    setPhase('pin')
  }, [])

  return (
    <>
      <Helmet>
        <title>Area Admin | SettimaArte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {phase === 'pin' ? (
        <PinScreen onSuccess={handleSuccess} />
      ) : (
        <Dashboard
          initialCorti={corti}
          pinRef={pinRef as React.RefObject<string>}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}
