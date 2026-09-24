export const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
export const container = { padding: '28px 24px', maxWidth: '560px' }
export const brand = { fontSize: '22px', fontWeight: 700, margin: '0 0 20px' }
export const green = { color: '#2f6b2f' }
export const orange = { color: '#e8782a' }
export const h1 = { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: '28px', color: '#1f3d1f', margin: '0 0 12px', fontWeight: 400 }
export const text = { fontSize: '15px', color: '#3d3d3d', lineHeight: '1.6', margin: '0 0 14px' }
export const small = { fontSize: '13px', color: '#777', lineHeight: '1.5', margin: '0 0 8px' }
export const box = { backgroundColor: '#f7f3ea', borderRadius: '12px', padding: '16px 18px', margin: '16px 0' }
export const row = { fontSize: '14px', color: '#333', margin: '0 0 6px' }
export const button = { backgroundColor: '#2f6b2f', color: '#ffffff', borderRadius: '999px', padding: '12px 22px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }
export const naira = (n?: number) => '₦' + Number(n ?? 0).toLocaleString('en-NG')
