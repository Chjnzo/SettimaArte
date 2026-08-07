import { useState, useRef, useCallback, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Trash2, ImageIcon, Video, ChevronDown, ChevronUp, Check, AlertCircle, LogOut, LayoutGrid, Film, BarChart2, ExternalLink } from 'lucide-react'
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
type AdminTab = 'votazioni' | 'gallery' | 'fsl-edizioni' | 'analytics'
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

const GALLERY_SECTIONS: { key: GallerySection; label: string; desc: string }[] = [
  { key: 'festival-evento', label: 'Festival — Serate', desc: 'Foto delle serate del festival' },
  { key: 'festival-backstage', label: 'Festival — Backstage', desc: 'Video backstage del festival' },
  { key: 'fsl-backstage', label: 'FSL — Backstage', desc: 'Foto e video backstage FSL' },
  { key: 'corto-backstage', label: 'Corto — Set studenti', desc: 'Foto degli studenti sul set' },
  { key: 'corto-locandine', label: 'Corto — Locandine', desc: 'Locandine e foto dei premi' },
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

function PinScreen({ onSuccess }: { onSuccess: (pin: string, data: VotazioniData) => void }) {
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const pin = digits.join('')

  const submit = useCallback(async (pinValue: string) => {
    if (pinValue.length < 4) return
    setLoading(true); setError(false)
    try {
      const res = await fetch('/api/admin/corti', { headers: { Authorization: `Bearer ${pinValue}` } })
      if (res.status === 401) { setError(true); setDigits(['', '', '', '']); inputRefs.current[0]?.focus(); return }
      if (!res.ok) throw new Error()
      onSuccess(pinValue, await res.json() as VotazioniData)
    } catch { setError(true); setDigits(['', '', '', '']); inputRefs.current[0]?.focus()
    } finally { setLoading(false) }
  }, [onSuccess])

  const handleChange = (i: number, value: string) => {
    const d = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]; next[i] = d; setDigits(next); setError(false)
    if (d && i < 3) inputRefs.current[i + 1]?.focus()
    if (d && i === 3 && next.join('').length === 4) submit(next.join(''))
  }

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[i]) { const n = [...digits]; n[i] = ''; setDigits(n) }
      else if (i > 0) { inputRefs.current[i - 1]?.focus(); const n = [...digits]; n[i - 1] = ''; setDigits(n) }
    } else if (e.key === 'Enter') submit(pin)
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 gap-6" style={{ background: 'linear-gradient(135deg, var(--color-blu) 0%, #2d3270 100%)' }}>
      <img src="/logo/7arte-oriocenter_logo_2024_negativo.png" alt="SettimaArte" className="h-10 w-auto opacity-90" />

      <div className="w-full max-w-[340px] bg-white p-8 space-y-7" style={{ borderRadius: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
        <div className="text-center space-y-1">
          <h1 className="font-funnel font-bold text-2xl" style={{ color: 'var(--color-blu)' }}>Area riservata</h1>
          <p className="text-sm font-funnel" style={{ color: 'rgba(32,36,76,0.45)' }}>Inserisci il codice a 4 cifre</p>
        </div>

        <div className="flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              type="text" inputMode="numeric" maxLength={1} value={d} autoFocus={i === 0}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Cifra ${i + 1} del PIN`}
              disabled={loading}
              className="w-14 h-16 text-center text-2xl font-funnel font-bold border-2 rounded-2xl outline-none transition-all disabled:opacity-50"
              style={{
                borderColor: error ? '#ef4444' : d ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.15)',
                color: 'var(--color-blu)',
                backgroundColor: d ? 'rgba(5,151,222,0.04)' : 'white',
              }}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 justify-center">
            <AlertCircle size={14} className="text-red-500 shrink-0" />
            <p className="text-sm font-funnel font-semibold text-red-500">Codice errato. Riprova.</p>
          </div>
        )}

        <button
          onClick={() => submit(pin)}
          disabled={pin.length < 4 || loading}
          className="w-full py-4 rounded-2xl font-funnel font-bold text-base text-white transition-all disabled:opacity-40 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--color-azzurro)' }}
        >
          {loading ? 'Verifica…' : 'Accedi'}
        </button>
      </div>
    </div>
  )
}

// ── Primitives ─────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shrink-0"
      style={{ backgroundColor: checked ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.15)' }}
    >
      <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200" style={{ transform: checked ? 'translateX(20px)' : 'none' }} />
    </button>
  )
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label htmlFor={htmlFor} className="block text-xs font-funnel font-semibold uppercase tracking-wide" style={{ color: 'rgba(32,36,76,0.45)' }}>{label}</label>
        {hint && <span className="text-[10px] font-funnel" style={{ color: 'rgba(32,36,76,0.3)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function SaveBtn({ onClick, saving, saved, disabled, label = 'Salva' }: { onClick: () => void; saving: boolean; saved: boolean; disabled?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick} disabled={saving || disabled}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-funnel font-bold text-sm text-white transition-all disabled:opacity-50 active:scale-[0.97]"
      style={{ backgroundColor: saved ? '#16a34a' : 'var(--color-fucsia)' }}
    >
      {saved ? <><Check size={14} /> Salvato</> : saving ? 'Salvataggio…' : label}
    </button>
  )
}

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <div className="w-6 h-6 rounded-full border-2 border-azzurro border-t-transparent animate-spin" style={{ borderColor: 'var(--color-azzurro)', borderTopColor: 'transparent' }} />
      <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.4)' }}>Caricamento…</p>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
      <AlertCircle size={15} className="text-red-500 shrink-0" />
      <p className="font-funnel text-sm text-red-600">{message}</p>
    </div>
  )
}

// ── Votazioni ──────────────────────────────────────────────────────────────────

function CortoCard({ corto, onChange, onRemove }: {
  corto: CortoCorrente
  onChange: (id: number, field: keyof CortoCorrente, value: string | boolean) => void
  onRemove: (id: number) => void
}) {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: 'rgba(32,36,76,0.07)' }}>
        <input type="text" value={corto.classe} onChange={(e) => onChange(corto.id, 'classe', e.target.value)}
          placeholder="Classe" className="fi font-bold text-base shrink-0" style={{ width: '7rem' }} />
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-funnel" style={{ color: 'rgba(32,36,76,0.4)' }}>{corto.attivo ? 'Visibile' : 'Nascosta'}</span>
          <Toggle checked={corto.attivo} onChange={(v) => onChange(corto.id, 'attivo', v)} />
        </div>
        <button onClick={() => onRemove(corto.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      <Field label="Nome progetto" htmlFor={`nome-${corto.id}`} hint="*">
        <input id={`nome-${corto.id}`} type="text" value={corto.nome_progetto} onChange={(e) => onChange(corto.id, 'nome_progetto', e.target.value)} className="fi" />
      </Field>
      <Field label="Trama" htmlFor={`trama-${corto.id}`}>
        <textarea id={`trama-${corto.id}`} rows={3} value={corto.trama ?? ''} onChange={(e) => onChange(corto.id, 'trama', e.target.value)} className="fi resize-none" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Locandina URL" htmlFor={`loc-${corto.id}`}>
          <input id={`loc-${corto.id}`} type="text" value={corto.locandina_url ?? ''} onChange={(e) => onChange(corto.id, 'locandina_url', e.target.value)} placeholder="https://…" className="fi" />
        </Field>
        <Field label="Video YouTube" htmlFor={`vid-${corto.id}`}>
          <input id={`vid-${corto.id}`} type="text" value={corto.video_url ?? ''} onChange={(e) => onChange(corto.id, 'video_url', e.target.value)} placeholder="https://youtu.be/…" className="fi" />
        </Field>
      </div>
      <Field label="Link voto" htmlFor={`voto-${corto.id}`} hint="Google Form">
        <input id={`voto-${corto.id}`} type="text" value={corto.link_voto ?? ''} onChange={(e) => onChange(corto.id, 'link_voto', e.target.value)} placeholder="https://forms.gle/…" className="fi" />
      </Field>
    </div>
  )
}

function VotazioniTab({ enabled, setEnabled, corti, setCorti, edizione, setEdizione, saving, saved, saveError, onSave }: {
  enabled: boolean; setEnabled: (v: boolean) => void
  corti: CortoCorrente[]; setCorti: (c: CortoCorrente[]) => void
  edizione: string; setEdizione: (v: string) => void
  saving: boolean; saved: boolean; saveError: string | null; onSave: () => void
}) {
  const updateCorto = (id: number, field: keyof CortoCorrente, value: string | boolean) =>
    setCorti(corti.map((c) => c.id === id ? { ...c, [field]: value === '' ? null : value } : c))
  const addCorto = () => {
    const id = corti.length > 0 ? Math.max(...corti.map((c) => c.id)) + 1 : 1
    setCorti([...corti, { id, edizione, classe: '', nome_progetto: '', trama: null, locandina_url: null, video_url: null, link_voto: null, attivo: true }])
  }

  return (
    <div className="space-y-5">
      {/* On/off card */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-funnel font-bold text-base" style={{ color: 'var(--color-blu)' }}>Sezione votazioni</p>
            <p className="text-sm font-funnel mt-0.5" style={{ color: 'rgba(32,36,76,0.45)' }}>
              {enabled ? 'Visibile sul sito pubblico' : 'Nascosta dal sito pubblico'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-funnel font-semibold" style={{ color: enabled ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.35)' }}>
              {enabled ? 'Attiva' : 'Disattiva'}
            </span>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>
        </div>
      </div>

      {/* Edizione */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <Field label="Edizione corrente" htmlFor="edizione-input" hint="es. giu_26 — si applica a tutti i corti al salvataggio">
          <input id="edizione-input" type="text" value={edizione} onChange={(e) => setEdizione(e.target.value)} placeholder="giu_26" className="fi w-48" />
        </Field>
      </div>

      {/* Corti */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {corti.map((c) => <CortoCard key={c.id} corto={c} onChange={updateCorto} onRemove={(id) => setCorti(corti.filter((x) => x.id !== id))} />)}
      </div>

      <button onClick={addCorto} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-white/70" style={{ borderColor: 'rgba(32,36,76,0.18)', color: 'rgba(32,36,76,0.45)' }}>
        <Plus size={15} /> Aggiungi corto
      </button>

      {saveError && <ErrorBanner message={saveError} />}

      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} label="Salva votazioni" />
      </div>
    </div>
  )
}

// ── Gallery ────────────────────────────────────────────────────────────────────

function GalleryItemRow({ item, index, onChange, onRemove }: {
  item: GalleryItemAdmin; index: number
  onChange: (i: number, field: keyof GalleryItemAdmin, value: string) => void
  onRemove: (i: number) => void
}) {
  const isVideo = item.type === 'video'
  return (
    <div className="group flex items-center gap-3 px-4 py-3 bg-white rounded-xl transition-shadow hover:shadow-sm" style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.06), 0 0 0 1px rgba(32,36,76,0.06)' }}>
      {/* Type badge */}
      <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg" style={{ backgroundColor: isVideo ? 'rgba(229,5,118,0.08)' : 'rgba(5,151,222,0.08)' }}>
        {isVideo
          ? <Video size={13} style={{ color: 'var(--color-fucsia)' }} />
          : <ImageIcon size={13} style={{ color: 'var(--color-azzurro)' }} />}
      </span>

      {/* Fields */}
      {isVideo ? (
        <>
          <input type="text" value={item.videoId ?? ''} onChange={(e) => onChange(index, 'videoId', e.target.value)}
            placeholder="YouTube ID" className="fi w-36 shrink-0 text-xs" style={{ fontFamily: 'monospace' }} />
          <input type="text" value={item.alt} onChange={(e) => onChange(index, 'alt', e.target.value)}
            placeholder="Descrizione" className="fi flex-1 text-xs" />
        </>
      ) : (
        <>
          <input type="text" value={item.src} onChange={(e) => onChange(index, 'src', e.target.value)}
            placeholder="URL immagine" className="fi flex-1 text-xs" />
          <input type="text" value={item.alt} onChange={(e) => onChange(index, 'alt', e.target.value)}
            placeholder="Alt text" className="fi w-40 shrink-0 text-xs" />
        </>
      )}

      <button onClick={() => onRemove(index)} className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-300 hover:text-red-500 transition-all">
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function GallerySectionEditor({ section, pin }: { section: GallerySection; pin: string }) {
  const [items, setItems] = useState<GalleryItemAdmin[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setItems(null); setLoading(true); setError(null); setSaved(false)
    fetch(`/api/admin/gallery/${section}`, { headers: { Authorization: `Bearer ${pin}` } })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setItems(toAdminItems((data as GalleryItem[] | null) ?? GALLERY_DEFAULTS[section])) })
      .catch(() => { if (!cancelled) setError('Impossibile caricare i dati') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [section, pin])

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(t)
  }, [saved])

  const handleSave = async () => {
    if (!items) return
    setSaving(true); setError(null)
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
      if (!res.ok) throw new Error()
      setSaved(true)
    } catch { setError('Errore durante il salvataggio')
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  const images = items?.filter((it) => it.type === 'image').length ?? 0
  const videos = items?.filter((it) => it.type === 'video').length ?? 0

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {images > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-funnel font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(5,151,222,0.08)', color: 'var(--color-azzurro)' }}>
              <ImageIcon size={11} /> {images} foto
            </span>
          )}
          {videos > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-funnel font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(229,5,118,0.08)', color: 'var(--color-fucsia)' }}>
              <Video size={11} /> {videos} video
            </span>
          )}
        </div>
        <SaveBtn onClick={handleSave} saving={saving} saved={saved} disabled={!items} label="Salva sezione" />
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Items list */}
      <div className="space-y-1.5">
        {(items ?? []).map((item, i) => (
          <GalleryItemRow key={i} item={item} index={i}
            onChange={(idx, field, val) => { setItems((p) => p ? p.map((it, j) => j === idx ? { ...it, [field]: val } : it) : p); setSaved(false) }}
            onRemove={(idx) => { setItems((p) => p ? p.filter((_, j) => j !== idx) : p); setSaved(false) }}
          />
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 pt-1">
        <button onClick={() => setItems((p) => [...(p ?? []), { type: 'image', src: '', alt: '' }])}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-dashed font-funnel font-semibold text-xs transition-colors hover:bg-white"
          style={{ borderColor: 'rgba(5,151,222,0.3)', color: 'var(--color-azzurro)' }}>
          <ImageIcon size={12} /> Aggiungi foto
        </button>
        <button onClick={() => setItems((p) => [...(p ?? []), { type: 'video', src: '/images/placeholder-video.jpg', alt: '', videoId: '', platform: 'youtube' }])}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-dashed font-funnel font-semibold text-xs transition-colors hover:bg-white"
          style={{ borderColor: 'rgba(229,5,118,0.3)', color: 'var(--color-fucsia)' }}>
          <Video size={12} /> Aggiungi video
        </button>
      </div>
    </div>
  )
}

function GalleryTab({ pin }: { pin: string }) {
  const [activeSection, setActiveSection] = useState<GallerySection>('festival-evento')
  const active = GALLERY_SECTIONS.find((s) => s.key === activeSection)!

  return (
    <div className="space-y-5">
      {/* Section selector */}
      <div className="bg-white rounded-2xl p-1.5 flex flex-wrap gap-1" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        {GALLERY_SECTIONS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveSection(key)}
            className="flex-1 min-w-fit px-4 py-2.5 rounded-xl font-funnel font-semibold text-sm transition-all text-center"
            style={{
              backgroundColor: activeSection === key ? 'var(--color-azzurro)' : 'transparent',
              color: activeSection === key ? 'white' : 'rgba(32,36,76,0.55)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Section editor */}
      <div className="bg-white rounded-2xl p-5 space-y-1" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <p className="font-funnel text-xs mb-4" style={{ color: 'rgba(32,36,76,0.4)' }}>{active.desc}</p>
        <GallerySectionEditor key={activeSection} section={activeSection} pin={pin} />
      </div>
    </div>
  )
}

// ── FSL Edizioni ───────────────────────────────────────────────────────────────

function CortoFSLCard({ corto, index, onChange, onRemove }: {
  corto: CortoFSL; index: number
  onChange: (i: number, field: keyof CortoFSL, value: string | string[]) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="bg-white rounded-xl p-4 space-y-3" style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.06), 0 0 0 1px rgba(32,36,76,0.07)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-funnel font-bold uppercase tracking-wide" style={{ color: 'rgba(32,36,76,0.35)' }}>Corto {index + 1}</span>
        <button onClick={() => onRemove(index)} className="p-1 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Field label="Titolo" htmlFor={`ct-${index}`} hint="*">
          <input id={`ct-${index}`} type="text" value={corto.titolo} onChange={(e) => onChange(index, 'titolo', e.target.value)} className="fi text-sm" />
        </Field>
        <Field label="YouTube URL" htmlFor={`cv-${index}`}>
          <input id={`cv-${index}`} type="text" value={corto.videoYT} onChange={(e) => onChange(index, 'videoYT', e.target.value)} placeholder="https://youtu.be/…" className="fi text-sm" />
        </Field>
      </div>
      <Field label="Locandina URL" htmlFor={`cl-${index}`}>
        <input id={`cl-${index}`} type="text" value={corto.locandina} onChange={(e) => onChange(index, 'locandina', e.target.value)} placeholder="https://…" className="fi text-sm" />
      </Field>
      <Field label="Premi" htmlFor={`cp-${index}`} hint="uno per riga">
        <textarea id={`cp-${index}`} rows={2} value={corto.premi.join('\n')}
          onChange={(e) => onChange(index, 'premi', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          placeholder={"miglior cortometraggio\npremiazione giuria"}
          className="fi resize-none text-sm" />
      </Field>
    </div>
  )
}

function EdizioneFSLBlock({ edizione, annoIndex, eiIdx, onChangeLabel, onChangeCoro, onRemoveCoro, onAddCoro, onRemove }: {
  edizione: EdizioneFSLAdmin; annoIndex: string; eiIdx: number
  onChangeLabel: (v: string) => void
  onChangeCoro: (ci: number, field: keyof CortoFSL, value: string | string[]) => void
  onRemoveCoro: (ci: number) => void
  onAddCoro: () => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.08)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white">
        <button onClick={() => setOpen((v) => !v)} className="p-1 rounded-lg hover:bg-gray-50 transition-colors shrink-0">
          {open ? <ChevronUp size={15} style={{ color: 'var(--color-blu)' }} /> : <ChevronDown size={15} style={{ color: 'var(--color-blu)' }} />}
        </button>
        <input type="text" value={edizione.label} onChange={(e) => onChangeLabel(e.target.value)}
          className="fi flex-1 font-semibold" placeholder="Nome edizione" aria-label={`Edizione ${annoIndex}-${eiIdx}`} />
        <span className="shrink-0 text-xs font-funnel px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(32,36,76,0.06)', color: 'rgba(32,36,76,0.45)' }}>
          {edizione.corti.length} corti
        </span>
        <button onClick={onRemove} className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-3 space-y-2.5 border-t" style={{ borderColor: 'rgba(32,36,76,0.06)', backgroundColor: '#fafbfc' }}>
          {edizione.corti.map((corto, ci) => (
            <CortoFSLCard key={ci} corto={corto} index={ci} onChange={onChangeCoro} onRemove={onRemoveCoro} />
          ))}
          <button onClick={onAddCoro} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed font-funnel font-semibold text-xs transition-colors hover:bg-white"
            style={{ borderColor: 'rgba(32,36,76,0.15)', color: 'rgba(32,36,76,0.4)' }}>
            <Plus size={13} /> Aggiungi corto
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
  const [newAnno, setNewAnno] = useState('')

  useEffect(() => {
    setLoading(true); setError(null)
    fetch('/api/admin/fsl-edizioni', { headers: { Authorization: `Bearer ${pin}` } })
      .then((r) => r.json())
      .then((raw) => {
        const norm = toAdminFSL((raw as Record<string, EdizioneFSL[]> | null) ?? locandinePerEdizione)
        setData(norm)
        const anni = Object.keys(norm)
        if (anni.length > 0) setActiveAnno(anni[anni.length - 1])
      })
      .catch(() => setError('Impossibile caricare i dati'))
      .finally(() => setLoading(false))
  }, [pin])

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(t)
  }, [saved])

  const updateEdizione = (anno: string, eiIdx: number, fn: (ed: EdizioneFSLAdmin) => EdizioneFSLAdmin) => {
    setData((prev) => prev ? { ...prev, [anno]: prev[anno].map((ed, i) => i === eiIdx ? fn(ed) : ed) } : prev)
    setSaved(false)
  }

  const handleSave = async () => {
    if (!data) return
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/admin/fsl-edizioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pin}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
    } catch { setError('Errore durante il salvataggio')
    } finally { setSaving(false) }
  }

  const addAnno = () => {
    const a = newAnno.trim()
    if (!a || !data || data[a]) return
    setData((prev) => ({ ...(prev ?? {}), [a]: [] }))
    setActiveAnno(a); setNewAnno('')
  }

  const removeAnno = (anno: string) => {
    setData((prev) => { if (!prev) return prev; const n = { ...prev }; delete n[anno]; return n })
    setActiveAnno((prev) => {
      if (prev !== anno) return prev
      const rem = Object.keys(data ?? {}).filter((a) => a !== anno)
      return rem.length > 0 ? rem[rem.length - 1] : null
    })
  }

  if (loading) return <Spinner />

  const anni = data ? Object.keys(data) : []

  return (
    <div className="space-y-5">
      {/* Anno selector */}
      <div className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <p className="text-xs font-funnel font-bold uppercase tracking-wide" style={{ color: 'rgba(32,36,76,0.4)' }}>Anno scolastico</p>
        <div className="flex flex-wrap gap-2 items-center">
          {anni.map((anno) => (
            <button key={anno} onClick={() => setActiveAnno(anno)}
              className="px-4 py-2 rounded-xl font-funnel font-semibold text-sm transition-all"
              style={{
                backgroundColor: activeAnno === anno ? 'var(--color-blu)' : 'rgba(32,36,76,0.05)',
                color: activeAnno === anno ? 'white' : 'rgba(32,36,76,0.6)',
              }}>
              {anno}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-1">
            <input type="text" value={newAnno} onChange={(e) => setNewAnno(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addAnno() }}
              placeholder="2026-2027" className="fi w-28 text-sm" aria-label="Nuovo anno" />
            <button onClick={addAnno} disabled={!newAnno.trim()}
              className="flex items-center gap-1 px-3 py-2 rounded-xl font-funnel font-bold text-xs text-white transition-opacity disabled:opacity-40"
              style={{ backgroundColor: 'var(--color-azzurro)' }}>
              <Plus size={12} /> Aggiungi
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Anno content */}
      {activeAnno && data?.[activeAnno] && (
        <div className="bg-white rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-funnel font-bold text-lg" style={{ color: 'var(--color-blu)' }}>{activeAnno}</p>
              <p className="text-xs font-funnel mt-0.5" style={{ color: 'rgba(32,36,76,0.4)' }}>
                {data[activeAnno].reduce((s, e) => s + e.corti.length, 0)} corti totali in {data[activeAnno].length} edizioni
              </p>
            </div>
            <button onClick={() => removeAnno(activeAnno)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 font-funnel font-semibold text-xs transition-colors">
              <Trash2 size={12} /> Elimina anno
            </button>
          </div>

          <div className="space-y-3">
            {data[activeAnno].map((edizione, eiIdx) => (
              <EdizioneFSLBlock
                key={eiIdx} edizione={edizione} annoIndex={activeAnno} eiIdx={eiIdx}
                onChangeLabel={(v) => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, label: v }))}
                onChangeCoro={(ci, field, value) => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, corti: ed.corti.map((c, i) => i === ci ? { ...c, [field]: value } : c) }))}
                onRemoveCoro={(ci) => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, corti: ed.corti.filter((_, i) => i !== ci) }))}
                onAddCoro={() => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, corti: [...ed.corti, { titolo: '', locandina: '', videoYT: '', premi: [] }] }))}
                onRemove={() => setData((prev) => prev ? { ...prev, [activeAnno]: prev[activeAnno].filter((_, i) => i !== eiIdx) } : prev)}
              />
            ))}
          </div>

          <button onClick={() => setData((prev) => prev ? { ...prev, [activeAnno]: [...prev[activeAnno], { label: 'Nuova edizione', corti: [] }] } : prev)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(32,36,76,0.15)', color: 'rgba(32,36,76,0.4)' }}>
            <Plus size={14} /> Aggiungi edizione
          </button>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <SaveBtn onClick={handleSave} saving={saving} saved={saved} disabled={!data} label="Salva edizioni FSL" />
      </div>
    </div>
  )
}

// ── Analytics tab ─────────────────────────────────────────────────────────────

// Sostituisci LOOKER_STUDIO_URL con il link del report Looker Studio una volta creato
const LOOKER_STUDIO_URL = ''
const GA4_URL = 'https://analytics.google.com/analytics/web/#/p{PROPERTY_ID}/reports/reportinghub'

function AnalyticsTab() {
  if (LOOKER_STUDIO_URL) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-funnel font-bold text-xl" style={{ color: 'var(--color-blu)' }}>Analytics</h2>
            <p className="text-sm font-funnel mt-0.5" style={{ color: 'rgba(32,36,76,0.45)' }}>Dashboard Looker Studio — dati aggiornati ogni 24h</p>
          </div>
          <a href={LOOKER_STUDIO_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-funnel font-semibold text-sm transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--color-azzurro)', color: 'white' }}>
            <ExternalLink size={14} /> Apri in piena schermata
          </a>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.1), 0 0 0 1px rgba(32,36,76,0.07)', height: '80vh' }}>
          <iframe src={LOOKER_STUDIO_URL} className="w-full h-full border-0" title="Analytics Dashboard" allowFullScreen />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-funnel font-bold text-xl" style={{ color: 'var(--color-blu)' }}>Analytics</h2>
        <p className="text-sm font-funnel mt-0.5" style={{ color: 'rgba(32,36,76,0.45)' }}>Google Analytics 4 è attivo sul sito — configura Looker Studio per vedere i dati qui</p>
      </div>

      {/* Status GA4 */}
      <div className="bg-white rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="font-funnel font-bold text-base" style={{ color: 'var(--color-blu)' }}>GA4 attivo — raccolta dati in corso</p>
        </div>
        <p className="text-sm font-funnel leading-relaxed" style={{ color: 'rgba(32,36,76,0.55)' }}>
          Il tracking è installato sul sito e raccoglie: sessioni, pagine visitate, dispositivi, scroll depth per pagina e click sulle CTA principali (Scopri di più, Vota qui, Regolamento PDF, invio form contatti).
        </p>
        <a href={GA4_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-funnel font-semibold text-sm text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: 'var(--color-azzurro)' }}>
          <ExternalLink size={14} /> Apri Google Analytics 4
        </a>
      </div>

      {/* Steps Looker Studio */}
      <div className="bg-white rounded-2xl p-5 space-y-5" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <p className="font-funnel font-bold text-base" style={{ color: 'var(--color-blu)' }}>Come integrare la dashboard qui</p>
        {[
          { n: '1', title: 'Crea il report su Looker Studio', desc: 'Vai su lookerstudio.google.com → Crea → Report → Aggiungi dati → Google Analytics. Seleziona la proprietà SettimaArte.' },
          { n: '2', title: 'Aggiungi i grafici che ti servono', desc: 'Sessioni, bounce rate, tempo medio, top pagine, CTA clicks (filtra evento cta_click), scroll depth (filtra evento scroll_depth).' },
          { n: '3', title: 'Condividi il report', desc: 'File → Condividi → Incorpora report → Attiva incorporamento → Copia il link.' },
          { n: '4', title: 'Incolla il link qui', desc: 'Modifica la costante LOOKER_STUDIO_URL in Admin.tsx con il link copiato e fai il deploy.' },
        ].map(({ n, title, desc }) => (
          <div key={n} className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-funnel font-bold text-sm text-white" style={{ backgroundColor: 'var(--color-fucsia)' }}>{n}</span>
            <div className="space-y-0.5 pt-0.5">
              <p className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>{title}</p>
              <p className="font-funnel text-sm leading-relaxed" style={{ color: 'rgba(32,36,76,0.5)' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Metriche tracciate */}
      <div className="bg-white rounded-2xl p-5 space-y-3" style={{ boxShadow: '0 1px 4px rgba(32,36,76,0.08), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <p className="font-funnel font-bold text-sm" style={{ color: 'var(--color-blu)' }}>Metriche già tracciate</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Sessioni e utenti unici',
            'Dispositivo (mobile / desktop / tablet)',
            'Paese e città',
            'Pagine visitate e flusso di navigazione',
            'Bounce rate e durata media sessione',
            'Scroll depth 25 / 50 / 75 / 90% per pagina',
            'Click CTA "Scopri di più" (FSL / Festival / Corto)',
            'Click "Vota qui!" (con nome progetto)',
            'Click "Regolamento PDF"',
            'Invio form contatti (con tipo utente)',
          ].map((m) => (
            <div key={m} className="flex items-center gap-2.5 text-sm font-funnel" style={{ color: 'rgba(32,36,76,0.65)' }}>
              <Check size={13} style={{ color: 'var(--color-azzurro)', flexShrink: 0 }} /> {m}
            </div>
          ))}
        </div>
        <p className="text-xs font-funnel mt-2" style={{ color: 'rgba(32,36,76,0.35)' }}>
          Demografici (età/genere): disponibili in GA4 dopo aver abilitato Google Signals nelle impostazioni proprietà.
        </p>
      </div>
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

function Dashboard({ initialData, pinRef, onLogout }: {
  initialData: VotazioniData
  pinRef: React.RefObject<string>
  onLogout: () => void
}) {
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
    setSaving(true); setSaveError(null); setSaved(false)
    const payload: VotazioniData = { enabled, corti: corti.map((c) => ({ ...c, edizione })) }
    try {
      const res = await fetch('/api/admin/corti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pinRef.current}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCorti(payload.corti); setSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Errore durante il salvataggio')
    } finally { setSaving(false) }
  }, [enabled, corti, edizione, pinRef])

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'votazioni', label: 'Votazioni', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { key: 'gallery', label: 'Gallery', icon: <LayoutGrid size={15} /> },
    { key: 'fsl-edizioni', label: 'Edizioni FSL', icon: <Film size={15} /> },
    { key: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
  ]

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: '#f0f2f7' }}>
      <style>{`
        .fi { width:100%; padding:0.5rem 0.75rem; border-radius:0.625rem; border:1.5px solid rgba(32,36,76,0.12); font-family:inherit; font-size:0.875rem; color:var(--color-blu); outline:none; transition:border-color .15s; background:white; }
        .fi:focus { border-color:var(--color-azzurro); box-shadow:0 0 0 3px rgba(5,151,222,0.1); }
        .fi::placeholder { color:rgba(32,36,76,0.28); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b" style={{ borderColor: 'rgba(32,36,76,0.08)', boxShadow: '0 1px 8px rgba(32,36,76,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <img src="/logo/7arte-oriocenter_logo_2024.png" alt="SettimaArte" className="h-7 w-auto shrink-0" />

          {/* Tabs */}
          <div className="flex-1 flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {tabs.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-funnel font-semibold text-sm transition-all"
                style={{
                  backgroundColor: activeTab === key ? 'rgba(5,151,222,0.1)' : 'transparent',
                  color: activeTab === key ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.5)',
                }}>
                {icon}{label}
              </button>
            ))}
          </div>

          <button onClick={onLogout}
            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg font-funnel font-semibold text-sm transition-colors hover:bg-gray-50"
            style={{ color: 'rgba(32,36,76,0.5)' }}>
            <LogOut size={15} /> Esci
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'votazioni' && (
          <VotazioniTab enabled={enabled} setEnabled={setEnabled} corti={corti} setCorti={setCorti}
            edizione={edizione} setEdizione={setEdizione} saving={saving} saved={saved} saveError={saveError} onSave={handleSaveVotazioni} />
        )}
        {activeTab === 'gallery' && <GalleryTab pin={pinRef.current ?? ''} />}
        {activeTab === 'fsl-edizioni' && <FSLEdizioniTab pin={pinRef.current ?? ''} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
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
    pinRef.current = pin; setData(votazioniData); setPhase('dashboard')
  }, [])

  const handleLogout = useCallback(() => {
    pinRef.current = ''; setData({ enabled: false, corti: [] }); setPhase('pin')
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
