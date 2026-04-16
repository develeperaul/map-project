<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue'

interface Props {
  project: Marker
  activeTaskIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  activeTaskIndex: 0,
})

const emit = defineEmits<{
  back: []
  selectTask: [task: Marker, index: number]
}>()

const tasks = computed(() => props.project.tasks || [])
const taskRefs = ref<Record<string, HTMLElement | null>>({})

const completedCount = computed(() => tasks.value.filter(task => task.status === 'completed').length)
const totalCount = computed(() => tasks.value.length)

const isCompleted = (status: number | 'completed' | undefined) => status === 'completed'

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

const projectStartYear = computed(() => new Date(props.project.date).getFullYear())
const projectEndLabel = computed(() => (isCompleted(props.project.status) ? 'Завершен' : 'В процессе'))
const activeTaskId = computed(() => tasks.value[props.activeTaskIndex]?.id ?? null)

const handleTaskClick = (task: Marker, index: number) => {
  emit('selectTask', task, index)
}

const setTaskRef = (id: string, el: Element | null) => {
  taskRefs.value[id] = el instanceof HTMLElement ? el : null
}

const scrollToItem = (id: string | null) => {
  if (!id) return
  const el = taskRefs.value[id]
  el?.scrollIntoView?.({ block: 'start' })
}

watch([activeTaskId, tasks], async ([id]) => {
  await nextTick()
  scrollToItem(id)
}, { flush: 'post', immediate: true })

defineExpose({
  scrollToItem,
})
</script>

<template>
  <div class="w-[409px] bg-white rounded-card border border-border flex flex-col">
    <div class="p-4 border-b border-border">
      <div class="flex items-start gap-3">
        <button
          class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-button bg-base-00 text-text-01 hover:text-text-00 transition-colors"
          @click="emit('back')"
        >
          <BaseIcon name="arrow-left" class="w-5 h-5" />
        </button>

        <div class="min-w-0 flex-1 text-center pr-10">
          <h3 class="text-base font-medium text-text-00 truncate">{{ project.title }}</h3>
          <p class="mt-1 text-sm text-text-01">Выполнено {{ completedCount }}/{{ totalCount }}</p>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center gap-2 text-sm text-text-01">
        <span>Старт: {{ projectStartYear }}</span>
        <span>•</span>
        <span>Финиш: {{ projectEndLabel }}</span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
      <div
        v-for="(task, index) in tasks"
        :key="task.id"
        class="px-4 py-5 border-b border-border last:border-b-0 cursor-pointer hover:bg-base-00 transition-colors"
        :class="{ 'bg-base-00': index === activeTaskIndex }"
        :data-task-active="index === activeTaskIndex"
        :ref="el => setTaskRef(task.id, el)"
        @click="handleTaskClick(task, index)"
      >
        <div class="flex items-start gap-3">
          <div
            class="mt-1 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full"
            :class="isCompleted(task.status) ? 'bg-text-00 text-white' : 'border border-primary bg-white'"
          >
            <svg v-if="isCompleted(task.status)" class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <div v-else class="h-1.5 w-1.5 rounded-full bg-primary"></div>
          </div>

          <div class="min-w-0 flex-1">
            <h4 class="text-base font-medium text-text-00 truncate">{{ task.title }}</h4>
            <p class="mt-1 text-sm text-text-01 truncate">{{ task.city }}</p>
            <p class="mt-1 text-sm text-text-01">{{ task.description }}</p>
            <p class="mt-1 text-sm text-text-01">{{ formatMonthYear(task.date) }}</p>
          </div>
        </div>
      </div>

      <div v-if="tasks.length === 0" class="p-4 text-center text-text-01 text-sm">
        Нет задач
      </div>
    </div>
  </div>
</template>
