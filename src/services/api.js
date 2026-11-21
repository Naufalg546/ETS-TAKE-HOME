// Mock REST API: meniru kontrak endpoint /api/v1/* di atas localStorage.
import { KEYS, read, write, ensureSeeded } from './storage'

const res = (status, data) => ({ status, data })
const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1

function login({ username, password }) {
  if (!username?.trim() || !password) {
    return res(400, { message: 'Username dan kata sandi wajib diisi' })
  }
  const user = read(KEYS.users).find((u) => u.username === username.trim() && u.password === password)
  if (!user) return res(401, { message: 'Username atau kata sandi salah' })
  const session = { id: user.id, username: user.username, name: user.name, role: user.role }
  write(KEYS.session, session)
  return res(200, { message: 'Login berhasil', data: session })
}

function validateProduct(b) {
  const errors = {}
  if (typeof b.name !== 'string' || !b.name.trim()) errors.name = 'Nama produk wajib diisi'
  if (!Number.isInteger(b.price) || b.price <= 0) errors.price = 'Harga harus berupa angka bulat lebih dari 0'
  if (!Number.isInteger(b.stock) || b.stock < 0) errors.stock = 'Stok harus berupa angka bulat 0 atau lebih'
  return errors
}

function createProduct(b, session) {
  if (session.role !== 'admin') return res(403, { message: 'Hanya Admin yang boleh menambah produk' })
  const errors = validateProduct(b)
  if (Object.keys(errors).length) return res(400, { message: 'Validasi gagal', errors })
  const products = read(KEYS.products)
  const product = {
    id: nextId(products),
    name: b.name.trim(),
    category: (b.category || 'Lainnya').trim(),
    price: b.price,
    stock: b.stock
  }
  products.push(product)
  write(KEYS.products, products)
  return res(201, { message: 'Produk berhasil disimpan', data: product })
}

function createTransaction(b, session) {
  if (session.role !== 'kasir') return res(403, { message: 'Hanya Kasir yang boleh membuat transaksi' })
  if (!Array.isArray(b.items) || b.items.length === 0) return res(400, { message: 'Keranjang masih kosong' })
  const products = read(KEYS.products)
  const lines = []
  for (const it of b.items) {
    const p = products.find((x) => x.id === it.product_id)
    if (!p) return res(400, { message: 'Produk tidak ditemukan' })
    if (!Number.isInteger(it.qty) || it.qty < 1) return res(400, { message: `Jumlah ${p.name} tidak valid` })
    if (it.qty > p.stock) return res(400, { message: `Stok ${p.name} tidak mencukupi (sisa ${p.stock})` })
    lines.push({ product_id: p.id, name: p.name, qty: it.qty, price: p.price })
  }
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0)
  if (!Number.isInteger(b.paid) || b.paid < total) return res(400, { message: 'Uang pembayaran kurang dari total' })
  lines.forEach((l) => { products.find((x) => x.id === l.product_id).stock -= l.qty })
  const transactions = read(KEYS.transactions)
  const id = nextId(transactions)
  const trx = {
    id, code: 'TRX-' + String(id).padStart(4, '0'), date: new Date().toISOString(),
    cashier_id: session.id, cashier_name: session.name,
    items: lines, total, paid: b.paid, change: b.paid - total
  }
  transactions.push(trx)
  write(KEYS.products, products)
  write(KEYS.transactions, transactions)
  return res(201, { message: 'Transaksi berhasil disimpan', data: trx })
}

export async function request(method, path, body = {}) {
  ensureSeeded()
  if (method === 'POST' && path === '/api/v1/auth/login') return login(body)
  if (method === 'POST' && path === '/api/v1/auth/logout') {
    localStorage.removeItem(KEYS.session)
    return res(200, { message: 'Logout berhasil' })
  }
  const session = read(KEYS.session)
  if (!session) return res(401, { message: 'Silakan login terlebih dahulu' })

  if (method === 'GET' && path === '/api/v1/products') return res(200, { data: read(KEYS.products) })
  if (method === 'POST' && path === '/api/v1/products') return createProduct(body, session)
  if (method === 'GET' && path === '/api/v1/transactions') {
    const all = read(KEYS.transactions)
    return res(200, { data: session.role === 'admin' ? all : all.filter((t) => t.cashier_id === session.id) })
  }
  if (method === 'POST' && path === '/api/v1/transactions') return createTransaction(body, session)
  return res(404, { message: 'Endpoint tidak ditemukan' })
}
