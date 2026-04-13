<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'base' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'base',
  size: 'lg',
  disabled: false,
  loading: false,
})

const sizeClasses = {
  sm: 'h-6 px-[10px] text-xs',
  md: 'h-8 px-[10px] text-sm', 
  lg: 'h-12 px-3 text-base',
  xl: 'h-[48px] px-4 text-base',
}

const variantStyles = {
  primary: {
    default: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-80',
    disabled: 'bg-primary-20 text-white/50 cursor-not-allowed',
  },
  secondary: {
    default: 'bg-secondary text-white hover:bg-secondary-75 active:bg-secondary-85',
    disabled: 'bg-secondary-75 text-white/50 cursor-not-allowed',
  },
  base: {
    default: 'bg-base-00 text-text-00 border border-border hover:bg-base-01 active:bg-base-02',
    disabled: 'bg-base-00 text-text-02 border border-border opacity-50 cursor-not-allowed',
  },
  outline: {
    default: 'bg-transparent text-primary border border-primary hover:bg-primary-20 active:bg-primary-10',
    disabled: 'bg-transparent text-primary/30 border border-primary/30 cursor-not-allowed',
  },
  ghost: {
    default: 'bg-transparent text-text-00 hover:bg-base-00 active:bg-base-01',
    disabled: 'bg-transparent text-text-disabled opacity-50 cursor-not-allowed',
  },
  white: {
    default: 'bg-white text-text-00 border border-border hover:bg-base-00 active:bg-base-01',
    disabled: 'bg-white text-text-disabled border border-border opacity-50 cursor-not-allowed',
  },
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200',
      sizeClasses[size],
      props.disabled ? variantStyles[props.variant].disabled : variantStyles[props.variant].default,
      { 'cursor-pointer': !props.disabled }
    ]"
    :disabled="props.disabled || props.loading"
  >
    <span v-if="$slots.leftIcon" class="flex-shrink-0">
      <slot name="leftIcon" />
    </span>
    
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    
    <span v-if="$slots.default">
      <slot />
    </span>
    
    <span v-if="$slots.rightIcon" class="flex-shrink-0">
      <slot name="rightIcon" />
    </span>
  </button>
</template>