import { ref, onMounted } from 'vue'

export function useSprite() {
  const isLoaded = ref(false)
  
  onMounted(async () => {
    try {
      const response = await fetch('/sprite.svg')
      const svg = await response.text()
      
      const parser = new DOMParser()
      const doc = parser.parseFromString(svg, 'image/svg+xml')
      const svgEl = doc.documentElement
      
      if (!document.getElementById('svg-sprite')) {
        svgEl.id = 'svg-sprite'
        svgEl.style.display = 'none'
        document.body.appendChild(svgEl)
      }
      
      isLoaded.value = true
    } catch (e) {
      console.warn('Sprite not loaded:', e)
    }
  })
  
  return { isLoaded }
}
