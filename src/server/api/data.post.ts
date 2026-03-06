import type { PosData } from '../posData'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data: PosData = {
      products: Array.isArray(body?.products) ? body.products : [],
      sales: Array.isArray(body?.sales) ? body.sales : [],
      imports: Array.isArray(body?.imports) ? body.imports : []
    }
    const { saveFullPosData } = await import('../posData')
    await saveFullPosData(data)
    return data
  } catch (err) {
    console.error('[POST /api/data]', err)
    throw createError({
      statusCode: 500,
      statusMessage: err instanceof Error ? err.message : 'Failed to save data'
    })
  }
})
