<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = ref<{ email?: string; password?: string }>({})

const isValid = computed(() => {
  return email.value.includes('@') && password.value.length >= 6
})

const handleSubmit = async () => {
  errors.value = {}
  
  if (!email.value.includes('@')) {
    errors.value.email = 'Введите корректный email'
  }
  if (password.value.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов'
  }
  
  if (Object.keys(errors.value).length > 0) return
  
  isLoading.value = true
  
  setTimeout(() => {
    isLoading.value = false
    router.push('/travels')
  }, 1000)
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__status-bar">
      <div class="auth-page__status-bar-inner">
        <div class="auth-page__time">9:41</div>
        <div class="auth-page__icons">
          <span class="auth-page__signal"></span>
          <span class="auth-page__wifi"></span>
          <span class="auth-page__battery"></span>
        </div>
      </div>
    </div>
    
    <div class="auth-page__content">
      <div class="auth-page__header">
        <h1 class="auth-page__title">Вход</h1>
        <p class="auth-page__subtitle">Войдите в свой аккаунт</p>
      </div>
      
      <form class="auth-page__form" @submit.prevent="handleSubmit">
        <BaseInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="example@mail.ru"
          :error="errors.email"
          required
        />
        
        <BaseInput
          v-model="password"
          type="password"
          label="Пароль"
          placeholder="Введите пароль"
          :error="errors.password"
          required
        />
        
        <BaseButton
          type="submit"
          size="lg"
          :loading="isLoading"
          :disabled="!isValid"
          class="auth-page__button"
        >
          Войти
        </BaseButton>
      </form>
      
      <div class="auth-page__footer">
        <a href="#" class="auth-page__link">Забыли пароль?</a>
      </div>
    </div>
    
    <div class="auth-page__tabs">
      <div class="auth-page__tab">
        <span class="auth-page__tab-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </span>
        <span>Карта</span>
      </div>
      <div class="auth-page__tab">
        <span class="auth-page__tab-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </span>
        <span>Профиль</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-white);
}

.auth-page__status-bar {
  height: 62px;
  background: var(--color-white);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 16px;
}

.auth-page__status-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 361px;
  padding: 0 16px;
}

.auth-page__time {
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-00);
}

.auth-page__icons {
  display: flex;
  gap: 6px;
}

.auth-page__signal,
.auth-page__wifi,
.auth-page__battery {
  width: 18px;
  height: 12px;
  background: var(--color-text-00);
  border-radius: 2px;
}

.auth-page__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 16px;
}

.auth-page__header {
  margin-bottom: 32px;
  text-align: center;
}

.auth-page__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-00);
  margin: 0 0 8px;
}

.auth-page__subtitle {
  font-size: var(--font-size-s);
  color: var(--color-text-01);
  margin: 0;
}

.auth-page__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth-page__button {
  width: 100%;
  margin-top: 12px;
}

.auth-page__footer {
  margin-top: 24px;
  text-align: center;
}

.auth-page__link {
  font-size: var(--font-size-s);
  color: var(--color-primary);
  text-decoration: none;
}

.auth-page__link:hover {
  text-decoration: underline;
}

.auth-page__tabs {
  display: flex;
  height: 82px;
  background: var(--color-white);
  border-top: 1px solid var(--color-border);
}

.auth-page__tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-02);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.auth-page__tab:first-child {
  color: var(--color-primary);
}

.auth-page__tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>