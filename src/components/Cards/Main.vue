<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMapStore } from '../../stores/map'
import Tabs from '../Tabs.vue'
import TabItem from '../TabItem.vue'
import Input from '../Input.vue'
import BaseIcon from '../BaseIcon.vue'
import type { Category } from '../../data/mock'
const mapStore = useMapStore()

const props = defineProps<{
  sideOpen?: boolean
  hasContent?: boolean
}>()

const emit = defineEmits<{
  toggleSide: []
}>()

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
  } else {
    mapStore.setCategory('all')
  }
})

const handleSearch = (value: string) => {
  if (value) {
    mapStore.clearSelection()
  }
  mapStore.setSearchQuery(value)
}

const refresh = () => {
  activeTab.value = ''
  mapStore.setCategory('all')
  mapStore.clearSelection()
  mapStore.setSearchQuery('')
}

const closeSide = () => {
  emit('toggleSide')
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
  <div class="w-[409px] relative  bg-white rounded-card border border-border" style="box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.30), 0 2px 6px 2px rgba(0, 0, 0, 0.15);">
    <div class="p-6 flex flex-col gap-4">
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
        clearable
        @update:model-value="handleSearch"
      />
    </div>
    <div class="absolute right-0 top-4 transform translate-x-full w-fit grid gap-3">

      <div v-if="activeTab" @click="refresh" class="rounded-r-[8px] py-4 px-2 bg-white cursor-pointer" style="box-shadow: rgba(0, 0, 0, 0.3) 2px 0px 2px 0px;">
        <BaseIcon name="close" class="shrink-0 w-4 h-4" />
      </div>
      <div v-if="props.hasContent" @click="closeSide" class="rounded-r-[8px] py-4 px-2 bg-white cursor-pointer" style="box-shadow: rgba(0, 0, 0, 0.3) 2px 0px 2px 0px;">
        <BaseIcon name="back" :class="`shrink-0 w-4 h-4 transition-transform duration-300 ${!props.sideOpen ? 'rotate-180' : ''}`" />
      </div>
    </div>
  </div>
</template>
