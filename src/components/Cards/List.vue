<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Marker } from '../../data/mock'
import Chip from '../Chip.vue'
import EmptyState from '../EmptyState.vue'

const emit = defineEmits<{
  'select-project': [project: Marker]
  'open-filter': []
}>()

const mapStore = useMapStore()
const isLoading = ref(true)
let loadingTimer: ReturnType<typeof setTimeout> | null = null
const rowRefs = ref<Record<string, HTMLElement | null>>({})

const markers = computed(() => mapStore.filteredMarkers)
const selectedMarkerId = computed(() => mapStore.selectedMarker?.id ?? null)

const statusChips = computed(() => {
  const items = markers.value
  const activeCount = items.filter(marker => typeof marker.status === 'number').length
  const completedCount = items.filter(marker => marker.status === 'completed').length

  return [
    { label: `Все (${items.length})`, value: 'all' as const },
    { label: `В процессе (${activeCount})`, value: 'active' as const },
    { label: `Завершенные (${completedCount})`, value: 'completed' as const }
  ]
})

const visibleMarkers = computed(() => {
  if (mapStore.statusFilter === 'active') {
    return markers.value.filter(marker => typeof marker.status === 'number')
  }

  if (mapStore.statusFilter === 'completed') {
    return markers.value.filter(marker => marker.status === 'completed')
  }

  return markers.value
})

const groupedMarkers = computed(() => {
  const groups = new Map<number, Marker[]>()

  for (const marker of visibleMarkers.value) {
    const year = new Date(marker.date).getFullYear()
    if (!groups.has(year)) {
      groups.set(year, [])
    }
    groups.get(year)!.push(marker)
  }

  return [...groups.entries()]
    .sort((left, right) => right[0] - left[0])
    .map(([year, items]) => ({
      year,
      items: items.sort((left, right) => right.date.localeCompare(left.date))
    }))
})

const selectedStatus = computed(() => mapStore.statusFilter)

const handleClick = (marker: Marker) => {
  if (marker.category === 'projects') {
    emit('select-project', marker)
  } else {
    mapStore.selectMarker(marker)
  }
}

const isSelected = (marker: Marker) => mapStore.selectedMarker?.id === marker.id

const getStatusLabel = (marker: Marker) => {
  if (marker.status === 'completed') return 'Завершен'
  return 'В процессе'
}

const getStartYear = (marker: Marker) => new Date(marker.date).getFullYear()

const handleStatusClick = (status: 'all' | 'active' | 'completed') => {
  mapStore.setStatusFilter(status)
}

const handleOpenFilter = () => {
  emit('open-filter')
}

const setRowRef = (id: string, el: Element | null) => {
  rowRefs.value[id] = el instanceof HTMLElement ? el : null
}

const scrollToItem = (id: string | null) => {
  if (!id) return
  const el = rowRefs.value[id]
  el?.scrollIntoView?.({ block: 'start' })
}

const runFakeLoading = () => {
  isLoading.value = true

  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }

  loadingTimer = setTimeout(() => {
    isLoading.value = false
    loadingTimer = null
  }, 350)
}

watch([markers, selectedStatus], runFakeLoading, { immediate: true })

watch([selectedMarkerId, markers, isLoading], async ([id]) => {
  if (!id || isLoading.value) return
  await nextTick()
  scrollToItem(id)
}, { flush: 'post' })

onBeforeUnmount(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
})

defineExpose({
  scrollToItem,
})
</script>

<template>
  <div class="w-[409px] bg-white rounded-card border border-border flex flex-col max-h-[calc(100vh-300px)] overflow-y-auto">
    <div class="p-3 border-b border-border flex flex-wrap gap-2">
      <Chip
        v-for="chip in statusChips"
        :key="chip.value"
        :label="chip.label"
        :variant="selectedStatus === chip.value ? 'secondary' : 'base'"
        @click="handleStatusClick(chip.value)"
      />
    </div>

    <div class="p-3 border-b border-border">
      <button
        class="w-full h-12 rounded-button bg-base-00 text-text-00 font-medium flex items-center justify-center gap-2"
        @click="handleOpenFilter"
      >
        Фильтр
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>
    </div>
    
    <div v-if="isLoading" class="flex min-h-[420px] items-center justify-center">
      <div class="flex flex-col items-center gap-3 text-text-01">
        <div
          class="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-label="Загрузка списка"
        ></div>
      </div>
    </div>

    <div v-else v-for="group in groupedMarkers" :key="group.year">
      <div class="px-4 pt-6 pb-4 flex items-center justify-between text-sm text-text-00">
        <span>{{ group.year }}</span>
        <span class="text-text-01">({{ group.items.length }})</span>
      </div>

      <div 
        v-for="marker in group.items" 
        :key="marker.id"
        class="px-4 py-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-base-00 transition-colors"
        :class="{ 'bg-base-00': isSelected(marker) }"
        :ref="el => setRowRef(marker.id, el)"
        @click="handleClick(marker)"
      >
        <div class="flex items-start gap-3">
          <div
            v-if="marker.status === 'completed'"
            class="mt-1 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-text-00 text-white"
          >
            <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div v-else class="mt-1 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full border border-primary bg-white">
            <div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
          </div>

          <div class="min-w-0 flex-1">
            <h3 class="text-base font-medium text-text-00 truncate">{{ marker.title }}</h3>
            <p class="mt-1 text-sm text-text-01 truncate">{{ marker.description }}</p>
            <p class="mt-1 text-sm text-text-01">
              Старт: {{ getStartYear(marker) }} • Финиш: {{ getStatusLabel(marker) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <EmptyState
      v-if="!isLoading && visibleMarkers.length === 0"
      icon="search"
      title="Ничего не найдено"
      description="Измените параметры поиска"
    />

  </div>
</template>
