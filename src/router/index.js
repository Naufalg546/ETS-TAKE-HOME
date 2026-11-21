import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const Blank = { render: () => null }

export const routes = [
  { path: '/', name: 'root', component: Blank },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { public: true } },
  { path: '/kasir', name: 'kasir', component: () => import('../views/KasirDashboardView.vue'), meta: { roles: ['kasir'] } },
  { path: '/kasir/transaksi', name: 'transaksi', component: () => import('../views/TransactionView.vue'), meta: { roles: ['kasir'] } },
  { path: '/products', name: 'products', component: () => import('../views/ProductsView.vue'), meta: { roles: ['admin', 'kasir'] } },
  { path: '/admin', name: 'admin', component: () => import('../views/AdminDashboardView.vue'), meta: { roles: ['admin'] } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export function createAppRouter(history = createWebHashHistory()) {
  const router = createRouter({ history, routes })

  router.beforeEach((to) => {
    const auth = useAuthStore()
    auth.init()

    if (to.name === 'root') return { name: auth.home }
    if (to.meta.public) return auth.user ? { name: auth.home } : true
    if (!auth.user) return { name: 'login' }

    const allowed = to.meta.roles
    if (allowed && !allowed.includes(auth.user.role)) {
      auth.flash = 'Anda tidak memiliki akses ke halaman tersebut.'
      return { name: auth.home }
    }
    return true
  })

  return router
}
