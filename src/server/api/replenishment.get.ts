import { recommendReplenishment } from '../replenishment/recommend'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const horizonDays = q.horizonDays != null ? Number(q.horizonDays) : undefined
  const historyDays = q.historyDays != null ? Number(q.historyDays) : undefined
  const maxZeroDaysAllowed =
    q.maxZeroDaysAllowed != null ? Number(q.maxZeroDaysAllowed) : undefined
  const minVendorOrderCasesDefault =
    q.minVendorOrderCasesDefault != null ? Number(q.minVendorOrderCasesDefault) : undefined

  const { getPosData } = await import('../posData')
  const data = await getPosData()

  const result = recommendReplenishment(data, {
    horizonDays: Number.isFinite(horizonDays) ? horizonDays : undefined,
    historyDays: Number.isFinite(historyDays) ? historyDays : undefined,
    maxZeroDaysAllowed: Number.isFinite(maxZeroDaysAllowed)
      ? maxZeroDaysAllowed
      : undefined,
    minVendorOrderCasesDefault: Number.isFinite(minVendorOrderCasesDefault)
      ? minVendorOrderCasesDefault
      : undefined
  })

  return result
})

