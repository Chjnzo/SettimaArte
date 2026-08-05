declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  window.gtag?.('event', eventName, params)
}

export function trackCTA(label: string, page: string, destination?: string) {
  trackEvent('cta_click', { cta_label: label, page_location: page, destination: destination ?? '' })
}

export function trackScroll(depth: number, page: string) {
  trackEvent('scroll_depth', { depth_percentage: depth, page_location: page })
}
