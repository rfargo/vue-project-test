<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'

// Define the shape of our consent object
interface Consent {
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

const showBanner = ref(false)
const consent: Ref<Consent> = ref({
  analytics: false,
  ads: false,
  errorTracking: false,
})

/**
 * Applies the current consent state to Google Tag Manager.
 * This function will be called both for returning visitors and after a new choice is saved.
 */
function applyConsentToGTM(newConsent: Consent): void {
  if (typeof window.gtag === 'function') {
    // This is the essential part. It tells GTM the user's choice.
    window.gtag('consent', 'update', {
      analytics_storage: newConsent.analytics ? 'granted' : 'denied',
      ad_storage: newConsent.ads ? 'granted' : 'denied',
      security_storage: newConsent.errorTracking ? 'granted' : 'denied',
    })

    console.log('GTM consent updated!')

    // The dataLayer.push for a custom event is no longer needed to fire the GA4 tag.
    // GTM will automatically fire the queued tags after the 'consent update' command.
  }
}

/**
 * Saves the user's consent choices to localStorage and applies them.
 */
function saveConsent(): void {
  localStorage.setItem('cookie_consent', JSON.stringify(consent.value))
  showBanner.value = false // Hide the banner
  applyConsentToGTM(consent.value) // Apply the newly saved consent
}

/**
 * When the component mounts, check for a previously saved consent decision.
 */
onMounted(() => {
  const storedConsent = localStorage.getItem('cookie_consent')
  if (storedConsent) {
    // If a user has made a choice before, apply it immediately on page load
    const savedConsent: Consent = JSON.parse(storedConsent)
    consent.value = savedConsent
    applyConsentToGTM(savedConsent)
  } else {
    // If no choice has been made, show the banner
    showBanner.value = true
  }
})
</script>

<template>
  <div v-if="showBanner" class="cookie-banner">
    <p>We use cookies to improve your experience. Please set your preferences:</p>
    <div class="options">
      <label
        ><input type="checkbox" v-model="consent.analytics" /> Allow Analytics & Performance</label
      >
      <label><input type="checkbox" v-model="consent.ads" /> Allow Advertising</label>
      <label
        ><input type="checkbox" v-model="consent.errorTracking" /> Allow Security & Error
        Monitoring</label
      >
    </div>
    <div class="actions">
      <button @click="saveConsent">Save Preferences</button>
    </div>
  </div>
</template>

<style scoped>
/* Your existing styles are fine */
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
  color: black;
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
  color: black;
}
</style>
