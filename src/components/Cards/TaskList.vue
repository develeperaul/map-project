<script setup lang="ts">
import { computed } from 'vue'

import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue';

interface Props {
  project: Marker
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
  selectTask: [task: Marker]
}>()

const tasks = computed(() => props.project.tasks || [])

const completedCount = computed(() => {
  return tasks.value.filter(t => t.status === 'completed').length
})

const totalCount = computed(() => tasks.value.length)

const isActive = (status: number | 'completed' | undefined) => typeof status === 'number'
const isCompleted = (status: number | 'completed' | undefined) => status === 'completed'

const getProgressProps = (status: number | 'completed' | undefined) => {
  const progress = typeof status === 'number' ? status : 0
  const circumference = 2 * Math.PI * 10
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference
  return { strokeDasharray, strokeDashoffset, progress }
}

const handleTaskClick = (task: Marker) => {
  emit('selectTask', task)
}
</script>

<template>
  <div class="w-[409px] bg-white rounded-card border border-border flex flex-col">
    <div class="p-4 border-b border-border flex items-center gap-3">
      <button 
        class="text-text-01 hover:text-text-00 transition-colors"
        @click="emit('back')"
      >
        <BaseIcon name="arrow-left" class="w-5 h-5" />
      </button>
      <h3 class="text-base font-medium text-text-00 flex-1 truncate">{{ project.title }}</h3>
      <div class="flex items-center gap-1 text-sm text-text-01">
        <span class="font-medium text-primary">{{ completedCount }}</span>
        <span>/</span>
        <span>{{ totalCount }}</span>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
      <div 
        v-for="task in tasks" 
        :key="task.id"
        class="px-4 py-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-base-00 transition-colors"
        @click="handleTaskClick(task)"
      >
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 flex-shrink-0 relative">
            <svg class="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#E5E4E7"
                stroke-width="2"
              />
              <circle
                v-if="isActive(task.status)"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#4527A0"
                stroke-width="2"
                stroke-linecap="round"
                v-bind="getProgressProps(task.status)"
              />
              <circle
                v-else-if="isCompleted(task.status)"
                cx="12"
                cy="12"
                r="10"
                fill="#1A1A1A"
              />
            </svg>
            <svg 
              v-if="isCompleted(task.status)" 
              class="w-3 h-3 absolute inset-0 m-auto text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-text-00 truncate">{{ task.title }}</h4>
            <p class="text-xs text-text-01 truncate">{{ task.description }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="tasks.length === 0" class="p-4 text-center text-text-01 text-sm">
        Нет задач
      </div>
    </div>
  </div>
</template>
