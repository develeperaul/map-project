import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      ymaps3: path.resolve(__dirname, './node_modules/@yandex/ymaps3-types')
    }
  }
})