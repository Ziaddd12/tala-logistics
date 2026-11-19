import { db } from './db'
import type { SessionUser } from './auth'

export async function logAudit(
  user: SessionUser | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
) {
  try {
    await db.auditLog.create({
      data: {
        userId: user?.id,
        userName: user?.name,
        action,
        entity,
        entityId,
        details: details?.slice(0, 500),
      },
    })
  } catch (e) {
    console.error('audit log failed', e)
  }
}
