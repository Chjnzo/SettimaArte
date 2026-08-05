import { useState, useRef, useCallback, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Trash2, Image, Video, ChevronDown, ChevronUp } from 'lucide-react'
import { galleryFestival, galleryFSLBackstage, galleryCortoBackstage, galleryCortoLocandine, locandinePerEdizione } from '@/data/images'
import { festivalGalleryBackstage } from '@/data/festival'
import type { GalleryItem } from '@/components/Gallery'
import type { EdizioneFSL, CortoEdizione } from '@/data/images'

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
type AdminTab = 'votazioni' | 'gallery' | 'fsl-edizioni'
type GallerySection = 'festival-evento' | 'festival-backstage' | 'fsl-backstage' | 'corto-backstage' | 'corto-locandine'

interface GalleryItemAdmin {
  type: 'image' | 'video'
  src: string
  alt: string
  videoId?: string
  platform?: 'youtube' | 'vimeo'
}

interface CortoFSL {
  titolo: string
  locandina: string
  videoYT: string
  premi: string[]
}

interface EdizioneFSLAdmin {
  label: string
  corti: CortoFSL[]
}

type FSLEdizioniAdmin = Record<string, EdizioneFSLAdmin[]>

const GALLERY_SECTIONS: { key: GallerySection; label: string }[] = [
  { key: 'festival-evento', label: 'Festival — Serate' },
  { key: 'festival-backstage', label: 'Festival — Backstage' },
  { key: 'fsl-backstage', label: 'FSL — Backstage' },
  { key: 'corto-backstage', label: 'Corto — Set studenti' },
  { key: 'corto-locandine', label: 'Corto — Locandine e premi' },
]

const GALLERY_DEFAULTS: Record<GallerySection, GalleryItem[]> = {
  'festival-evento': galleryFestival,
  'festival-backstage': festivalGalleryBackstage,
  'fsl-backstage': galleryFSLBackstage,
  'corto-backstage': galleryCortoBackstage,
  'corto-locandine': galleryCortoLocandine,
}

function toAdminItems(items: GalleryItem[]): GalleryItemAdmin[] {
  return items.map((it) => ({
    type: it.type === 'video' ? 'video' : 'image',
    src: it.src,
    alt: it.alt,
    videoId: it.videoId,
    platform: it.platform,
  }))
}

function toAdminFSL(data: Record<string, EdizioneFSL[]>): FSLEdizioniAdmin {
  const result: FSLEdizioniAdmin = {}
  for (const [anno, edizioni] of Object.entries(data)) {
    result[anno] = edizioni.map((ed) => ({
      label: ed.label,
      corti: ed.corti.map((c: CortoEdizione) => ({ ...c, premi: c.premi ?? [] })),
    }))
  }
  return result
}

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

// ── Field ──────────────────────────────────────────────────────────────────────

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

// ── Corto card (Votazioni) ─────────────────────────────────────────────────────

interface CortoCardProps {
  corto: CortoCorrente
  onChange: (id: number, field: keyof CortoCorrente, value: string | boolean) => void
  onRemove: (id: number) => void
}

function CortoCard({ corto, onChange, onRemove }: CortoCardProps) {
  return (
    <div className="bg-white border p-6 space-y-4" style={{ borderRadius: 24, borderColor: 'rgba(32,36,76,0.1)' }}>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={corto.classe}
          onChange={(e) => onChange(corto.id, 'classe', e.target.value)}
          placeholder="Classe (es. 3A)"
          className="fi font-bold"
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
        <input id={`nome-${corto.id}`} type="text" value={corto.nome_progetto} onChange={(e) => onChange(corto.id, 'nome_progetto', e.target.value)} className="fi" />
      </Field>
      <Field label="Trama" htmlFor={`trama-${corto.id}`}>
        <textarea id={`trama-${corto.id}`} rows={3} value={corto.trama ?? ''} onChange={(e) => onChange(corto.id, 'trama', e.target.value)} className="fi resize-none" />
      </Field>
      <Field label="Locandina URL" htmlFor={`locandina-${corto.id}`}>
        <input id={`locandina-${corto.id}`} type="text" value={corto.locandina_url ?? ''} onChange={(e) => onChange(corto.id, 'locandina_url', e.target.value)} placeholder="https://…" className="fi" />
      </Field>
      <Field label="Video URL (YouTube)" htmlFor={`video-${corto.id}`}>
        <input id={`video-${corto.id}`} type="text" value={corto.video_url ?? ''} onChange={(e) => onChange(corto.id, 'video_url', e.target.value)} placeholder="https://youtu.be/…" className="fi" />
      </Field>
      <Field label="Link voto (Google Form)" htmlFor={`voto-${corto.id}`}>
        <input id={`voto-${corto.id}`} type="text" value={corto.link_voto ?? ''} onChange={(e) => onChange(corto.id, 'link_voto', e.target.value)} placeholder="https://forms.gle/…" className="fi" />
      </Field>
    </div>
  )
}

// ── Votazioni tab ──────────────────────────────────────────────────────────────

interface VotazioniTabProps {
  enabled: boolean
  setEnabled: (v: boolean) => void
  corti: CortoCorrente[]
  setCorti: (c: CortoCorrente[]) => void
  edizione: string
  setEdizione: (v: string) => void
  saving: boolean
  saved: boolean
  saveError: string | null
  onSave: () => void
}

function VotazioniTab({ enabled, setEnabled, corti, setCorti, edizione, setEdizione, saving, saved, saveError, onSave }: VotazioniTabProps) {
  const updateCorto = (id: number, field: keyof CortoCorrente, value: string | boolean) => {
    setCorti(corti.map((c) => c.id === id ? { ...c, [field]: value === '' ? null : value } : c))
  }

  const addCorto = () => {
    const newId = corti.length > 0 ? Math.max(...corti.map((c) => c.id)) + 1 : 1
    setCorti([...corti, { id: newId, edizione, classe: '', nome_progetto: '', trama: null, locandina_url: null, video_url: null, link_voto: null, attivo: true }])
  }

  const removeCorto = (id: number) => setCorti(corti.filter((c) => c.id !== id))
  const saveLabel = saved ? 'Salvato ✓' : saving ? 'Salvataggio…' : 'Salva tutto'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-funnel font-bold text-xl" style={{ color: 'var(--color-blu)' }}>Gestione votazioni Festival</h2>
        <button onClick={onSave} disabled={saving} className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-2xl font-funnel font-bold text-sm text-white transition-opacity disabled:opacity-50" style={{ backgroundColor: 'var(--color-fucsia)' }}>
          {saveLabel}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderColor: enabled ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.1)', borderWidth: enabled ? 2 : 1 }}>
        <div className="flex-1">
          <p className="font-funnel font-bold text-base" style={{ color: 'var(--color-blu)' }}>Sezione votazioni sul sito</p>
          <p className="text-sm font-funnel mt-0.5" style={{ color: 'rgba(32,36,76,0.5)' }}>{enabled ? 'La sezione è visibile sul sito' : 'La sezione è nascosta sul sito'}</p>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} label={enabled ? 'Attiva' : 'Disattiva'} />
      </div>

      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
        <label className="block font-funnel font-semibold text-sm mb-2" style={{ color: 'var(--color-blu)' }} htmlFor="edizione-input">Edizione (si applica a tutti i corti al salvataggio)</label>
        <input id="edizione-input" type="text" value={edizione} onChange={(e) => setEdizione(e.target.value)} placeholder="es. giu_26" className="fi w-full sm:w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {corti.map((corto) => (
          <CortoCard key={corto.id} corto={corto} onChange={updateCorto} onRemove={removeCorto} />
        ))}
      </div>

      <button onClick={addCorto} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-white" style={{ borderColor: 'rgba(32,36,76,0.2)', color: 'rgba(32,36,76,0.5)' }}>
        <Plus size={16} />
        Aggiungi corto
      </button>

      {saveError && <p className="text-sm font-funnel font-semibold text-red-500 text-right">{saveError}</p>}

      <div className="sm:hidden">
        <button onClick={onSave} disabled={saving} className="w-full py-3 rounded-2xl font-funnel font-bold text-base text-white transition-opacity disabled:opacity-50" style={{ backgroundColor: 'var(--color-fucsia)' }}>
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

// ── Gallery item row ───────────────────────────────────────────────────────────

function GalleryItemRow({ item, index, onChange, onRemove }: {
  item: GalleryItemAdmin
  index: number
  onChange: (i: number, field: keyof GalleryItemAdmin, value: string) => void
  onRemove: (i: number) => void
}) {
  const isVideo = item.type === 'video'
  return (
    <div className="bg-white border rounded-2xl p-4 flex flex-col gap-3" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
      <div className="flex items-center gap-3">
        <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-funnel font-semibold" style={{ backgroundColor: isVideo ? 'rgba(229,5,118,0.1)' : 'rgba(5,151,222,0.1)', color: isVideo ? 'var(--color-fucsia)' : 'var(--color-azzurro)' }}>
          {isVideo ? <Video size={12} /> : <Image size={12} />}
          {isVideo ? 'Video' : 'Immagine'}
        </span>
        <div className="flex-1" />
        <button onClick={() => onRemove(index)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" aria-label="Rimuovi">
          <Trash2 size={14} />
        </button>
      </div>
      {isVideo ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="YouTube Video ID" htmlFor={`vid-id-${index}`}>
            <input id={`vid-id-${index}`} type="text" value={item.videoId ?? ''} onChange={(e) => onChange(index, 'videoId', e.target.value)} placeholder="es. dQw4w9WgXcQ" className="fi" />
          </Field>
          <Field label="Descrizione (alt)" htmlFor={`vid-alt-${index}`}>
            <input id={`vid-alt-${index}`} type="text" value={item.alt} onChange={(e) => onChange(index, 'alt', e.target.value)} placeholder="Descrizione del video" className="fi" />
          </Field>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="URL immagine" htmlFor={`img-src-${index}`}>
            <input id={`img-src-${index}`} type="text" value={item.src} onChange={(e) => onChange(index, 'src', e.target.value)} placeholder="https://…" className="fi" />
          </Field>
          <Field label="Descrizione (alt)" htmlFor={`img-alt-${index}`}>
            <input id={`img-alt-${index}`} type="text" value={item.alt} onChange={(e) => onChange(index, 'alt', e.target.value)} placeholder="Descrizione dell'immagine" className="fi" />
          </Field>
        </div>
      )}
    </div>
  )
}

// ── Gallery section editor ─────────────────────────────────────────────────────

function GallerySectionEditor({ section, pin }: { section: GallerySection; pin: string }) {
  const [items, setItems] = useState<GalleryItemAdmin[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setItems(null)
    setLoading(true)
    setError(null)
    setSaved(false)

    fetch(`/api/admin/gallery/${section}`, { headers: { Authorization: `Bearer ${pin}` } })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const loaded: GalleryItem[] | null = data
        setItems(loaded ? toAdminItems(loaded) : toAdminItems(GALLERY_DEFAULTS[section]))
      })
      .catch(() => { if (!cancelled) setError('Errore caricamento') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [section, pin])

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(t)
  }, [saved])

  const updateItem = (i: number, field: keyof GalleryItemAdmin, value: string) => {
    setItems((prev) => prev ? prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it) : prev)
    setSaved(false)
  }

  const removeItem = (i: number) => setItems((prev) => prev ? prev.filter((_, idx) => idx !== i) : prev)

  const addImage = () => setItems((prev) => [...(prev ?? []), { type: 'image', src: '', alt: '' }])
  const addVideo = () => setItems((prev) => [...(prev ?? []), { type: 'video', src: '/images/placeholder-video.jpg', alt: '', videoId: '', platform: 'youtube' }])

  const handleSave = async () => {
    if (!items) return
    setSaving(true)
    setError(null)
    try {
      const payload = items.map((it) => it.type === 'video'
        ? { type: 'video', src: it.src, alt: it.alt, videoId: it.videoId, platform: it.platform ?? 'youtube' }
        : { src: it.src, alt: it.alt }
      )
      const res = await fetch(`/api/admin/gallery/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pin}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSaved(true)
    } catch {
      setError('Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.4)' }}>Caricamento…</p>
      </div>
    )
  }

  const saveLabel = saved ? 'Salvato ✓' : saving ? 'Salvataggio…' : 'Salva sezione'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.5)' }}>{items?.length ?? 0} elementi</p>
        <button onClick={handleSave} disabled={saving || !items} className="px-5 py-2 rounded-xl font-funnel font-bold text-sm text-white transition-opacity disabled:opacity-50" style={{ backgroundColor: 'var(--color-fucsia)' }}>
          {saveLabel}
        </button>
      </div>

      {error && <p className="text-sm font-funnel text-red-500">{error}</p>}

      <div className="space-y-3">
        {(items ?? []).map((item, i) => (
          <GalleryItemRow key={i} item={item} index={i} onChange={updateItem} onRemove={removeItem} />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={addImage} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-white" style={{ borderColor: 'rgba(32,36,76,0.2)', color: 'rgba(32,36,76,0.5)' }}>
          <Image size={14} /> Aggiungi immagine
        </button>
        <button onClick={addVideo} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-white" style={{ borderColor: 'rgba(229,5,118,0.3)', color: 'var(--color-fucsia)' }}>
          <Video size={14} /> Aggiungi video
        </button>
      </div>
    </div>
  )
}

// ── Gallery tab ────────────────────────────────────────────────────────────────

function GalleryTab({ pin }: { pin: string }) {
  const [activeSection, setActiveSection] = useState<GallerySection>('festival-evento')

  return (
    <div className="space-y-6">
      <h2 className="font-funnel font-bold text-xl" style={{ color: 'var(--color-blu)' }}>Gestione Gallery</h2>

      <div className="flex flex-wrap gap-2">
        {GALLERY_SECTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className="px-4 py-2 rounded-squircle font-funnel font-semibold text-sm transition-colors"
            style={{
              backgroundColor: activeSection === key ? 'var(--color-azzurro)' : 'white',
              color: activeSection === key ? 'white' : 'var(--color-blu)',
              border: `1.5px solid ${activeSection === key ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.15)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
        <GallerySectionEditor key={activeSection} section={activeSection} pin={pin} />
      </div>
    </div>
  )
}

// ── FSL Edizioni tab ───────────────────────────────────────────────────────────

function CortoFSLCard({ corto, index, onChange, onRemove }: {
  corto: CortoFSL
  index: number
  onChange: (i: number, field: keyof CortoFSL, value: string | string[]) => void
  onRemove: (i: number) => void
}) {
  const premiText = corto.premi.join('\n')

  return (
    <div className="bg-white border rounded-2xl p-4 space-y-3" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
      <div className="flex items-center justify-between">
        <span className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>Corto {index + 1}</span>
        <button onClick={() => onRemove(index)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" aria-label="Rimuovi corto">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Titolo *" htmlFor={`cfsltitolo-${index}`}>
          <input id={`cfsltitolo-${index}`} type="text" value={corto.titolo} onChange={(e) => onChange(index, 'titolo', e.target.value)} className="fi" />
        </Field>
        <Field label="Video YouTube (URL)" htmlFor={`cfslvideo-${index}`}>
          <input id={`cfslvideo-${index}`} type="text" value={corto.videoYT} onChange={(e) => onChange(index, 'videoYT', e.target.value)} placeholder="https://youtu.be/…" className="fi" />
        </Field>
      </div>
      <Field label="Locandina URL" htmlFor={`cfslloc-${index}`}>
        <input id={`cfslloc-${index}`} type="text" value={corto.locandina} onChange={(e) => onChange(index, 'locandina', e.target.value)} placeholder="https://…" className="fi" />
      </Field>
      <Field label="Premi (uno per riga)" htmlFor={`cfslpremi-${index}`}>
        <textarea
          id={`cfslpremi-${index}`}
          rows={2}
          value={premiText}
          onChange={(e) => onChange(index, 'premi', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          placeholder={"miglior cortometraggio\npremiazione giuria"}
          className="fi resize-none"
        />
      </Field>
    </div>
  )
}

function EdizioneFSLBlock({ edizione, annoIndex, edizioneIndex, onChangeLabel, onChangeCoro, onRemoveCoro, onAddCoro, onRemoveEdizione }: {
  edizione: EdizioneFSLAdmin
  annoIndex: string
  edizioneIndex: number
  onChangeLabel: (v: string) => void
  onChangeCoro: (ci: number, field: keyof CortoFSL, value: string | string[]) => void
  onRemoveCoro: (ci: number) => void
  onAddCoro: () => void
  onRemoveEdizione: () => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border rounded-2xl overflow-hidden" style={{ borderColor: 'rgba(32,36,76,0.12)' }}>
      <div className="flex items-center gap-3 px-4 py-3 bg-white">
        <button onClick={() => setOpen((v) => !v)} className="p-1 rounded-lg hover:bg-gray-50 transition-colors" aria-label={open ? 'Comprimi' : 'Espandi'}>
          {open ? <ChevronUp size={16} style={{ color: 'var(--color-blu)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-blu)' }} />}
        </button>
        <input
          type="text"
          value={edizione.label}
          onChange={(e) => onChangeLabel(e.target.value)}
          className="fi flex-1 font-semibold"
          placeholder="es. Edizione invernale"
          aria-label={`Label edizione ${annoIndex}-${edizioneIndex}`}
        />
        <span className="text-xs font-funnel" style={{ color: 'rgba(32,36,76,0.4)' }}>{edizione.corti.length} corti</span>
        <button onClick={onRemoveEdizione} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" aria-label="Elimina edizione">
          <Trash2 size={14} />
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-2 space-y-3 bg-white border-t" style={{ borderColor: 'rgba(32,36,76,0.06)' }}>
          {edizione.corti.map((corto, ci) => (
            <CortoFSLCard key={ci} corto={corto} index={ci} onChange={onChangeCoro} onRemove={onRemoveCoro} />
          ))}
          <button onClick={onAddCoro} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-gray-50" style={{ borderColor: 'rgba(32,36,76,0.18)', color: 'rgba(32,36,76,0.45)' }}>
            <Plus size={14} /> Aggiungi corto
          </button>
        </div>
      )}
    </div>
  )
}

function FSLEdizioniTab({ pin }: { pin: string }) {
  const [data, setData] = useState<FSLEdizioniAdmin | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeAnno, setActiveAnno] = useState<string | null>(null)
  const [newAnnoInput, setNewAnnoInput] = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('/api/admin/fsl-edizioni', { headers: { Authorization: `Bearer ${pin}` } })
      .then((r) => r.json())
      .then((raw) => {
        const loaded: Record<string, EdizioneFSL[]> | null = raw
        const normalized = toAdminFSL(loaded ?? locandinePerEdizione)
        setData(normalized)
        const anni = Object.keys(normalized)
        if (anni.length > 0) setActiveAnno(anni[anni.length - 1])
      })
      .catch(() => setError('Errore caricamento'))
      .finally(() => setLoading(false))
  }, [pin])

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(t)
  }, [saved])

  const updateEdizione = (anno: string, eiIdx: number, updater: (ed: EdizioneFSLAdmin) => EdizioneFSLAdmin) => {
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [anno]: prev[anno].map((ed, i) => i === eiIdx ? updater(ed) : ed),
      }
    })
    setSaved(false)
  }

  const addEdizione = (anno: string) => {
    setData((prev) => {
      if (!prev) return prev
      return { ...prev, [anno]: [...prev[anno], { label: 'Nuova edizione', corti: [] }] }
    })
  }

  const removeEdizione = (anno: string, eiIdx: number) => {
    setData((prev) => {
      if (!prev) return prev
      return { ...prev, [anno]: prev[anno].filter((_, i) => i !== eiIdx) }
    })
  }

  const addAnno = () => {
    const anno = newAnnoInput.trim()
    if (!anno || !data || data[anno]) return
    setData((prev) => ({ ...(prev ?? {}), [anno]: [] }))
    setActiveAnno(anno)
    setNewAnnoInput('')
  }

  const removeAnno = (anno: string) => {
    setData((prev) => {
      if (!prev) return prev
      const next = { ...prev }
      delete next[anno]
      return next
    })
    setActiveAnno((prev) => {
      if (prev !== anno) return prev
      const remaining = Object.keys(data ?? {}).filter((a) => a !== anno)
      return remaining.length > 0 ? remaining[remaining.length - 1] : null
    })
  }

  const handleSave = async () => {
    if (!data) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/fsl-edizioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pin}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSaved(true)
    } catch {
      setError('Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.4)' }}>Caricamento…</p>
      </div>
    )
  }

  const anni = data ? Object.keys(data) : []
  const saveLabel = saved ? 'Salvato ✓' : saving ? 'Salvataggio…' : 'Salva tutto'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-funnel font-bold text-xl" style={{ color: 'var(--color-blu)' }}>Edizioni FSL</h2>
        <button onClick={handleSave} disabled={saving || !data} className="px-5 py-2 rounded-xl font-funnel font-bold text-sm text-white transition-opacity disabled:opacity-50" style={{ backgroundColor: 'var(--color-fucsia)' }}>
          {saveLabel}
        </button>
      </div>

      {error && <p className="text-sm font-funnel text-red-500">{error}</p>}

      {/* Anno tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        {anni.map((anno) => (
          <button
            key={anno}
            onClick={() => setActiveAnno(anno)}
            className="px-4 py-2 rounded-squircle font-funnel font-semibold text-sm transition-colors"
            style={{
              backgroundColor: activeAnno === anno ? 'var(--color-blu)' : 'white',
              color: activeAnno === anno ? 'white' : 'var(--color-blu)',
              border: `1.5px solid ${activeAnno === anno ? 'var(--color-blu)' : 'rgba(32,36,76,0.15)'}`,
            }}
          >
            {anno}
          </button>
        ))}

        {/* Nuovo anno input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newAnnoInput}
            onChange={(e) => setNewAnnoInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addAnno() }}
            placeholder="es. 2026-2027"
            className="fi w-32 text-sm"
            aria-label="Nuovo anno scolastico"
          />
          <button onClick={addAnno} disabled={!newAnnoInput.trim()} className="flex items-center gap-1 px-3 py-2 rounded-xl font-funnel font-semibold text-sm transition-opacity disabled:opacity-40" style={{ backgroundColor: 'var(--color-azzurro)', color: 'white' }}>
            <Plus size={14} /> Aggiungi
          </button>
        </div>
      </div>

      {/* Anno content */}
      {activeAnno && data && data[activeAnno] && (
        <div className="bg-white rounded-2xl p-6 border space-y-4" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-funnel font-bold text-lg" style={{ color: 'var(--color-blu)' }}>{activeAnno}</h3>
            <button onClick={() => removeAnno(activeAnno)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 font-funnel font-semibold text-xs transition-colors">
              <Trash2 size={13} /> Elimina anno
            </button>
          </div>

          {data[activeAnno].map((edizione, eiIdx) => (
            <EdizioneFSLBlock
              key={eiIdx}
              edizione={edizione}
              annoIndex={activeAnno}
              edizioneIndex={eiIdx}
              onChangeLabel={(v) => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, label: v }))}
              onChangeCoro={(ci, field, value) => updateEdizione(activeAnno, eiIdx, (ed) => ({
                ...ed,
                corti: ed.corti.map((c, i) => i === ci ? { ...c, [field]: value } : c),
              }))}
              onRemoveCoro={(ci) => updateEdizione(activeAnno, eiIdx, (ed) => ({
                ...ed,
                corti: ed.corti.filter((_, i) => i !== ci),
              }))}
              onAddCoro={() => updateEdizione(activeAnno, eiIdx, (ed) => ({
                ...ed,
                corti: [...ed.corti, { titolo: '', locandina: '', videoYT: '', premi: [] }],
              }))}
              onRemoveEdizione={() => removeEdizione(activeAnno, eiIdx)}
            />
          ))}

          <button onClick={() => addEdizione(activeAnno)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-gray-50" style={{ borderColor: 'rgba(32,36,76,0.18)', color: 'rgba(32,36,76,0.45)' }}>
            <Plus size={14} /> Aggiungi edizione
          </button>
        </div>
      )}
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
  const [activeTab, setActiveTab] = useState<AdminTab>('votazioni')
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

  const handleSaveVotazioni = useCallback(async () => {
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    const payload: VotazioniData = { enabled, corti: corti.map((c) => ({ ...c, edizione })) }
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

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'votazioni', label: 'Votazioni Festival' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'fsl-edizioni', label: 'Edizioni FSL' },
  ]

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: 'var(--color-azzurro-light)' }}>
      <style>{`
        .fi {
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
        .fi:focus { border-color: var(--color-azzurro); }
        .fi::placeholder { color: rgba(32,36,76,0.3); }
      `}</style>

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b flex items-center justify-between px-5 py-3" style={{ borderColor: 'rgba(32,36,76,0.1)' }}>
        <img src="/logo/7arte-oriocenter_logo_2024.png" alt="SettimaArte" className="h-7 w-auto" />
        <button onClick={onLogout} className="font-funnel font-semibold text-sm px-4 py-1.5 rounded-full border transition-colors hover:bg-gray-50" style={{ borderColor: 'rgba(32,36,76,0.2)', color: 'var(--color-blu)' }}>
          Esci
        </button>
      </header>

      {/* Tab navigation */}
      <div className="bg-white border-b sticky top-[56px] z-20" style={{ borderColor: 'rgba(32,36,76,0.08)' }}>
        <div className="max-w-5xl mx-auto px-4 flex gap-0">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-5 py-3.5 font-funnel font-semibold text-sm border-b-2 transition-colors"
              style={{
                borderColor: activeTab === key ? 'var(--color-azzurro)' : 'transparent',
                color: activeTab === key ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.5)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'votazioni' && (
          <VotazioniTab
            enabled={enabled}
            setEnabled={setEnabled}
            corti={corti}
            setCorti={setCorti}
            edizione={edizione}
            setEdizione={setEdizione}
            saving={saving}
            saved={saved}
            saveError={saveError}
            onSave={handleSaveVotazioni}
          />
        )}
        {activeTab === 'gallery' && <GalleryTab pin={pinRef.current ?? ''} />}
        {activeTab === 'fsl-edizioni' && <FSLEdizioniTab pin={pinRef.current ?? ''} />}
      </main>
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
