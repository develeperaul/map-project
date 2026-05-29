<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Button from '../Button.vue'

const props = defineProps<{
  paragraphs: string[]
}>()

const isOpen = ref(false)
const popupTouchStartY = ref<number | null>(null)
const popupDragDeltaY = ref(0)
const isPopupDragging = ref(false)

let previousBodyOverflow = ''
let isDocumentLocked = false

const popupStyle = computed(() => ({
  transform: isPopupDragging.value ? `translateY(${popupDragDeltaY.value}px)` : 'translateY(0px)',
  transition: isPopupDragging.value ? 'none' : 'transform 220ms ease',
}))

const lockDocumentScroll = () => {
  if (typeof document === 'undefined' || isDocumentLocked) return
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isDocumentLocked = true
}

const unlockDocumentScroll = () => {
  if (typeof document === 'undefined' || !isDocumentLocked) return
  document.body.style.overflow = previousBodyOverflow
  isDocumentLocked = false
}

const open = () => {
  isOpen.value = true
  popupTouchStartY.value = null
  popupDragDeltaY.value = 0
  isPopupDragging.value = false
  lockDocumentScroll()
}

const close = () => {
  isOpen.value = false
  popupTouchStartY.value = null
  popupDragDeltaY.value = 0
  isPopupDragging.value = false
  unlockDocumentScroll()
}

const handlePopupDragStart = (event: TouchEvent | MouseEvent) => {
  isPopupDragging.value = true
  popupTouchStartY.value = 'touches' in event ? event.touches[0]?.clientY ?? null : event.clientY
}

const handlePopupDragMove = (event: TouchEvent | MouseEvent) => {
  if (!isPopupDragging.value || popupTouchStartY.value === null) return

  const clientY = 'touches' in event ? event.touches[0]?.clientY ?? popupTouchStartY.value : event.clientY
  const deltaY = clientY - popupTouchStartY.value

  if (deltaY > 0) {
    popupDragDeltaY.value = deltaY
  }
}

const handlePopupDragEnd = () => {
  if (!isPopupDragging.value) return

  if (popupDragDeltaY.value > 100) {
    close()
    return
  }

  isPopupDragging.value = false
  popupTouchStartY.value = null
  popupDragDeltaY.value = 0
}

const handleClose = () => {
  close()
}

watch(isOpen, (value) => {
  if (!value) {
    unlockDocumentScroll()
  }
})

onBeforeUnmount(() => {
  unlockDocumentScroll()
})

defineExpose({
  open,
  close,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="popup-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[90] bg-[rgba(0,0,0,0.32)]"
        role="dialog"
        aria-modal="true"
        aria-label="Полный текст"
        @click.self="close"
      >
        <div
          class="absolute inset-x-0 bottom-0 flex h-[460px] min-h-0 flex-col rounded-t-[16px] bg-white px-4 pb-6 pt-3 "
          :style="popupStyle"
          @touchstart.passive="handlePopupDragStart"
          @touchmove.passive="handlePopupDragMove"
          @touchend.passive="handlePopupDragEnd"
          @mousedown="handlePopupDragStart"
          @mousemove="handlePopupDragMove"
          @mouseup="handlePopupDragEnd"
          @mouseleave="handlePopupDragEnd"
        >
          <div class="flex flex-col gap-4">
            <div class="flex justify-center">
              <div class="h-1 w-10 rounded-full bg-[#E6E7E9]" />
            </div>

            <h3 class="text-[20px] font-medium leading-6 text-[#24292c]">
              Описание
            </h3>
          </div>

          <div class="mt-4 flex-1 overflow-y-auto">
            <div class="flex flex-col gap-2 text-sm font-normal leading-5 text-[#626870]">
              <p
                v-for="(paragraph, index) in props.paragraphs"
                :key="`${paragraph}-${index}`"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>

          <Button
            variant="base"
            size="xl"
            class="mt-4 w-full !bg-[#F3F4F7] !text-[#24292c]"
            @click="handleClose"
          >
            Закрыть
          </Button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 180ms ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}
</style>
