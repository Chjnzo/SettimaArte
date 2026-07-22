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

async function fetchCorti(): Promise<CortoCorrente[]> {
  const res = await fetch('/api/corti')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<CortoCorrente[]>
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
