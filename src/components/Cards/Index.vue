<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import Main from './Main.vue'
import Filter from './Filter.vue'
import List from './List.vue'
import Description from './Description.vue'
import TaskList from './TaskList.vue'
import type { Marker } from '../../data/mock'
import { resolveSelection } from './selection'

const mapStore = useMapStore()

const showContent = computed(() => (
  mapStore.selectedMarker !== null
  || selectedProject.value !== null
  || mapStore.showFilterPanel
))
const showDescription = computed(() => mapStore.selectedMarker !== null && !mapStore.showFilterPanel)

const selectedProject = ref<Marker | null>(null)
const selectedTaskIndex = ref(0)
const showTaskList = computed(() => selectedProject.value !== null)

const selectedProjectTasks = computed(() => selectedProject.value?.tasks || [])

watch([selectedProject, selectedTaskIndex], () => {
  const task = selectedProjectTasks.value[selectedTaskIndex.value]
  if (task) {
    mapStore.selectMarker(task)
  }
}, { immediate: true })

const applyResolvedSelection = (marker: Marker) => {
  const resolved = resolveSelection(marker)

  if (resolved.kind === 'project') {
    selectedProject.value = resolved.project
    selectedTaskIndex.value = resolved.taskIndex

    const task = resolved.project.tasks?.[resolved.taskIndex]
    if (task && mapStore.selectedMarker?.id !== task.id) {
      mapStore.selectMarker(task)
    }
    return
  }

  if (resolved.kind === 'task') {
    selectedProject.value = resolved.project
    selectedTaskIndex.value = resolved.taskIndex
    return
  }

  selectedProject.value = null
  selectedTaskIndex.value = 0
}

watch(() => mapStore.category, () => {
  selectedProject.value = null
  selectedTaskIndex.value = 0
  mapStore.showFilterPanel = false
  mapStore.clearSelection()
})

watch(() => mapStore.selectedMarker, (marker) => {
  if (!marker) return
  mapStore.showFilterPanel = false
  applyResolvedSelection(marker)
}, { immediate: true })

const handleProjectSelect = (project: Marker) => {
  selectedProject.value = project
  selectedTaskIndex.value = 0

  const firstTask = project.tasks?.[0]
  if (firstTask) {
    mapStore.selectMarker(firstTask)
  }
}

const handleBack = () => {
  selectedProject.value = null
  selectedTaskIndex.value = 0
  mapStore.clearSelection()
}

const handleTaskSelect = (task: Marker, index: number) => {
  selectedTaskIndex.value = index
  mapStore.selectMarker(task)
}

const handleOpenFilter = () => {
  mapStore.toggleFilterPanel()
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Main />
    <div v-if="showContent" class="flex gap-2">
      <List 
        v-if="!showTaskList" 
        @select-project="handleProjectSelect"
        @open-filter="handleOpenFilter"
      />
      
      <TaskList 
        v-if="showTaskList" 
        :project="selectedProject!"
        :active-task-index="selectedTaskIndex"
        @back="handleBack"
        @select-task="handleTaskSelect"
      />
      
      <Filter v-if="mapStore.showFilterPanel" />
      <Description
        v-if="showDescription"
        v-model:task-index="selectedTaskIndex"
        :tasks="selectedProjectTasks"
      />
    </div>
  </div>
</template>
