<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Marker } from '../../data/mock'
import BottomSheet from '../BottomSheet.vue'
import Chip from '../Chip.vue'
import EmptyState from '../EmptyState.vue'

const emit = defineEmits<{
  select: [marker: Marker]
  close: []
  'open-search': []
}>()

const mapStore = useMapStore()

const markers = computed(() => mapStore.filteredMarkers)
const showCityChips = computed(() => mapStore.locations.length > 0)
const selectedCity = computed(() => mapStore.cityFilter)

const handleClick = (marker: Marker) => {
  emit('select', marker)
}

const handleCityClick = (city: string) => {
  mapStore.setCityFilter(selectedCity.value === city ? null : city)
}

const handleOpenFilter = () => {
  // TODO: open filter panel
}

const handleSearchFocus = () => {
  emit('open-search')
}

const isSelected = (marker: Marker) => mapStore.selectedMarker?.id === marker.id
const isActive = (marker: Marker) => typeof marker.status === 'number'
const isCompleted = (marker: Marker) => marker.status === 'completed'

const getProgressProps = (marker: Marker) => {
  const circumference = 2 * Math.PI * 10
  const progress = typeof marker.status === 'number' ? marker.status : 0
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference
  return { strokeDasharray, strokeDashoffset, progress }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-border">
      <input
        :value="mapStore.searchQuery"
        placeholder="Поиск"
        class="w-full px-3 py-2 bg-base-00 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        @focus="handleSearchFocus"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    
    <div v-if="showCityChips" class="p-3 border-b border-border flex flex-wrap gap-2">
      <Chip
        v-for="city in mapStore.locations"
        :key="city"
        :label="city"
        :variant="selectedCity === city ? 'secondary' : 'base'"
        @click="handleCityClick(city)"
      />
    </div>
    
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="marker in markers" 
        :key="marker.id"
        class="px-4 py-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-base-00 transition-colors"
        :class="{ 'bg-primary-10': isSelected(marker) }"
        @click="handleClick(marker)"
      >
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 flex-shrink-0 relative">
            <svg class="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#E5E4E7" stroke-width="2" />
              <circle
                v-if="isActive(marker)"
                cx="12" cy="12" r="10" fill="none" stroke="#4527A0" stroke-width="2"
                stroke-linecap="round"
                v-bind="getProgressProps(marker)"
              />
              <circle v-else-if="isCompleted(marker)" cx="12" cy="12" r="10" fill="#1A1A1A" />
              <svg v-if="isCompleted(marker)" class="w-3 h-3 absolute inset-0 m-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </svg>
          </div>
          
          <img v-if="marker.images?.[0]?.url" :src="marker.images[0].url" :alt="marker.title" class="w-10 h-10 rounded object-cover flex-shrink-0">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-text-00 truncate">{{ marker.title }}</h3>
            <p class="text-xs text-text-01 truncate">{{ marker.description }}</p>
          </div>
        </div>
      </div>
      
      <EmptyState
        v-if="markers.length === 0"
        icon="search"
        title="Ничего не найдено"
        description="Измените параметры поиска"
      />
    </div>

    <div v-if="markers.length > 0" class="p-3 border-t border-border">
      <button class="flex items-center gap-2 text-sm text-primary font-medium" @click="handleOpenFilter">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Фильтр
      </button>
    </div>
  </div>
</template>
