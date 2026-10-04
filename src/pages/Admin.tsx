import { useState, useRef, useCallback, useEffect, useMemo, KeyboardEvent, ChangeEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Toaster, toast } from 'sonner'
import { Plus, Trash2, ImageIcon, Video, ChevronDown, ChevronUp, Check, AlertCircle, LogOut, Film, BarChart2, ExternalLink, Upload, Home, Vote, Images, Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react'
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
type AdminTab = 'overview' | 'votazioni' | 'gallery' | 'fsl-edizioni' | 'analytics'
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

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <div className="w-6 h-6 rounded-full border-2 border-azzurro border-t-transparent animate-spin" style={{ borderColor: 'var(--color-azzurro)', borderTopColor: 'transparent' }} />
      <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.4)' }}>Caricamento…</p>
    </div>
  )
}

function UploadButton({ pin, folder, onUploaded, accept = 'image/*', label = 'Carica' }: {
  pin: string; folder: string; onUploaded: (url: string) => void
  accept?: string; label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${pin}` },
        body: fd,
      })
      const data = await res.json().catch(() => ({})) as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Upload fallito')
      onUploaded(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload fallito')
      setTimeout(() => setError(null), 4000)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
        title={error ?? 'Carica un file dal computer'}
        className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-funnel font-semibold text-xs text-white transition-opacity disabled:opacity-50"
        style={{ backgroundColor: error ? '#dc2626' : 'var(--color-azzurro)' }}>
        <Upload size={11} /> {uploading ? '…' : (error ? 'Errore' : label)}
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
    </>
  )
}

// ── Shell primitives ───────────────────────────────────────────────────────────

function StatusDot({ tone = 'neutral', pulse = false }: { tone?: 'live' | 'neutral' | 'muted'; pulse?: boolean }) {
  const color = tone === 'live' ? 'var(--color-fucsia)' : tone === 'muted' ? 'rgba(32,36,76,0.25)' : 'rgba(32,36,76,0.55)'
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: 10, height: 10 }}>
      {pulse && (
        <span className="absolute inset-0 rounded-full opacity-30 animate-ping" style={{ backgroundColor: color }} />
      )}
      <span className="relative rounded-full" style={{ width: 8, height: 8, backgroundColor: color }} />
    </span>
  )
}

function PageHeader({ eyebrow, title, description, actions }: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="pb-6 mb-6 border-b" style={{ borderColor: 'rgba(32,36,76,0.08)' }}>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-funnel font-bold uppercase tracking-[0.08em] mb-2" style={{ color: 'rgba(32,36,76,0.4)' }}>
              {eyebrow}
            </p>
          )}
          <h1 className="font-funnel font-bold text-[26px] leading-tight" style={{ color: 'var(--color-blu)' }}>
            {title}
          </h1>
          {description && (
            <p className="font-funnel text-sm mt-1.5 max-w-xl" style={{ color: 'rgba(32,36,76,0.55)' }}>
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}

function SaveBar({ saving, onSave, label = 'Salva modifiche', disabled, hint }: {
  saving: boolean; onSave: () => void
  label?: string; disabled?: boolean; hint?: string
}) {
  return (
    <div
      className="sticky bottom-0 -mx-6 lg:-mx-10 mt-10 px-6 lg:px-10 py-3.5 flex items-center justify-between gap-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'saturate(1.4) blur(10px)',
        WebkitBackdropFilter: 'saturate(1.4) blur(10px)',
        borderTop: '1px solid rgba(32,36,76,0.08)',
        zIndex: 20,
      }}
    >
      <p className="font-funnel text-xs sm:text-sm" style={{ color: 'rgba(32,36,76,0.55)' }}>
        {hint ?? 'Le modifiche sono visibili sul sito dopo il salvataggio.'}
      </p>
      <button
        onClick={onSave} disabled={saving || disabled}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-funnel font-bold text-sm text-white transition-all disabled:opacity-40 active:scale-[0.98]"
        style={{ backgroundColor: 'var(--color-azzurro)' }}
      >
        {saving ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Salvataggio…
          </>
        ) : (
          <>{label} <ArrowRight size={14} /></>
        )}
      </button>
    </div>
  )
}

const NAV_ITEMS: { key: AdminTab; label: string; icon: React.ReactNode; group?: string }[] = [
  { key: 'overview', label: 'Panoramica', icon: <Home size={16} /> },
  { key: 'votazioni', label: 'Votazioni Festival', icon: <Vote size={16} />, group: 'Contenuti' },
  { key: 'fsl-edizioni', label: 'Edizioni FSL', icon: <Film size={16} />, group: 'Contenuti' },
  { key: 'gallery', label: 'Gallerie', icon: <Images size={16} />, group: 'Contenuti' },
  { key: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} />, group: 'Dati' },
]

function SidebarNav({ active, onSelect, onLogout }: {
  active: AdminTab
  onSelect: (tab: AdminTab) => void
  onLogout: () => void
}) {
  let lastGroup: string | undefined = undefined
  return (
    <nav className="h-full flex flex-col" style={{ backgroundColor: '#f6f7fb', borderRight: '1px solid rgba(32,36,76,0.07)' }}>
      <div className="h-16 flex items-center px-5 shrink-0">
        <img src="/logo/7arte-oriocenter_logo_2024.png" alt="SettimaArte" className="h-7 w-auto" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const showGroup = item.group && item.group !== lastGroup
          lastGroup = item.group
          const isActive = active === item.key
          return (
            <div key={item.key}>
              {showGroup && (
                <p className="text-[10px] font-funnel font-bold uppercase tracking-[0.1em] px-3 pt-5 pb-1.5" style={{ color: 'rgba(32,36,76,0.38)' }}>
                  {item.group}
                </p>
              )}
              <button
                onClick={() => onSelect(item.key)}
                aria-current={isActive ? 'page' : undefined}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-funnel font-semibold text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? 'rgba(5,151,222,0.1)' : 'transparent',
                  color: isActive ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.7)',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(32,36,76,0.04)' }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span className="shrink-0" style={{ color: isActive ? 'var(--color-azzurro)' : 'rgba(32,36,76,0.5)' }}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t" style={{ borderColor: 'rgba(32,36,76,0.07)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-funnel font-semibold text-sm transition-colors"
          style={{ color: 'rgba(32,36,76,0.6)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(32,36,76,0.04)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <LogOut size={16} style={{ color: 'rgba(32,36,76,0.4)' }} />
          Esci
        </button>
      </div>
    </nav>
  )
}

function MobileTopBar({ activeLabel, onMenuOpen }: { activeLabel: string; onMenuOpen: () => void }) {
  return (
    <div className="lg:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 bg-white border-b" style={{ borderColor: 'rgba(32,36,76,0.08)' }}>
      <button onClick={onMenuOpen} aria-label="Apri menu" className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Menu size={20} style={{ color: 'var(--color-blu)' }} />
      </button>
      <img src="/logo/7arte-oriocenter_logo_2024.png" alt="SettimaArte" className="h-6 w-auto" />
      <span className="ml-auto font-funnel font-semibold text-sm" style={{ color: 'rgba(32,36,76,0.55)' }}>{activeLabel}</span>
    </div>
  )
}

function MobileDrawer({ open, onClose, active, onSelect, onLogout }: {
  open: boolean; onClose: () => void
  active: AdminTab; onSelect: (tab: AdminTab) => void; onLogout: () => void
}) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-[280px] max-w-[85%] h-full bg-white shadow-xl animate-[slideIn_.2s_ease-out]">
        <button
          onClick={onClose}
          aria-label="Chiudi menu"
          className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
        >
          <X size={18} style={{ color: 'var(--color-blu)' }} />
        </button>
        <SidebarNav
          active={active}
          onSelect={(k) => { onSelect(k); onClose() }}
          onLogout={() => { onLogout(); onClose() }}
        />
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
    </div>
  )
}

// ── Votazioni ──────────────────────────────────────────────────────────────────

function CortoCard({ corto, onChange, onRemove, pin }: {
  corto: CortoCorrente
  onChange: (id: number, field: keyof CortoCorrente, value: string | boolean) => void
  onRemove: (id: number) => void
  pin: string
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
          <div className="flex items-center gap-2">
            <input id={`loc-${corto.id}`} type="text" value={corto.locandina_url ?? ''} onChange={(e) => onChange(corto.id, 'locandina_url', e.target.value)} placeholder="https://…" className="fi flex-1" />
            <UploadButton pin={pin} folder="votazioni/locandine" onUploaded={(url) => onChange(corto.id, 'locandina_url', url)} />
          </div>
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

function VotazioniTab({ enabled, setEnabled, corti, setCorti, edizione, setEdizione, saving, onSave, pin }: {
  enabled: boolean; setEnabled: (v: boolean) => void
  corti: CortoCorrente[]; setCorti: (c: CortoCorrente[]) => void
  edizione: string; setEdizione: (v: string) => void
  saving: boolean; onSave: () => void
  pin: string
}) {
  const updateCorto = (id: number, field: keyof CortoCorrente, value: string | boolean) =>
    setCorti(corti.map((c) => c.id === id ? { ...c, [field]: value === '' ? null : value } : c))
  const addCorto = () => {
    const id = corti.length > 0 ? Math.max(...corti.map((c) => c.id)) + 1 : 1
    setCorti([...corti, { id, edizione, classe: '', nome_progetto: '', trama: null, locandina_url: null, video_url: null, link_voto: null, attivo: true }])
  }

  return (
    <>
      <PageHeader
        eyebrow="Contenuti"
        title="Votazioni Festival"
        description="Attiva la sezione votazioni sul sito e configura i 4 corti in gara. Visibile solo durante le edizioni Dicembre e Giugno."
      />

      {/* Status + edizione — una sola card, due righe */}
      <div className="bg-white rounded-2xl mb-6" style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.06), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <StatusDot tone={enabled ? 'live' : 'muted'} pulse={enabled} />
            <div className="min-w-0">
              <p className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>
                Sezione votazioni {enabled ? 'attiva' : 'nascosta'}
              </p>
              <p className="font-funnel text-xs mt-0.5" style={{ color: 'rgba(32,36,76,0.5)' }}>
                {enabled ? 'I visitatori vedono i 4 corti e il link di voto sulla pagina Festival.' : 'La sezione non appare sul sito pubblico.'}
              </p>
            </div>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>
        <div className="flex items-center gap-3 px-5 py-3 border-t" style={{ borderColor: 'rgba(32,36,76,0.07)' }}>
          <label htmlFor="edizione-input" className="font-funnel text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(32,36,76,0.45)' }}>
            Edizione corrente
          </label>
          <input id="edizione-input" type="text" value={edizione} onChange={(e) => setEdizione(e.target.value)} placeholder="giu_26" className="fi w-40" />
          <span className="font-funnel text-xs" style={{ color: 'rgba(32,36,76,0.4)' }}>es. dic_26, giu_26</span>
        </div>
      </div>

      {/* Corti */}
      <div className="space-y-2 mb-3">
        <h2 className="font-funnel font-semibold text-sm" style={{ color: 'rgba(32,36,76,0.65)' }}>
          Corti in gara <span className="font-normal" style={{ color: 'rgba(32,36,76,0.4)' }}>({corti.length})</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {corti.map((c) => <CortoCard key={c.id} corto={c} onChange={updateCorto} onRemove={(id) => setCorti(corti.filter((x) => x.id !== id))} pin={pin} />)}
      </div>

      <button
        onClick={addCorto}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-white/70"
        style={{ borderColor: 'rgba(32,36,76,0.18)', color: 'rgba(32,36,76,0.45)' }}
      >
        <Plus size={15} /> Aggiungi corto
      </button>

      <SaveBar saving={saving} onSave={onSave} label="Salva votazioni" />
    </>
  )
}

// ── Gallery ────────────────────────────────────────────────────────────────────

function GalleryItemRow({ item, index, onChange, onRemove, pin, section }: {
  item: GalleryItemAdmin; index: number
  onChange: (i: number, field: keyof GalleryItemAdmin, value: string) => void
  onRemove: (i: number) => void
  pin: string; section: GallerySection
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
          <UploadButton pin={pin} folder={`gallery/${section}`} onUploaded={(url) => onChange(index, 'src', url)} />
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

  useEffect(() => {
    let cancelled = false
    setItems(null); setLoading(true)
    fetch(`/api/admin/gallery/${section}`, { headers: { Authorization: `Bearer ${pin}` } })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setItems(toAdminItems((data as GalleryItem[] | null) ?? GALLERY_DEFAULTS[section])) })
      .catch(() => { if (!cancelled) toast.error('Impossibile caricare i dati') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [section, pin])

  const handleSave = async () => {
    if (!items) return
    setSaving(true)
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
      toast.success('Gallery salvata')
    } catch { toast.error('Errore durante il salvataggio')
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  const images = items?.filter((it) => it.type === 'image').length ?? 0
  const videos = items?.filter((it) => it.type === 'video').length ?? 0

  return (
    <>
      {/* Counts */}
      <div className="flex items-center gap-2 mb-4">
        {images > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-funnel font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(5,151,222,0.08)', color: 'var(--color-azzurro)' }}>
            <ImageIcon size={11} /> {images} foto
          </span>
        )}
        {videos > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-funnel font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(229,5,118,0.08)', color: 'var(--color-fucsia)' }}>
            <Video size={11} /> {videos} video
          </span>
        )}
        {images === 0 && videos === 0 && (
          <span className="font-funnel text-xs" style={{ color: 'rgba(32,36,76,0.4)' }}>Nessun elemento. Aggiungine uno qui sotto.</span>
        )}
      </div>

      {/* Items list */}
      <div className="space-y-1.5">
        {(items ?? []).map((item, i) => (
          <GalleryItemRow key={i} item={item} index={i} pin={pin} section={section}
            onChange={(idx, field, val) => { setItems((p) => p ? p.map((it, j) => j === idx ? { ...it, [field]: val } : it) : p) }}
            onRemove={(idx) => { setItems((p) => p ? p.filter((_, j) => j !== idx) : p) }}
          />
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 mt-3">
        <button onClick={() => setItems((p) => [...(p ?? []), { type: 'image', src: '', alt: '' }])}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-dashed font-funnel font-semibold text-xs transition-colors hover:bg-white"
          style={{ borderColor: 'rgba(5,151,222,0.3)', color: 'var(--color-azzurro)' }}>
          <ImageIcon size={12} /> Aggiungi foto
        </button>
        <button onClick={() => setItems((p) => [...(p ?? []), { type: 'video', src: '/images/placeholder-video.jpg', alt: '', videoId: '', platform: 'youtube' }])}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-dashed font-funnel font-semibold text-xs transition-colors hover:bg-white"
          style={{ borderColor: 'rgba(229,5,118,0.3)', color: 'var(--color-fucsia)' }}>
          <Video size={12} /> Aggiungi video
        </button>
      </div>

      <SaveBar saving={saving} onSave={handleSave} label="Salva gallery" disabled={!items} />
    </>
  )
}

function GalleryTab({ pin }: { pin: string }) {
  const [activeSection, setActiveSection] = useState<GallerySection>('festival-evento')
  const active = GALLERY_SECTIONS.find((s) => s.key === activeSection)!

  return (
    <>
      <PageHeader
        eyebrow="Contenuti"
        title="Gallerie"
        description="Foto e video che compaiono nelle pagine Festival, FSL e Cortometraggio. Scegli una sezione, aggiungi elementi, carica dalle locali o incolla gli URL."
      />

      {/* Section selector — sub-nav orizzontale */}
      <div className="mb-5 flex flex-wrap gap-1 border-b" style={{ borderColor: 'rgba(32,36,76,0.08)' }}>
        {GALLERY_SECTIONS.map(({ key, label }) => {
          const isActive = activeSection === key
          return (
            <button
              key={key} onClick={() => setActiveSection(key)}
              className="relative px-3.5 py-2.5 font-funnel font-semibold text-sm transition-colors"
              style={{ color: isActive ? 'var(--color-blu)' : 'rgba(32,36,76,0.5)' }}
            >
              {label}
              {isActive && (
                <span className="absolute left-2 right-2 bottom-[-1px] h-[2px] rounded-full" style={{ backgroundColor: 'var(--color-azzurro)' }} />
              )}
            </button>
          )
        })}
      </div>

      <p className="font-funnel text-sm mb-5" style={{ color: 'rgba(32,36,76,0.55)' }}>{active.desc}</p>

      <GallerySectionEditor key={activeSection} section={activeSection} pin={pin} />
    </>
  )
}

// ── FSL Edizioni ───────────────────────────────────────────────────────────────

function CortoFSLCard({ corto, index, onChange, onRemove, pin, anno }: {
  corto: CortoFSL; index: number
  onChange: (i: number, field: keyof CortoFSL, value: string | string[]) => void
  onRemove: (i: number) => void
  pin: string; anno: string
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
        <div className="flex items-center gap-2">
          <input id={`cl-${index}`} type="text" value={corto.locandina} onChange={(e) => onChange(index, 'locandina', e.target.value)} placeholder="https://…" className="fi flex-1 text-sm" />
          <UploadButton pin={pin} folder={`fsl/locandine/${anno}`} onUploaded={(url) => onChange(index, 'locandina', url)} />
        </div>
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

function EdizioneFSLBlock({ edizione, annoIndex, eiIdx, onChangeLabel, onChangeCoro, onRemoveCoro, onAddCoro, onRemove, pin }: {
  edizione: EdizioneFSLAdmin; annoIndex: string; eiIdx: number
  onChangeLabel: (v: string) => void
  onChangeCoro: (ci: number, field: keyof CortoFSL, value: string | string[]) => void
  onRemoveCoro: (ci: number) => void
  onAddCoro: () => void
  onRemove: () => void
  pin: string
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
            <CortoFSLCard key={ci} corto={corto} index={ci} onChange={onChangeCoro} onRemove={onRemoveCoro} pin={pin} anno={annoIndex} />
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
  const [activeAnno, setActiveAnno] = useState<string | null>(null)
  const [newAnno, setNewAnno] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/fsl-edizioni', { headers: { Authorization: `Bearer ${pin}` } })
      .then((r) => r.json())
      .then((raw) => {
        const norm = toAdminFSL((raw as Record<string, EdizioneFSL[]> | null) ?? locandinePerEdizione)
        setData(norm)
        const anni = Object.keys(norm)
        if (anni.length > 0) setActiveAnno(anni[anni.length - 1])
      })
      .catch(() => toast.error('Impossibile caricare i dati'))
      .finally(() => setLoading(false))
  }, [pin])

  const updateEdizione = (anno: string, eiIdx: number, fn: (ed: EdizioneFSLAdmin) => EdizioneFSLAdmin) => {
    setData((prev) => prev ? { ...prev, [anno]: prev[anno].map((ed, i) => i === eiIdx ? fn(ed) : ed) } : prev)
  }

  const handleSave = async () => {
    if (!data) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/fsl-edizioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pin}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Edizioni FSL salvate')
    } catch { toast.error('Errore durante il salvataggio')
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

  if (loading) return <>
    <PageHeader eyebrow="Contenuti" title="Edizioni FSL" />
    <Spinner />
  </>

  const anni = data ? Object.keys(data) : []

  return (
    <>
      <PageHeader
        eyebrow="Contenuti"
        title="Edizioni FSL"
        description="I cortometraggi realizzati dagli studenti, raggruppati per anno scolastico. Compaiono nella pagina FSL alla voce ‘I cortometraggi per anno’."
      />

      {/* Anno selector */}
      <div className="mb-6">
        <p className="text-[11px] font-funnel font-bold uppercase tracking-[0.08em] mb-2.5" style={{ color: 'rgba(32,36,76,0.45)' }}>
          Anno scolastico
        </p>
        <div className="flex flex-wrap gap-1.5 items-center">
          {anni.map((anno) => {
            const isActive = activeAnno === anno
            return (
              <button
                key={anno} onClick={() => setActiveAnno(anno)}
                className="px-3.5 py-1.5 rounded-lg font-funnel font-semibold text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? 'var(--color-blu)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(32,36,76,0.6)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--color-blu)' : 'rgba(32,36,76,0.12)',
                }}
              >
                {anno}
              </button>
            )
          })}
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="text" value={newAnno} onChange={(e) => setNewAnno(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addAnno() }}
              placeholder="2026-2027" className="fi w-28 text-sm" aria-label="Nuovo anno"
            />
            <button
              onClick={addAnno} disabled={!newAnno.trim()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-funnel font-bold text-xs text-white transition-opacity disabled:opacity-40"
              style={{ backgroundColor: 'var(--color-azzurro)' }}
            >
              <Plus size={12} /> Aggiungi anno
            </button>
          </div>
        </div>
      </div>

      {/* Anno content */}
      {activeAnno && data?.[activeAnno] && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-funnel font-bold text-lg" style={{ color: 'var(--color-blu)' }}>{activeAnno}</h2>
              <p className="text-xs font-funnel mt-0.5" style={{ color: 'rgba(32,36,76,0.5)' }}>
                {data[activeAnno].reduce((s, e) => s + e.corti.length, 0)} corti in {data[activeAnno].length} {data[activeAnno].length === 1 ? 'edizione' : 'edizioni'}
              </p>
            </div>
            <button onClick={() => removeAnno(activeAnno)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 font-funnel font-semibold text-xs transition-colors">
              <Trash2 size={12} /> Elimina anno
            </button>
          </div>

          <div className="space-y-3">
            {data[activeAnno].map((edizione, eiIdx) => (
              <EdizioneFSLBlock
                key={eiIdx} edizione={edizione} annoIndex={activeAnno} eiIdx={eiIdx} pin={pin}
                onChangeLabel={(v) => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, label: v }))}
                onChangeCoro={(ci, field, value) => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, corti: ed.corti.map((c, i) => i === ci ? { ...c, [field]: value } : c) }))}
                onRemoveCoro={(ci) => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, corti: ed.corti.filter((_, i) => i !== ci) }))}
                onAddCoro={() => updateEdizione(activeAnno, eiIdx, (ed) => ({ ...ed, corti: [...ed.corti, { titolo: '', locandina: '', videoYT: '', premi: [] }] }))}
                onRemove={() => setData((prev) => prev ? { ...prev, [activeAnno]: prev[activeAnno].filter((_, i) => i !== eiIdx) } : prev)}
              />
            ))}
          </div>

          <button
            onClick={() => setData((prev) => prev ? { ...prev, [activeAnno]: [...prev[activeAnno], { label: 'Nuova edizione', corti: [] }] } : prev)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed font-funnel font-semibold text-sm transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(32,36,76,0.15)', color: 'rgba(32,36,76,0.4)' }}
          >
            <Plus size={14} /> Aggiungi edizione
          </button>
        </div>
      )}

      <SaveBar saving={saving} onSave={handleSave} label="Salva edizioni FSL" disabled={!data} />
    </>
  )
}

// ── Analytics tab ─────────────────────────────────────────────────────────────

// Sostituisci LOOKER_STUDIO_URL con il link del report Looker Studio una volta creato
const LOOKER_STUDIO_URL = ''
const GA4_URL = 'https://analytics.google.com/analytics/web/#/p{PROPERTY_ID}/reports/reportinghub'

function AnalyticsTab() {
  if (LOOKER_STUDIO_URL) {
    return (
      <>
        <PageHeader
          eyebrow="Dati"
          title="Analytics"
          description="Dashboard Looker Studio collegata a Google Analytics 4. Dati aggiornati ogni 24h."
          actions={
            <a href={LOOKER_STUDIO_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-funnel font-semibold text-sm transition-colors hover:opacity-85"
              style={{ backgroundColor: 'var(--color-azzurro)', color: 'white' }}>
              Apri in piena schermata <ArrowUpRight size={14} />
            </a>
          }
        />
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)', height: '78vh' }}>
          <iframe src={LOOKER_STUDIO_URL} className="w-full h-full border-0" title="Analytics Dashboard" allowFullScreen />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Dati"
        title="Analytics"
        description="Google Analytics 4 è attivo sul sito. Per visualizzare qui i grafici serve collegare un report Looker Studio."
        actions={
          <a href={GA4_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-funnel font-semibold text-sm text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: 'var(--color-azzurro)' }}>
            Apri GA4 <ArrowUpRight size={14} />
          </a>
        }
      />

      {/* Status GA4 */}
      <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <div className="flex items-center gap-3 mb-3">
          <StatusDot tone="live" pulse />
          <p className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>GA4 attivo, raccolta dati in corso</p>
        </div>
        <p className="text-sm font-funnel leading-relaxed" style={{ color: 'rgba(32,36,76,0.6)' }}>
          Il tracking raccoglie sessioni, pagine, dispositivi, scroll depth e click sulle CTA principali
          (Scopri di più, Vota qui, Regolamento PDF, invio form contatti).
        </p>
      </div>

      {/* Steps Looker */}
      <h2 className="font-funnel font-semibold text-sm mb-3" style={{ color: 'rgba(32,36,76,0.65)' }}>Come collegare la dashboard</h2>
      <ol className="bg-white rounded-2xl divide-y" style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        {[
          { title: 'Crea il report su Looker Studio', desc: 'lookerstudio.google.com → Crea → Report → Aggiungi dati → Google Analytics. Seleziona la proprietà SettimaArte.' },
          { title: 'Aggiungi i grafici utili', desc: 'Sessioni, bounce rate, tempo medio, top pagine, CTA clicks (evento cta_click), scroll depth (evento scroll_depth).' },
          { title: 'Condividi come embed', desc: 'File → Condividi → Incorpora report → Attiva incorporamento → Copia link.' },
          { title: 'Incolla qui', desc: 'Modifica LOOKER_STUDIO_URL in Admin.tsx con il link e fai il deploy.' },
        ].map(({ title, desc }, i) => (
          <li key={i} className="flex gap-4 px-5 py-4" style={{ borderColor: 'rgba(32,36,76,0.07)' }}>
            <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-funnel font-bold text-[11px]" style={{ backgroundColor: 'rgba(5,151,222,0.1)', color: 'var(--color-azzurro)' }}>{i + 1}</span>
            <div>
              <p className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>{title}</p>
              <p className="font-funnel text-sm leading-relaxed mt-0.5" style={{ color: 'rgba(32,36,76,0.55)' }}>{desc}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Metriche tracciate */}
      <h2 className="font-funnel font-semibold text-sm mt-8 mb-3" style={{ color: 'rgba(32,36,76,0.65)' }}>Eventi già tracciati</h2>
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {[
            'Sessioni e utenti unici',
            'Dispositivo (mobile / desktop / tablet)',
            'Paese e città',
            'Pagine visitate e flusso',
            'Bounce rate e durata media',
            'Scroll depth 25 / 50 / 75 / 90%',
            'Click CTA "Scopri di più" (FSL / Festival / Corto)',
            'Click "Vota qui!" (con nome progetto)',
            'Click "Regolamento PDF"',
            'Invio form contatti (con tipo utente)',
          ].map((m) => (
            <div key={m} className="flex items-center gap-2.5 text-sm font-funnel" style={{ color: 'rgba(32,36,76,0.7)' }}>
              <Check size={13} style={{ color: 'var(--color-azzurro)', flexShrink: 0 }} /> {m}
            </div>
          ))}
        </div>
        <p className="text-xs font-funnel mt-4" style={{ color: 'rgba(32,36,76,0.4)' }}>
          Demografici (età/genere) disponibili in GA4 dopo aver abilitato Google Signals.
        </p>
      </div>
    </>
  )
}

// ── Overview tab ──────────────────────────────────────────────────────────────

function OverviewTab({ pin, enabled, corti, onGo }: {
  pin: string
  enabled: boolean
  corti: CortoCorrente[]
  onGo: (tab: AdminTab) => void
}) {
  const [fslSummary, setFslSummary] = useState<{ anno: string; corti: number } | null>(null)
  const [gallerySummary, setGallerySummary] = useState<{ filled: number; empty: number } | null>(null)

  useEffect(() => {
    fetch('/api/admin/fsl-edizioni', { headers: { Authorization: `Bearer ${pin}` } })
      .then((r) => r.json())
      .then((raw) => {
        const norm = toAdminFSL((raw as Record<string, EdizioneFSL[]> | null) ?? locandinePerEdizione)
        const anni = Object.keys(norm)
        if (anni.length === 0) { setFslSummary(null); return }
        const latest = anni[anni.length - 1]
        const totalCorti = norm[latest].reduce((s, e) => s + e.corti.length, 0)
        setFslSummary({ anno: latest, corti: totalCorti })
      })
      .catch(() => setFslSummary(null))

    Promise.all(GALLERY_SECTIONS.map(({ key }) =>
      fetch(`/api/admin/gallery/${key}`, { headers: { Authorization: `Bearer ${pin}` } }).then((r) => r.json()).catch(() => null)
    )).then((results) => {
      let filled = 0
      results.forEach((data) => { if (Array.isArray(data) && data.length > 0) filled++ })
      setGallerySummary({ filled, empty: GALLERY_SECTIONS.length - filled })
    })
  }, [pin])

  const attiviCount = corti.filter((c) => c.attivo).length

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }, [])

  return (
    <>
      <PageHeader
        eyebrow={todayFormatted}
        title="Panoramica"
        description="Lo stato attuale di ciò che è pubblicato sul sito e un accesso rapido alle sezioni."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Votazioni Festival */}
        <button
          onClick={() => onGo('votazioni')}
          className="group text-left bg-white rounded-2xl p-5 transition-shadow hover:shadow-md"
          style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)' }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <StatusDot tone={enabled ? 'live' : 'muted'} pulse={enabled} />
              <p className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>
                Votazioni Festival
              </p>
            </div>
            <ArrowUpRight size={16} className="opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blu)' }} />
          </div>
          <p className="font-funnel text-[22px] leading-tight font-bold mb-1" style={{ color: enabled ? 'var(--color-blu)' : 'rgba(32,36,76,0.4)' }}>
            {enabled ? 'In corso' : 'Non attiva'}
          </p>
          <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.55)' }}>
            {enabled
              ? `${attiviCount} ${attiviCount === 1 ? 'corto visibile' : 'corti visibili'} sul sito`
              : 'La sezione è nascosta dal sito pubblico'}
          </p>
        </button>

        {/* Edizione FSL corrente */}
        <button
          onClick={() => onGo('fsl-edizioni')}
          className="group text-left bg-white rounded-2xl p-5 transition-shadow hover:shadow-md"
          style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)' }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Film size={14} style={{ color: 'rgba(32,36,76,0.5)' }} />
              <p className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>
                Edizione FSL corrente
              </p>
            </div>
            <ArrowUpRight size={16} className="opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blu)' }} />
          </div>
          <p className="font-funnel text-[22px] leading-tight font-bold mb-1" style={{ color: 'var(--color-blu)' }}>
            {fslSummary?.anno ?? '—'}
          </p>
          <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.55)' }}>
            {fslSummary ? `${fslSummary.corti} ${fslSummary.corti === 1 ? 'corto pubblicato' : 'corti pubblicati'}` : 'Nessuna edizione'}
          </p>
        </button>

        {/* Gallerie */}
        <button
          onClick={() => onGo('gallery')}
          className="group text-left bg-white rounded-2xl p-5 transition-shadow hover:shadow-md"
          style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)' }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Images size={14} style={{ color: 'rgba(32,36,76,0.5)' }} />
              <p className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>Gallerie</p>
            </div>
            <ArrowUpRight size={16} className="opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blu)' }} />
          </div>
          <p className="font-funnel text-[22px] leading-tight font-bold mb-1" style={{ color: 'var(--color-blu)' }}>
            {gallerySummary ? `${gallerySummary.filled} / ${GALLERY_SECTIONS.length}` : '—'}
          </p>
          <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.55)' }}>
            {gallerySummary ? (gallerySummary.empty > 0 ? `${gallerySummary.empty} ancora vuote` : 'Tutte configurate') : 'Caricamento…'}
          </p>
        </button>

        {/* Sito pubblico */}
        <a
          href="/" target="_blank" rel="noopener noreferrer"
          className="group text-left bg-white rounded-2xl p-5 transition-shadow hover:shadow-md"
          style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)' }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <ExternalLink size={14} style={{ color: 'rgba(32,36,76,0.5)' }} />
              <p className="font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>Sito pubblico</p>
            </div>
            <ArrowUpRight size={16} className="opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blu)' }} />
          </div>
          <p className="font-funnel text-[22px] leading-tight font-bold mb-1" style={{ color: 'var(--color-blu)' }}>
            settimaartefestival.it
          </p>
          <p className="font-funnel text-sm" style={{ color: 'rgba(32,36,76,0.55)' }}>
            Apri in nuova scheda per verificare le modifiche
          </p>
        </a>
      </div>

      {/* Quick actions */}
      <h2 className="font-funnel font-semibold text-sm mt-10 mb-3" style={{ color: 'rgba(32,36,76,0.65)' }}>
        Azioni rapide
      </h2>
      <div className="bg-white rounded-2xl divide-y" style={{ boxShadow: '0 1px 3px rgba(32,36,76,0.07), 0 0 0 1px rgba(32,36,76,0.06)' }}>
        {[
          { label: enabled ? 'Modifica i corti in votazione' : 'Attiva la sezione votazioni', tab: 'votazioni' as AdminTab, icon: <Vote size={15} /> },
          { label: fslSummary ? `Aggiorna i corti ${fslSummary.anno}` : 'Aggiungi la prima edizione FSL', tab: 'fsl-edizioni' as AdminTab, icon: <Film size={15} /> },
          { label: 'Carica foto o video nelle gallerie', tab: 'gallery' as AdminTab, icon: <Images size={15} /> },
        ].map(({ label, tab, icon }) => (
          <button
            key={tab} onClick={() => onGo(tab)}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(32,36,76,0.07)' }}
          >
            <span style={{ color: 'rgba(32,36,76,0.45)' }}>{icon}</span>
            <span className="flex-1 font-funnel font-semibold text-sm" style={{ color: 'var(--color-blu)' }}>{label}</span>
            <ArrowRight size={14} style={{ color: 'rgba(32,36,76,0.3)' }} />
          </button>
        ))}
      </div>
    </>
  )
}

// ── Dashboard shell ────────────────────────────────────────────────────────────

function Dashboard({ initialData, pinRef, onLogout }: {
  initialData: VotazioniData
  pinRef: React.RefObject<string>
  onLogout: () => void
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [enabled, setEnabled] = useState(initialData.enabled)
  const [corti, setCorti] = useState<CortoCorrente[]>(initialData.corti)
  const [edizione, setEdizione] = useState(initialData.corti[0]?.edizione ?? '')
  const [saving, setSaving] = useState(false)

  const handleSaveVotazioni = useCallback(async () => {
    setSaving(true)
    const payload: VotazioniData = { enabled, corti: corti.map((c) => ({ ...c, edizione })) }
    try {
      const res = await fetch('/api/admin/corti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pinRef.current}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCorti(payload.corti)
      toast.success('Votazioni salvate')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Errore durante il salvataggio')
    } finally { setSaving(false) }
  }, [enabled, corti, edizione, pinRef])

  const pin = pinRef.current ?? ''
  const activeLabel = NAV_ITEMS.find((n) => n.key === activeTab)?.label ?? ''

  return (
    <div className="min-h-[100dvh] flex" style={{ backgroundColor: '#fafbfd' }}>
      <style>{`
        .fi { width:100%; padding:0.5rem 0.75rem; border-radius:0.625rem; border:1.5px solid rgba(32,36,76,0.12); font-family:inherit; font-size:0.875rem; color:var(--color-blu); outline:none; transition:border-color .15s, box-shadow .15s; background:white; }
        .fi:focus { border-color:var(--color-azzurro); box-shadow:0 0 0 3px rgba(5,151,222,0.12); }
        .fi::placeholder { color:rgba(32,36,76,0.28); }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col sticky top-0 w-64 h-screen shrink-0">
        <SidebarNav active={activeTab} onSelect={setActiveTab} onLogout={onLogout} />
      </aside>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={activeTab}
        onSelect={setActiveTab}
        onLogout={onLogout}
      />

      {/* Content column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar activeLabel={activeLabel} onMenuOpen={() => setDrawerOpen(true)} />

        <main className="flex-1 px-6 lg:px-10 py-8 lg:py-10 max-w-[1180px] w-full">
          {activeTab === 'overview' && (
            <OverviewTab pin={pin} enabled={enabled} corti={corti} onGo={setActiveTab} />
          )}
          {activeTab === 'votazioni' && (
            <VotazioniTab
              enabled={enabled} setEnabled={setEnabled}
              corti={corti} setCorti={setCorti}
              edizione={edizione} setEdizione={setEdizione}
              saving={saving} onSave={handleSaveVotazioni}
              pin={pin}
            />
          )}
          {activeTab === 'gallery' && <GalleryTab pin={pin} />}
          {activeTab === 'fsl-edizioni' && <FSLEdizioniTab pin={pin} />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </main>
      </div>

      <Toaster richColors position="bottom-right" closeButton toastOptions={{ className: 'font-funnel' }} />
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
