# KasirKu - Sistem Kasir (Vue.js 3 + Pinia + Vue Router)

## Menjalankan
```
npm install
npm run dev      # buka alamat yang tampil (mis. http://localhost:5173)
npm test         # jalankan 19 skenario uji (Vitest)
npm run build    # build produksi
```

## Akun demo
| Role  | Username | Password |
|-------|----------|----------|
| Admin | admin    | admin123 |
| Kasir | kasir    | kasir123 |

## Catatan
- Tidak ada backend: endpoint /api/v1/* dimock di `src/services/api.js` di atas localStorage.
- Data awal dari `src/data/seed.json`, disalin ke localStorage hanya jika masih kosong.
- Reset data: hapus key `pos_*` di DevTools > Application > Local Storage.
