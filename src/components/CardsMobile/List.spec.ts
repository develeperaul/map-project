import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import List from './List.vue'
import type { Marker } from '../../data/mock'
import { projectListFixtures } from '../../test/markers'

type MockStore = ReturnType<typeof createMockStore>

let mockStore: MockStore

vi.mock('../../stores/map', () => ({
  useMapStore: () => mockStore,
}))

const travelMarkers: Marker[] = [
  {
    id: 'travel-1',
    title: 'Эйфелева башня',
    description: 'Символ Парижа',
    coordinates: [2.2945, 48.8584],
    category: 'travel',
    date: '2024-07-01',
    city: 'Париж',
    distance: '12 км',
    status: 100,
    images: [],
  },
  {
    id: 'travel-2',
    title: 'Колизей',
    description: 'Древний амфитеатр в Риме',
    coordinates: [12.4964, 41.8902],
    category: 'travel',
    date: '2024-07-15',
    city: 'Рим',
    status: 100,
    images: [],
  },
  {
    id: 'travel-3',
    title: 'Биг-Бен',
    description: 'Знаменитая башня в Лондоне',
    coordinates: [-0.1246, 51.5007],
    category: 'travel',
    date: '2024-08-20',
    city: 'Лондон',
    distance: '5 км',
    status: 100,
    images: [],
  },
]

const sportMarkers: Marker[] = [
  {
    id: 'sport-1',
    title: 'Белые ночи — беговой фестиваль 2025',
    description: 'Городской старт',
    coordinates: [30.3351, 59.9343],
    category: 'sport',
    date: '2025-06-01',
    city: 'Санкт-Петербург',
    sportTypes: ['Велоспорт'],
    tags: [
      { id: 1, title: 'Велоспорт' },
      { id: 2, title: 'Гравел' },
    ],
    images: [],
  },
]

function createMockStore() {
  let store: any

  store = reactive({
    category: 'all' as Marker['category'] | 'all',
    searchQuery: '',
    statusFilter: 'all' as 'all' | 'active' | 100,
    dateRangeLabel: '',
    activeFilterCount: 0,
    cityFilter: [] as string[],
    sportTypeFilter: [] as string[],
    tagFilter: [] as string[],
    projectMarkers: [] as Marker[],
    travelMarkers: [] as Marker[],
    sportMarkers: [] as Marker[],
    selectedMarker: null as Marker | null,
    get filteredMarkers() {
      const query = store.searchQuery.trim().toLowerCase()
      const markers: Marker[] = store.category === 'projects'
        ? store.projectMarkers
        : store.category === 'travel'
          ? store.travelMarkers
          : store.category === 'sport'
            ? store.sportMarkers
            : [...store.projectMarkers, ...store.travelMarkers, ...store.sportMarkers]

      if (!query) return markers

      return markers.filter(marker => (
        marker.title.toLowerCase().includes(query) ||
        marker.description.toLowerCase().includes(query) ||
        marker.city.toLowerCase().includes(query)
      ))
    },
    get filteredMarkersWithoutSearch() {
      const markers: Marker[] = store.category === 'projects'
        ? store.projectMarkers
        : store.category === 'travel'
          ? store.travelMarkers
          : store.category === 'sport'
            ? store.sportMarkers
            : [...store.projectMarkers, ...store.travelMarkers, ...store.sportMarkers]

      let result = markers

      if (store.dateRangeLabel) {
        result = result.filter(marker => marker.date >= '2024-01-01')
      }

      if (store.cityFilter.length > 0) {
        result = result.filter(marker => store.cityFilter.includes(marker.city))
      }

      if (store.category === 'sport' && store.sportTypeFilter.length > 0) {
        result = result.filter(marker => {
          const markerSportTypes = marker.sportTypes || []
          return store.sportTypeFilter.some((type: string) => markerSportTypes.includes(type))
        })
      }

      if (store.category === 'sport' && store.tagFilter.length > 0) {
        result = result.filter(marker => {
          if (!marker.tags) return false
          return marker.tags.some(tag => store.tagFilter.includes(tag.title))
        })
      }

      return result
    },
    setCategory(category: Marker['category'] | 'all') {
      store.category = category
    },
    setSearchQuery(query: string) {
      store.searchQuery = query
    },
    setStatusFilter(value: 'all' | 'active' | 100) {
      store.statusFilter = value
    },
    setCityFilter(value: string[]) {
      store.cityFilter = value
    },
    setSportTypeFilter(value: string[]) {
      store.sportTypeFilter = value
    },
    setTagFilter(value: string[]) {
      store.tagFilter = value
    },
    clearDateRange() {
      store.dateRangeLabel = ''
    },
    resetFilters() {
      store.dateRangeLabel = ''
      store.activeFilterCount = 0
      store.cityFilter = []
      store.sportTypeFilter = []
      store.tagFilter = []
    },
  })

  return store
}

describe('CardsMobile/List', () => {
  it('renders the search field as a button and does not filter by query', async () => {
    mockStore = createMockStore()
    mockStore.setCategory('travel')
    mockStore.travelMarkers = travelMarkers

    const wrapper = mount(List, {
      global: {},
    })

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Открыть поиск"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Поиск...')

    mockStore.setSearchQuery('Биг')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Биг')
    expect(wrapper.text()).toContain('Биг-Бен')
    expect(wrapper.text()).toContain('Эйфелева башня')
    expect(wrapper.text()).toContain('Колизей')
    expect(wrapper.text()).toContain('Лондон')
    expect(wrapper.text()).toContain('5 км')

    await wrapper.find('button[aria-label="Открыть поиск"]').trigger('click')
    expect(wrapper.emitted('open-search')).toHaveLength(1)
  })

  it('shows project status chips and filters by them', async () => {
    mockStore = createMockStore()
    mockStore.projectMarkers = projectListFixtures
    mockStore.setCategory('projects')

    const wrapper = mount(List, {
      global: {},
    })

    expect(wrapper.find('button[aria-label="Открыть поиск"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Все (5)')
    expect(wrapper.text()).toContain('В процессе (3)')
    expect(wrapper.text()).toContain('Завершенные (2)')
    expect(wrapper.text()).toContain('Старт: 2024 • Финиш: В процессе')
    expect(wrapper.text()).not.toContain('Описание проекта')
    expect(wrapper.text()).toContain('42 км')
    expect(wrapper.text()).toContain('Фильтр')

    const activeChip = wrapper.findAll('button').find((button) => button.text().includes('В процессе'))
    await activeChip?.trigger('click')

    expect(mockStore.statusFilter).toBe('active')
    expect(wrapper.text()).toContain('AI Hackathon')
    expect(wrapper.text()).not.toContain('Startup Summit')
  })

  it('groups markers by year with group counts', () => {
    mockStore = createMockStore()
    mockStore.projectMarkers = projectListFixtures
    mockStore.setCategory('projects')

    const wrapper = mount(List, {
      global: {},
    })

    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).toContain('(5)')
  })

  it('renders sport tags in the compact mobile list', async () => {
    mockStore = createMockStore()
    mockStore.sportMarkers = sportMarkers
    mockStore.setCategory('sport')

    const wrapper = mount(List, {
      global: {},
    })

    expect(wrapper.text()).toContain('Белые ночи — беговой фестиваль 2025')
    expect(wrapper.text()).toContain('Санкт-Петербург')
    expect(wrapper.text()).toContain('2025')
    expect(wrapper.text()).toContain('Велоспорт')
    expect(wrapper.text()).toContain('#Велоспорт')
    expect(wrapper.text()).toContain('#Гравел')
  })

  it('shows the filter button for non-project categories too', async () => {
    mockStore = createMockStore()
    mockStore.setCategory('travel')
    mockStore.travelMarkers = travelMarkers

    const wrapper = mount(List, {
      global: {},
    })

    expect(wrapper.text()).toContain('Фильтр')

    const filterButton = wrapper.findAll('button').find((button) => button.text().includes('Фильтр'))
    await filterButton?.trigger('click')

    expect(wrapper.emitted('open-filter')).toBeTruthy()
  })

  it('emits close when the close button is clicked', async () => {
    mockStore = createMockStore()
    mockStore.projectMarkers = projectListFixtures
    mockStore.setCategory('projects')

    const wrapper = mount(List, {
      global: {},
    })

    await wrapper.find('button[aria-label="Закрыть список"]').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('renders only results and empty state in minimal controls mode', async () => {
    mockStore = createMockStore()
    mockStore.travelMarkers = travelMarkers
    mockStore.setCategory('all')
    mockStore.dateRangeLabel = 'Июль 2024'
    mockStore.activeFilterCount = 1

    const wrapper = mount(List, {
      props: {
        minimalControls: true,
      },
      global: {},
    })

    expect(wrapper.find('input[type="search"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Фильтр')
    expect(wrapper.find('button[aria-label="Закрыть список"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Эйфелева башня')
    expect(wrapper.text()).toContain('Колизей')

    mockStore.searchQuery = 'нет совпадений'
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Ничего не найдено')
    expect(wrapper.text()).not.toContain('фильтр')
  })
})
