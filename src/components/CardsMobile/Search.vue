<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Marker } from '../../data/mock'
import EmptyState from '../EmptyState.vue'

const props = defineProps<{
  query: string
}>()

const emit = defineEmits<{
  close: []
  select: [marker: Marker]
}>()

const mapStore = useMapStore()
const searchQuery = ref(props.query)
const searchResults = ref<Marker[]>([])

watch(searchQuery, async (val) => {
  if (val && val.length >= 2) {
    mapStore.setSearchQuery(val)
    searchResults.value = mapStore.filteredMarkers
  } else {
    searchResults.value = []
  }
}, { immediate: true })

const handleSelect = (marker: Marker) => {
  emit('select', marker)
}

const handleCancel = () => {
  mapStore.setSearchQuery('')
  emit('close')
}

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
  <div class="fixed inset-0 z-50 bg-white">
    <div class="flex items-center gap-2 p-4 border-b border-border">
      <input
        v-model="searchQuery"
        placeholder="Поиск"
        class="flex-1 px-3 py-2 bg-base-00 rounded-button text-base focus:outline-none"
        autofocus
      />
      <button 
        class="text-sm text-primary font-medium"
        @click="handleCancel"
      >
        Отмена
      </button>
    </div>
    
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="marker in searchResults" 
        :key="marker.id"
        class="px-4 py-3 border-b border-border cursor-pointer hover:bg-base-00"
        @click="handleSelect(marker)"
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
        v-if="searchQuery.length >= 2 && searchResults.length === 0"
        icon="search"
        title="Ничего не найдено"
        description="Измените параметры поиска"
      />
      
      <div v-if="searchQuery.length < 2" class="p-4 text-center text-text-02 text-sm">
        Введите минимум 2 символа
      </div>
    </div>
  </div>
</template>
