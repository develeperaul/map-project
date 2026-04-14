import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Category, Marker } from '../data/mock'
import { getMarkersByCategory, mockMarkers } from '../data/mock'

const CARD_WIDTH = 204

function calculateBounds(markers: Marker[]): { center: [number, number], zoom: number } | null {
  if (markers.length === 0) return null

  let minLng = Infinity, maxLng = -Infinity
  let minLat = Infinity, maxLat = -Infinity

  for (const marker of markers) {
    const [lng, lat] = marker.coordinates
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
  }

  const centerLng = (minLng + maxLng) / 2
  const centerLat = (minLat + maxLat) / 2

  const lngDiff = maxLng - minLng
  const latDiff = maxLat - minLat

  let zoom = 2
  if (lngDiff < 0.01 && latDiff < 0.01) zoom = 14
  else if (lngDiff < 0.1 && latDiff < 0.1) zoom = 10
  else if (lngDiff < 1 && latDiff < 1) zoom = 8
  else if (lngDiff < 10 && latDiff < 10) zoom = 5
  else if (lngDiff < 30 && latDiff < 30) zoom = 3
  else if (lngDiff < 50 && latDiff < 50) zoom = 2
  else zoom = 1

  const offsetLng = CARD_WIDTH * 0.015
  const adjustedCenter = [centerLng - offsetLng, centerLat] as [number, number]

  return {
    center: [centerLng, centerLat] as [number, number],
    zoom,
    duration: 800,
    easing: 'ease-in-out'
  }
}

export const useMapStore = defineStore('map', () => {
  const category = ref<Category | 'all'>('all')
  const selectedMarker = ref<Marker | null>(null)
  const searchQuery = ref('')
  const statusFilter = ref<'all' | 'active' | 'completed'>('all')
  const mapCenter = ref<[number, number]>([37.6173, 55.7558])
  const mapZoom = ref(3)

  const allMarkers = computed(() => mockMarkers)

  const markers = computed(() => getMarkersByCategory(category.value as Category))

  const filteredMarkers = computed(() => {
    let result = category.value === 'all' 
      ? [...mockMarkers] 
      : getMarkersByCategory(category.value as Category)

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(m => m.title.toLowerCase().includes(query))
    }

    if (category.value === 'projects' && statusFilter.value !== 'all') {
      result = result.filter(m => m.status === statusFilter.value)
    }

    return result
  })

  const mapBounds = computed(() => {
    const markers = filteredMarkers.value
    if (markers.length === 0) {
      return { center: [37.6173, 55.7558] as [number, number], zoom: 3 }
    }
    return calculateBounds(markers) || { center: [37.6173, 55.7558] as [number, number], zoom: 3 }
  })

  function setCategory(cat: Category) {
    category.value = cat
    selectedMarker.value = null
    searchQuery.value = ''
    statusFilter.value = 'all'
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setStatusFilter(filter: 'all' | 'active' | 'completed') {
    statusFilter.value = filter
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
    allMarkers,
    filteredMarkers,
    searchQuery,
    statusFilter,
    mapCenter,
    mapZoom,
    mapBounds,
    setCategory,
    setSearchQuery,
    setStatusFilter,
    selectMarker,
    clearSelection
  }
})
