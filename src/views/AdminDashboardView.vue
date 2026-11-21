<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import { useTransactionStore } from '../stores/transactions'
import StatCard from '../components/StatCard.vue'
import { rupiah, tanggal } from '../utils'

const products = useProductStore()
const trx = useTransactionStore()
onMounted(async () => { await products.init(); await trx.fetch() })
</script>

<template>
  <div class="page-header"><div><h1>Dashboard Admin</h1><p class="subtitle">Pantau produk, stok, dan omzet seluruh kasir.</p></div></div>

  <div class="grid grid-4">
    <StatCard label="Total Produk" :value="products.items.length" icon="box" tone="primary" />
    <StatCard label="Stok Menipis (≤10)" :value="products.lowStock.length" icon="alert" tone="warning" />
    <StatCard label="Total Transaksi" :value="trx.list.length" icon="receipt" tone="success" />
    <StatCard label="Total Omzet" :value="rupiah(trx.revenue)" icon="wallet" tone="primary" />
  </div>

  <div class="grid split">
    <div class="card">
      <div class="card-header"><h2>Riwayat Transaksi</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Kode</th><th>Tanggal</th><th>Kasir</th><th class="right">Total</th></tr></thead>
          <tbody>
            <tr v-for="t in [...trx.list].reverse()" :key="t.id">
              <td class="strong">{{ t.code }}</td><td>{{ tanggal(t.date) }}</td><td>{{ t.cashier_name }}</td>
              <td class="right strong">{{ rupiah(t.total) }}</td>
            </tr>
            <tr v-if="!trx.list.length"><td colspan="4" class="empty">Belum ada transaksi.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h2>Stok Menipis</h2></div>
      <div v-for="p in products.lowStock" :key="p.id" class="list-item">
        <span>{{ p.name }}</span><span :class="['badge', p.stock === 0 ? 'out' : 'low']">Sisa {{ p.stock }}</span>
      </div>
      <p v-if="!products.lowStock.length" class="empty">Semua stok aman.</p>
    </div>
  </div>
</template>
