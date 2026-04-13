<script lang="ts" setup>
import { ref, watch } from 'vue'
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } from '../lib/ymaps'
import { useMapStore } from '../stores/map'
import ProjectCard from './ProjectCard.vue'
import Button from './Button.vue'
import type { Category, Marker } from '../data/mock'

const mapStore = useMapStore()

const categories: { id: Category; label: string }[] = [
  { id: 'projects', label: 'Проекты' },
  { id: 'travel', label: 'Путешествия' },
  { id: 'sport', label: 'Спорт' }
]

function selectCategory(cat: Category) {
  mapStore.setCategory(cat)
}

function onMarkerClick(marker: Marker) {
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
    <YMap :location="{ center: mapStore.mapCenter, zoom: mapStore.mapZoom }">
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      
      <YMapMarker 
        v-for="marker in mapStore.markers"
        :key="marker.id"
        :coordinates="marker.coordinates"
        @click="() => onMarkerClick(marker)"
      >
        <div 
          class="w-5 h-5 rounded-full border-2 border-white cursor-pointer transition-transform hover:scale-125"
          :class="mapStore.selectedMarker?.id === marker.id ? 'bg-blue-600' : 'bg-red-500'"
        />
      </YMapMarker>
    </YMap>

    <div class="absolute top-4 left-4 z-10 flex gap-2">
      <Button
        v-for="cat in categories"
        :key="cat.id"
        :variant="mapStore.category === cat.id ? 'primary' : 'base'"
        size="md"
        @click="selectCategory(cat.id)"
      >
        {{ cat.label }}
      </Button>
    </div>

    <div class="absolute bottom-4 right-4 z-10">
      <ProjectCard v-if="mapStore.selectedMarker" />
    </div>
  </div>
</template>