<script setup lang="ts">
import { useMapStore } from '../stores/map'

const mapStore = useMapStore()

function closeCard() {
  mapStore.clearSelection()
}
</script>

<template>
  <transition name="slide-fade">
    <div 
      v-if="mapStore.selectedMarker" 
      class="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full"
    >
      <div class="relative">
        <img 
          v-if="mapStore.selectedMarker.image"
          :src="mapStore.selectedMarker.image" 
          :alt="mapStore.selectedMarker.title"
          class="w-full h-48 object-cover"
        />
        <button 
          @click="closeCard"
          class="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-5">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ mapStore.selectedMarker.title }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ mapStore.selectedMarker.description }}
        </p>
        
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ mapStore.selectedMarker.coordinates[0] }}, {{ mapStore.selectedMarker.coordinates[1] }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>