'use client'

import * as XLSX from 'xlsx'

export type ExportColumn = { header: string; key: string; width?: number }

export function exportToExcel(filename: string, sheetName: string, columns: ExportColumn[], rows: Array<Record<string, unknown>>) {
  const aoa: Array<Array<string | number>> = [columns.map((c) => c.header)]
  for (const r of rows) aoa.push(columns.map((c) => (r[c.key] === null || r[c.key] === undefined ? '' : (r[c.key] as string | number))))
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  ws['!cols'] = columns.map((c) => ({ wch: c.width || Math.max(10, c.header.length + 4) }))
  ws['!rtl'] = true
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31))
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/** Opens a styled print window (RTL) — user can save as PDF from the print dialog */
export function printHtml(title: string, bodyHtml: string) {
  const w = window.open('', '_blank', 'width=900,height=650')
  if (!w) return
  w.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${title}</title>
  <style>
    * { font-family: 'Cairo', 'Tajawal', 'Segoe UI', sans-serif; box-sizing: border-box; }
    body { margin: 0; padding: 32px 40px; color: #1a1a1a; }
    .doc-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0e6e5c; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { font-size: 34px; font-weight: 800; color: #0e6e5c; }
    .logo small { display: block; font-size: 11px; color: #666; font-weight: 400; }
    .doc-title { font-size: 22px; font-weight: 700; background: #0e6e5c; color: #fff; padding: 8px 24px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th { background: #eaf5f2; border: 1px solid #ccc; padding: 8px 10px; text-align: right; }
    td { border: 1px solid #ddd; padding: 7px 10px; text-align: right; }
    tfoot td { font-weight: 700; background: #f6f6f6; }
    .meta { display: flex; gap: 32px; margin: 12px 0; font-size: 13px; flex-wrap: wrap; }
    .meta b { color: #0e6e5c; }
    .signatures { display: flex; justify-content: space-between; margin-top: 64px; font-size: 13px; }
    .signatures div { border-top: 1px solid #999; padding-top: 6px; width: 200px; text-align: center; }
    .footer-note { margin-top: 40px; font-size: 11px; color: #888; text-align: center; border-top: 1px dashed #ccc; padding-top: 8px; }
    @media print { body { padding: 12px 24px; } }
  </style></head><body>${bodyHtml}
  <div class="footer-note">تم إنشاء هذه الوثيقة من نظام تلا للتخليص الجمركي — ${new Date().toLocaleString('ar-EG')}</div>
  </body></html>`)
  w.document.close()
  w.focus()
  setTimeout(() => {
    w.print()
  }, 350)
}
