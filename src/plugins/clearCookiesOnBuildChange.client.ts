/**
 * Plugin chạy trên client: khi buildId thay đổi (web được deploy code mới) thì xóa toàn bộ
 * cookie trên máy client, TRỪ cookie đăng nhập admin (pos_root_access) để không yêu cầu nhập lại mật khẩu.
 * Chỉ khi mật khẩu trong code thay đổi thì cookie cũ không còn hợp lệ và user phải nhập lại.
 */

const ADMIN_ACCESS_COOKIE_NAME = 'pos_root_access'
const STORAGE_KEY_BUILD_ID = 'tbc_fnb_build_id'

function clearAllCookiesExceptAdmin(): void {
  if (typeof document === 'undefined' || !document.cookie) return
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const name = cookie.trim().split('=')[0]?.trim()
    if (!name || name === ADMIN_ACCESS_COOKIE_NAME) continue
    // Xóa cookie với path=/ (chuẩn của Nuxt useCookie)
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;max-age=0`
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const buildId = config.public.buildId as string
  if (!buildId) return

  const stored = localStorage.getItem(STORAGE_KEY_BUILD_ID)
  if (stored !== null && stored !== buildId) {
    clearAllCookiesExceptAdmin()
  }
  localStorage.setItem(STORAGE_KEY_BUILD_ID, buildId)
})
