<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue'
import FullTextPopup from './FullTextPopup.vue'
import ImageWithLoader from '../ImageWithLoader.vue'

const props = withDefaults(defineProps<{
  marker: Marker
  project?: Marker | null
  tasks?: Marker[]
  taskIndex?: number
}>(), {
  project: null,
  tasks: () => [],
  taskIndex: 0,
})

const emit = defineEmits<{
  back: []
  close: []
  'update:taskIndex': [value: number]
}>()

const isExpanded = ref(false)
const touchStartX = ref<number | null>(null)
const dragStartY = ref<number | null>(null)
const dragDeltaY = ref(0)
const isDragging = ref(false)
const galleryTouchStartX = ref<number | null>(null)
const isGalleryOpen = ref(false)
const activeGalleryIndex = ref(0)
const transitionName = ref('task-forward')
const fullTextPopupRef = ref<{ open: () => void; close: () => void } | null>(null)
let previousBodyOverflow = ''
let isDocumentLocked = false

const hasTasks = computed(() => props.tasks.length > 0)
const currentTask = computed(() => {
  if (!hasTasks.value) return props.marker
  return props.tasks[Math.min(props.taskIndex, props.tasks.length - 1)] || props.marker
})

const completedCount = computed(() => props.tasks.filter(task => task.status === 100).length)
const totalCount = computed(() => props.tasks.length)
const getTaskPaginationStatus = (task: Marker) => {
  if (task.status === 100) return 'completed'
  if (typeof task.status === 'number' && task.status > 0) return 'in-progress'
  return 'pending'
}

const getTaskProgressOffset = (task: Marker) => {
  if (typeof task.status !== 'number') return 100
  const progress = Math.max(0, Math.min(task.status, 100))
  return 100 - progress
}
const currentImages = computed(() => {
  const ownImages = currentTask.value.images || []
  const fallbackImages = props.project?.images || []
  return ownImages.length ? ownImages : fallbackImages
})
const galleryImages = computed(() => currentImages.value.slice(0, 5))
const activeGalleryImage = computed(() => galleryImages.value[activeGalleryIndex.value] || null)
const galleryCounter = computed(() => `${activeGalleryIndex.value + 1} из ${galleryImages.value.length}`)
const activeImageCaption = computed(() => (
  activeGalleryImage.value?.description || currentTask.value.title || 'Описание фотографии'
))
const distanceLabel = computed(() => currentTask.value.distance || props.project?.distance || props.marker.distance || '')
const activeImageLocation = computed(() => activeGalleryImage.value?.city || props.project?.city || currentTask.value.city || '')

const isCompleted = computed(() => currentTask.value.status === 100)
const isActive = computed(() => typeof currentTask.value.status === 'number' && currentTask.value.status < 100)
const isProjectTask = computed(() => currentTask.value.category === 'projects')

const canGoPrev = computed(() => hasTasks.value && props.taskIndex > 0)
const canGoNext = computed(() => hasTasks.value && props.taskIndex < props.tasks.length - 1)

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const formatMonthYear = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

const displayedDescription = computed(() => {
  const text = currentTask.value.description || ''
  if (isExpanded.value || text.length <= 120) return text
  return `${text.slice(0, 120).trimEnd()}...`
})

const canExpandDescription = computed(() => (currentTask.value.description || '').length > 120)
const fullTextParagraphs = computed(() => {
  const raw = (currentTask.value.description || '').trim()
  if (!raw) return []
  const paragraphs = raw
    .split(/\n+/)
    .map(part => part.trim())
    .filter(Boolean)

  return paragraphs.length > 0 ? paragraphs : [raw]
})

const sheetStyle = computed(() => ({
  transform: isDragging.value ? `translateY(${dragDeltaY.value}px)` : 'translateY(0px)',
  transition: isDragging.value ? 'none' : 'transform 220ms ease',
}))

const setTaskIndex = (value: number) => {
  if (!hasTasks.value) return
  const next = Math.max(0, Math.min(value, props.tasks.length - 1))
  if (next !== props.taskIndex) {
    emit('update:taskIndex', next)
  }
}

const goPrev = () => {
  if (canGoPrev.value) setTaskIndex(props.taskIndex - 1)
}

const goNext = () => {
  if (canGoNext.value) setTaskIndex(props.taskIndex + 1)
}

const handleClose = () => {
  emit('close')
}

const openFullTextPopup = () => {
  if (!canExpandDescription.value) return
  fullTextPopupRef.value?.open()
}

const openGallery = (index: number) => {
  if (!galleryImages.value.length) return
  activeGalleryIndex.value = index
  isGalleryOpen.value = true
}

const closeGallery = () => {
  isGalleryOpen.value = false
}

const goGalleryPrev = () => {
  if (galleryImages.value.length < 2) return
  activeGalleryIndex.value = (activeGalleryIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

const goGalleryNext = () => {
  if (galleryImages.value.length < 2) return
  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % galleryImages.value.length
}

const handleTouchStart = (event: TouchEvent) => {
  if (isGalleryOpen.value) return
  touchStartX.value = event.touches[0]?.clientX ?? null
}

const handleTouchEnd = (event: TouchEvent) => {
  if (isGalleryOpen.value || touchStartX.value === null) return

  const endX = event.changedTouches[0]?.clientX ?? touchStartX.value
  const diff = endX - touchStartX.value
  touchStartX.value = null

  if (Math.abs(diff) < 48) return
  if (diff < 0) {
    goNext()
    return
  }
  goPrev()
}

const handleDragStart = (event: TouchEvent | MouseEvent) => {
  isDragging.value = true
  dragStartY.value = 'touches' in event ? event.touches[0]?.clientY ?? null : event.clientY
}

const handleDragMove = (event: TouchEvent | MouseEvent) => {
  if (!isDragging.value || dragStartY.value === null) return

  const clientY = 'touches' in event ? event.touches[0]?.clientY ?? dragStartY.value : event.clientY
  const deltaY = clientY - dragStartY.value

  if (deltaY > 0) {
    dragDeltaY.value = deltaY
  }
}

const handleDragEnd = () => {
  if (!isDragging.value) return

  if (dragDeltaY.value > 100) {
    handleClose()
  }

  isDragging.value = false
  dragStartY.value = null
  dragDeltaY.value = 0
}

const handleGalleryTouchStart = (event: TouchEvent) => {
  galleryTouchStartX.value = event.touches[0]?.clientX ?? null
}

const handleGalleryTouchEnd = (event: TouchEvent) => {
  if (galleryTouchStartX.value === null) return

  const endX = event.changedTouches[0]?.clientX ?? galleryTouchStartX.value
  const diff = endX - galleryTouchStartX.value
  galleryTouchStartX.value = null

  if (Math.abs(diff) < 48) return
  if (diff < 0) {
    goGalleryNext()
    return
  }
  goGalleryPrev()
}

const handleGalleryKeydown = (event: KeyboardEvent) => {
  if (!isGalleryOpen.value) return

  if (event.key === 'Escape') {
    closeGallery()
    return
  }

  if (event.key === 'ArrowLeft') {
    goGalleryPrev()
    return
  }

  if (event.key === 'ArrowRight') {
    goGalleryNext()
  }
}

const lockDocumentScroll = () => {
  if (typeof document === 'undefined' || isDocumentLocked) return
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', handleGalleryKeydown)
  isDocumentLocked = true
}

const unlockDocumentScroll = () => {
  if (typeof document === 'undefined' || !isDocumentLocked) return
  document.body.style.overflow = previousBodyOverflow
  document.removeEventListener('keydown', handleGalleryKeydown)
  isDocumentLocked = false
}

watch(() => props.taskIndex, (value, oldValue) => {
  transitionName.value = value >= oldValue ? 'task-forward' : 'task-back'
  isExpanded.value = false
  closeGallery()
  fullTextPopupRef.value?.close()
})

watch(isGalleryOpen, (isOpen) => {
  if (typeof document === 'undefined') return

  if (isOpen) {
    document.addEventListener('keydown', handleGalleryKeydown)
    return
  }

  document.removeEventListener('keydown', handleGalleryKeydown)
})

watch(galleryImages, (images) => {
  if (activeGalleryIndex.value > images.length - 1) {
    activeGalleryIndex.value = 0
  }

  if (!images.length) {
    closeGallery()
  }
})

onMounted(() => {
  lockDocumentScroll()
})

onBeforeUnmount(() => {
  unlockDocumentScroll()
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', handleGalleryKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="currentTask"
      data-mobile-description
      class="fixed inset-0 z-[70] overflow-hidden bg-transparent pointer-events-none overscroll-contain"
    >
      <div
        class="absolute inset-x-0 bottom-0 flex h-full min-h-0 flex-col justify-end px-4 pb-6 pointer-events-auto "
        @touchstart.passive="handleTouchStart"
        @touchend.passive="handleTouchEnd"
      >
        <Transition :name="transitionName" mode="out-in">
          <div
            v-if="galleryImages.length"
            :key="`gallery-${currentTask.id}`"
            class="mb-3 flex shrink-0 gap-2 overflow-x-auto pb-1"
            @touchstart.stop
            @touchend.stop
          >
            <button
              v-for="(image, index) in galleryImages"
              :key="`${image.url}-${index}`"
              type="button"
              class="h-20 w-[142px] shrink-0 overflow-hidden rounded-lg text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]"
              :aria-label="`Открыть изображение ${index + 1}`"
              @click="openGallery(index)"
            >
              <ImageWithLoader
                :src="image.url"
                :alt="image.description || currentTask.title"
                wrapper-class="h-full w-full rounded-lg"
                img-class="h-full w-full rounded-lg object-cover"
              />
            </button>
          </div>
        </Transition>

        <div
          class="flex max-h-[82vh] min-h-0 flex-col overflow-hidden rounded-[24px] bg-white pb-6 pt-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]"
          :style="sheetStyle"
        >
          <div
            class="flex justify-center py-2 cursor-grab active:cursor-grabbing select-none touch-none"
            @mousedown="handleDragStart"
            @mousemove="handleDragMove"
            @mouseup="handleDragEnd"
            @mouseleave="handleDragEnd"
            @touchstart.prevent="handleDragStart"
            @touchmove.prevent="handleDragMove"
            @touchend="handleDragEnd"
          >
            <div class="h-1 w-10 rounded-full bg-base-01" />
          </div>

          <div class="flex items-start gap-4 px-4 pb-3">
            <button
              type="button"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-00 text-text-00 transition-colors"
              aria-label="Назад"
              @click="emit('back')"
            >
              <BaseIcon name="caret-left" class="h-4 w-4" size="16px" />
            </button>

            <div class="min-w-0 flex-1 text-center">
              <h3 v-if="hasTasks" class="truncate text-sm font-medium leading-5 text-text-00">
                {{ props.project?.title || currentTask.title }}
              </h3>
              <p v-if="hasTasks" class="mt-0.5 text-xs font-normal leading-4 text-text-01">
                Выполнено {{ completedCount }}/{{ totalCount }}
              </p>
            </div>

            <button
              type="button"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-00 text-text-00 transition-colors"
              aria-label="Закрыть описание"
              @click="handleClose"
            >
              <BaseIcon name="close" class="h-4 w-4" size="16px" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
            <Transition :name="transitionName" mode="out-in">
              <div :key="currentTask.id" >
                <div class="flex items-start gap-3">
                  <div class="mt-[7px] shrink-0">
                    <span
                      v-if="isProjectTask && isCompleted"
                      class="flex h-4 w-4 items-center justify-center rounded-full bg-secondary-dark text-white"
                    >
                      <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <svg v-else-if="isProjectTask && isActive" width="14" height="14" viewBox="0 0 14 14" class="rotate-[-90deg]">
                  <circle cx="7" cy="7" r="5.5" fill="none" stroke="#E5E7EB" stroke-width="2" />
                  <circle
                    cx="7"
                    cy="7"
                    r="5.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    pathLength="100"
                    stroke-dasharray="100"
                    :stroke-dashoffset="marker.status !== undefined ? 100 - marker.status : 100"
                    class="text-primary"
                  />
                </svg>

                    <span
                      v-else
                      class="block h-2.5 w-2.5 rounded-full"
                      :class="currentTask.category === 'travel' ? 'bg-orange' : currentTask.category === 'sport' ? 'bg-purple' : 'bg-primary'"
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <h4 class="text-lg font-medium leading-6 text-text-00">
                      {{ currentTask.title }}
                    </h4>
                    <div v-if="currentTask.city || distanceLabel" class="mt-1 flex items-center gap-2 text-xs leading-4 text-text-01">
                      <BaseIcon name="location" class="h-3 w-3 shrink-0 text-text-01" size="12px" />
                      <span v-if="currentTask.city" class="truncate">{{ currentTask.city }}</span>
                      <span v-if="currentTask.city && distanceLabel">•</span>
                      <span v-if="distanceLabel" class="truncate">{{ distanceLabel }}</span>
                    </div>
                  </div>
                </div>

                <p v-if="displayedDescription" class="mt-4 text-sm font-normal leading-5 text-text-00">
                  {{ displayedDescription }}
                </p>

                <div v-if="currentTask.date" class="mt-2 text-xs leading-4 text-text-02">
                  {{ formatMonthYear(currentTask.date) }}
                </div>

                <button
                  v-if="canExpandDescription"
                  type="button"
                  class="mt-3 inline-flex items-center gap-2 text-sm font-medium leading-5 text-primary underline decoration-solid underline-offset-2 transition-colors hover:text-primary-hover"
                  aria-label="Полный текст"
                  @click="openFullTextPopup"
                >
                  <span>Полный текст</span>
                  <BaseIcon name="caret-down" class="h-5 w-5 text-primary" size="20px" />
                </button>
              </div>
            </Transition>

            <div v-if="hasTasks" class="mt-4 flex items-center justify-center gap-2" aria-label="Задачи проекта">
              <button
                v-for="(task, index) in tasks"
                :key="index"
                type="button"
                class="relative flex h-4 w-4 items-center justify-center"
                :data-task-dot="index"
                :data-task-status="getTaskPaginationStatus(task)"
                :data-task-active="index === taskIndex"
                :aria-label="`Открыть задачу ${index + 1}`"
                :aria-current="index === taskIndex ? 'step' : undefined"
                @click="setTaskIndex(index)"
              >
                <span
                  v-if="task.status === 100"
                  class="flex h-3 w-3 items-center justify-center rounded-full bg-secondary-dark text-white"
                >
                  <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>

                <svg
                  v-else
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  class="rotate-[-90deg]"
                >
                  <circle cx="7" cy="7" r="5.5" fill="none" stroke="#E5E7EB" stroke-width="2" />
                  <circle
                    cx="7"
                    cy="7"
                    r="5.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    pathLength="100"
                    stroke-dasharray="100"
                    :stroke-dashoffset="getTaskProgressOffset(task)"
                    class="text-primary"
                  />
                </svg>

                <span
                  v-if="index === taskIndex"
                  class="absolute left-1/2 -bottom-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-text-00"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <FullTextPopup
    ref="fullTextPopupRef"
    :paragraphs="fullTextParagraphs"
  />

  <Teleport to="body">
    <Transition name="gallery-fade">
      <div
        v-if="isGalleryOpen && activeGalleryImage"
        class="fixed inset-0 z-[100] flex flex-col bg-black/90 text-white"
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр изображений"
        @touchstart.passive="handleGalleryTouchStart"
        @touchend.passive="handleGalleryTouchEnd"
      >
        <div class="flex items-center gap-4 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)]">
          <button
            type="button"
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors"
            aria-label="Закрыть просмотр"
            @click="closeGallery"
          >
            <BaseIcon name="caret-left" class="h-4 w-4" size="16px" />
          </button>

          <div class="min-w-0 flex-1 text-center">
            <p class="text-sm font-medium leading-5 text-white">
              {{ galleryCounter }}
            </p>
          </div>

          <span class="h-11 w-11 shrink-0" aria-hidden="true"></span>
        </div>

        <div class="flex min-h-0 flex-1 items-center justify-center bg-black/65">
          <ImageWithLoader
            :src="activeGalleryImage.url"
            :alt="activeImageCaption"
            wrapper-class="h-full w-full"
            img-class="h-full w-full object-contain"
          />
        </div>

        <div class="border-t border-white/8 bg-black/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          <p class="text-sm font-medium leading-5 text-white">
            {{ activeImageCaption }}
          </p>
          <div v-if="activeImageLocation || distanceLabel" class="mt-1 flex items-center gap-2 text-xs leading-4 text-white">
            <BaseIcon v-if="activeImageLocation" name="location" class="h-3 w-3 shrink-0" size="12px" />
            <span v-if="activeImageLocation" class="truncate">{{ activeImageLocation }}</span>
            <span v-if="activeImageLocation && distanceLabel">•</span>
            <span v-if="distanceLabel" class="truncate">{{ distanceLabel }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.task-forward-enter-active,
.task-forward-leave-active,
.task-back-enter-active,
.task-back-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.task-forward-enter-from,
.task-back-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.task-forward-leave-to,
.task-back-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 180ms ease;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 180ms ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}
</style>
