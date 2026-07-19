import { useState, useRef, useCallback, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Trash2 } from 'lucide-react'

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

interface VotazioniData {
  enabled: boolean
  corti: CortoCorrente[]
}

type Phase = 'pin' | 'dashboard'

// ── PIN screen ─────────────────────────────────────────────────────────────────

interface PinScreenProps {
  onSuccess: (pin: string, data: VotazioniData) => void
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
      const data = (await res.json()) as VotazioniData
      onSuccess(pinValue, data)
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
    if (digit && index < 3) inputRefs.current[index + 1]?.focus()
    if (digit && index === 3) {
      const fullPin = next.join('')
      if (fullPin.length === 4) submit(fullPin)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]; next[index] = ''; setDigits(next)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        const next = [...digits]; next[index - 1] = ''; setDigits(next)
      }
    } else if (e.key === 'Enter') {
      submit(pin)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-azzurro-light)' }}>
      <div className="w-full max-w-sm bg-white shadow-xl p-8 space-y-8" style={{ borderRadius: 28 }}>
        <div className="flex justify-center">
          <img src="/logo/7arte-oriocenter_logo_2024.png" alt="SettimaArte" className="h-9 w-auto" />
        </div>
        <div className="text-center space-y-1">
          <h1 className="font-funnel font-bold text-2xl" style={{ color: 'var(--color-blu)' }}>Area riservata</h1>
          <p className="text-sm font-funnel" style={{ color: 'rgba(32,36,76,0.5)' }}>Inserisci il codice per accedere</p>
        </div>
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
                borderColor: error ? '#ef4444' : d ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.15)',
                color: 'var(--color-blu)',
                caretColor: 'var(--color-azzurro)',
              }}
            />
          ))}
        </div>
        {error && <p className="text-center text-sm font-funnel font-semibold text-red-500">Codice errato. Riprova.</p>}
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

// ── Toggle ─────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-azzurro shrink-0"
        style={{ backgroundColor: checked ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.15)' }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(24px)' : 'translateX(0)' }}
        />
      </button>
      <span className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>{label}</span>
    </label>
  )
}

// ── Corto card ─────────────────────────────────────────────────────────────────

interface CortoCardProps {
  corto: CortoCorrente
  onChange: (id: number, field: keyof CortoCorrente, value: string | boolean) => void
  onRemove: (id: number) => void
}

function CortoCard({ corto, onChange, onRemove }: CortoCardProps) {
  return (
    <div className="bg-white border p-6 space-y-4" style={{ borderRadius: 24, borderColor: 'rgba(32,36,76,0.1)' }}>
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
        .field-input:focus { border-color: var(--color-azzurro); }
        .field-input::placeholder { color: rgba(32,36,76,0.3); }
      `}</style>

      {/* Header: classe + attivo + rimuovi */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={corto.classe}
          onChange={(e) => onChange(corto.id, 'classe', e.target.value)}
          placeholder="Classe (es. 3A)"
          className="field-input font-bold"
          style={{ width: '120px', flexShrink: 0 }}
        />
        <div className="flex-1" />
        <Toggle checked={corto.attivo} onChange={(v) => onChange(corto.id, 'attivo', v)} label="Visibile" />
        <button
          onClick={() => onRemove(corto.id)}
          aria-label="Rimuovi corto"
          className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors focus:outline-none"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Field label="Nome progetto *" htmlFor={`nome-${corto.id}`}>
        <input
          id={`nome-${corto.id}`}
          type="text"
          value={corto.nome_progetto}
          onChange={(e) => onChange(corto.id, 'nome_progetto', e.target.value)}
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

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-funnel font-semibold" style={{ color: 'rgba(32,36,76,0.55)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

interface DashboardProps {
  initialData: VotazioniData
  pinRef: React.RefObject<string>
  onLogout: () => void
}

function Dashboard({ initialData, pinRef, onLogout }: DashboardProps) {
  const [enabled, setEnabled] = useState(initialData.enabled)
  const [corti, setCorti] = useState<CortoCorrente[]>(initialData.corti)
  const [edizione, setEdizione] = useState(initialData.corti[0]?.edizione ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(t)
  }, [saved])

  const updateCorto = (id: number, field: keyof CortoCorrente, value: string | boolean) => {
    setCorti((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value === '' ? null : value } : c))
    setSaved(false)
    setSaveError(null)
  }

  const addCorto = () => {
    const newId = corti.length > 0 ? Math.max(...corti.map((c) => c.id)) + 1 : 1
    setCorti((prev) => [...prev, {
      id: newId,
      edizione,
      classe: '',
      nome_progetto: '',
      trama: null,
      locandina_url: null,
      video_url: null,
      link_voto: null,
      attivo: true,
    }])
  }

  const removeCorto = (id: number) => {
    setCorti((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    const payload: VotazioniData = {
      enabled,
      corti: corti.map((c) => ({ ...c, edizione })),
    }
    try {
      const res = await fetch('/api/admin/corti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pinRef.current}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCorti(payload.corti)
      setSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }, [enabled, corti, edizione, pinRef])

  const saveLabel = saved ? 'Salvato ✓' : saving ? 'Salvataggio…' : 'Salva tutto'

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: 'var(--color-azzurro-light)' }}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b flex items-center justify-between px-5 py-3" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
        <img src="/logo/7arte-oriocenter_logo_2024.png" alt="SettimaArte" className="h-7 w-auto" />
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-2xl font-funnel font-bold text-sm text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-fucsia)' }}
          >
            {saveLabel}
          </button>
          <button
            onClick={onLogout}
            className="font-funnel font-semibold text-sm px-4 py-1.5 rounded-full border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(32,36,76,0.2)', color: 'var(--color-blu)' }}
          >
            Esci
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <h1 className="font-funnel font-bold text-2xl md:text-3xl" style={{ color: 'var(--color-blu)' }}>
          Gestione votazioni Festival
        </h1>

        {/* Switch globale */}
        <div
          className="bg-white rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ borderColor: enabled ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.1)', borderWidth: enabled ? 2 : 1 }}
        >
          <div className="flex-1">
            <p className="font-funnel font-bold text-base" style={{ color: 'var(--color-blu)' }}>Sezione votazioni sul sito</p>
            <p className="text-sm font-funnel mt-0.5" style={{ color: 'rgba(32,36,76,0.5)' }}>
              {enabled ? 'La sezione è visibile sul sito' : 'La sezione è nascosta sul sito'}
            </p>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} label={enabled ? 'Attiva' : 'Disattiva'} />
        </div>

        {/* Edizione */}
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
          <label className="block font-funnel font-semibold text-sm mb-2" style={{ color: 'var(--color-blu)' }} htmlFor="edizione-input">
            Edizione (si applica a tutti i corti al salvataggio)
          </label>
          <input
            id="edizione-input"
            type="text"
            value={edizione}
            onChange={(e) => setEdizione(e.target.value)}
            placeholder="es. giu_26"
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl border text-sm font-funnel outline-none transition-colors"
            style={{ borderColor: 'rgba(32,36,76,0.15)', color: 'var(--color-blu)' }}
          />
        </div>

        {/* Cards corti */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {corti.map((corto) => (
            <CortoCard key={corto.id} corto={corto} onChange={updateCorto} onRemove={removeCorto} />
          ))}
        </div>

        {/* Aggiungi corto */}
        <button
          onClick={addCorto}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-white"
          style={{ borderColor: 'rgba(32,36,76,0.2)', color: 'rgba(32,36,76,0.5)' }}
        >
          <Plus size={16} />
          Aggiungi corto
        </button>

        {saveError && (
          <p className="text-sm font-funnel font-semibold text-red-500 text-right">{saveError}</p>
        )}
      </main>

      {/* Bottom save bar */}
      <div className="sticky bottom-0 z-20 bg-white border-t px-5 py-4 flex items-center justify-end" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-2xl font-funnel font-bold text-base text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-fucsia)' }}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [phase, setPhase] = useState<Phase>('pin')
  const [data, setData] = useState<VotazioniData>({ enabled: false, corti: [] })
  const pinRef = useRef<string>('')

  const handleSuccess = useCallback((pin: string, votazioniData: VotazioniData) => {
    pinRef.current = pin
    setData(votazioniData)
    setPhase('dashboard')
  }, [])

  const handleLogout = useCallback(() => {
    pinRef.current = ''
    setData({ enabled: false, corti: [] })
    setPhase('pin')
  }, [])

  return (
    <>
      <Helmet>
        <title>Area Admin | SettimaArte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {phase === 'pin'
        ? <PinScreen onSuccess={handleSuccess} />
        : <Dashboard initialData={data} pinRef={pinRef as React.RefObject<string>} onLogout={handleLogout} />
      }
    </>
  )
}
