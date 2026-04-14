<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '../../stores/map'
import Chip from '../Chip.vue'

const mapStore = useMapStore()

const isVisible = computed(() => mapStore.category === 'projects')

const filters = [
  { label: 'Все', value: 'all' as const },
  { label: 'В процессе', value: 'active' as const },
  { label: 'Завершённые', value: 'completed' as const },
]

const handleClick = (value: 'all' | 'active' | 'completed') => {
  mapStore.setStatusFilter(value)
}
</script>

<template>
  <div v-if="isVisible" class="flex gap-2">
    <Chip
      v-for="filter in filters"
      :key="filter.value"
      :label="filter.label"
      :variant="mapStore.statusFilter === filter.value ? 'selected' : 'default'"
      size="sm"
      @click="handleClick(filter.value)"
    />
  </div>
</template>
