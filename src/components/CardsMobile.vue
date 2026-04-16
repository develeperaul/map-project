<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMapStore } from '@/stores/map'
import BottomSheet from '../BottomSheet.vue'
import BaseIcon from '../BaseIcon.vue'
import Chip from './Chip.vue'
import type { Marker } from '@/data/mock'

const mapStore = useMapStore()

const selectedMarker = ref<Marker | null>(null)
const showDetail = computed(() => selectedMarker.value !== null)

watch(() => mapStore.selectedMarker, (marker) => {
  if (marker) {
    selectedMarker.value = marker
  }
})

const handleClose = () => {
  selectedMarker.value = null
  mapStore.selectMarker(null)
}
</script>

<template>
  <div class="md:hidden">
    <BottomSheet v-if="selectedMarker" :model-value="showDetail" @update:model-value="handleClose">
      <div class="px-4 pb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-text-00">{{ selectedMarker.title }}</h3>
          <button class="p-2" @click="handleClose">
            <BaseIcon name="close" class="w-5 h-5" />
          </button>
        </div>
        
        <p class="text-sm text-text-01 mb-4">{{ selectedMarker.description }}</p>
        
        <div v-if="selectedMarker.tags" class="flex flex-wrap gap-2 mb-4">
          <Chip 
            v-for="tag in selectedMarker.tags" 
            :key="tag" 
            :label="tag"
            :active="true"
          />
        </div>
        
        <div class="flex items-center gap-2 text-sm text-text-02">
          <span>{{ selectedMarker.city }}</span>
          <span>•</span>
          <span>{{ selectedMarker.date }}</span>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>