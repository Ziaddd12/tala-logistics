'use client'

import { toast } from 'sonner'

/** Auth endpoints where a 401 means "wrong credentials", not "expired session" */
const AUTH_PATHS = ['/api/auth/login', '/api/auth/logout']

function extractError(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'error' in data) {
    const msg = String((data as { error: unknown }).error)
    if (msg) return msg
  }
  return fallback
}

export async function api<T = unknown>(path: string, options?: RequestInit & { silent?: boolean }): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options?.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
    cache: 'no-store',
  })
  let data: unknown = null
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (res.status === 401) {
    // A 401 from the login call itself = wrong credentials — show the real
    // server message instead of the misleading "session expired" toast.
    if (AUTH_PATHS.some((p) => path.startsWith(p))) {
      const msg = extractError(data, 'بيانات الدخول غير صحيحة')
      if (!options?.silent) toast.error(msg)
      throw new Error(msg)
    }
    // Any other endpoint returning 401 while the app is open = session ended.
    window.dispatchEvent(new CustomEvent('tala:unauthorized'))
    throw new Error('unauthorized')
  }
  if (!res.ok) {
    const msg = extractError(data, 'حدث خطأ في الخادم')
    if (!options?.silent) toast.error(msg)
    throw new Error(msg)
  }
  return data as T
}

export const getJson = <T>(p: string, o?: RequestInit & { silent?: boolean }) => api<T>(p, o)
export const postJson = <T>(p: string, body: unknown) => api<T>(p, { method: 'POST', body: JSON.stringify(body) })
export const patchJson = <T>(p: string, body: unknown) => api<T>(p, { method: 'PATCH', body: JSON.stringify(body) })
export const delJson = <T>(p: string, body?: unknown) =>
  api<T>(p, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined })
