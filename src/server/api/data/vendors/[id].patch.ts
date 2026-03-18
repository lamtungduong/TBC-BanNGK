import type { Vendor } from '../../../posData'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid vendor id'
    })
  }

  const body = await readBody<Partial<Vendor>>(event)
  const { query } = await import('../../../utils/db')

  const minOrderCases =
    body.minOrderCases != null
      ? Math.max(0, Math.floor(Number(body.minOrderCases) || 0))
      : null
  const leadTimeDays =
    body.leadTimeDays != null
      ? Math.max(0, Math.floor(Number(body.leadTimeDays) || 0))
      : null

  await query(
    `
    UPDATE vendors
    SET name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        note = COALESCE($4, note),
        min_order_cases = COALESCE($5, min_order_cases),
        lead_time_days = COALESCE($6, lead_time_days),
        is_hidden = COALESCE($7, is_hidden)
    WHERE id = $1
    `,
    [
      id,
      body.name ?? null,
      body.phone ?? null,
      body.note ?? null,
      minOrderCases,
      leadTimeDays,
      body.isHidden ?? null
    ]
  )

  return { ok: true }
})

