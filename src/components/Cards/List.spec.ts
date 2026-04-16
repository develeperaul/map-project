import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import List from './List.vue'
import { useMapStore } from '../../stores/map'

describe('Cards/List', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders desktop status chips and year grouping', async () => {
    vi.useFakeTimers()

    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.setCategory('projects')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Все')
    expect(wrapper.text()).toContain('В процессе')
    expect(wrapper.text()).toContain('Завершенные')

    await vi.runAllTimersAsync()

    expect(wrapper.find('[aria-label="Загрузка списка"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).toContain('Старт:')
  })

  it('shows a fake loading spinner before rendering the list', async () => {
    vi.useFakeTimers()

    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.setCategory('projects')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('[aria-label="Загрузка списка"]').exists()).toBe(true)

    await vi.runAllTimersAsync()

    expect(wrapper.find('[aria-label="Загрузка списка"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Все')
  })
})
