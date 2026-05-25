import type { GalleryItem } from '@/components/Gallery'
import { galleryFestival } from '@/data/images'

export const festivalGalleryEvento: GalleryItem[] = galleryFestival

export const festivalGalleryBackstage: GalleryItem[] = [
  {
    type: 'video',
    src: '/images/placeholder-video.jpg',
    alt: 'Backstage evento Festival 16 gennaio 2026',
    videoId: 'L99jWvtMlk4',
    platform: 'youtube',
  },
  {
    type: 'video',
    src: '/images/placeholder-video.jpg',
    alt: 'Backstage evento Festival 1 giugno 2025',
    videoId: 'qdxMYBmbwmo',
    platform: 'youtube',
  },
  {
    type: 'video',
    src: '/images/placeholder-video.jpg',
    alt: 'Backstage evento Festival maggio 2024',
    videoId: 'mFnziK2l4Is',
    platform: 'youtube',
  },
  {
    type: 'video',
    src: '/images/placeholder-video.jpg',
    alt: 'Backstage evento Festival 16 dicembre 2023',
    videoId: 'lJ4pmY8rGKY',
    platform: 'youtube',
  },
]
