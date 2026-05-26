import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Save, Eye, EyeOff, Plus, Loader2, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'
import { useAdminAuth } from '@/hooks/useAdminAuth'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CortoRow {
  _key: string          // chiave locale per React (non va su Supabase)
  id?: number           // undefined = nuovo record da inserire
  edizione: string
  nome_progetto: string
  trama: string
  locandina_url: string
  video_url: string
  link_voto: string
  attivo: boolean
}

let _keyCounter = 0
const newKey = () => `k${++_keyCounter}`

const emptyCorto = (edizione = ''): CortoRow => ({
  _key: newKey(),
  edizione,
  nome_progetto: '',
  trama: '',
  locandina_url: '',
  video_url: '',
  link_voto: '',
  attivo: false,
})

// ─── Login ───────────────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onLogin(email, password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenziali non valide')
    } finally {
      setLoading(false)
    }
  }

  const inp = 'w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-blu placeholder:text-blu/40 focus:outline-none focus:ring-2 focus:ring-azzurro text-sm'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm bg-white rounded-squircle shadow-lg p-8"
      >
        <img src="/logo/7arte-oriocenter_logo_2024.png" alt="SettimaArte" className="h-8 w-auto mb-8" />
        <h1 className="font-funnel font-bold text-2xl text-blu mb-1">Area riservata</h1>
        <p className="text-blu/50 text-sm mb-6">Accedi per gestire le votazioni Festival</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required className={inp} />

          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required className={`${inp} pr-10`} />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blu/40 hover:text-blu">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs flex items-center gap-1.5">
              <AlertCircle size={13} />{error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-azzurro hover:bg-azzurro/90 disabled:opacity-60 text-white font-funnel font-semibold px-6 py-3 rounded-squircle transition-colors flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Accedi
          </button>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Corto Card ───────────────────────────────────────────────────────────────

function CortoCard({
  corto,
  index,
  onChange,
  onRemove,
}: {
  corto: CortoRow
  index: number
  onChange: (key: string, field: keyof CortoRow, value: string | boolean) => void
  onRemove: (key: string) => void
}) {
  const inp = 'w-full bg-[#f9f9f9] border border-black/8 rounded-lg px-3 py-2.5 text-blu placeholder:text-blu/30 focus:outline-none focus:ring-2 focus:ring-azzurro text-sm'
  const lbl = 'text-[10px] font-funnel font-bold text-blu/40 uppercase tracking-widest mb-1 block'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-squircle border border-black/8 p-6 space-y-4"
    >
      {/* Header card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-funnel font-bold text-fucsia tracking-widest uppercase shrink-0">
            Corto #{index + 1}
          </span>
          {corto.nome_progetto && (
            <span className="font-funnel font-semibold text-blu text-sm truncate max-w-[180px]">
              {corto.nome_progetto}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Toggle attivo */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-blu/35 font-funnel">
              {corto.attivo ? 'Visibile' : 'Nascosto'}
            </span>
            <button
              type="button"
              onClick={() => onChange(corto._key, 'attivo', !corto.attivo)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                corto.attivo ? 'bg-azzurro' : 'bg-black/15'
              }`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${
                corto.attivo ? 'translate-x-[18px]' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Elimina */}
          <button
            type="button"
            onClick={() => onRemove(corto._key)}
            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
            aria-label="Rimuovi corto"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Campi */}
      <div>
        <label className={lbl}>Titolo corto</label>
        <input value={corto.nome_progetto}
          onChange={e => onChange(corto._key, 'nome_progetto', e.target.value)}
          placeholder="Es. K.onnessi" className={inp} />
      </div>

      <div>
        <label className={lbl}>Trama</label>
        <textarea value={corto.trama}
          onChange={e => onChange(corto._key, 'trama', e.target.value)}
          placeholder="Descrivi brevemente il cortometraggio..."
          rows={3} className={`${inp} resize-none`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>URL locandina</label>
          <input value={corto.locandina_url}
            onChange={e => onChange(corto._key, 'locandina_url', e.target.value)}
            placeholder="https://..." className={inp} />
        </div>
        <div>
          <label className={lbl}>URL video YouTube</label>
          <input value={corto.video_url}
            onChange={e => onChange(corto._key, 'video_url', e.target.value)}
            placeholder="https://youtu.be/..." className={inp} />
        </div>
      </div>

      <div>
        <label className={lbl}>Link voto (Google Form o altro)</label>
        <input value={corto.link_voto}
          onChange={e => onChange(corto._key, 'link_voto', e.target.value)}
          placeholder="https://forms.gle/..." className={inp} />
      </div>

      {corto.locandina_url && (
        <img src={corto.locandina_url} alt="Anteprima"
          className="h-20 w-auto rounded-lg object-cover border border-black/10"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
      )}
    </motion.div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [corti, setCorti] = useState<CortoRow[]>([])
  const [deletedIds, setDeletedIds] = useState<number[]>([])
  const [edizione, setEdizione] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState(false)

  async function loadCorti() {
    const { data, error } = await supabase
      .from('corti_correnti')
      .select('*')
      .order('id')

    if (!error && data?.length) {
      setCorti(data.map(r => ({ ...r, _key: newKey() })) as CortoRow[])
      if (data[0]?.edizione) setEdizione(data[0].edizione)
    } else {
      setCorti([emptyCorto()])
    }
    setLoadingData(false)
  }

  useEffect(() => { loadCorti() }, [])

  function updateField(key: string, field: keyof CortoRow, value: string | boolean) {
    setCorti(prev => prev.map(c => c._key === key ? { ...c, [field]: value } : c))
  }

  function addCorto() {
    setCorti(prev => [...prev, emptyCorto(edizione)])
  }

  function removeCorto(key: string) {
    const corto = corti.find(c => c._key === key)
    if (corto?.id) setDeletedIds(prev => [...prev, corto.id!])
    setCorti(prev => prev.filter(c => c._key !== key))
  }

  async function saveAll() {
    setSaving(true)
    try {
      // 1. Elimina i corto rimossi
      if (deletedIds.length) {
        const { error } = await supabase
          .from('corti_correnti')
          .delete()
          .in('id', deletedIds)
        if (error) throw error
      }

      // 2. Upsert tutti i rimanenti (nuovi senza id, esistenti con id)
      const payload = corti.map((c, i) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _key, ...rest } = c
        return {
          ...rest,
          edizione: edizione || rest.edizione,
          classe: i + 1,
        }
      })

      const toInsert = payload.filter(r => !r.id)
      const toUpdate = payload.filter(r => r.id)

      if (toUpdate.length) {
        const { error } = await supabase.from('corti_correnti').upsert(toUpdate, { onConflict: 'id' })
        if (error) throw error
      }
      if (toInsert.length) {
        const { error } = await supabase.from('corti_correnti').insert(toInsert)
        if (error) throw error
      }

      setDeletedIds([])
      toast.success('Votazioni salvate')
      await loadCorti()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  const attiviCount = corti.filter(c => c.attivo).length

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Top bar */}
      <header className="bg-white border-b border-black/8 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo/7arte-oriocenter_logo_2024.png" alt="SettimaArte" className="h-7 w-auto" />
          <span className="text-xs font-funnel font-semibold text-blu/35 uppercase tracking-widest hidden sm:block">
            Admin — Votazioni
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-funnel font-semibold px-3 py-1 rounded-full border ${
            attiviCount > 0
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-black/5 text-blu/40 border-black/8'
          }`}>
            {attiviCount > 0 ? `${attiviCount} visibil${attiviCount > 1 ? 'i' : 'e'}` : 'Sezione nascosta'}
          </span>
          <button onClick={onSignOut}
            className="flex items-center gap-1.5 text-blu/40 hover:text-blu text-sm font-funnel transition-colors">
            <LogOut size={15} />
            <span className="hidden sm:inline">Esci</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-6">

        {/* Edizione */}
        <section className="bg-white rounded-squircle border border-black/8 p-6">
          <h2 className="font-funnel font-bold text-blu mb-1">Edizione corrente</h2>
          <p className="text-blu/45 text-sm mb-4">
            Codice edizione (es. <code className="bg-black/5 px-1 rounded text-xs">dic_25</code>,{' '}
            <code className="bg-black/5 px-1 rounded text-xs">giu_26</code>) — applicato a tutti i corti al salvataggio.
          </p>
          <input value={edizione} onChange={e => setEdizione(e.target.value)}
            placeholder="Es. dic_25"
            className="w-48 bg-[#f9f9f9] border border-black/8 rounded-lg px-3 py-2 text-blu text-sm focus:outline-none focus:ring-2 focus:ring-azzurro" />
        </section>

        {/* Info */}
        <p className="text-sm text-blu/50 px-1">
          Attiva il toggle <strong className="text-blu">Visibile</strong> su un corto per renderlo pubblico nella sezione votazioni del Festival. La sezione scompare automaticamente se tutti i corti sono nascosti.
        </p>

        {/* Lista corti */}
        {loadingData ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-azzurro" />
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {corti.map((corto, i) => (
                <CortoCard
                  key={corto._key}
                  corto={corto}
                  index={i}
                  onChange={updateField}
                  onRemove={removeCorto}
                />
              ))}
            </AnimatePresence>

            {/* Aggiungi + Salva */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={addCorto}
                className="flex items-center gap-2 border border-black/12 hover:border-azzurro text-blu/60 hover:text-azzurro font-funnel font-semibold px-5 py-3 rounded-squircle transition-colors text-sm"
              >
                <Plus size={16} />
                Aggiungi corto
              </button>

              <button
                type="button"
                onClick={saveAll}
                disabled={saving || corti.length === 0}
                className="flex items-center gap-2 bg-azzurro hover:bg-azzurro/90 disabled:opacity-50 text-white font-funnel font-semibold px-8 py-3 rounded-squircle transition-colors text-sm sm:ml-auto"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Salvataggio...' : 'Salva tutto'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Admin() {
  const { session, loading, signIn, signOut } = useAdminAuth()

  async function handleLogin(email: string, password: string) {
    const { error } = await signIn(email, password)
    if (error) throw new Error(error.message)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">
        <Loader2 size={32} className="animate-spin text-azzurro" />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Area Admin | SettimaArte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {session ? <AdminDashboard onSignOut={signOut} /> : <AdminLogin onLogin={handleLogin} />}
    </>
  )
}
