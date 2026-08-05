import { useQuery } from '@tanstack/react-query'
import type { GalleryItem } from '@/components/Gallery'

export type GallerySection = 'festival-evento' | 'festival-backstage' | 'fsl-backstage' | 'corto-backstage' | 'corto-locandine'

export function useGallerySection(section: GallerySection, staticDefault: GalleryItem[]): GalleryItem[] {
  const { data } = useQuery<GalleryItem[] | null>({
    queryKey: ['gallery', section],
    queryFn: async () => {
      const res = await fetch(`/api/gallery/${section}`)
      if (!res.ok) return null
      return res.json() as Promise<GalleryItem[] | null>
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: staticDefault,
  })
  return data ?? staticDefault
}
