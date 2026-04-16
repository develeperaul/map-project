<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  label: string
  variant?: 'secondary' | 'base' | 'outline' | 'outline-subtitle' | 'white'
  iconLeft?: boolean
  iconRight?: boolean
  number?: number | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  state: 'default',
  iconLeft: false,
  iconRight: false,
  number: null,
  disabled: false,
})

const emit = defineEmits<{
  'click': []
}>()

const chipClasses = computed(() => {
  const base = 'inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium text-sm leading-5 transition-colors cursor-pointer'
  
  if (props.disabled) {
    return `${base} opacity-50 cursor-not-allowed`
  }
  
  const variant = props.variant
  
  if (variant === 'secondary') {
    return `${base} bg-secondary-dark text-white hover:bg-text-dark active:bg-text-muted`
  }
  
  if (variant === 'base') {
    return `${base} bg-base-light-00 text-text-dark hover:bg-base-light-01 active:bg-base-light-02`
  }
  
  if (variant === 'outline' || variant === 'outline-subtitle') {
    const border = 'border border-base-light-00'
    return `${base} bg-white text-text-dark hover:bg-base-light-01 active:bg-base-light-02 ${border}`
  }
  
  if (variant === 'white') {
    return `${base} bg-white text-text-dark hover:bg-white/64 active:bg-white/80`
  }
  
  return base
})

const textClasses = computed(() => {
  const base = 'font-medium text-sm leading-5'
  if (props.variant === 'outline-subtitle') {
    return `${base} underline`
  }
  return base
})

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="chipClasses"
    @click="handleClick"
  >
    <BaseIcon
      v-if="iconLeft"
      name="filter"
      class="w-4 h-4"
    />
    
    <div
      v-if="number !== null"
      class="bg-secondary-dark text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center"
    >
      {{ number }}
    </div>
    
    <span :class="textClasses">{{ label }}</span>
    
    <BaseIcon
      v-if="iconRight"
      name="filter"
      class="w-4 h-4"
    />
  </button>
</template>