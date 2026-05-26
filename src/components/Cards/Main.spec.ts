import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import Main from './Main.vue'
import { useMapStore } from '../../stores/map'

describe('Cards/Main', () => {
  it('shows the year filter trigger only when no tab is selected', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    const wrapper = mount(Main, {
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.text()).toContain('Все года')

    store.setCategory('projects')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('Все года')
  })

  it('opens the calendar filter from the search bar', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Main, {
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.find('button[aria-label="Открыть фильтр по годам"]').trigger('click')

    expect(wrapper.emitted('open-calendar-filter')).toHaveLength(1)
  })

  it('shows and clears the applied date range in the search bar', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setDateRange({ start: '2024-01-01', end: '2025-01-01' })

    const wrapper = mount(Main, {
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.text()).toContain('01.01.2024-01.01.2025')

    await wrapper.find('button[aria-label="Сбросить фильтр по дате"]').trigger('click')

    expect(store.dateRange).toEqual({ start: null, end: null })
    expect(wrapper.text()).toContain('Все года')
  })
})
