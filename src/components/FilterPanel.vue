<script setup lang='ts'>
import { ref, watch } from 'vue'
import Tabs from './Tabs.vue'
import TabItem from './TabItem.vue'
import Input from './Input.vue'

interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'all',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

const activeCategory = ref(props.modelValue)
const searchQuery = ref('')

watch(() => props.modelValue, (newVal) => {
  activeCategory.value = newVal
})

const categories = [
  { name: 'Все', value: 'all' },
  { name: 'Проекты', value: 'projects' },
  { name: 'Путешествия', value: 'travel' },
  { name: 'Спорт', value: 'sport' },
] as const

const handleCategoryChange = (value: string) => {
  activeCategory.value = value
  emit('update:modelValue', value)
}

const handleSearch = (value: string) => {
  searchQuery.value = value
  emit('search', value)
}
</script>

<template>
  <div class='bg-white rounded-card border border-border'>
    <div class='p-4 flex flex-col gap-4'>
      <Tabs v-model='activeCategory' variant='underline'>
        <TabItem 
          v-for='cat in categories' 
          :key='cat.value' 
          :value='cat.value'
          @click='handleCategoryChange(cat.value)'
        >
          {{ cat.name }}
        </TabItem>
      </Tabs>
      
      <Input
        :model-value='searchQuery'
        placeholder='Поиск'
        left-icon
        @update:model-value='handleSearch'
      />
    </div>
  </div>
</template>