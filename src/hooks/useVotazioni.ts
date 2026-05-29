import { useQuery } from '@tanstack/react-query'

export interface CortoCorrente {
  id: number
  edizione: string
  classe: number
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
      classe: Number(classe) || 0,
      nome_progetto: nome_progetto ?? '',
      trama: trama || null,
      locandina_url: locandina_url || null,
      video_url: video_url || null,
      link_voto: link_voto || null,
      attivo: attivo?.toUpperCase() === 'TRUE',
    }
  }).filter(r => r.attivo && r.nome_progetto)
}

async function fetchCorti(): Promise<CortoCorrente[]> {
  const sheetId = import.meta.env.VITE_GSHEET_ID
  if (!sheetId) return []

  // Accetta sia l'URL completa pubblicata che il solo ID del foglio
  const url = sheetId.startsWith('https://')
    ? sheetId
    : `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Impossibile caricare i dati delle votazioni')

  const text = await res.text()
  return parseCSV(text)
}

export function useVotazioni() {
  return useQuery<CortoCorrente[]>({
    queryKey: ['corti_correnti'],
    queryFn: fetchCorti,
    staleTime: 5 * 60 * 1000,
  })
}
