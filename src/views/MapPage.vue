<script setup lang='ts'>
import MapView from '../components/MapView.vue'
import CardsIndex from '../components/Cards/Index.vue'
</script>

<template>
  <div class='h-screen w-screen relative'>
    <MapView />
    <div class='absolute top-4 left-4 z-10'>
      <CardsIndex />
    </div>
  </div>
</template>
