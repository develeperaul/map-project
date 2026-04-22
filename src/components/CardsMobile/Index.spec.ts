import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it } from 'vitest'
import Index from './Index.vue'
import { mockMarkers, type Marker } from '../../data/mock'
import { useMapStore } from '../../stores/map'

const stubs = {
  BottomSheet: { template: '<div data-stub="sheet"><slot /></div>' },
  List: { template: '<div data-stub="list" />' },
}

const project = mockMarkers.find(marker => marker.id === '1')!
const secondTask = project.tasks![1]
const thirdTask = project.tasks![2]
const travelMarker: Marker = {
  id: 'travel-test',
  title: 'Тестовое путешествие',
  description: '',
  coordinates: [37.6173, 55.7558],
  category: 'travel',
  date: '2026-04-11',
  city: 'Москва',
  images: [],
}

const flowStubs = {
  BottomSheet: { template: '<div data-stub="sheet"><slot /></div>' },
  List: {
    emits: ['select', 'close'],
    setup() {
      return { project, travelMarker }
    },
    template: `
      <div data-stub="list">
        <button data-test="select-project" @click="$emit('select', project)">select project</button>
        <button data-test="select-travel" @click="$emit('select', travelMarker)">select travel</button>
        <button data-test="close-list" @click="$emit('close')">close list</button>
      </div>
    `,
  },
  TaskList: {
    props: ['project', 'activeTaskIndex'],
    emits: ['back', 'close', 'select'],
    template: `
      <div data-stub="task-list">
        <span>{{ project.title }}</span>
        <span>active {{ activeTaskIndex }}</span>
        <button data-test="select-task" @click="$emit('select', project.tasks[1], 1)">select task</button>
        <button data-test="back-tasks" @click="$emit('back')">back</button>
        <button data-test="close-tasks" @click="$emit('close')">close</button>
      </div>
    `,
  },
  Description: {
    props: ['marker', 'project', 'tasks', 'taskIndex'],
    emits: ['back', 'close', 'update:taskIndex'],
    template: `
      <div data-stub="description">
        <span>{{ marker.title }}</span>
        <span v-if="project">project {{ project.title }}</span>
        <span>tasks {{ tasks.length }}</span>
        <span>task {{ taskIndex }}</span>
        <button data-test="next-description-task" @click="$emit('update:taskIndex', 2)">next task</button>
        <button data-test="back-description" @click="$emit('back')">back</button>
        <button data-test="close-description" @click="$emit('close')">close</button>
      </div>
    `,
  },
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('CardsMobile/Index', () => {
  it('shows tabs and search on the main screen', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs,
      }
    })

    expect(wrapper.text()).toContain('Проекты')
    expect(wrapper.text()).toContain('Путешествия')
    expect(wrapper.text()).toContain('Спорт')
    expect(wrapper.text()).toContain('Поиск...')
  })

  it('hides the search field when a tab is selected', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs,
      }
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Проекты'))
    await tabButton?.trigger('click')

    expect(wrapper.text()).not.toContain('Поиск...')
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(true)
  })

  it('opens search overlay from the search field', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs,
      }
    })

    const searchButton = wrapper.findAll('button').find((button) => button.text().includes('Поиск...'))
    await searchButton?.trigger('click')

    expect(wrapper.text()).toContain('Отмена')
  })

  it('does not open search when a tab is selected', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
      }
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Проекты'))
    await tabButton?.trigger('click')

    const searchButton = wrapper.findAll('button').find((button) => button.text().includes('Поиск...'))
    await searchButton?.trigger('click')

    expect(wrapper.text()).not.toContain('Отмена')
  })

  it('opens filter panel from the list', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
      },
      attachTo: document.body,
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Проекты'))
    await tabButton?.trigger('click')
    await wrapper.vm.$nextTick()

    const filterButton = Array.from(document.body.querySelectorAll('button')).find((button) => button.textContent?.includes('Фильтр'))
    await filterButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('Вид спорта')

    wrapper.unmount()
  })

  it('opens project task list and selects the first task from the map list', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: flowStubs,
      }
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Проекты'))
    await tabButton?.trigger('click')
    await wrapper.find('[data-test="select-project"]').trigger('click')

    expect(wrapper.find('[data-stub="task-list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(project.title)
    expect(store.selectedMarker?.id).toBe(project.tasks![0].id)
  })

  it('opens task description and syncs the selected task', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: flowStubs,
      }
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Проекты'))
    await tabButton?.trigger('click')
    await wrapper.find('[data-test="select-project"]').trigger('click')
    await wrapper.find('[data-test="select-task"]').trigger('click')

    expect(wrapper.find('[data-stub="description"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="task-list"]').exists()).toBe(false)
    expect(wrapper.text()).toContain(secondTask.title)
    expect(wrapper.text()).toContain('task 1')
    expect(store.selectedMarker?.id).toBe(secondTask.id)
  })

  it('opens task description with the correct active index from a map marker selection', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: flowStubs,
      }
    })

    store.selectMarker(thirdTask)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-stub="description"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="task-list"]').exists()).toBe(false)
    expect(wrapper.text()).toContain(thirdTask.title)
    expect(wrapper.text()).toContain('task 2')
  })

  it('returns from task description to task list with the active task preserved', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: flowStubs,
      }
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Проекты'))
    await tabButton?.trigger('click')
    await wrapper.find('[data-test="select-project"]').trigger('click')
    await wrapper.find('[data-test="select-task"]').trigger('click')
    await wrapper.find('[data-test="close-description"]').trigger('click')

    expect(wrapper.find('[data-stub="description"]').exists()).toBe(false)
    expect(wrapper.find('[data-stub="task-list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('active 1')

    await wrapper.find('[data-test="select-task"]').trigger('click')
    await wrapper.find('[data-test="back-description"]').trigger('click')

    expect(wrapper.find('[data-stub="description"]').exists()).toBe(false)
    expect(wrapper.find('[data-stub="task-list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('active 1')
  })

  it('syncs the selected marker when the task description slider changes', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: flowStubs,
      }
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Проекты'))
    await tabButton?.trigger('click')
    await wrapper.find('[data-test="select-project"]').trigger('click')
    await wrapper.find('[data-test="select-task"]').trigger('click')
    await wrapper.find('[data-test="next-description-task"]').trigger('click')

    expect(wrapper.text()).toContain('task 2')
    expect(store.selectedMarker?.id).toBe(thirdTask.id)
  })

  it('returns from a regular marker description to the category list', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: flowStubs,
      }
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Путешествия'))
    await tabButton?.trigger('click')
    await wrapper.find('[data-test="select-travel"]').trigger('click')

    expect(wrapper.find('[data-stub="description"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(false)
    expect(wrapper.text()).toContain(travelMarker.title)

    await wrapper.find('[data-test="close-description"]').trigger('click')

    expect(wrapper.find('[data-stub="description"]').exists()).toBe(false)
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(true)
    expect(store.category).toBe('travel')
  })

  it('closes a direct marker description opened from all state', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: flowStubs,
      }
    })

    store.selectMarker(travelMarker)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-stub="description"]').exists()).toBe(true)

    await wrapper.find('[data-test="close-description"]').trigger('click')

    expect(wrapper.find('[data-stub="description"]').exists()).toBe(false)
    expect(wrapper.find('[data-stub="list"]').exists()).toBe(false)
    expect(store.selectedMarker).toBeNull()
    expect(store.category).toBe('all')
  })

  it('returns from task list to project list and closes the sheet', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMapStore()

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: flowStubs,
      }
    })

    const tabButton = wrapper.findAll('button').find((button) => button.text().includes('Проекты'))
    await tabButton?.trigger('click')
    await wrapper.find('[data-test="select-project"]').trigger('click')
    await wrapper.find('[data-test="back-tasks"]').trigger('click')

    expect(wrapper.find('[data-stub="list"]').exists()).toBe(true)
    expect(store.selectedMarker).toBeNull()

    await wrapper.find('[data-test="select-project"]').trigger('click')
    await wrapper.find('[data-test="close-tasks"]').trigger('click')

    expect(wrapper.find('[data-stub="list"]').exists()).toBe(false)
    expect(store.category).toBe('all')
  })
})
