<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Button from '../components/Button.vue'
import { resolveAuthRedirect, useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const login = ref('')
const password = ref('')
const errorMessage = ref('')

const handleSubmit = () => {
  if (!login.value.trim() || !password.value.trim()) return

  errorMessage.value = ''

  const isValid = authStore.login(login.value, password.value)

  if (!isValid) {
    errorMessage.value = 'Неверный логин или пароль'
    return
  }

  void router.replace(resolveAuthRedirect(route.query.redirect) ?? {
    name: 'map',
    query: { category: 'projects' },
  })
}
</script>

<template>
  <div class="auth-page relative min-h-[100dvh] overflow-hidden bg-white text-[#1a1a1a] md:bg-[#f3f4f6]">
    <section class="hidden min-h-[100dvh] items-center justify-center px-4 md:flex">
      <div class="w-full max-w-[508px] rounded-[16px] bg-white p-6">
        <h1 class="text-[20px] font-medium leading-6 text-[#1a1a1a]">
          Вход
        </h1>

        <form class="mt-4 space-y-2" @submit.prevent="handleSubmit">
          <input
            v-model.trim="login"
            type="text"
            autocomplete="username"
            aria-label="Логин"
            placeholder="Логин"
            class="h-12 w-full rounded-button border border-transparent bg-[#f3f4f6] px-4 text-sm font-medium leading-5 text-[#1a1a1a] outline-none transition-shadow transition-colors placeholder:text-[#6b6375] focus:border-transparent focus:ring-2 focus:ring-[#3f51b5]/15"
          >

          <input
            v-model.trim="password"
            type="password"
            autocomplete="current-password"
            aria-label="Пароль"
            placeholder="Пароль"
            class="h-12 w-full rounded-button border border-transparent bg-[#f3f4f6] px-4 text-sm font-medium leading-5 text-[#1a1a1a] outline-none transition-shadow transition-colors placeholder:text-[#6b6375] focus:border-transparent focus:ring-2 focus:ring-[#3f51b5]/15"
          >

          <p v-if="errorMessage" class="text-sm font-medium text-[#f44336]">
            {{ errorMessage }}
          </p>

          <Button
            type="submit"
            variant="primary"
            size="xl"
            class="mt-4 w-full"
          >
            Войти
          </Button>
        </form>
      </div>
    </section>

    <section class="relative min-h-[100dvh] overflow-hidden bg-white md:hidden">
      

      <main class="flex min-h-[100dvh] flex-col px-4 pt-[clamp(160px,29vh,248px)] pb-[98px]">
        <h1 class="text-[20px] font-medium leading-6 text-[#1a1a1a]">
          Вход
        </h1>

        <form class="mt-4 space-y-2" @submit.prevent="handleSubmit">
          <input
            v-model.trim="login"
            type="text"
            autocomplete="username"
            aria-label="Логин"
            placeholder="Логин"
            class="h-12 w-full rounded-button border border-transparent bg-[#f3f4f6] px-4 text-sm font-medium leading-5 text-[#1a1a1a] outline-none transition-shadow transition-colors placeholder:text-[#6b6375] focus:border-transparent focus:ring-2 focus:ring-[#3f51b5]/15"
          >

          <input
            v-model.trim="password"
            type="password"
            autocomplete="current-password"
            aria-label="Пароль"
            placeholder="Пароль"
            class="h-12 w-full rounded-button border border-transparent bg-[#f3f4f6] px-4 text-sm font-medium leading-5 text-[#1a1a1a] outline-none transition-shadow transition-colors placeholder:text-[#6b6375] focus:border-transparent focus:ring-2 focus:ring-[#3f51b5]/15"
          >

          <p v-if="errorMessage" class="text-sm font-medium text-[#f44336]">
            {{ errorMessage }}
          </p>

          <Button
            type="submit"
            variant="primary"
            size="xl"
            class="mt-4 w-full"
          >
            Войти
          </Button>
        </form>
      </main>

      
    </section>
  </div>
</template>

<style scoped>
.auth-page {
  --color-primary: #3f51b5;
  --color-primary-hover: #3548a3;
  --color-primary-80: rgba(63, 81, 181, 0.8);
  --color-primary-20: rgba(63, 81, 181, 0.2);
  --color-base-00: #f3f4f6;
  --color-border: #f3f4f6;
}
</style>
