/**
 * Clean-start seed for Tala customs clearance app (شركة تلا)
 *
 * Creates ONLY:
 *  - the owner admin account (مدير النظام / admin@tala.local / 123456)
 *  - useful defaults: Egyptian customs ports, fee types, exchange rates,
 *    and ready-to-use letter/WhatsApp/email templates
 *
 * NO demo clients, shipments, staff accounts or documents — the owner adds
 * real data himself from the UI.
 *
 * Run: bun prisma/seed.ts   (wipes all existing data first)
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const pass = await bcrypt.hash('123456', 10)

  // ---- wipe everything for a clean start (children first) ----
  await db.auditLog.deleteMany()
  await db.documentVersion.deleteMany()
  await db.document.deleteMany()
  await db.checklistItem.deleteMany()
  await db.shipmentEvent.deleteMany()
  await db.container.deleteMany()
  await db.payment.deleteMany()
  await db.invoice.deleteMany()
  await db.quotation.deleteMany()
  await db.task.deleteMany()
  await db.shipment.deleteMany()
  await db.clientContact.deleteMany()
  await db.client.deleteMany()
  await db.hsCode.deleteMany()
  await db.exchangeRate.deleteMany()
  await db.template.deleteMany()
  await db.setting.deleteMany()
  await db.user.deleteMany()

  // ---- the owner account ----
  const admin = await db.user.create({
    data: { email: 'admin@tala.local', passwordHash: pass, name: 'مدير النظام', role: 'ADMIN' },
  })

  // ---- exchange rates (defaults — editable from Settings → أسعار الصرف) ----
  const rates: Array<[string, number]> = [
    ['USD', 48.5], ['EUR', 52.5], ['GBP', 61.0], ['SAR', 12.9], ['AED', 13.2],
    ['KWD', 158.0], ['CNY', 6.7], ['TRY', 1.4], ['JPY', 0.31], ['EGP', 1],
  ]
  for (const [currency, rate] of rates) {
    await db.exchangeRate.create({ data: { currency, rate, updatedById: admin.id } })
  }

  // ---- ready-to-use templates (no fake names inside) ----
  await db.template.create({ data: { name: 'خطاب متابعة مستندات ناقصة', type: 'LETTER', content: 'السادة / {client_name}\nتحية طيبة،\nبالإشارة إلى الملف الجمركي رقم {file_no} الخاص بالشحنة القادمة على الباخرة {vessel}، نود إحاطتكم بأن المستندات التالية لم يتم استلامها حتى الآن:\n- {missing_docs}\nنرجو التكرم بإرسالها في أقرب وقت لتجنب تراكم رسوم الانتظار بالأرصاد والتحالف.\nوتفضلوا بقبول فائق الاحترام،\nتلا للتخليص الجمركي' } })
  await db.template.create({ data: { name: 'وكالة جمركية محلية', type: 'POA', content: 'نحن {client_name} رقم ضريبي {tax_id} وبطاقة استيراد رقم {import_card}، نوكّل هنا شركة تلا للتخليص الجمركي في القيام بجميع أعمال التخليص الجمركي لدى المنافذ الجمركية المصرية بخصوص شحناتنا، وتحرير البيانات الجمركية وسداد الرسوم والمصاريف المتعلقة بها، وذلك لمدة سنة من تاريخه.' } })
  await db.template.create({ data: { name: 'أمر تسليم شحنة', type: 'DELIVERY_ORDER', content: 'أمر تسليم\nالملف رقم: {file_no}\nالعميل: {client_name}\nالباخرة: {vessel}\nالبوليصة: {bl_number}\nالحاويات: {containers}\nبموجب هذا الأمر يُسمح بمخالطة وتسليم الشحنة المذكورة أعلاه للعميل بعد استيفاء جميع الرسوم.' } })
  await db.template.create({ data: { name: 'رسالة واتساب - الشحنة وصلت', type: 'WHATSAPP', content: 'عميلنا العزيز {client_name}\nوصلت شحنتكم على ميناء {port} وتحت الملف رقم {file_no}.\nنرجو إرسال: الفاتورة التجارية، قائمة التعبئة، وبوليصة الشحن حتى نبدأ التخليص فوراً وتجنب رسوم الانتظار.\nشكراً لتعاملكم مع تلا.' } })
  await db.template.create({ data: { name: 'رسالة واتساب - جاهزة للتسليم', type: 'WHATSAPP', content: 'السادة / {client_name}\nتم صرف شحنتكم (الملف {file_no}) وجاهزة للتسليم اليوم من ساعة {time}.\nنرجو تأكيد عنوان التسليم ورقم الموظف المستلم.\nتلا للتخليص الجمركي — خدمة العملاء' } })
  await db.template.create({ data: { name: 'إيميل طلب مستندات شحنة قادمة', type: 'EMAIL', content: 'Subject: مستندات الشحنة القادمة — الملف {file_no}\n\nDear {client_name},\n\nPlease send the following documents for your upcoming shipment (Vessel: {vessel}, B/L: {bl_number}):\n- Commercial Invoice\n- Packing List\n- Certificate of Origin\n\nBest regards,\nTala Customs Clearance Team' } })

  // ---- settings ----
  // company: real name only — contact/tax details left empty for the owner to fill
  await db.setting.create({ data: { key: 'company', value: JSON.stringify({ name: 'تلا للتخليص الجمركي', nameEn: 'Tala Customs Clearance', phone: '', mobile: '', email: '', address: '', taxId: '', regNo: '', website: '' }) } })
  // real Egyptian customs ports — helpful defaults
  await db.setting.create({ data: { key: 'ports', value: JSON.stringify(['ميناء الإسكندرية', 'ميناء دمياط', 'ميناء بورسعيد البحري', 'ميناء بورسعيد الشرقي', 'ميناء السخنة (العين السخنة)', 'مطار القاهرة الدولي', 'مطار برج العرب', 'مطار سفينكس', 'ميناء نويبع', 'ميناء سفاجا', 'الجمرك الداخلي - 6 أكتوبر', 'الجمرك الداخلي - العاصمة الإدارية']) } })
  // common fee/service types
  await db.setting.create({ data: { key: 'feeTypes', value: JSON.stringify(['أتعاب تخليص', 'أرضيات الميناء', 'مصاريف نقل داخلي', 'ديمورج انتظار حاويات', 'رسوم التحالف', 'رسوم الفحص والمعاينة', 'نوليون وأداء', 'رسوم بيانية', 'تأمين شحنة', 'صور ومصادقات']) } })

  // ---- audit ----
  await db.auditLog.create({ data: { userId: admin.id, userName: admin.name, action: 'SYSTEM_INIT', entity: 'System', details: 'تهيئة النظام — بداية نظيفة بدون بيانات تجريبية' } })

  console.log('Clean seed completed:')
  console.log('  User: مدير النظام (admin@tala.local / 123456) — غيّر كلمة المرور من الإعدادات')
  console.log('  Defaults: ports, fee types, exchange rates, 6 templates')
  console.log('  Clients / shipments / HS codes: فارغة — تُضاف من الواجهة')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())
