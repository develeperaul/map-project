<script setup lang="ts">
import { ref, computed } from 'vue'
import Input from './Input.vue'
import Checkbox from './Checkbox.vue'
import Calendar from './Calendar.vue'

interface Sport {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
}

interface Props {
  modelValue?: {
    sports: string[]
    dateRange: { start: Date | null; end: Date | null }
    tags: string[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    sports: [],
    dateRange: { start: null, end: null },
    tags: []
  })
})

const emit = defineEmits<{
  'update:modelValue': [value: { sports: string[]; dateRange: { start: Date | null; end: Date | null }; tags: string[] }]
}>()

const searchQuery = ref('')

const sports: Sport[] = [
  { id: 'running', name: 'Бег' },
  { id: 'cycling', name: 'Велоспорт' },
  { id: 'rowing', name: 'Гребля' },
  { id: 'athletics', name: 'Легкая атлетика' },
  { id: 'swimming', name: 'Плавание' },
  { id: 'tennis', name: 'Теннис' },
  { id: 'basketball', name: 'Баскетбол' },
  { id: 'football', name: 'Футбол' },
]

const tags: Tag[] = [
  { id: 'beginner', name: 'Для начинающих' },
  { id: 'intermediate', name: 'Средний уровень' },
  { id: 'advanced', name: 'Продвинутый' },
  { id: 'competition', name: 'Соревнования' },
  { id: 'recreation', name: 'Отдых' },
  { id: 'training', name: 'Тренировка' },
]

const filteredSports = computed(() => {
  if (!searchQuery.value) return sports
  return sports.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filterData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedSports = computed({
  get: () => filterData.value.sports,
  set: (sports) => filterData.value = { ...filterData.value, sports }
})

const selectedTags = computed({
  get: () => filterData.value.tags,
  set: (tags) => filterData.value = { ...filterData.value, tags }
})

const dateRange = computed({
  get: () => filterData.value.dateRange,
  set: (dateRange) => filterData.value = { ...filterData.value, dateRange }
})

const isSportSelected = (sportId: string) => {
  return selectedSports.value.includes(sportId)
}

const isTagSelected = (tagId: string) => {
  return selectedTags.value.includes(tagId)
}

const toggleSport = (sportId: string) => {
  const current = [...selectedSports.value]
  const index = current.indexOf(sportId)
  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(sportId)
  }
  selectedSports.value = current
}

const toggleTag = (tagId: string) => {
  const current = [...selectedTags.value]
  const index = current.indexOf(tagId)
  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(tagId)
  }
  selectedTags.value = current
}
</script>

<template>
  <div class="flex flex-col gap-4 w-87">
    <!-- Вид спорта -->
    <div class="flex flex-col gap-4">
      <h3 class="text-text-00 font-medium text-base leading-6">
        Вид спорта
      </h3>

      <Input
        v-model="searchQuery"
        placeholder="Поиск по виду спорта..."
        left-icon
        class="bg-base-light-00"
      />

      <div class="flex flex-col gap-2 max-h-90.25 overflow-y-auto">
        <div
          v-for="sport in filteredSports"
          :key="sport.id"
          class="flex items-center gap-4 py-3"
        >
          <Checkbox
            :model-value="isSportSelected(sport.id)"
            :label="sport.name"
            @update:model-value="toggleSport(sport.id)"
          />
        </div>
      </div>
    </div>

    <!-- Дата -->
    <div class="flex flex-col gap-4">
      <h3 class="text-text-00 font-medium text-base leading-6">
        Дата
      </h3>

      <Calendar
        v-model="dateRange"
        mode="range"
        :show-actions="true"
        class="border border-border rounded-card p-4 bg-white"
      />
    </div>

    <!-- Теги -->
    <div class="flex flex-col gap-4">
      <h3 class="text-text-00 font-medium text-base leading-6">
        Теги
      </h3>

      <div class="flex flex-col gap-2">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="flex items-center gap-4 py-3"
        >
          <Checkbox
            :model-value="isTagSelected(tag.id)"
            :label="tag.name"
            @update:model-value="toggleTag(tag.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
