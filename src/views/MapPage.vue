<script setup lang='ts'>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MapView from '../components/MapView.vue'
import CardsIndex from '../components/Cards/Index.vue'
import CardsMobileIndex from '../components/CardsMobile/Index.vue'
import { useMapStore } from '../stores/map'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const mapStore = useMapStore()
const authStore = useAuthStore()

const logOut = () => {
  authStore.logout()
  router.push('/auth')
}
onMounted(() => {
  void mapStore.loadAllCategoryMarkers()
})
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
    <div class=" absolute left-4 right-4 top-2 flex justify-between items-start lg:w-fit lg:left-auto lg:top-4  ">

      <a href="/bitrix" class=" mt-[3px] ">
        <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_dd_785_31044)">
          <rect x="3" width="40" height="40" rx="8" fill="white" shape-rendering="crispEdges"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0004 12C22.4044 12 21.8247 12.067 21.2662 12.191V20.0055C21.2662 20.9631 22.047 21.7441 23.0049 21.7441C23.9624 21.7441 24.7429 20.9631 24.7429 20.006C24.7429 19.0861 24.0241 18.3311 23.1205 18.271V16.8794C24.7902 16.94 26.1338 18.3212 26.1338 20.006C26.1338 21.729 24.7282 23.1353 23.0049 23.1353C21.2809 23.1353 19.8755 21.729 19.8755 20.0055V12.6332C19.678 12.7171 19.485 12.8101 19.2959 12.91V20.0055C19.2961 22.0479 20.9625 23.7134 23.0049 23.7134C25.0476 23.7134 26.7132 22.0479 26.7132 20.006C26.7132 18.0021 25.1103 16.3611 23.1205 16.2993V14.9082C25.876 14.9704 28.1035 17.2365 28.1035 20.006C28.1035 22.8147 25.813 25.1046 23.0049 25.1046C20.1961 25.1046 17.9049 22.8147 17.9049 20.0055V13.8328C16.1314 15.2994 15.0005 17.5172 15.0005 19.9995C15.0005 24.4175 18.5822 28 23.0006 28C27.4198 28 31.0005 24.4175 31.0005 19.9995C31.0005 15.5815 27.4198 12 23.0004 12Z" fill="#D91935"/>
          </g>
          <defs>
          <filter id="filter0_dd_785_31044" x="0" y="0" width="46" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect1_dropShadow_785_31044"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.0470588 0 0 0 0 0.0470588 0 0 0 0 0.0509804 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_785_31044"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect2_dropShadow_785_31044"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.0470588 0 0 0 0 0.0470588 0 0 0 0 0.0509804 0 0 0 0.1 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_785_31044" result="effect2_dropShadow_785_31044"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_785_31044" result="shape"/>
          </filter>
          </defs>
          </svg>


  
      </a>
      <div @click="logOut" class=" ">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_dd_237_7701)">
          <rect x="4" y="3" width="40" height="40" rx="8" fill="white" shape-rendering="crispEdges"/>
          <path d="M23 28.5C23 28.6326 22.9473 28.7598 22.8536 28.8536C22.7598 28.9473 22.6326 29 22.5 29H19C18.7348 29 18.4804 28.8946 18.2929 28.7071C18.1054 28.5196 18 28.2652 18 28V18C18 17.7348 18.1054 17.4804 18.2929 17.2929C18.4804 17.1054 18.7348 17 19 17H22.5C22.6326 17 22.7598 17.0527 22.8536 17.1464C22.9473 17.2402 23 17.3674 23 17.5C23 17.6326 22.9473 17.7598 22.8536 17.8536C22.7598 17.9473 22.6326 18 22.5 18H19V28H22.5C22.6326 28 22.7598 28.0527 22.8536 28.1464C22.9473 28.2402 23 28.3674 23 28.5ZM29.8538 22.6462L27.3538 20.1462C27.2838 20.0762 27.1947 20.0286 27.0977 20.0092C27.0006 19.9899 26.9 19.9998 26.8086 20.0377C26.7172 20.0756 26.6391 20.1397 26.5841 20.222C26.5292 20.3043 26.4999 20.4011 26.5 20.5V22.5H22.5C22.3674 22.5 22.2402 22.5527 22.1464 22.6464C22.0527 22.7402 22 22.8674 22 23C22 23.1326 22.0527 23.2598 22.1464 23.3536C22.2402 23.4473 22.3674 23.5 22.5 23.5H26.5V25.5C26.4999 25.5989 26.5292 25.6957 26.5841 25.778C26.6391 25.8603 26.7172 25.9244 26.8086 25.9623C26.9 26.0002 27.0006 26.0101 27.0977 25.9908C27.1947 25.9714 27.2838 25.9238 27.3538 25.8538L29.8538 23.3538C29.9002 23.3073 29.9371 23.2522 29.9623 23.1915C29.9874 23.1308 30.0004 23.0657 30.0004 23C30.0004 22.9343 29.9874 22.8692 29.9623 22.8085C29.9371 22.7478 29.9002 22.6927 29.8538 22.6462Z" fill="#F44336"/>
          </g>
          <defs>
          <filter id="filter0_dd_237_7701" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.0470588 0 0 0 0 0.0470588 0 0 0 0 0.0509804 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_237_7701"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.0470588 0 0 0 0 0.0470588 0 0 0 0 0.0509804 0 0 0 0.1 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_237_7701" result="effect2_dropShadow_237_7701"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_237_7701" result="shape"/>
          </filter>
          </defs>
          </svg>

  
      </div>
    </div>
  </div>
</template>
