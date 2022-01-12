export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'cheto-web',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Electronica / Indie / Pop' },
      { name: 'format-detection', content: 'telephone=no' },
      // Facebook related tags
      { hid: 'og:title', name: 'og:title', content: 'Cheto - Web Oficial' },
      { hid: 'og:image', name: 'og:image', content: '/images/main-bg-1.jpg' },
      { hid: 'og:site_name', name: 'og:name', content: 'Cheto - Web Oficial' },
      { hid: 'og:description', name: 'og:description', content: 'Electronica / Indie / Pop' },
      // Twitter related tags
      { hid: 't-type', name: 'twitter:card', content: 'summary' },
      { hid: 't-type', name: 'twitter:site', content: 'www.chetomusica.com' },
      { hid: 't-type', name: 'twitter:creator', content: 'Cheto' },
      { hid: 't-type', name: 'twitter:player', content: 'https://open.spotify.com/embed/artist/3Zm7zIp9kIF6qvVCwXy6Gb' }

    ],
    script: [
      { hid: 'p5', src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/p5.min.js', defer: false },
      { hid: 'p5dom', src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.dom.min.js', defer: false },
      { hid: 'p5sound', src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.sound.min.js', defer: false }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/fonts/fontawesome-free-5.15.4-web/css/all.css'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/devices.js', mode: 'client' },
    { src: '~/plugins/random.js', mode: 'client' },
    { src: '~/node_modules/vanilla-tilt/dist/vanilla-tilt.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss'
  ],

  ssr: false,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxt/content'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  eslint: {
    fix: true
  }

  // router: {
  //   base: '/<repository-name>/'
  // }
}
