import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      /** URL public của Cloudflare Tunnel (server LAN). Ví dụ: https://tbc-fnb-lan.xxx.com */
      tunnelOrigin: '',
      /** Build id thay đổi mỗi lần build/deploy — dùng để reset cookie trên client khi có bản cập nhật (trừ cookie đăng nhập admin). */
      buildId: process.env.BUILD_ID || String(Date.now())
    }
  },
  app: {
    head: {
      title: 'TBC - FnB',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  css: ['~/assets/main.css']
})

