<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMapStore } from '../stores/map'
import MapView from '../components/MapView.vue'

const route = useRoute()
const router = useRouter()
const mapStore = useMapStore()

onMounted(() => {
  const category = route.query.category as string
  if (category && ['projects', 'travel', 'sport'].includes(category)) {
    mapStore.setCategory(category as 'projects' | 'travel' | 'sport')
  }
})

watch(() => route.query.category, (newCategory) => {
  if (newCategory && ['projects', 'travel', 'sport'].includes(newCategory as string)) {
    mapStore.setCategory(newCategory as 'projects' | 'travel' | 'sport')
  }
})
</script>

<template>
  <div class="h-screen w-screen">
    <MapView />
  </div>
</template>