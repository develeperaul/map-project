<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

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

watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal
})

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
}

const borderClasses = computed(() => {
  if (props.disabled) {
    return 'bg-base-00 border-border text-text-02 opacity-50 cursor-not-allowed'
  }
  if (props.error) {
    return 'bg-white border-red text-text-00 focus:border-red'
  }
  if (isFocused.value) {
    return 'bg-white border-[2px] border-primary-20 text-text-00 focus:border-primary'
  }
  return 'bg-base-00 border-border text-text-00 hover:border-text-01 focus:border-primary'
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
      :class="[sizeClasses[size], borderClasses]"
    >
      <slot name="leftIcon">
        <BaseIcon v-if="leftIcon" name="search" class="w-5 h-5 text-text-00 flex-shrink-0" />
      </slot>
      
      <input
        :type="type"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="flex-1 bg-transparent outline-none placeholder:text-text-01"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @input="handleInput"
      >
      
      <slot name="rightIcon">
        <BaseIcon 
          v-if="clearable && inputValue && !disabled" 
          name="close" 
          class="w-5 h-5 text-text-01 hover:text-text-00 cursor-pointer" 
          @click="handleClear"
        />
      </slot>
    </div>
    
    <span v-if="error && errorMessage" class="text-xs text-red">
      {{ errorMessage }}
    </span>
  </div>
</template>
