<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMapStore } from '../../stores/map'
import { formatDate } from '../../utils/date'
import Calendar from '../Calendar.vue'

const mapStore = useMapStore()

const showCalendar = ref(false)
const tempDateRange = ref<{ start: Date | null; end: Date | null }>({
  start: null,
  end: null
})

const showDateField = computed(() => true)
const showLocation = computed(() => true)
const showSportType = computed(() => mapStore.category === 'sport')
const showTags = computed(() => mapStore.category === 'sport')

const selectedSportTypes = ref<string[]>([])
const selectedTagIds = ref<number[]>([])

const dateText = computed(() => {
  const { start, end } = mapStore.dateRange
  if (!start && !end) return ''
  if (start && end) return `${formatDate(start)} - ${formatDate(end)}`
  if (start) return `${formatDate(start)} - ...`
  return `... - ${formatDate(end)}`
})

const isDateFilled = computed(() => !!dateText.value)

const handleDateClick = () => {
  showCalendar.value = !showCalendar.value
}

const handleDateSelect = (range: { start: Date | null; end: Date | null }) => {
  tempDateRange.value = range
}

// Фиксируем временный диапазон только после явного применения.
const handleDateApply = () => {
  if (tempDateRange.value.start && tempDateRange.value.end) {
    const format = (d: Date) => {
      const y = d.getFullYear()
      const m = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      return `${y}-${m}-${day}`
    }
    mapStore.setDateRange({
      start: format(tempDateRange.value.start),
      end: format(tempDateRange.value.end)
    })
  }
  showCalendar.value = false
}

const handleDateReset = () => {
  tempDateRange.value = { start: null, end: null }
  mapStore.setDateRange({ start: null, end: null })
}

const handleRemoveDate = () => {
  mapStore.setDateRange({ start: null, end: null })
  tempDateRange.value = { start: null, end: null }
}

const handleSportTypeToggle = (type: string) => {
  const idx = selectedSportTypes.value.indexOf(type)
  if (idx > -1) {
    selectedSportTypes.value.splice(idx, 1)
  } else {
    selectedSportTypes.value.push(type)
  }
}

const handleTagToggle = (tagId: number) => {
  const idx = selectedTagIds.value.indexOf(tagId)
  if (idx > -1) {
    selectedTagIds.value.splice(idx, 1)
  } else {
    selectedTagIds.value.push(tagId)
  }
}

// Сбрасываем и локальные, и сторовые фильтры одним действием.
const handleReset = () => {
  mapStore.resetFilters()
  selectedSportTypes.value = []
  selectedTagIds.value = []
  tempDateRange.value = { start: null, end: null }
}

const handleApply = () => {
  mapStore.setSportTypeFilter([...selectedSportTypes.value])
  mapStore.setTagFilter([...selectedTagIds.value])
  mapStore.applyFilters()
}

const handleClose = () => {
  mapStore.showFilterPanel = false
}
</script>

<template>
  <div class="w-[409px] bg-white rounded-card border border-border flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
    <div class="p-4 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-text-00">Фильтр</h2>
        <button 
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-base-01 transition-colors"
          @click="handleClose"
        >
          <svg class="w-4 h-4 text-text-01" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="showDateField" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text-01">Дата</label>
        <div 
          class="relative h-10 px-3 flex items-center gap-2 rounded-button border border-border bg-white cursor-pointer hover:border-primary-20 transition-colors"
          @click="handleDateClick"
        >
          <svg class="w-5 h-5 text-text-02" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="flex-1 text-sm" :class="isDateFilled ? 'text-text-00' : 'text-text-02'">
            {{ dateText || 'дд.мм.гггг - дд.мм.гггг' }}
          </span>
          <button 
            v-if="isDateFilled"
            class="w-5 h-5 flex items-center justify-center"
            @click.stop="handleRemoveDate"
          >
            <svg class="w-4 h-4 text-text-02" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="showCalendar" class="border border-border rounded-card p-3 bg-white">
          <Calendar
            mode="range"
            :model-value="tempDateRange"
            @update:model-value="handleDateSelect"
            @apply="handleDateApply"
            @reset="handleDateReset"
          />
        </div>
      </div>

      <div v-if="showLocation" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text-01">Локация</label>
        <select 
          class="h-10 px-3 rounded-button border border-border bg-white text-sm text-text-00 cursor-pointer focus:outline-none focus:border-primary"
          :value="mapStore.cityFilter || ''"
          @change="mapStore.setCityFilter(($event.target as HTMLSelectElement).value || null)"
        >
          <option value="">Все</option>
          <option 
            v-for="city in mapStore.locations" 
            :key="city" 
            :value="city"
          >
            {{ city }}
          </option>
        </select>
      </div>

      <div v-if="showSportType" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text-01">Вид спорта</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in mapStore.sportTypes"
            :key="type"
            class="h-7 px-3 rounded-chip text-sm transition-colors"
            :class="selectedSportTypes.includes(type) 
              ? 'bg-primary text-white' 
              : 'bg-base-01 text-text-00 hover:bg-primary-10'"
            @click="handleSportTypeToggle(type)"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <div v-if="showTags" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text-01">Теги</label>
        <button class="h-7 px-3 rounded-chip text-sm bg-base-01 text-text-01 hover:bg-primary-10 text-left">
          + Добавить
        </button>
        <div v-if="selectedTagIds.length > 0" class="flex flex-wrap gap-2 mt-1">
          <span
            v-for="tagId in selectedTagIds"
            :key="tagId"
            class="h-7 px-3 rounded-chip text-sm bg-primary text-white flex items-center gap-1"
          >
            {{ mapStore.availableTags.find(t => t.id === tagId)?.title }}
            <button @click="handleTagToggle(tagId)">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <button 
          class="flex-1 h-10 rounded-button bg-base-01 text-text-00 text-sm font-medium hover:bg-border transition-colors"
          @click="handleReset"
        >
          Сбросить
        </button>
        <button 
          class="flex-1 h-10 rounded-button bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          @click="handleApply"
        >
          Применить
        </button>
      </div>
    </div>
  </div>
</template>
