import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

const svgSpritePlugin = () => {
  return {
    name: 'svg-sprite',
    buildStart() {
      const iconsDir = path.resolve(__dirname, 'src/assets/icons')
      const spritePath = path.resolve(__dirname, 'public/sprite.svg')
      
      if (!fs.existsSync(iconsDir)) return
      
      const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'))
      const symbols: string[] = []
      
      for (const file of files) {
        const content = fs.readFileSync(path.join(iconsDir, file), 'utf-8')
        const name = file.replace('.svg', '')
        
        const viewBoxMatch = content.match(/viewBox="([^"]+)"/)
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'
        
        const paths = content.match(/<path[^>]*>/g)?.join('') || ''
        
        symbols.push(`<symbol id="${name}" viewBox="${viewBox}">${paths}</symbol>`)
      }
      
      if (symbols.length > 0) {
        const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join('\n')}\n</svg>`
        fs.writeFileSync(spritePath, sprite)
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), svgSpritePlugin()],
  test: {
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      ymaps3: path.resolve(__dirname, './node_modules/@yandex/ymaps3-types')
    }
  }
})
