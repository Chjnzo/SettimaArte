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

function parseCSV(text: string): CortoCorrente[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  return lines.slice(1).map((line) => {
    // Parse CSV with quoted fields
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
  const sheetId = import.meta.env.VITE_GSHEET_ID
  if (import.meta.env.DEV) console.log('[useVotazioni] VITE_GSHEET_ID:', sheetId)
  if (!sheetId) {
    if (import.meta.env.DEV) console.warn('[useVotazioni] VITE_GSHEET_ID non definito nel .env')
    return []
  }

  const base = sheetId.startsWith('https://')
    ? sheetId
    : `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`

  // Cache-busting per bypassare la cache di Google Sheets (può durare fino a 1h)
  const sep = base.includes('?') ? '&' : '?'
  const url = `${base}${sep}t=${Math.floor(Date.now() / 60000)}`

  if (import.meta.env.DEV) console.log('[useVotazioni] fetch URL:', url)

  try {
    const res = await fetch(url)
    if (!res.ok) {
      if (import.meta.env.DEV) console.error('[useVotazioni] fetch fallito:', res.status, res.statusText)
      throw new Error(`HTTP ${res.status}`)
    }
    const text = await res.text()
    const result = parseCSV(text)
    if (import.meta.env.DEV) {
      console.log('[useVotazioni] raw CSV (first 500 chars):', text.slice(0, 500))
      console.log('[useVotazioni] parsed corti:', result)
    }
    return result
  } catch (err) {
    if (import.meta.env.DEV) console.error('[useVotazioni] errore fetch:', err)
    throw err
  }
}

export function useVotazioni() {
  return useQuery<CortoCorrente[]>({
    queryKey: ['corti_correnti'],
    queryFn: fetchCorti,
    staleTime: 60 * 1000,
    retry: 1,
  })
}
