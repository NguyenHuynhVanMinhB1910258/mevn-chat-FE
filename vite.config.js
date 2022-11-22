import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // vue$: 'vue/dist/vue.runtime.esm.js'
    }
  },
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
    }
  },
  
})

// }
// const path = require('path')

// module.exports = {
//   chainWebpack: config => {
//     config.resolve.alias.set(
//       'vue$',
//       // If using the runtime only build
//       path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js')
//       // Or if using full build of Vue (runtime + compiler)
//       // path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js')
//     )
//   }