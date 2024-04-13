import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VFab } from 'vuetify/labs/VFab'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'dark'
    },
    components: {
      VFab
    }
  })
  app.vueApp.use(vuetify)
})
