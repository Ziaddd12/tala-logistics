/** Formatting helpers */

export function fmtMoney(n: number | null | undefined, currency = 'EGP', lang: 'ar' | 'en' = 'ar'): string {
  if (n === null || n === undefined || isNaN(n)) return '—'
  const v = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 }).format(n)
  const cur = currency === 'EGP' ? (lang === 'ar' ? 'ج.م' : 'EGP') : currency
  return lang === 'ar' ? `${v} ${cur}` : `${cur} ${v}`
}

export function fmtNum(n: number | null | undefined, lang: 'ar' | 'en' = 'ar', digits = 0): string {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: digits }).format(n)
}

export function fmtDate(d: string | Date | null | undefined, withTime = false): string {
  if (!d) return '—'
  const date = new Date(d)
  if (isNaN(date.getTime())) return '—'
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return withTime ? `${yyyy}/${mm}/${dd} ${hh}:${mi}` : `${yyyy}/${mm}/${dd}`
}

export function daysUntil(d: string | Date | null | undefined, now = new Date()): number | null {
  if (!d) return null
  const date = new Date(d)
  if (isNaN(date.getTime())) return null
  return Math.ceil((date.getTime() - now.getTime()) / 86400000)
}

export function daysSince(d: string | Date | null | undefined, now = new Date()): number | null {
  if (!d) return null
  const date = new Date(d)
  if (isNaN(date.getTime())) return null
  return Math.floor((now.getTime() - date.getTime()) / 86400000)
}

export function safeJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback
  try {
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}
