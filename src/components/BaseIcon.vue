<script setup lang="ts">
interface Props {
  name: string
  class?: string
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '20px'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const iconSize = props.class?.match(/w-(\d+)/)?.[1] 
  ? props.class.match(/w-(\d+)/)[1] + 'px'
  : props.size
</script>

<template>
  <svg 
    :class="['inline-block', $props.class]" 
    :width="iconSize" 
    :height="iconSize"
    @click="emit('click', $event)"
  >
    <use :href="`#${name}`" />
  </svg>
</template>
