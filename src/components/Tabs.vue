<script setup lang="ts">
import { ref, provide } from 'vue'

interface Props {
  modelValue?: string
  variant?: 'underline' | 'pill'
  iconPosition?: 'left' | 'top' | 'only' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  variant: 'underline',
  iconPosition: 'none',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = ref(props.modelValue)

provide('TabsContext', {
  activeTab,
  variant: props.variant,
  iconPosition: props.iconPosition,
  setActive: (value: string) => {
    activeTab.value = value
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div 
    class="flex"
    :class="[
      variant === 'underline' 
        ? 'border-b border-border' 
        : 'gap-1 p-1 bg-base-00 rounded-button'
    ]"
  >
    <slot />
  </div>
</template>