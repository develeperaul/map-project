<template>
  <div class="flex flex-1 h-12 items-center justify-center min-w-0">
    <button
      :class="containerClasses"
      :disabled="disabled"
      @click="$emit('click', props.date)"
      @mouseenter="$emit('mouseenter', props.date)"
    >
      <p :class="textClasses">{{ text }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string
  date?: Date
  disabled?: boolean
  selected?: boolean
  rangeStart?: boolean
  rangeEnd?: boolean
  inRange?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  selected: false,
  rangeStart: false,
  rangeEnd: false,
  inRange: false,
})

const emit = defineEmits<{
  click: [date: Date | undefined]
  mouseenter: [date: Date | undefined]
}>()

const containerClasses = computed(() => {
  let classes = 'flex items-center justify-center overflow-hidden rounded-full w-10 h-10 shrink-0'

  if (props.disabled) {
    classes += ' opacity-50'
  }

  if (props.selected) {
    classes += ' bg-primary'
  } else if (props.inRange) {
    classes += ' bg-base-01'
  }

  if (props.rangeStart) {
    classes += ' rounded-l-none'
  }

  if (props.rangeEnd) {
    classes += ' rounded-r-none'
  }

  return classes
})

const textClasses = computed(() => {
  let classes = 'font-normal text-base text-center leading-6'

  if (props.selected) {
    classes += ' text-white'
  } else if (props.disabled) {
    classes += ' text-text-02'
  } else {
    classes += ' text-text-00'
  }

  return classes
})
</script>