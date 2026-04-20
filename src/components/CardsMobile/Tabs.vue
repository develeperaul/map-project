<script setup lang="ts">
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
  { name: 'Проекты', value: 'projects' as Category, icon: 'project', color: 'text-primary' },
  { name: 'Путешествия', value: 'travel' as Category, icon: 'travel', color: 'text-orange' },
  { name: 'Спорт', value: 'sport' as Category, icon: 'sport', color: 'text-purple' },
] as const

const handleClick = (value: Category) => {
  emit('update:modelValue', props.modelValue === value ? '' : value)
}
</script>

<template>
  <div class="rounded-card bg-white shadow-[0_4px_20px_rgba(20,20,20,0.08)] overflow-hidden">
    <div class="grid grid-cols-3 gap-0 p-1">
      <button
        v-for="cat in categories"
        :key="cat.value"
        type="button"
        class="flex flex-col items-center justify-center gap-1 rounded-[12px] px-2 py-3 transition-colors"
        :class="props.modelValue === cat.value ? 'bg-base-00' : 'hover:bg-base-00/70'"
        @click="handleClick(cat.value)"
      >
        <BaseIcon :name="cat.icon" class="h-5 w-5 shrink-0" :class="props.modelValue === cat.value ? cat.color : 'text-text-01'" />
        <span class="text-sm leading-5" :class="props.modelValue === cat.value ? 'text-text-00' : 'text-text-01'">{{ cat.name }}</span>
      </button>
    </div>
  </div>
</template>
