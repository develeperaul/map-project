<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-text-00 text-white">
      <svg class="h-5 w-5" aria-hidden="true">
        <use :href="`#${icon}`" />
      </svg>
    </div>

    <div class="space-y-1">
      <h3 class="text-sm font-medium text-text-00">
        {{ title }}
      </h3>
      <p class="text-sm text-text-01">
        {{ description }}
      </p>
    </div>
  </div>
</template>
