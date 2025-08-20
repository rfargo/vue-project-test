<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'

// Define a type for the possible consent statuses for better type safety.
type ConsentStatus = 'granted' | 'denied'

// To make TypeScript aware of gtag and dataLayer on the window object,
// we augment the global Window interface.
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>
    gtag: ((...args: unknown[]) => void) | undefined
  }
}

// Explicitly type the ref as a boolean.
const showBanner: Ref<boolean> = ref(false)
const CONSENT_KEY = 'cookie_consent'

/**
 * Handles the 'Accept' action.
 * The ': void' indicates that this function doesn't return a value.
 */
function handleAccept(): void {
  console.log('User Accepted Consent')

  // Now we can call gtag and dataLayer without casting to 'any'.
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
  })

  window.dataLayer.push({
    event: 'analytics_consent_granted',
  })

  // The 'granted' string now matches our ConsentStatus type.
  localStorage.setItem(CONSENT_KEY, 'granted' as ConsentStatus)
  showBanner.value = false
}

/**
 * Handles the 'Decline' action.
 */
function handleDecline(): void {
  console.log('User Declined Consent')

  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
  })

  localStorage.setItem(CONSENT_KEY, 'denied' as ConsentStatus)
  showBanner.value = false
}

onMounted(() => {
  const currentConsent = localStorage.getItem(CONSENT_KEY)

  if (!currentConsent) {
    showBanner.value = true
  } else if (currentConsent === 'granted') {
    handleAccept()
  }
})
</script>

<template>
  <div v-if="showBanner" id="consent-banner">
    <p>We use cookies to improve your experience. Do you accept our analytics tracking?</p>
    <div>
      <button @click="handleAccept" id="accept-btn">Accept</button>
      <button @click="handleDecline" id="decline-btn">Decline</button>
    </div>
  </div>
</template>

<style scoped>
#consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #222;
  color: white;
  padding: 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#consent-banner p {
  margin: 0 0 15px;
}

#consent-banner button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

#accept-btn {
  background: #4caf50;
  color: white;
}
#decline-btn {
  background: #f44336;
  color: white;
}
</style>
