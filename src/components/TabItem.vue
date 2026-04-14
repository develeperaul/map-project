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
const iconPosition = () => tabsContext?.iconPosition || 'top'

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
      'flex transition-colors duration-200 flex-1 justify-center',
      iconPosition() === 'top' ? 'flex-col items-center gap-1' : 'items-center gap-2',
      iconPosition() === 'only' ? 'p-2' : 'px-2 py-3',
      'text-sm rounded-[6px]',
      tabsContext?.variant === 'underline'
        ? isActive()
          ? 'text-primary border-b-2 border-primary font-medium'
          : 'text-text-01 hover:text-text-00 border-b-2 border-transparent'
        : isActive()
          ? '' 
          : 'text-text-01 hover:bg-base-01',
      props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      $attrs.class as string
    ]"
    @click="handleClick"
  >
    <slot name="icon" />
    <span v-if="$slots.default && iconPosition() !== 'only'">
      <slot />
    </span>
  </button>
</template>
