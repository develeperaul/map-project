<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue'

const props = withDefaults(defineProps<{
  marker: Marker
  project?: Marker | null
  tasks?: Marker[]
  taskIndex?: number
}>(), {
  project: null,
  tasks: () => [],
  taskIndex: 0,
})

const emit = defineEmits<{
  back: []
  close: []
  'update:taskIndex': [value: number]
}>()

const isExpanded = ref(false)
const touchStartX = ref<number | null>(null)
const hasTasks = computed(() => props.tasks.length > 0)
const currentTask = computed(() => {
  if (!hasTasks.value) return props.marker
  return props.tasks[Math.min(props.taskIndex, props.tasks.length - 1)] || props.marker
})

const completedCount = computed(() => props.tasks.filter(task => task.status === 'completed').length)
const totalCount = computed(() => props.tasks.length)
const currentImages = computed(() => {
  const ownImages = currentTask.value.images || []
  const fallbackImages = props.project?.images || []
  return ownImages.length ? ownImages : fallbackImages
})
const galleryImages = computed(() => currentImages.value.slice(0, 5))

const isCompleted = computed(() => currentTask.value.status === 'completed')
const isActive = computed(() => typeof currentTask.value.status === 'number')

const canGoPrev = computed(() => hasTasks.value && props.taskIndex > 0)
const canGoNext = computed(() => hasTasks.value && props.taskIndex < props.tasks.length - 1)

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

const displayedDescription = computed(() => {
  const text = currentTask.value.description || ''
  if (isExpanded.value || text.length <= 120) return text
  return `${text.slice(0, 120).trimEnd()}...`
})

const setTaskIndex = (value: number) => {
  if (!hasTasks.value) return
  const next = Math.max(0, Math.min(value, props.tasks.length - 1))
  if (next !== props.taskIndex) {
    emit('update:taskIndex', next)
  }
}

const goPrev = () => {
  if (canGoPrev.value) setTaskIndex(props.taskIndex - 1)
}

const goNext = () => {
  if (canGoNext.value) setTaskIndex(props.taskIndex + 1)
}

const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0]?.clientX ?? null
}

const handleTouchEnd = (event: TouchEvent) => {
  if (touchStartX.value === null) return

  const endX = event.changedTouches[0]?.clientX ?? touchStartX.value
  const diff = endX - touchStartX.value
  touchStartX.value = null

  if (Math.abs(diff) < 48) return
  if (diff < 0) {
    goNext()
    return
  }
  goPrev()
}

watch(() => currentTask.value.id, () => {
  isExpanded.value = false
})
</script>

<template>
  <div
    class="fixed inset-0 z-[70] overflow-hidden bg-transparent pointer-events-auto overscroll-contain"
    @touchstart.passive="handleTouchStart"
    @touchend.passive="handleTouchEnd"
  >
    <div class="absolute inset-x-0 bottom-0 flex max-h-[82vh] min-h-0 flex-col px-4 pb-6">
      <div v-if="galleryImages.length" class="mb-3 flex shrink-0 gap-2 overflow-x-auto pb-1">
        <img
          v-for="(image, index) in galleryImages"
          :key="`${image.url}-${index}`"
          :src="image.url"
          :alt="currentTask.title"
          class="h-24 w-[148px] shrink-0 rounded-lg object-cover"
        >
      </div>

      <div class="flex min-h-0 flex-col overflow-hidden rounded-card bg-white shadow-[0_4px_20px_rgba(20,20,20,0.12)]">
        <div class="flex items-start gap-4 p-4 pb-3">
          <button
            v-if="project"
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01"
            aria-label="Назад к задачам"
            @click="emit('back')"
          >
            <BaseIcon name="arrow-left" class="h-4 w-4" size="16px" />
          </button>
          <span v-else class="h-10 w-10 shrink-0" aria-hidden="true"></span>

          <div class="min-w-0 flex-1 text-center">
            <h3 class="truncate text-sm font-medium leading-5 text-text-dark">
              {{ project?.title || currentTask.title }}
            </h3>
            <p v-if="hasTasks" class="mt-0.5 text-xs font-normal leading-4 text-text-01">
              Выполнено {{ completedCount }}/{{ totalCount }}
            </p>
          </div>

          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01"
            aria-label="Закрыть описание"
            @click="emit('close')"
          >
            <BaseIcon name="close" class="h-4 w-4" size="16px" />
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5">
          <div class="flex items-start gap-3">
            <div v-if="currentTask.category === 'projects'" class="mt-1 shrink-0">
              <span
                v-if="isCompleted"
                class="flex h-4 w-4 items-center justify-center rounded-full bg-secondary-dark text-white"
              >
                <BaseIcon name="check" class="h-2.5 w-2.5" size="10px" />
              </span>

              <span v-else-if="isActive" class="block h-4 w-4 rounded-full border-2 border-primary bg-white"></span>
            </div>

            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-medium leading-6 text-text-dark">{{ currentTask.title }}</h4>
              <div v-if="currentTask.city" class="mt-1 flex items-center gap-2 text-xs leading-4 text-text-01">
                <svg class="h-4 w-4 shrink-0 text-text-01" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" />
                  <circle cx="12" cy="11" r="2.5" stroke-width="2" />
                </svg>
                <span class="truncate">{{ currentTask.city }}</span>
              </div>
            </div>

            <span class="h-10 w-10 shrink-0" aria-hidden="true"></span>
          </div>

          <p v-if="displayedDescription" class="mt-4 text-sm font-normal leading-5 text-text-dark">
            {{ displayedDescription }}
          </p>

          <div v-if="currentTask.date" class="mt-2 text-xs leading-4 text-text-muted">
            {{ formatMonthYear(currentTask.date) }}
          </div>

          <button
            v-if="currentTask.description.length > 120"
            type="button"
            class="mt-3 inline-flex items-center gap-2 text-sm font-medium leading-5 text-primary transition-colors hover:text-primary-hover"
            @click="isExpanded = !isExpanded"
          >
            {{ isExpanded ? 'Скрыть текст' : 'Полный текст' }}
            <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isExpanded }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div v-if="hasTasks" class="mt-4 flex items-center justify-center gap-2" aria-label="Задачи проекта">
            <button
              v-for="(_, index) in tasks"
              :key="index"
              type="button"
              class="h-3 w-3 rounded-full border transition-colors"
              :class="index === taskIndex ? 'border-secondary-dark bg-secondary-dark' : 'border-primary bg-white'"
              :aria-label="`Открыть задачу ${index + 1}`"
              :aria-current="index === taskIndex ? 'step' : undefined"
              data-slide-dot
              @click="setTaskIndex(index)"
            ></button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
