import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import Index from './Index.vue'
import { useMapStore } from '../../stores/map'
import { mockMarkers } from '../../data/mock'

const stubs = {
  Main: { template: '<div data-stub="main" />' },
  List: { template: '<div data-stub="list" />' },
  TaskList: { template: '<div data-stub="task-list" />' },
  Filter: { template: '<div data-stub="filter" />' },
  Description: { template: '<div data-stub="description" />' },
}

describe('Cards/Index', () => {
  it('opens task list and description for project task markers', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setCategory('projects')
    store.selectMarker(mockMarkers[0].tasks![3])

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs,
      }
    })

    expect(wrapper.find('[data-stub="task-list"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="description"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(false)
  })

  it('opens list and description for travel markers', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setCategory('travel')
    store.selectMarker(mockMarkers[5])

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs,
      }
    })

    expect(wrapper.find('[data-stub="list"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="description"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="task-list"]').exists()).toBe(false)
  })

  it('opens cards when no category is selected', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.selectMarker(mockMarkers[5])

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs,
      }
    })

    expect(wrapper.find('[data-stub="main"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="description"]').exists()).toBe(true)
  })
})
