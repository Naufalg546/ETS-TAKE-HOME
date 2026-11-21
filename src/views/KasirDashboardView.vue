<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useProductStore } from '../stores/products'
import { useTransactionStore } from '../stores/transactions'
import StatCard from '../components/StatCard.vue'
import AppIcon from '../components/AppIcon.vue'
import { rupiah } from '../utils'

const auth = useAuthStore()
const products = useProductStore()
const trx = useTransactionStore()
onMounted(async () => { await products.init(); await trx.fetch() })
</script>

<template>
  <div class="page-header"><div><h1>Dashboard Kasir</h1><p class="subtitle">Ringkasan aktivitas penjualan Anda.</p></div></div>

  <div class="banner">
    <div><h2>Halo, {{ auth.user.name }} </h2><p>Siap melayani pelanggan hari ini? Mulai transaksi baru dalam satu klik.</p></div>
    <RouterLink to="/kasir/transaksi" class="btn"><AppIcon name="plus" :size="18" />Transaksi Baru</RouterLink>
  </div>

  <div class="grid grid-4">
    <StatCard label="Jumlah Produk" :value="products.items.length" icon="box" tone="primary" />
    <StatCard label="Stok Menipis (≤10)" :value="products.lowStock.length" icon="alert" tone="warning" />
    <StatCard label="Transaksi Saya" :value="trx.list.length" icon="receipt" tone="success" />
    <StatCard label="Total Penjualan Saya" :value="rupiah(trx.revenue)" icon="wallet" tone="primary" />
  </div>

  <div class="card" v-if="products.lowStock.length">
    <div class="card-header"><h2>Perlu perhatian: stok menipis</h2></div>
    <div v-for="p in products.lowStock" :key="p.id" class="list-item">
      <span>{{ p.name }}</span><span :class="['badge', p.stock === 0 ? 'out' : 'low']">Sisa {{ p.stock }}</span>
    </div>
  </div>
</template>
