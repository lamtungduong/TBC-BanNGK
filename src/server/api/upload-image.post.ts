import { put } from '@vercel/blob'
import { promises as fs } from 'fs'
import { join } from 'path'

const IMAGES_DIR = join(process.cwd(), 'src', 'public', 'images')

export default defineEventHandler(async (event) => {
  const body = await readBody<{ fileName: string; dataUrl: string }>(event)

  const { fileName, dataUrl } = body
  if (!fileName || !dataUrl?.startsWith('data:')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  const base64 = dataUrl.split(',')[1]
  const buffer = Buffer.from(base64, 'base64')
  const safeName = fileName.replace(/[\\/:*?"<>|]/g, '_')

  // Trên Vercel: dùng Blob Storage (cần set BLOB_READ_WRITE_TOKEN trong Vercel Dashboard)
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token) {
    const blob = await put(safeName, buffer, {
      access: 'public',
      contentType: 'image/png'
    })
    return { fileName: safeName, url: blob.url }
  }

  // Local: ghi vào thư mục public/images
  await fs.mkdir(IMAGES_DIR, { recursive: true })
  const filePath = join(IMAGES_DIR, safeName)
  await fs.writeFile(filePath, buffer)
  return { fileName: safeName }
})
