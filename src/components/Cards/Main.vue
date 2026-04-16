<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useMapStore } from '../../stores/map'
import Tabs from '../Tabs.vue'
import TabItem from '../TabItem.vue'
import Input from '../Input.vue'
import BaseIcon from '../BaseIcon.vue'
import type { Category } from '../../data/mock'

const mapStore = useMapStore()

const activeTab = ref<Category | ''>('')

const categories = [
  { name: 'Проекты', value: 'projects' as Category, icon: 'project', color: 'text-primary', bgColor: 'bg-primary' },
  { name: 'Путешествия', value: 'travel' as Category, icon: 'travel', color: 'text-orange', bgColor: 'bg-orange' },
  { name: 'Спорт', value: 'sport' as Category, icon: 'sport', color: 'text-purple', bgColor: 'bg-purple' },
] as const

// Подхватываем категорию, если она уже выбрана в сторе.
onMounted(() => {
  if (mapStore.category !== 'all') {
    activeTab.value = mapStore.category
  }
})

watch(activeTab, (newVal) => {
  if (newVal) {
    mapStore.setCategory(newVal)
  }
})

const handleSearch = (value: string) => {
  if (value) {
    mapStore.clearSelection()
  }
  mapStore.setSearchQuery(value)
}

const getTabClass = (cat: Category) => {
  const isActive = activeTab.value === cat
  const catConfig = categories.find(c => c.value === cat)
  return [
    'h-14 flex-1 justify-center',
    isActive 
      ? `${catConfig?.bgColor} text-white` 
      : `${catConfig?.color} bg-base-00 hover:bg-base-01`
  ]
}

const getIconClass = (cat: Category) => {
  const isActive = activeTab.value === cat
  const catConfig = categories.find(c => c.value === cat)
  return isActive ? 'text-white' : catConfig?.color
}
</script>

<template>
  <div class="w-[409px] bg-white rounded-card border border-border">
    <div class="p-4 flex flex-col gap-4">
      <Tabs v-model="activeTab" variant="pill" icon-position="top">
        <TabItem 
          v-for="cat in categories" 
          :key="cat.value" 
          :value="cat.value"
          :class="getTabClass(cat.value)"
        >
          <template #icon>
            <BaseIcon :name="cat.icon" class="shrink-0 w-5 h-5" :class="getIconClass(cat.value)" />
          </template>
          <span :class="activeTab === cat.value ? 'text-white' : ''">{{ cat.name }}</span>
        </TabItem>
      </Tabs>
      
      <Input
        :model-value="mapStore.searchQuery"
        placeholder="Поиск"
        left-icon
        @update:model-value="handleSearch"
      />
    </div>
  </div>
</template>
