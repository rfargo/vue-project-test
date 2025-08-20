<template>
  <div v-if="!consentSaved" class="cookie-banner">
    <p>We use cookies to improve your experience. Please set your preferences:</p>
    <div class="options">
      <label><input type="checkbox" v-model="consent.analytics" /> Allow Analytics</label>
      <label><input type="checkbox" v-model="consent.ads" /> Allow Ads</label>
      <label><input type="checkbox" v-model="consent.errorTracking" /> Allow Error Tracking</label>
    </div>
    <div class="actions">
      <button @click="saveConsent">Save Preferences</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Consent {
  analytics: boolean
  ads: boolean
  errorTracking: boolean
}

const consentSaved = ref(false)
const consent = ref<Consent>({
  analytics: false,
  ads: false,
  errorTracking: false,
})

onMounted(() => {
  const stored = localStorage.getItem('cookie_consent')
  if (stored) {
    consent.value = JSON.parse(stored)
    consentSaved.value = true
  }
})

function saveConsent() {
  localStorage.setItem('cookie_consent', JSON.stringify(consent.value))
  consentSaved.value = true

  // Apply to GTM
  window.gtag?.('consent', 'update', {
    analytics_storage: consent.value.analytics ? 'granted' : 'denied',
    ad_storage: consent.value.analytics ? 'granted' : 'denied',
    security_storage: consent.value.errorTracking ? 'granted' : 'denied',
    error_tracking: consent.value.errorTracking ? 'granted' : 'denied',
    ad_personalization: consent.value.analytics ? 'granted' : 'denied',
    ad_user_data: consent.value.analytics ? 'granted' : 'denied',
  })

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'default_consent',
    consent: {
      error_tracking: consent.value.errorTracking ? 'granted' : 'denied',
    },
  })

  location.reload()

  // window.dispatchEvent(new Event('cookie-consent-updated'))
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background-color: #f3f3f3;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
* {
  color: black;
}
</style>
