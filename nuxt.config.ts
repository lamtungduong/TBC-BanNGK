import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      /** URL public của Cloudflare Tunnel (server LAN). Ví dụ: https://tbc-fnb-lan.xxx.com */
      tunnelOrigin: ''
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

