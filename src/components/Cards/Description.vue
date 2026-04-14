<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '../../stores/map'
import BaseIcon from '../BaseIcon.vue'
import Chip from '../Chip.vue'

const mapStore = useMapStore()

const marker = computed(() => mapStore.selectedMarker)

const isProject = computed(() => marker.value?.category === 'projects')
const isActive = computed(() => typeof marker.value?.status === 'number')
const isCompleted = computed(() => marker.value?.status === 'completed')

const progress = computed(() => typeof marker.value?.status === 'number' ? marker.value.status : 0)

const circumference = 2 * Math.PI * 18
const strokeDasharray = computed(() => {
  return `${circumference} ${circumference}`
})

const strokeDashoffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const handleClose = () => {
  mapStore.clearSelection()
}
</script>

<template>
  <div v-if="marker" class="w-[409px] bg-white rounded-card border border-border p-4 relative">
    <button 
      class="absolute top-3 right-3 text-text-01 hover:text-text-00"
      @click="handleClose"
    >
      <BaseIcon name="close" class="w-5 h-5" />
    </button>
    
    <div class="flex flex-col gap-4">
      <div v-if="marker.images?.length" class="flex gap-2 overflow-x-auto">
        <img 
          v-for="(img, idx) in marker.images" 
          :key="idx"
          :src="img.url" 
          :alt="marker.title"
          class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        >
      </div>
      
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-base font-medium text-text-00 mb-1">{{ marker.title }}</h3>
          <p class="text-sm text-text-01">{{ marker.description }}</p>
        </div>
        
        <div v-if="isProject" class="flex-shrink-0">
          <div v-if="isActive" class="relative w-10 h-10">
            <svg class="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#E5E4E7"
                stroke-width="4"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#4527A0"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="strokeDasharray"
                :stroke-dashoffset="strokeDashoffset"
              />
            </svg>
          </div>
          
          <div v-else-if="isCompleted" class="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <BaseIcon name="check" class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div v-if="marker.date" class="text-sm text-text-01">
        {{ formatDate(marker.date) }}
      </div>
      
      <div v-if="marker.city" class="text-sm text-text-01">
        {{ marker.city }}
      </div>
      
      <div v-if="marker.tags?.length" class="flex flex-wrap gap-2">
        <Chip 
          v-for="tag in marker.tags" 
          :key="tag.id" 
          :label="tag.title" 
          size="sm"
        />
      </div>
    </div>
  </div>
</template>
