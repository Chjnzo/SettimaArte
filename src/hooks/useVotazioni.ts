import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

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
  updated_at: string
}

async function fetchCorti(): Promise<CortoCorrente[]> {
  const { data, error } = await supabase
    .from('corti_correnti')
    .select('*')
    .eq('attivo', true)
    .order('classe')

  if (error) throw error
  return data ?? []
}

export function useVotazioni() {
  return useQuery<CortoCorrente[]>({
    queryKey: ['corti_correnti'],
    queryFn: fetchCorti,
    staleTime: 5 * 60 * 1000,
  })
}
