/**
 * CORS cho frontend Vercel gọi API qua Cloudflare Tunnel.
 * Trả lời OPTIONS (preflight) và gắn header CORS vào response.
 */
const ALLOW_ORIGIN = 'https://tbc-fnb.vercel.app'

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/')) return

  const setCorsHeaders = () => {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': ALLOW_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400'
    })
  }

  if (event.node.req.method === 'OPTIONS') {
    setCorsHeaders()
    setResponseStatus(event, 204)
    return null
  }

  setCorsHeaders()
})
