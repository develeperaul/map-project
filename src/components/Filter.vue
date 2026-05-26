<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'
import Button from './Button.vue'
import Checkbox from './Checkbox.vue'
import Input from './Input.vue'
import Calendar from './Calendar.vue'
import EmptyState from './EmptyState.vue'
import { useMapStore } from '../stores/map'

const props = withDefaults(defineProps<{
  embedded?: boolean
  mode?: 'full' | 'calendar'
}>(), {
  embedded: false,
  mode: 'full',
})

const emit = defineEmits<{
  close: []
}>()

const mapStore = useMapStore()

const sportSearch = ref('')
const locationSearch = ref('')
const tagSearch = ref('')

const normalizeSearch = (value: string) => value.trim().toLowerCase()

const filteredSports = computed(() =>
  mapStore.sportTypes.filter(sport => normalizeSearch(sport).includes(normalizeSearch(sportSearch.value))),
)

const parseDateString = (value: string | null) => {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

const formatDateForStore = (value: Date | null) => {
  if (!value) return null

  const year = value.getFullYear()
  const month = (value.getMonth() + 1).toString().padStart(2, '0')
  const day = value.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

const isSport = computed(() => mapStore.category === 'sport')
const isCalendarMode = computed(() => props.mode === 'calendar')

const dateRange = ref<{ start: Date | null; end: Date | null }>({
  start: parseDateString(mapStore.dateRange.start),
  end: parseDateString(mapStore.dateRange.end),
})

const selectedSports = ref<string[]>([...mapStore.sportTypeFilter])
const selectedLocations = ref<string[]>([...mapStore.cityFilter])
const selectedTags = ref<string[]>([...mapStore.tagFilter])

const filteredLocations = computed(() =>
  mapStore.locations.filter((location) => normalizeSearch(location).includes(normalizeSearch(locationSearch.value))),
)

const filteredTags = computed(() => {
  const query = normalizeSearch(tagSearch.value)
  if (!query) return mapStore.availableTags

  return mapStore.availableTags.filter(tag => normalizeSearch(tag.title).includes(query))
})

const toggleValue = (bucket: typeof selectedSports.value, value: string) => {
  const index = bucket.indexOf(value)
  if (index >= 0) {
    bucket.splice(index, 1)
    return false
  }

  bucket.push(value)
  return true
}

const toggleSport = (sport: string) => {
  toggleValue(selectedSports.value, sport)
}

const setLocationSelected = (location: string, selected: boolean) => {
  const index = selectedLocations.value.indexOf(location)
  if (selected) {
    if (index === -1) {
      selectedLocations.value.push(location)
    }
  } else if (index >= 0) {
    selectedLocations.value.splice(index, 1)
  }
}

const normalizeTag = (value: string) => value.trim().toLowerCase()

const toggleTag = (tagTitle: string) => {
  const tagValue = normalizeTag(tagTitle)
  const index = selectedTags.value.indexOf(tagValue)
  if (index >= 0) {
    selectedTags.value.splice(index, 1)
    return false
  }

  selectedTags.value.push(tagValue)
  return true
}

const resetFilter = () => {
  sportSearch.value = ''
  locationSearch.value = ''
  tagSearch.value = ''
  dateRange.value = { start: null, end: null }

  if (isCalendarMode.value) {
    mapStore.clearDateRange()
    return
  }

  selectedSports.value = []
  selectedLocations.value = []
  selectedTags.value = []
  mapStore.resetFilters()
}

const handleClose = () => {
  mapStore.showFilterPanel = false
  emit('close')
}

const handleApply = () => {
  mapStore.setDateRange({
    start: formatDateForStore(dateRange.value.start),
    end: formatDateForStore(dateRange.value.end),
  })

  if (isCalendarMode.value) {
    mapStore.applyFilters()
    emit('close')
    return
  }

  mapStore.setCityFilter([...selectedLocations.value])
  if (isSport.value) {
    mapStore.setSportTypeFilter([...selectedSports.value])
    mapStore.setTagFilter([...selectedTags.value])
  }
  mapStore.applyFilters()
  emit('close')
}
</script>

<template>
  <div :class="props.embedded ? 'flex h-full w-full flex-col bg-white' : 'w-[409px] bg-white rounded-card border border-border flex flex-col max-h-[calc(100vh-300px)] overflow-hidden'" style="box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.30), 0 2px 6px 2px rgba(0, 0, 0, 0.15);">
    <div :class="props.embedded ? 'mb-4 flex items-center justify-between px-4 pt-1' : 'flex items-center justify-between p-4'">
      <h3 class=" text-body-l lg:text-[20px] font-medium leading-7 text-text-00">Фильтр</h3>
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-[12px] bg-base-00 text-text-00 transition-colors hover:bg-base-01"
        aria-label="Закрыть фильтр"
        @click="handleClose"
      >
        <BaseIcon name="close" class="h-5 w-5" />
      </button>
    </div>

    <div class="h-[1px] bg-border" />

    <div :class="props.embedded ? 'pt-4 flex-1 space-y-4 overflow-y-auto px-4 pb-4 ' : 'mt-6 min-h-0 flex-1 space-y-8 overflow-y-auto px-4 pb-4 pr-3'">
      <section>
        <Calendar v-model="dateRange" />
      </section>
      <template v-if="!isCalendarMode && isSport">
        <div class="h-[1px] bg-border" />
  
        <section  class="space-y-4">
          <h4 class="text-[16px] font-medium leading-6 text-text-00">Вид спорта</h4>
          <Input
            v-model="sportSearch"
            left-icon
            placeholder="Поиск по виду спорта..."
            clearable
            class="w-full"
          />
  
          <div v-if="filteredSports.length > 0" class="max-h-[300px] overflow-y-auto">
            <div
              v-for="sport in filteredSports"
              :key="sport"
              class="border-b border-border last:border-b-0"
            >
              <Checkbox
                :model-value="selectedSports.includes(sport)"
                :label="sport"
                @update:model-value="toggleSport(sport)"
              />
            </div>
          </div>
  
          <EmptyState
            v-else-if="normalizeSearch(sportSearch)"
            icon="search"
            title="Ничего не найдено"
            description="Измените параметры поиска"
          />
        </section>
      </template>
      <template v-if="!isCalendarMode && (mapStore.locations.length > 0 || normalizeSearch(locationSearch))" >

        <div class="h-[1px] bg-border" />
  
        <section class="space-y-4">
          <h4 class="text-[16px] font-font-medium leading-6 text-text-00">Локация</h4>
          <Input
            v-model="locationSearch"
            left-icon
            placeholder="Поиск по локации..."
            clearable
            class="w-full"
          />
  
          <div v-if="filteredLocations.length > 0" class="max-h-[300px] overflow-y-auto">
            <div
              v-for="location in filteredLocations"
              :key="location"
              class="border-b border-border last:border-b-0"
            >
              <Checkbox
                :model-value="selectedLocations.includes(location)"
                :label="location"
                @update:model-value="setLocationSelected(location, $event)"
              />
            </div>
          </div>
  
          <EmptyState
            v-else-if="normalizeSearch(locationSearch)"
            icon="search"
            title="Ничего не найдено"
            description="Измените параметры поиска"
          />
        </section>
      </template>
      <template v-if="!isCalendarMode && isSport && filteredTags.length > 0" >
        <div class="h-[1px] bg-border" />
  
        <section v-if="isSport" class="space-y-4">
          <h4 class="text-[16px] font-semibold leading-6 text-text-00">#теги</h4>
  
          <Input
            v-model="tagSearch"
            left-icon
            placeholder="Поиск по тегу..."
            clearable
            class="w-full"
          />
  
          <div v-if="filteredTags.length > 0" class="flex flex-wrap gap-2">
            <button
              v-for="tag in filteredTags"
              :key="tag.title"
              type="button"
              class="rounded-[10px] px-3 py-2 text-[14px] font-medium leading-5 transition-colors"
              :class="selectedTags.includes(normalizeTag(tag.title)) ? 'bg-[#343A40] text-white' : 'bg-base-00 text-text-00 hover:bg-base-01'"
              @click="toggleTag(tag.title)"
            >
             # {{ tag.title }}
            </button>
          </div>
  
          <EmptyState
            v-else-if="normalizeSearch(tagSearch)"
            icon="search"
            title="Ничего не найдено"
            description="Измените параметры поиска"
          />
        </section>
      </template>
    </div>

    <div :class="props.embedded ? 'mt-auto flex items-center gap-2 border-t border-border px-4 py-4' : 'shrink-0 flex items-center gap-2 border-t border-border bg-white px-4 py-4'">
      <Button variant="primary" size="xl" class="flex-1" @click="handleApply">Применить</Button>
      <Button variant="base" size="xl" class="shrink-0" @click="resetFilter">Сбросить</Button>
    </div>
  </div>
</template>
