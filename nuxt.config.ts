import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { resolve } from "node:path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie")
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    "@hebilicious/authjs-nuxt",
  ],
  runtimeConfig: {
    authJs: {
      secret: process.env.AUTH_SECRET,
      guestRedirectTo: "/login",
    },
    public: {
      authJs: {
        guestRedirectTo: "/login",
        baseUrl: process.env.AUTH_URL, // The URL of your deployed app (used for origin Check in production)
        verifyClientOnEveryRequest: true // whether to hit the /auth/session endpoint on every client request
      }
    }
  },
  imports: {
    dirs: ["schemas"],
  },
  nitro: {
    imports: {
      dirs: ["server/schemas", "server/composables"],
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
