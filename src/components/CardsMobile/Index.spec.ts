import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import Index from './Index.vue'

const stubs = {
  BottomSheet: { template: '<div data-stub="sheet"><slot /></div>' },
  List: { template: '<div data-stub="list" />' },
}

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
})
