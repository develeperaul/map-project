<script setup lang="ts">
import { inject } from 'vue'

interface Props {
  value: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const tabsContext = inject('TabsContext') as any

const isActive = () => tabsContext?.activeTab === props.value
const iconPosition = () => tabsContext?.iconPosition || 'left'

const handleClick = () => {
  if (!props.disabled && tabsContext) {
    tabsContext.setActive(props.value)
  }
}
</script>

<template>
  <button
    type="button"
    :disabled="props.disabled"
    :class="[
      'flex transition-colors duration-200',
      iconPosition() === 'top' ? 'flex-col items-center' : 'items-center',
      iconPosition() === 'only' ? 'p-2' : 'px-4 py-2',
      'gap-2 text-sm',
      tabsContext?.variant === 'underline'
        ? isActive()
          ? 'text-primary border-b-2 border-primary font-medium'
          : 'text-text-01 hover:text-text-00 border-b-2 border-transparent'
        : isActive()
          ? 'bg-primary text-white rounded-[6px]'
          : 'bg-transparent text-text-01 hover:bg-base-01 rounded-[6px]',
      props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @click="handleClick"
  >
    <slot name="icon" />
    <span v-if="$slots.default && iconPosition() !== 'only'">
      <slot />
    </span>
  </button>
</template>