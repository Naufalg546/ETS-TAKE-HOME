<script setup>
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '../stores/products'
import { useTransactionStore } from '../stores/transactions'
import CartPanel from '../components/CartPanel.vue'
import AlertMessage from '../components/AlertMessage.vue'
import AppIcon from '../components/AppIcon.vue'
import { rupiah } from '../utils'

const products = useProductStore()
const trx = useTransactionStore()
const search = ref('')
const category = ref('Semua')
const error = ref('')
const receipt = ref(null)

onMounted(() => products.init())
const categories = computed(() => ['Semua', ...new Set(products.items.map((p) => p.category))])
const filtered = computed(() =>
  products.items.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase()) &&
    (category.value === 'Semua' || p.category === category.value))
)

async function checkout(paid) {
  error.value = ''
  const r = await trx.checkout(paid)
  if (r.ok) receipt.value = r.data
  else error.value = r.message
}
</script>

<template>
  <div class="page-header"><div><h1>Transaksi Kasir</h1><p class="subtitle">Pilih produk, atur jumlah, lalu simpan transaksi.</p></div></div>
  <AlertMessage v-if="receipt" type="success" closable @close="receipt = null"
    :message="`${receipt.code} tersimpan. Total ${rupiah(receipt.total)}, kembalian ${rupiah(receipt.change)}.`" />
  <div class="grid split">
    <div class="card">
      <div class="search"><AppIcon name="search" :size="18" /><input v-model="search" placeholder="Cari produk..." /></div>
      <div class="chips">
        <button v-for="c in categories" :key="c" type="button" :class="['chip-btn', { active: category === c }]" @click="category = c">{{ c }}</button>
      </div>
      <div class="tiles">
        <div v-for="p in filtered" :key="p.id" class="tile">
          <span class="chip" style="align-self:flex-start">{{ p.category }}</span>
          <div class="tile-name">{{ p.name }}</div>
          <div class="tile-price">{{ rupiah(p.price) }}</div>
          <div class="muted">Stok: {{ p.stock }}</div>
          <button class="btn sm" :disabled="p.stock === 0" @click="trx.addToCart(p)">
            <AppIcon name="plus" :size="16" />{{ p.stock === 0 ? 'Habis' : 'Tambah' }}
          </button>
        </div>
      </div>
      <p v-if="!filtered.length" class="empty">Produk tidak ditemukan.</p>
    </div>
    <CartPanel :cart="trx.cart" :total="trx.total" :error="error"
      @set-qty="trx.setQty" @remove="trx.remove" @checkout="checkout" />
  </div>
</template>
