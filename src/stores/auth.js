import { defineStore } from 'pinia'
import { request } from '../services/api'
import { KEYS, read, ensureSeeded } from '../services/storage'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, flash: '' }),
  getters: {
    role: (s) => s.user?.role ?? null,
    home() { return this.role === 'admin' ? 'admin' : this.role === 'kasir' ? 'kasir' : 'login' }
  },
  actions: {
    init() {
      ensureSeeded()
      this.user = read(KEYS.session)
    },
    async login(username, password) {
      const r = await request('POST', '/api/v1/auth/login', { username, password })
      if (r.status === 200) { this.user = r.data.data; return { ok: true } }
      return { ok: false, message: r.data.message }
    },
    async logout() {
      await request('POST', '/api/v1/auth/logout')
      this.user = null
    }
  }
})
