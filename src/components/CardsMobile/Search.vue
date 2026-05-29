<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Marker } from '../../data/mock'
import EmptyState from '../EmptyState.vue'
import BaseIcon from '../BaseIcon.vue'

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
  'open-calendar-filter': []
  'clear-date-filter': []
}>()

const mapStore = useMapStore()
const searchQuery = ref(props.query)
const searchResults = ref<Marker[]>([])
const categoryOrder: Array<Marker['category']> = ['projects', 'travel', 'sport']
const categoryLabels: Record<Marker['category'], string> = {
  projects: 'Проекты',
  travel: 'Путешествия',
  sport: 'Спорт',
}

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

const formatYear = (dateStr: string) => new Date(dateStr).getFullYear()

const getProjectStatusText = (status: Marker['status']) => {
  if (status === 100) return 'Завершен'
  if (typeof status === 'number' && status < 100) return 'В процессе'
  return 'В процессе'
}

const getSportType = (marker: Marker) => marker.sportTypes?.[0] ?? ''

const getSportTypeIcon = (marker: Marker) => {
  const sportType = getSportType(marker)
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

  return sportTypeIcons[sportType] || 'sport'
}

const getSportTagLabels = (marker: Marker) => marker.tags?.map(tag => tag.title) || []

const groupedResults = computed(() =>
  categoryOrder
    .map(category => ({
      category,
      label: categoryLabels[category],
      items: searchResults.value.filter(marker => marker.category === category),
    }))
    .filter(group => group.items.length > 0),
)

const openCalendarFilter = () => {
  emit('open-calendar-filter')
}

const clearDateFilter = () => {
  emit('clear-date-filter')
}
</script>

<template>
  <template v-if="mode === 'inline'">
    <div
      role="button"
      tabindex="0"
      aria-label="Открыть поиск"
      class="flex h-12 w-full items-center justify-between gap-3 rounded-button bg-white py-2 pl-4 pr-3 text-left"
      style="box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.30), 0 2px 6px 2px rgba(0, 0, 0, 0.15);"
      @click="emit('open')"
      @keydown.enter.prevent="emit('open')"
      @keydown.space.prevent="emit('open')"
    >
      <span class="flex min-w-0 flex-1 items-center gap-2">
        <svg class="h-4 w-4 flex-shrink-0 text-text-01" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="7" stroke-width="2" />
          <path d="M20 20l-3.5-3.5" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span class="truncate text-body-s font-medium leading-5 text-text-01">Поиск...</span>
      </span>

      <button
        type="button"
        class="flex h-8 shrink-0 items-center justify-center gap-2 rounded-button bg-base-light-00 px-2.5 text-body-s font-medium leading-5 text-text-dark"
        :aria-label="mapStore.dateRangeLabel ? 'Сбросить фильтр по дате' : 'Открыть фильтр по годам'"
        @click.stop="mapStore.dateRangeLabel ? clearDateFilter() : openCalendarFilter()"
      >
        <span>{{ mapStore.dateRangeLabel || 'Все года' }}</span>
        <svg
          v-if="mapStore.dateRangeLabel"
          class="h-4 w-4 text-red"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M6 6l12 12M18 6L6 18" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
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
          v-for="group in groupedResults"
          :key="group.category"
          class="pb-4"
        >
          <div class="flex items-center justify-between pb-2 text-xs leading-4 text-text-01">
            <span class="font-medium text-text-00">{{ group.label }}</span>
            <span>({{ group.items.length }})</span>
          </div>

          <div class="divide-y divide-border">
            <button
              v-for="marker in group.items"
              :key="marker.id"
              type="button"
              class="flex w-full items-start gap-4 py-4 text-left transition-colors hover:bg-base-00"
              @click="handleSelect(marker)"
            >
              <span class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                <template v-if="marker.category === 'projects'">
                  <span
                    v-if="marker.status === 100"
                    class="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white"
                  >
                    <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <svg v-else width="14" height="14" viewBox="0 0 14 14" class="rotate-[-90deg]">
                    <circle cx="7" cy="7" r="5.5" fill="none" stroke="#E5E7EB" stroke-width="2" />
                    <circle
                      cx="7"
                      cy="7"
                      r="5.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      pathLength="100"
                      stroke-dasharray="100"
                      :stroke-dashoffset="marker.status !== undefined ? 100 - marker.status : 100"
                      class="text-primary"
                    />
                  </svg>
                </template>
                <span v-else class="h-2.5 w-2.5 rounded-full" :class="marker.category === 'travel' ? 'bg-orange' : 'bg-purple'" />
              </span>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="min-w-0 flex-1 truncate text-[18px] font-medium leading-6 text-text-00">
                    {{ marker.title }}
                  </h3>
                  <span
                    v-if="marker.distance"
                    class="shrink-0 rounded-[4px] bg-base-00 px-2 py-0.5 text-xs leading-4 text-text-01"
                  >
                    {{ marker.distance }}
                  </span>
                </div>

                <template v-if="marker.category === 'projects'">
                  <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-4 text-text-01">
                    <span>Старт: {{ formatYear(marker.date) }}</span>
                    <span>•</span>
                    <span>Финиш: {{ getProjectStatusText(marker.status) }}</span>
                  </div>
                </template>

                <template v-else>
                  <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-4 text-text-01">
                    <BaseIcon name="location" class="h-3 w-3 shrink-0 text-text-01" />
                    <span>{{ marker.city }}</span>
                    <span v-if="marker.date">{{ formatYear(marker.date) }}</span>
                    <span v-if="marker.category === 'sport' && getSportType(marker)" class="inline-flex items-center gap-1">
                      <BaseIcon :name="getSportTypeIcon(marker)" class="text-text-01" size="14px" />
                      <span>{{ getSportType(marker) }}</span>
                    </span>
                  </div>

                  <p v-if="marker.description" class="mt-1 line-clamp-2 text-sm leading-5 text-[#4b4b4b]">
                    {{ marker.description }}
                  </p>

                  <div
                    v-if="marker.category === 'sport' && getSportTagLabels(marker).length"
                    class="mt-2 flex flex-wrap gap-1.5"
                  >
                    <span
                      v-for="tag in getSportTagLabels(marker)"
                      :key="tag"
                      class="rounded-[4px] bg-base-00 px-2 py-1 text-xs leading-4 text-text-01"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </template>
              </div>
            </button>
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
