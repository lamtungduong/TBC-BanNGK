/**
 * Parse chuỗi timestamp từ API/DB (GMT+7 "YYYY-MM-DD HH:mm:ss" hoặc ISO) thành Date để so sánh/sắp xếp.
 * Đảm bảo giờ hiển thị trên web khớp với DB (GMT+7).
 */
export function parseTimestampAsGMT7(ts: string): Date {
  if (ts.includes('T') || ts.endsWith('Z') || /[-+]\d{2}:?\d{2}$/.test(ts)) {
    return new Date(ts)
  }
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(ts)) {
    return new Date(ts.replace(' ', 'T') + '+07:00')
  }
  return new Date(ts)
}
