<script lang="ts">
let scrollLockCount = 0
let savedBodyOverflow = ''
let savedHtmlOverflow = ''
</script>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'

interface Props {
  modelValue: boolean
  height?: string
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 'auto',
  maxHeight: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'height-change': [value: number]
}>()

const isOpen = ref(false)
const isDragging = ref(false)
const dragStartY = ref(0)
const dragDeltaY = ref(0)
const panelRef = ref<HTMLElement | null>(null)
const hasScrollLock = ref(false)
let resizeObserver: ResizeObserver | null = null

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
  isDragging.value = false
  dragDeltaY.value = 0
  emit('update:modelValue', false)
}

const lockDocumentScroll = () => {
  if (typeof document === 'undefined' || hasScrollLock.value) return

  if (scrollLockCount === 0) {
    savedBodyOverflow = document.body.style.overflow
    savedHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  }

  scrollLockCount += 1
  hasScrollLock.value = true
}

const unlockDocumentScroll = () => {
  if (typeof document === 'undefined' || !hasScrollLock.value) return

  scrollLockCount = Math.max(0, scrollLockCount - 1)
  hasScrollLock.value = false

  if (scrollLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow
    document.documentElement.style.overflow = savedHtmlOverflow
  }
}

const emitHeight = () => {
  if (panelRef.value) {
    emit('height-change', panelRef.value.offsetHeight)
  }
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

const attachResizeObserver = async () => {
  await nextTick()

  if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined' || !panelRef.value) {
    return
  }

  resizeObserver?.disconnect()
  resizeObserver = new ResizeObserver(() => emitHeight())
  resizeObserver.observe(panelRef.value)
  emitHeight()
}

watch(() => props.modelValue, (val) => {
  if (val) {
    isOpen.value = true
    lockDocumentScroll()
    void attachResizeObserver()
  } else {
    isOpen.value = false
    isDragging.value = false
    dragDeltaY.value = 0
    resizeObserver?.disconnect()
    unlockDocumentScroll()
  }
}, { immediate: true })

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  unlockDocumentScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 pointer-events-none overscroll-contain"
        @click.self="close"
      >
        <div
          ref="panelRef"
          class="absolute bottom-0 left-0 right-0  min-h-0 overflow-hidden bg-white rounded-t-card pointer-events-auto overscroll-contain grid grid-rows-[auto_1fr] "
          :class="{ 'transition-transform duration-300 ease-out': !isDragging }"
          :style="{
            height,
            maxHeight: maxHeight || undefined,
            transform: translateY,
          }"
        >
          <div
            class="flex justify-center py-3 cursor-grab active:cursor-grabbing select-none touch-none"
            @mousedown="handleStart"
            @mousemove="handleMove"
            @mouseup="handleEnd"
            @mouseleave="handleEnd"
            @touchstart.prevent="handleStart"
            @touchmove.prevent="handleMove"
            @touchend="handleEnd"
          >
            <div class="w-10 h-1 bg-border rounded-full" />
          </div>

          <div class="min-h-0 flex-1">
            <slot />
          </div>
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
