import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Search from './Search.vue'
import type { Marker } from '../../data/mock'

type MockStore = ReturnType<typeof createMockStore>

let mockStore: MockStore

vi.mock('../../stores/map', () => ({
  useMapStore: () => mockStore,
}))

const overlayMarkers: Marker[] = [
  {
    id: 'project-1',
    title: '5 Полюсов',
    description: 'Проект',
    coordinates: [37, 55],
    category: 'projects',
    date: '2025-01-01',
    city: 'Москва',
    status: 52,
    distance: '250 км',
    images: [],
  },
  {
    id: 'travel-1',
    title: 'Южная африка',
    description: 'Вёл учёт этапов подготовки, команд-участников, сроков и задействованных ресурсов...',
    coordinates: [18.4241, -33.9249],
    category: 'travel',
    date: '2025-03-01',
    city: 'г. Кейптаун, Африка',
    distance: '250 км',
    status: 100,
    images: [
      { url: 'https://example.com/1.jpg', description: 'Фото 1', city: 'Кейптаун' },
      { url: 'https://example.com/2.jpg', description: 'Фото 2', city: 'Кейптаун' },
    ],
  },
  {
    id: 'sport-1',
    title: 'Сибирский полумарафон 2024',
    description: 'Тест',
    coordinates: [73, 54],
    category: 'sport',
    date: '2024-06-01',
    city: 'Омск',
    distance: '250 км',
    status: 100,
    sportTypes: ['Бег'],
    tags: [
      { id: 1, title: 'Движение' },
      { id: 2, title: 'Спорт' },
    ],
    images: [],
  },
]

function createMockStore() {
  const store = reactive({
    dateRangeLabel: '',
    dateRange: { start: null as string | null, end: null as string | null },
    searchQuery: '',
    filteredMarkers: overlayMarkers,
    setSearchQuery(query: string) {
      store.searchQuery = query
    },
    setDateRange(range: { start: string | null; end: string | null }) {
      store.dateRange = range
      store.dateRangeLabel = range.start && range.end ? `${range.start}-${range.end}` : ''
    },
    clearDateRange() {
      store.dateRange = { start: null, end: null }
      store.dateRangeLabel = ''
    },
  })

  return store
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('CardsMobile/Search', () => {
  it('emits calendar filter events from the inline year control', async () => {
    mockStore = createMockStore()

    const wrapper = mount(Search, {
      props: {
        query: '',
        mode: 'inline',
      },
      global: {},
    })

    await wrapper.find('button[aria-label="Открыть фильтр по годам"]').trigger('click')

    expect(wrapper.emitted('open-calendar-filter')).toHaveLength(1)
  })

  it('emits clear date filter from the inline date chip', async () => {
    mockStore = createMockStore()
    mockStore.setDateRange({ start: '2024-01-01', end: '2025-01-01' })

    const wrapper = mount(Search, {
      props: {
        query: '',
        mode: 'inline',
      },
      global: {},
    })

    await wrapper.find('button[aria-label="Сбросить фильтр по дате"]').trigger('click')

    expect(wrapper.emitted('clear-date-filter')).toHaveLength(1)
    expect(mockStore.dateRange).toEqual({ start: '2024-01-01', end: '2025-01-01' })
  })

  it('renders grouped search results with the mobile row layout', async () => {
    mockStore = createMockStore()

    const wrapper = mount(Search, {
      props: {
        query: 'по',
        mode: 'overlay',
      },
      global: {},
    })

    expect(wrapper.text()).toContain('Проекты')
    expect(wrapper.text()).toContain('Путешествия')
    expect(wrapper.text()).toContain('Спорт')
    expect(wrapper.text()).toContain('5 Полюсов')
    expect(wrapper.text()).toContain('Старт: 2025')
    expect(wrapper.text()).toContain('Финиш: В процессе')
    expect(wrapper.text()).toContain('Южная африка')
    expect(wrapper.text()).toContain('г. Кейптаун, Африка')
    expect(wrapper.text()).toContain('Сибирский полумарафон 2024')
    expect(wrapper.text()).toContain('#Движение')
    expect(wrapper.text()).toContain('#Спорт')

    const resultButton = wrapper.findAll('button').find(button => button.text().includes('5 Полюсов'))
    await resultButton?.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })
})
