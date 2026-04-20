<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue'
import EmptyState from '../EmptyState.vue'

const emit = defineEmits<{
  select: [marker: Marker]
  'open-filter': []
  close: []
}>()

const mapStore = useMapStore()

const categoryAccent: Record<string, string> = {
  projects: 'bg-primary',
  travel: 'bg-orange',
  sport: 'bg-purple',
}

type StatusFilter = 'all' | 'active' | 'completed'

const projectStatusText = (status: Marker['status']) => {
  if (status === 'completed') return 'Завершен'
  if (typeof status === 'number') return 'В процессе'
  return 'В процессе'
}

const markers = computed(() => mapStore.filteredMarkers)
const searchPlaceholder = computed(() => mapStore.category === 'projects' ? 'Поиск проектов...' : 'Поиск...')

const statusChips = computed(() => {
  const items = markers.value
  const activeCount = items.filter(marker => typeof marker.status === 'number').length
  const completedCount = items.filter(marker => marker.status === 'completed').length

  return [
    { label: 'Все', count: items.length, value: 'all' as const },
    { label: 'В процессе', count: activeCount, value: 'active' as const },
    { label: 'Завершенные', count: completedCount, value: 'completed' as const },
  ]
})

const displayedMarkers = computed(() => {
  const markers = mapStore.filteredMarkers

  if (mapStore.category !== 'projects' || mapStore.statusFilter === 'all') {
    return markers
  }

  if (mapStore.statusFilter === 'active') {
    return markers.filter(marker => typeof marker.status === 'number')
  }

  return markers.filter(marker => marker.status === 'completed')
})

const groupedMarkers = computed(() => {
  const groups = new Map<number, Marker[]>()

  for (const marker of displayedMarkers.value) {
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
      items: items.sort((left, right) => right.date.localeCompare(left.date)),
    }))
})

const formatYear = (dateStr: string) => new Date(dateStr).getFullYear()

const formatMeta = (marker: Marker) => {
  const year = formatYear(marker.date)

  if (marker.category === 'projects') {
    return `Старт: ${year} • Финиш: ${projectStatusText(marker.status)}`
  }

  if (marker.category === 'travel') {
    return `г. ${marker.city}`
  }

  const tag = marker.tags?.[0]?.title
  return tag ? `г. ${marker.city} • ${year} • ${tag}` : `г. ${marker.city} • ${year}`
}

const handleClick = (marker: Marker) => {
  emit('select', marker)
}

const isSelected = (marker: Marker) => mapStore.selectedMarker?.id === marker.id

const setProjectStatus = (value: StatusFilter) => {
  mapStore.setStatusFilter(value)
}

const updateSearch = (event: Event) => {
  mapStore.setSearchQuery((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="flex h-full flex-col bg-white px-4 pb-3">
    <div class="flex shrink-0 flex-col gap-2 pb-6">
      <div class="flex items-start gap-2">
        <label class="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-button bg-base-light-00 pl-4 pr-3 text-sm font-medium leading-5 text-text-01">
          <BaseIcon name="search" class="h-4 w-4 shrink-0 text-text-01" size="16px" />
          <input
            :value="mapStore.searchQuery"
            :placeholder="searchPlaceholder"
            type="search"
            class="min-w-0 flex-1 bg-transparent text-sm font-medium leading-5 text-text-dark outline-none placeholder:text-text-01"
            @input="updateSearch"
          >
        </label>

        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01"
          aria-label="Закрыть список"
          @click="emit('close')"
        >
          <BaseIcon name="close" class="h-4 w-4" size="16px" />
        </button>
      </div>

      <div v-if="mapStore.category === 'projects'" class="flex w-full gap-2 overflow-x-auto">
        <button
          v-for="chip in statusChips"
          :key="chip.value"
          type="button"
          class="flex h-8 shrink-0 items-center justify-center rounded-button px-2.5 text-sm font-medium leading-5 transition-colors"
          :class="mapStore.statusFilter === chip.value ? 'bg-secondary-dark text-white' : 'bg-base-light-00 text-text-dark'"
          @click="setProjectStatus(chip.value)"
        >
          <span>{{ chip.label }}</span>
          <span
            class="ml-1 text-[9px] leading-5"
            :class="mapStore.statusFilter === chip.value ? 'text-white' : 'text-text-01'"
          >
            ({{ chip.count }})
          </span>
        </button>
      </div>

      <button
        v-if="displayedMarkers.length > 0"
        type="button"
        class="flex h-8 w-full items-center justify-center gap-2 rounded-button bg-base-light-00 text-sm font-medium leading-5 text-text-dark transition-colors hover:bg-base-light-01"
        @click="emit('open-filter')"
      >
        Фильтр
        <BaseIcon name="filter" class="h-4 w-4" size="16px" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto pb-2">
      <div v-for="group in groupedMarkers" :key="group.year" class="flex flex-col gap-2">
        <div class="flex items-center justify-between text-sm leading-5">
          <span class="font-medium text-text-dark">{{ group.year }}</span>
          <span class="font-normal text-text-muted">({{ group.items.length }})</span>
        </div>

        <div class="flex flex-col">
          <button
            v-for="marker in group.items"
            :key="marker.id"
            type="button"
            class="flex w-full cursor-pointer items-start gap-4 border-b border-border px-3 py-4 text-left transition-colors last:border-b-0 hover:bg-base-light-00"
            :class="{ 'bg-base-light-00': isSelected(marker) }"
            @click="handleClick(marker)"
          >
            <template v-if="marker.category === 'projects'">
              <span
                v-if="marker.status === 'completed'"
                class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary-dark text-white"
              >
                <BaseIcon name="check" class="h-2.5 w-2.5" size="10px" />
              </span>
              <span
                v-else
                class="mt-[5px] h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-white"
              ></span>
            </template>

            <span v-else class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full" :class="categoryAccent[marker.category]"></span>

            <div class="min-w-0 flex-1">
              <h3 class="truncate text-lg font-medium leading-6 text-text-dark">{{ marker.title }}</h3>
              <p class="mt-1 truncate text-xs font-normal leading-4 text-text-01">{{ formatMeta(marker) }}</p>
            </div>
          </button>
        </div>
      </div>

      <EmptyState
        v-if="displayedMarkers.length === 0"
        icon="search"
        title="Ничего не найдено"
        description="Измените параметры поиска"
      />
    </div>
  </div>
</template>
