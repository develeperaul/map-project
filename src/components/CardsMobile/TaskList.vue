<script setup lang="ts">
import type { Marker } from '../../data/mock'

const props = defineProps<{
  project: Marker
}>()

const emit = defineEmits<{
  close: []
  select: [task: Marker]
}>()

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-3 border-b border-border">
      <h3 class="text-sm font-medium text-text-00 truncate">{{ project.title }}</h3>
      <p class="text-xs text-text-01 truncate">Задачи проекта</p>
    </div>
    
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="task in project.tasks" 
        :key="task.id"
        class="px-4 py-3 border-b border-border cursor-pointer hover:bg-base-00"
        @click="emit('select', task)"
      >
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full border-2 flex-shrink-0"
            :class="task.status === 'completed' ? 'bg-black border-black' : 'border-border'"
          >
            <svg v-if="task.status === 'completed'" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-text-00 truncate">{{ task.title }}</h4>
            <p v-if="task.date" class="text-xs text-text-02">{{ formatDate(task.date) }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="!project.tasks?.length" class="p-4 text-center text-text-01 text-sm">
        Нет задач
      </div>
    </div>
  </div>
</template>