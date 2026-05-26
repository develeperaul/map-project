<script setup lang="ts">
import Button from './Button.vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  filterCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-dark text-white">
      <BaseIcon name="project" class="h-5 w-5" />
    </div>

    <div class="space-y-1">
      <h3 class="text-body-m font-medium text-text-00">
        Ничего не найдено
      </h3>
      <p class="text-body-s text-text-01">
        Измените параметры поиска или очистите фильтры.
      </p>
    </div>

    <Button
      variant="base"
      size="lg"
      class="mt-2 w-full"
      @click="emit('clear')"
    >
      Очистить фильтр
    </Button>
  </div>
</template>
