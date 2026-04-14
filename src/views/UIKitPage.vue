<script lang="ts" setup>
import { ref } from 'vue'
import Button from '../components/Button.vue'
import Tabs from '../components/Tabs.vue'
import TabItem from '../components/TabItem.vue'
import Input from '../components/Input.vue'
import Chip from '../components/Chip.vue'
import FilterPanel from '../components/FilterPanel.vue'

const activeTab = ref('projects')
const searchQuery = ref('')

const tabs = [
  { name: 'Все', value: 'all' },
  { name: 'Проекты', value: 'projects' },
  { name: 'Путешествия', value: 'travel' },
  { name: 'Спорт', value: 'sport' },
] as const

const buttonVariants = [
  { name: 'Primary', value: 'primary' },
  { name: 'Secondary', value: 'secondary' },
  { name: 'Base', value: 'base' },
  { name: 'Outline', value: 'outline' },
  { name: 'Ghost', value: 'ghost' },
  { name: 'White', value: 'white' },
] as const

const buttonSizes = [
  { name: 'XL (48px)', value: 'xl' },
  { name: 'LG (40px)', value: 'lg' },
  { name: 'MD (32px)', value: 'md' },
  { name: 'SM (24px)', value: 'sm' },
] as const
</script>

<template>
  <div class="min-h-screen bg-base-00 p-8">
    <h1 class="text-2xl font-bold text-text-00 mb-8">UI Kit</h1>
    
    <!-- Button Section -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-text-00 mb-4">Buttons</h2>
      
      <!-- Sizes -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Sizes</h3>
        <div class="flex flex-wrap gap-4 items-center">
          <Button v-for="size in buttonSizes" :key="size.value" :size="size.value" variant="primary">
            {{ size.name }}
          </Button>
        </div>
      </div>
      
      <!-- Variants -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Variants (Default state)</h3>
        <div class="flex flex-wrap gap-4 items-center bg-white p-4 rounded-card">
          <Button v-for="variant in buttonVariants" :key="variant.value" :variant="variant.value" size="lg">
            {{ variant.name }}
          </Button>
        </div>
      </div>
      
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Variants (Hover state)</h3>
        <div class="flex flex-wrap gap-4 items-center bg-base-01 p-4 rounded-card">
          <Button 
            v-for="variant in buttonVariants" 
            :key="variant.value + '-hover'" 
            :variant="variant.value" 
            size="lg"
            class="hover:bg-red-500"
          >
            {{ variant.name }} (hover)
          </Button>
        </div>
      </div>
      
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Variants (Disabled state)</h3>
        <div class="flex flex-wrap gap-4 items-center bg-white p-4 rounded-card">
          <Button v-for="variant in buttonVariants" :key="variant.value + '-disabled'" :variant="variant.value" size="lg" disabled>
            {{ variant.name }} (disabled)
          </Button>
        </div>
      </div>
      
      <!-- With Icons -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">With Icons</h3>
        <div class="flex flex-wrap gap-4 items-center bg-white p-4 rounded-card">
          <Button variant="primary" size="lg">
            <template #leftIcon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9-7-9-7-9 7 9 7z" />
              </svg>
            </template>
            Left Icon
          </Button>
          
          <Button variant="primary" size="lg">
            Right Icon
            <template #rightIcon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </template>
          </Button>
          
          <Button variant="base" size="lg">
            <template #leftIcon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </template>
            Check
          </Button>
        </div>
      </div>
      
      <!-- Loading -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Loading</h3>
        <div class="flex flex-wrap gap-4 items-center bg-white p-4 rounded-card">
          <Button variant="primary" size="lg" loading>
            Loading...
          </Button>
          <Button variant="secondary" size="lg" loading>
            Loading...
          </Button>
          <Button variant="base" size="lg" loading>
            Loading...
          </Button>
        </div>
      </div>
    </section>
    
    <!-- Tabs Section -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-text-00 mb-4">Tabs</h2>
      
      <!-- Underline + Icon Left -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Underline + Icon Left</h3>
        <div class="bg-white p-4 rounded-card">
          <Tabs v-model="activeTab" variant="underline" icon-position="left">
            <TabItem v-for="tab in tabs" :key="tab.value" :value="tab.value">
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
              {{ tab.name }}
            </TabItem>
          </Tabs>
        </div>
      </div>
      
      <!-- Underline + Icon Top -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Underline + Icon Top</h3>
        <div class="bg-white p-4 rounded-card">
          <Tabs v-model="activeTab" variant="underline" icon-position="top">
            <TabItem v-for="tab in tabs" :key="tab.value" :value="tab.value">
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
              {{ tab.name }}
            </TabItem>
          </Tabs>
        </div>
      </div>
      
      <!-- Pill + Icon Left -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Pill + Icon Left</h3>
        <div class="bg-white p-4 rounded-card">
          <Tabs v-model="activeTab" variant="pill" icon-position="left">
            <TabItem v-for="tab in tabs" :key="tab.value" :value="tab.value">
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
              {{ tab.name }}
            </TabItem>
          </Tabs>
        </div>
      </div>
      
      <!-- Pill + Icon Top -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Pill + Icon Top</h3>
        <div class="bg-white p-4 rounded-card">
          <Tabs v-model="activeTab" variant="pill" icon-position="top">
            <TabItem v-for="tab in tabs" :key="tab.value" :value="tab.value">
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
              {{ tab.name }}
            </TabItem>
          </Tabs>
        </div>
      </div>
      
      <!-- Icon Only -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Icon Only (no text)</h3>
        <div class="bg-white p-4 rounded-card">
          <Tabs v-model="activeTab" variant="underline" icon-position="only">
            <TabItem v-for="tab in tabs" :key="tab.value" :value="tab.value">
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
            </TabItem>
          </Tabs>
        </div>
      </div>
      
      <!-- Pill + Icon Only -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Pill + Icon Only</h3>
        <div class="bg-white p-4 rounded-card">
          <Tabs v-model="activeTab" variant="pill" icon-position="only">
            <TabItem v-for="tab in tabs" :key="tab.value" :value="tab.value">
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </template>
            </TabItem>
          </Tabs>
        </div>
      </div>
    </section>
    
    <!-- Input Section -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-text-00 mb-4">Input</h2>
      
      <!-- Sizes -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Sizes</h3>
        <div class="flex flex-wrap gap-4 items-center bg-white p-4 rounded-card">
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
        </div>
      </div>
      
      <!-- With Icons -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">With Search Icon</h3>
        <div class="flex flex-wrap gap-4 items-center bg-white p-4 rounded-card">
          <Input left-icon placeholder="Search..." />
          <Input left-icon placeholder="Search..." clearable />
        </div>
      </div>
      
      <!-- States -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">States</h3>
        <div class="flex flex-wrap gap-4 items-center bg-white p-4 rounded-card">
          <Input placeholder="Default" />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="Error" error error-message="Required field" />
        </div>
      </div>
      
      <!-- Search Field -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Search Field</h3>
        <div class="bg-white p-4 rounded-card">
          <Input 
            v-model="searchQuery" 
            left-icon 
            placeholder="Search projects..." 
            clearable 
            class="w-full max-w-md"
          />
        </div>
      </div>
    </section>
    
    <!-- Chip Section -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-text-00 mb-4">Chip</h2>
      
      <!-- Sizes -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Sizes</h3>
        <div class="flex flex-wrap gap-2 items-center bg-white p-4 rounded-card">
          <Chip label="Small" size="sm" />
          <Chip label="Medium" size="md" />
          <Chip label="Large" size="lg" />
        </div>
      </div>
      
      <!-- States -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">States</h3>
        <div class="flex flex-wrap gap-2 items-center bg-white p-4 rounded-card">
          <Chip label="Default" />
          <Chip label="Selected" variant="selected" />
          <Chip label="Disabled" disabled />
        </div>
      </div>
      
      <!-- Categories (from Figma) -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Categories (Filters)</h3>
        <div class="flex flex-wrap gap-2 items-center bg-white p-4 rounded-card">
          <Chip label="Проекты" variant="selected" />
          <Chip label="Путешествия" />
          <Chip label="Спорт" />
        </div>
      </div>
      
      <!-- Closeable -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-text-01 mb-4">Closeable</h3>
        <div class="flex flex-wrap gap-2 items-center bg-white p-4 rounded-card">
          <Chip label="Проекты" variant="selected" closeable />
          <Chip label="Путешествия" closeable />
          <Chip label="Спорт" closeable />
        </div>
      </div>
    </section>
    
    <!-- FilterPanel Section -->
    <section class='mb-12'>
      <h2 class='text-xl font-semibold text-text-00 mb-4'>FilterPanel</h2>
      
      <div class='mb-8'>
        <div class='bg-white p-4 rounded-card'>
          <FilterPanel />
        </div>
      </div>
    </section>
    
    <!-- Colors Reference -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-text-00 mb-4">Color Tokens</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Primary -->
        <div class="p-4 bg-white rounded-card">
          <div class="w-full h-8 bg-primary rounded-t-button mb-2"></div>
          <p class="text-body-s font-medium">Primary</p>
          <p class="text-body-xs-reg text-text-02">#4527A0</p>
        </div>
        <!-- Secondary -->
        <div class="p-4 bg-white rounded-card">
          <div class="w-full h-8 bg-secondary rounded-t-button mb-2"></div>
          <p class="text-body-s font-medium">Secondary</p>
          <p class="text-body-xs-reg text-text-02">#9C27B0</p>
        </div>
        <!-- Text 00 -->
        <div class="p-4 bg-white rounded-card">
          <div class="w-full h-8 bg-text-00 rounded-t-button mb-2"></div>
          <p class="text-body-s font-medium">Text 00</p>
          <p class="text-body-xs-reg text-text-02">#1A1A1A</p>
        </div>
        <!-- Text 01 -->
        <div class="p-4 bg-white rounded-card">
          <div class="w-full h-8 bg-text-01 rounded-t-button mb-2"></div>
          <p class="text-body-s font-medium">Text 01</p>
          <p class="text-body-xs-reg text-text-02">#6B6375</p>
        </div>
      </div>
    </section>
  </div>
</template>