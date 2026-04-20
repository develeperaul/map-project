<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'
import Button from './Button.vue'
import Checkbox from './Checkbox.vue'
import Input from './Input.vue'
import Calendar from './Calendar.vue'

const props = withDefaults(defineProps<{
  embedded?: boolean
}>(), {
  embedded: false,
})

const emit = defineEmits<{
  close: []
}>()

const sportSearch = ref('')
const locationSearch = ref('')

const selectedSports = ref(['Бег'])
const selectedLocations = ref(['Африка'])
const selectedTags = ref(['#Велоспорт'])

const sports = [
  'Бег',
  'Велоспорт',
  'Гребля',
  'Легкая атлетика',
  'Триатлон',
  'Плавание',
  'Конькобежный спорт',
]

const locations = [
  'Африка',
  'Япония',
  'Ирландия',
  'Исландия',
  'Новая Зеландия',
  'Южная Корея',
  'Перу',
]

const tags = [
  '#Бег',
  '#КазанскийМарафон',
  '#Техника',
  '#Плавание',
  '#Велоспорт',
  '#Гравел',
  '#Движение',
  '#Спорт',
]

const filteredSports = computed(() =>
  sports.filter((sport) => sport.toLowerCase().includes(sportSearch.value.toLowerCase())),
)

const filteredLocations = computed(() =>
  locations.filter((location) => location.toLowerCase().includes(locationSearch.value.toLowerCase())),
)

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

const toggleLocation = (location: string) => {
  toggleValue(selectedLocations.value, location)
}

const toggleTag = (tag: string) => {
  toggleValue(selectedTags.value, tag)
}

const resetFilter = () => {
  sportSearch.value = ''
  locationSearch.value = ''
  selectedSports.value = ['Бег']
  selectedLocations.value = ['Африка']
  selectedTags.value = ['#Велоспорт']
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div :class="props.embedded ? 'flex h-full w-full flex-col bg-white' : 'mx-auto w-full max-w-[396px] rounded-[28px] border border-black/8 bg-white p-4 shadow-[0_18px_50px_rgba(26,26,26,0.14)]'">
    <div :class="props.embedded ? 'mb-4 flex items-center justify-between px-4 pt-4' : 'mb-4 flex items-center justify-between'">
      <h3 class="text-[20px] font-semibold leading-7 text-text-00">Фильтр</h3>
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-[12px] bg-base-00 text-text-01 transition-colors hover:bg-base-01"
        aria-label="Закрыть фильтр"
        @click="handleClose"
      >
        <BaseIcon name="close" class="h-6 w-6" />
      </button>
    </div>

    <div class="h-[1px] bg-border" />

    <div :class="props.embedded ? 'mt-6 flex-1 space-y-8 overflow-y-auto px-4 pb-4 pr-1' : 'mt-6 h-[calc(100vh-15rem)] min-h-[720px] max-h-[1520px] space-y-8 overflow-y-auto pr-1'">
      <section>
        <Calendar />
      </section>

      <div class="h-[1px] bg-border" />

      <section class="space-y-4">
        <h4 class="text-[16px] font-semibold leading-6 text-text-00">Вид спорта</h4>
        <Input
          v-model="sportSearch"
          left-icon
          placeholder="Поиск по виду спорта..."
          class="w-full"
        />

        <div class="max-h-[300px] overflow-y-auto">
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
      </section>

      <div class="h-[1px] bg-border" />

      <section class="space-y-4">
        <h4 class="text-[16px] font-semibold leading-6 text-text-00">Локация</h4>
        <Input
          v-model="locationSearch"
          left-icon
          placeholder="Поиск по локации..."
          class="w-full"
        />

        <div class="max-h-[300px] overflow-y-auto">
          <div
            v-for="location in filteredLocations"
            :key="location"
            class="border-b border-border last:border-b-0"
          >
            <Checkbox
              :model-value="selectedLocations.includes(location)"
              :label="location"
              @update:model-value="toggleLocation(location)"
            />
          </div>
        </div>
      </section>

      <div class="h-[1px] bg-border" />

      <section class="space-y-4">
        <h4 class="text-[16px] font-semibold leading-6 text-text-00">#теги</h4>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in tags"
            :key="tag"
            type="button"
            class="rounded-[10px] px-3 py-2 text-[14px] font-medium leading-5 transition-colors"
            :class="selectedTags.includes(tag) ? 'bg-[#343A40] text-white' : 'bg-base-00 text-text-00 hover:bg-base-01'"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </section>
    </div>

    <div :class="props.embedded ? 'mt-auto flex items-center gap-2 border-t border-border px-4 py-4' : 'mt-6 flex items-center gap-2'">
      <Button variant="primary" size="xl" class="flex-1">Применить</Button>
      <Button variant="base" size="xl" class="shrink-0" @click="resetFilter">Сбросить</Button>
    </div>
  </div>
</template>
