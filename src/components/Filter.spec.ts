import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import Filter from './Filter.vue'
import { useMapStore } from '../stores/map'

type FilterVm = {
  dateRange: {
    start: Date | null
    end: Date | null
  }
  selectedLocations: string[]
}

const findButtonByText = (wrapper: ReturnType<typeof mount>, text: string) => (
  wrapper.findAll('button').find(button => button.text().includes(text))
)

describe('Filter', () => {
  it('applies date range to the map store only after apply click', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    const wrapper = mount(Filter, {
      global: {
        plugins: [pinia],
      },
    })

    const vm = wrapper.vm as unknown as FilterVm
    vm.dateRange = {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 11, 31),
    }

    expect(store.dateRange).toEqual({ start: null, end: null })

    await findButtonByText(wrapper, 'Применить')?.trigger('click')

    expect(store.dateRange).toEqual({ start: '2024-01-01', end: '2024-12-31' })
    expect(store.showFilterPanel).toBe(false)
  })

  it('renders locations from loaded markers and applies selected location', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.projectMarkers = [
      {
        id: 'project-msk',
        title: 'Москва',
        description: '',
        category: 'projects',
        date: '2024-01-01',
        city: 'Москва',
        status: 100,
        images: [],
      },
      {
        id: 'project-kazan',
        title: 'Казань',
        description: '',
        category: 'projects',
        date: '2024-01-01',
        city: 'Казань',
        status: 100,
        images: [],
      },
    ]
    store.setCategory('projects')

    const wrapper = mount(Filter, {
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.text()).toContain('Москва')
    expect(wrapper.text()).toContain('Казань')

    const vm = wrapper.vm as unknown as FilterVm
    vm.selectedLocations = ['Казань']
    vm.dateRange = {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 11, 31),
    }
    await findButtonByText(wrapper, 'Применить')?.trigger('click')

    expect(store.cityFilter).toEqual(['Казань'])
    expect(store.dateRange).toEqual({ start: '2024-01-01', end: '2024-12-31' })
    expect(store.activeFilterCount).toBe(2)
    expect(store.filteredMarkers.map(marker => marker.id)).toEqual(['project-kazan'])
  })

  it('counts date and location when location is selected through checkbox', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.projectMarkers = [
      {
        id: 'project-msk',
        title: 'Москва',
        description: '',
        category: 'projects',
        date: '2024-06-15',
        city: 'Москва',
        status: 100,
        images: [],
      },
    ]
    store.setCategory('projects')

    const wrapper = mount(Filter, {
      global: {
        plugins: [pinia],
      },
    })

    const vm = wrapper.vm as unknown as FilterVm
    vm.dateRange = {
      start: new Date(2024, 5, 1),
      end: new Date(2024, 7, 31),
    }

    const locationCheckbox = wrapper
      .findAllComponents({ name: 'Checkbox' })
      .find(checkbox => checkbox.props('label') === 'Москва')

    await locationCheckbox?.vm.$emit('update:modelValue', true)
    await findButtonByText(wrapper, 'Применить')?.trigger('click')

    expect(store.cityFilter).toEqual(['Москва'])
    expect(store.dateRange).toEqual({ start: '2024-06-01', end: '2024-08-31' })
    expect(store.activeFilterCount).toBe(2)
  })

  it('renders sport tags from loaded sport markers and applies selected tags', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.sportMarkers = [
      {
        id: 'sport-1',
        title: 'Бег',
        description: '',
        category: 'sport',
        date: '2024-06-15',
        city: 'Москва',
        sportTypes: ['Бег'],
        tags: [
          { id: 1, title: '  Бег ' },
          { id: 2, title: 'Техника' },
        ],
        images: [],
      },
      {
        id: 'sport-2',
        title: 'Плавание',
        description: '',
        category: 'sport',
        date: '2024-06-20',
        city: 'Казань',
        sportTypes: ['Плавание'],
        tags: [
          { id: 3, title: 'бег' },
          { id: 4, title: '  Сборы  ' },
          { id: 5, title: 'Техника' },
        ],
        images: [],
      },
    ]
    store.setCategory('sport')

    const wrapper = mount(Filter, {
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.text()).toContain('Бег')
    expect(wrapper.text()).toContain('Техника')
    expect(wrapper.text()).toContain('Сборы')
    expect(wrapper.findAll('button').filter(button => button.text().includes('Бег'))).toHaveLength(1)

    await wrapper.get('input[placeholder="Поиск по тегу..."]').setValue('  тех  ')
    expect(wrapper.text()).toContain('Техника')
    expect(wrapper.text()).not.toContain('Сборы')

    await wrapper.findAll('button').find(button => button.text().includes('Техника'))?.trigger('click')
    await findButtonByText(wrapper, 'Применить')?.trigger('click')

    expect(store.tagFilter).toEqual(['техника'])
    expect(store.activeFilterCount).toBe(1)
  })

  it('shows the empty state when a search query has no results and normalizes search text', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.projectMarkers = [
      {
        id: 'project-msk',
        title: 'Москва',
        description: '',
        category: 'projects',
        date: '2024-01-01',
        city: 'Москва',
        status: 100,
        images: [],
      },
      {
        id: 'project-kazan',
        title: 'Казань',
        description: '',
        category: 'projects',
        date: '2024-01-01',
        city: 'Казань',
        status: 100,
        images: [],
      },
    ]
    store.setCategory('projects')

    const wrapper = mount(Filter, {
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.get('input[placeholder="Поиск по локации..."]').setValue('   тюм   ')

    expect(wrapper.text()).toContain('Ничего не найдено')
    expect(wrapper.text()).toContain('Измените параметры поиска')
    expect(wrapper.findAllComponents({ name: 'Checkbox' }).length).toBe(0)

    await wrapper.get('input[placeholder="Поиск по локации..."]').setValue('   моск   ')

    expect(wrapper.text()).not.toContain('Ничего не найдено')
    expect(wrapper.text()).toContain('Москва')
  })

  it('resets local date and store filters', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.setDateRange({ start: '2024-01-01', end: '2024-12-31' })

    const wrapper = mount(Filter, {
      global: {
        plugins: [pinia],
      },
    })

    await findButtonByText(wrapper, 'Сбросить')?.trigger('click')

    const vm = wrapper.vm as unknown as FilterVm
    expect(vm.dateRange).toEqual({ start: null, end: null })
    expect(store.dateRange).toEqual({ start: null, end: null })
    expect(store.activeFilterCount).toBe(0)
  })

  it('closes without applying unsaved date changes', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()
    store.showFilterPanel = true

    const wrapper = mount(Filter, {
      global: {
        plugins: [pinia],
      },
    })

    const vm = wrapper.vm as unknown as FilterVm
    vm.dateRange = {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 11, 31),
    }

    await wrapper.find('button[aria-label="Закрыть фильтр"]').trigger('click')

    expect(store.showFilterPanel).toBe(false)
    expect(store.dateRange).toEqual({ start: null, end: null })
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
