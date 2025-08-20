interface ConsentOptions {
  analytics: boolean
  ads: boolean
  errorTracking: boolean
}

// Augment the window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function applyConsent(consent: ConsentOptions) {
  window.gtag?.('consent', 'update', {
    // analytics_storage: consent.analytics ? 'granted' : 'denied',
    // ad_storage: consent.ads ? 'granted' : 'denied',
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.analytics ? 'granted' : 'denied',
    security_storage: consent.errorTracking ? 'granted' : 'denied',
    error_tracking: consent.errorTracking ? 'granted' : 'denied',
    ad_personalization: consent.analytics ? 'granted' : 'denied',
    ad_user_data: consent.analytics ? 'granted' : 'denied',
  })

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'default_consent',
    consent: {
      error_tracking: consent.errorTracking ? 'granted' : 'denied',
    },
  })
}
