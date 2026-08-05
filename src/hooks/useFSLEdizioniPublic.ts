import { useQuery } from '@tanstack/react-query'
import { locandinePerEdizione } from '@/data/images'
import type { EdizioneFSL } from '@/data/images'

export function useFSLEdizioniPublic(): Record<string, EdizioneFSL[]> {
  const { data } = useQuery<Record<string, EdizioneFSL[]> | null>({
    queryKey: ['fsl-edizioni'],
    queryFn: async () => {
      const res = await fetch('/api/fsl-edizioni')
      if (!res.ok) return null
      return res.json() as Promise<Record<string, EdizioneFSL[]> | null>
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: locandinePerEdizione,
  })
  return data ?? locandinePerEdizione
}
