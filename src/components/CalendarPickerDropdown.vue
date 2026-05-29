<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type DropdownOption = {
  label: string
  selected: boolean
  value: number
}

const props = defineProps<{
  label: string
  open: boolean
  options: DropdownOption[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [value: number]
}>()

const rootRef = ref<HTMLElement | null>(null)

const close = () => {
  emit('update:open', false)
}

const handlePointerDown = (event: MouseEvent | TouchEvent) => {
  const target = event.target as Node | null
  if (!props.open || !target) return
  if (!rootRef.value?.contains(target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handlePointerDown)
  document.addEventListener('touchstart', handlePointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handlePointerDown)
  document.removeEventListener('touchstart', handlePointerDown)
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="cursor-pointer text-sm font-medium leading-5 text-primary underline underline-offset-2"
      @click="emit('update:open', !open)"
    >
      {{ label }}
    </button>

    <Transition name="dropdown-fade">
      <div
        v-if="open"
        class="absolute left-0 top-[calc(100%+8px)] z-20 w-[208px] rounded-[8px] bg-white px-2 py-2 shadow-[0px_4px_12px_rgba(0,0,0,0.10),0px_1px_2px_rgba(0,0,0,0.15)] "
      >
        <div class="max-h-[196px] overflow-y-auto pr-1">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="cursor-pointer flex h-12 w-full items-center rounded-[8px] px-4 text-left text-[16px] font-medium leading-6 text-text-00"
            :class="option.selected ? 'bg-base-00' : 'bg-white'"
            @click="emit('select', option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
