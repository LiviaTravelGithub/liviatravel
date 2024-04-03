// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      title: 'Livia Travel Demo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Livia Travel Demo' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    }
  },
  modules: [
    'nuxt-primevue',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],
  googleFonts: {
    families: {
      Montserrat: [400, 700],
    },
  },
  css: ['primevue/resources/themes/aura-light-blue/theme.css', 'primeicons/primeicons.css', '~/assets/css/main.css'],
})
