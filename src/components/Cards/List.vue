<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, type ComponentPublicInstance } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Marker } from '../../data/mock'
import EmptyState from '../EmptyState.vue'
import EmptyStateFilter from '../EmptyStateFilter.vue'
import BaseIcon from '../BaseIcon.vue'

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
  const activeCount = items.filter(marker => marker.status !== undefined && marker.status < 100).length
  const completedCount = items.filter(marker => marker.status === 100).length

  return [
    { label: 'Все', count: items.length, value: 'all' as const },
    { label: 'В процессе', count: activeCount, value: 'active' as const },
    { label: 'Завершенные', count: completedCount, value: 100 as const },
  ]
})

const visibleMarkers = computed(() => {
  if (mapStore.category !== 'projects') {
    return markers.value
  }

  if (mapStore.statusFilter === 'active') {
    return markers.value.filter(marker => marker.status !== undefined && marker.status < 100)
  }

  if (mapStore.statusFilter === 100) {
    return markers.value.filter(marker => marker.status === 100)
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

const handleClick = (marker: Marker) => {
  if (marker.category === 'projects') {
    emit('select-project', marker)
  } else {
    mapStore.selectMarker(marker)
  }
}

const isSelected = (marker: Marker) => mapStore.selectedMarker?.id === marker.id

const getStatusLabel = (marker: Marker) => {
  if (marker.status === 100) return 'Завершен'
  return 'В процессе'
}

const getStartYear = (marker: Marker) => new Date(marker.date).getFullYear()

const getSportType = (marker: Marker) => marker.sportTypes?.[0] ?? ''

const getSportTypeIcon = (marker: Marker) => {
  const sportType = getSportType(marker)
  return sportTypeIcons[sportType] || 'sport'
}

const getMetaText = (marker: Marker) => {
  const year = getStartYear(marker)
  const parts: string[] = []

  if (marker.category === 'projects') {
    parts.push(`Старт: ${year}`)
  }
  else if (marker.city) {
    parts.push(` ${marker.city}`)
  }

  

  if (marker.category === 'projects') {
    parts.push(`Финиш: ${getStatusLabel(marker)}`)
  } else {
    parts.push(String(year))
  }
  
  
  return parts
}

const getTagTitle = (title: string) => {
  const normalizedTitle = title.trim()
  return normalizedTitle.startsWith('#') ? normalizedTitle : `#${normalizedTitle}`
}

const handleStatusClick = (status: 'all' | 'active' | 100) => {
  mapStore.setStatusFilter(status)
}

const handleOpenFilter = () => {
  emit('open-filter')
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

const setRowRef = (id: string, el: Element | ComponentPublicInstance | null) => {
  rowRefs.value[id] = el instanceof HTMLElement ? el : null
}

const scrollToItem = (id: string | null) => {
  if (!id) return
  const el = rowRefs.value[id]
  el?.scrollIntoView?.({ block: 'start' })
}

// Небольшая задержка имитирует перерисовку списка после смены фильтров.
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

// После обновления списка прокручиваем к активному элементу.
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
  <div class="w-[409px] bg-white rounded-card border border-border flex flex-col h-full max-h-[calc(100vh-216px)] overflow-y-auto p-6" 
  style="box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.30), 0 2px 6px 2px rgba(0, 0, 0, 0.15);">
    <div v-if="mapStore.category === 'projects'" class="pb-2 flex gap-2 justify-between">
      <button
        v-for="chip in statusChips"
        :key="chip.value"
        type="button"
        class="flex h-8 grow shrink-0 min-w-fit items-center justify-center rounded-button px-2.5 text-sm font-medium leading-5 transition-colors"
        :class="mapStore.statusFilter === chip.value ? 'bg-secondary-dark text-white' : 'bg-base-light-00 text-text-dark'"
        @click="handleStatusClick(chip.value)"
      >
        <span>{{ chip.label }}</span>
        <span
          class="ml-1 mb-2 text-[9px] leading-5 "
          :class="mapStore.statusFilter === chip.value ? 'text-white' : 'text-text-01'"
        >
          ({{ chip.count }})
        </span>
      </button>
    </div>

    <div class="  pb-2  ">
      <button
        class="w-full h-10 rounded-button bg-base-00 text-text-00 text-body-s font-medium flex items-center justify-center gap-2"
        @click="handleOpenFilter"
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
      <div class="mt-2 flex flex-wrap gap-2">
        <button
          v-for="chip in activeFilterChips"
          :key="`${chip.type}-${chip.label}`"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-button bg-secondary-dark px-2.5 py-1.5 text-sm font-medium leading-5 text-white"
          @click="removeFilterChip(chip)"
        >
          {{ chip.label }}
          <BaseIcon name="close" class="h-3.5 w-3.5" size="14px" />
        </button>
      </div>
      <div class="border-b border-border mt-4"></div>
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
      <div class="pt-6 pb-4 flex items-center justify-between text-sm text-text-00">
        <span>{{ group.year }}</span>
        <span class="text-text-01">({{ group.items.length }})</span>
      </div>
      <template
        v-for="marker in group.items"
        :key="marker.id"
      >
        <div
          class="group py-4 -mx-4 px-4  rounded-2xl  cursor-pointer hover:bg-base-00 transition-colors"
          :class="{ 'bg-base-00': isSelected(marker) }"
          :ref="el => setRowRef(marker.id, el)"
          @click="handleClick(marker)"
        >
          <div class="flex items-start gap-3">
            <div
              v-if="marker.status === 100"
              class="mt-1 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-text-00 text-white"
            >
              <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <svg v-else width="14" height="14" viewBox="0 0 14 14" style="transform: rotate(-90deg);">
                
                <circle cx="7" cy="7" r="5.5" fill="none" stroke="#E5E7EB" stroke-width="2"/>
                <circle cx="7" cy="7" r="5.5" fill="none" stroke="#3F51B5" stroke-width="2"
                  stroke-linecap="round"
                  pathLength="100"
                  stroke-dasharray="100"
                  :stroke-dashoffset="marker.status !== undefined ? 100 - marker.status : 100" /> 
                        
              </svg>

            <div class="min-w-0 flex-1">
              <div class=" flex justify-between gap-2">
                <h3 class="break-words text-body-xl font-medium leading-6 text-text-00">{{ marker.title }}</h3>
                <span v-if="marker.distance" class=" text-text-01 px-2 py-0.5 text-body-s bg-base-00 group-hover:bg-white rounded-[4px]" >
                  {{marker.distance}}
                </span>
              </div>
              <p class="mt-1 line-clamp-2 text-sm text-text-01">{{ marker.description }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-01">
                <BaseIcon name="location" class="h-4 w-4 flex-shrink-0 text-text-01" />
                <!-- <svg class="h-4 w-4 flex-shrink-0 text-text-01" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" />
                  <circle cx="12" cy="11" r="2.5" stroke-width="2" />
                </svg> -->
                <template v-for="(part, i) in getMetaText(marker)" :key="i">
                  <span v-if="i > 0" class="text-base-light-02">•</span>
                  <span>{{ part }}</span>
                </template>
                <template v-if="marker.category === 'sport' && getSportType(marker)">
                  <span class="h-1 w-1 rounded-full bg-text-01"></span>
                  <span class="inline-flex items-center gap-1 text-body-xs-reg text-text-01">
                    <BaseIcon :name="getSportTypeIcon(marker)" class="text-text-01" size="16px" />
                    {{ getSportType(marker) }}
                  </span>
                </template>
              </div>

              <div v-if="marker.category === 'sport' && marker.tags?.length" class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in marker.tags"
                  :key="tag.id"
                  class="rounded bg-base-light-00 px-2 py-1 text-body-s-reg text-text-dark"
                >
                  {{ getTagTitle(tag.title) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="border-b border-border last:border-b-0 mx-2 my-2">

        </div>
      </template>
    </div>
    
    <EmptyStateFilter
      v-if="!isLoading && visibleMarkers.length === 0 && mapStore.activeFilterCount > 0"
      :filter-count="mapStore.activeFilterCount"
      @clear="mapStore.resetFilters"
    />
    <EmptyState
      v-else-if="!isLoading && visibleMarkers.length === 0"
      icon="search"
      title="Ничего не найдено"
      description="Измените параметры поиска"
    />

  </div>
</template>
