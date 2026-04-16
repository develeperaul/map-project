<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  category: 'projects' | 'travel' | 'sport'
  state?: 'default' | 'hover' | 'click'
  active?: boolean
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  state: 'default',
  active: false,
  size: 44,
})

// Внешний вид зависит от типа точки на карте.
const categoryConfig = {
  projects: {
    bg: 'bg-primary',
    innerBg: 'bg-primary',
    icon: 'project',
    bottomColor: '#4527A0',
    type: 'pin',
  },
  travel: {
    bg: 'bg-orange',
    innerBg: 'bg-orange',
    icon: 'travel',
    bottomColor: '#FF9800',
    type: 'circle',
  },
  sport: {
    bg: 'bg-purple',
    innerBg: 'bg-purple',
    icon: 'sport',
    bottomColor: '#9C27B0',
    type: 'pin',
  },
}

const stateClasses = {
  default: '',
  hover: 'scale-110',
  click: 'scale-95',
}

const isCircle = computed(() => categoryConfig[props.category].type === 'circle')
const isPin = computed(() => categoryConfig[props.category].type === 'pin')
const config = computed(() => categoryConfig[props.category])
</script>

<template>
  <div v-if="isCircle" class="relative flex items-center justify-center marker-wrapper" :class="{ active: props.active }">
    <div 
      class="w-10 h-10 rounded-full border-2 border-white shadow-lg transition-transform flex items-center justify-center"
      :class="[
        props.state === 'click' ? 'scale-90' : '',
        props.state === 'hover' ? 'scale-110' : ''
      ]"
      :style="{ backgroundColor: config.bottomColor }"
    >
      <BaseIcon :name="config.icon" class="w-5 h-5 text-white" />
    </div>
  </div>

  <svg v-else-if="isPin" class="marker-wrapper" :class="{ active: props.active }" width="50" height="67" viewBox="0 0 50 67" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_348_42128)">
        <rect x="3" width="44" height="44" rx="22" fill="white" shape-rendering="crispEdges"/>
        <foreignObject x="5" y="2" width="40" height="40">
          <div
          class=" relative rounded-full border-2 border-white flex items-center justify-center transition-transform cursor-pointer relative"
          :class="[
            stateClasses[state],
            `w-${props.size / 4} h-${props.size / 4}`
          ]"
        >
          
          <div
            class="rounded-full flex items-center justify-center"
            :class="[
              categoryConfig[category].bg,
              
            ]"
          >
            
            <div
              class="rounded-full flex items-center justify-center w-10 h-10"
              :class="[
                categoryConfig[category].innerBg
                
              ]"
            >
              <BaseIcon
                :name="categoryConfig[category].icon"
                class="text-white"
                :size="`${props.size * 0.4}px`"
              />
            </div>
          </div>

          
          <div
            v-if="state === 'hover'"
            class="absolute inset-0 rounded-full border-2 border-primary-20 animate-pulse"
          ></div>
        </div>
        </foreignObject>
        <path d="M12.3525 40L18.5226 41.4636C22.7814 42.4738 27.2177 42.4715 31.4755 41.457L37.5898 40L26.3766 50.6877C25.6053 51.4228 24.3931 51.4242 23.6201 50.6908L12.3525 40Z" fill="white"/>
        
        <circle cx="25" cy="57" :r="3" :fill="categoryConfig[category].bottomColor"/>
      </g>
      <defs>
      <filter id="filter0_dd_348_42128" x="0" y="0" width="50" height="67" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect1_dropShadow_348_42128"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.0470588 0 0 0 0 0.0470588 0 0 0 0 0.0509804 0 0 0 0.05 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_348_42128"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect2_dropShadow_348_42128"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.0470588 0 0 0 0 0.0470588 0 0 0 0 0.0509804 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_348_42128" result="effect2_dropShadow_348_42128"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_348_42128" result="shape"/>
      </filter>
      </defs>
    </svg>
</template>
