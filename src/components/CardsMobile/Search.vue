<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Marker } from '../../data/mock'
import EmptyState from '../EmptyState.vue'

const props = withDefaults(defineProps<{
  query: string
  mode?: 'inline' | 'overlay'
}>(), {
  mode: 'overlay',
})

const emit = defineEmits<{
  close: []
  select: [marker: Marker]
  open: []
}>()

const mapStore = useMapStore()
const searchQuery = ref(props.query)
const searchResults = ref<Marker[]>([])

watch(() => props.query, (val) => {
  searchQuery.value = val
}, { immediate: true })

watch(searchQuery, (val) => {
  if (val && val.length >= 2) {
    mapStore.setSearchQuery(val)
    searchResults.value = mapStore.filteredMarkers
  } else {
    mapStore.setSearchQuery(val)
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

const handleClear = () => {
  searchQuery.value = ''
  mapStore.setSearchQuery('')
}
</script>

<template>
  <template v-if="mode === 'inline'">
    <button
      type="button"
      class="flex h-10 w-full items-center gap-3 rounded-button border border-border bg-white px-4 text-left shadow-[0_4px_20px_rgba(20,20,20,0.08)]"
      @click="emit('open')"
      @focus="emit('open')"
    >
      <svg class="h-5 w-5 flex-shrink-0 text-text-01" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="7" stroke-width="2" />
        <path d="M20 20l-3.5-3.5" stroke-width="2" stroke-linecap="round" />
      </svg>
      <span class="flex-1 text-sm leading-5 text-text-01">Поиск...</span>
    </button>
  </template>

  <template v-else>
    <div class="fixed inset-0 z-[80] bg-white">
      <div class="flex items-center gap-2 p-4 pt-3">
        <div class="flex h-10 flex-1 items-center gap-2 rounded-button border border-border bg-base-00 px-4 shadow-sm">
          <svg class="h-5 w-5 flex-shrink-0 text-text-01" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="7" stroke-width="2" />
            <path d="M20 20l-3.5-3.5" stroke-width="2" stroke-linecap="round" />
          </svg>
          <input
            v-model="searchQuery"
            placeholder="Поиск..."
            class="flex-1 bg-transparent text-base outline-none placeholder:text-text-01"
            autofocus
          >
          <button
            v-if="searchQuery"
            type="button"
            class="text-text-01 hover:text-text-00"
            @click="handleClear"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 6l12 12M18 6L6 18" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <button class="h-10 rounded-button bg-base-00 px-3 text-sm font-medium text-text-00" @click="handleCancel">
          Отмена
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div 
          v-for="marker in searchResults" 
          :key="marker.id"
          class="border-b border-border py-3 cursor-pointer hover:bg-base-00"
          @click="handleSelect(marker)"
        >
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 flex-shrink-0 relative">
              <svg class="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="#E5E4E7" stroke-width="2" />
                <circle v-if="typeof marker.status === 'number'" cx="12" cy="12" r="10" fill="none" stroke="#4527A0" stroke-width="2" stroke-linecap="round" />
                <circle v-else-if="marker.status === 'completed'" cx="12" cy="12" r="10" fill="#1A1A1A" />
                <svg v-if="marker.status === 'completed'" class="w-3 h-3 absolute inset-0 m-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
</template>
