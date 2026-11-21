<script setup>
import { reactive } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({ errors: { type: Object, default: () => ({}) } })
const emit = defineEmits(['submit'])
const form = reactive({ name: '', category: '', price: '', stock: '' })

function submit() {
  emit('submit', {
    name: form.name,
    category: form.category,
    price: form.price === '' ? NaN : Number(form.price),
    stock: form.stock === '' ? NaN : Number(form.stock)
  })
}
function reset() { Object.assign(form, { name: '', category: '', price: '', stock: '' }) }
defineExpose({ reset })
</script>

<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label for="name">Nama Produk</label>
      <input id="name" v-model="form.name" placeholder="Contoh: Teh Botol 450 ml" />
      <div class="field-error" v-if="props.errors.name">{{ props.errors.name }}</div>
    </div>
    <div class="field">
      <label for="category">Kategori</label>
      <input id="category" v-model="form.category" placeholder="Sembako, Minuman, ..." />
    </div>
    <div class="row2">
      <div class="field">
        <label for="price">Harga (Rp)</label>
        <input id="price" type="number" v-model="form.price" placeholder="0" />
        <div class="field-error" v-if="props.errors.price">{{ props.errors.price }}</div>
      </div>
      <div class="field">
        <label for="stock">Stok</label>
        <input id="stock" type="number" v-model="form.stock" placeholder="0" />
        <div class="field-error" v-if="props.errors.stock">{{ props.errors.stock }}</div>
      </div>
    </div>
    <button class="btn block" type="submit"><AppIcon name="plus" :size="18" />Simpan Produk</button>
  </form>
</template>
