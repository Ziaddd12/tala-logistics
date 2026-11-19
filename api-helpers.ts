import { NextResponse } from 'next/server'
import { HttpError } from './auth'

export function ok(data: unknown = { ok: true }) {
  return NextResponse.json(data)
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function fail(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  console.error('API error:', error)
  const msg = error instanceof Error ? error.message : 'خطأ غير متوقع في الخادم'
  return NextResponse.json({ error: msg }, { status: 500 })
}

export function parseBody<T>(raw: unknown): T {
  return raw as T
}

export function qp(req: Request, key: string): string | null {
  return new URL(req.url).searchParams.get(key)
}
