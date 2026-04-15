<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
}

const checkboxClasses = computed(() => {
  const base = 'flex items-center justify-center border rounded cursor-pointer transition-colors'
  const size = sizeClasses[props.size]
  if (props.disabled) {
    return `${base} ${size} bg-base-00 border-border opacity-50 cursor-not-allowed`
  }
  if (props.modelValue) {
    return `${base} ${size} bg-primary border-primary text-white`
  }
  return `${base} ${size} bg-white border-border hover:bg-base-01`
})

const labelClasses = computed(() => {
  const base = 'text-text-00 font-normal leading-6 select-none'
  if (props.disabled) {
    return `${base} opacity-50 cursor-not-allowed`
  }
  return `${base} cursor-pointer`
})

const handleClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div class="flex items-center gap-4 py-3" @click="handleClick">
    <div :class="checkboxClasses">
      <BaseIcon
        v-if="modelValue"
        name="check"
        class="w-4 h-4"
      />
    </div>
    <span v-if="label" :class="labelClasses">{{ label }}</span>
  </div>
</template>