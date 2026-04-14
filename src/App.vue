<script setup lang="ts">
import { onMounted } from 'vue'

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
  } catch (e) {
    console.warn('Sprite not loaded:', e)
  }
})
</script>

<template>
  <router-view />
</template>