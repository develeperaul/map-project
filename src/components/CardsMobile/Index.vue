<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Category, Marker } from '../../data/mock'
import { resolveSelection } from '../Cards/selection'
import Tabs from './Tabs.vue'
import Search from './Search.vue'
import List from './List.vue'
import TaskList from './TaskList.vue'
import Description from './Description.vue'
import BottomSheet from '../BottomSheet.vue'
import TestAllFilter from '../TestAllFilter.vue'

const mapStore = useMapStore()

type SheetView = 'list' | 'tasks'

const activeTab = ref<Category | ''>('')
const sheetView = ref<SheetView | null>(null)
const showDescriptionOverlay = ref(false)
const showFilter = ref(false)
const showSearch = ref(false)
const listSheetHeight = ref(0)
const selectedProject = ref<Marker | null>(null)
const selectedTaskIndex = ref(0)
const viewBeforeFilter = ref<SheetView | null>(null)
const descriptionReturnView = ref<SheetView | null>(null)
const suppressSelectionWatch = ref(false)

const selectedProjectTasks = computed(() => selectedProject.value?.tasks || [])
const selectedDescriptionMarker = computed(() => {
  if (selectedProject.value) {
    return selectedProjectTasks.value[selectedTaskIndex.value] || mapStore.selectedMarker
  }

  return mapStore.selectedMarker
})

const sheetOpen = computed(() => sheetView.value !== null || showFilter.value || showDescriptionOverlay.value)
const showPrimarySheet = computed({
  get: () => sheetView.value !== null,
  set: (value: boolean) => {
    if (!value) closeAll()
  },
})
const showSearchField = computed(() => activeTab.value === '' && !sheetOpen.value)
const bottomControlsStyle = computed(() => ({
  bottom: sheetOpen.value ? `${listSheetHeight.value + 16}px` : '16px',
}))

const resetNestedSelection = () => {
  selectedProject.value = null
  selectedTaskIndex.value = 0
}

const selectMarkerSilently = (marker: Marker) => {
  suppressSelectionWatch.value = true
  mapStore.selectMarker(marker)
}

const showProjectTasks = (project: Marker, taskIndex = 0, syncMap = true) => {
  selectedProject.value = project
  selectedTaskIndex.value = taskIndex
  sheetView.value = 'tasks'
  showDescriptionOverlay.value = false
  descriptionReturnView.value = null
  showFilter.value = false
  showSearch.value = false

  const task = project.tasks?.[taskIndex]
  if (syncMap && task) {
    selectMarkerSilently(task)
  }
}

const showTaskDescription = (
  project: Marker,
  taskIndex: number,
  syncMap = true,
  returnView: SheetView | null = sheetView.value,
) => {
  selectedProject.value = project
  selectedTaskIndex.value = taskIndex
  descriptionReturnView.value = returnView
  sheetView.value = null
  showDescriptionOverlay.value = true
  showFilter.value = false
  showSearch.value = false

  const task = project.tasks?.[taskIndex]
  if (syncMap && task) {
    selectMarkerSilently(task)
  }
}

const showMarkerDescription = (
  marker: Marker,
  syncMap = true,
  returnView: SheetView | null = sheetView.value,
) => {
  resetNestedSelection()
  descriptionReturnView.value = returnView
  sheetView.value = null
  showDescriptionOverlay.value = true
  showFilter.value = false
  showSearch.value = false

  if (syncMap) {
    selectMarkerSilently(marker)
  }
}

const applyResolvedSelection = (
  marker: Marker,
  syncMap = false,
  returnView: SheetView | null = sheetView.value,
) => {
  const resolved = resolveSelection(marker)

  if (resolved.kind === 'project') {
    showProjectTasks(resolved.project, resolved.taskIndex, syncMap)
    return
  }

  if (resolved.kind === 'task') {
    showTaskDescription(resolved.project, resolved.taskIndex, syncMap, returnView)
    return
  }

  showMarkerDescription(resolved.marker, syncMap, returnView)
}

watch(activeTab, (val) => {
  resetNestedSelection()
  showDescriptionOverlay.value = false
  descriptionReturnView.value = null

  if (val) {
    mapStore.setCategory(val)
    sheetView.value = 'list'
    showFilter.value = false
    showSearch.value = false
  } else {
    mapStore.setCategory('all')
    sheetView.value = null
    showFilter.value = false
  }
})

watch(() => mapStore.selectedMarker, (marker) => {
  if (suppressSelectionWatch.value) {
    suppressSelectionWatch.value = false
    return
  }

  if (!marker) return
  showFilter.value = false
  showSearch.value = false
  applyResolvedSelection(marker, false, null)
})

const openSearch = () => {
  if (activeTab.value || sheetOpen.value) return
  showSearch.value = true
}

const closeSearch = () => {
  showSearch.value = false
}

const openFilter = () => {
  viewBeforeFilter.value = sheetView.value
  sheetView.value = null
  showFilter.value = true
  showSearch.value = false
}

const closeFilter = () => {
  showFilter.value = false
  sheetView.value = viewBeforeFilter.value || (activeTab.value ? 'list' : null)
  viewBeforeFilter.value = null
}

const closeAll = () => {
  sheetView.value = null
  showDescriptionOverlay.value = false
  showFilter.value = false
  showSearch.value = false
  viewBeforeFilter.value = null
  descriptionReturnView.value = null
  resetNestedSelection()
  activeTab.value = ''
  mapStore.setCategory('all')
}

const handleSheetHeight = (height: number) => {
  listSheetHeight.value = height
}

const handleListSelect = (marker: Marker) => {
  applyResolvedSelection(marker, true, 'list')
}

const handleTaskSelect = (_task: Marker, index: number) => {
  if (!selectedProject.value) return
  showTaskDescription(selectedProject.value, index, true, 'tasks')
}

const backToList = () => {
  showDescriptionOverlay.value = false
  descriptionReturnView.value = null
  resetNestedSelection()
  mapStore.clearSelection()
  sheetView.value = 'list'
}

const backToTasks = () => {
  if (selectedProject.value) {
    showDescriptionOverlay.value = false
    descriptionReturnView.value = null
    sheetView.value = 'tasks'
    return
  }

  closeAll()
}

const closeDescription = () => {
  if (descriptionReturnView.value === 'tasks' && selectedProject.value) {
    showDescriptionOverlay.value = false
    descriptionReturnView.value = null
    sheetView.value = 'tasks'
    return
  }

  if (descriptionReturnView.value === 'list') {
    showDescriptionOverlay.value = false
    descriptionReturnView.value = null
    sheetView.value = 'list'
    return
  }

  closeAll()
  mapStore.clearSelection()
}

const handleDescriptionTaskIndex = (index: number) => {
  selectedTaskIndex.value = index

  const task = selectedProjectTasks.value[index]
  if (task) {
    selectMarkerSilently(task)
  }
}

const handleSelectFromSearch = (marker: Marker) => {
  closeSearch()
  applyResolvedSelection(marker, true, null)
}
</script>

<template>
  <div v-if="!showDescriptionOverlay" class="fixed inset-0 z-40 pointer-events-none">
    <div class="absolute inset-x-0 px-4 pointer-events-auto z-[60] transition-all duration-300 ease-out" :style="bottomControlsStyle">
      <div class="flex flex-col gap-2">
        <Tabs v-model="activeTab" />

        <Search
          v-if="showSearchField && !showSearch"
          mode="inline"
          :query="mapStore.searchQuery"
          @open="openSearch"
        />
      </div>
    </div>
  </div>

  <BottomSheet
    v-model="showPrimarySheet"
    height="auto"
    max-height="calc(100vh - 136px)"
    @height-change="handleSheetHeight"
  >
    <List
      v-if="sheetView === 'list'"
      @close="closeAll"
      @open-filter="openFilter"
      @select="handleListSelect"
    />

    <TaskList
      v-else-if="sheetView === 'tasks' && selectedProject"
      :project="selectedProject"
      :active-task-index="selectedTaskIndex"
      @back="backToList"
      @close="closeAll"
      @select="handleTaskSelect"
    />
  </BottomSheet>

  <Description
    v-if="showDescriptionOverlay && selectedDescriptionMarker"
    :marker="selectedDescriptionMarker"
    :project="selectedProject"
    :tasks="selectedProjectTasks"
    :task-index="selectedTaskIndex"
    @update:task-index="handleDescriptionTaskIndex"
    @back="backToTasks"
    @close="closeDescription"
  />

  <BottomSheet
    v-model="showFilter"
    height="auto"
    max-height="calc(100vh - 136px)"
    @height-change="handleSheetHeight"
  >
    <TestAllFilter embedded @close="closeFilter" />
  </BottomSheet>

  <Search
    v-if="showSearch"
    mode="overlay"
    :query="mapStore.searchQuery"
    @close="closeSearch"
    @select="handleSelectFromSearch"
  />
</template>
