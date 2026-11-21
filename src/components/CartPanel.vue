<script setup>
import { computed, ref } from 'vue'
import { rupiah } from '../utils'
import AppIcon from './AppIcon.vue'

const props = defineProps({ cart: Array, total: Number, error: String })
const emit = defineEmits(['set-qty', 'remove', 'checkout'])
const paid = ref('')
const change = computed(() => (paid.value === '' ? null : Number(paid.value) - props.total))
const quick = [20000, 50000, 100000]
</script>

<template>
  <div class="card cart">
    <div class="card-header"><h2>Keranjang</h2><span class="chip">{{ cart.length }} item</span></div>
    <p v-if="!cart.length" class="empty">Keranjang masih kosong.<br />Pilih produk di sebelah kiri.</p>
    <div v-for="i in cart" :key="i.product_id" class="cart-line">
      <div class="info">{{ i.name }}<div class="muted">{{ rupiah(i.price) }}</div></div>
      <div class="stepper">
        <button type="button" @click="emit('set-qty', i.product_id, Math.max(1, i.qty - 1))">−</button>
        <span>{{ i.qty }}</span>
        <button type="button" @click="emit('set-qty', i.product_id, i.qty + 1)">+</button>
      </div>
      <button type="button" class="btn danger-ghost" @click="emit('remove', i.product_id)" aria-label="Hapus"><AppIcon name="trash" :size="18" /></button>
    </div>

    <div class="total-box"><span>Total</span><span class="amount">{{ rupiah(total) }}</span></div>

    <div class="field">
      <label for="paid">Uang Bayar (Rp)</label>
      <input id="paid" type="number" v-model="paid" placeholder="0" />
    </div>
    <div class="quick-pay">
      <button type="button" class="btn secondary sm" :disabled="!total" @click="paid = String(total)">Uang pas</button>
      <button v-for="q in quick" :key="q" type="button" class="btn secondary sm" @click="paid = String(q)">{{ rupiah(q) }}</button>
    </div>
    <p v-if="change !== null && total" class="muted" style="margin-bottom:12px">
      Kembalian: <strong>{{ change >= 0 ? rupiah(change) : 'uang kurang ' + rupiah(-change) }}</strong>
    </p>
    <div class="alert danger" v-if="error">{{ error }}</div>
    <button class="btn success block" @click="emit('checkout', paid === '' ? NaN : Number(paid))">
      <AppIcon name="check" :size="18" />Simpan Transaksi
    </button>
  </div>
</template>
