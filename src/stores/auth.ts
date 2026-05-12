import { defineStore } from 'pinia'
import { ref } from 'vue'

const AUTH_STORAGE_KEY = 'map-project.authenticated'
const AUTH_LOGIN = 'Guests'
const AUTH_PASSWORD = '296270'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readAuthState() {
  if (!canUseStorage()) return false
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

function persistAuthState(value: boolean) {
  if (!canUseStorage()) return

  if (value) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function resolveAuthRedirect(value: unknown) {
  if (typeof value !== 'string') return null
  if (!value.startsWith('/') || value.startsWith('//') || value === '/auth') return null
  return value
}

export function validateAuthCredentials(login: string, password: string) {
  return login.trim() === AUTH_LOGIN && password === AUTH_PASSWORD
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(readAuthState())

  const setAuthenticated = (value: boolean) => {
    isAuthenticated.value = value
    persistAuthState(value)
  }

  const login = (loginValue: string, passwordValue: string) => {
    if (!validateAuthCredentials(loginValue, passwordValue)) return false

    setAuthenticated(true)
    return true
  }
  const logout = () => setAuthenticated(false)

  return {
    isAuthenticated,
    login,
    logout,
    setAuthenticated,
    validateAuthCredentials,
  }
})
