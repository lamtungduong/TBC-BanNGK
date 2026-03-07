import { Readable } from 'node:stream'

/**
 * Proxy ảnh từ Vercel Blob private store.
 * URL private không mở trực tiếp trên browser, nên stream qua route này.
 */
export default defineEventHandler(async (event) => {
  const url = getQuery(event).url as string | undefined
  if (!url || !url.includes('blob.vercel-storage.com')) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid url' })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw createError({ statusCode: 503, statusMessage: 'Blob not configured' })
  }

  const { get } = await import('@vercel/blob')
  const result = await get(url, { access: 'private' })

  if (!result || result.statusCode !== 200) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }

  event.node.res.setHeader('Content-Type', result.blob.contentType || 'image/png')
  event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
  event.node.res.setHeader('Cache-Control', 'private, max-age=86400')

  const nodeStream = Readable.fromWeb(result.stream)
  return sendStream(event, nodeStream)
})
