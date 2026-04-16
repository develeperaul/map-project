import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, Marker, Tag } from '../data/mock'
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

  return {
    center: [centerLng, centerLat] as [number, number],
    zoom,
    duration: 800,
    easing: 'ease-in-out'
  }
}

function parseDate(dateStr: string): Date | null {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export const useMapStore = defineStore('map', () => {
  const category = ref<Category | 'all'>('all')
  const selectedMarker = ref<Marker | null>(null)
  const searchQuery = ref('')
  const statusFilter = ref<'all' | 'active' | 'completed'>('all')
  const mapCenter = ref<[number, number]>([37.6173, 55.7558])
  const mapZoom = ref(3)

  const showFilterPanel = ref(false)

  const dateRange = ref<{ start: string | null; end: string | null }>({ start: null, end: null })
  const cityFilter = ref<string | null>(null)
  const sportTypeFilter = ref<string[]>([])
  const tagFilter = ref<number[]>([])

  const locations = ref<string[]>([])
  const sportTypes = ref<string[]>([])
  const availableTags = ref<Tag[]>([])

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

    if (dateRange.value.start || dateRange.value.end) {
      result = result.filter(m => {
        const markerDate = parseDate(m.date)
        if (!markerDate) return true

        if (dateRange.value.start) {
          const start = parseDate(dateRange.value.start)
          if (start && markerDate < start) return false
        }

        if (dateRange.value.end) {
          const end = parseDate(dateRange.value.end)
          if (end && markerDate > end) return false
        }

        return true
      })
    }

    if (cityFilter.value) {
      result = result.filter(m => m.city === cityFilter.value)
    }

    if (category.value === 'sport' && sportTypeFilter.value.length > 0) {
      result = result.filter(m => {
        const markerSportTypes = (m as any).sportTypes || []
        return sportTypeFilter.value.some(s => markerSportTypes.includes(s))
      })
    }

    if (category.value === 'sport' && tagFilter.value.length > 0) {
      result = result.filter(m => {
        if (!m.tags) return false
        return m.tags.some(t => tagFilter.value.includes(t.id))
      })
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
    showFilterPanel.value = false
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

  function toggleFilterPanel() {
    showFilterPanel.value = !showFilterPanel.value
  }

  function setDateRange(range: { start: string | null; end: string | null }) {
    dateRange.value = range
  }

  function setCityFilter(city: string | null) {
    cityFilter.value = city
  }

  function setSportTypeFilter(types: string[]) {
    sportTypeFilter.value = types
  }

  function setTagFilter(tags: number[]) {
    tagFilter.value = tags
  }

  function resetFilters() {
    dateRange.value = { start: null, end: null }
    cityFilter.value = null
    sportTypeFilter.value = []
    tagFilter.value = []
  }

  function applyFilters() {
    showFilterPanel.value = false
  }

  async function fetchFilterOptions() {
    locations.value = ['Москва', 'Санкт-Петербург', 'Казань', 'Сочи', 'Екатеринбург']
    sportTypes.value = ['Бег', 'Велосипед', 'Плавание', 'Теннис', 'Тренажёрный зал']
    availableTags.value = [
      { id: 1, title: 'IT' },
      { id: 2, title: 'Конференция' },
      { id: 3, title: 'Выставка' },
      { id: 4, title: 'Митап' },
      { id: 5, title: 'Хакатон' }
    ]
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
    showFilterPanel,
    dateRange,
    cityFilter,
    sportTypeFilter,
    tagFilter,
    locations,
    sportTypes,
    availableTags,
    setCategory,
    setSearchQuery,
    setStatusFilter,
    selectMarker,
    clearSelection,
    toggleFilterPanel,
    setDateRange,
    setCityFilter,
    setSportTypeFilter,
    setTagFilter,
    resetFilters,
    applyFilters,
    fetchFilterOptions
  }
})