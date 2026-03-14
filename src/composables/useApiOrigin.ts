/**
 * Khi truy cập từ domain Vercel (B), nếu có cấu hình tunnel và tunnel reachable,
 * mọi API và ảnh sẽ gửi sang server LAN (A) qua Cloudflare Tunnel — URL trình duyệt vẫn là (B).
 *
 * Cấu hình: trong nuxt.config hoặc env NUXT_PUBLIC_TUNNEL_ORIGIN = URL public của tunnel
 * (vd: https://tbc-fnb-lan.xxx.com hoặc URL do Cloudflare Tunnel cấp).
 */
const VERCEL_HOST = 'tbc-fnb.vercel.app'
const LAN_CHECK_TIMEOUT_MS = 4000

let lanCheckPromise: Promise<void> | null = null

export function useApiOrigin() {
  const config = useRuntimeConfig()
  const tunnelOrigin = (config.public?.tunnelOrigin as string) || ''
  const apiOrigin = useState<string>('api-origin', () => '')

  async function checkAndUseLanBackend() {
    if (import.meta.server) return
    if (!tunnelOrigin) return
    const host = typeof window !== 'undefined' ? window.location.hostname : ''
    if (host !== VERCEL_HOST) return

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), LAN_CHECK_TIMEOUT_MS)
      // no-cors: chỉ cần biết tunnel reachable, không cần đọc response (tránh lỗi CORS lúc ping)
      await fetch(tunnelOrigin, {
        mode: 'no-cors',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      apiOrigin.value = tunnelOrigin.replace(/\/$/, '')
    } catch {
      // Tunnel không reachable → giữ same-origin (Vercel)
    }
  }

  function ensureLanChecked(): Promise<void> {
    if (!lanCheckPromise) {
      lanCheckPromise = checkAndUseLanBackend()
    }
    return lanCheckPromise
  }

  function apiFetch<T = unknown>(
    path: string,
    options?: Record<string, any>
  ): Promise<T> {
    const base = apiOrigin.value
    return $fetch<T>(path, {
      ...options,
      baseURL: base || undefined
    })
  }

  /** Dùng cho img src (vd. /api/blob-image?url=...). */
  function getApiUrl(path: string): string {
    const base = apiOrigin.value
    const p = path.startsWith('/') ? path : `/${path}`
    return base ? `${base}${p}` : p
  }

  return {
    apiOrigin,
    ensureLanChecked,
    apiFetch,
    getApiUrl
  }
}
