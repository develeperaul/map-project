<script setup lang="ts">
import { computed, nextTick, ref, watch, type ComponentPublicInstance } from 'vue'
import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue'

const props = withDefaults(defineProps<{
  project: Marker
  activeTaskIndex?: number
}>(), {
  activeTaskIndex: 0,
})

const emit = defineEmits<{
  back: []
  close: []
  select: [task: Marker, index: number]
}>()

const tasks = computed(() => props.project.tasks || [])
const taskRefs = ref<Record<string, HTMLElement | null>>({})

const completedCount = computed(() => tasks.value.filter(task => task.status === 'completed').length)
const totalCount = computed(() => tasks.value.length)
const activeTaskId = computed(() => tasks.value[props.activeTaskIndex]?.id ?? null)

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

const isCompleted = (status: Marker['status']) => status === 'completed'

const formatMonthYear = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

const setTaskRef = (id: string, el: Element | ComponentPublicInstance | null) => {
  taskRefs.value[id] = el instanceof HTMLElement ? el : null
}

const scrollToItem = (id: string | null) => {
  if (!id) return
  taskRefs.value[id]?.scrollIntoView?.({ block: 'start' })
}

watch(activeTaskId, async (id) => {
  await nextTick()
  scrollToItem(id)
}, { flush: 'post', immediate: true })
</script>

<template>
  <div class="flex h-full min-h-0 flex-col bg-white px-4 pb-6">
    <div class="shrink-0 pb-6">
      <div class="flex items-start gap-4">
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01"
          aria-label="Назад к проектам"
          @click="emit('back')"
        >
          <BaseIcon name="arrow-left" class="h-4 w-4" size="16px" />
        </button>

        <div class="min-w-0 flex-1 text-center">
          <h3 class="truncate text-sm font-medium leading-5 text-text-dark">{{ project.title }}</h3>
          <p class="mt-0.5 text-xs font-normal leading-4 text-text-01">
            Выполнено {{ completedCount }}/{{ totalCount }}
          </p>
        </div>

        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01"
          aria-label="Закрыть задачи"
          @click="emit('close')"
        >
          <BaseIcon name="close" class="h-4 w-4" size="16px" />
        </button>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <button
        v-for="(task, index) in tasks"
        :key="task.id"
        type="button"
        class="flex w-full cursor-pointer items-start gap-4 px-3 py-4 text-left transition-colors hover:bg-base-light-00"
        :class="{ 'bg-base-light-00': index === activeTaskIndex }"
        :data-task-active="index === activeTaskIndex"
        :ref="el => setTaskRef(task.id, el)"
        @click="emit('select', task, index)"
      >
        <span class="mt-1 flex h-6 w-4 shrink-0 items-start justify-center">
          <span
            v-if="isCompleted(task.status)"
            class="flex h-4 w-4 items-center justify-center rounded-full bg-secondary-dark text-white"
          >
            <BaseIcon name="check" class="h-2.5 w-2.5" size="10px" />
          </span>
          <span v-else class="mt-px h-3.5 w-3.5 rounded-full border-2 border-primary bg-white"></span>
        </span>

        <span class="min-w-0 flex-1">
          <span class="block truncate text-lg font-medium leading-6 text-text-dark">{{ task.title }}</span>
          <span class="mt-1 block truncate text-xs font-normal leading-4 text-text-01">{{ task.city }}</span>
          <span class="mt-2 line-clamp-2 text-sm font-normal leading-5 text-text-01">{{ task.description }}</span>
          <span v-if="task.date" class="mt-2 block text-xs font-normal leading-4 text-text-muted">
            {{ formatMonthYear(task.date) }}
          </span>
        </span>
      </button>

      <div v-if="tasks.length === 0" class="p-4 text-center text-sm text-text-01">
        Нет задач
      </div>
    </div>
  </div>
</template>
