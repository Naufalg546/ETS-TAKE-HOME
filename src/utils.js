export const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')
export const tanggal = (iso) =>
  new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
