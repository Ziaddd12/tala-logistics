/* Tala static mode — Service Worker bridge
 * يعترض طلبات /api/* المباشرة (img src, a href, pdf.js) ويحيلها للصفحة
 * التي تنفذ قاعدة البيانات المحلية (IndexedDB) وتعيد النتيجة. */

const SCOPE_URL = new URL(self.registration.scope)
const API_PREFIX = SCOPE_URL.pathname.endsWith('/') ? SCOPE_URL.pathname : SCOPE_URL.pathname + '/'
const FULL_API_PREFIX = API_PREFIX + 'api/'

self.addEventListener('install', () => { self.skipWaiting() })
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()) })

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== SCOPE_URL.origin) return
  if (!url.pathname.startsWith(FULL_API_PREFIX)) return
  event.respondWith(handleApiRequest(event.request))
})

async function handleApiRequest(request) {
  const url = new URL(request.url)
  // المسار المنطقي: /api/... (بدون basePath)
  const logical = '/api/' + url.pathname.slice(FULL_API_PREFIX.length) + url.search

  let body = null
  try {
    const ct = request.headers.get('content-type') || ''
    if (ct.includes('multipart/form-data')) body = await request.formData()
    else if (ct.includes('application/json')) {
      const t = await request.text()
      body = t ? JSON.parse(t) : null
    } else if (request.method !== 'GET' && request.method !== 'HEAD') {
      const t = await request.text()
      body = t || null
    }
  } catch (e) { /* body اختياري */ }

  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const sorted = clients.slice().sort((a, b) => (b.focused ? 1 : 0) - (a.focused ? 1 : 0))
  if (!sorted.length) return jsonRes(503, { error: 'لا توجد نافذة مفتوحة لتنفيذ الطلب' })

  return new Promise((resolve) => {
    const ch = new MessageChannel()
    const timeout = setTimeout(() => resolve(jsonRes(503, { error: 'انتهت مهلة تنفيذ الطلب الداخلي' })), 60000)
    ch.port1.onmessage = (e) => {
      clearTimeout(timeout)
      const res = e.data || {}
      if (res.binary) {
        const h = { 'Content-Type': res.binary.mime || 'application/octet-stream' }
        if (res.binary.download) h['Content-Disposition'] = `attachment; filename*=UTF-8''${encodeURIComponent(res.binary.name || 'file')}`
        resolve(new Response(res.binary.data, { status: res.status || 200, headers: h }))
      } else {
        resolve(jsonRes(res.status || 200, res.data, res.headers || {}))
      }
    }
    sorted[0].postMessage({ id: Date.now() + Math.random(), method: request.method, path: logical, body }, [ch.port2])
  })
}

function jsonRes(status, data, extraHeaders) {
  const h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, extraHeaders || {})
  return new Response(JSON.stringify(data === undefined ? null : data), { status, headers: h })
}
