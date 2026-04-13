<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'search' | 'number'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  leftIcon?: boolean
  rightIcon?: boolean
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
  size: 'md',
  disabled: false,
  error: false,
  errorMessage: '',
  leftIcon: false,
  rightIcon: false,
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'clear': []
}>()

const inputValue = ref(props.modelValue)
const isFocused = ref(false)

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
}

const stateClasses = computed(() => {
  if (props.disabled) {
    return 'bg-base-00 border-border text-text-02 opacity-50 cursor-not-allowed'
  }
  if (props.error) {
    return 'border-red bg-white text-text-00 focus:border-red'
  }
  if (isFocused.value) {
    return 'border-primary bg-white text-text-00 focus:ring-0'
  }
  return 'border-border bg-white text-text-00 hover:border-text-01 focus:border-primary'
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  inputValue.value = target.value
  emit('update:modelValue', target.value)
}

const handleClear = () => {
  inputValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div 
      class="flex items-center gap-2 rounded-button border transition-colors duration-200"
      :class="[sizeClasses[size], stateClasses]"
    >
      <slot name="leftIcon">
        <svg v-if="leftIcon" class="w-5 h-5 text-text-01 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </slot>
      
      <input
        :type="type"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="flex-1 bg-transparent outline-none placeholder:text-text-02"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @input="handleInput"
      >
      
      <slot name="rightIcon">
        <button
          v-if="clearable && inputValue && !disabled"
          type="button"
          class="flex-shrink-0 text-text-01 hover:text-text-00"
          @click="handleClear"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </slot>
    </div>
    
    <span v-if="error && errorMessage" class="text-xs text-red">
      {{ errorMessage }}
    </span>
  </div>
</template>