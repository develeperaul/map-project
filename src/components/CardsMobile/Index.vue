<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Category, Marker } from '../../data/mock'
import Tabs from './Tabs.vue'
import Search from './Search.vue'
import List from './List.vue'
import BottomSheet from '../BottomSheet.vue'
import TestAllFilter from '../TestAllFilter.vue'

const mapStore = useMapStore()

const activeTab = ref<Category | ''>('')
const showList = ref(false)
const showFilter = ref(false)
const showSearch = ref(false)
const listSheetHeight = ref(0)

const sheetOpen = computed(() => showList.value || showFilter.value)
const showSearchField = computed(() => activeTab.value === '' && !sheetOpen.value)
const bottomControlsStyle = computed(() => ({
  bottom: sheetOpen.value ? `${listSheetHeight.value + 16}px` : '16px',
}))

watch(activeTab, (val) => {
  if (val) {
    mapStore.setCategory(val)
    showList.value = true
    showFilter.value = false
    showSearch.value = false
  } else {
    mapStore.setCategory('all')
    showList.value = false
    showFilter.value = false
  }
})

const openSearch = () => {
  if (activeTab.value || sheetOpen.value) return
  showSearch.value = true
}

const closeSearch = () => {
  showSearch.value = false
}

const openFilter = () => {
  showList.value = false
  showFilter.value = true
  showSearch.value = false
}

const closeFilter = () => {
  showFilter.value = false
}

const closeList = () => {
  showList.value = false
  activeTab.value = ''
}

const handleSheetHeight = (height: number) => {
  listSheetHeight.value = height
}

const handleSelectFromSearch = (marker: Marker) => {
  closeSearch()
  mapStore.selectMarker(marker)
}
</script>

<template>
  <div class="fixed inset-0 z-40 pointer-events-none">
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
    v-model="showList"
    height="auto"
    max-height="calc(100vh - 136px)"
    @height-change="handleSheetHeight"
  >
    <List
      @close="closeList"
      @open-filter="openFilter"
      @select="handleSelectFromSearch"
    />
  </BottomSheet>

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
