import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import List from './List.vue'
import { useMapStore } from '../../stores/map'

describe('CardsMobile/List', () => {
  it('filters markers by search query', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setCategory('travel')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia],
      }
    })

    expect(wrapper.find('input[placeholder="Поиск..."]').exists()).toBe(true)

    store.setSearchQuery('Биг')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Биг-Бен')
    expect(wrapper.text()).not.toContain('Эйфелева башня')
    expect(wrapper.text()).not.toContain('Колизей')
  })

  it('shows project status chips and filters by them', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setCategory('projects')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia],
      }
    })

    expect(wrapper.find('input[placeholder="Поиск проектов..."]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Все (5)')
    expect(wrapper.text()).toContain('В процессе (3)')
    expect(wrapper.text()).toContain('Завершенные (2)')
    expect(wrapper.text()).toContain('Фильтр')

    const activeChip = wrapper.findAll('button').find((button) => button.text().includes('В процессе'))
    await activeChip?.trigger('click')

    expect(store.statusFilter).toBe('active')
    expect(wrapper.text()).toContain('AI Hackathon')
    expect(wrapper.text()).not.toContain('Startup Summit')
  })

  it('groups markers by year with group counts', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setCategory('projects')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia],
      }
    })

    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).toContain('(5)')
  })

  it('shows the filter button for non-project categories too', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setCategory('travel')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia],
      }
    })

    expect(wrapper.text()).toContain('Фильтр')

    const filterButton = wrapper.findAll('button').find((button) => button.text().includes('Фильтр'))
    await filterButton?.trigger('click')

    expect(wrapper.emitted('open-filter')).toBeTruthy()
  })

  it('emits close when the close button is clicked', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setCategory('projects')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia],
      }
    })

    await wrapper.find('button[aria-label="Закрыть список"]').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
