<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProductStore } from '../stores/products'
import ProductTable from '../components/ProductTable.vue'
import ProductForm from '../components/ProductForm.vue'
import AlertMessage from '../components/AlertMessage.vue'
import AppIcon from '../components/AppIcon.vue'

const auth = useAuthStore()
const products = useProductStore()
const search = ref('')
const errors = ref({})
const message = ref('')
const messageType = ref('success')
const formRef = ref(null)

onMounted(() => products.init())

const filtered = computed(() =>
  products.items.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase()))
)

async function save(payload) {
  const r = await products.add(payload)
  errors.value = r.errors
  message.value = r.message
  messageType.value = r.ok ? 'success' : 'danger'
  if (r.ok) formRef.value?.reset()
}
</script>

<template>
  <div class="page-header">
    <div><h1>Katalog Produk</h1><p class="subtitle">{{ products.items.length }} produk terdaftar.</p></div>
  </div>
  <div :class="['grid', { split: auth.role === 'admin' }]">
    <div class="card">
      <div class="search"><AppIcon name="search" :size="18" /><input v-model="search" placeholder="Cari nama produk..." /></div>
      <ProductTable :items="filtered" />
    </div>
    <div class="card" v-if="auth.role === 'admin'">
      <div class="card-header"><h2>Tambah Produk Baru</h2></div>
      <AlertMessage v-if="message" :type="messageType" :message="message" />
      <ProductForm ref="formRef" :errors="errors" @submit="save" />
    </div>
  </div>
</template>
