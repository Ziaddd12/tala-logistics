import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { ok, bad, fail, qp } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  try {
    await requireUser(['ADMIN', 'MANAGER', 'ACCOUNTANT'])
    const clientId = qp(req, 'clientId')
    const status = qp(req, 'status')
    const where: Record<string, unknown> = {}
    if (clientId) where.clientId = clientId
    if (status) where.status = status
    const quotations = await db.quotation.findMany({ where, include: { client: { select: { name: true } }, shipment: { select: { fileNo: true } } }, orderBy: { date: 'desc' } })
    return ok({ quotations })
  } catch (e) {
    return fail(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const me = await requireUser(['ADMIN', 'MANAGER', 'ACCOUNTANT'])
    const body = await req.json()
    if (!body.clientId || !Array.isArray(body.items)) return bad('بيانات ناقصة')
    const count = await db.quotation.count()
    const quotation = await db.quotation.create({
      data: {
        quotationNo: body.quotationNo || `Q-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`,
        clientId: body.clientId, shipmentId: body.shipmentId || null, date: new Date(),
        validUntil: body.validUntil ? new Date(body.validUntil) : new Date(Date.now() + 30 * 86400000),
        items: JSON.stringify(body.items), total: body.items.reduce((a: number, i: { total: number }) => a + (Number(i.total) || 0), 0),
        currency: body.currency || 'EGP', status: body.status || 'DRAFT', notes: body.notes || null,
      },
    })
    await logAudit(me, 'CREATE', 'Quotation', quotation.id, `عرض سعر ${quotation.quotationNo}`)
    return ok({ quotation })
  } catch (e) {
    return fail(e)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const me = await requireUser(['ADMIN', 'MANAGER', 'ACCOUNTANT'])
    const body = await req.json()
    const id = qp(req, 'id') || body.id
    if (!id) return bad('معرف مفقود')
    const data: Record<string, unknown> = {}
    if (body.status) data.status = body.status
    if (body.notes !== undefined) data.notes = body.notes
    if (Array.isArray(body.items)) {
      data.items = JSON.stringify(body.items)
      data.total = body.items.reduce((a: number, i: { total: number }) => a + (Number(i.total) || 0), 0)
    }
    const quotation = await db.quotation.update({ where: { id }, data })
    await logAudit(me, 'UPDATE', 'Quotation', id, `تعديل عرض سعر ${quotation.quotationNo} (${quotation.status})`)
    return ok({ quotation })
  } catch (e) {
    return fail(e)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const me = await requireUser(['ADMIN', 'MANAGER', 'ACCOUNTANT'])
    const id = qp(req, 'id')
    if (!id) return bad('معرف مفقود')
    await db.quotation.delete({ where: { id } })
    await logAudit(me, 'DELETE', 'Quotation', id, 'حذف عرض سعر')
    return ok()
  } catch (e) {
    return fail(e)
  }
}
