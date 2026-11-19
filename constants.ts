/** Shared domain constants: workflow, ports, doc types, checklists */

export const WORKFLOW_STEPS: Array<{ key: string; ar: string; en: string; color: string }> = [
  { key: 'RECEIVED_DOCS', ar: 'استلام المستندات', en: 'Docs Received', color: 'slate' },
  { key: 'ACI_REGISTERED', ar: 'تسجيل ACI', en: 'ACI Registered', color: 'violet' },
  { key: 'ARRIVED', ar: 'وصول الشحنة', en: 'Arrived', color: 'sky' },
  { key: 'DECLARATION_SUBMITTED', ar: 'تحرير البيان الجمركي', en: 'Declaration Submitted', color: 'cyan' },
  { key: 'INSPECTION', ar: 'الفحص والمعاينة', en: 'Inspection', color: 'amber' },
  { key: 'DUTIES_PAID', ar: 'سداد الرسوم', en: 'Duties Paid', color: 'lime' },
  { key: 'RELEASE', ar: 'صرف الشحنة', en: 'Released', color: 'emerald' },
  { key: 'DELIVERED', ar: 'تم التسليم', en: 'Delivered', color: 'teal' },
  { key: 'CLOSED', ar: 'إغلاق الملف', en: 'Closed', color: 'zinc' },
]

export const SHIPMENT_TYPES: Record<string, { ar: string; en: string }> = {
  IMPORT: { ar: 'استيراد', en: 'Import' },
  EXPORT: { ar: 'تصدير', en: 'Export' },
  TRANSIT: { ar: 'عبور', en: 'Transit' },
  TEMP_ADM: { ar: 'امتياز مؤقت', en: 'Temporary Admission' },
}

export const PRIORITY: Record<string, { ar: string; en: string; className: string }> = {
  LOW: { ar: 'منخفضة', en: 'Low', className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  NORMAL: { ar: 'عادية', en: 'Normal', className: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
  HIGH: { ar: 'مرتفعة', en: 'High', className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  URGENT: { ar: 'عاجلة', en: 'Urgent', className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
}

export const CONTAINER_SIZES = ['20FT', '40FT', '40HC', '45HC', 'LCL']

export const INCOTERMS = ['EXW', 'FOB', 'CFR', 'CIF', 'CIP', 'DAP', 'DDP']

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'KWD', 'CNY', 'TRY', 'JPY', 'EGP']

export const PAYMENT_METHODS: Record<string, { ar: string; en: string }> = {
  CASH: { ar: 'نقدي', en: 'Cash' },
  CHEQUE: { ar: 'شيك', en: 'Cheque' },
  BANK_TRANSFER: { ar: 'حوالة بنكية', en: 'Bank Transfer' },
  VODAFONE_CASH: { ar: 'محفظة إلكترونية', en: 'E-Wallet' },
}

export const DOC_TYPES: Array<{ key: string; ar: string; en: string }> = [
  { key: 'commercial_invoice', ar: 'الفاتورة التجارية', en: 'Commercial Invoice' },
  { key: 'packing_list', ar: 'قائمة التعبئة', en: 'Packing List' },
  { key: 'bl', ar: 'بوليصة الشحن', en: 'B/L' },
  { key: 'awb', ar: 'بوليصة الطيران', en: 'AWB' },
  { key: 'cert_origin', ar: 'شهادة المنشأ', en: 'Certificate of Origin' },
  { key: 'delivery_order', ar: 'أمر التسليم', en: 'Delivery Order' },
  { key: 'declaration', ar: 'البيان الجمركي', en: 'Customs Declaration' },
  { key: 'aci_number', ar: 'تسجيل ACI', en: 'ACI Registration' },
  { key: 'cert_conformity', ar: 'شهادة المطابقة', en: 'Conformity Certificate' },
  { key: 'insurance_cert', ar: 'شهادة التأمين', en: 'Insurance Certificate' },
  { key: 'import_card', ar: 'بطاقة الاستيراد', en: 'Import Card' },
  { key: 'poa', ar: 'الوكالة الجمركية', en: 'POA' },
  { key: 'receipt', ar: 'إيصال سداد', en: 'Payment Receipt' },
  { key: 'booking_confirm', ar: 'تأكيد الحجز', en: 'Booking Confirmation' },
  { key: 'export_declaration', ar: 'بيان التصدير', en: 'Export Declaration' },
  { key: 'transit_declaration', ar: 'بيان العبور', en: 'Transit Declaration' },
  { key: 'temp_adm_approval', ar: 'موافقة الامتياز المؤقت', en: 'Temporary Admission Approval' },
  { key: 'other', ar: 'أخرى', en: 'Other' },
]

export const DEFAULT_CHECKLIST: Record<string, string[]> = {
  IMPORT: ['commercial_invoice', 'packing_list', 'bl', 'cert_origin', 'aci_number', 'delivery_order', 'import_card', 'poa', 'insurance_cert', 'cert_conformity'],
  EXPORT: ['commercial_invoice', 'packing_list', 'booking_confirm', 'cert_origin', 'export_declaration', 'poa'],
  TRANSIT: ['commercial_invoice', 'packing_list', 'bl', 'transit_declaration', 'poa'],
  TEMP_ADM: ['commercial_invoice', 'packing_list', 'bl', 'temp_adm_approval', 'poa', 'insurance_cert'],
}

export const TEMPLATE_TYPES: Array<{ key: string; ar: string; en: string }> = [
  { key: 'LETTER', ar: 'خطاب رسمي', en: 'Letter' },
  { key: 'POA', ar: 'وكالة جمركية', en: 'POA' },
  { key: 'DELIVERY_ORDER', ar: 'أمر تسليم', en: 'Delivery Order' },
  { key: 'EMAIL', ar: 'إيميل', en: 'Email' },
  { key: 'WHATSAPP', ar: 'رسالة واتساب', en: 'WhatsApp' },
]

export const DEFAULT_PORTS = ['ميناء الإسكندرية', 'ميناء دمياط', 'ميناء بورسعيد البحري', 'ميناء بورسعيد الشرقي', 'ميناء السخنة (العين السخنة)', 'مطار القاهرة الدولي', 'مطار برج العرب', 'مطار سفينكس', 'ميناء نويبع', 'ميناء سفاجا', 'الجمرك الداخلي - 6 أكتوبر', 'الجمرك الداخلي - العاصمة الإدارية']

export const DEFAULT_FEES = ['أتعاب تخليص', 'أرضيات الميناء', 'مصاريف نقل داخلي', 'ديمورج انتظار حاويات', 'رسوم التحالف', 'رسوم الفحص والمعاينة', 'نوليون وأداء', 'رسوم بيانية', 'تأمين شحنة', 'صور ومصادقات']

export const TEMPLATE_VARIABLES = ['{client_name}', '{file_no}', '{vessel}', '{bl_number}', '{port}', '{tax_id}', '{import_card}', '{containers}', '{missing_docs}', '{time}', '{date}']
