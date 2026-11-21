import { defineStore } from 'pinia'
import { request } from '../services/api'
import { ensureSeeded } from '../services/storage'

export const useProductStore = defineStore('products', {
  state: () => ({ items: [] }),
  getters: {
    lowStock: (s) => s.items.filter((p) => p.stock <= 10)
  },
  actions: {
    /** Inisialisasi: pastikan localStorage terisi seed (jika kosong), lalu muat ke state. */
    async init() {
      ensureSeeded()
      await this.fetch()
    },
    async fetch() {
      const r = await request('GET', '/api/v1/products')
      if (r.status === 200) this.items = r.data.data
    },
    async add(payload) {
      const r = await request('POST', '/api/v1/products', payload)
      if (r.status === 201) await this.fetch()
      return { ok: r.status === 201, status: r.status, message: r.data.message, errors: r.data.errors || {} }
    }
  }
})
