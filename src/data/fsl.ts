import type { GalleryItem } from '@/components/Gallery'
import { galleryFSLBackstage } from '@/data/images'

export interface FSLEdizione {
  anno: string
  label: string
  photos: GalleryItem[]
  videos: GalleryItem[]
}

export const fslBackstageMisto: GalleryItem[] = galleryFSLBackstage
