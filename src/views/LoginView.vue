<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AlertMessage from '../components/AlertMessage.vue'
import AppIcon from '../components/AppIcon.vue'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  const r = await auth.login(username.value, password.value)
  if (r.ok) router.push({ name: auth.home })
  else error.value = r.message
}
function fill(u, p) { username.value = u; password.value = p }
</script>

<template>
  <div class="login-wrap">
    <section class="login-hero">
      <div class="brand" style="padding:0"><span class="brand-logo"><AppIcon name="store" :size="20" /></span>KasirKu</div>
      <div>
        <h2>Kelola penjualan toko lebih cepat dan rapi.</h2>
        <p>Sistem kasir sederhana untuk mencatat transaksi, memantau stok, dan melihat omzet harian dalam satu tempat.</p>
        <ul class="hero-points">
          <li><AppIcon name="check" :size="18" />Transaksi kasir dengan hitung kembalian otomatis</li>
          <li><AppIcon name="check" :size="18" />Katalog produk dan peringatan stok menipis</li>
          <li><AppIcon name="check" :size="18" />Hak akses terpisah untuk Admin dan Kasir</li>
        </ul>
      </div>
      <p style="font-size:13px;opacity:.7">© 2026 KasirKu</p>
    </section>

    <section class="login-panel">
      <div class="login-form">
        <h1>Selamat datang</h1>
        <p class="subtitle" style="margin-bottom:22px">Masuk untuk melanjutkan ke dashboard.</p>
        <AlertMessage v-if="error" :message="error" />
        <form @submit.prevent="submit">
          <div class="field"><label for="u">Username</label><input id="u" v-model="username" autocomplete="username" placeholder="Masukkan username" /></div>
          <div class="field"><label for="p">Kata Sandi</label><input id="p" type="password" v-model="password" autocomplete="current-password" placeholder="Masukkan kata sandi" /></div>
          <button class="btn block" type="submit">Masuk</button>
        </form>
        <div class="demo">
          <div class="muted">Akun demo (klik untuk mengisi otomatis)</div>
          <div class="chips">
            <button type="button" class="chip-btn" @click="fill('admin', 'admin123')">admin / admin123</button>
            <button type="button" class="chip-btn" @click="fill('kasir', 'kasir123')">kasir / kasir123</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
