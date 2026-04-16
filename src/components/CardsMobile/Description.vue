<script setup lang="ts">
import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue'
import Chip from '../Chip.vue'

const props = defineProps<{
  marker: Marker
}>()

const emit = defineEmits<{
  close: []
}>()

const isProject = props.marker?.category === 'projects'
const isActive = typeof props.marker?.status === 'number'
const isCompleted = props.marker?.status === 'completed'

const progress = typeof props.marker?.status === 'number' ? props.marker.status : 0
const circumference = 2 * Math.PI * 18

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="p-4">
    <button class="absolute top-3 right-3 text-text-01 hover:text-text-00" @click="$emit('close')">
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
              <circle cx="20" cy="20" r="18" fill="none" stroke="#E5E4E7" stroke-width="4" />
              <circle
                cx="20" cy="20" r="18" fill="none" stroke="#4527A0" stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference - (progress / 100) * circumference"
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
          variant="base"
        />
      </div>
    </div>
  </div>
</template>