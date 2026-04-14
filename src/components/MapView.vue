<script lang="ts" setup>
import { watch, computed } from 'vue'
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } from '../lib/ymaps'
import { useMapStore } from '../stores/map'
import Marker from './Marker.vue'
import type { Marker as MarkerType } from '../data/mock'

const mapStore = useMapStore()

const displayedMarkers = computed(() => {
  if (mapStore.searchQuery || mapStore.category !== 'all') {
    return mapStore.filteredMarkers
  }
  return mapStore.allMarkers
})

const mapLocation = computed(() => {
  return mapStore.mapBounds
})

function onMarkerClick(marker: MarkerType) {
  mapStore.selectMarker(marker)
}

watch(() => mapStore.selectedMarker, (marker) => {
  if (marker) {
    console.log('Selected marker:', marker.title)
  }
})
</script>

<template>
  <div class="relative w-full h-full">
    <YMap ref="mapRef" :location="mapLocation" :smooth-scroll="true">
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
        />
      </YMapMarker>
    </YMap>
  </div>
</template>
