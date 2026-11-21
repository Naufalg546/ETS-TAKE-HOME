import seed from '../data/seed.json'

export const KEYS = {
  users: 'pos_users',
  products: 'pos_products',
  transactions: 'pos_transactions',
  session: 'pos_session'
}

export function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : JSON.parse(raw)
  } catch {
    return null
  }
}

export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

/** Salin data dari seed.json ke localStorage HANYA jika key tersebut masih kosong. */
export function ensureSeeded() {
  for (const name of ['users', 'products', 'transactions']) {
    if (read(KEYS[name]) === null) {
      write(KEYS[name], JSON.parse(JSON.stringify(seed[name])))
    }
  }
}
