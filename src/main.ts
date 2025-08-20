/* eslint-disable prefer-rest-params */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

window.gtag =
  window.gtag ||
  function () {
    Array.prototype.forEach.call(arguments, (arg) => window.dataLayer.push(arg))
  }

window.gtag('consent', 'default', {
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  ad_storage: 'denied',
  analytics_storage: 'denied',
  security_storage: 'denied',
  wait_for_update: 500,
})

// Push default denied consent before anything else
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

interface Consent {
  analytics?: boolean
  errorTracking?: boolean
  ads?: boolean
}

const stored = localStorage.getItem('cookie_consent')
let consent: Consent | null = null

if (stored) {
  try {
    consent = JSON.parse(stored)
  } catch {
    console.warn('Invalid consent JSON in localStorage')
  }
}

// Wait for gtag to be available before applying consent updates
const applyConsent = () => {
  if (typeof window.gtag === 'function' && consent) {
    window.gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.analytics ? 'granted' : 'denied',
      security_storage: consent.errorTracking ? 'granted' : 'denied',
      error_tracking: consent.errorTracking ? 'granted' : 'denied',
      ad_personalization: consent.analytics ? 'granted' : 'denied',
      ad_user_data: consent.analytics ? 'granted' : 'denied',
    })

    // Fire a manual page_view event to ensure GA starts after consent
    if (consent.analytics) {
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
      })
    }
  } else {
    setTimeout(applyConsent, 50)
  }
}

if (consent) {
  window.dataLayer.push({
    event: 'default_consent',
    consent: {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.analytics ? 'granted' : 'denied',
      security_storage: consent.errorTracking ? 'granted' : 'denied',
      error_tracking: consent.errorTracking ? 'granted' : 'denied',
      ad_personalization: consent.analytics ? 'granted' : 'denied',
      ad_user_data: consent.analytics ? 'granted' : 'denied',
    },
  })

  const script = document.createElement('script')
  script.id = 'gtm-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${import.meta.env.VITE_GAID}`
  document.head.appendChild(script)

  applyConsent()
}

// const stored = localStorage.getItem('cookie_consent')

// if (stored) {
//   const consent = JSON.parse(stored)
//   if (consent) {
//     window.dataLayer.push({
//       event: 'default_consent',
//       consent: {
//         error_tracking: consent.errorTracking ? 'granted' : 'denied',
//       },
//     })

//     window.gtag?.('consent', 'update', {
//       analytics_storage: consent.analytics ? 'denied' : 'denied',
//       ad_storage: consent.ads ? 'denied' : 'denied',
//       security_storage: consent.errorTracking ? 'denied' : 'denied',
//     })

//     const script = document.createElement('script')
//     script.id = 'gtm-script'
//     script.async = true
//     script.src = `https://www.googletagmanager.com/gtm.js?id=${import.meta.env.VITE_GAID}`
//     document.head.appendChild(script)

//     window.dataLayer = window.dataLayer || []
//     window.dataLayer.push({ event: 'gtm.js', 'gtm.start': new Date().getTime() })
//   }
// }

// const stored = localStorage.getItem('cookie_consent')
// if (stored) {
//   const consent = JSON.parse(stored)

//   if (consent.analytics || consent.ads || consent.errorTracking) {
//     // if (consent) {
//     //   console.log('User consent:', consent)
//     //   window.dataLayer.push({
//     //     event: 'default_consent',
//     //     // consent: {
//     //     //   analytics_storage: consent.analytics ? 'granted' : 'denied',
//     //     //   ad_storage: consent.ads ? 'granted' : 'denied',
//     //     //   security_storage: consent.errorTracking ? 'granted' : 'denied',
//     //     //   error_tracking: consent.errorTracking ? 'granted' : 'denied',
//     //     // },
//     //     consent: {
//     //       analytics_storage: 'granted',
//     //       ad_storage: 'granted',
//     //       security_storage: 'granted',
//     //       error_tracking: 'granted',
//     //     },
//     //   })

//     //   window.gtag?.('consent', 'update', {
//     //     analytics_storage: consent.analytics ? 'granted' : 'denied',
//     //     ad_storage: consent.ads ? 'granted' : 'denied',
//     //     security_storage: consent.errorTracking ? 'granted' : 'denied',
//     //   })
//     // }

//     // 2. Inject GTM script AFTER denying everything
//     const script = document.createElement('script')
//     script.id = 'gtm-script'
//     script.async = true
//     script.src = `https://www.googletagmanager.com/gtm.js?id=${import.meta.env.VITE_GAID}`
//     document.head.appendChild(script)

//     // loadGtm(import.meta.env.VITE_GAID, consent)
//   }
// }
