<script lang="ts" setup>
import { watch, computed, ref } from 'vue'
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } from '../lib/ymaps'
import { useMapStore } from '../stores/map'
import ProjectCard from './ProjectCard.vue'
import Marker from './Marker.vue'

const mapStore = useMapStore()

const duration = ref(800)

const displayedMarkers = computed(() => mapStore.mapMarkers)

function onMarkerClick(marker: MarkerType) {
  mapStore.selectMarker(marker)
}

// При смене видимых маркеров двигаем карту к их границам.
watch(() => mapStore.mapBounds, (bounds) => {
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
    <YMap :location="{ center: mapStore.mapCenter, zoom: mapStore.mapZoom, duration: duration }">
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

    <div class="absolute bottom-4 right-4 z-10">
      <ProjectCard v-if="mapStore.selectedMarker" />
    </div>
  </div>
</template>
