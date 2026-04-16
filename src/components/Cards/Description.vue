<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Marker } from '../../data/mock'
import { useMapStore } from '../../stores/map'
import BaseIcon from '../BaseIcon.vue'
import Button from '../Button.vue'

interface Props {
  tasks?: Marker[]
  taskIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  tasks: () => [],
  taskIndex: 0,
})

const emit = defineEmits<{
  'update:taskIndex': [value: number]
}>()

const mapStore = useMapStore()
const isExpanded = ref(false)

const marker = computed(() => mapStore.selectedMarker)
const hasTasks = computed(() => props.tasks.length > 0)

// Если есть задачи, показываем активную задачу, иначе сам маркер.
const currentTask = computed(() => {
  if (!hasTasks.value) return marker.value
  return props.tasks[Math.min(props.taskIndex, props.tasks.length - 1)] || marker.value
})

const completedCount = computed(() => props.tasks.filter(task => task.status === 'completed').length)
const totalCount = computed(() => props.tasks.length)

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const formatMonthYear = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

// Длинный текст сворачиваем, пока пользователь не раскроет его вручную.
const displayedDescription = computed(() => {
  const text = currentTask.value?.description || ''
  if (isExpanded.value || text.length <= 120) {
    return text
  }

  return `${text.slice(0, 120).trimEnd()}...`
})

const heroImage = computed(() => currentTask.value?.images?.[0] ?? marker.value?.images?.[0] ?? null)
const secondaryImage = computed(() => currentTask.value?.images?.[1] ?? marker.value?.images?.[1] ?? null)

const canGoPrev = computed(() => hasTasks.value && props.taskIndex > 0)
const canGoNext = computed(() => hasTasks.value && props.taskIndex < props.tasks.length - 1)

const handleClose = () => {
  mapStore.clearSelection()
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const goPrev = () => {
  if (!canGoPrev.value) return
  emit('update:taskIndex', props.taskIndex - 1)
}

const goNext = () => {
  if (!canGoNext.value) return
  emit('update:taskIndex', props.taskIndex + 1)
}
</script>

<template>
  <div v-if="currentTask" class="w-[409px] min-h-[640px] bg-white rounded-card border border-border p-4 relative flex flex-col">
    <button
      class="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-button bg-base-00 text-text-01 hover:text-text-00 transition-colors"
      @click="handleClose"
    >
      <BaseIcon name="close" class="w-5 h-5" />
    </button>

    <div class="flex flex-col gap-4">
      <div v-if="heroImage" class="flex gap-2 overflow-hidden">
        <img
          :src="heroImage.url"
          :alt="currentTask.title"
          class="h-[156px] w-[285px] rounded-2xl object-cover flex-shrink-0"
        >

        <img
          v-if="secondaryImage"
          :src="secondaryImage.url"
          :alt="currentTask.title"
          class="h-[156px] w-[84px] rounded-2xl object-cover flex-shrink-0"
        >
      </div>

      <div>
        <h3 class="text-base font-medium text-text-00 flex-1 min-w-0">
          {{ currentTask.title }}
        </h3>

        <div class="mt-1 flex items-center gap-2 text-sm text-text-01">
          <svg class="h-4 w-4 flex-shrink-0 text-text-01" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" />
            <circle cx="12" cy="11" r="2.5" stroke-width="2" />
          </svg>
          <span>{{ currentTask.city }}</span>
        </div>
      </div>

      <p class="text-sm leading-6 text-text-00">
        {{ displayedDescription }}
      </p>

      <button
        type="button"
        class="inline-flex items-center gap-1 self-start text-sm font-medium text-primary hover:text-primary-hover"
        @click="toggleExpanded"
      >
        {{ isExpanded ? 'Скрыть текст' : 'Полный текст' }}
        <svg class="h-4 w-4 transition-transform" :class="isExpanded ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div v-if="currentTask.date" class="text-sm text-text-01">
        {{ formatMonthYear(currentTask.date) }}
      </div>

      <div v-if="hasTasks" class="mt-1 text-sm text-text-01">
        Выполнено {{ completedCount }}/{{ totalCount }}
      </div>

      <div v-if="hasTasks" class="mt-auto pt-6 flex flex-col items-center gap-3">
        <div class="flex w-full gap-2">
          <Button variant="base" size="lg" class="flex-1" :disabled="!canGoPrev" @click="goPrev">
            Назад
          </Button>
          <Button variant="primary" size="lg" class="flex-1" :disabled="!canGoNext" @click="goNext">
            Далее
          </Button>
        </div>

        <div class="flex items-center gap-2">
          <span
            v-for="(_, idx) in tasks"
            :key="idx"
            data-slide-dot
            class="h-2 w-2 rounded-full"
            :class="idx === taskIndex ? 'bg-text-00' : 'border border-text-01'"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>
