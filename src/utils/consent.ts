interface ConsentOptions {
  analytics: boolean
  ads: boolean
  errorTracking: boolean
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function applyConsent(consent: ConsentOptions) {
  window.gtag?.('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.ads ? 'granted' : 'denied',
  })

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'default_consent',
    consent: {
      error_tracking: consent.errorTracking ? 'granted' : 'denied',
    },
  })
}
