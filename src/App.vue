<script setup lang="ts">
import CookieConsent from './components/CookieConsent.vue'
</script>

<template>
  <header></header>

  <main>
    <h1>GDPR Consent PoC (Vue.js)</h1>
    <p>This page will only fire analytics tags after you accept the consent.</p>
    <button id="button">Click Me!</button>
  </main>

  <CookieConsent />
</template>

<style scoped>
main {
  text-align: center;
  padding-top: 50px;
}
</style>
