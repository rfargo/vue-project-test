export function loadGtm(gtmId: string) {
  if (document.getElementById('gtm-script')) return

  const script = document.createElement('script')
  script.id = 'gtm-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: 'gtm.js', 'gtm.start': new Date().getTime() })
}
