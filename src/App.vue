<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AppNavbar from './components/AppNavbar.vue'
import AlertMessage from './components/AlertMessage.vue'

const auth = useAuthStore()
auth.init()
</script>

<template>
  <div v-if="auth.user" class="app">
    <AppNavbar />
    <main class="main">
      <AlertMessage v-if="auth.flash" type="warning" closable :message="auth.flash" @close="auth.flash = ''" />
      <RouterView />
    </main>
  </div>
  <RouterView v-else />
</template>
