<script lang="ts" setup>
import { watch, computed, ref } from 'vue'
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } from '../lib/ymaps'
import { useMapStore } from '../stores/map'
import ProjectCard from './ProjectCard.vue'
import Marker from './Marker.vue'
import type { Marker as MarkerType } from '../data/mock'

const mapStore = useMapStore()

const duration = ref(800)

// Если есть поиск или выбрана категория, показываем уже отфильтрованный набор.
const displayedMarkers = computed(() => {
  if (mapStore.searchQuery || mapStore.category !== 'all') {
    return mapStore.filteredMarkers
  }
  return mapStore.allMarkers
})

// Подбираем центр и zoom так, чтобы все точки категории поместились в экран.
function calculateBounds(markers: MarkerType[]) {
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

  return {
    center: [centerLng, centerLat] as [number, number],
    zoom
  }
}

function onMarkerClick(marker: MarkerType) {
  mapStore.selectMarker(marker)
}

// При смене категории двигаем карту к ее границам.
watch(() => mapStore.category, (category) => {
  if (category !== 'all') {
    const bounds = calculateBounds(mapStore.filteredMarkers)
    if (bounds) {
      mapStore.mapCenter = bounds.center
      mapStore.mapZoom = bounds.zoom
    }
  }
})

// При выборе точки приближаем карту к ней.
watch(() => mapStore.selectedMarker, (marker) => {
  if (marker) {
    mapStore.mapCenter = marker.coordinates
    mapStore.mapZoom = 14
  }
})
</script>

<template>
  <div class="relative w-full h-full">
    <YMap :location="{ center: mapStore.mapCenter, zoom: mapStore.mapZoom, duration: duration }">
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      
      <YMapMarker 
        v-for="marker in displayedMarkers"
        :key="marker.id"
        :coordinates="marker.coordinates"
        @click="() => onMarkerClick(marker)"
      >
        <Marker 
          :category="marker.category"
          :state="mapStore.selectedMarker?.id === marker.id ? 'click' : 'default'"
          :active="mapStore.selectedMarker?.id === marker.id"
        />
      </YMapMarker>
    </YMap>

    <div class="absolute bottom-4 right-4 z-10">
      <ProjectCard v-if="mapStore.selectedMarker" />
    </div>
  </div>
</template>
