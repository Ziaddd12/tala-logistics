import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from './db'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'tala-customs-secret-2026-change-me')
export const SESSION_COOKIE = 'tala_session'
export const SESSION_MAX_AGE = 60 * 60 * 12 // 12 hours absolute

export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
}

export async function signSession(user: SessionUser): Promise<string> {
  return await new SignJWT({ sub: user.id, email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SECRET)
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if (!payload.sub) return null
    return { id: payload.sub, email: String(payload.email || ''), name: String(payload.name || ''), role: String(payload.role || '') }
  } catch {
    return null
  }
}

/** Reads the session cookie and validates the user is still active in DB. Returns null when invalid. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const user = await verifySession(token)
  if (!user) return null
  const dbUser = await db.user.findUnique({ where: { id: user.id } })
  if (!dbUser || !dbUser.active) return null
  return { id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role }
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Guards an API route: returns the session user or throws HttpError(401/403). */
export async function requireUser(allowedRoles?: string[]): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) throw new HttpError(401, 'غير مصرح — سجل الدخول من جديد')
  if (allowedRoles && !allowedRoles.includes(user.role)) throw new HttpError(403, 'ليس لديك صلاحية لهذا الإجراء')
  return user
}

export async function setSessionCookie(token: string) {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // SameSite=None so the session also works when the app is embedded in an
    // HTTPS preview iframe (Lax cookies are dropped there). Secure is required
    // for None, and browsers treat localhost as trustworthy for it too.
    sameSite: 'none',
    secure: true,
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.set(SESSION_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' })
}
