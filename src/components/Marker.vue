<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'

type MarkerCategory = 'projects' | 'travel' | 'sport'
type MarkerState = 'default' | 'hover' | 'click'

interface Props {
  category: MarkerCategory
  state?: MarkerState
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  state: 'default',
  active: false,
})

const categoryConfig = {
  projects: {
    default: '#3F51B5',
    hover: '#6F7DC8',
    icon: 'project',
  },
  travel: {
    default: '#FF5722',
    hover: '#FF8159',
    icon: 'travel',
  },
  sport: {
    default: '#9C27B0',
    hover: '#B55DC4',
    icon: 'sport',
  },
}

const isHovered = ref(false)

const visualState = computed<MarkerState>(() => {
  if (props.active || props.state === 'click') return 'click'
  if (isHovered.value || props.state === 'hover') return 'hover'
  return 'default'
})

const config = computed(() => categoryConfig[props.category])
const categoryColor = computed(() => config.value.default)
const fillColor = computed(() => visualState.value === 'hover' ? config.value.hover : config.value.default)
const outerColor = computed(() => visualState.value === 'click' ? categoryColor.value : '#FFFFFF')
const innerColor = computed(() => visualState.value === 'click' ? '#FFFFFF' : fillColor.value)
const iconColor = computed(() => visualState.value === 'click' ? categoryColor.value : '#FFFFFF')

const markerStyle = computed(() => ({
  '--marker-category-color': categoryColor.value,
  '--marker-outer-color': outerColor.value,
  '--marker-inner-color': innerColor.value,
  '--marker-icon-color': iconColor.value,
}))
</script>

<template>
  <div
    class="marker-wrapper marker-pin"
    :class="[`marker-pin--${visualState}`, { active: props.active }]"
    :style="markerStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="marker-pin__shape" aria-hidden="true">
      <span class="marker-pin__tail marker-pin__tail--outer"></span>
      <span class="marker-pin__circle marker-pin__circle--outer"></span>
      <span class="marker-pin__tail marker-pin__tail--inner"></span>

      <span class="marker-pin__circle marker-pin__circle--inner">
        <BaseIcon
          :name="config.icon"
          class="marker-pin__icon"
          size="16px"
        />
      </span>
    </div>

    <span
      class="marker-pin__dot"
      aria-hidden="true"
    ></span>
  </div>
</template>

<style scoped>
.marker-pin {
  position: relative;
  width: 50px;
  height: 67px;
  cursor: pointer;
  color: var(--marker-icon-color);
  transform-origin: 25px 57px;
  transition: transform 160ms ease;
}

.marker-pin--hover {
  transform: translateY(-1px);
}

.marker-pin--click {
  transform: translateY(1px);
}

.marker-pin__shape {
  position: absolute;
  top: 0;
  left: 3px;
  width: 44px;
  height: 52px;
  filter:
    drop-shadow(0 4px 4px rgba(12, 12, 13, 0.1))
    drop-shadow(0 4px 4px rgba(12, 12, 13, 0.05));
}

.marker-pin__circle {
  position: absolute;
  border-radius: 999px;
}

.marker-pin__circle--outer {
  inset: 0 0 auto;
  width: 44px;
  height: 44px;
  background: var(--marker-outer-color);
}

.marker-pin__circle--inner {
  top: 2px;
  left: 2px;
  z-index: 3;
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: var(--marker-inner-color);
  color: var(--marker-icon-color);
}

.marker-pin__tail {
  position: absolute;
  border-radius: 2px;
  transform: rotate(45deg);
}

.marker-pin__tail--outer {
  top: 31px;
  left: 13px;
  z-index: 1;
  width: 18px;
  height: 18px;
  background: var(--marker-outer-color);
}

.marker-pin__tail--inner {
  top: 30px;
  left: 15px;
  z-index: 2;
  width: 14px;
  height: 14px;
  background: var(--marker-inner-color);
}

.marker-pin__dot {
  position: absolute;
  top: 54px;
  left: 22px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--marker-category-color);
  box-shadow:
    0 4px 4px rgba(12, 12, 13, 0.1),
    0 4px 4px rgba(12, 12, 13, 0.05);
}

.marker-pin__icon {
  display: block;
  color: currentColor;
}
</style>
