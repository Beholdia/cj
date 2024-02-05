import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import configs from './src/config.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: configs.baseUrl,
  build: {
    outDir: 'build',
    assetsDir: configs.assetsDir,
    sourcemap: false
  },
  server: {
    host: configs.host,
    port: configs.port,
    proxy: {
      '/api': {
        target: configs.apiHost,
        changeOrigin: true,
        rewrite: (url) => url.replace(/^\/api/, '')
      },
      '/sso': {
        target: configs.ssoHost,
        changeOrigin: true,
        rewrite: (url) => url.replace(/^\/sso/, '')
      }
    }
  }
})
