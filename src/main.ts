import './assets/main.css'

import { createApp } from 'vue'
import { createGtm } from '@gtm-support/vue-gtm'
import { createPinia } from 'pinia'
import { loadGtm } from './utils/gtm'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// app.use(
//   createGtm({
//     id: import.meta.env.VITE_GAID, // Your GTM single container ID, array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryParams: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}], // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
//     // queryParams: {
//     //   // Add URL query string when loading gtm.js with GTM ID (required when using custom environments)
//     //   gtm_auth: 'AB7cDEf3GHIjkl-MnOP8qr',
//     //   gtm_preview: 'env-4',
//     //   gtm_cookies_win: 'x',
//     // },
//     // source: 'https://customurl.com/gtm.js', // Add your own serverside GTM script
//     defer: false, // Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible). Defaults to false, so the script is loaded `async` by default
//     compatibility: false, // Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`
//     // nonce: '2726c7f26c', // Will add `nonce` to the script tag
//     // enabled: !!consent.analytics, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
//     enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
//     debug: true, // Whether or not display console logs debugs (optional)
//     loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
//     vueRouter: router, // Pass the router instance to automatically sync with router (optional)
//     // ignoredViews: ['homepage'], // Don't trigger events for specified router names (optional)
//     trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
//   }),
// )

app.mount('#app')

const stored = localStorage.getItem('cookie_consent')
if (stored) {
  const consent = JSON.parse(stored)

  if (consent.analytics || consent.ads) {
    loadGtm(import.meta.env.VITE_GAID)

    window.dataLayer = window.dataLayer || []

    window.dataLayer.push({
      event: 'default_consent',
      consent: {
        error_tracking: consent.errorTracking ? 'granted' : 'denied',
      },
    })

    window.gtag?.('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.ads ? 'granted' : 'denied',
    })

    console.log(window.gtag)

    console.log('GTM consent updated:', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.ads ? 'granted' : 'denied',
      security_storage: consent.errorTracking ? 'granted' : 'denied',
    })
  }
}

// const storedConsent = localStorage.getItem('cookie_consent')
// console.log('storedConsent', storedConsent)
// if (storedConsent) {
//   const consent = JSON.parse(storedConsent)

//   console.log('consent', consent)

//   window.gtag?.('consent', 'update', {
//     analytics_storage: consent.analytics ? 'granted' : 'denied',
//     ad_storage: consent.ads ? 'granted' : 'denied',
//   })

//   console.log('window.gtag', window.gtag)

//   window.dataLayer = window.dataLayer || []
//   window.dataLayer.push({
//     event: 'default_consent',
//     consent: {
//       error_tracking: consent.errorTracking ? 'granted' : 'denied',
//     },
//   })
// }
