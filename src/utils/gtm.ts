export function loadGtm(
  gtmId: string,
  consent?: {
    analytics?: boolean
    ads?: boolean
    errorTracking?: boolean
  },
): void {
  if (document.getElementById('gtm-script')) return

  // 1. Always push default "denied" values BEFORE loading GTM
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'default_consent',
    default: {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_personalization: 'denied',
      ad_user_data: 'denied',
      security_storage: 'denied',
    },
  })

  // 2. Inject GTM script AFTER denying everything
  const script = document.createElement('script')
  script.id = 'gtm-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
  document.head.appendChild(script)

  // 3. Push actual user consent if provided
  if (consent) {
    window.dataLayer.push({
      event: 'default_consent',
      consent: {
        error_tracking: consent.errorTracking ? 'granted' : 'denied',
      },
    })

    window.gtag?.('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.analytics ? 'granted' : 'denied',
      security_storage: consent.errorTracking ? 'granted' : 'denied',
      error_tracking: consent.errorTracking ? 'granted' : 'denied',
      ad_personalization: consent.analytics ? 'granted' : 'denied',
      ad_user_data: consent.analytics ? 'granted' : 'denied',
    })
  }
}
