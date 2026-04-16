<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMapStore } from '../../stores/map'
import type { Category, Marker } from '../../data/mock'
import Tabs from './Tabs.vue'
import List from './List.vue'
import Description from './Description.vue'
import Search from './Search.vue'
import BottomSheet from '../BottomSheet.vue'
import TaskList from './TaskList.vue'

const mapStore = useMapStore()

const activeTab = ref<Category | ''>('')
const showList = ref(false)
const showDescription = ref(false)
const showSearch = ref(false)

const selectedMarker = ref<Marker | null>(null)

watch(activeTab, (val) => {
  if (val) {
    mapStore.setCategory(val)
  }
})

const handleOpenList = () => {
  showList.value = true
}

const handleCloseList = () => {
  showList.value = false
}

const handleOpenDescription = (marker: Marker) => {
  selectedMarker.value = marker
  mapStore.selectMarker(marker)
  showList.value = false
  showDescription.value = true
}

const handleCloseDescription = () => {
  showDescription.value = false
  selectedMarker.value = null
  mapStore.clearSelection()
}

const handleOpenSearch = () => {
  showSearch.value = true
}

const handleCloseSearch = () => {
  showSearch.value = false
}

const handleSelectFromSearch = (marker: Marker) => {
  showSearch.value = false
  handleOpenDescription(marker)
}
</script>

<template>
  <div class="fixed inset-0 z-40 pointer-events-none">
    <div class="absolute bottom-0 left-0 right-0 pointer-events-auto">
      <Tabs 
        v-model="activeTab" 
        class="pointer-events-auto"
        @open-list="handleOpenList"
      />
    </div>
  </div>

  <BottomSheet v-model="showList" height="calc(100vh - 56px)">
    <List 
      @select="handleOpenDescription"
      @close="handleCloseList"
      @open-search="handleOpenSearch"
    />
  </BottomSheet>

  <Search 
    v-if="showSearch"
    :query="mapStore.searchQuery"
    @close="handleCloseSearch"
    @select="handleSelectFromSearch"
  />

  <BottomSheet v-model="showDescription" height="auto">
    <Description 
      v-if="selectedMarker"
      :marker="selectedMarker"
      @close="handleCloseDescription"
    />
  </BottomSheet>
</template>

<style scoped>
</style>