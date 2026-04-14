<script setup lang="ts">
interface Props {
  label: string
  variant?: 'default' | 'selected'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  closeable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  closeable: false,
})

const emit = defineEmits<{
  'click': []
  'close': []
}>()

const sizeClasses = {
  sm: 'h-6 px-2 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-2',
  lg: 'h-10 px-4 text-base gap-2',
}

const variantClasses = {
  default: {
    base: 'bg-base-00 text-text-01 border border-border',
    hover: 'hover:bg-base-01 hover:border-text-01',
    disabled: 'bg-base-00 text-text-02 border border-border opacity-50 cursor-not-allowed',
  },
  selected: {
    base: 'bg-primary-20 text-primary border border-primary',
    hover: 'hover:bg-primary-10 hover:text-primary',
    disabled: 'bg-primary-10 text-primary opacity-50 border border-primary cursor-not-allowed',
  },
}
</script>

<template>
  <button
    type="button"
    :disabled="props.disabled"
    :class="[
      'inline-flex items-center rounded-chip font-medium transition-all duration-200',
      sizeClasses[size],
      props.disabled 
        ? variantClasses[props.variant].disabled 
        : variantClasses[props.variant].base + ' ' + variantClasses[props.variant].hover
    ]"
    @click="emit('click')"
  >
    <span class="truncate">{{ label }}</span>
    
    <button
      v-if="closeable && !props.disabled"
      type="button"
      class="flex-shrink-0 hover:text-text-00"
      @click.stop="emit('close')"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </button>
</template>