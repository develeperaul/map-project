import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import List from './List.vue'
import { useMapStore } from '../../stores/map'
import { projectListFixtures, travelFixture } from '../../test/markers'
import type { Marker } from '../../data/mock'

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
    store.projectMarkers = projectListFixtures
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
    expect(wrapper.text()).toContain('42 км')
  })

  it('shows a fake loading spinner before rendering the list', async () => {
    vi.useFakeTimers()

    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.projectMarkers = projectListFixtures
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

  it('uses category accent colors for non-completed markers', async () => {
    vi.useFakeTimers()

    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    const sportMarker: Marker = {
      id: 'sport-test',
      title: 'Спорт',
      description: '',
      category: 'sport',
      date: '2026-04-01',
      city: 'Москва',
      status: 100,
      images: [],
      sportTypes: ['Кросс-поход'],
      tags: [
        { id: 1, title: 'Техника' },
        { id: 2, title: '#Плавание' },
      ],
    }

    store.projectMarkers = [projectListFixtures[2]]
    store.travelMarkers = [travelFixture]
    store.sportMarkers = [sportMarker]
    store.setCategory('all')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia]
      }
    })

    await vi.runAllTimersAsync()

    expect(wrapper.find('.bg-primary').exists()).toBe(true)
    expect(wrapper.find('.bg-orange').exists()).toBe(true)
    expect(wrapper.find('.bg-purple').exists()).toBe(true)
    expect(wrapper.text()).toContain('12 км')
    expect(wrapper.text()).toContain('15 км')
    expect(wrapper.text()).toContain('Кросс-поход')
    expect(wrapper.text()).toContain('#Техника')
    expect(wrapper.text()).toContain('#Плавание')
    expect(wrapper.find('use[href="#sport-cross-hike"]').exists()).toBe(true)
  })

  it('shows status chips only for projects', async () => {
    vi.useFakeTimers()

    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()

    store.sportMarkers = [
      {
        id: 'sport-test',
        title: 'Спорт',
        description: '',
        category: 'sport',
        date: '2026-04-01',
        city: 'Москва',
        images: [],
      },
    ]
    store.setCategory('sport')

    const wrapper = mount(List, {
      global: {
        plugins: [pinia]
      }
    })

    await vi.runAllTimersAsync()

    expect(wrapper.text()).not.toContain('В процессе')
    expect(wrapper.text()).not.toContain('Завершенные')
  })

  it('shows and clears the applied date filter chip', async () => {
    vi.useFakeTimers()

    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.projectMarkers = projectListFixtures
    store.setCategory('projects')
    store.setDateRange({ start: '2024-06-01', end: '2024-08-31' })

    const wrapper = mount(List, {
      global: {
        plugins: [pinia]
      }
    })

    await vi.runAllTimersAsync()

    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('01.06.2024-31.08.2024')

    await wrapper.find('button[aria-label="Сбросить фильтр по дате"]').trigger('click')

    expect(store.dateRange).toEqual({ start: null, end: null })
    expect(wrapper.text()).not.toContain('01.06.2024-31.08.2024')
  })

  it('shows active filter count for date and location together', async () => {
    vi.useFakeTimers()

    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.projectMarkers = projectListFixtures
    store.setCategory('projects')
    store.setDateRange({ start: '2024-06-01', end: '2024-08-31' })
    store.setCityFilter(['Москва'])

    const wrapper = mount(List, {
      global: {
        plugins: [pinia]
      }
    })

    await vi.runAllTimersAsync()

    const filterButton = wrapper.findAll('button').find(button => button.text().includes('Фильтр'))
    expect(filterButton?.text()).toContain('2')
  })
})
