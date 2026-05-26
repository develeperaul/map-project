<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue'
import EmptyState from '../EmptyState.vue'
import EmptyStateFilter from '../EmptyStateFilter.vue'

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

type StatusFilter = 'all' | 'active' | 100

const projectStatusText = (status: Marker['status']) => {
  if (status === 100) return 'Завершен'
  if (status !== undefined && status < 100) return 'В процессе'
  return 'В процессе'
}

const sportTypeIcons: Record<string, string> = {
  'Бег': 'sport-run',
  'Кросс-поход': 'sport-cross-hike',
  'Плавание': 'sport-swim',
  'Лыжи': 'sport-ski',
  'Ролики': 'sport-rollers',
  'Велосипед': 'sport-bike',
  'Поход': 'sport-hike',
  'Восхождение': 'sport-climb',
}

const markers = computed(() => mapStore.filteredMarkers)
const searchPlaceholder = computed(() => mapStore.category === 'projects' ? 'Поиск проектов...' : 'Поиск...')

const statusChips = computed(() => {
  const items = markers.value
  const activeCount = items.filter(marker => marker.status !== undefined && marker.status < 100).length
  const completedCount = items.filter(marker => marker.status === 100).length

  return [
    { label: 'Все', count: items.length, value: 'all' as const },
    { label: 'В процессе', count: activeCount, value: 'active' as const },
    { label: 'Завершенные', count: completedCount, value: 100 as const },
  ]
})

const displayedMarkers = computed(() => {
  const markers = mapStore.filteredMarkers

  if (mapStore.category !== 'projects' || mapStore.statusFilter === 'all') {
    return markers
  }

  if (mapStore.statusFilter === 'active') {
    return markers.filter(marker => marker.status !== undefined && marker.status < 100)
  }

  return markers.filter(marker => marker.status === 100)
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

const getSportType = (marker: Marker) => marker.sportTypes?.[0] ?? ''

const getSportTypeIcon = (marker: Marker) => {
  const sportType = getSportType(marker)
  return sportTypeIcons[sportType] || 'sport'
}

const getMetaText = (marker: Marker) => {
  const year = formatYear(marker.date)

  if (marker.category === 'projects') {
    const parts = [`Старт: ${year}`]

    

    parts.push(`Финиш: ${projectStatusText(marker.status)}`)

    return parts.join(' • ')
  }

  const parts = []

  if (marker.city) {
    parts.push(`г. ${marker.city}`)
  }

  

  parts.push(String(year))

  return parts.join(' • ')
}

const handleClick = (marker: Marker) => {
  emit('select', marker)
}

const isSelected = (marker: Marker) => mapStore.selectedMarker?.id === marker.id

const setProjectStatus = (value: StatusFilter) => {
  mapStore.setStatusFilter(value)
}

const activeFilterChips = computed(() => {
  const chips: Array<{ label: string; type: string; value?: string }> = []
  
  if (mapStore.dateRangeLabel) {
    chips.push({ label: mapStore.dateRangeLabel, type: 'date' })
  }
  
  mapStore.cityFilter.forEach(city => {
    chips.push({ label: city, type: 'city', value: city })
  })
  
  mapStore.sportTypeFilter.forEach(type => {
    chips.push({ label: type, type: 'sportType', value: type })
  })
  
  mapStore.tagFilter.forEach(tag => {
    chips.push({ label: tag, type: 'tag', value: tag })
  })
  
  return chips
})

const removeFilterChip = (chip: { type: string; value?: string }) => {
  switch (chip.type) {
    case 'date':
      mapStore.clearDateRange()
      break
    case 'city':
      mapStore.setCityFilter(mapStore.cityFilter.filter(c => c !== chip.value))
      break
    case 'sportType':
      mapStore.setSportTypeFilter(mapStore.sportTypeFilter.filter(t => t !== chip.value))
      break
    case 'tag':
      mapStore.setTagFilter(mapStore.tagFilter.filter(t => t !== chip.value))
      break
  }
}

const updateSearch = (event: Event) => {
  mapStore.setSearchQuery((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="flex h-full flex-col bg-white px-4 pb-3" >
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

      <div v-if="mapStore.category === 'projects'" class="flex w-full gap-2 overflow-x-auto justify-baseline">
        <button
          v-for="chip in statusChips"
          :key="chip.value"
          type="button"
          class="flex h-8 shrink-0 items-center justify-center rounded-button px-2.5 text-sm font-medium leading-5 transition-colors grow "
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
        type="button"
        class="flex h-8 w-full items-center justify-center gap-2 rounded-button bg-base-light-00 text-sm font-medium leading-5 text-text-dark transition-colors hover:bg-base-light-01"
        @click="emit('open-filter')"
      >
        <span
          v-if="mapStore.activeFilterCount > 0"
          class="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary-dark px-1.5 text-xs font-normal leading-4 text-white"
        >
          {{ mapStore.activeFilterCount }}
        </span>
        Фильтр
        <BaseIcon name="filter-line" class="w-4 h-4" />
      </button>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="chip in activeFilterChips"
          :key="`${chip.type}-${chip.label}`"
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded-button bg-secondary-dark px-2.5 text-sm font-medium leading-5 text-white"
          @click="removeFilterChip(chip)"
        >
          {{ chip.label }}
          <BaseIcon name="close" class="h-3.5 w-3.5" size="14px" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto grid gap-2 pb-2">
      
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
            class="flex w-full cursor-pointer items-start gap-4 border-b border-border py-4 text-left transition-colors last:border-b-0 hover:bg-base-light-00"
            :class="{ 'bg-base-light-00': isSelected(marker) }"
            @click="handleClick(marker)"
          >
            <template v-if="marker.category === 'projects'">
              <span
                v-if="marker.status === 100"
                class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary-dark text-white"
              >
                <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </span>

              <svg v-else width="14" height="14" viewBox="0 0 14 14" style="transform: rotate(-90deg);">
                
                <circle cx="7" cy="7" r="5.5" fill="none" stroke="#E5E7EB" stroke-width="2"/>
                <circle cx="7" cy="7" r="5.5" fill="none" stroke="#3F51B5" stroke-width="2"
                  stroke-linecap="round"
                  pathLength="100"
                  stroke-dasharray="100"
                  :stroke-dashoffset="marker.status !== undefined ? 100 - marker.status : 100" /> 
                        
              </svg>
            </template>

            <span v-else class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full" :class="categoryAccent[marker.category]"></span>

            <div class="min-w-0 flex-1">
              <div class=" flex justify-between gap-2">
                <h3 class="break-words text-body-xl font-medium leading-6 text-text-00">{{ marker.title }}</h3>
                <span v-if="marker.distance" class=" text-text-01 px-2 py-0.5 text-body-s bg-base-00 group-hover:bg-white rounded-[4px]" >
                  {{marker.distance}}
                </span>
              </div>
              
              <p class="mt-1 line-clamp-2 text-sm font-normal text-text-01">{{ marker.description }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-01">
                <BaseIcon name="location" class="h-3 w-3 flex-shrink-0 text-text-01" />
                <span>{{ getMetaText(marker) }}</span>
                <template v-if="marker.category === 'sport' && getSportType(marker)">
                  <span>•</span>
                  <span class="inline-flex items-center gap-1">
                    <BaseIcon :name="getSportTypeIcon(marker)" class="text-text-01" size="16px" />
                    <span>{{ getSportType(marker) }}</span>
                  </span>
                </template>
              </div>
            </div>
          </button>
        </div>
      </div>

      <EmptyStateFilter
        v-if="displayedMarkers.length === 0 && mapStore.activeFilterCount > 0"
        :filter-count="mapStore.activeFilterCount"
        @clear="mapStore.resetFilters"
      />
      <EmptyState
        v-else-if="displayedMarkers.length === 0"
        icon="search"
        title="Ничего не найдено"
        description="Измените параметры поиска"
      />
    </div>
  </div>
</template>
