<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  src: string
  alt: string
  wrapperClass?: string
  imgClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  wrapperClass: '',
  imgClass: '',
})

const imageRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const hasError = ref(false)
const progress = ref(0)
let progressTimer: ReturnType<typeof setInterval> | null = null

const progressTrackStyle = computed(() => ({
  background: `conic-gradient(rgb(107 99 117) ${progress.value * 3.6}deg, rgb(215 216 217) 0deg)`,
}))

const clearProgressTimer = () => {
  if (progressTimer === null) return
  clearInterval(progressTimer)
  progressTimer = null
}

const startProgressTimer = () => {
  clearProgressTimer()
  progress.value = 0

  progressTimer = setInterval(() => {
    if (progress.value >= 92) {
      clearProgressTimer()
      return
    }

    const step = progress.value < 40 ? 8 : progress.value < 70 ? 4 : 2
    progress.value = Math.min(progress.value + step, 92)
  }, 120)
}

const syncLoadedState = () => {
  const image = imageRef.value
  if (!image) return

  if (image.complete && image.naturalWidth > 0) {
    isLoaded.value = true
    hasError.value = false
    progress.value = 100
    clearProgressTimer()
  }
}

watch(() => props.src, async () => {
  isLoaded.value = false
  hasError.value = false
  startProgressTimer()
  await nextTick()
  syncLoadedState()
}, { immediate: true })

const handleLoad = () => {
  isLoaded.value = true
  hasError.value = false
  progress.value = 100
  clearProgressTimer()
}

const handleError = () => {
  isLoaded.value = false
  hasError.value = true
  clearProgressTimer()
}

onBeforeUnmount(() => {
  clearProgressTimer()
})
</script>

<template>
  <div
    class="relative overflow-hidden bg-base-light-00"
    :class="wrapperClass"
  >
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 flex items-center justify-center " 
      aria-hidden="true"
    >
      <div class="relative flex h-11 w-11 items-center justify-center rounded-full" :style="progressTrackStyle">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-base-light-00 text-[10px] leading-none font-medium text-text-01">
          {{ progress }}%
        </div>
      </div>
    </div>

    <div
      v-else-if="hasError"
      class="absolute inset-0 flex items-center justify-center "
      aria-hidden="true"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-base-light-01 text-text-02">
        <BaseIcon name="camera-off" class="h-6 w-6" />
      </div>
    </div>

    <img
      ref="imageRef"
      :src="src"
      :alt="alt"
      class="transition-opacity duration-200"
      :class="[imgClass, isLoaded ? 'opacity-100' : 'opacity-0']"
      @load="handleLoad"
      @error="handleError"
    >
  </div>
</template>
