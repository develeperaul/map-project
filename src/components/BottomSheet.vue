<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 'auto',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = ref(false)
const isDragging = ref(false)
const dragStartY = ref(0)
const dragDeltaY = ref(0)
const isAnimating = ref(false)

const translateY = computed(() => {
  if (isDragging.value) {
    return `translateY(${dragDeltaY.value}px)`
  }
  if (isOpen.value) {
    return 'translateY(0px)'
  }
  return 'translateY(100%)'
})

const close = () => {
  isOpen.value = false
  dragDeltaY.value = 0
  emit('update:modelValue', false)
}

const handleStart = (e: TouchEvent | MouseEvent) => {
  isDragging.value = true
  dragStartY.value = 'touches' in e ? e.touches[0].clientY : e.clientY
}

const handleMove = (e: TouchEvent | MouseEvent) => {
  if (!isDragging.value) return
  
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const deltaY = clientY - dragStartY.value
  
  if (deltaY > 0) {
    dragDeltaY.value = deltaY
  }
}

const handleEnd = () => {
  if (!isDragging.value) return
  
  if (dragDeltaY.value > 100) {
    close()
  } else {
    dragDeltaY.value = 0
    isDragging.value = false
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    isOpen.value = true
  }
}, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 pointer-events-none"
        @click.self="close"
      >
        <div
          class="absolute bottom-0 left-0 right-0 bg-white rounded-t-card pointer-events-auto"
          :class="{ 'transition-transform duration-300 ease-out': !isDragging }"
          :style="{
            height,
            transform: translateY,
          }"
          @mousedown="handleStart"
          @mousemove="handleMove"
          @mouseup="handleEnd"
          @mouseleave="handleEnd"
          @touchstart="handleStart"
          @touchmove="handleMove"
          @touchend="handleEnd"
        >
          <div class="flex justify-center py-3 cursor-grab active:cursor-grabbing select-none">
            <div class="w-10 h-1 bg-border rounded-full" />
          </div>
          
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
</style>