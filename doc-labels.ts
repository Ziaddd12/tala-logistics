/** Shared helper for Arabic doc-type labels on the server side */
const labels: Record<string, string> = {
  commercial_invoice: 'الفاتورة التجارية', packing_list: 'قائمة التعبئة', bl: 'بوليصة الشحن', awb: 'بوليصة الطيران', cert_origin: 'شهادة المنشأ', aci_number: 'تسجيل ACI', delivery_order: 'أمر التسليم', import_card: 'بطاقة الاستيراد', poa: 'الوكالة الجمركية', insurance_cert: 'شهادة التأمين', cert_conformity: 'شهادة المطابقة', booking_confirm: 'تأكيد الحجز', export_declaration: 'بيان التصدير', transit_declaration: 'بيان العبور', temp_adm_approval: 'موافقة الامتياز المؤقت', declaration: 'البيان الجمركي', receipt: 'إيصال سداد', other: 'أخرى',
}

export function docTypeLabel(key: string): string {
  return labels[key] || key
}
