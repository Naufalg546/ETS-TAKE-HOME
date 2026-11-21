import { defineStore } from 'pinia'
import { request } from '../services/api'
import { useProductStore } from './products'

export const useTransactionStore = defineStore('transactions', {
  state: () => ({ list: [], cart: [] }),
  getters: {
    total: (s) => s.cart.reduce((sum, i) => sum + i.qty * i.price, 0),
    revenue: (s) => s.list.reduce((sum, t) => sum + t.total, 0)
  },
  actions: {
    async fetch() {
      const r = await request('GET', '/api/v1/transactions')
      if (r.status === 200) this.list = r.data.data
    },
    addToCart(product) {
      const line = this.cart.find((i) => i.product_id === product.id)
      if (line) line.qty += 1
      else this.cart.push({ product_id: product.id, name: product.name, price: product.price, qty: 1 })
    },
    setQty(productId, qty) {
      const line = this.cart.find((i) => i.product_id === productId)
      if (line) line.qty = qty
    },
    remove(productId) {
      this.cart = this.cart.filter((i) => i.product_id !== productId)
    },
    async checkout(paid) {
      const items = this.cart.map((i) => ({ product_id: i.product_id, qty: i.qty }))
      const r = await request('POST', '/api/v1/transactions', { items, paid })
      if (r.status === 201) {
        this.cart = []
        await this.fetch()
        await useProductStore().fetch()
        return { ok: true, data: r.data.data }
      }
      return { ok: false, message: r.data.message }
    }
  }
})
