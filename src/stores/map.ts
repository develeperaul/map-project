import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchEventElementById, fetchProjectMarkers, fetchSportMarkers, fetchTravelMarkers, type EventElementDetails } from '../api/events'
import type { Category, Marker, Tag } from '../data/mock'
import { getMarkersByCategory } from '../data/mock'

export type MapBounds = [[number, number], [number, number]]

const MIN_AUTO_ZOOM = 3

export function calculateBounds(markers: Marker[]): { center: [number, number], zoom: number } | null {
  if (markers.length === 0) return null

  let minLng = Infinity, maxLng = -Infinity
  let minLat = Infinity, maxLat = -Infinity
  let coordinateCount = 0

  for (const marker of markers) {
    if (!marker.coordinates) continue
    const [lng, lat] = marker.coordinates
    coordinateCount += 1
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
  }

  if (coordinateCount === 0) return null

  const centerLng = (minLng + maxLng) / 2
  const centerLat = (minLat + maxLat) / 2

  if (coordinateCount === 1) {
    return {
      center: [centerLng, centerLat] as [number, number],
      zoom: 14,
    }
  }

  const lngDiff = maxLng - minLng
  const latDiff = maxLat - minLat

  let zoom = MIN_AUTO_ZOOM
  if (lngDiff < 0.01 && latDiff < 0.01) zoom = 14
  else if (lngDiff < 0.1 && latDiff < 0.1) zoom = 11
  else if (lngDiff < 1 && latDiff < 1) zoom = 9
  else if (lngDiff < 5 && latDiff < 5) zoom = 7
  else if (lngDiff < 15 && latDiff < 15) zoom = 5
  else zoom = MIN_AUTO_ZOOM

  return {
    center: [centerLng, centerLat] as [number, number],
    zoom,
  }
}

export function calculateBoundsFromMarkers(markers: Marker[], centerMarker?: Marker | null): MapBounds | null {
  const coordinates = markers
    .map(marker => marker.coordinates)
    .filter(Boolean) as [number, number][]

  if (coordinates.length < 2) return null

  const center = centerMarker?.coordinates || coordinates[0]
  let maxLngDiff = 0
  let maxLatDiff = 0

  for (const [lng, lat] of coordinates) {
    maxLngDiff = Math.max(maxLngDiff, Math.abs(lng - center[0]))
    maxLatDiff = Math.max(maxLatDiff, Math.abs(lat - center[1]))
  }

  const lngPadding = Math.max(maxLngDiff * 0.18, 0.01)
  const latPadding = Math.max(maxLatDiff * 0.18, 0.01)
  const lngRadius = maxLngDiff + lngPadding
  const latRadius = maxLatDiff + latPadding

  return [
    [center[0] - lngRadius, center[1] - latRadius],
    [center[0] + lngRadius, center[1] + latRadius],
  ]
}

function parseDate(dateStr: string): Date | null {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatDateRangePart(dateStr: string | null): string {
  if (!dateStr) return '...'

  const parsed = parseDate(dateStr)
  if (!parsed) return dateStr

  const day = parsed.getDate().toString().padStart(2, '0')
  const month = (parsed.getMonth() + 1).toString().padStart(2, '0')
  const year = parsed.getFullYear()

  return `${day}.${month}.${year}`
}

function normalizeFilterText(value: string) {
  return value.trim().toLowerCase()
}

function applyEventDetails(marker: Marker, id: string, details: EventElementDetails, distance: string): Marker {
  const nextTasks = marker.tasks?.map(task => applyEventDetails(task, id, details, distance))
  const hasTaskChanges = nextTasks !== undefined && marker.tasks !== undefined
    && nextTasks.some((task, index) => task !== marker.tasks![index])

  if (marker.id === id) {
    return {
      ...marker,
      description: details.description || marker.description,
      ...(distance ? { distance } : {}),
      ...(nextTasks ? { tasks: nextTasks } : {}),
    }
  }

  if (hasTaskChanges) {
    return {
      ...marker,
      tasks: nextTasks,
    }
  }

  return marker
}

function updateMarkerCollection(markers: Marker[] | null, id: string, details: EventElementDetails, distance: string): Marker[] | null {
  if (!markers) return markers

  let hasChanges = false
  const nextMarkers = markers.map((marker) => {
    const updated = applyEventDetails(marker, id, details, distance)
    if (updated !== marker) {
      hasChanges = true
    }
    return updated
  })

  return hasChanges ? nextMarkers : markers
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
  const cityFilter = ref<string[]>([])
  const sportTypeFilter = ref<string[]>([])
  const tagFilter = ref<string[]>([])

  const sportTypes = computed(() => (
    [...new Set(resolvedSportMarkers.value.flatMap(m => m.sportTypes || []))]
      .sort((a, b) => a.localeCompare(b, 'ru'))
  ))
  const projectMarkers = ref<Marker[] | null>(null)
  const isProjectsLoading = ref(false)
  const projectsError = ref<string | null>(null)
  const sportMarkers = ref<Marker[] | null>(null)
  const isSportLoading = ref(false)
  const sportError = ref<string | null>(null)
  const travelMarkers = ref<Marker[] | null>(null)
  const isTravelLoading = ref(false)
  const travelError = ref<string | null>(null)
  const eventElementDetails = ref<Record<string, EventElementDetails>>({})
  const loadingElementDetails = ref<Record<string, boolean>>({})
  const elementDetailsError = ref<string | null>(null)
  const focusedProjectTasks = ref<Marker[]>([])
  const focusedProjectSelectedTaskId = ref<string | null>(null)

  const resolvedProjectMarkers = computed(() => projectMarkers.value ?? getMarkersByCategory('projects'))
  const resolvedSportMarkers = computed(() => sportMarkers.value ?? getMarkersByCategory('sport'))
  const resolvedTravelMarkers = computed(() => travelMarkers.value ?? [])
  const selectedElementDetails = computed(() => {
    if (!selectedMarker.value) return null
    return eventElementDetails.value[selectedMarker.value.id] ?? null
  })
  const focusedProjectSelectedTask = computed(() => (
    focusedProjectTasks.value.find(task => task.id === focusedProjectSelectedTaskId.value) ?? null
  ))
  const focusedProjectCoordinateTasks = computed(() => (
    focusedProjectTasks.value.filter(task => task.coordinates)
  ))
  const focusedProjectBounds = computed(() => (
    calculateBoundsFromMarkers(focusedProjectCoordinateTasks.value, focusedProjectSelectedTask.value)
  ))

  const allMarkers = computed(() => [
    ...resolvedProjectMarkers.value,
    ...resolvedTravelMarkers.value,
    ...resolvedSportMarkers.value,
  ])

  const markers = computed(() => {
    if (category.value === 'projects') return resolvedProjectMarkers.value
    if (category.value === 'travel') return resolvedTravelMarkers.value
    if (category.value === 'sport') return resolvedSportMarkers.value
    if (category.value === 'all') return allMarkers.value
    return getMarkersByCategory(category.value as Category)
  })

  const locations = computed(() => (
    [...new Set(markers.value.map(marker => marker.city).filter(Boolean))]
      .sort((left, right) => left.localeCompare(right, 'ru'))
  ))

  const availableTags = computed(() => {
    const tagMap = new Map<string, Tag>()

    for (const marker of resolvedSportMarkers.value) {
      for (const tag of marker.tags || []) {
        const normalizedTitle = normalizeFilterText(tag.title)
        if (!tagMap.has(normalizedTitle)) {
          tagMap.set(normalizedTitle, { ...tag, title: tag.title.trim() })
        }
      }
    }

    return [...tagMap.values()].sort((left, right) => left.title.localeCompare(right.title, 'ru'))
  })

  const filteredMarkers = computed(() => {
    let result = category.value === 'all'
      ? [...allMarkers.value]
      : [...markers.value]

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

    if (cityFilter.value.length > 0) {
      result = result.filter(m => cityFilter.value.includes(m.city))
    }

    if (category.value === 'sport' && sportTypeFilter.value.length > 0) {
      result = result.filter(m => {
        const markerSportTypes = m.sportTypes || []
        return sportTypeFilter.value.some(s => markerSportTypes.includes(s))
      })
    }

    if (category.value === 'sport' && tagFilter.value.length > 0) {
      const selectedTags = new Set(tagFilter.value.map(normalizeFilterText))
      result = result.filter(m => {
        if (!m.tags) return false
        return m.tags.some(t => selectedTags.has(normalizeFilterText(t.title)))
      })
    }

    return result
  })

  const hasDateFilter = computed(() => !!dateRange.value.start || !!dateRange.value.end)
  const activeFilterCount = computed(() => (
    (hasDateFilter.value ? 1 : 0)
    + (cityFilter.value.length > 0 ? 1 : 0)
    + (sportTypeFilter.value.length > 0 ? 1 : 0)
    + (tagFilter.value.length > 0 ? 1 : 0)
  ))
  const dateRangeLabel = computed(() => {
    if (!hasDateFilter.value) return ''
    return `${formatDateRangePart(dateRange.value.start)}-${formatDateRangePart(dateRange.value.end)}`
  })

  const mapMarkers = computed(() => {
    if (focusedProjectTasks.value.length > 0) {
      return focusedProjectTasks.value
    }

    if (category.value === 'projects') {
      return filteredMarkers.value.flatMap(project => project.tasks || [])
    }

    if (category.value === 'all') {
      return filteredMarkers.value.flatMap(marker => {
        if (marker.category === 'projects') {
          return marker.tasks || []
        }

        return [marker]
      })
    }

    return filteredMarkers.value
  })

  const mapBounds = computed(() => {
    const markers = mapMarkers.value.filter(marker => marker.coordinates) as Marker[]
    if (markers.length === 0) {
      return { center: [37.6173, 55.7558] as [number, number], zoom: 3 }
    }
    return calculateBounds(markers) || { center: [37.6173, 55.7558] as [number, number], zoom: 3 }
  })

  function setCategory(cat: Category | 'all') {
    category.value = cat
    selectedMarker.value = null
    searchQuery.value = ''
    statusFilter.value = 'all'
    resetFilters()
    showFilterPanel.value = false
    clearProjectFocus()

    if (cat === 'projects') {
      void loadProjectMarkers()
    }

    if (cat === 'travel') {
      void loadTravelMarkers()
    }

    if (cat === 'sport') {
      void loadSportMarkers()
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setStatusFilter(filter: 'all' | 'active' | 'completed') {
    statusFilter.value = filter
  }

  function selectMarker(marker: Marker) {
    selectedMarker.value = marker

    if (marker.coordinates) {
      mapCenter.value = marker.coordinates
      mapZoom.value = 14
    }
    if (!marker.id.startsWith('section-')) {
      void loadEventElementDetails(marker.id)
    }
  }

  function clearSelection() {
    selectedMarker.value = null
    clearProjectFocus()
  }

  function toggleFilterPanel() {
    showFilterPanel.value = !showFilterPanel.value
  }

  function setDateRange(range: { start: string | null; end: string | null }) {
    dateRange.value = range
  }

  function clearDateRange() {
    dateRange.value = { start: null, end: null }
  }

  function setCityFilter(cities: string[]) {
    cityFilter.value = cities
  }

  function setSportTypeFilter(types: string[]) {
    sportTypeFilter.value = types
  }

  function setTagFilter(tags: string[]) {
    tagFilter.value = tags
  }

  function resetFilters() {
    dateRange.value = { start: null, end: null }
    cityFilter.value = []
    sportTypeFilter.value = []
    tagFilter.value = []
  }

  function applyFilters() {
    showFilterPanel.value = false
  }

  function focusProjectTasks(project: Marker, selectedTask?: Marker | null) {
    const tasks = project.tasks || []
    focusedProjectTasks.value = tasks
    focusedProjectSelectedTaskId.value = selectedTask?.id ?? null

    const selectedCoordinateTask = selectedTask?.coordinates
      ? selectedTask
      : tasks.find(task => task.coordinates)

    if (selectedCoordinateTask?.coordinates) {
      mapCenter.value = selectedCoordinateTask.coordinates
      if (focusedProjectCoordinateTasks.value.length < 2) {
        mapZoom.value = 14
      }
    }
  }

  function clearProjectFocus() {
    focusedProjectTasks.value = []
    focusedProjectSelectedTaskId.value = null
  }

  async function loadTravelMarkers() {
    if (travelMarkers.value !== null || isTravelLoading.value) return

    isTravelLoading.value = true
    travelError.value = null

    try {
      travelMarkers.value = await fetchTravelMarkers()
    } catch (error) {
      travelError.value = error instanceof Error ? error.message : 'Failed to load travel markers'
      travelMarkers.value = null
    } finally {
      isTravelLoading.value = false
    }
  }

  async function loadProjectMarkers() {
    if (projectMarkers.value !== null || isProjectsLoading.value) return

    isProjectsLoading.value = true
    projectsError.value = null

    try {
      projectMarkers.value = await fetchProjectMarkers()
    } catch (error) {
      projectsError.value = error instanceof Error ? error.message : 'Failed to load project markers'
      projectMarkers.value = null
    } finally {
      isProjectsLoading.value = false
    }
  }

  async function loadSportMarkers() {
    if (sportMarkers.value !== null || isSportLoading.value) return

    isSportLoading.value = true
    sportError.value = null

    try {
      sportMarkers.value = await fetchSportMarkers()
    } catch (error) {
      sportError.value = error instanceof Error ? error.message : 'Failed to load sport markers'
      sportMarkers.value = null
    } finally {
      isSportLoading.value = false
    }
  }

  async function loadAllCategoryMarkers() {
    await Promise.allSettled([
      loadProjectMarkers(),
      loadTravelMarkers(),
      loadSportMarkers(),
    ])
  }

  async function loadEventElementDetails(id: string | number) {
    const key = String(id)
    if (eventElementDetails.value[key] || loadingElementDetails.value[key]) return

    loadingElementDetails.value[key] = true
    elementDetailsError.value = null

    try {
      const details = await fetchEventElementById(key)
      eventElementDetails.value[key] = details
      const detailDistance = details.distance.trim()

      if (selectedMarker.value?.id === key && (details.description || detailDistance)) {
        const updatedMarker = {
          ...selectedMarker.value,
          description: details.description || selectedMarker.value.description,
          ...(detailDistance ? { distance: detailDistance } : {}),
        }

        selectedMarker.value = updatedMarker
      }

      projectMarkers.value = updateMarkerCollection(projectMarkers.value, key, details, detailDistance)
      sportMarkers.value = updateMarkerCollection(sportMarkers.value, key, details, detailDistance)
      travelMarkers.value = updateMarkerCollection(travelMarkers.value, key, details, detailDistance)
    } catch (error) {
      elementDetailsError.value = error instanceof Error ? error.message : 'Failed to load element details'
    } finally {
      loadingElementDetails.value[key] = false
    }
  }

  return {
    category,
    selectedMarker,
    markers,
    allMarkers,
    filteredMarkers,
    mapMarkers,
    searchQuery,
    statusFilter,
    mapCenter,
    mapZoom,
    mapBounds,
    showFilterPanel,
    dateRange,
    hasDateFilter,
    activeFilterCount,
    dateRangeLabel,
    cityFilter,
    sportTypeFilter,
    tagFilter,
    locations,
    sportTypes,
    availableTags,
    projectMarkers,
    isProjectsLoading,
    projectsError,
    sportMarkers,
    isSportLoading,
    sportError,
    travelMarkers,
    isTravelLoading,
    travelError,
    eventElementDetails,
    selectedElementDetails,
    loadingElementDetails,
    elementDetailsError,
    focusedProjectTasks,
    focusedProjectSelectedTaskId,
    focusedProjectSelectedTask,
    focusedProjectCoordinateTasks,
    focusedProjectBounds,
    setCategory,
    setSearchQuery,
    setStatusFilter,
    selectMarker,
    clearSelection,
    toggleFilterPanel,
    setDateRange,
    clearDateRange,
    setCityFilter,
    setSportTypeFilter,
    setTagFilter,
    resetFilters,
    applyFilters,
    focusProjectTasks,
    clearProjectFocus,
    loadAllCategoryMarkers,
    loadProjectMarkers,
    loadSportMarkers,
    loadTravelMarkers,
    loadEventElementDetails
  }
})
