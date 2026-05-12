<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Marker } from '../../data/mock'
import BaseIcon from '../BaseIcon.vue'
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
const galleryTouchStartX = ref<number | null>(null)
const isGalleryOpen = ref(false)
const activeGalleryIndex = ref(0)
const transitionName = ref('task-forward')
let previousBodyOverflow = ''
let isDocumentLocked = false
const hasTasks = computed(() => props.tasks.length > 0)
const currentTask = computed(() => {
  if (!hasTasks.value) return props.marker
  return props.tasks[Math.min(props.taskIndex, props.tasks.length - 1)] || props.marker
})

const completedCount = computed(() => props.tasks.filter(task => task.status === 'completed').length)
const totalCount = computed(() => props.tasks.length)
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
const distanceLabel = computed(() => currentTask.value.distance || props.marker.distance || '')
const activeImageLocation = computed(() => activeGalleryImage.value?.city || currentTask.value.city || '')

const isCompleted = computed(() => currentTask.value.status === 'completed')
const isActive = computed(() => typeof currentTask.value.status === 'number')

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
const canExpandDescription = computed(() => currentTask.value.description.length > 120)

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
})

watch(isGalleryOpen, (isOpen) => {
  if (isOpen) {
    lockDocumentScroll()
    return
  }

  unlockDocumentScroll()
})

watch(galleryImages, (images) => {
  if (activeGalleryIndex.value > images.length - 1) {
    activeGalleryIndex.value = 0
  }

  if (!images.length) {
    closeGallery()
  }
})

onBeforeUnmount(() => {
  unlockDocumentScroll()
})
</script>

<template>
  <div
    data-mobile-description
    class="fixed inset-0 z-[70] overflow-hidden bg-transparent pointer-events-auto overscroll-contain"
    @touchstart.passive="handleTouchStart"
    @touchend.passive="handleTouchEnd"
  >
    <div class="absolute inset-x-0 bottom-0 flex max-h-[82vh] min-h-0 flex-col px-4 pb-6">
      <Transition :name="transitionName" mode="out-in">
        <div
          v-if="galleryImages.length"
          :key="`gallery-${currentTask.id}`"
          class="mb-3 flex shrink-0 gap-2 overflow-x-auto pb-1"
        >
          <button
            v-for="(image, index) in galleryImages"
            :key="`${image.url}-${index}`"
            type="button"
            class="h-24 w-[148px] shrink-0 overflow-hidden rounded-lg text-left"
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

      <div class="flex min-h-0 flex-col overflow-hidden rounded-card bg-white shadow-[0_4px_20px_rgba(20,20,20,0.12)]">
        <div class="flex items-start gap-4 p-4 pb-3">
          <button
            v-if="project"
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01"
            aria-label="Назад к задачам"
            @click="emit('back')"
          >
            <BaseIcon name="caret-left" class="h-4 w-4" size="16px" />
          </button>
          <span v-else class="h-10 w-10 shrink-0" aria-hidden="true"></span>

          <div class="min-w-0 flex-1 text-center">
            <!-- <h3 class="truncate text-sm font-medium leading-5 text-text-dark">
              {{ project?.title || currentTask.title }}
            </h3> -->
            <p v-if="hasTasks" class="mt-0.5 text-xs font-normal leading-4 text-text-01">
              Выполнено {{ completedCount }}/{{ totalCount }}
            </p>
          </div>

          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01"
            aria-label="Закрыть описание"
            @click="emit('close')"
          >
            <BaseIcon name="close" class="h-4 w-4" size="16px" />
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5">
          <Transition :name="transitionName" mode="out-in">
            <div :key="currentTask.id" class="min-h-[190px]">
              <div class="flex items-start gap-3">
                <div v-if="currentTask.category === 'projects'" class="mt-1 shrink-0">
                  <span
                    v-if="isCompleted"
                    class="flex h-4 w-4 items-center justify-center rounded-full bg-secondary-dark text-white"
                  >
                    <BaseIcon name="check" class="h-2.5 w-2.5" size="10px" />
                  </span>

                  <span v-else-if="isActive" class="block h-4 w-4 rounded-full border-2 border-primary bg-white"></span>
                </div>

                <div class="min-w-0 flex-1">
                  <h4 class="text-lg font-medium leading-6 text-text-dark">{{ currentTask.title }}</h4>
                  <div v-if="currentTask.city || distanceLabel" class="mt-1 flex items-center gap-2 text-xs leading-4 text-text-01">
                    <svg class="h-4 w-4 shrink-0 text-text-01" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" />
                      <circle cx="12" cy="11" r="2.5" stroke-width="2" />
                    </svg>
                    <span v-if="currentTask.city" class="truncate">{{ currentTask.city }}</span>
                    <span v-if="currentTask.city && distanceLabel">•</span>
                    <span v-if="distanceLabel" class="truncate">{{ distanceLabel }}</span>
                  </div>
                </div>

                <span class="h-10 w-10 shrink-0" aria-hidden="true"></span>
              </div>

              <p v-if="displayedDescription" class="mt-4 text-sm font-normal leading-5 text-text-dark">
                {{ displayedDescription }}
              </p>

              <div v-if="currentTask.date" class="mt-2 text-xs leading-4 text-text-muted">
                {{ formatMonthYear(currentTask.date) }}
              </div>

              <button
                v-if="canExpandDescription"
                type="button"
                class="mt-3 inline-flex items-center gap-2 text-sm font-medium leading-5 text-primary transition-colors hover:text-primary-hover"
                @click="isExpanded = !isExpanded"
              >
                {{ isExpanded ? 'Скрыть текст' : 'Полный текст' }}
                <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isExpanded }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
          </Transition>

          <div v-if="hasTasks" class="mt-4 flex items-center justify-center gap-2" aria-label="Задачи проекта">
            <button
              v-for="(_, index) in tasks"
              :key="index"
              type="button"
              class="h-3 w-3 rounded-full border transition-colors"
              :class="index === taskIndex ? 'border-secondary-dark bg-secondary-dark' : 'border-primary bg-white'"
              :aria-label="`Открыть задачу ${index + 1}`"
              :aria-current="index === taskIndex ? 'step' : undefined"
              data-slide-dot
              @click="setTaskIndex(index)"
            ></button>
          </div>

        </div>
      </div>
    </div>
  </div>

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
</style>
