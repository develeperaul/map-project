import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import Index from './Index.vue'
import { useMapStore } from '../../stores/map'
import { projectFixture, travelFixture } from '../../test/markers'

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
    store.projectMarkers = [projectFixture]
    store.setCategory('projects')
    store.selectMarker(projectFixture.tasks![3])

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
    store.selectMarker(travelFixture)

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
    store.selectMarker(travelFixture)

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

  it('opens list when searching without a selected category', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setSearchQuery('казань')

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs,
      }
    })

    expect(wrapper.find('[data-stub="main"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="description"]').exists()).toBe(false)
  })

  it('shows the list when a tab category is selected', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.setCategory('travel')

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs,
      }
    })

    expect(wrapper.find('[data-stub="main"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="description"]').exists()).toBe(false)
  })

  it('opens a calendar-only filter from the main search panel', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: {
          ...stubs,
          Main: {
            template: '<button data-stub="main" @click="$emit(\'open-calendar-filter\')" />',
          },
          Filter: {
            props: ['mode'],
            template: '<div data-stub="filter" :data-mode="mode" />',
          },
        },
      }
    })

    await wrapper.find('[data-stub="main"]').trigger('click')

    expect(wrapper.find('[data-stub="filter"]').attributes('data-mode')).toBe('calendar')
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(true)
  })
})
