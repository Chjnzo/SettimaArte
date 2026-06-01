import { useQuery } from '@tanstack/react-query'

export interface CortoCorrente {
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

// Solo in dev locale — in produzione il worker usa GSHEET_URL come secret server-side
function parseCSV(text: string): CortoCorrente[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  return lines.slice(1).map((line) => {
    const fields: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        fields.push(cur.trim())
        cur = ''
      } else {
        cur += ch
      }
    }
    fields.push(cur.trim())

    const [id, edizione, classe, nome_progetto, trama, locandina_url, video_url, link_voto, attivo] = fields
    return {
      id: Number(id) || 0,
      edizione: edizione ?? '',
      classe: classe ?? '',
      nome_progetto: nome_progetto ?? '',
      trama: trama || null,
      locandina_url: locandina_url || null,
      video_url: video_url || null,
      link_voto: link_voto || null,
      attivo: ['TRUE', 'VERO', '1', 'YES', 'SÌ', 'SI'].includes((attivo ?? '').toUpperCase().trim()),
    }
  }).filter(r => r.attivo && r.nome_progetto)
}

async function fetchCorti(): Promise<CortoCorrente[]> {
  // Produzione: il worker Cloudflare nasconde l'URL del foglio
  if (!import.meta.env.DEV) {
    const res = await fetch('/api/corti')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json() as Promise<CortoCorrente[]>
  }

  // Dev locale: usa VITE_GSHEET_ID dall'env (non entra nel bundle di produzione)
  const sheetId = import.meta.env.VITE_GSHEET_ID as string | undefined
  if (!sheetId) return []

  const base = sheetId.startsWith('https://')
    ? sheetId
    : `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`

  const sep = base.includes('?') ? '&' : '?'
  const res = await fetch(`${base}${sep}t=${Math.floor(Date.now() / 60000)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  return parseCSV(await res.text())
}

export function useVotazioni() {
  return useQuery<CortoCorrente[]>({
    queryKey: ['corti_correnti'],
    queryFn: fetchCorti,
    staleTime: 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  })
}
