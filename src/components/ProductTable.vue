<script setup>
import { rupiah } from '../utils'
defineProps({ items: { type: Array, default: () => [] } })
const status = (s) => (s === 0 ? ['out', 'Habis'] : s <= 10 ? ['low', 'Menipis'] : ['ok', 'Tersedia'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Produk</th><th>Kategori</th><th class="right">Harga</th><th class="right">Stok</th><th>Status</th></tr></thead>
      <tbody>
        <tr v-for="p in items" :key="p.id">
          <td class="strong">{{ p.name }}</td>
          <td><span class="chip">{{ p.category }}</span></td>
          <td class="right">{{ rupiah(p.price) }}</td>
          <td class="right">{{ p.stock }}</td>
          <td><span :class="['badge', status(p.stock)[0]]">{{ status(p.stock)[1] }}</span></td>
        </tr>
        <tr v-if="!items.length"><td colspan="5" class="empty">Tidak ada produk yang cocok.</td></tr>
      </tbody>
    </table>
  </div>
</template>
