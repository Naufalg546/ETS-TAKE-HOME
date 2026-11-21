import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../router'
import { useAuthStore } from '../stores/auth'
import { useProductStore } from '../stores/products'
import { useTransactionStore } from '../stores/transactions'
import { KEYS, read } from '../services/storage'
import seed from '../data/seed.json'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

const loginAs = async (u, p) => useAuthStore().login(u, p)
const validProduct = { name: 'Teh Botol', category: 'Minuman', price: 5000, stock: 10 }

describe('Login Sistem', () => {
  it('QA-01 login kasir valid dan diarahkan ke dashboard kasir', async () => {
    const router = createAppRouter(createMemoryHistory())
    const r = await loginAs('kasir', 'kasir123')
    await router.push('/')
    expect(r.ok).toBe(true)
    expect(useAuthStore().role).toBe('kasir')
    expect(router.currentRoute.value.path).toBe('/kasir')
  })
  it('QA-02 login dengan kata sandi salah ditolak', async () => {
    const r = await loginAs('kasir', 'salah')
    expect(r.ok).toBe(false)
    expect(r.message).toBe('Username atau kata sandi salah')
    expect(useAuthStore().user).toBeNull()
  })
  it('QA-03 login dengan input kosong ditolak', async () => {
    const r = await loginAs('', '')
    expect(r.ok).toBe(false)
    expect(r.message).toBe('Username dan kata sandi wajib diisi')
  })
})

describe('Proteksi Halaman (Vue Router)', () => {
  it('QA-04 kasir mengakses URL /admin ditolak dan dialihkan', async () => {
    const router = createAppRouter(createMemoryHistory())
    await loginAs('kasir', 'kasir123')
    await router.push('/admin')
    expect(router.currentRoute.value.path).toBe('/kasir')
    expect(useAuthStore().flash).toContain('tidak memiliki akses')
  })
  it('QA-05 admin mengakses URL /admin diizinkan', async () => {
    const router = createAppRouter(createMemoryHistory())
    await loginAs('admin', 'admin123')
    await router.push('/admin')
    expect(router.currentRoute.value.path).toBe('/admin')
  })
  it('QA-06 pengguna belum login mengakses /products dialihkan ke login', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/products')
    expect(router.currentRoute.value.path).toBe('/login')
  })
})

describe('Input Produk', () => {
  it('QA-07 admin menyimpan produk dengan data valid', async () => {
    await loginAs('admin', 'admin123')
    const store = useProductStore()
    await store.init()
    const r = await store.add(validProduct)
    expect(r.ok).toBe(true)
    expect(r.status).toBe(201)
    expect(store.items.length).toBe(seed.products.length + 1)
  })
  it('QA-08 produk dengan harga bernilai nol ditolak', async () => {
    await loginAs('admin', 'admin123')
    const store = useProductStore()
    await store.init()
    const r = await store.add({ ...validProduct, price: 0 })
    expect(r.ok).toBe(false)
    expect(r.status).toBe(400)
    expect(r.errors.price).toBeTruthy()
    expect(store.items.length).toBe(seed.products.length)
  })
  it('QA-09 produk dengan nama kosong ditolak', async () => {
    await loginAs('admin', 'admin123')
    const store = useProductStore()
    await store.init()
    const r = await store.add({ ...validProduct, name: '   ' })
    expect(r.ok).toBe(false)
    expect(r.errors.name).toBeTruthy()
  })
  it('QA-10 produk dengan harga batas minimum (1) diterima', async () => {
    await loginAs('admin', 'admin123')
    const store = useProductStore()
    await store.init()
    const r = await store.add({ ...validProduct, price: 1, stock: 0 })
    expect(r.ok).toBe(true)
  })
  it('QA-11 kasir mencoba menambah produk ditolak (403)', async () => {
    await loginAs('kasir', 'kasir123')
    const store = useProductStore()
    await store.init()
    const r = await store.add(validProduct)
    expect(r.ok).toBe(false)
    expect(r.status).toBe(403)
  })
})

async function kasirWithCart(productId, qty) {
  await loginAs('kasir', 'kasir123')
  await useProductStore().init()
  const trx = useTransactionStore()
  const p = useProductStore().items.find((x) => x.id === productId)
  trx.addToCart(p)
  trx.setQty(productId, qty)
  return trx
}

describe('Transaksi Kasir', () => {
  it('QA-12 transaksi valid: stok berkurang dan kembalian benar', async () => {
    const trx = await kasirWithCart(5, 4) // Mie 3.500 x 4 = 14.000
    const r = await trx.checkout(20000)
    expect(r.ok).toBe(true)
    expect(r.data.total).toBe(14000)
    expect(r.data.change).toBe(6000)
    expect(useProductStore().items.find((p) => p.id === 5).stock).toBe(196)
  })
  it('QA-13 transaksi dengan keranjang kosong ditolak', async () => {
    await loginAs('kasir', 'kasir123')
    const r = await useTransactionStore().checkout(10000)
    expect(r.ok).toBe(false)
    expect(r.message).toBe('Keranjang masih kosong')
  })
  it('QA-14 jumlah beli sama dengan stok (batas) diterima', async () => {
    const trx = await kasirWithCart(8, 5) // stok sabun = 5
    const r = await trx.checkout(22500)
    expect(r.ok).toBe(true)
    expect(useProductStore().items.find((p) => p.id === 8).stock).toBe(0)
  })
  it('QA-15 jumlah beli melebihi stok (stok + 1) ditolak', async () => {
    const trx = await kasirWithCart(8, 6)
    const r = await trx.checkout(100000)
    expect(r.ok).toBe(false)
    expect(r.message).toContain('Stok')
    expect(useProductStore().items.find((p) => p.id === 8).stock).toBe(5)
  })
  it('QA-16 uang pembayaran kurang dari total ditolak', async () => {
    const trx = await kasirWithCart(5, 4)
    const r = await trx.checkout(13999)
    expect(r.ok).toBe(false)
    expect(r.message).toBe('Uang pembayaran kurang dari total')
  })
})

describe('Persistensi Seed dan localStorage', () => {
  it('QA-17 data seed dimuat ke localStorage saat penyimpanan masih kosong', async () => {
    expect(localStorage.getItem(KEYS.products)).toBeNull()
    await loginAs('admin', 'admin123')
    await useProductStore().init()
    expect(read(KEYS.products).length).toBe(seed.products.length)
    expect(read(KEYS.users).length).toBe(seed.users.length)
  })
  it('QA-18 transaksi baru tetap ada setelah reload (store dibuat ulang)', async () => {
    const trx = await kasirWithCart(5, 2)
    await trx.checkout(10000)
    setActivePinia(createPinia()) // simulasi reload browser: state Pinia hilang, localStorage tetap
    const fresh = useTransactionStore()
    await useAuthStore().init()
    await fresh.fetch()
    expect(fresh.list.length).toBe(seed.transactions.length + 1)
  })
  it('QA-19 seed tidak menimpa data yang sudah ada saat inisialisasi ulang', async () => {
    await loginAs('admin', 'admin123')
    const store = useProductStore()
    await store.init()
    await store.add(validProduct)
    setActivePinia(createPinia())
    const reloaded = useProductStore()
    await reloaded.init()
    expect(reloaded.items.some((p) => p.name === 'Teh Botol')).toBe(true)
    expect(reloaded.items.length).toBe(seed.products.length + 1)
  })
})
