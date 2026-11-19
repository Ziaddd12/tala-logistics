import { WORKFLOW_STEPS } from './constants'

export type DutyInput = {
  invoiceValue: number
  currency: string
  exchangeRate: number
  incoterm: string
  freight?: number // in shipment currency
  insurance?: number // in shipment currency
  dutyRate: number // %
  tableTaxRate: number // %
  vatRate: number // %
  otherFeeRate: number // %
  extraFees: number // fixed EGP (inspection, CAMC... entered manually)
}

export type DutyResult = {
  cif: number // EGP
  freightEgp: number
  insuranceEgp: number
  customsDuty: number
  tableTax: number
  vat: number
  otherFees: number
  extraFees: number
  totalTaxes: number
  totalEgp: number
  breakdown: Array<{ label: string; formula: string; value: number }>
}

const FEE_SCOPE = { EXW: 1, FOB: 1, CFR: 0.8, CIF: 0.8, CIP: 0.8, DAP: 0.8, DDP: 0.8 }

/** Egyptian-style import duty & tax calculation (demo rates; user editable) */
export function calculateDuties(input: DutyInput): DutyResult {
  const rate = input.exchangeRate > 0 ? input.exchangeRate : 1
  const invoiceEgp = (input.invoiceValue || 0) * rate
  const freightEgp = (input.freight || 0) * rate
  const insuranceEgp = (input.insurance || 0) * rate
  let cif = invoiceEgp
  const inc = (input.incoterm || 'FOB').toUpperCase()
  if (inc === 'FOB' || inc === 'EXW') cif = invoiceEgp + freightEgp + insuranceEgp
  else if (inc === 'CFR') cif = invoiceEgp + insuranceEgp
  else if (inc === 'CIF' || inc === 'CIP') cif = invoiceEgp // value already includes freight & insurance
  cif = Math.max(0, cif)

  const dutyBase = (FEE_SCOPE[inc as keyof typeof FEE_SCOPE] ?? 1) >= 1 ? cif : cif
  const customsDuty = round2((dutyBase * (input.dutyRate || 0)) / 100)
  const tableTax = round2(((cif + customsDuty) * (input.tableTaxRate || 0)) / 100)
  const vatBase = cif + customsDuty + tableTax
  const vat = round2((vatBase * (input.vatRate || 0)) / 100)
  const otherFees = round2((cif * (input.otherFeeRate || 0)) / 100)
  const extraFees = round2(input.extraFees || 0)
  const totalTaxes = round2(customsDuty + tableTax + vat + otherFees + extraFees)

  return {
    cif: round2(cif),
    freightEgp: round2(freightEgp),
    insuranceEgp: round2(insuranceEgp),
    customsDuty,
    tableTax,
    vat,
    otherFees,
    extraFees,
    totalTaxes,
    totalEgp: round2(cif + totalTaxes),
    breakdown: [
      { label: 'القيمة الجمركية CIF', formula: inc === 'FOB' ? '(الفاتورة + شحن + تأمين) × سعر الصرف' : 'قيمة الفاتورة × سعر الصرف', value: cif },
      { label: `الرسوم الجمركية (${input.dutyRate}%)`, formula: `CIF × ${input.dutyRate}%`, value: customsDuty },
      { label: `ضريبة الجدول (${input.tableTaxRate}%)`, formula: `(CIF + جمركي) × ${input.tableTaxRate}%`, value: tableTax },
      { label: `ض.ق.م (${input.vatRate}%)`, formula: `(CIF + جمركي + جدول) × ${input.vatRate}%`, value: vat },
      { label: `رسوم أخرى (${input.otherFeeRate}%)`, formula: `CIF × ${input.otherFeeRate}%`, value: otherFees },
      ...(extraFees > 0 ? [{ label: 'مصاريف يدوية', formula: 'مبلغ ثابت', value: extraFees }] : []),
    ],
  }
}

export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/** Free time countdown info from arrival + free days */
export function freeTimeInfo(arrival: Date | string | null | undefined, freeDays: number | null | undefined, now = new Date()) {
  if (!arrival || !freeDays) return null
  const end = new Date(new Date(arrival).getTime() + freeDays * 86400000)
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / 86400000)
  return { end, daysLeft, overdue: daysLeft < 0, warn: daysLeft >= 0 && daysLeft <= 3 }
}

export function stepInfo(stepKey: string, lang: 'ar' | 'en' = 'ar') {
  const idx = WORKFLOW_STEPS.findIndex((s) => s.key === stepKey)
  const step = WORKFLOW_STEPS[idx] || WORKFLOW_STEPS[0]
  return { idx, label: lang === 'en' ? step.en : step.ar, color: step.color, total: WORKFLOW_STEPS.length }
}
