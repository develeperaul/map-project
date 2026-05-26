<script lang="ts" setup>
import { watch, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } from '../lib/ymaps'
import { useMapStore } from '../stores/map'
import type { Marker as MarkerType } from '../data/mock'
import Marker from './Marker.vue'
import { resolveMapMargin } from './mapView.utils'

const mapStore = useMapStore()

const duration = ref(800)
const zoomRange = { min: 3, max: 19 }
const worldOptions = { cycledX: false, cycledY: false }
const mapEasing = 'ease-in-out' as const
const isMobile = ref(false)
const mobileQuery = '(max-width: 767px)'

const updateIsMobile = () => {
  if (typeof window === 'undefined') return
  isMobile.value = window.matchMedia(mobileQuery).matches
}

const displayedMarkers = computed(() => mapStore.mapMarkers)
const hasFocusedSelection = computed(() => (
  Boolean(mapStore.selectedMarker)
  || mapStore.focusedProjectTasks.length > 0
))
const mapMargin = computed(() => resolveMapMargin(isMobile.value, hasFocusedSelection.value))
const mapLocation = computed(() => {
  if (mapStore.selectedMarker?.coordinates) {
    return {
      center: mapStore.selectedMarker.coordinates,
      zoom: 14,
      duration: duration.value,
      easing: mapEasing,
    }
  }

  if (mapStore.focusedProjectBounds && mapStore.focusedProjectCoordinateTasks.length > 1) {
    return {
      bounds: mapStore.focusedProjectBounds,
      duration: duration.value,
      easing: mapEasing,
    }
  }

  const focusedTask = mapStore.focusedProjectSelectedTask
  if (focusedTask?.coordinates) {
    return {
      center: focusedTask.coordinates,
      zoom: 14,
      duration: duration.value,
      easing: mapEasing,
    }
  }

  return {
    center: mapStore.mapCenter,
    zoom: mapStore.mapZoom,
    duration: duration.value,
    easing: mapEasing,
  }
})

onMounted(() => {
  updateIsMobile()
  if (typeof window === 'undefined') return
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', updateIsMobile)
})

function onMarkerClick(marker: MarkerType) {
  if (mapStore.selectedMarker?.id === marker.id) {
    mapStore.clearSelection()
  }
  mapStore.selectMarker(marker)
}

// При смене видимых маркеров двигаем карту к их границам.
watch(() => mapStore.mapBounds, (bounds) => {
  if (mapStore.focusedProjectBounds) return
  if (mapStore.selectedMarker) return
  mapStore.mapCenter = bounds.center
  mapStore.mapZoom = bounds.zoom
}, { immediate: true, deep: true })

// При выборе точки приближаем карту к ней.
watch(() => mapStore.selectedMarker, (marker) => {
  if (marker) {
    if (marker.coordinates) {
      mapStore.mapCenter = marker.coordinates
      mapStore.mapZoom = 14
    }
  }
})
</script>

<template>
  <div class="relative w-full h-full">
    <YMap
      :location="mapLocation"
      :zoom-range="zoomRange"
      :margin="mapMargin"
      :world-options="worldOptions"
    >
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      
      <YMapMarker 
        v-for="marker in displayedMarkers"
        :key="marker.id"
        :coordinates="marker.coordinates || mapStore.mapCenter"
        @click="() => onMarkerClick(marker)"
      >
        <Marker 
          :category="marker.category"
          :state="mapStore.selectedMarker?.id === marker.id ? 'click' : 'default'"
          :active="mapStore.selectedMarker?.id === marker.id"
        />
      </YMapMarker>
    </YMap>

    <!-- <div class="absolute bottom-4 right-4 z-10">
      <ProjectCard v-if="mapStore.selectedMarker" />
    </div> -->
  </div>
</template>
