<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Marker } from '../../data/mock'
import { useMapStore } from '../../stores/map'
import BaseIcon from '../BaseIcon.vue'
import Button from '../Button.vue'
import ImageWithLoader from '../ImageWithLoader.vue'

interface Props {
  tasks?: Marker[]
  taskIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  tasks: () => [],
  taskIndex: 0,
})

const emit = defineEmits<{
  'update:taskIndex': [value: number]
}>()

const mapStore = useMapStore()
const isExpanded = ref(false)
const isGalleryOpen = ref(false)
const activeGalleryIndex = ref(0)
const transitionName = ref('task-forward')
let previousBodyOverflow = ''
let isDocumentLocked = false

const marker = computed(() => mapStore.selectedMarker)
const hasTasks = computed(() => props.tasks.length > 0)
const isProjectTasks = computed(() => hasTasks.value && props.tasks.some(task => task.category === 'projects'))

// Если есть задачи, показываем активную задачу, иначе сам маркер.
const currentTask = computed(() => {
  if (!hasTasks.value) return marker.value
  return props.tasks[Math.min(props.taskIndex, props.tasks.length - 1)] || marker.value
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

// Длинный текст сворачиваем, пока пользователь не раскроет его вручную.
const displayedDescription = computed(() => {
  const text = currentTask.value?.description || ''
  if (isExpanded.value || text.length <= 120) {
    return text
  }

  return `${text.slice(0, 120).trimEnd()}...`
})
const canExpandDescription = computed(() => (currentTask.value?.description || '').length > 120)

const galleryImages = computed(() => {
  const taskImages = currentTask.value?.images || []
  const markerImages = marker.value?.images || []

  return taskImages.length > 0 ? taskImages : markerImages
})

const activeGalleryImage = computed(() => galleryImages.value[activeGalleryIndex.value] || null)
const galleryCounter = computed(() => `${activeGalleryIndex.value + 1} из ${galleryImages.value.length}`)
const activeImageCaption = computed(() => (
  activeGalleryImage.value?.description || currentTask.value?.title || 'Описание фотографии'
))
const distanceLabel = computed(() => currentTask.value?.distance || marker.value?.distance || '')
const activeImageLocation = computed(() => activeGalleryImage.value?.city || currentTask.value?.city || '')

const handleClose = () => {
  closeGallery()
  mapStore.clearSelection()
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
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

const goPrev = () => {
  if (!hasTasks.value) return
  closeGallery()
  transitionName.value = 'task-back'
  emit('update:taskIndex', (props.taskIndex - 1 + props.tasks.length) % props.tasks.length)
}

const goNext = () => {
  if (!hasTasks.value) return
  closeGallery()
  transitionName.value = 'task-forward'
  emit('update:taskIndex', (props.taskIndex + 1) % props.tasks.length)
}

watch(() => props.taskIndex, () => {
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
  <div v-if="currentTask" class="w-[409px] min-h-[640px] bg-white rounded-card border border-border p-6  relative flex flex-col" style="box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.30), 0 2px 6px 2px rgba(0, 0, 0, 0.15);">
    <button
      class=" mr-0 ml-auto mb-4 flex h-10 w-10 items-center justify-center rounded-button bg-base-00 text-text-00 hover:text-text-00 transition-colors"
      @click="handleClose"
    >
      <BaseIcon name="close" class="w-5 h-5" />
    </button>

    <div class="flex flex-col gap-4 h-full">
      <Transition :name="transitionName" mode="out-in">
        <div :key="currentTask.id" class="flex min-h-[330px] flex-col gap-2">
          <div v-if="galleryImages.length" class="flex gap-2 -mx-6 mb-4  overflow-auto scrollbar-hidden">
            <button
              v-for="(image, index) in galleryImages"
              :key="`${image.url}-${index}`"
              type="button"
              class="h-[158px] w-[281px] rounded-2xl flex-shrink-0 overflow-hidden text-left"
              :class="{'mr-6': index+1 === galleryImages.length, 'ml-6': index === 0}"
              :aria-label="`Открыть изображение ${index + 1}`"
              @click="openGallery(index)"
            >
              <ImageWithLoader
                :src="image.url"
                :alt="image.description || currentTask.title"
                wrapper-class="h-full w-full rounded-2xl"
                img-class="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
              />
            </button>
          </div>

          <div class=" mb-2">
            <h3 class="text-base font-medium text-text-00 flex-1 min-w-0">
              {{ currentTask.title }}
            </h3>

            <div v-if="currentTask.city || distanceLabel" class="mt-1 flex items-center gap-2 text-sm text-text-01">
              <BaseIcon name="location" class="h-4 w-4 flex-shrink-0 text-text-01" />
              <span v-if="currentTask.city">{{ currentTask.city }}</span>
              <span v-if="currentTask.city && distanceLabel">•</span>
              <span v-if="distanceLabel">{{ distanceLabel }}</span>
            </div>

            <div v-if="hasTasks" class="mt-1 text-sm text-text-01">
              Выполнено {{ completedCount }}/{{ totalCount }}
            </div>
          </div>

          <p v-if="displayedDescription" class="text-sm leading-6 text-text-00 max-h-[260px] overflow-hidden" >
            {{ displayedDescription }}
          </p>
          <div>
            <div v-if="currentTask.date" class="text-sm text-text-01">
              {{ formatMonthYear(currentTask.date) }}
            </div>
            <button
              v-if="canExpandDescription"
              type="button"
              class="inline-flex items-center gap-1 self-start text-sm font-medium text-primary hover:text-primary-hover"
              @click="toggleExpanded"
            >
              {{ isExpanded ? 'Свернуть' : 'Полный текст' }}
              <svg class="h-4 w-4 transition-transform" :class="isExpanded ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
              </svg>
            </button>

          </div>
        </div>
      </Transition>



      <div v-if="hasTasks" class="mt-auto pt-6 flex flex-col items-center gap-3">
        <div class="flex w-full gap-2">
          <Button variant="base" size="lg" class="flex-1" @click="goPrev">
            Назад
          </Button>
          <Button variant="primary" size="lg" class="flex-1" @click="goNext">
            Далее
          </Button>
        </div>

        <div v-if="isProjectTasks" class="flex items-center gap-2">
          <span
            v-for="(task, idx) in tasks"
            :key="task.id"
            data-slide-dot
            class="relative flex h-4 w-4 items-center justify-center"
            :data-task-status="getTaskPaginationStatus(task)"
            :data-task-active="idx === taskIndex"
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
              v-if="idx === taskIndex"
              class="absolute left-1/2 -bottom-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-text-00"
            />
          </span>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="gallery-fade">
      <div
        v-if="isGalleryOpen && activeGalleryImage"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-12"
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр изображений"
        @click="closeGallery"
      >
        <button
          type="button"
          class="absolute right-12 top-12 flex h-12 w-12 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01 "
          aria-label="Закрыть просмотр"
          @click.stop="closeGallery"
        >
          <BaseIcon name="close" class="h-5 w-5" size="20px" />
        </button>

        <button
          v-if="galleryImages.length > 1"
          type="button"
          class="absolute left-12 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01 "
          aria-label="Предыдущее изображение"
          @click.stop="goGalleryPrev"
        >
          <BaseIcon name="arrow-left" class="h-5 w-5" size="20px" />
        </button>

        <div class="flex h-full w-full max-w-[920px] flex-col items-center justify-center gap-6" @click.stop>
          <div class="w-full px-4 text-center text-base font-medium leading-6 text-white">
            {{ galleryCounter }}
          </div>

          <div class="min-h-0 w-full flex-1 overflow-hidden rounded-card">
            <ImageWithLoader
              :src="activeGalleryImage.url"
              :alt="activeImageCaption"
              wrapper-class="h-full w-full rounded-card"
              img-class="h-full w-full rounded-card object-contain"
            />
          </div>

          <div class="flex w-full flex-col items-center justify-center gap-1 px-4 text-center">
            <p class="max-w-full truncate text-base font-medium leading-6 text-white">
              {{ activeImageCaption }}
            </p>
            <div v-if="activeImageLocation || distanceLabel" class="flex max-w-full items-center gap-2 text-sm leading-5 text-white">
              <BaseIcon v-if="activeImageLocation" name="location" class="h-3 w-3 flex-shrink-0" size="12px" />
              <span v-if="activeImageLocation" class="truncate">{{ activeImageLocation }}</span>
              <span v-if="activeImageLocation && distanceLabel">•</span>
              <span v-if="distanceLabel" class="truncate">{{ distanceLabel }}</span>
            </div>
          </div>
        </div>

        <button
          v-if="galleryImages.length > 1"
          type="button"
          class="absolute right-12 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-button bg-base-light-00 text-text-dark transition-colors hover:bg-base-light-01 "
          aria-label="Следующее изображение"
          @click.stop="goGalleryNext"
        >
          <BaseIcon name="caret-right" class="h-5 w-5" size="20px" />
        </button>
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
  transform: translateX(18px);
}

.task-forward-leave-to,
.task-back-enter-from {
  opacity: 0;
  transform: translateX(-18px);
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
