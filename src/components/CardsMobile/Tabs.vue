<script setup lang="ts">
import { ref, provide } from 'vue'
import Tabs from '../Tabs.vue'
import TabItem from '../TabItem.vue'
import BaseIcon from '../BaseIcon.vue'
import type { Category } from '../../data/mock'

interface Props {
  modelValue?: Category | ''
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: Category | '']
  'open-list': []
}>()

const categories = [
  { name: 'Проекты', value: 'projects' as Category, icon: 'project', color: 'text-primary', bgColor: 'bg-primary' },
  { name: 'Путешествия', value: 'travel' as Category, icon: 'travel', color: 'text-orange', bgColor: 'bg-orange' },
  { name: 'Спорт', value: 'sport' as Category, icon: 'sport', color: 'text-purple', bgColor: 'bg-purple' },
] as const

const handleClick = (value: Category) => {
  emit('update:modelValue', value)
  emit('open-list')
}

const getTabClass = (cat: Category) => {
  const isActive = props.modelValue === cat.value
  return [
    'flex-1 justify-center py-3',
    isActive 
      ? `${cat.bgColor} text-white` 
      : `${cat.color} bg-transparent hover:bg-base-00`
  ]
}

const getIconClass = (cat: Category) => {
  return props.modelValue === cat.value ? 'text-white' : cat.color
}
</script>

<template>
  <div class="w-full bg-white border-b border-border">
    <div class="flex">
      <Tabs :model-value="modelValue" variant="pill">
        <TabItem 
          v-for="cat in categories" 
          :key="cat.value" 
          :value="cat.value"
          :class="getTabClass(cat)"
          @click="handleClick(cat.value)"
        >
          <template #icon>
            <BaseIcon :name="cat.icon" class="shrink-0 w-5 h-5" :class="getIconClass(cat)" />
          </template>
          <span :class="props.modelValue === cat.value ? 'text-white' : ''">{{ cat.name }}</span>
        </TabItem>
      </Tabs>
    </div>
  </div>
</template>