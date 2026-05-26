<script setup lang="ts">
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
}>()

const categories = [
  { name: 'Проекты', value: 'projects' as Category, icon: 'project', color: 'text-primary', bgColor: 'bg-primary' },
  { name: 'Путешествия', value: 'travel' as Category, icon: 'travel', color: 'text-orange', bgColor: 'bg-orange' },
  { name: 'Спорт', value: 'sport' as Category, icon: 'sport', color: 'text-purple', bgColor: 'bg-purple' },
] as const

const getTabClass = (cat: Category) => {
  const isActive = props.modelValue === cat
  const catConfig = categories.find(c => c.value === cat)
  return [
    'h-14 flex-1 justify-center',
    isActive 
      ? `${catConfig?.bgColor} text-white` 
      : `${catConfig?.color} bg-base-00 hover:bg-base-01`
  ]
}

const getIconClass = (cat: Category) => {
  const isActive = props.modelValue === cat
  const catConfig = categories.find(c => c.value === cat)
  return isActive ? 'text-white' : catConfig?.color
}
</script>

<template>
  <div class="rounded-lg bg-white shadow-[0_4px_20px_rgba(20,20,20,0.08)] overflow-hidden ">
    <Tabs :model-value="props.modelValue" variant="pill" icon-position="top" @update:model-value="emit('update:modelValue', $event as Category | '')">
      <TabItem 
        v-for="cat in categories" 
        :key="cat.value" 
        :value="cat.value"
        :class="getTabClass(cat.value)"
      >
        <template #icon>
          <BaseIcon :name="cat.icon" class="shrink-0 w-5 h-5" :class="getIconClass(cat.value)" />
        </template>
        <span :class="props.modelValue === cat.value ? 'text-white' : ''">{{ cat.name }}</span>
      </TabItem>
    </Tabs>
  </div>
</template>
