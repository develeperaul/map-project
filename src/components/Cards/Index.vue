<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import Main from './Main.vue'
import Filter from './Filter.vue'
import List from './List.vue'
import Description from './Description.vue'
import TaskList from './TaskList.vue'
import type { Marker } from '../../data/mock'

const mapStore = useMapStore()

const showContent = computed(() => mapStore.category !== 'all')
const showFilter = computed(() => mapStore.category === 'projects')
const showDescription = computed(() => mapStore.selectedMarker !== null)

const selectedProject = ref<Marker | null>(null)

const showTaskList = computed(() => selectedProject.value !== null)

watch(() => mapStore.category, () => {
  selectedProject.value = null
})

const handleProjectSelect = (project: Marker) => {
  selectedProject.value = project
}

const handleBack = () => {
  selectedProject.value = null
}

const handleTaskSelect = (task: Marker) => {
  mapStore.selectMarker(task)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Main />
    <div v-if="showContent" class="flex gap-2">
      <div v-if="showFilter && !showTaskList" class="flex flex-col gap-2">
        <Filter />
        <List @select-project="handleProjectSelect" />
      </div>
      <List v-if="!showFilter && !showTaskList" @select-project="handleProjectSelect" />
      
      <TaskList 
        v-if="showTaskList" 
        :project="selectedProject!"
        @back="handleBack"
        @select-task="handleTaskSelect"
      />
      
      <Description v-if="showDescription" />
    </div>
  </div>
</template>
