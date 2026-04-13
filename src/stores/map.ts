import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, Marker } from '../data/mock'
import { getMarkersByCategory } from '../data/mock'

export const useMapStore = defineStore('map', () => {
  const category = ref<Category>('projects')
  const selectedMarker = ref<Marker | null>(null)
  const markers = computed(() => getMarkersByCategory(category.value))
  const mapCenter = ref<[number, number]>([37.6173, 55.7558])
  const mapZoom = ref(10)

  function setCategory(cat: Category) {
    category.value = cat
    selectedMarker.value = null
    
    const categoryCenters: Record<Category, [number, number]> = {
      projects: [37.6173, 55.7558],
      travel: [30, 50],
      sport: [37.6173, 55.7558]
    }
    mapCenter.value = categoryCenters[cat]
  }

  function selectMarker(marker: Marker) {
    selectedMarker.value = marker
    mapCenter.value = marker.coordinates
    mapZoom.value = 14
  }

  function clearSelection() {
    selectedMarker.value = null
  }

  return {
    category,
    selectedMarker,
    markers,
    mapCenter,
    mapZoom,
    setCategory,
    selectMarker,
    clearSelection
  }
})