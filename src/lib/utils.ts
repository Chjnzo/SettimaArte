import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts a Google Drive sharing URL to a direct image URL.
// Supports both /file/d/ID/view and /open?id=ID formats.
// Returns the URL unchanged if it's not a Drive link.
export function driveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  const id = fileMatch?.[1] ?? openMatch?.[1]
  if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w800`
  return url
}
