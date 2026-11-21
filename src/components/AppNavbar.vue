<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppIcon from './AppIcon.vue'

const auth = useAuthStore()
const router = useRouter()
const initial = computed(() => (auth.user?.name || '?').charAt(0).toUpperCase())

async function logout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand"><span class="brand-logo"><AppIcon name="store" :size="20" /></span>KasirKu</div>
    <div class="nav-label">Menu</div>
    <RouterLink v-if="auth.role === 'admin'" class="nav-link" to="/admin"><AppIcon name="dashboard" />Dashboard Admin</RouterLink>
    <RouterLink v-if="auth.role === 'kasir'" class="nav-link" to="/kasir"><AppIcon name="dashboard" />Dashboard Kasir</RouterLink>
    <RouterLink class="nav-link" to="/products"><AppIcon name="box" />Katalog Produk</RouterLink>
    <RouterLink v-if="auth.role === 'kasir'" class="nav-link" to="/kasir/transaksi"><AppIcon name="cart" />Transaksi</RouterLink>
    <div class="sidebar-spacer"></div>
    <div class="user-box">
      <div class="avatar">{{ initial }}</div>
      <div><div class="user-name">{{ auth.user.name }}</div><div class="user-role">{{ auth.role }}</div></div>
    </div>
    <button class="logout" @click="logout"><AppIcon name="logout" :size="17" />Keluar</button>
  </aside>
</template>
