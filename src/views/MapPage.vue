<script setup lang='ts'>
import MapView from '../components/MapView.vue'
import CardsIndex from '../components/Cards/Index.vue'
import CardsMobileIndex from '../components/CardsMobile/Index.vue'
</script>

<template>
  <div class='h-screen w-screen relative'>
    <MapView />
    
    <!-- Desktop -->
    <div class='absolute top-4 left-4 z-10 hidden md:block'>
      <CardsIndex />
    </div>
    
    <!-- Mobile -->
    <div class='md:hidden'>
      <CardsMobileIndex />
    </div>
  </div>
</template>